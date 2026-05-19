import Link from "next/link";
import { CalendarDays, Camera, CheckCircle2, Home, LogOut, Users, Bell, Shield } from "lucide-react";
import { signOutAction } from "@/services/auth-actions";
import { roleLabel } from "@/lib/utils";
import type { AppContext } from "@/services/context";

const navItems = [
  { href: "/dashboard", label: "Tổng quan", icon: Home },
  { href: "/lich-truc", label: "Lịch trực", icon: CalendarDays },
  { href: "/diem-danh", label: "Điểm danh", icon: CheckCircle2 },
  { href: "/minh-chung", label: "Minh chứng", icon: Camera },
  { href: "/thong-bao", label: "Thông báo", icon: Bell },
  { href: "/thanh-vien-quan-ly", label: "Thành viên", icon: Users }
];

export function Sidebar({ ctx }: { ctx: AppContext }) {
  return (
    <aside className="hidden min-h-screen w-72 border-r border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur-xl lg:block">
      <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-2 py-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm">
          <Shield className="h-5 w-5" aria-hidden />
        </span>
        <span>
          <span className="block text-lg font-black text-ink">QLKTX</span>
          <span className="block text-xs text-muted">{ctx.room.name}</span>
        </span>
      </Link>

      <nav className="mt-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-white/80 hover:text-ink hover:shadow-sm">
              <span className="rounded-lg bg-slate-100 p-1.5 text-slate-500 transition group-hover:bg-brand-50 group-hover:text-brand-700">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 rounded-lg border border-white/80 bg-white/70 p-3 shadow-sm">
        <p className="text-sm font-bold text-ink">{ctx.profile.full_name}</p>
        <p className="mt-1 text-xs text-muted">{roleLabel(ctx.role)}</p>
      </div>

      <form action={signOutAction} className="mt-4">
        <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50">
          <LogOut className="h-4 w-4" aria-hidden />
          Đăng xuất
        </button>
      </form>
    </aside>
  );
}
