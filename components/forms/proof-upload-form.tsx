import { Upload } from "lucide-react";
import { completeDutyWithProofsAction } from "@/services/proof-actions";

export function ProofUploadForm({ taskId, disabled }: { taskId: string; disabled?: boolean }) {
  return (
    <form action={completeDutyWithProofsAction} className="mt-3 rounded-lg border border-white/70 bg-white/70 p-3 shadow-sm">
      <input type="hidden" name="taskId" value={taskId} />
      <label className="block text-sm font-semibold text-ink" htmlFor={`proofs-${taskId}`}>
        Ảnh minh chứng
      </label>
      <input
        id={`proofs-${taskId}`}
        name="proofs"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        required
        disabled={disabled}
        className="mt-2 block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-semibold file:text-brand-700"
      />
      <p className="mt-2 text-xs text-muted">Tối đa 6 ảnh, mỗi ảnh 5MB. Hỗ trợ JPG, PNG, WEBP.</p>
      <button className="btn-primary mt-3 w-full sm:w-auto" disabled={disabled}>
        <Upload className="h-4 w-4" aria-hidden />
        Gửi ảnh và hoàn thành
      </button>
    </form>
  );
}
