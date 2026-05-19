import { Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { deleteMemberAction, updateMemberRoleAction } from "@/services/member-actions";
import type { RoomMember } from "@/types/domain";

export function MemberTable({ members, canManage, currentUserId }: { members: RoomMember[]; canManage: boolean; currentUserId: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="text-xs uppercase text-muted">
          <tr className="border-b border-slate-200">
            <th className="py-3 pr-4">Thành viên</th>
            <th className="py-3 pr-4">Vai trò</th>
            <th className="py-3 pr-4">Số điện thoại</th>
            {canManage ? <th className="py-3 text-right">Thao tác</th> : null}
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id} className="border-b border-slate-100 last:border-0">
              <td className="py-3 pr-4">
                <p className="font-semibold text-ink">{member.profiles?.full_name}</p>
                <p className="text-xs text-muted">{member.profiles?.email}</p>
              </td>
              <td className="py-3 pr-4">
                {canManage && member.user_id !== currentUserId ? (
                  <form action={updateMemberRoleAction} className="flex items-center gap-2">
                    <input type="hidden" name="userId" value={member.user_id} />
                    <select className="input min-w-36" name="role" defaultValue={member.role}>
                      <option value="member">Thành viên</option>
                      <option value="room_leader">Trưởng phòng</option>
                      <option value="admin">Quản trị viên</option>
                    </select>
                    <button className="btn-secondary px-3">Lưu</button>
                  </form>
                ) : (
                  <StatusBadge type="role" value={member.role} />
                )}
              </td>
              <td className="py-3 pr-4 text-muted">{member.profiles?.phone || "Chưa có"}</td>
              {canManage ? (
                <td className="py-3 text-right">
                  {member.user_id !== currentUserId ? (
                    <form action={deleteMemberAction}>
                      <input type="hidden" name="userId" value={member.user_id} />
                      <button className="inline-flex rounded-lg p-2 text-rose-600 hover:bg-rose-50" aria-label="Xóa thành viên">
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </form>
                  ) : null}
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
