/** Install command + copyable source for the "steps" component. */
export const installCommand = "npx goatui add steps";

export const source = `import React, { useState } from 'react';
import { Check } from 'lucide-react';

export default function WizardSteps() {
  const [current, setCurrent] = useState(1);
  const steps = [
    { title: 'Authenticate', desc: 'Verify webhook keys' },
    { title: 'Compile', desc: 'Build artifact' },
    { title: 'Release', desc: 'CDN Propagation' },
  ];

  return (
    <div className="flex w-full max-w-md items-start gap-4 text-left select-none">
      {steps.map((step, idx) => (
        <div key={idx} className="relative flex flex-1 flex-col gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrent(idx)}
              className={\`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold transition-all cursor-pointer \${
                idx < current ? 'border-green-500 bg-green-500 text-white' :
                idx === current ? 'border-blue-600 bg-blue-600 text-white shadow shadow-blue-600/20' :
                'border-slate-200 bg-card text-muted-foreground dark:border-zinc-800'
              }\`}
            >
              {idx < current ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : idx + 1}
            </button>
            <span className={\`text-xs font-bold \${idx === current ? 'text-blue-600' : 'text-foreground'}\`}>
              {step.title}
            </span>
          </div>
          <p className="pl-9 text-[10px] leading-tight text-muted-foreground">{step.desc}</p>
        </div>
      ))}
    </div>
  );
}`;
