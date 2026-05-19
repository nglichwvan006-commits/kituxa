import { cn, attendanceStatusLabel, dutyStatusLabel, roleLabel } from "@/lib/utils";
import type { AttendanceStatus, DutyStatus, UserRole } from "@/types/domain";

type Props =
  | { type: "role"; value: UserRole }
  | { type: "duty"; value: DutyStatus }
  | { type: "attendance"; value: AttendanceStatus };

export function StatusBadge(props: Props) {
  const palette =
    props.type === "role"
      ? {
          admin: "bg-rose-50 text-rose-700 ring-rose-200",
          room_leader: "bg-amber-50 text-amber-700 ring-amber-200",
          member: "bg-sky-50 text-sky-700 ring-sky-200"
        }[props.value]
      : props.type === "attendance"
        ? {
            present: "bg-emerald-50 text-emerald-700 ring-emerald-200",
            absent: "bg-rose-50 text-rose-700 ring-rose-200"
          }[props.value]
        : {
            not_started: "bg-slate-100 text-slate-700 ring-slate-200",
            waiting_proof: "bg-amber-50 text-amber-700 ring-amber-200",
            completed: "bg-emerald-50 text-emerald-700 ring-emerald-200"
          }[props.value];

  const label =
    props.type === "role"
      ? roleLabel(props.value)
      : props.type === "attendance"
        ? attendanceStatusLabel(props.value)
        : dutyStatusLabel(props.value);

  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1", palette)}>
      {label}
    </span>
  );
}
