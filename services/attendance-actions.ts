"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { getVietnamDateString } from "@/lib/utils";
import { getAppContext } from "./context";

const attendanceSchema = z
  .object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    status: z.enum(["present", "absent"]),
    absentAddress: z.string().trim().optional()
  })
  .refine((value) => value.status === "present" || !!value.absentAddress, {
    message: "Khi chọn vắng, bạn cần nhập địa chỉ vắng.",
    path: ["absentAddress"]
  });

export async function saveAttendanceAction(formData: FormData) {
  const ctx = await getAppContext();
  const parsed = attendanceSchema.parse({
    date: formData.get("date") || getVietnamDateString(),
    status: formData.get("status"),
    absentAddress: formData.get("absentAddress")
  });

  const service = createServiceClient();
  const { error } = await service.from("attendance").upsert(
    {
      room_id: ctx.room.id,
      user_id: ctx.userId,
      attendance_date: parsed.date,
      status: parsed.status,
      absent_address: parsed.status === "absent" ? parsed.absentAddress : null
    },
    { onConflict: "room_id,user_id,attendance_date" }
  );

  if (error) throw new Error(error.message);

  await service.from("notifications").insert({
    room_id: ctx.room.id,
    actor_id: ctx.userId,
    type: "attendance_updated",
    title: "Cập nhật điểm danh",
    message: `${ctx.profile.full_name} đã điểm danh ${parsed.status === "present" ? "có mặt" : "vắng"}.`,
    href: "/diem-danh"
  });

  revalidatePath("/diem-danh");
}
