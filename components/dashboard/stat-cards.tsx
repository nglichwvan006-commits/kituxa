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
    { label: "Thành viên", value: memberCount, icon: Users, color: "text-[#0277BD] bg-[#E1F5FE]", line: "bg-[#4FC3F7]" },
    { label: "Ca hôm nay", value: taskCount, icon: CalendarCheck2, color: "text-[#558B2F] bg-[#F1F8E9]", line: "bg-[#9CCC65]" },
    { label: "Đã hoàn thành", value: completedCount, icon: UserCheck, color: "text-[#2E7D32] bg-[#E8F5E9]", line: "bg-[#66BB6A]" },
    { label: "Ảnh minh chứng", value: proofCount, icon: Camera, color: "text-[#F57C00] bg-[#FFF8E1]", line: "bg-[#FFB74D]" }
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="surface animate-in overflow-hidden rounded-[24px] p-4">
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
