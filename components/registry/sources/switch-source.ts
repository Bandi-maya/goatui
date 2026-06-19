/** Install command + copyable source for the "switch" component. */
export const installCommand = "npx goatui add switch";

export const source = `import React, { useState } from 'react';

export default function CustomSwitch() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => setChecked(!checked)}
        className={\`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 \${
          checked ? 'bg-blue-600' : 'bg-slate-200 dark:bg-zinc-700'
        }\`}
      >
        <span
          className={\`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out \${
            checked ? 'translate-x-5' : 'translate-x-0'
          }\`}
        />
      </button>
      <span className="select-none text-sm font-medium text-slate-700 dark:text-slate-300">
        Toggle Options State
      </span>
    </div>
  );
}`;
