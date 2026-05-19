"use client";

import { useState } from "react";
import { saveAttendanceAction } from "@/services/attendance-actions";

export function AttendanceForm({ today }: { today: string }) {
  const [status, setStatus] = useState("present");

  return (
    <form action={saveAttendanceAction} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
      <input type="hidden" name="date" value={today} />
      <select name="status" className="input" value={status} onChange={(event) => setStatus(event.target.value)}>
        <option value="present">Có mặt</option>
        <option value="absent">Vắng</option>
      </select>
      <input
        name="absentAddress"
        className="input"
        placeholder="Địa chỉ vắng"
        required={status === "absent"}
        disabled={status !== "absent"}
      />
      <button className="btn-primary">Lưu điểm danh</button>
    </form>
  );
}
