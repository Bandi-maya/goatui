/** Install command + copyable source for the "empty" component. */
export const installCommand = "npx goatui add empty";

export const source = `import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="w-full max-w-sm select-none rounded-xl border border-dashed border-slate-200 bg-card/10 p-8 text-center dark:border-zinc-800">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-slate-100 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900">
        <Inbox className="h-5 w-5 text-muted-foreground/60" />
      </div>
      <h4 className="text-xs font-bold text-foreground">No Query Artifacts Logged</h4>
      <p className="mx-auto mt-1 max-w-xs text-[11px] leading-relaxed text-muted-foreground">
        We couldn't track active records in this filter frame.
      </p>
    </div>
  );
}`;
