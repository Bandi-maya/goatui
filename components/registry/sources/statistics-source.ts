/** Install command + copyable source for the "statistics" component. */
export const installCommand = "npx goatui add statistics";

export const source = `import React from 'react';

export default function CustomStatCard() {
  return (
    <div className="w-full max-w-xs rounded-xl border border-slate-200 bg-white p-5 text-left">
      <p className="text-xs font-medium text-slate-500">Active Nodes</p>
      <h4 className="text-2xl font-extrabold text-foreground">48,259</h4>
    </div>
  );
}`;
