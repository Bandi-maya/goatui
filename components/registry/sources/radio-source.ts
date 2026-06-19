/** Install command + copyable source for the "radio" component. */
export const installCommand = "npx goatui add radio";

export const source = `import React, { useState } from 'react';

export default function CustomRadioGroup() {
  const [selectedValue, setSelectedValue] = useState('pro');
  const items = [
    { id: 'starter', name: 'Starter Tier', price: 'Free' },
    { id: 'pro', name: 'Professional', price: '$19/mo' },
  ];

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      {items.map((item) => (
        <label
          key={item.id}
          className={\`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition-all active:scale-[0.99] \${
            selectedValue === item.id ? 'border-blue-600 bg-blue-600/5 shadow-sm' : 'border-slate-200 dark:border-zinc-800'
          }\`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="pricing-tier"
              value={item.id}
              checked={selectedValue === item.id}
              onChange={() => setSelectedValue(item.id)}
              className="h-4 w-4 cursor-pointer border-slate-300 text-blue-600 focus:ring-blue-600"
            />
            <span className="text-xs font-semibold text-foreground">{item.name}</span>
          </div>
          <span className="text-xs font-bold text-blue-600">{item.price}</span>
        </label>
      ))}
    </div>
  );
}`;
