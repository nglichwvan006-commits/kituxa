import { redirect } from "next/navigation";
import { getAppContext } from "@/services/context";

export default async function DashboardRouterPage() {
  const ctx = await getAppContext();
  if (ctx.role === "admin") redirect("/admin");
  if (ctx.role === "room_leader") redirect("/truong-phong");
  redirect("/thanh-vien");
}
