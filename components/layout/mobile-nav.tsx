"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, CalendarDays, Camera, CheckCircle2, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Nhà", icon: Home },
  { href: "/lich-truc", label: "Trực", icon: CalendarDays },
  { href: "/diem-danh", label: "Danh", icon: CheckCircle2 },
  { href: "/minh-chung", label: "Ảnh", icon: Camera },
  { href: "/thong-bao", label: "Tin", icon: Bell }
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="absolute bottom-6 left-1/2 z-50 w-[calc(100%-2.5rem)] -translate-x-1/2">
      <div className="flex items-center justify-around rounded-[24px] border border-white/80 bg-white/70 p-2 shadow-[0_8px_32px_rgba(45,71,57,0.14)] backdrop-blur-xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={cn("relative flex h-14 w-14 flex-col items-center justify-center rounded-2xl text-xs font-bold transition active:scale-90", active ? "text-brand-700" : "text-slate-400")}>
              {active ? <span className="absolute inset-0 rounded-2xl border border-brand-50 bg-white shadow-sm" /> : null}
              <span className="relative z-10 flex flex-col items-center gap-1">
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} aria-hidden />
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
