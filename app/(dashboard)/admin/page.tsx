import Link from "next/link";
import { Section } from "@/components/ui/section";
import { DutyTaskCard } from "@/components/dashboard/duty-task-card";
import { StatCards } from "@/components/dashboard/stat-cards";
import { MemberTable } from "@/components/dashboard/member-table";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeading } from "@/components/ui/page-heading";
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
      <PageHeading
        title="Bảng điều khiển quản trị"
        description="Theo dõi phòng, lịch trực, điểm danh và minh chứng trong ngày với một bảng điều khiển gọn mà vẫn có vibe."
        action={<Link href="/lich-truc" className="btn-primary">Tạo lịch trực</Link>}
      />

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
              <div key={row.id} className="rounded-lg bg-white/70 px-3 py-2 text-sm shadow-sm ring-1 ring-white/80">
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
