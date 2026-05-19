"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";
import { getAppContext } from "./context";

export async function markNotificationReadAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const ctx = await getAppContext();
  const service = createServiceClient();

  const { error } = await service
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", id)
    .eq("room_id", ctx.room.id)
    .or(`user_id.is.null,user_id.eq.${ctx.userId}`);

  if (error) throw new Error(error.message);
  revalidatePath("/thong-bao");
}
