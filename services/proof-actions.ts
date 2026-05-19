"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { safeFileName } from "@/lib/utils";
import { getAppContext } from "./context";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 6;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const completeSchema = z.object({
  taskId: z.string().uuid()
});

export async function completeDutyWithProofsAction(formData: FormData) {
  const ctx = await getAppContext();
  const parsed = completeSchema.parse({ taskId: formData.get("taskId") });
  const files = formData.getAll("proofs").filter((item): item is File => item instanceof File && item.size > 0);

  if (files.length === 0) throw new Error("Bạn cần gửi ít nhất một ảnh minh chứng.");
  if (files.length > MAX_FILES) throw new Error(`Chỉ được gửi tối đa ${MAX_FILES} ảnh một lần.`);

  for (const file of files) {
    if (!ALLOWED_TYPES.has(file.type)) throw new Error("Chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP.");
    if (file.size > MAX_FILE_SIZE) throw new Error("Mỗi ảnh chỉ được tối đa 5MB.");
  }

  const service = createServiceClient();
  const { data: task, error: taskError } = await service
    .from("duty_tasks")
    .select("id,room_id,title,duty_date,duty_task_members(id,user_id,status)")
    .eq("id", parsed.taskId)
    .eq("room_id", ctx.room.id)
    .single();

  const taskRow = task as unknown as {
    id: string;
    room_id: string;
    title: string;
    duty_date: string;
    duty_task_members: Array<{ id: string; user_id: string; status: string }>;
  } | null;

  if (taskError || !taskRow) throw new Error("Không tìm thấy lịch trực.");
  const assignment = taskRow.duty_task_members.find((item) => item.user_id === ctx.userId);
  if (!assignment) throw new Error("Bạn không nằm trong ca trực này.");

  const proofRows = [];
  for (const file of files) {
    const extension = safeFileName(file.name).split(".").pop() || "jpg";
    const path = `${ctx.room.id}/${taskRow.id}/${ctx.userId}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await service.storage.from("duty-proofs").upload(path, file, {
      contentType: file.type,
      upsert: false
    });
    if (uploadError) throw new Error(uploadError.message);

    proofRows.push({
      room_id: ctx.room.id,
      duty_task_id: taskRow.id,
      user_id: ctx.userId,
      storage_path: path,
      public_url: path,
      mime_type: file.type,
      file_size: file.size
    });
  }

  const { error: proofError } = await service.from("duty_proofs").insert(proofRows);
  if (proofError) throw new Error(proofError.message);

  const { error: updateMemberError } = await service
    .from("duty_task_members")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", assignment.id);
  if (updateMemberError) throw new Error(updateMemberError.message);

  const { data: remaining, error: remainingError } = await service
    .from("duty_task_members")
    .select("id")
    .eq("task_id", taskRow.id)
    .neq("status", "completed");
  if (remainingError) throw new Error(remainingError.message);

  await service
    .from("duty_tasks")
    .update({ status: remaining && remaining.length > 0 ? "waiting_proof" : "completed" })
    .eq("id", taskRow.id);

  await service.from("notifications").insert([
    {
      room_id: ctx.room.id,
      actor_id: ctx.userId,
      type: "proof_uploaded",
      title: "Minh chứng mới",
      message: `${ctx.profile.full_name} đã gửi ${proofRows.length} ảnh minh chứng cho ${taskRow.title}.`,
      href: "/minh-chung"
    },
    {
      room_id: ctx.room.id,
      actor_id: ctx.userId,
      type: "duty_completed",
      title: "Hoàn thành trực nhật",
      message: `${ctx.profile.full_name} đã hoàn thành ${taskRow.title}.`,
      href: "/lich-truc"
    }
  ]);

  revalidatePath("/lich-truc");
  revalidatePath("/minh-chung");
  revalidatePath("/admin");
  revalidatePath("/truong-phong");
  revalidatePath("/thanh-vien");
}

export async function deleteOwnProofAction(formData: FormData) {
  const ctx = await getAppContext();
  const id = String(formData.get("id") ?? "");
  const service = createServiceClient();

  const { data: proof, error } = await service
    .from("duty_proofs")
    .select("id,room_id,user_id,storage_path,created_at")
    .eq("id", id)
    .eq("room_id", ctx.room.id)
    .single();
  if (error || !proof) throw new Error("Không tìm thấy minh chứng.");
  if (proof.user_id !== ctx.userId && ctx.role !== "admin") throw new Error("Bạn chỉ được xóa minh chứng của chính mình.");

  const ageMs = Date.now() - new Date(proof.created_at).getTime();
  if (ctx.role !== "admin" && ageMs > 24 * 60 * 60 * 1000) {
    throw new Error("Chỉ được xóa minh chứng trong vòng 24 giờ.");
  }

  await service.storage.from("duty-proofs").remove([proof.storage_path]);
  const { error: deleteError } = await service.from("duty_proofs").delete().eq("id", id);
  if (deleteError) throw new Error(deleteError.message);

  revalidatePath("/minh-chung");
}
