import type { ReactNode } from "react";

export function PageHeading({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-hero">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-700">Ký túc xá vibe tốt</p>
          <h1 className="gradient-title mt-2">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm font-medium text-muted">{description}</p>
        </div>
        {action}
      </div>
    </div>
  );
}
