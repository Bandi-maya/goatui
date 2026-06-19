// Fully self-contained JSX/Tailwind code generators (No outside file dependency bugs)
export const GeneratedCodeForComponent = (id: string, options: any) => {
    switch (id) {
        case "button": {
            const btnVariant = options.btnVariant || "primary";
            const btnSize = options.btnSize || "default";

            const variantClasses = {
                primary: "bg-blue-600 hover:bg-blue-700 text-white shadow focus:ring-blue-600",
                secondary: "bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-foreground focus:ring-slate-500 shadow-sm",
                outline: "border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 text-foreground focus:ring-slate-500",
                ghost: "hover:bg-slate-100 dark:hover:bg-zinc-800 text-foreground focus:ring-slate-500",
                gradient: "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow focus:ring-blue-600",
                neon: "border border-blue-500 text-blue-500 bg-transparent hover:bg-blue-500/10 focus:ring-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.2)] hover:shadow-[0_0_15px_rgba(37,99,235,0.4)]",
                glass: "bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/10 text-foreground shadow hover:bg-white/30"
            }[btnVariant as string] || "bg-blue-600 hover:bg-blue-700 text-white";

            const sizeClasses = {
                default: "px-5 py-2.5 text-sm rounded-xl",
                sm: "px-3.5 py-1.5 text-xs rounded-lg",
                lg: "px-6 py-3.5 text-base rounded-xl",
                icon: "p-2.5 rounded-xl"
            }[btnSize as string] || "px-5 py-2.5 text-sm";

            return `import React from 'react';
${btnVariant === 'icon' || options.btnLoading ? "import { Sparkles, Loader2 } from 'lucide-react';\n" : ""}
export default function CustomButton() {
  return (
    <button 
      className="inline-flex items-center justify-center font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 duration-200 ${variantClasses} ${sizeClasses} disabled:opacity-50 disabled:pointer-events-none"\${options.btnDisabled ? "\n      disabled" : ""}
    >
      ${options.btnLoading ? `<Loader2 className="animate-spin mr-2 h-4 w-4" />` : ""}
      ${btnSize === 'icon' ? `<Sparkles className="h-4.5 w-4.5" />` : "Click Me"}
    </button>
  );
}`;
        }

        case "select": {
            return `import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function AntdDropdownSelect() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("React Framework");
  const optionsList = ["React Framework", "Vue Framework", "Angular Platform", "NextJS Engine", "Svelte Architecture"];

  return (
    <div className="w-full max-w-xs relative text-left select-none">
      <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 mb-1.5">Infrastructure Engine</label>
      <div
        onClick={() => setOpen(!open)}
        className="w-full h-10 border border-slate-200 dark:border-zinc-800 rounded-xl bg-card/50 px-3.5 py-2 flex items-center justify-between text-xs font-medium text-foreground cursor-pointer shadow-sm hover:border-blue-500 transition-colors"
      >
        <span>{selected}</span>
        <ChevronDown className={\`h-4 w-4 text-muted-foreground transition-transform \${open ? "rotate-180" : ""}\`} />
      </div>
      
      {open && (
        <div className="absolute top-[105%] left-0 w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-1 shadow-xl z-50">
          {optionsList.map((opt) => (
            <button
              key={opt}
              onClick={() => { setSelected(opt); setOpen(false); }}
              className={\`w-full text-left text-xs font-medium px-3 py-2.5 rounded-lg flex items-center justify-between border-0 bg-transparent cursor-pointer \${
                selected === opt ? "bg-blue-600 text-white" : "text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900"
              }\`}
            >
              <span>{opt}</span>
              {selected === opt && <Check className="h-3.5 w-3.5 stroke-[3]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}`;
        }

        case "slider": {
            return `import React, { useState } from 'react';

export default function AntdRangeSlider() {
  const [val, setVal] = useState(${options.progressValue || 50});

  return (
    <div className="w-full max-w-xs space-y-3 text-left select-none">
      <div className="flex justify-between items-center text-xs font-semibold">
        <span className="text-slate-600 dark:text-zinc-400">Memory Allocation</span>
        <span className="text-blue-600 font-bold font-mono">{val} GB</span>
      </div>
      <div className="relative flex items-center w-full">
        <input
          type="range"
          min="0"
          max="100"
          value={val}
          onChange={(e) => setVal(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600 transition-all focus:outline-none"
        />
      </div>
    </div>
  );
}`;
        }

        case "upload": {
            return `import React, { useState } from 'react';
import { UploadCloud, CheckCircle2 } from 'lucide-react';

export default function AntdFileDropzone() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);

  return (
    <div className="w-full max-w-sm text-left">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0].name); }}
        className={\`w-full border-2 border-dashed rounded-xl p-6 text-center transition-all flex flex-col items-center justify-center cursor-pointer bg-card/20 \${
          dragActive ? "border-blue-500 bg-blue-600/5" : "border-slate-200 dark:border-zinc-800 hover:border-blue-500/50"
        }\`}
      >
        <UploadCloud className="h-8 w-8 text-blue-600 mb-2" />
        <span className="text-xs font-bold text-foreground">Click or Drag deployment assets bundle</span>
        <p className="text-[10px] text-muted-foreground mt-1">Supports compiled production build ZIP, TAR up to 64MB.</p>
      </div>
      {file && (
        <div className="mt-3 border border-green-500/20 bg-green-500/5 rounded-xl p-2.5 flex items-center gap-2 text-xs text-green-700 dark:text-green-400 font-semibold">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span className="truncate">Staged: {file}</span>
        </div>
      )}
    </div>
  );
}`;
        }

        case "steps": {
            return `import React, { useState } from 'react';
import { Check } from 'lucide-react';

export default function AntdWizardSteps() {
  const [current, setCurrent] = useState(1);
  const coreSteps = [
    { title: "Authenticate", desc: "Verify webhook keys" },
    { title: "Compile", desc: "Build artifact" },
    { title: "Release", desc: "CDN Propagation" }
  ];

  return (
    <div className="w-full max-w-md flex items-start gap-4 text-left select-none">
      {coreSteps.map((step, idx) => (
        <div key={idx} className="flex-1 flex flex-col gap-2 relative">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrent(idx)}
              className={\`h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs border transition-all cursor-pointer \${
                idx < current ? "bg-green-500 border-green-500 text-white" :
                idx === current ? "bg-blue-600 border-blue-600 text-white shadow shadow-blue-600/20" :
                "border-slate-200 dark:border-zinc-800 bg-card text-muted-foreground"
              }\`}
            >
              {idx < current ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : idx + 1}
            </button>
            <span className={\`text-xs font-bold \${idx === current ? "text-blue-600" : "text-foreground"}\`}>{step.title}</span>
          </div>
          <p className="text-[10px] text-muted-foreground pl-9 leading-tight">{step.desc}</p>
        </div>
      ))}
    </div>
  );
}`;
        }

        case "timeline": {
            return `import React from 'react';

export default function AntdActivityTimeline() {
  const elements = [
    { label: "Deployment Successful", time: "10:42 AM", dot: "bg-green-500" },
    { label: "Database Migration Injected", time: "10:39 AM", dot: "bg-blue-600" },
    { label: "Validation Staging Sandbox Launched", time: "09:12 AM", dot: "bg-amber-500" }
  ];

  return (
    <div className="w-full max-w-xs space-y-4 text-left select-none">
      {elements.map((item, idx) => (
        <div key={idx} className="flex gap-4 relative pl-1">
          {idx !== elements.length - 1 && <div className="absolute left-2.5 top-3 bottom-0 w-px bg-slate-200 dark:bg-zinc-800 -ml-[0.5px]" />}
          <div className={\`h-2 w-2 rounded-full mt-1.5 shrink-0 border-2 border-card relative z-10 \${item.dot}\`} />
          <div>
            <h5 className="text-xs font-bold text-foreground">{item.label}</h5>
            <span className="text-[10px] text-muted-foreground font-mono">{item.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
}`;
        }

        case "empty": {
            return `import React from 'react';
import { Inbox } from 'lucide-react';

export default function AntdEmptyState() {
  return (
    <div className="w-full max-w-sm rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 bg-card/10 p-8 text-center select-none">
      <div className="h-12 w-12 rounded-full bg-slate-50 dark:bg-zinc-900 flex items-center justify-center mx-auto mb-3 border border-slate-100 dark:border-zinc-800">
        <Inbox className="h-5 w-5 text-muted-foreground/60" />
      </div>
      <h4 className="text-xs font-bold text-foreground">No Query Artifacts Logged</h4>
      <p className="text-[11px] text-muted-foreground max-w-xs mx-auto mt-1 leading-relaxed">
        We couldn't track active cluster records in this timeline node filter frame.
      </p>
    </div>
  );
}`;
        }

        case "spin": {
            return `import React from 'react';
import { Loader2 } from 'lucide-react';

export default function AntdSpinLoader() {
  return (
    <div className="w-full max-w-sm border border-slate-200 dark:border-zinc-800 rounded-xl p-6 bg-card/40 relative overflow-hidden flex flex-col items-center justify-center text-center h-44 select-none">
      <div className="space-y-2 flex flex-col items-center animate-fadeIn">
        <Loader2 className="h-7 w-7 text-blue-600 animate-spin" />
        <span className="text-xs font-bold tracking-wide text-blue-600">Syncing Node Metrics...</span>
        <p className="text-[10px] text-muted-foreground max-w-[200px]">Evaluating data parameters from cluster shards.</p>
      </div>
    </div>
  );
}`;
        }

        case "result": {
            return `import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function AntdOperationResult() {
  return (
    <div className="w-full max-w-md rounded-xl border border-slate-200 dark:border-zinc-800 bg-card p-6 md:p-8 text-center space-y-4 shadow-sm animate-fadeIn text-left">
      <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500">
        <CheckCircle2 className="h-7 w-7" />
      </div>
      <div className="space-y-1.5">
        <h4 className="text-base font-extrabold text-foreground">Cluster Infrastructure Synced</h4>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
          Operational deployment pipe code executed with success. Internal gateway DNS trees have propagated.
        </p>
      </div>
      <div className="flex justify-center gap-2 pt-2">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors border-0 cursor-pointer">
          Dashboard Console
        </button>
        <button className="border border-slate-200 dark:border-zinc-800 text-foreground font-semibold text-xs px-4 py-2 rounded-xl hover:bg-muted transition-colors cursor-pointer">
          Inspect Logs
        </button>
      </div>
    </div>
  );
}`;
        }

        case "drawer": {
            return `import React, { useState } from 'react';
import { X, Settings } from 'lucide-react';

export default function AntdSideDrawer() {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <button
        onClick={() => setVisible(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl border-0 cursor-pointer shadow"
      >
        Open Configurations Drawer
      </button>

      {visible && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div onClick={() => setVisible(false)} className="absolute inset-0 bg-black/40 backdrop-blur-xs" />
          
          <div className="relative w-80 h-full bg-white dark:bg-zinc-950 border-l border-slate-200 dark:border-zinc-900 p-5 shadow-2xl flex flex-col justify-between text-left animate-slideLeft">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-900 pb-3">
                <h4 className="text-sm font-extrabold flex items-center gap-1.5"><Settings className="h-4 w-4 text-blue-600" /> System Settings</h4>
                <button onClick={() => setVisible(false)} className="p-1 rounded hover:bg-muted text-muted-foreground border-0 bg-transparent cursor-pointer"><X className="h-4 w-4" /></button>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">Configure staging environment options and database cluster parameters in real-time.</p>
            </div>
            <button onClick={() => setVisible(false)} className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-xs font-bold border-0 cursor-pointer">Apply Settings</button>
          </div>
        </div>
      )}
    </div>
  );
}`;
        }

        case "popconfirm": {
            return `import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react';

export default function AntdPopconfirmButton() {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative inline-block select-none">
      <button
        onClick={() => setVisible(!visible)}
        className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl border-0 cursor-pointer shadow-sm"
      >
        Purge Node Database
      </button>

      {visible && (
        <div className="absolute bottom-[115%] left-1/2 -translate-x-1/2 w-52 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3.5 shadow-2xl z-50 text-left">
          <div className="flex items-start gap-2.5 text-xs text-foreground">
            <ShieldAlert className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block">Are you certain?</strong>
              <span className="text-[10px] text-muted-foreground mt-0.5 block leading-tight">This operation instantly deletes cloud cluster tables.</span>
            </div>
          </div>
          <div className="flex justify-end gap-1.5 mt-3 select-none">
            <button onClick={() => setVisible(false)} className="text-[10px] font-bold px-2.5 py-1 rounded bg-muted hover:bg-slate-200 dark:hover:bg-zinc-900 border-0 cursor-pointer text-foreground">No</button>
            <button onClick={() => { setVisible(false); alert('Purged Successfully'); }} className="text-[10px] font-bold px-2.5 py-1 rounded bg-red-500 text-white border-0 cursor-pointer">Execute</button>
          </div>
        </div>
      )}
    </div>
  );
}`;
        }

        case "badge": {
            const variantClasses = {
                default: "bg-blue-600 text-white hover:bg-blue-700 border-transparent",
                secondary: "bg-slate-100 dark:bg-zinc-800 text-foreground hover:bg-slate-200 border-transparent",
                destructive: "bg-red-500 text-white hover:bg-red-600 border-transparent",
                outline: "border-slate-200 dark:border-zinc-800 text-foreground"
            }[options.badgeVariant as string] || "bg-blue-600 text-white";

            return `import React from 'react';

export default function CustomBadge() {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border border-border select-none transition-colors ${variantClasses}">
      ${options.badgeLabel || "New"}
    </span>
  );
}`;
        }

        case "avatar": {
            const sizeClasses = {
                sm: "h-8 w-8 text-xs",
                md: "h-11 w-11 text-sm",
                lg: "h-16 w-16 text-lg"
            }[options.avatarSize as string] || "h-11 w-11";

            const statusColor = {
                online: "bg-green-500",
                busy: "bg-red-500",
                offline: "bg-slate-400"
            }[options.avatarStatus as string] || "bg-green-500";

            return `import React from 'react';

export default function CustomAvatar() {
  return (
    <div className="relative inline-block select-none">
      <div className="rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center font-bold overflow-hidden border border-slate-200 dark:border-zinc-800 ${sizeClasses}">
        <img 
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
          alt="User avatar" 
          className="h-full w-full object-cover"
        />
      </div>
      ${options.avatarStatus !== 'none' ? `
      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-950 ${statusColor}" />` : ''}
    </div>
  );
}`;
        }

        case "input": {
            return `import React${options.inputType === 'password' ? ', { useState }' : ''} from 'react';
${options.inputType === 'password' ? "import { Eye, EyeOff } from 'lucide-react';\n" : ""}
export default function CustomInput() {
  ${options.inputType === 'password' ? 'const [showPassword, setShowPassword] = useState(false);\n' : ''}
  return (
    <div className="w-full max-w-sm space-y-1.5 text-left">
      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
      <div className="relative">
        <input 
          type={${options.inputType === 'password' ? 'showPassword ? "text" : "password"' : `"${options.inputType}"`}}
          placeholder="${options.inputPlaceholder}"
          className="flex h-10 w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50 ${options.inputHasError ? 'border-red-500 focus-visible:ring-red-500' : ''}"${options.inputDisabled ? "\n          disabled" : ""}
        />
        ${options.inputType === 'password' ? `
        <button 
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>` : ''}
      </div>
      ${options.inputHasError ? `
      <p className="text-xs text-red-500 font-medium">Please enter a valid input state.</p>` : `
      <p className="text-xs text-muted-foreground">We'll never share your data.</p>`}
    </div>
  );
}`;
        }

        case "checkbox": {
            return `import React, { useState } from 'react';
import { Check } from 'lucide-react';

export default function CustomCheckbox() {
  const [checked, setChecked] = useState(${options.chkChecked});

  return (
    <div className="flex items-center gap-2.5 text-left">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => ${options.chkDisabled ? 'undefined' : 'setChecked(!checked)'}}
        className={\`
          h-5 w-5 rounded-md border border-slate-300 dark:border-zinc-700 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-blue-600
          \${checked ? 'bg-blue-600 border-blue-600 text-white' : 'bg-transparent'}
          \${options.chkDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        \`}
        ${options.chkDisabled ? 'disabled' : ''}
      >
        {checked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
      </button>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        Accept Terms & Conditions
      </span>
    </div>
  );
}`;
        }

        case "radio": {
            return `import React, { useState } from 'react';

export default function CustomRadioGroup() {
  const [selectedValue, setSelectedValue] = useState("pro");

  const items = [
    { id: "starter", name: "Starter Tier", price: "Free" },
    { id: "pro", name: "Professional", price: "$19/mo" }
  ];

  return (
    <div className="w-full max-w-sm flex ${options.radioLayout === 'horizontal' ? 'items-center gap-4' : 'flex-col gap-3'}">
      {items.map((item) => (
        <label
          key={item.id}
          className={\`
            flex items-center justify-between rounded-xl border p-3.5 cursor-pointer transition-all active:scale-[0.99]
            \${selectedValue === item.id ? 'border-blue-600 bg-blue-600/5 shadow-sm' : 'border-slate-200 dark:border-zinc-800'}
            \${options.radioDisabled ? 'opacity-50 cursor-not-allowed' : ''}
          \`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="pricing-tier"
              value={item.id}
              disabled={${options.radioDisabled}}
              checked={selectedValue === item.id}
              onChange={() => setSelectedValue(item.id)}
              className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
            />
            <span className="text-xs font-semibold text-foreground">{item.name}</span>
          </div>
          <span className="text-xs font-bold text-blue-600">{item.price}</span>
        </label>
      ))}
    </div>
  );
}`;
        }

        case "switch": {
            return `import React, { useState } from 'react';

export default function CustomSwitch() {
  const [checked, setChecked] = useState(${options.switchChecked});

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => ${options.switchDisabled ? 'undefined' : 'setChecked(!checked)'}}
        className={\`
          relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600
          \${checked ? 'bg-blue-600' : 'bg-slate-200 dark:bg-zinc-855'}
          \${options.switchDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        \`}
      >
        <span
          className={\`
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out
            \${checked ? 'translate-x-5' : 'translate-x-0'}
          \`}
        />
      </button>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-350 select-none">
        Toggle Options State
      </span>
    </div>
  );
}`;
        }

        case "rating": {
            return `import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function CustomRating() {
  const [score, setScore] = useState(${options.ratingValue});
  const [hoverScore, setHoverScore] = useState(0);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((val) => (
          <button
            key={val}
            type="button"
            onClick={() => setScore(val)}
            onMouseEnter={() => setHoverScore(val)}
            onMouseLeave={() => setHoverScore(0)}
            className="p-1 hover:scale-110 transition-transform cursor-pointer"
          >
            <Star 
              className={\`h-6 w-6 transition-all \${
                val <= (hoverScore || score)
                  ? "fill-amber-400 stroke-amber-400 text-amber-400" 
                  : "stroke-slate-400 text-transparent"
              }\`}
            />
          </button>
        ))}
      </div>
      <span className="text-xs font-semibold text-slate-500 select-none">
        Current Score: {score} / 5.0
      </span>
    </div>
  );
}`;
        }

        case "navbar": {
            return `import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function CustomNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="mx-auto flex h-16 items-center justify-between px-6 max-w-7xl">
        <div className="flex items-center gap-2.5 font-bold text-sm text-foreground">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-blue-600 text-white font-bold text-xs shadow shadow-blue-600/20">G</div>
          GoatUI
        </div>
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
          <a href="#docs" className="hover:text-blue-600 transition-colors">Documentation</a>
        </nav>
        <div className="hidden md:block">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow transition-colors cursor-pointer border-0">
            Get Started
          </button>
        </div>
        <button className="md:hidden p-1 text-foreground border-0 bg-transparent" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
    </header>
  );
}`;
        }

        case "breadcrumb": {
            return `import React from 'react';

export default function CustomBreadcrumbs() {
  const separator = "${options.breadSeparator === 'chevron' ? '>' : options.breadSeparator === 'slash' ? '/' : '•'}";

  return (
    <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 select-none">
      <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
      <span>{separator}</span>
      <a href="/docs" className="hover:text-blue-600 transition-colors">Docs</a>
      <span>{separator}</span>
      <span className="text-blue-600 font-semibold">Breadcrumbs</span>
    </nav>
  );
}`;
        }

        case "pagination": {
            return `import React, { useState } from 'react';

export default function CustomPagination() {
  const [currentPage, setCurrentPage] = useState(2);

  return (
    <div className="flex items-center gap-1.5 text-xs select-none">
      <button 
        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
        disabled={currentPage === 1}
        className="h-8 px-3 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-900 disabled:opacity-50"
      >
        Previous
      </button>
      {[1, 2, 3, 4].map((idx) => (
        <button
          key={idx}
          onClick={() => setCurrentPage(idx)}
          className={\`h-8 w-8 rounded-xl flex items-center justify-center font-bold \x24{idx === currentPage ? "bg-blue-600 text-white" : "border border-slate-200"}\`}
        >
          {idx}
        </button>
      ))}
    </div>
  );
}`;
        }

        case "tabs": {
            return `import React, { useState } from 'react';

export default function CustomTabs() {
  const [activeTab, setActiveTab] = useState("tab-1");

  return (
    <div className="w-full max-w-sm space-y-4 text-left">
      <div className="flex border-b border-slate-200 text-xs font-semibold gap-4">
        {["tab-1", "tab-2"].map((id, idx) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={\`pb-2 border-b-2 \${activeTab === id ? "border-blue-600 text-blue-600" : "border-transparent"}\`}
          >
            Dashboard \${idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}`;
        }

        case "card": {
            return `import React from 'react';

export default function CustomCard() {
  return (
    <div className="w-full max-w-xs rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 text-left shadow-sm">
      <h4 className="font-bold text-sm text-foreground">Goat Agent Pro</h4>
      <p className="text-xs text-slate-500 leading-relaxed">Deploy autonomous system layers privately.</p>
    </div>
  );
}`;
        }

        case "statistics": {
            return `import React from 'react';

export default function CustomStatCard() {
  return (
    <div className="w-full max-w-xs rounded-xl border border-slate-200 bg-white p-5 text-left">
      <p className="text-xs text-slate-550 font-medium">Active Nodes</p>
      <h4 className="text-2xl font-extrabold text-foreground">48,259</h4>
    </div>
  );
}`;
        }

        case "list-group": {
            return `import React from 'react';

export default function CustomListGroup() {
  return (
    <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white overflow-hidden text-left">
      <div className="px-4 py-3 text-xs font-semibold bg-blue-600/5 text-blue-600">Active Choice Frame</div>
    </div>
  );
}`;
        }

        case "table": {
            return `import React from 'react';

export default function CustomUserTable() {
  return (
    <div className="w-full overflow-x-auto border border-slate-200 rounded-xl bg-white text-xs text-left">
      <table className="w-full">
        <thead><tr className="bg-slate-50 font-semibold">
          <th className="p-3">User</th><th className="p-3">Role</th>
        </tr></thead>
      </table>
    </div>
  );
}`;
        }

        case "alert": {
            return `import React from 'react';

export default function CustomAlertBanner() {
  return (
    <div className="w-full max-w-md rounded-xl border border-blue-500/25 bg-blue-500/10 p-4 text-xs">
      <strong>Action Successful</strong>
    </div>
  );
}`;
        }

        case "progress-bar": {
            return `import React from 'react';

export default function CustomProgress() {
  return (
    <div className="w-full max-w-sm space-y-2 text-left">
      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
        <div className="bg-blue-600 h-full" style={{ width: "${options.progressValue}%" }} />
      </div>
    </div>
  );
}`;
        }

        case "toast": {
            return `import React from 'react';

export default function CustomToastDemo() {
  return <button className="bg-blue-600 text-white text-xs py-2 px-4 rounded-xl">Trigger Toast Alert</button>;
}`;
        }

        case "modal": {
            return `import React from 'react';

export default function CustomModalDialog() {
  return <button className="bg-blue-600 text-white text-xs py-2 px-4 rounded-xl">Open Confirmation Dialog</button>;
}`;
        }

        case "tooltip": {
            return `import React from 'react';

export default function CustomTooltip() {
  return (
    <div className="relative inline-block group">
      <button className="bg-slate-100 px-4 py-2 rounded-xl text-xs font-semibold">Hover trigger</button>
    </div>
  );
}`;
        }

        case "dropdown": {
            return `import React from 'react';

export default function CustomDropdownMenu() {
  return <button className="border border-slate-200 bg-white text-xs px-4 py-2 rounded-xl">Menu Options</button>;
}`;
        }

        case "hero": {
            return `import React from 'react';

export default function CustomHeroSection() {
  return <div className="max-w-xl border p-6 text-center rounded-xl"><h3>Build Interfaces Fast</h3></div>;
}`;
        }

        case "metric-card": {
            return `import React from 'react';

export default function CustomMetricCard() {
  return <div className="max-w-xs border rounded-xl p-5 text-left"><p>CPU Rate</p><h4>42.8%</h4></div>;
}`;
        }

        case "skeleton": {
            return `import React from 'react';

export default function CustomProfileSkeleton() {
  return <div className="max-w-xs space-y-3 animate-pulse p-3 border rounded-xl bg-card"><div className="h-10 w-10 bg-slate-200 rounded-full" /></div>;
}`;
        }

        default:
            return ``;
    }
};