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
    <nav className="fixed inset-x-0 bottom-4 z-40 px-4 lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 rounded-lg border border-white/80 bg-white/75 p-2 shadow-[0_10px_34px_rgba(45,71,57,0.14)] backdrop-blur-xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={cn("flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-xs font-bold transition active:scale-95", active ? "bg-white text-brand-700 shadow-sm ring-1 ring-brand-100" : "text-slate-400")}>
              <Icon className="h-4 w-4" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
