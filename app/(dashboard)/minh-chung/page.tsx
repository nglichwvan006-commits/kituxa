import { ProofGrid } from "@/components/dashboard/proof-grid";
import { PageHeading } from "@/components/ui/page-heading";
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
      <PageHeading title="Nhật ký trực nhật" description="Ảnh minh chứng được phân trang, xem bằng signed URL riêng tư và tự dọn sau 7 ngày." />
      <Section title={`Bảng minh chứng (${count})`}>
        <ProofGrid proofs={proofs} currentUserId={ctx.userId} role={ctx.role} />
      </Section>
    </main>
  );
}
