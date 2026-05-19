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
    { label: "Thành viên", value: memberCount, icon: Users, color: "text-sky-700 bg-sky-50", line: "bg-sky-500" },
    { label: "Ca hôm nay", value: taskCount, icon: CalendarCheck2, color: "text-brand-700 bg-brand-50", line: "bg-brand-600" },
    { label: "Đã hoàn thành", value: completedCount, icon: UserCheck, color: "text-emerald-700 bg-emerald-50", line: "bg-emerald-600" },
    { label: "Ảnh minh chứng", value: proofCount, icon: Camera, color: "text-indigo-700 bg-indigo-50", line: "bg-indigo-600" }
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="surface animate-in overflow-hidden rounded-lg p-4">
            <div className={`-mx-4 -mt-4 mb-4 h-1 ${item.line}`} />
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-muted">{item.label}</p>
              <span className={`rounded-lg p-2 ${item.color}`}>
                <Icon className="h-4 w-4" aria-hidden />
              </span>
            </div>
            <p className="mt-3 text-4xl font-black tracking-tight text-ink">{item.value}</p>
          </div>
        );
      })}
    </div>
  );
}
