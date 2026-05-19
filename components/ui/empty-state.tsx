import { Inbox } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white px-4 py-8 text-center shadow-sm">
      <span className="rounded-lg bg-brand-50 p-3">
        <Inbox className="h-9 w-9 text-brand-500" aria-hidden />
      </span>
      <p className="mt-3 text-sm font-semibold text-ink">{title}</p>
      {description ? <p className="mt-1 max-w-md text-sm text-muted">{description}</p> : null}
    </div>
  );
}
