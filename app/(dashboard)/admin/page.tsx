import Link from "next/link";
import { Section } from "@/components/ui/section";
import { DutyTaskCard } from "@/components/dashboard/duty-task-card";
import { StatCards } from "@/components/dashboard/stat-cards";
import { MemberTable } from "@/components/dashboard/member-table";
import { EmptyState } from "@/components/ui/empty-state";
import { getAppContext } from "@/services/context";
import { getAttendanceRows, getDutyTasks, getRecentProofs, getRoomMembers } from "@/services/queries";
import { getVietnamDateString } from "@/lib/utils";

export default async function AdminPage() {
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-ink">Bảng điều khiển quản trị</h1>
          <p className="mt-1 text-sm text-muted">Theo dõi phòng, lịch trực, điểm danh và minh chứng trong ngày.</p>
        </div>
        <Link href="/lich-truc" className="btn-primary">Tạo lịch trực</Link>
      </div>

      <StatCards memberCount={members.length} taskCount={tasks.length} completedCount={completed} proofCount={proofData.count} />

      <Section title="Lịch trực hôm nay" description="Task được tự tạo từ lịch cố định theo ngày hiện tại.">
        <div className="grid gap-3 lg:grid-cols-2">
          {tasks.length > 0 ? tasks.map((task) => <DutyTaskCard key={task.id} task={task} currentUserId={ctx.userId} />) : <EmptyState title="Hôm nay chưa có lịch trực" />}
        </div>
      </Section>

      <Section title="Thành viên trong phòng" action={<Link href="/thanh-vien-quan-ly" className="btn-secondary">Quản lý</Link>}>
        <MemberTable members={members.slice(0, 8)} canManage currentUserId={ctx.userId} />
      </Section>

      <Section title="Điểm danh hôm nay">
        {attendance.length > 0 ? (
          <div className="grid gap-2">
            {attendance.map((row) => (
              <div key={row.id} className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
                <strong>{row.profiles?.full_name}</strong> · {row.status === "present" ? "Có mặt" : `Vắng: ${row.absent_address}`}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="Chưa có điểm danh hôm nay" />
        )}
      </Section>
    </main>
  );
}
