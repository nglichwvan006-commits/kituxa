import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { getAppContext } from "@/services/context";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const ctx = await getAppContext();
  return <AppShell ctx={ctx}>{children}</AppShell>;
}
