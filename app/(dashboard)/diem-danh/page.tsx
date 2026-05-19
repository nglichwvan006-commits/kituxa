import { AttendanceForm } from "@/components/forms/attendance-form";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeading } from "@/components/ui/page-heading";
import { Section } from "@/components/ui/section";
import { StatusBadge } from "@/components/ui/status-badge";
import { getAppContext } from "@/services/context";
import { getAttendanceRows } from "@/services/queries";
import { formatDateTimeVi, getVietnamDateString } from "@/lib/utils";

export default async function AttendancePage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const ctx = await getAppContext();
  const params = await searchParams;
  const date = params.date || getVietnamDateString();
  const rows = await getAttendanceRows(ctx.room.id, date);
  const canViewAll = ctx.role === "admin" || ctx.role === "room_leader";

  return (
    <main className="page-shell grid gap-5">
      <PageHeading title="Điểm danh" description="Cập nhật trạng thái mỗi ngày. Nếu vắng, hệ thống sẽ bắt buộc nhập địa chỉ rõ ràng." />
      <Section title="Điểm danh của bạn">
        <AttendanceForm today={getVietnamDateString()} />
      </Section>
      <Section title={canViewAll ? "Danh sách điểm danh" : "Điểm danh hôm nay"}>
        <form className="mb-4 flex flex-col gap-2 sm:flex-row">
          <input className="input sm:max-w-52" type="date" name="date" defaultValue={date} />
          <button className="btn-secondary">Lọc ngày</button>
        </form>
        {rows.length > 0 ? (
          <div className="grid gap-2">
            {rows.filter((row) => canViewAll || row.user_id === ctx.userId).map((row) => (
              <div key={row.id} className="flex flex-col gap-2 rounded-lg border border-white/70 bg-white/75 px-3 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold text-ink">{row.profiles?.full_name}</p>
                  <p className="text-xs text-muted">{formatDateTimeVi(row.updated_at)} {row.absent_address ? `· ${row.absent_address}` : ""}</p>
                </div>
                <StatusBadge type="attendance" value={row.status} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="Chưa có điểm danh trong ngày này" />
        )}
      </Section>
    </main>
  );
}
