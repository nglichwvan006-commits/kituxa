export type UserRole = "admin" | "room_leader" | "member";
export type AttendanceStatus = "present" | "absent";
export type DutyStatus = "not_started" | "waiting_proof" | "completed";
export type NotificationType = "duty_reminder" | "duty_completed" | "proof_uploaded" | "attendance_updated" | "system";

export type Room = {
  id: string;
  name: string;
  code: string;
};

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  phone: string | null;
  is_active: boolean;
};

export type RoomMember = {
  id: string;
  room_id: string;
  user_id: string;
  role: UserRole;
  is_active: boolean;
  profiles: Profile | null;
};

export type DutyTaskMember = {
  id: string;
  task_id: string;
  user_id: string;
  status: DutyStatus;
  completed_at: string | null;
  profiles: Pick<Profile, "id" | "full_name" | "email"> | null;
};

export type DutyTask = {
  id: string;
  room_id: string;
  schedule_id: string | null;
  duty_date: string;
  title: string;
  note: string | null;
  status: DutyStatus;
  duty_task_members: DutyTaskMember[];
};

export type DutyProof = {
  id: string;
  room_id: string;
  duty_task_id: string;
  user_id: string;
  storage_path: string;
  public_url: string;
  mime_type: string;
  file_size: number;
  created_at: string;
  profiles: Pick<Profile, "id" | "full_name"> | null;
  duty_tasks: Pick<DutyTask, "id" | "title" | "duty_date" | "status"> | null;
};

export type AttendanceRow = {
  id: string;
  room_id: string;
  user_id: string;
  attendance_date: string;
  status: AttendanceStatus;
  absent_address: string | null;
  updated_at: string;
  profiles: Pick<Profile, "id" | "full_name" | "email"> | null;
};

export type NotificationRow = {
  id: string;
  room_id: string;
  user_id: string | null;
  actor_id: string | null;
  type: NotificationType;
  title: string;
  message: string;
  href: string | null;
  read_at: string | null;
  created_at: string;
};

export type WeeklySchedule = {
  id: string;
  day_of_week: number;
  title: string;
  note: string | null;
  is_active: boolean;
  duty_schedule_members: Array<{
    user_id: string;
    profiles: Pick<Profile, "id" | "full_name" | "email"> | null;
  }>;
};
