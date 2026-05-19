"use client";

import { useActionState, useState } from "react";
import { CheckCircle2, Loader2, MapPin, Sparkles } from "lucide-react";
import { saveAttendanceAction } from "@/services/attendance-actions";
import { cn } from "@/lib/utils";

export function AttendanceForm({ today }: { today: string }) {
  const [status, setStatus] = useState("present");
  const [state, formAction, isPending] = useActionState(saveAttendanceAction, {
    ok: false,
    message: ""
  });

  return (
    <form action={formAction} className="grid gap-3">
      <input type="hidden" name="date" value={today} />
      <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <label className="grid gap-1 text-sm font-bold text-ink">
          Trạng thái hôm nay
          <span className="relative">
            <Sparkles className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-600" aria-hidden />
            <select name="status" className="input pl-9" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="present">Có mặt</option>
              <option value="absent">Vắng</option>
            </select>
          </span>
        </label>
        <label className="grid gap-1 text-sm font-bold text-ink">
          Địa chỉ khi vắng
          <span className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-coral" aria-hidden />
            <input
              name="absentAddress"
              className="input pl-9"
              placeholder="Ví dụ: Về quê - Bình Định"
              required={status === "absent"}
              disabled={status !== "absent"}
            />
          </span>
        </label>
        <button className="btn-primary self-end rounded-2xl py-3" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <CheckCircle2 className="h-4 w-4" aria-hidden />}
          Lưu điểm danh
        </button>
      </div>
      {state.message ? (
        <p
          className={cn(
            "animate-in rounded-lg px-3 py-2 text-sm font-semibold",
            state.ok ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100" : "bg-rose-50 text-rose-700 ring-1 ring-rose-100"
          )}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
