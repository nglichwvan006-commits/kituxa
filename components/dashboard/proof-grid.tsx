import Image from "next/image";
import { Trash2 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { deleteOwnProofAction } from "@/services/proof-actions";
import type { DutyProof, UserRole } from "@/types/domain";
import { formatDateTimeVi } from "@/lib/utils";

export function ProofGrid({ proofs, currentUserId, role }: { proofs: DutyProof[]; currentUserId: string; role: UserRole }) {
  if (proofs.length === 0) {
    return <EmptyState title="Chưa có ảnh minh chứng" description="Ảnh sẽ xuất hiện tại đây sau khi thành viên hoàn thành ca trực." />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {proofs.map((proof) => {
        const canDelete = proof.user_id === currentUserId || role === "admin";
        return (
          <article key={proof.id} className="surface animate-in overflow-hidden rounded-lg">
            <div className="relative aspect-[4/3] bg-gradient-to-br from-brand-50 to-rose-50">
              <Image src={proof.public_url} alt={`Minh chứng của ${proof.profiles?.full_name ?? "thành viên"}`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" loading="lazy" />
            </div>
            <div className="p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-ink">{proof.profiles?.full_name ?? "Thành viên"}</p>
                  <p className="mt-1 text-xs text-muted">{proof.duty_tasks?.title} · {formatDateTimeVi(proof.created_at)}</p>
                </div>
                {canDelete ? (
                  <form action={deleteOwnProofAction}>
                    <input type="hidden" name="id" value={proof.id} />
                    <button className="rounded-lg p-2 text-rose-600 hover:bg-rose-50" aria-label="Xóa ảnh">
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </form>
                ) : null}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
