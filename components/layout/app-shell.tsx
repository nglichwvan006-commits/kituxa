import type { ReactNode } from "react";
import type { AppContext } from "@/services/context";
import { MobileNav } from "./mobile-nav";
import { Topbar } from "./topbar";
import { RealtimeNotifications } from "@/components/realtime-notifications";

export function AppShell({ ctx, children }: { ctx: AppContext; children: ReactNode }) {
  return (
    <div className="flex min-h-screen justify-center overflow-hidden bg-slate-100 font-sans selection:bg-brand-100">
      <div className="relative flex h-screen w-full max-w-md flex-col overflow-hidden bg-[#FAFBFC] shadow-2xl">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-[80px]" />
          <div className="absolute -right-24 top-24 h-72 w-72 rounded-full bg-sky-200/40 blur-[80px]" />
          <div className="absolute bottom-12 left-12 h-64 w-64 rounded-full bg-brand-100/55 blur-[80px]" />
        </div>

        <Topbar ctx={ctx} />

        <div className="no-scrollbar relative z-10 flex-1 overflow-y-auto pb-32">
          {children}
        </div>

        <MobileNav />
        <RealtimeNotifications roomId={ctx.room.id} userId={ctx.userId} />
      </div>
    </div>
  );
}
