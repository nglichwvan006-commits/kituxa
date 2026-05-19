"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { getVietnamDateString } from "@/lib/utils";
import { getAppContext } from "./context";

export type AttendanceFormState = {
  ok: boolean;
  message: string;
};

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

export async function saveAttendanceAction(_state: AttendanceFormState, formData: FormData): Promise<AttendanceFormState> {
  try {
    const ctx = await getAppContext();
    const parsed = attendanceSchema.safeParse({
      date: formData.get("date") || getVietnamDateString(),
      status: formData.get("status"),
      absentAddress: formData.get("absentAddress")
    });

    if (!parsed.success) {
      return {
        ok: false,
        message: parsed.error.issues[0]?.message ?? "Thông tin điểm danh chưa hợp lệ."
      };
    }

    const service = createServiceClient();
    const { error } = await service.from("attendance").upsert(
      {
        room_id: ctx.room.id,
        user_id: ctx.userId,
        attendance_date: parsed.data.date,
        status: parsed.data.status,
        absent_address: parsed.data.status === "absent" ? parsed.data.absentAddress : null
      },
      { onConflict: "room_id,user_id,attendance_date" }
    );

    if (error) {
      return {
        ok: false,
        message: `Không lưu được điểm danh: ${error.message}`
      };
    }

    await service.from("notifications").insert({
      room_id: ctx.room.id,
      actor_id: ctx.userId,
      type: "attendance_updated",
      title: "Cập nhật điểm danh",
      message: `${ctx.profile.full_name} đã điểm danh ${parsed.data.status === "present" ? "có mặt" : "vắng"}.`,
      href: "/diem-danh"
    });

    revalidatePath("/diem-danh");
    return {
      ok: true,
      message: parsed.data.status === "present" ? "Đã lưu trạng thái có mặt." : "Đã lưu trạng thái vắng."
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Có lỗi khi điểm danh."
    };
  }
}
