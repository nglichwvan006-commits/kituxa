import { ProofGrid } from "@/components/dashboard/proof-grid";
import { Section } from "@/components/ui/section";
import { getAppContext } from "@/services/context";
import { getRecentProofs } from "@/services/queries";

export default async function ProofsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const ctx = await getAppContext();
  const params = await searchParams;
  const page = Number(params.page ?? 0);
  const { proofs, count } = await getRecentProofs(ctx.room.id, Number.isFinite(page) ? page : 0, 18);

  return (
    <main className="page-shell grid gap-5">
      <div>
        <h1 className="text-2xl font-black text-ink">Nhật ký trực nhật</h1>
        <p className="mt-1 text-sm text-muted">Ảnh minh chứng được phân trang và tự dọn sau 7 ngày.</p>
      </div>
      <Section title={`Bảng minh chứng (${count})`}>
        <ProofGrid proofs={proofs} currentUserId={ctx.userId} role={ctx.role} />
      </Section>
    </main>
  );
}
