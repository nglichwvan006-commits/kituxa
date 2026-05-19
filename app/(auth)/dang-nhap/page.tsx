import { Suspense } from "react";
import { ShieldCheck, Sparkles } from "lucide-react";
import { signInAction } from "@/services/auth-actions";

function LoginForm({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const error = typeof searchParams.loi === "string" ? searchParams.loi : "";
  const next = typeof searchParams.next === "string" ? searchParams.next : "/dashboard";

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md overflow-hidden rounded-lg border border-white/70 bg-white/85 shadow-soft backdrop-blur-xl">
        <div className="h-2 bg-gradient-to-r from-brand-400 via-indigo-500 to-coral" />
        <div className="p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 via-indigo-500 to-coral text-white shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <h1 className="gradient-title text-3xl">QLKTX</h1>
              <p className="text-sm font-medium text-muted">Đăng nhập để quản lí phòng ký túc xá</p>
            </div>
          </div>

          <div className="mt-5 rounded-lg bg-gradient-to-r from-brand-50 to-rose-50 px-3 py-2 text-sm font-semibold text-slate-700">
            <Sparkles className="mr-1 inline h-4 w-4 text-brand-600" aria-hidden />
            Lịch trực, điểm danh, minh chứng và thông báo realtime ở cùng một nơi.
          </div>

          {error ? <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 ring-1 ring-rose-100">{error}</p> : null}

          <form action={signInAction} className="mt-6 grid gap-4">
            <input type="hidden" name="next" value={next} />
            <label className="grid gap-1 text-sm font-bold text-ink">
              Email
              <input className="input" name="email" type="email" placeholder="ban@ktx.edu.vn" required />
            </label>
            <label className="grid gap-1 text-sm font-bold text-ink">
              Mật khẩu
              <input className="input" name="password" type="password" placeholder="••••••••" required />
            </label>
            <button className="btn-primary mt-2">Đăng nhập</button>
          </form>
        </div>
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
