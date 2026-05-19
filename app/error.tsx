"use client";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="max-w-md rounded-lg border border-rose-200 bg-white p-6 text-center shadow-soft">
        <h1 className="text-xl font-black text-ink">Có lỗi xảy ra</h1>
        <p className="mt-2 text-sm text-muted">{error.message}</p>
        <button className="btn-primary mt-5" onClick={reset}>Thử lại</button>
      </div>
    </main>
  );
}
