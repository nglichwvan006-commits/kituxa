import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, Room, UserRole } from "@/types/domain";

export type AppContext = {
  userId: string;
  profile: Profile;
  room: Room;
  role: UserRole;
};

export async function getAppContext(): Promise<AppContext> {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/dang-nhap");
  }

  const { data, error } = await supabase
    .from("room_members")
    .select(
      `
      role,
      is_active,
      rooms:room_id(id,name,code),
      profiles:user_id(id,full_name,email,role,phone,is_active)
    `
    )
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  const row = data as unknown as {
    role: UserRole;
    is_active: boolean;
    rooms: Room | null;
    profiles: Profile | null;
  } | null;

  if (error || !row?.profiles || !row.rooms) {
    redirect("/dang-nhap?loi=khong-co-phong");
  }

  return {
    userId: user.id,
    profile: row.profiles,
    room: row.rooms,
    role: row.role
  };
}

export function assertManager(role: UserRole) {
  if (role !== "admin" && role !== "room_leader") {
    throw new Error("Bạn không có quyền thực hiện thao tác này.");
  }
}

export function assertAdmin(role: UserRole) {
  if (role !== "admin") {
    throw new Error("Chỉ quản trị viên được thực hiện thao tác này.");
  }
}
