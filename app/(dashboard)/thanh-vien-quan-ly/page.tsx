import { MemberForm } from "@/components/forms/member-form";
import { MemberTable } from "@/components/dashboard/member-table";
import { PageHeading } from "@/components/ui/page-heading";
import { Section } from "@/components/ui/section";
import { getAppContext } from "@/services/context";
import { getRoomMembers } from "@/services/queries";

export default async function MembersPage() {
  const ctx = await getAppContext();
  const members = await getRoomMembers(ctx.room.id);
  const canManage = ctx.role === "admin";

  return (
    <main className="page-shell grid gap-5">
      <PageHeading title="Quản lý thành viên" description="Thêm, xóa và cập nhật vai trò thành viên trong phòng ký túc xá." />
      {canManage ? (
        <Section title="Thêm thành viên mới" description="Tài khoản Supabase Auth sẽ được tạo với mật khẩu tạm.">
          <MemberForm />
        </Section>
      ) : null}
      <Section title="Danh sách thành viên">
        <MemberTable members={members} canManage={canManage} currentUserId={ctx.userId} />
      </Section>
    </main>
  );
}
