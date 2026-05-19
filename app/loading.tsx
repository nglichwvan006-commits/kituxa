export default function Loading() {
  return (
    <main className="page-shell">
      <div className="grid gap-4">
        <div className="h-8 w-56 animate-pulse rounded-lg bg-slate-200" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-lg bg-slate-200" />
          ))}
        </div>
        <div className="h-72 animate-pulse rounded-lg bg-slate-200" />
      </div>
    </main>
  );
}
