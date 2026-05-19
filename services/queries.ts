import { unstable_cache } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";
import { getVietnamDateString, getVietnamDayOfWeek } from "@/lib/utils";
import type { AttendanceRow, DutyProof, DutyTask, NotificationRow, RoomMember, WeeklySchedule } from "@/types/domain";

export async function ensureTasksForDate(roomId: string, date = getVietnamDateString()) {
  const service = createServiceClient();
  const dayOfWeek = getVietnamDayOfWeek(new Date(`${date}T12:00:00+07:00`));

  const { data: schedules, error } = await service
    .from("duty_schedules")
    .select("id,room_id,day_of_week,title,note,is_active,duty_schedule_members(user_id)")
    .eq("room_id", roomId)
    .eq("day_of_week", dayOfWeek)
    .eq("is_active", true);

  if (error) throw new Error(error.message);

  const scheduleRows = (schedules ?? []) as unknown as Array<{
    id: string;
    title: string;
    note: string | null;
    duty_schedule_members: Array<{ user_id: string }>;
  }>;

  for (const schedule of scheduleRows) {
    const { data: existing } = await service
      .from("duty_tasks")
      .select("id")
      .eq("room_id", roomId)
      .eq("schedule_id", schedule.id)
      .eq("duty_date", date)
      .maybeSingle();

    if (existing) continue;

    const { data: task, error: taskError } = await service
      .from("duty_tasks")
      .insert({
        room_id: roomId,
        schedule_id: schedule.id,
        duty_date: date,
        title: schedule.title,
        note: schedule.note,
        status: "not_started"
      })
      .select("id")
      .single();

    if (taskError) throw new Error(taskError.message);
    const taskRow = task as unknown as { id: string };

    const members = (schedule.duty_schedule_members ?? []).map((item: { user_id: string }) => ({
      task_id: taskRow.id,
      user_id: item.user_id,
      status: "not_started" as const
    }));

    if (members.length > 0) {
      const { error: memberError } = await service.from("duty_task_members").insert(members);
      if (memberError) throw new Error(memberError.message);
    }
  }
}

export const getWeeklySchedules = unstable_cache(
  async (roomId: string) => {
    const service = createServiceClient();
    const { data, error } = await service
      .from("duty_schedules")
      .select("id,day_of_week,title,note,is_active,duty_schedule_members(user_id,profiles:user_id(id,full_name,email))")
      .eq("room_id", roomId)
      .eq("is_active", true)
      .order("day_of_week", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as WeeklySchedule[];
  },
  ["weekly-schedules"],
  { revalidate: 120, tags: ["weekly-schedules"] }
);

export async function getRoomMembers(roomId: string) {
  const service = createServiceClient();
  const { data, error } = await service
    .from("room_members")
    .select("id,room_id,user_id,role,is_active,profiles:user_id(id,full_name,email,role,phone,is_active)")
    .eq("room_id", roomId)
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as RoomMember[];
}

export async function getDutyTasks(roomId: string, date = getVietnamDateString()) {
  await ensureTasksForDate(roomId, date);
  const service = createServiceClient();
  const { data, error } = await service
    .from("duty_tasks")
    .select("id,room_id,schedule_id,duty_date,title,note,status,duty_task_members(id,task_id,user_id,status,completed_at,profiles:user_id(id,full_name,email))")
    .eq("room_id", roomId)
    .eq("duty_date", date)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as DutyTask[];
}

export async function getAttendanceRows(roomId: string, date = getVietnamDateString()) {
  const service = createServiceClient();
  const { data, error } = await service
    .from("attendance")
    .select("id,room_id,user_id,attendance_date,status,absent_address,updated_at,profiles:user_id(id,full_name,email)")
    .eq("room_id", roomId)
    .eq("attendance_date", date)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as AttendanceRow[];
}

export async function getRecentProofs(roomId: string, page = 0, pageSize = 18) {
  const from = page * pageSize;
  const to = from + pageSize - 1;
  const service = createServiceClient();
  const { data, error, count } = await service
    .from("duty_proofs")
    .select("id,room_id,duty_task_id,user_id,storage_path,public_url,mime_type,file_size,created_at,profiles:user_id(id,full_name),duty_tasks:duty_task_id(id,title,duty_date,status)", { count: "exact" })
    .eq("room_id", roomId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);
  const proofs = (data ?? []) as unknown as DutyProof[];
  const signedProofs = await Promise.all(
    proofs.map(async (proof) => {
      const { data: signed } = await service.storage.from("duty-proofs").createSignedUrl(proof.storage_path, 60 * 60);
      return {
        ...proof,
        public_url: signed?.signedUrl ?? proof.public_url
      };
    })
  );
  return { proofs: signedProofs, count: count ?? 0 };
}

export async function getNotifications(roomId: string, userId: string) {
  const service = createServiceClient();
  const { data, error } = await service
    .from("notifications")
    .select("id,room_id,user_id,actor_id,type,title,message,href,read_at,created_at")
    .eq("room_id", roomId)
    .or(`user_id.is.null,user_id.eq.${userId}`)
    .order("created_at", { ascending: false })
    .limit(40);

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as NotificationRow[];
}
