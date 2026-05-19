import { Section } from "@/components/ui/section";
import { DutyTaskCard } from "@/components/dashboard/duty-task-card";
import { StatCards } from "@/components/dashboard/stat-cards";
import { EmptyState } from "@/components/ui/empty-state";
import { getAppContext } from "@/services/context";
import { getAttendanceRows, getDutyTasks, getRecentProofs, getRoomMembers } from "@/services/queries";
import { getVietnamDateString } from "@/lib/utils";

export default async function LeaderPage() {
  const ctx = await getAppContext();
  const today = getVietnamDateString();
  const [members, tasks, attendance, proofData] = await Promise.all([
    getRoomMembers(ctx.room.id),
    getDutyTasks(ctx.room.id, today),
    getAttendanceRows(ctx.room.id, today),
    getRecentProofs(ctx.room.id, 0, 6)
  ]);
  const completed = tasks.reduce((sum, task) => sum + task.duty_task_members.filter((member) => member.status === "completed").length, 0);

  return (
    <main className="page-shell grid gap-5">
      <div>
        <h1 className="text-2xl font-black text-ink">Panel trưởng phòng</h1>
        <p className="mt-1 text-sm text-muted">Nắm nhanh ai đã trực, ai chưa trực và tình hình điểm danh.</p>
      </div>
      <StatCards memberCount={members.length} taskCount={tasks.length} completedCount={completed} proofCount={proofData.count} />
      <Section title="Lịch trực hôm nay">
        <div className="grid gap-3 lg:grid-cols-2">
          {tasks.length > 0 ? tasks.map((task) => <DutyTaskCard key={task.id} task={task} currentUserId={ctx.userId} />) : <EmptyState title="Hôm nay chưa có lịch trực" />}
        </div>
      </Section>
      <Section title="Thành viên vắng hôm nay">
        {attendance.filter((row) => row.status === "absent").length > 0 ? (
          <div className="grid gap-2">
            {attendance.filter((row) => row.status === "absent").map((row) => (
              <div key={row.id} className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">
                <strong>{row.profiles?.full_name}</strong> · {row.absent_address}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="Chưa có thành viên báo vắng" />
        )}
      </Section>
    </main>
  );
}
