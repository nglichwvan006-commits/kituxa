import Link from "next/link";
import { Section } from "@/components/ui/section";
import { DutyTaskCard } from "@/components/dashboard/duty-task-card";
import { AttendanceForm } from "@/components/forms/attendance-form";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeading } from "@/components/ui/page-heading";
import { getAppContext } from "@/services/context";
import { getDutyTasks } from "@/services/queries";
import { getVietnamDateString } from "@/lib/utils";

export default async function MemberPage() {
  const ctx = await getAppContext();
  const today = getVietnamDateString();
  const tasks = await getDutyTasks(ctx.room.id, today);
  const myTasks = tasks.filter((task) => task.duty_task_members.some((member) => member.user_id === ctx.userId));

  return (
    <main className="page-shell grid gap-5">
      <PageHeading title="Trang cá nhân" description="Xem lịch trực, điểm danh và gửi minh chứng sau khi hoàn thành ca của bạn." />
      <Section title="Điểm danh hôm nay">
        <AttendanceForm today={today} />
      </Section>
      <Section title="Ca trực của bạn" action={<Link href="/lich-truc" className="btn-secondary">Xem cả phòng</Link>}>
        <div className="grid gap-3 lg:grid-cols-2">
          {myTasks.length > 0 ? myTasks.map((task) => <DutyTaskCard key={task.id} task={task} currentUserId={ctx.userId} />) : <EmptyState title="Hôm nay bạn không có ca trực" />}
        </div>
      </Section>
    </main>
  );
}
