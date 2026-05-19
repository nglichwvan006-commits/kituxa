import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { AttendanceStatus, DutyStatus, UserRole } from "@/types/domain";

export const VI_TIME_ZONE = "Asia/Ho_Chi_Minh";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getVietnamDateString(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: VI_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

export function getVietnamDayOfWeek(date = new Date()) {
  const value = new Intl.DateTimeFormat("en-US", {
    timeZone: VI_TIME_ZONE,
    weekday: "short"
  }).format(date);
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6
  };
  return map[value] ?? 0;
}

export function formatDateVi(date: string | Date) {
  const value = typeof date === "string" ? new Date(`${date}T00:00:00+07:00`) : date;
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: VI_TIME_ZONE,
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(value);
}

export function formatDateTimeVi(date: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: VI_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit"
  }).format(new Date(date));
}

export function roleLabel(role: UserRole) {
  return {
    admin: "Quản trị viên",
    room_leader: "Trưởng phòng",
    member: "Thành viên"
  }[role];
}

export function dutyStatusLabel(status: DutyStatus) {
  return {
    not_started: "Chưa làm",
    waiting_proof: "Đang chờ minh chứng",
    completed: "Đã hoàn thành"
  }[status];
}

export function attendanceStatusLabel(status: AttendanceStatus) {
  return {
    present: "Có mặt",
    absent: "Vắng"
  }[status];
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function safeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
