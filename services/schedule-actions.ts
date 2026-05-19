"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { assertAdmin, getAppContext } from "./context";

const scheduleSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  title: z.string().trim().min(2, "Tên lịch quá ngắn"),
  dayOfWeek: z.coerce.number().int().min(0).max(6),
  note: z.string().trim().optional(),
  memberIds: z.array(z.string().uuid()).min(1, "Chọn ít nhất một thành viên")
});

export async function saveScheduleAction(formData: FormData) {
  const ctx = await getAppContext();
  assertAdmin(ctx.role);

  const parsed = scheduleSchema.parse({
    id: formData.get("id") || "",
    title: formData.get("title"),
    dayOfWeek: formData.get("dayOfWeek"),
    note: formData.get("note"),
    memberIds: formData.getAll("memberIds")
  });

  const service = createServiceClient();
  let scheduleId = parsed.id || "";

  if (scheduleId) {
    const { error } = await service
      .from("duty_schedules")
      .update({
        title: parsed.title,
        day_of_week: parsed.dayOfWeek,
        note: parsed.note || null,
        is_active: true
      })
      .eq("id", scheduleId)
      .eq("room_id", ctx.room.id);
    if (error) throw new Error(error.message);
    await service.from("duty_schedule_members").delete().eq("schedule_id", scheduleId);
  } else {
    const { data, error } = await service
      .from("duty_schedules")
      .insert({
        room_id: ctx.room.id,
        title: parsed.title,
        day_of_week: parsed.dayOfWeek,
        note: parsed.note || null
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    scheduleId = data.id;
  }

  const rows = parsed.memberIds.map((userId) => ({ schedule_id: scheduleId, user_id: userId }));
  const { error: memberError } = await service.from("duty_schedule_members").insert(rows);
  if (memberError) throw new Error(memberError.message);

  revalidateTag("weekly-schedules");
  revalidatePath("/lich-truc");
  revalidatePath("/admin");
}

export async function deleteScheduleAction(formData: FormData) {
  const ctx = await getAppContext();
  assertAdmin(ctx.role);
  const id = String(formData.get("id") ?? "");

  const service = createServiceClient();
  const { error } = await service
    .from("duty_schedules")
    .update({ is_active: false })
    .eq("id", id)
    .eq("room_id", ctx.room.id);

  if (error) throw new Error(error.message);
  revalidateTag("weekly-schedules");
  revalidatePath("/lich-truc");
  revalidatePath("/admin");
}
