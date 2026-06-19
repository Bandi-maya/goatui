/** Install command + copyable source for the "pagination" component. */
export const installCommand = "npx goatui add pagination";

export const source = `import React, { useState } from 'react';

export default function CustomPagination() {
  const [currentPage, setCurrentPage] = useState(2);

  return (
    <div className="flex select-none items-center gap-1.5 text-xs">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        disabled={currentPage === 1}
        className="h-8 rounded-xl border border-slate-200 px-3 text-slate-600 hover:bg-slate-50 disabled:opacity-50 dark:border-zinc-800 dark:text-slate-400 dark:hover:bg-zinc-900"
      >
        Previous
      </button>
      {[1, 2, 3, 4].map((idx) => (
        <button
          key={idx}
          onClick={() => setCurrentPage(idx)}
          className={\`flex h-8 w-8 items-center justify-center rounded-xl font-bold \${
            idx === currentPage ? 'bg-blue-600 text-white' : 'border border-slate-200 dark:border-zinc-800'
          }\`}
        >
          {idx}
        </button>
      ))}
    </div>
  );
}`;
