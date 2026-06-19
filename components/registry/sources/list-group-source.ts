/** Install command + copyable source for the "list-group" component. */
export const installCommand = "npx goatui add list-group";

export const source = `import React from 'react';

export default function CustomListGroup() {
  const items = [
    { id: 1, label: 'Inbox', active: true },
    { id: 2, label: 'Starred', active: false },
    { id: 3, label: 'Sent', active: false },
  ];

  return (
    <div className="w-full max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white text-left dark:border-zinc-800 dark:bg-zinc-950">
      {items.map((item) => (
        <div
          key={item.id}
          className={\`px-4 py-3 text-xs font-semibold \${
            item.active ? 'bg-blue-600/5 text-blue-600' : 'text-foreground hover:bg-muted'
          }\`}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}`;
