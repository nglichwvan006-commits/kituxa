import Link from "next/link";
import { Bell, Menu, Users } from "lucide-react";
import type { AppContext } from "@/services/context";
import { roleLabel } from "@/lib/utils";

export function Topbar({ ctx }: { ctx: AppContext }) {
  return (
    <header className="relative z-40 w-full border-b border-white/60 bg-white/55 px-5 pb-4 pt-10 shadow-sm backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Menu className="h-5 w-5 text-slate-400" aria-hidden />
          <div>
            <p className="text-xl font-black tracking-tight text-slate-800">{ctx.room.name}</p>
            <p className="text-sm font-semibold text-slate-500">{roleLabel(ctx.role)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/thong-bao" className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-600 shadow-sm transition active:scale-95" aria-label="Thông báo">
            <Bell className="h-5 w-5" aria-hidden />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </Link>
          <Link href="/thanh-vien-quan-ly" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-600 shadow-sm transition active:scale-95" aria-label="Thành viên">
            <Users className="h-5 w-5" aria-hidden />
          </Link>
        </div>
      </div>
    </header>
  );
}
