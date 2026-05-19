import Link from "next/link";
import { Menu, Users } from "lucide-react";
import type { AppContext } from "@/services/context";
import { roleLabel } from "@/lib/utils";

export function Topbar({ ctx }: { ctx: AppContext }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/65 shadow-sm backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Menu className="h-5 w-5 text-slate-500 lg:hidden" aria-hidden />
          <div>
            <p className="text-sm font-black text-ink">{ctx.room.name}</p>
            <p className="text-xs font-semibold text-muted">{roleLabel(ctx.role)}</p>
          </div>
        </div>
        <Link href="/thanh-vien-quan-ly" className="btn-secondary hidden sm:inline-flex">
          <Users className="h-4 w-4" aria-hidden />
          Thành viên
        </Link>
      </div>
    </header>
  );
}
