"use client";

import { useEffect, useState, useTransition } from "react";
import { Bell, X } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import type { NotificationRow } from "@/types/domain";
import { cn } from "@/lib/utils";

export function RealtimeNotifications({ roomId, userId }: { roomId: string; userId: string }) {
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`room-notifications:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          const notification = payload.new as NotificationRow;
          if (notification.user_id && notification.user_id !== userId) return;
          startTransition(() => {
            setItems((current) => [notification, ...current].slice(0, 3));
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, userId]);

  if (items.length === 0) return null;

  return (
    <div className="fixed right-3 top-20 z-50 flex w-[calc(100vw-24px)] max-w-sm flex-col gap-2 sm:right-5">
      {items.map((item) => (
        <div key={item.id} className={cn("surface rounded-lg p-3 transition")}>
          <div className="flex gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
              <Bell className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-ink">{item.title}</p>
              <p className="mt-1 text-sm text-muted">{item.message}</p>
            </div>
            <button
              className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-ink"
              aria-label="Đóng thông báo"
              onClick={() => setItems((current) => current.filter((value) => value.id !== item.id))}
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
