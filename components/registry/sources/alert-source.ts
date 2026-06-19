/** Install command + copyable source for the "alert" component. */
export const installCommand = "npx goatui add alert";

export const source = `import React from 'react';
import { Info } from 'lucide-react';

export default function AlertBanner() {
  return (
    <div className="flex w-full max-w-md items-start gap-3 rounded-xl border border-blue-500/25 bg-blue-500/10 p-4 text-xs">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
      <div>
        <strong className="font-bold">Action Successful</strong>
        <p className="mt-0.5 text-blue-700/80 dark:text-blue-300/80">
          Your cluster parameters were applied without errors.
        </p>
      </div>
    </div>
  );
}`;
