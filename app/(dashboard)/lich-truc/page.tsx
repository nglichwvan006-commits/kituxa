import { Trash2 } from "lucide-react";
import { DutyTaskCard } from "@/components/dashboard/duty-task-card";
import { ScheduleForm } from "@/components/forms/schedule-form";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeading } from "@/components/ui/page-heading";
import { Section } from "@/components/ui/section";
import { StatusBadge } from "@/components/ui/status-badge";
import { deleteScheduleAction } from "@/services/schedule-actions";
import { getAppContext } from "@/services/context";
import { getDutyTasks, getRoomMembers, getWeeklySchedules } from "@/services/queries";
import { getVietnamDateString } from "@/lib/utils";

const days = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

export default async function SchedulePage() {
  const ctx = await getAppContext();
  const today = getVietnamDateString();
  const [members, schedules, tasks] = await Promise.all([
    getRoomMembers(ctx.room.id),
    getWeeklySchedules(ctx.room.id),
    getDutyTasks(ctx.room.id, today)
  ]);
  const canManage = ctx.role === "admin";

  return (
    <main className="page-shell grid gap-5">
      <PageHeading title="Lịch trực" description="Lịch cố định theo tuần, ca trực hôm nay và trạng thái hoàn thành của từng bạn trong phòng." />

      {canManage ? (
        <Section title="Tạo lịch trực cố định" description="Chọn thứ trong tuần và nhiều thành viên cùng trực.">
          <ScheduleForm members={members} />
        </Section>
      ) : null}

      <Section title="Hôm nay">
        <div className="grid gap-3 lg:grid-cols-2">
          {tasks.length > 0 ? tasks.map((task) => <DutyTaskCard key={task.id} task={task} currentUserId={ctx.userId} />) : <EmptyState title="Hôm nay chưa có lịch trực" />}
        </div>
      </Section>

      <Section title="Lịch cố định theo tuần">
        {schedules.length > 0 ? (
          <div className="grid gap-3">
            {schedules.map((schedule) => (
              <article key={schedule.id} className="surface animate-in overflow-hidden rounded-lg p-4">
                <div className="-mx-4 -mt-4 mb-4 h-1 bg-brand-600" />
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-700">{days[schedule.day_of_week]}</p>
                    <h2 className="mt-1 text-base font-black text-ink">{schedule.title}</h2>
                    {schedule.note ? <p className="mt-1 text-sm text-muted">{schedule.note}</p> : null}
                  </div>
                  {canManage ? (
                    <form action={deleteScheduleAction}>
                      <input type="hidden" name="id" value={schedule.id} />
                      <button className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-50" aria-label="Xóa lịch">
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </form>
                  ) : null}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {schedule.duty_schedule_members.map((member) => (
                    <span key={member.user_id} className="rounded-full bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-700 ring-1 ring-slate-100">
                      {member.profiles?.full_name}
                    </span>
                  ))}
                  <StatusBadge type="duty" value="not_started" />
                </div>
                {canManage ? (
                  <details className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <summary className="cursor-pointer text-sm font-bold text-ink">Sửa lịch này</summary>
                    <div className="mt-3">
                      <ScheduleForm members={members} schedule={schedule} />
                    </div>
                  </details>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="Chưa có lịch cố định" description="Quản trị viên có thể tạo lịch theo thứ trong tuần." />
        )}
      </Section>
    </main>
  );
}
