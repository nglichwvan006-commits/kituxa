import Link from "next/link";
import { BellRing } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Section } from "@/components/ui/section";
import { markNotificationReadAction } from "@/services/notification-actions";
import { getAppContext } from "@/services/context";
import { getNotifications } from "@/services/queries";
import { formatDateTimeVi } from "@/lib/utils";

export default async function NotificationsPage() {
  const ctx = await getAppContext();
  const notifications = await getNotifications(ctx.room.id, ctx.userId);

  return (
    <main className="page-shell grid gap-5">
      <div>
        <h1 className="text-2xl font-black text-ink">Thông báo</h1>
        <p className="mt-1 text-sm text-muted">Realtime popup cũng được lưu lại để xem sau.</p>
      </div>
      <Section title="Hộp thông báo">
        {notifications.length > 0 ? (
          <div className="grid gap-3">
            {notifications.map((item) => (
              <article key={item.id} className="flex gap-3 rounded-lg border border-slate-200 bg-white p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <BellRing className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-bold text-ink">{item.title}</p>
                      <p className="mt-1 text-sm text-muted">{item.message}</p>
                      <p className="mt-2 text-xs text-muted">{formatDateTimeVi(item.created_at)}</p>
                    </div>
                    <div className="flex gap-2">
                      {item.href ? <Link className="btn-secondary px-3" href={item.href}>Mở</Link> : null}
                      {!item.read_at ? (
                        <form action={markNotificationReadAction}>
                          <input type="hidden" name="id" value={item.id} />
                          <button className="btn-primary px-3">Đã đọc</button>
                        </form>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="Chưa có thông báo" />
        )}
      </Section>
    </main>
  );
}
