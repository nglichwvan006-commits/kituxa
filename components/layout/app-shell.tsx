import type { ReactNode } from "react";
import type { AppContext } from "@/services/context";
import { MobileNav } from "./mobile-nav";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { RealtimeNotifications } from "@/components/realtime-notifications";

export function AppShell({ ctx, children }: { ctx: AppContext; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <Sidebar ctx={ctx} />
        <div className="min-w-0 flex-1 pb-20 lg:pb-0">
          <Topbar ctx={ctx} />
          {children}
        </div>
      </div>
      <MobileNav />
      <RealtimeNotifications roomId={ctx.room.id} userId={ctx.userId} />
    </div>
  );
}
