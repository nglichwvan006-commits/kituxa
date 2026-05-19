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
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 py-2 shadow-[0_-10px_30px_rgba(15,23,42,0.06)] backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={cn("flex flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold transition", active ? "bg-brand-50 text-brand-700 shadow-sm" : "text-slate-500")}>
              <Icon className="h-4 w-4" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
