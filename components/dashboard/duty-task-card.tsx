import { CheckCircle2, Clock } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { ProofUploadForm } from "@/components/forms/proof-upload-form";
import type { DutyTask } from "@/types/domain";
import { formatDateVi } from "@/lib/utils";

export function DutyTaskCard({ task, currentUserId }: { task: DutyTask; currentUserId: string }) {
  const myAssignment = task.duty_task_members.find((member) => member.user_id === currentUserId);
  const canComplete = !!myAssignment && myAssignment.status !== "completed";
  const tone =
    task.status === "completed"
      ? "from-[#F1F8E9] to-[#DCEDC8] border-[#C5E1A5]"
      : task.status === "waiting_proof"
        ? "from-[#FFFDE7] to-[#FFF9C4] border-[#FFF59D]"
        : "from-[#E3F2FD] to-[#E1F5FE] border-[#B3E5FC]";

  return (
    <article className={`animate-in overflow-hidden rounded-[28px] border-2 bg-gradient-to-br ${tone} p-5 shadow-sm`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">{formatDateVi(task.duty_date)}</p>
          <h3 className="mt-1 text-base font-bold text-ink">{task.title}</h3>
          {task.note ? <p className="mt-1 text-sm text-muted">{task.note}</p> : null}
        </div>
        <StatusBadge type="duty" value={task.status} />
      </div>

      <div className="mt-4 grid gap-2">
        {task.duty_task_members.map((member) => (
          <div key={member.id} className="flex items-center justify-between rounded-2xl bg-white/70 px-3 py-2 shadow-sm">
            <span className="text-sm font-semibold text-ink">{member.profiles?.full_name ?? "Thành viên"}</span>
            <span className="flex items-center gap-2 text-xs text-muted">
              {member.status === "completed" ? <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden /> : <Clock className="h-4 w-4 text-amber-600" aria-hidden />}
              <StatusBadge type="duty" value={member.status} />
            </span>
          </div>
        ))}
      </div>

      {canComplete ? <ProofUploadForm taskId={task.id} /> : null}
    </article>
  );
}
