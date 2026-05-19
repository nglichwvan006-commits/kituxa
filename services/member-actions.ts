"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { normalizeEmail } from "@/lib/utils";
import type { UserRole } from "@/types/domain";
import { assertAdmin, getAppContext } from "./context";

const memberSchema = z.object({
  fullName: z.string().trim().min(2, "Họ tên quá ngắn"),
  email: z.string().email("Email không hợp lệ").transform(normalizeEmail),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
  phone: z.string().trim().optional(),
  role: z.enum(["admin", "room_leader", "member"])
});

export async function createMemberAction(formData: FormData) {
  const ctx = await getAppContext();
  assertAdmin(ctx.role);

  const parsed = memberSchema.parse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    phone: formData.get("phone"),
    role: formData.get("role")
  });

  const service = createServiceClient();
  const { data: authUser, error: authError } = await service.auth.admin.createUser({
    email: parsed.email,
    password: parsed.password,
    email_confirm: true,
    user_metadata: { full_name: parsed.fullName }
  });

  if (authError) throw new Error(authError.message);
  const userId = authUser.user.id;

  const { error: profileError } = await service.from("profiles").upsert({
    id: userId,
    full_name: parsed.fullName,
    email: parsed.email,
    phone: parsed.phone || null,
    role: parsed.role,
    is_active: true
  });
  if (profileError) throw new Error(profileError.message);

  const { error: memberError } = await service.from("room_members").upsert(
    {
      room_id: ctx.room.id,
      user_id: userId,
      role: parsed.role,
      is_active: true
    },
    { onConflict: "room_id,user_id" }
  );
  if (memberError) throw new Error(memberError.message);

  revalidatePath("/thanh-vien-quan-ly");
  revalidatePath("/admin");
}

export async function updateMemberRoleAction(formData: FormData) {
  const ctx = await getAppContext();
  assertAdmin(ctx.role);

  const userId = String(formData.get("userId") ?? "");
  const role = String(formData.get("role") ?? "member") as UserRole;
  if (userId === ctx.userId) throw new Error("Bạn không thể tự đổi vai trò của chính mình.");
  if (!["admin", "room_leader", "member"].includes(role)) throw new Error("Vai trò không hợp lệ.");

  const service = createServiceClient();
  const { error: memberError } = await service
    .from("room_members")
    .update({ role })
    .eq("room_id", ctx.room.id)
    .eq("user_id", userId);
  if (memberError) throw new Error(memberError.message);

  const { error: profileError } = await service.from("profiles").update({ role }).eq("id", userId);
  if (profileError) throw new Error(profileError.message);

  revalidatePath("/thanh-vien-quan-ly");
  revalidatePath("/admin");
}

export async function deleteMemberAction(formData: FormData) {
  const ctx = await getAppContext();
  assertAdmin(ctx.role);

  const userId = String(formData.get("userId") ?? "");
  if (userId === ctx.userId) throw new Error("Bạn không thể xóa chính mình khỏi phòng.");

  const service = createServiceClient();
  const { error } = await service
    .from("room_members")
    .update({ is_active: false })
    .eq("room_id", ctx.room.id)
    .eq("user_id", userId);
  if (error) throw new Error(error.message);

  await service.from("profiles").update({ is_active: false }).eq("id", userId);
  revalidatePath("/thanh-vien-quan-ly");
  revalidatePath("/admin");
}
