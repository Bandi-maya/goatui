/** Install command + copyable source for the "card" component. */
export const installCommand = "npx goatui add card";

export const source = `import React from 'react';

export default function CustomCard() {
  return (
    <div className="w-full max-w-xs rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h4 className="text-sm font-bold text-foreground">Goat Agent Pro</h4>
      <p className="text-xs leading-relaxed text-slate-500">Deploy autonomous system layers privately.</p>
    </div>
  );
}`;
