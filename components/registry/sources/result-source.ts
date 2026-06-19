/** Install command + copyable source for the "result" component. */
export const installCommand = "npx goatui add result";

export const source = `import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function OperationResult() {
  return (
    <div className="w-full max-w-md animate-fadeIn rounded-xl border border-slate-200 bg-card p-6 text-center shadow-sm dark:border-zinc-800 md:p-8">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-500">
        <CheckCircle2 className="h-7 w-7" />
      </div>
      <h4 className="text-base font-extrabold text-foreground">Cluster Infrastructure Synced</h4>
      <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-muted-foreground">
        Operational deployment executed successfully. Gateway DNS has propagated.
      </p>
      <div className="mt-4 flex justify-center gap-2">
        <button className="rounded-xl border-0 bg-blue-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700 cursor-pointer">
          Dashboard
        </button>
        <button className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted cursor-pointer dark:border-zinc-800">
          Inspect Logs
        </button>
      </div>
    </div>
  );
}`;
