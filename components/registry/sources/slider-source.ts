/** Install command + copyable source for the "slider" component. */
export const installCommand = "npx goatui add slider";

export const source = `import React, { useState } from 'react';

export default function RangeSlider() {
  const [val, setVal] = useState(50);

  return (
    <div className="w-full max-w-xs space-y-3 text-left select-none">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-slate-600 dark:text-zinc-400">Memory Allocation</span>
        <span className="font-mono font-bold text-blue-600">{val} GB</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={val}
        onChange={(e) => setVal(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-100 accent-blue-600 transition-all focus:outline-none dark:bg-zinc-800"
      />
    </div>
  );
}`;
