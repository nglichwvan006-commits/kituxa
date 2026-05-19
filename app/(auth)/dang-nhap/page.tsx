import { Suspense } from "react";
import { ShieldCheck } from "lucide-react";
import { signInAction } from "@/services/auth-actions";

function LoginForm({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const error = typeof searchParams.loi === "string" ? searchParams.loi : "";
  const next = typeof searchParams.next === "string" ? searchParams.next : "/dashboard";

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-600 text-white">
            <ShieldCheck className="h-6 w-6" aria-hidden />
          </span>
          <div>
            <h1 className="text-2xl font-black text-ink">QLKTX</h1>
            <p className="text-sm text-muted">Đăng nhập để quản lí phòng ký túc xá</p>
          </div>
        </div>

        {error ? <p className="mt-5 rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{error}</p> : null}

        <form action={signInAction} className="mt-6 grid gap-4">
          <input type="hidden" name="next" value={next} />
          <label className="grid gap-1 text-sm font-semibold text-ink">
            Email
            <input className="input" name="email" type="email" placeholder="ban@ktx.edu.vn" required />
          </label>
          <label className="grid gap-1 text-sm font-semibold text-ink">
            Mật khẩu
            <input className="input" name="password" type="password" placeholder="••••••••" required />
          </label>
          <button className="btn-primary mt-2">Đăng nhập</button>
        </form>
      </div>
    </main>
  );
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  return (
    <Suspense>
      <LoginForm searchParams={await searchParams} />
    </Suspense>
  );
}
