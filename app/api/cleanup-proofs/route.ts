import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ message: "Không có quyền chạy cleanup." }, { status: 401 });
  }

  const service = createServiceClient();
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: oldProofs, error } = await service
    .from("duty_proofs")
    .select("id,storage_path")
    .lt("created_at", cutoff)
    .limit(500);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const proofRows = (oldProofs ?? []) as Array<{ id: string; storage_path: string }>;
  const paths = proofRows.map((proof) => proof.storage_path);
  if (paths.length > 0) {
    const { error: storageError } = await service.storage.from("duty-proofs").remove(paths);
    if (storageError) {
      return NextResponse.json({ message: storageError.message }, { status: 500 });
    }

    const ids = proofRows.map((proof) => proof.id);
    const { error: dbError } = await service.from("duty_proofs").delete().in("id", ids);
    if (dbError) {
      return NextResponse.json({ message: dbError.message }, { status: 500 });
    }
  }

  return NextResponse.json({
    message: "Đã dọn minh chứng quá 7 ngày.",
    deleted: paths.length
  });
}
