import { CalendarCheck2, Camera, UserCheck, Users } from "lucide-react";

export function StatCards({
  memberCount,
  taskCount,
  completedCount,
  proofCount
}: {
  memberCount: number;
  taskCount: number;
  completedCount: number;
  proofCount: number;
}) {
  const items = [
    { label: "Thành viên", value: memberCount, icon: Users, color: "text-sky-600 bg-sky-50" },
    { label: "Ca hôm nay", value: taskCount, icon: CalendarCheck2, color: "text-brand-700 bg-brand-50" },
    { label: "Đã hoàn thành", value: completedCount, icon: UserCheck, color: "text-emerald-700 bg-emerald-50" },
    { label: "Ảnh minh chứng", value: proofCount, icon: Camera, color: "text-rose-700 bg-rose-50" }
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="surface rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-muted">{item.label}</p>
              <span className={`rounded-lg p-2 ${item.color}`}>
                <Icon className="h-4 w-4" aria-hidden />
              </span>
            </div>
            <p className="mt-3 text-3xl font-black text-ink">{item.value}</p>
          </div>
        );
      })}
    </div>
  );
}
