/** Install command + copyable source for the "tabs" component. */
export const installCommand = "npx goatui add tabs";

export const source = `import React, { useState } from 'react';

export default function CustomTabs() {
  const [activeTab, setActiveTab] = useState('tab-1');

  return (
    <div className="w-full max-w-sm space-y-4 text-left">
      <div className="flex gap-4 border-b border-slate-200 text-xs font-semibold">
        {['tab-1', 'tab-2'].map((id, idx) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={\`border-b-2 pb-2 \${
              activeTab === id ? 'border-blue-600 text-blue-600' : 'border-transparent'
            }\`}
          >
            Dashboard {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}`;
