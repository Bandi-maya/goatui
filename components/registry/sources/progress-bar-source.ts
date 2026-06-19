/** Install command + copyable source for the "progress-bar" component. */
export const installCommand = "npx goatui add progress-bar";

export const source = `import React from 'react';

export default function CustomProgress() {
  return (
    <div className="w-full max-w-sm space-y-2 text-left">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-muted-foreground">Uploading</span>
        <span className="text-blue-600">60%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
        <div className="h-full bg-blue-600" style={{ width: '60%' }} />
      </div>
    </div>
  );
}`;
