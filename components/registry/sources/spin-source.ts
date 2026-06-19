/** Install command + copyable source for the "spin" component. */
export const installCommand = "npx goatui add spin";

export const source = `import React from 'react';
import { Loader2 } from 'lucide-react';

export default function SpinLoader() {
  return (
    <div className="flex h-44 w-full max-w-sm select-none flex-col items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-card/40 p-6 text-center dark:border-zinc-800">
      <Loader2 className="mb-2 h-7 w-7 animate-spin text-blue-600" />
      <span className="text-xs font-bold text-blue-600">Resolving Data Parameters...</span>
      <p className="mt-1 max-w-[200px] text-[10px] text-muted-foreground">
        Evaluating data parameters from cluster shards.
      </p>
    </div>
  );
}`;
