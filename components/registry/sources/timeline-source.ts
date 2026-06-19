/** Install command + copyable source for the "timeline" component. */
export const installCommand = "npx goatui add timeline";

export const source = `import React from 'react';

export default function ActivityTimeline() {
  const events = [
    { label: 'Deployment Successful', time: '10:42 AM', dot: 'bg-green-500' },
    { label: 'Database Migration Injected', time: '10:39 AM', dot: 'bg-blue-600' },
    { label: 'Validation Staging Launched', time: '09:12 AM', dot: 'bg-amber-500' },
  ];

  return (
    <div className="w-full max-w-xs space-y-4 text-left select-none">
      {events.map((item, idx, arr) => (
        <div key={idx} className="relative flex gap-4 pl-1">
          {idx !== arr.length - 1 && (
            <div className="absolute -ml-[0.5px] left-2.5 top-3 bottom-0 w-px bg-slate-200 dark:bg-zinc-800" />
          )}
          <div className={\`relative z-10 mt-1.5 h-2 w-2 shrink-0 rounded-full border-2 border-card \${item.dot}\`} />
          <div>
            <h5 className="text-xs font-bold text-foreground">{item.label}</h5>
            <span className="mt-0.5 block font-mono text-[10px] text-muted-foreground">{item.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
}`;
