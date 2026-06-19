/** Install command + copyable source for the "select" component. */
export const installCommand = "npx goatui add select";

export const source = `import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function DropdownSelect() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('React Framework');
  const options = ['React Framework', 'Vue Framework', 'Angular Platform', 'NextJS Engine', 'Svelte Architecture'];

  return (
    <div className="relative w-full max-w-xs text-left select-none">
      <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-zinc-400">
        Infrastructure Engine
      </label>
      <div
        onClick={() => setOpen(!open)}
        className="flex h-10 w-full cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-card/50 px-3.5 py-2 text-xs font-medium shadow-sm transition-colors hover:border-blue-500 dark:border-zinc-800"
      >
        <span>{selected}</span>
        <ChevronDown className={\`h-4 w-4 text-muted-foreground transition-transform \${open ? 'rotate-180' : ''}\`} />
      </div>

      {open && (
        <div className="absolute left-0 top-[105%] z-50 w-full rounded-xl border border-slate-200 bg-white p-1 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { setSelected(opt); setOpen(false); }}
              className={\`flex w-full items-center justify-between rounded-lg border-0 bg-transparent px-3 py-2.5 text-left text-xs font-medium cursor-pointer \${
                selected === opt ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-50 dark:text-zinc-300 dark:hover:bg-zinc-900'
              }\`}
            >
              <span>{opt}</span>
              {selected === opt && <Check className="h-3.5 w-3.5 stroke-[3]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}`;
