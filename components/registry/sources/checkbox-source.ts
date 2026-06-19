/** Install command + copyable source for the "checkbox" component. */
export const installCommand = "npx goatui add checkbox";

export const source = `import React, { useState } from 'react';
import { Check } from 'lucide-react';

export default function CustomCheckbox() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex items-center gap-2.5 text-left">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => setChecked(!checked)}
        className={\`flex h-5 w-5 items-center justify-center rounded-md border transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 \${
          checked ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-transparent dark:border-zinc-700'
        } cursor-pointer\`}
      >
        {checked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
      </button>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        Accept Terms &amp; Conditions
      </span>
    </div>
  );
}`;
