import { Inbox } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white px-4 py-8 text-center">
      <Inbox className="h-9 w-9 text-slate-300" aria-hidden />
      <p className="mt-3 text-sm font-semibold text-ink">{title}</p>
      {description ? <p className="mt-1 max-w-md text-sm text-muted">{description}</p> : null}
    </div>
  );
}
