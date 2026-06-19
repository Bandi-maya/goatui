/** Install command + copyable source for the "badge" component. */
export const installCommand = "npx goatui add badge";

export const source = `import React from 'react';

export default function CustomBadge() {
  return (
    <span className="inline-flex items-center rounded-full border border-blue-600/20 bg-blue-600 px-2.5 py-0.5 text-xs font-semibold text-white select-none">
      New
    </span>
  );
}`;
