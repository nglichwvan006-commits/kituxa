import { CalendarPlus } from "lucide-react";
import { saveScheduleAction } from "@/services/schedule-actions";
import type { RoomMember, WeeklySchedule } from "@/types/domain";

const days = [
  "Chủ nhật",
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7"
];

export function ScheduleForm({ members, schedule }: { members: RoomMember[]; schedule?: WeeklySchedule }) {
  const selectedMembers = new Set(schedule?.duty_schedule_members.map((member) => member.user_id) ?? []);

  return (
    <form action={saveScheduleAction} className="grid gap-3">
      <input type="hidden" name="id" value={schedule?.id ?? ""} />
      <div className="grid gap-3 md:grid-cols-2">
        <input className="input" name="title" placeholder="Tên ca trực, ví dụ: Vệ sinh phòng" defaultValue={schedule?.title ?? ""} required />
        <select className="input" name="dayOfWeek" defaultValue={String(schedule?.day_of_week ?? 1)}>
          {days.map((day, index) => (
            <option key={day} value={index}>
              {day}
            </option>
          ))}
        </select>
      </div>
      <textarea className="input min-h-20" name="note" placeholder="Ghi chú khu vực cần trực" defaultValue={schedule?.note ?? ""} />
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <label key={member.user_id} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
            <input name="memberIds" type="checkbox" value={member.user_id} defaultChecked={selectedMembers.has(member.user_id)} className="h-4 w-4 accent-brand-600" />
            <span>{member.profiles?.full_name}</span>
          </label>
        ))}
      </div>
      <button className="btn-primary w-full sm:w-fit">
        <CalendarPlus className="h-4 w-4" aria-hidden />
        {schedule ? "Lưu lịch trực" : "Tạo lịch cố định"}
      </button>
    </form>
  );
}
