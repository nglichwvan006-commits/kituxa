import { Plus } from "lucide-react";
import { createMemberAction } from "@/services/member-actions";

export function MemberForm() {
  return (
    <form action={createMemberAction} className="grid gap-3 md:grid-cols-2">
      <input className="input" name="fullName" placeholder="Họ tên" required />
      <input className="input" name="email" placeholder="Email" type="email" required />
      <input className="input" name="password" placeholder="Mật khẩu tạm" type="password" minLength={6} required />
      <input className="input" name="phone" placeholder="Số điện thoại" />
      <select className="input" name="role" defaultValue="member">
        <option value="member">Thành viên</option>
        <option value="room_leader">Trưởng phòng</option>
        <option value="admin">Quản trị viên</option>
      </select>
      <button className="btn-primary">
        <Plus className="h-4 w-4" aria-hidden />
        Thêm thành viên
      </button>
    </form>
  );
}
