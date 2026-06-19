/** Install command + copyable source for the "breadcrumb" component. */
export const installCommand = "npx goatui add breadcrumb";

export const source = `import React from 'react';

export default function CustomBreadcrumbs() {
  return (
    <nav className="flex select-none items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
      <a href="/" className="transition-colors hover:text-blue-600">Home</a>
      <span>&gt;</span>
      <a href="/docs" className="transition-colors hover:text-blue-600">Docs</a>
      <span>&gt;</span>
      <span className="font-semibold text-blue-600">Breadcrumbs</span>
    </nav>
  );
}`;
