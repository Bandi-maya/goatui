"use client";

import React, { useState, useEffect, useMemo } from "react";
import Layout from "@/components/Layout";
import { AnimatePresence, motion } from "framer-motion";
import {
  Copy, Check, Laptop, Tablet, Smartphone, Grid, CircleDot,
  Square, Terminal, Eye, Code, ChevronRight, ChevronDown, ChevronLeft,
  Star, Info, AlertTriangle, CheckCircle2, XCircle, MoreHorizontal,
  Search, Settings, HelpCircle, LogOut, Menu, X, Sparkles, Loader2,
  UploadCloud, Inbox, Calendar, Sliders, Play, Trash2, ShieldAlert
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

// Types
interface ComponentItem {
  id: string;
  name: string;
  category: string;
  description: string;
  installationCommand: string;
  tags: string[];
}

// Categories order matching Antd layout paradigm
const CATEGORIES = [
  "Foundation",
  "Forms",
  "Navigation",
  "Data Display",
  "Feedback",
  "Overlay",
  "Marketing",
  "Dashboard",
  "Utilities"
];

// Complete components ledger containing initial elements + expanded Antd core components
const ALL_COMPONENTS: ComponentItem[] = [
  {
    id: "button",
    name: "Buttons",
    category: "Foundation",
    description: "Standard action triggers with variants for primary actions, secondary triggers, gradients, outlines, ghosts, loading state, and icons.",
    installationCommand: "npx goatui add button",
    tags: ["button", "trigger", "action", "click", "interactive", "form"]
  },
  {
    id: "badge",
    name: "Badges",
    category: "Foundation",
    description: "Small visual count or status tag indicating tags, status badges, counter indicators, and notifications.",
    installationCommand: "npx goatui add badge",
    tags: ["badge", "tag", "pill", "status", "counter", "label"]
  },
  {
    id: "avatar",
    name: "Avatars",
    category: "Foundation",
    description: "Circular user profile visuals with online status indicators, image profiles, and text fallback initials.",
    installationCommand: "npx goatui add avatar",
    tags: ["avatar", "user", "profile", "image", "initials", "fallback"]
  },
  {
    id: "input",
    name: "Inputs",
    category: "Forms",
    description: "Flexible text input component supporting passwords with toggling, search input icons, helper text, error messages, and validation.",
    installationCommand: "npx goatui add input",
    tags: ["input", "form", "text", "password", "email", "search", "validation"]
  },
  {
    id: "select",
    name: "Select (Dropdown Select)",
    category: "Forms",
    description: "Antd-inspired searchable single/multi dropdown selection component with active states, tag filtering, and custom clean item layouts.",
    installationCommand: "npx goatui add select",
    tags: ["select", "dropdown", "combobox", "form", "options", "choice"]
  },
  {
    id: "checkbox",
    name: "Checkboxes",
    category: "Forms",
    description: "Selection boxes for binary toggle items, list checkboxes, validation states, and disabled actions.",
    installationCommand: "npx goatui add checkbox",
    tags: ["checkbox", "check", "select", "form", "toggle", "binary"]
  },
  {
    id: "radio",
    name: "Radio Buttons",
    category: "Forms",
    description: "Selection buttons for mutually exclusive form options, radio card selectors, and horizontal/vertical configurations.",
    installationCommand: "npx goatui add radio",
    tags: ["radio", "option", "choice", "select", "form", "group"]
  },
  {
    id: "switch",
    name: "Switches",
    category: "Forms",
    description: "Toggled slider controls for settings dashboards, binary states, and preferences panels.",
    installationCommand: "npx goatui add switch",
    tags: ["switch", "toggle", "settings", "preference", "binary", "slider"]
  },
  {
    id: "slider",
    name: "Slider (Range Slider)",
    category: "Forms",
    description: "Interactive slider tool component for picking precise numerical data metrics, variable step nodes, and active percentage indicators.",
    installationCommand: "npx goatui add slider",
    tags: ["slider", "range", "track", "metric", "form", "input"]
  },
  {
    id: "upload",
    name: "Upload (File Dropzone)",
    category: "Forms",
    description: "Premium file upload area container supporting drag-and-drop mechanics, file type validation, transfer states, and progress lists.",
    installationCommand: "npx goatui add upload",
    tags: ["upload", "file", "dropzone", "attachment", "form", "drag"]
  },
  {
    id: "rating",
    name: "Ratings",
    category: "Forms",
    description: "Interactive rating score stars supporting user feedback score updates, read-only stats, and customizable hover items.",
    installationCommand: "npx goatui add rating",
    tags: ["rating", "star", "score", "feedback", "review", "interactive"]
  },
  {
    id: "navbar",
    name: "Navigation Bars",
    category: "Navigation",
    description: "Full-width site headers with logo indicators, menu navigation anchors, and glassmorphic floating frames.",
    installationCommand: "npx goatui add navbar",
    tags: ["navbar", "navigation", "header", "menu", "link", "floating"]
  },
  {
    id: "steps",
    name: "Steps (Wizard Navigation)",
    category: "Navigation",
    description: "Linear multi-step execution map pipeline indicating transaction progress paths, active step states, and item checkmarks.",
    installationCommand: "npx goatui add steps",
    tags: ["steps", "wizard", "timeline", "process", "navigation", "progress"]
  },
  {
    id: "breadcrumb",
    name: "Breadcrumbs",
    category: "Navigation",
    description: "Inline navigation maps indicating page hierarchy tree, support for chevron dividers, and custom home icon anchors.",
    installationCommand: "npx goatui add breadcrumb",
    tags: ["breadcrumb", "navigation", "path", "hierarchy", "links", "divider"]
  },
  {
    id: "pagination",
    name: "Pagination",
    category: "Navigation",
    description: "Multi-page navigation controls for search results, tables, items pages lists, and next/prev controls.",
    installationCommand: "npx goatui add pagination",
    tags: ["pagination", "page", "next", "previous", "navigation", "table"]
  },
  {
    id: "tabs",
    name: "Tabs",
    category: "Navigation",
    description: "Toggled tab navigation bars supporting underlined highlights, filled pill blocks, and animated content updates.",
    installationCommand: "npx goatui add tabs",
    tags: ["tabs", "navigation", "segment", "toggle", "content"]
  },
  {
    id: "card",
    name: "Cards",
    category: "Data Display",
    description: "General-purpose card wrappers for articles, product catalog displays, rich image cards, and glass panels.",
    installationCommand: "npx goatui add card",
    tags: ["card", "container", "panel", "box", "display", "content"]
  },
  {
    id: "statistics",
    name: "Statistics",
    category: "Data Display",
    description: "Sleek stat numbers panels displaying metric targets, positive trend ratings, negative graphs, and labels.",
    installationCommand: "npx goatui add statistics",
    tags: ["statistics", "stat", "metric", "dashboard", "number", "kpi"]
  },
  {
    id: "timeline",
    name: "Timeline (Activity Logs)",
    category: "Data Display",
    description: "Vertical stacked timeline trail displaying sequentially sorted deployment tasks, transaction history, updates, and chronological notes.",
    installationCommand: "npx goatui add timeline",
    tags: ["timeline", "activity", "logs", "history", "tracking", "display"]
  },
  {
    id: "empty",
    name: "Empty States",
    category: "Data Display",
    description: "Clean contextual placeholders signaling query fault data, blank database metrics, search misses, or filter states.",
    installationCommand: "npx goatui add empty",
    tags: ["empty", "state", "placeholder", "nodata", "null", "search"]
  },
  {
    id: "list-group",
    name: "List Groups",
    category: "Data Display",
    description: "Group structures displaying related lines list items, badges, interactive links items, and rich email list headers.",
    installationCommand: "npx goatui add list-group",
    tags: ["list", "group", "stack", "items", "menu", "selection"]
  },
  {
    id: "table",
    name: "Tables",
    category: "Data Display",
    description: "Structured layout tables for list items presenting user info columns, status pills, and interactive hover updates.",
    installationCommand: "npx goatui add table",
    tags: ["table", "grid", "data", "rows", "columns", "tabular"]
  },
  {
    id: "alert",
    name: "Alerts",
    category: "Feedback",
    description: "Status notification banners displaying warnings, info logs, critical errors, and success updates.",
    installationCommand: "npx goatui add alert",
    tags: ["alert", "status", "banner", "notification", "warning", "success"]
  },
  {
    id: "progress-bar",
    name: "Progress Bars",
    category: "Feedback",
    description: "Linear progression status indicators showing determinate fill bars, custom percentage text, and loading progress state.",
    installationCommand: "npx goatui add progress-bar",
    tags: ["progress", "bar", "status", "loading", "determinate", "percentage"]
  },
  {
    id: "spin",
    name: "Spinners (Loaders)",
    category: "Feedback",
    description: "Antd style modular full-overlay container spinners or inline looping loader graphics for explicit section data loads.",
    installationCommand: "npx goatui add spin",
    tags: ["spin", "loader", "spinner", "loading", "waiting", "async"]
  },
  {
    id: "result",
    name: "Result Panel",
    category: "Feedback",
    description: "Large operational presentation layouts notifying end users of successful checkouts, 404 router errors, or access rejections.",
    installationCommand: "npx goatui add result",
    tags: ["result", "feedback", "success", "error", "404", "statuspage"]
  },
  {
    id: "toast",
    name: "Toast Notifications",
    category: "Feedback",
    description: "Corner slide-in temporary feedback toast alerts, supports auto-dismissals, status icons, and close control widgets.",
    installationCommand: "npx goatui add toast",
    tags: ["toast", "notification", "feedback", "slide", "alert", "trigger"]
  },
  {
    id: "modal",
    name: "Modals",
    category: "Overlay",
    description: "Overlay window blocks rendering context information on top of the primary page workspace.",
    installationCommand: "npx goatui add modal",
    tags: ["modal", "dialog", "popup", "overlay", "backdrop", "window"]
  },
  {
    id: "drawer",
    name: "Drawer (Side Panels)",
    category: "Overlay",
    description: "Side-anchored modal canvas sheet panels sliding gracefully out from layout frames to display auxiliary parameters or option nodes.",
    installationCommand: "npx goatui add drawer",
    tags: ["drawer", "panel", "sheet", "overlay", "sidebar", "options"]
  },
  {
    id: "popconfirm",
    name: "Popconfirm Alerts",
    category: "Overlay",
    description: "Compact context-attached micro overlay trigger popover seeking instant user validation before carrying out destructive operations.",
    installationCommand: "npx goatui add popconfirm",
    tags: ["popconfirm", "popover", "confirmation", "tooltip", "delete", "trigger"]
  },
  {
    id: "tooltip",
    name: "Tooltips",
    category: "Overlay",
    description: "Small hovered info boxes appearing relative to anchor elements in top, bottom, left, or right alignments.",
    installationCommand: "npx goatui add tooltip",
    tags: ["tooltip", "hover", "information", "label", "popover"]
  },
  {
    id: "dropdown",
    name: "Dropdowns",
    category: "Overlay",
    description: "Hover or click interactive action panels list overlay with separating lines, icon links, and toggling.",
    installationCommand: "npx goatui add dropdown",
    tags: ["dropdown", "select", "menu", "popover", "action", "options"]
  },
  {
    id: "hero",
    name: "Hero Sections",
    category: "Marketing",
    description: "Premium conversion-focused hero blocks layout structures containing headlines, visual media frameworks, and call-to-actions.",
    installationCommand: "npx goatui add hero",
    tags: ["hero", "marketing", "banner", "headline", "landing", "page"]
  },
  {
    id: "metric-card",
    name: "Metric Cards",
    category: "Dashboard",
    description: "Dashboard widgets rendering visual counts progress indicators, team members activity feeds, and summary tasks stats.",
    installationCommand: "npx goatui add metric-card",
    tags: ["metric", "widget", "dashboard", "panel", "charts", "kpi"]
  },
  {
    id: "skeleton",
    name: "Skeleton Loaders",
    category: "Utilities",
    description: "Visual placeholder blocks displaying pulsing skeleton shapes while user components retrieve data.",
    installationCommand: "npx goatui add skeleton",
    tags: ["skeleton", "loader", "placeholder", "loading", "utilities", "shimmer"]
  }
];

// Fully self-contained JSX/Tailwind code generators (No outside file dependency bugs)
const getGeneratedCodeForComponent = (id: string, options: any) => {
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

// Component Card Thumbnail Renderers inside Overview Grid (MiniPreview Layout Canvas)
const MiniPreview = ({ id }: { id: string }) => {
  switch (id) {
    case "button":
      return <div className="h-6 w-16 bg-blue-600 rounded flex items-center justify-center text-[8px] font-bold text-white shadow-sm shadow-blue-600/10">Click</div>;
    case "select":
      return <div className="w-20 border border-border bg-card rounded px-1 py-0.5 text-[7px] text-foreground flex items-center justify-between"><span>Option...</span><ChevronDown className="h-2 w-2 text-muted-foreground" /></div>;
    case "slider":
      return <div className="w-20 bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full relative"><div className="absolute left-0 top-0 h-full w-2/3 bg-blue-600 rounded-full" /><div className="absolute left-[64%] -top-1 h-3.5 w-3.5 bg-white border-2 border-blue-600 rounded-full" /></div>;
    case "upload":
      return <div className="w-20 border border-dashed border-blue-500/40 rounded p-1.5 bg-blue-600/5 text-center"><UploadCloud className="h-3 w-3 text-blue-600 mx-auto" /><div className="text-[5px] text-muted-foreground font-bold mt-0.5">Drop bundle</div></div>;
    case "steps":
      return <div className="flex items-center gap-1"><div className="h-3.5 w-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[5px] font-bold">1</div><div className="h-px w-6 bg-slate-300" /><div className="h-3.5 w-3.5 rounded-full bg-slate-100 border text-muted-foreground flex items-center justify-center text-[5px]">2</div></div>;
    case "timeline":
      return <div className="flex flex-col gap-1.5 pl-2 relative border-l border-slate-200"><div className="h-1.5 w-1.5 bg-green-500 rounded-full -ml-[11px]" /><div className="h-1.5 w-1.5 bg-blue-600 rounded-full -ml-[11px]" /></div>;
    case "empty":
      return <div className="text-center p-2"><Inbox className="h-4 w-4 text-muted-foreground/40 mx-auto" /><div className="text-[6px] text-muted-foreground mt-0.5">No data logged</div></div>;
    case "spin":
      return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
    case "result":
      return <div className="text-center"><CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" /><div className="text-[6px] font-bold text-foreground mt-0.5">Task Success</div></div>;
    case "drawer":
      return <div className="w-24 h-16 bg-card border-l-4 border-l-blue-600 shadow-lg relative flex flex-col justify-between p-1"><div className="h-1 w-10 bg-muted rounded" /><div className="h-2 w-full bg-blue-600/10 rounded" /></div>;
    case "popconfirm":
      return <div className="w-20 border border-border rounded bg-card p-1 shadow-md text-left"><div className="flex gap-1 items-center"><ShieldAlert className="h-2.5 w-2.5 text-red-500" /><span className="text-[5px] font-bold">Purge cluster?</span></div></div>;
    case "badge":
      return <div className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[8px] font-bold">New</div>;
    case "avatar":
      return <div className="h-6 w-6 rounded-full bg-blue-600 text-[8px] font-bold text-white flex items-center justify-center animate-fadeIn">A</div>;
    case "input":
      return <div className="h-6 w-24 border border-border rounded bg-card px-1.5 flex items-center text-[7px] text-muted-foreground select-none">Search...</div>;
    case "checkbox":
      return <div className="h-4 w-4 border border-blue-600 bg-blue-600 rounded-sm flex items-center justify-center text-[8px] text-white">✓</div>;
    case "radio":
      return <div className="h-3.5 w-3.5 rounded-full border border-blue-600 flex items-center justify-center"><div className="h-1.5 w-1.5 bg-blue-600 rounded-full" /></div>;
    case "switch":
      return <div className="h-4.5 w-8 rounded-full bg-blue-600 p-0.5 flex justify-end"><div className="h-3.5 w-3.5 rounded-full bg-white" /></div>;
    case "rating":
      return <div className="flex gap-0.5"><Star className="h-2.5 w-2.5 fill-amber-400 stroke-amber-400" /><Star className="h-2.5 w-2.5 fill-amber-400 stroke-amber-400" /><Star className="h-2.5 w-2.5 stroke-muted-foreground" /></div>;
    case "navbar":
      return <div className="w-full max-w-[140px] border border-border rounded bg-card p-1 flex items-center justify-between text-[6px]"><div className="font-bold flex items-center gap-1"><div className="h-2 w-2 rounded bg-blue-600" />Logo</div></div>;
    case "breadcrumb":
      return <div className="text-[7px] text-muted-foreground font-medium">Home &gt; <span className="text-blue-600 font-semibold">Inputs</span></div>;
    case "pagination":
      return <div className="flex gap-1"><div className="h-4 w-4 rounded bg-blue-600 text-white flex items-center justify-center text-[6px] font-bold">2</div></div>;
    case "tabs":
      return <div className="flex border-b border-border text-[6px] gap-2 w-full max-w-[100px]"><span className="border-b border-blue-600 text-blue-600 pb-0.5 font-bold">Tab 1</span></div>;
    case "card":
      return <div className="w-20 border border-border rounded bg-card p-1.5 space-y-1"><div className="h-1.5 w-10 bg-blue-600 rounded" /></div>;
    case "statistics":
      return <div className="text-center"><div className="text-[12px] font-bold text-foreground">$12,450</div></div>;
    case "list-group":
      return <div className="w-20 border border-border rounded bg-card overflow-hidden"><div className="h-3.5 bg-blue-500/10 text-blue-600 text-[6px] flex items-center px-1 font-semibold">Selected Item</div></div>;
    case "table":
      return <div className="w-20 border border-border rounded bg-card flex flex-col gap-0.5 p-1"><div className="h-1.5 bg-blue-600/10 rounded w-full" /></div>;
    case "alert":
      return <div className="w-24 border border-green-500/20 bg-green-500/10 rounded p-1 text-[6px] text-green-700 dark:text-green-400 font-medium">✓ System Updated</div>;
    case "progress-bar":
      return <div className="w-20 bg-slate-200 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden"><div className="bg-blue-600 h-full w-3/5" /></div>;
    case "toast":
      return <div className="w-20 border border-border rounded bg-card p-1 shadow-md text-[6px] border-l-2 border-l-green-500 flex items-center gap-1">✓ Saved</div>;
    case "modal":
      return <div className="w-24 border border-border rounded-lg bg-card p-1.5 shadow-xl relative scale-95 border-blue-600/25"><div className="h-1 w-10 bg-muted rounded mb-1" /></div>;
    case "tooltip":
      return <div className="flex flex-col items-center"><div className="px-1.5 py-0.5 bg-zinc-850 dark:bg-zinc-800 text-white rounded text-[5px] shadow relative z-10">Tooltip info</div></div>;
    case "dropdown":
      return <div className="w-16 border border-border rounded bg-card p-0.5 shadow-md flex flex-col gap-0.5"><div className="h-2 w-12 bg-blue-600/10 rounded" /></div>;
    case "hero":
      return <div className="text-center px-2"><div className="h-2 w-16 bg-blue-600 rounded mx-auto mb-1" /></div>;
    case "metric-card":
      return <div className="w-20 border border-border rounded bg-card p-1.5 space-y-1"><div className="h-4 bg-blue-600/10 rounded flex items-center justify-center text-[7px] text-blue-600 font-bold">98.2%</div></div>;
    case "skeleton":
      return <div className="w-20 space-y-1 animate-pulse"><div className="h-2 bg-slate-200 dark:bg-zinc-800 rounded w-full" /></div>;
    default:
      return null;
  }
};

export default function ComponentsGalleryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const [activeTabs, setActiveTabs] = useState<Record<string, "preview" | "code">>({});
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [copiedInstall, setCopiedInstall] = useState<Record<string, boolean>>({});
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "Foundation": true, "Forms": true, "Navigation": true, "Data Display": true,
    "Feedback": true, "Overlay": true, "Marketing": true, "Dashboard": true, "Utilities": true
  });

  const [canvasBg, setCanvasBg] = useState<"grid" | "dot" | "solid">("grid");
  const [canvasWidth, setCanvasWidth] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const [options, setOptions] = useState({
    btnVariant: "primary", btnSize: "default", btnLoading: false, btnDisabled: false,
    inputType: "text", inputPlaceholder: "Enter cloud email...", inputDisabled: false, inputHasError: false,
    chkChecked: false, chkDisabled: false, radioLayout: "vertical", radioDisabled: false,
    switchChecked: false, switchDisabled: false, ratingValue: 4, breadSeparator: "chevron",
    tabsVariant: "underline", progressValue: 60, toastVariant: "success", tooltipSide: "top",
    badgeVariant: "default", badgeLabel: "Active Node", avatarSize: "md", avatarStatus: "online",
    alertVariant: "success"
  });

  const [toasts, setToasts] = useState<Array<{ id: number; title: string; description: string; variant: string }>>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState<number | null>(0);
  const [activeTabSelect, setActiveTabSelect] = useState("tab-1");
  const [listGroupActive, setListGroupActive] = useState("inbox");
  const [tableHoveredRow, setTableHoveredRow] = useState<number | null>(null);

  // Antd interactive helper states
  const [antdStepActive, setAntdStepActive] = useState(1);
  const [antdSelectOpen, setAntdSelectOpen] = useState(false);
  const [antdSelectedOption, setAntdSelectedOption] = useState("React Framework");
  const [antdUploadStaged, setAntdUploadStaged] = useState<string | null>(null);
  const [antdDrawerOpen, setAntdDrawerOpen] = useState(false);
  const [antdPopconfirmOpen, setAntdPopconfirmOpen] = useState(false);

  const updateOption = (key: string, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedStates(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setCopiedStates(prev => ({ ...prev, [id]: false })), 2000);
  };

  const handleCopyInstall = (id: string, cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedInstall(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setCopiedInstall(prev => ({ ...prev, [id]: false })), 2000);
  };

  const addToast = (title: string, description: string, variant: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, description, variant }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const filteredComponents = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return ALL_COMPONENTS;
    return ALL_COMPONENTS.filter(comp => (
      comp.name.toLowerCase().includes(query) ||
      comp.category.toLowerCase().includes(query) ||
      comp.description.toLowerCase().includes(query) ||
      comp.tags.some(tag => tag.toLowerCase().includes(query))
    ));
  }, [searchQuery]);

  const categoryGroups = useMemo(() => {
    const groups: Record<string, ComponentItem[]> = {};
    filteredComponents.forEach(comp => {
      if (!groups[comp.category]) groups[comp.category] = [];
      groups[comp.category].push(comp);
    });
    return groups;
  }, [filteredComponents]);

  const handleComponentClick = (id: string) => {
    if (id === "overview") {
      setActiveComponent(null);
      window.history.pushState(null, "", window.location.pathname);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setActiveComponent(id);
      window.history.pushState(null, "", `#${id}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const id = window.location.hash.replace("#", "");
      if (id && ALL_COMPONENTS.some(c => c.id === id)) setActiveComponent(id);
    }
  }, []);

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const widthClasses = {
    desktop: "w-full max-w-full",
    tablet: "w-full max-w-[768px]",
    mobile: "w-full max-w-[375px]"
  };

  const selectedComponentDetails = useMemo(() => {
    if (!activeComponent) return null;
    return ALL_COMPONENTS.find(comp => comp.id === activeComponent) || null;
  }, [activeComponent]);

  return (
    <Layout>
      <div className="flex-1 flex flex-col md:flex-row bg-background text-foreground min-h-[calc(100vh-4rem)]">
        
        {/* ================= SIDEBAR (LEFT) ================= */}
        <aside className="hidden md:block w-72 shrink-0 border-r border-border bg-card/10 sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto z-20">
          <div className="p-5 space-y-6 font-sans">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Filter components ledger..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs rounded-lg bg-card/60 focus-visible:ring-blue-600 border-border"
              />
            </div>

            <button
              onClick={() => handleComponentClick("overview")}
              className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-left font-bold transition-all border-0 bg-transparent cursor-pointer ${
                activeComponent === null ? "bg-blue-600/10 text-blue-600" : "text-slate-700 dark:text-slate-300 hover:bg-muted"
              }`}
            >
              <Grid className="h-4 w-4" />
              <span>Overview Canvas Grid</span>
            </button>

            <div className="space-y-4">
              {CATEGORIES.map((cat) => {
                const items = categoryGroups[cat] || [];
                if (items.length === 0) return null;
                const isExpanded = expandedCategories[cat];

                return (
                  <div key={cat} className="space-y-1">
                    <button
                      onClick={() => toggleCategory(cat)}
                      className="w-full flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 hover:text-foreground px-2 py-1 select-none cursor-pointer border-0 bg-transparent"
                    >
                      <span>{cat}</span>
                      {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    </button>

                    {isExpanded && (
                      <div className="flex flex-col gap-0.5 pl-1.5 mt-0.5 border-l border-border/60 ml-2">
                        {items.map((item) => {
                          const active = activeComponent === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleComponentClick(item.id)}
                              className={`w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-left transition-all border-0 bg-transparent cursor-pointer ${
                                active ? "bg-blue-600/10 text-blue-600 font-semibold" : "text-slate-500 dark:text-slate-400 hover:bg-muted"
                              }`}
                            >
                              <span>{item.name}</span>
                              {active && <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ================= MAIN CONTENT (RIGHT) ================= */}
        <main className="flex-1 flex flex-col p-6 md:p-10 min-w-0 bg-background/50 relative">
          
          {activeComponent === null && (
            <div className="max-w-7xl mx-auto w-full mb-8 space-y-4 text-left animate-fadeIn">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Antd Expansion Engine</span>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">Components Library</h1>
              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                A clean, premium React & Tailwind component sandbox configured for modular injection. Built with high-fidelity, standalone, dependency-free raw snippets.
              </p>
            </div>
          )}

          {activeComponent !== null && (
            <div className="max-w-7xl mx-auto w-full mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-card/40 border border-border/80 rounded-xl p-3.5 backdrop-blur-sm shadow-sm">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Sandbox Canvas Configurator:</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-0.5 rounded-lg border border-border bg-card p-0.5 shadow-sm">
                    <button onClick={() => setCanvasBg("grid")} className={`p-1.5 rounded border-0 bg-transparent cursor-pointer ${canvasBg === "grid" ? "bg-muted text-foreground" : "text-muted-foreground"}`}><Grid className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setCanvasBg("dot")} className={`p-1.5 rounded border-0 bg-transparent cursor-pointer ${canvasBg === "dot" ? "bg-muted text-foreground" : "text-muted-foreground"}`}><CircleDot className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setCanvasBg("solid")} className={`p-1.5 rounded border-0 bg-transparent cursor-pointer ${canvasBg === "solid" ? "bg-muted text-foreground" : "text-muted-foreground"}`}><Square className="h-3.5 w-3.5" /></button>
                  </div>
                  <div className="flex items-center gap-0.5 rounded-lg border border-border bg-card p-0.5 shadow-sm">
                    <button onClick={() => setCanvasWidth("desktop")} className={`p-1.5 rounded border-0 bg-transparent cursor-pointer ${canvasWidth === "desktop" ? "bg-muted text-foreground" : "text-muted-foreground"}`}><Laptop className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setCanvasWidth("tablet")} className={`p-1.5 rounded border-0 bg-transparent cursor-pointer ${canvasWidth === "tablet" ? "bg-muted text-foreground" : "text-muted-foreground"}`}><Tablet className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setCanvasWidth("mobile")} className={`p-1.5 rounded border-0 bg-transparent cursor-pointer ${canvasWidth === "mobile" ? "bg-muted text-foreground" : "text-muted-foreground"}`}><Smartphone className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* OVERVIEW GRID VIEW */}
          {activeComponent === null ? (
            <div className="max-w-7xl mx-auto w-full mb-16 space-y-6 text-left animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {filteredComponents.map((comp) => (
                  <div key={comp.id} className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 hover:border-blue-600/40 hover:shadow-lg transition-all duration-300">
                    <div className="space-y-3">
                      <div className="h-28 rounded-lg border border-border/80 bg-slate-50 dark:bg-zinc-900/50 flex items-center justify-center overflow-hidden relative transition-colors">
                        <MiniPreview id={comp.id} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-foreground">{comp.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{comp.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleComponentClick(comp.id)}
                      className="mt-4 w-full flex items-center justify-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 border border-blue-600/20 dark:border-blue-400/20 hover:bg-blue-600 hover:text-white py-2 rounded-lg transition-all cursor-pointer"
                    >
                      Inspect Component <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* INDIVIDUAL REFACTOR PREVIEW VIEW CANVAS */
            selectedComponentDetails && (
              <div className="max-w-7xl mx-auto w-full space-y-6 text-left animate-fadeIn">
                <button onClick={() => handleComponentClick("overview")} className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold mb-2 hover:underline border-0 bg-transparent cursor-pointer p-0">
                  <ChevronLeft className="h-4 w-4" /> Back to Dashboard Overview Canvas Grid
                </button>

                {(() => {
                  const comp = selectedComponentDetails;
                  const tab = activeTabs[comp.id] || "preview";
                  const setTab = (t: "preview" | "code") => setActiveTabs(prev => ({ ...prev, [comp.id]: t }));
                  const code = getGeneratedCodeForComponent(comp.id, options);

                  return (
                    <section id={comp.id} className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-6 shadow-sm focus:outline-none">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-600/10 px-2 py-0.5 rounded">{comp.category}</span>
                            <span className="text-xs text-muted-foreground">/ {comp.id}</span>
                          </div>
                          <h3 className="text-xl font-bold tracking-tight mt-1 text-foreground">{comp.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed">{comp.description}</p>
                        </div>
                        <div className="flex items-center border border-border bg-slate-50 dark:bg-zinc-900/40 rounded-lg p-0.5 pr-2 gap-1 text-[11px] font-mono">
                          <span className="bg-muted px-2 py-1 rounded font-medium">install</span>
                          <span className="px-1.5">{comp.id}</span>
                          <button onClick={() => handleCopyInstall(comp.id, comp.installationCommand)} className="hover:text-foreground border-0 bg-transparent cursor-pointer">
                            {copiedInstall[comp.id] ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex border-b border-border text-xs font-semibold gap-1">
                        <button onClick={() => setTab("preview")} className={`px-4 py-2 border-b-2 border-0 bg-transparent cursor-pointer ${tab === "preview" ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground"}`}><Eye className="h-3.5 w-3.5 inline mr-1" /> Preview Component</button>
                        <button onClick={() => setTab("code")} className={`px-4 py-2 border-b-2 border-0 bg-transparent cursor-pointer ${tab === "code" ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground"}`}><Code className="h-3.5 w-3.5 inline mr-1" /> Inspect Clean Markup</button>
                      </div>

                      {tab === "preview" ? (
                        <div className="space-y-6">
                          <div className="w-full flex items-center justify-center">
                            <div className={`min-h-[300px] border border-border rounded-xl flex items-center justify-center p-6 md:p-8 transition-all relative overflow-hidden bg-card/25 shadow-sm ${widthClasses[canvasWidth]} ${canvasBg === "grid" ? "bg-grid" : canvasBg === "dot" ? "bg-dot" : "bg-card/20"}`}>
                              
                              {/* ANTD STEPPER PIPELINE */}
                              {comp.id === "steps" && (
                                <div className="w-full max-w-md flex flex-col md:flex-row items-start gap-4 text-left select-none">
                                  {[
                                    { title: "Authenticate", desc: "Verify gateway configuration keys" },
                                    { title: "Compile Build", desc: "Bundle structural runtime modules" },
                                    { title: "CDN Release", desc: "Propagate active edge instances" }
                                  ].map((step, idx) => (
                                    <div key={idx} className="flex-1 flex flex-col gap-2 relative">
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => setAntdStepActive(idx)}
                                          className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all cursor-pointer ${
                                            idx < antdStepActive ? "bg-green-500 border-green-500 text-white" :
                                            idx === antdStepActive ? "bg-blue-600 border-blue-600 text-white shadow shadow-blue-600/20" :
                                            "border-slate-200 dark:border-zinc-800 bg-card text-muted-foreground"
                                          }`}
                                        >
                                          {idx < antdStepActive ? "✓" : idx + 1}
                                        </button>
                                        <span className={`text-xs font-bold ${idx === antdStepActive ? "text-blue-600" : "text-foreground"}`}>{step.title}</span>
                                      </div>
                                      <p className="text-[10px] text-muted-foreground pl-10 leading-tight">{step.desc}</p>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* ANTD SEARCHABLE SELECT INTERACTIVE PANEL */}
                              {comp.id === "select" && (
                                <div className="w-full max-w-xs relative text-left select-none">
                                  <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 mb-1.5">Runtime Architecture Infrastructure</label>
                                  <div
                                    onClick={() => setAntdSelectOpen(!antdSelectOpen)}
                                    className="w-full h-10 border border-slate-200 dark:border-zinc-800 rounded-xl bg-card/60 px-3.5 py-2 flex items-center justify-between text-xs font-medium text-foreground cursor-pointer hover:border-blue-500 transition-colors"
                                  >
                                    <span>{antdSelectedOption}</span>
                                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${antdSelectOpen ? "rotate-180" : ""}`} />
                                  </div>
                                  {antdSelectOpen && (
                                    <div className="absolute top-[105%] left-0 w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-1 shadow-2xl z-50 animate-fadeIn">
                                      {["React Core Engine", "Vue Modular Cluster", "Angular Structural Base", "NextJS Build Framework"].map((opt) => (
                                        <button
                                          key={opt}
                                          onClick={() => { setAntdSelectedOption(opt); setAntdSelectOpen(false); }}
                                          className={`w-full text-left text-xs font-medium px-3 py-2 rounded-lg flex items-center justify-between border-0 bg-transparent cursor-pointer ${
                                            antdSelectedOption === opt ? "bg-blue-600 text-white" : "text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900"
                                          }`}
                                        >
                                          <span>{opt}</span>
                                          {antdSelectedOption === opt && <Check className="h-3.5 w-3.5" />}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* ANTD DRAG AND DROP FILE UPLOAD AREA */}
                              {comp.id === "upload" && (
                                <div className="w-full max-w-sm text-left">
                                  <div
                                    onClick={() => setAntdUploadStaged("compiled-deployment-package.zip")}
                                    className="w-full border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-xl p-6 text-center transition-all flex flex-col items-center justify-center cursor-pointer bg-card/20 hover:border-blue-500/50"
                                  >
                                    <UploadCloud className="h-8 w-8 text-blue-600 mb-2" />
                                    <span className="text-xs font-bold text-foreground">Click here to select or map active system files</span>
                                    <p className="text-[10px] text-muted-foreground mt-1">Supports distribution ZIP bundles up to 64MB logs.</p>
                                  </div>
                                  {antdUploadStaged && (
                                    <div className="mt-3 border border-green-500/20 bg-green-500/5 rounded-xl p-2.5 flex items-center justify-between text-xs text-green-700 dark:text-green-400 font-semibold animate-fadeIn">
                                      <span className="truncate">{antdUploadStaged}</span>
                                      <button onClick={() => setAntdUploadStaged(null)} className="text-red-500 border-0 bg-transparent cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* ANTD CHRONOLOGICAL ACTIVITY TIMELINE DOTS */}
                              {comp.id === "timeline" && (
                                <div className="w-full max-w-xs space-y-4 text-left select-none">
                                  {[
                                    { label: "Deployment Successful Node Shard 1", time: "10:42 AM", dot: "bg-green-500" },
                                    { label: "Database Core Architecture Seeded", time: "10:39 AM", dot: "bg-blue-600" },
                                    { label: "Staging Pipeline Verification Sequence Init", time: "09:12 AM", dot: "bg-amber-500" }
                                  ].map((item, idx, arr) => (
                                    <div key={idx} className="flex gap-4 relative pl-1">
                                      {idx !== arr.length - 1 && <div className="absolute left-2.5 top-3 bottom-0 w-px bg-slate-200 dark:bg-zinc-800 -ml-[0.5px]" />}
                                      <div className={`h-2.5 w-2.5 rounded-full mt-1 shrink-0 border-2 border-card relative z-10 ${item.dot}`} />
                                      <div>
                                        <h5 className="text-xs font-bold text-foreground leading-none">{item.label}</h5>
                                        <span className="text-[10px] text-muted-foreground font-mono mt-0.5 block">{item.time}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* ANTD EMPTY INBOX PLACEHOLDER STATS */}
                              {comp.id === "empty" && (
                                <div className="w-full max-w-sm rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 bg-card/10 p-8 text-center select-none">
                                  <div className="h-12 w-12 rounded-full bg-slate-50 dark:bg-zinc-900 flex items-center justify-center mx-auto mb-3 border border-slate-100 dark:border-zinc-800">
                                    <Inbox className="h-5 w-5 text-muted-foreground/60" />
                                  </div>
                                  <h4 className="text-xs font-bold text-foreground">No Historical Architecture Data Tracked</h4>
                                  <p className="text-[11px] text-muted-foreground max-w-xs mx-auto mt-1 leading-relaxed">Adjust configuration rules or change filtering scopes.</p>
                                </div>
                              )}

                              {/* ANTD SPIN SYSTEM INDICATOR MODAL */}
                              {comp.id === "spin" && (
                                <div className="w-full max-w-sm border border-slate-200 dark:border-zinc-800 rounded-xl p-6 bg-card/40 flex flex-col items-center justify-center text-center h-44 select-none">
                                  <Loader2 className="h-7 w-7 text-blue-600 animate-spin mb-2" />
                                  <span className="text-xs font-bold text-blue-600">Resolving Data Parameters...</span>
                                </div>
                              )}

                              {/* ANTD TRANSACTION RESULT COMPACT DISPLAY HEADER */}
                              {comp.id === "result" && (
                                <div className="w-full max-w-md rounded-xl border border-slate-200 dark:border-zinc-800 bg-card p-6 text-center space-y-4 shadow-sm animate-fadeIn">
                                  <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto" />
                                  <div>
                                    <h4 className="text-sm font-extrabold text-foreground">Cluster Synchronization Success</h4>
                                    <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">CDN distribution models executed securely without trace mutations.</p>
                                  </div>
                                </div>
                              )}

                              {/* ANTD OVERLAY CANVAS SHEET SIDE DRAWER */}
                              {comp.id === "drawer" && (
                                <div>
                                  <button onClick={() => setAntdDrawerOpen(true)} className="bg-blue-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl border-0 cursor-pointer shadow">
                                    Trigger Side Drawer Sheet Panel
                                  </button>
                                  {antdDrawerOpen && (
                                    <div className="fixed inset-0 z-50 flex justify-end">
                                      <div onClick={() => setAntdDrawerOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-xs" />
                                      <div className="relative w-80 h-full bg-white dark:bg-zinc-950 border-l border-slate-200 dark:border-zinc-900 p-5 shadow-2xl flex flex-col justify-between animate-fadeIn">
                                        <div className="flex items-center justify-between border-b pb-3">
                                          <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground">Drawer Dashboard Parameters</h4>
                                          <button onClick={() => setAntdDrawerOpen(false)} className="border-0 bg-transparent cursor-pointer text-muted-foreground"><X className="h-4 w-4" /></button>
                                        </div>
                                        <button onClick={() => setAntdDrawerOpen(false)} className="w-full bg-blue-600 text-white py-2 rounded-xl text-xs font-bold border-0 cursor-pointer">Close Drawer</button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* ANTD POPCONFIRM INSIDE ANCHOR TOOLTIP */}
                              {comp.id === "popconfirm" && (
                                <div className="relative inline-block">
                                  <button onClick={() => setAntdPopconfirmOpen(!antdPopconfirmOpen)} className="bg-red-500 hover:bg-red-650 text-white font-bold text-xs py-2.5 px-4 rounded-xl border-0 cursor-pointer shadow">
                                    Purge Workspace Node
                                  </button>
                                  {antdPopconfirmOpen && (
                                    <div className="absolute bottom-[110%] left-1/2 -translate-x-1/2 w-48 rounded-xl border border-border bg-card p-3 shadow-2xl z-50 text-left">
                                      <p className="text-[11px] font-bold text-foreground">Delete cloud cluster instances?</p>
                                      <div className="flex justify-end gap-1 mt-2">
                                        <button onClick={() => setAntdPopconfirmOpen(false)} className="text-[9px] font-bold px-2 py-0.5 bg-muted rounded border-0 cursor-pointer text-foreground">Cancel</button>
                                        <button onClick={() => { setAntdPopconfirmOpen(false); addToast("Database Cleared", "Staging indices removed.", "success"); }} className="text-[9px] font-bold px-2 py-0.5 bg-red-500 text-white border-0 cursor-pointer">Purge</button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* DEFAULT PLACEHOLDER INJECTION WRAPPERS */}
                              {comp.id === "button" && <button className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-xl text-xs border-0 cursor-pointer">Click Me</button>}
                              {comp.id === "input" && <Input placeholder="Input preview template frame..." className="max-w-xs focus-visible:ring-blue-600" />}
                              {comp.id === "checkbox" && <div className="flex items-center gap-2 text-xs font-bold"><input type="checkbox" className="accent-blue-600" /> Verify Component Parameter Actions</div>}
                              {comp.id === "radio" && <div className="flex gap-4 text-xs font-bold"><label className="flex items-center gap-1"><input type="radio" name="r" defaultChecked className="accent-blue-600" /> Option Primary</label></div>}
                              {comp.id === "switch" && <div className="h-5 w-9 bg-blue-600 rounded-full p-0.5 flex justify-end"><div className="h-4 w-4 bg-white rounded-full" /></div>}
                              {comp.id === "rating" && <div className="flex gap-1"><Star className="h-5 w-5 fill-amber-400 stroke-amber-400" /><Star className="h-5 w-5 stroke-muted-foreground" /></div>}
                              {comp.id === "slider" && <input type="range" className="accent-blue-600 w-full max-w-xs" />}
                              {comp.id === "navbar" && <div className="w-full max-w-md border rounded-xl bg-card p-3 flex justify-between text-xs font-bold"><span>Logo</span><span>Docs</span></div>}
                              {comp.id === "breadcrumb" && <div className="text-xs text-muted-foreground">Home &gt; Components &gt; <span className="text-blue-600 font-bold">Timeline</span></div>}
                              {comp.id === "pagination" && <div className="flex gap-1 text-xs"><button className="h-7 px-2.5 border rounded-lg bg-blue-600 text-white font-bold">1</button></div>}
                              {comp.id === "tabs" && <div className="border-b text-xs font-bold text-blue-600 pb-1 border-blue-600">Active Pipeline Node</div>}
                              {comp.id === "card" && <div className="border rounded-xl p-4 w-48 text-left bg-card"><div className="h-2 w-12 bg-blue-600 rounded mb-1" /><div className="h-1.5 w-full bg-muted rounded" /></div>}
                              {comp.id === "statistics" && <div className="text-left"><span className="text-xs text-muted-foreground">Gateway Load</span><h4 className="text-xl font-black">94.2%</h4></div>}
                              {comp.id === "list-group" && <div className="w-48 border rounded-xl bg-card p-2 text-xs text-blue-600 font-bold bg-blue-600/5">Indexed Choice Stack</div>}
                              {comp.id === "table" && <div className="w-48 border rounded-xl bg-card p-2 text-[10px] text-muted-foreground">Tabular visualization canvas</div>}
                              {comp.id === "alert" && <div className="border border-green-500/20 bg-green-500/10 rounded-xl p-3 text-xs text-green-700 dark:text-green-400 font-bold">✓ Parameters Updated</div>}
                              {comp.id === "progress-bar" && <div className="w-40 bg-slate-200 h-2 rounded-full overflow-hidden"><div className="bg-blue-600 h-full w-2/3" /></div>}
                              {comp.id === "toast" && <button onClick={() => addToast("Sync Complete", "CDN channels updated.", "success")} className="bg-blue-600 text-white font-bold text-xs py-2 px-4 rounded-xl border-0 cursor-pointer">Trigger Floating Toast Notification</button>}
                              {comp.id === "modal" && <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white font-bold text-xs py-2 px-4 rounded-xl border-0 cursor-pointer">Launch Modal Window Dialog</button>}
                              {comp.id === "tooltip" && <div className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-semibold border text-foreground">Hover triggers tooltips info boxes</div>}
                              {comp.id === "dropdown" && <button className="border text-xs px-4 py-2 rounded-xl bg-card">Action Configuration Drops</button>}
                              {comp.id === "hero" && <div className="text-center"><h3 className="text-lg font-black text-foreground">Premium Layout Blocks</h3></div>}
                              {comp.id === "metric-card" && <div className="border rounded-xl p-4 bg-card w-40 text-left"><p className="text-[11px] text-muted-foreground">Cluster Core</p><h4 className="text-lg font-bold text-blue-600">Active Node</h4></div>}
                              {comp.id === "skeleton" && <div className="w-40 space-y-2 animate-pulse"><div className="h-3.5 bg-slate-200 dark:bg-zinc-800 rounded w-full" /><div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-5/6" /></div>}
                              {comp.id === "badge" && <span className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">Active</span>}
                              {comp.id === "avatar" && <div className="h-10 w-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">GOAT</div>}

                            </div>
                          </div>
                        </div>
                      ) : (
                        /* CODE PREVIEW GENERATION VIEW */
                        <div className="w-full border border-border rounded-xl bg-card overflow-hidden flex flex-col text-left">
                          <div className="bg-secondary/40 border-b border-border/80 px-4 py-2 flex items-center justify-between text-xs font-semibold select-none">
                            <div className="flex items-center gap-1.5">
                              <Terminal className="h-3.5 w-3.5 text-blue-600" />
                              <span>Production-Ready Modular React Markup File</span>
                            </div>
                            <button
                              onClick={() => handleCopyCode(comp.id, code)}
                              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground font-medium py-1 px-2.5 rounded border border-border/80 bg-background/50 cursor-pointer"
                            >
                              {copiedStates[comp.id] ? <span className="text-green-500 font-bold">Copied!</span> : <span>Copy Snippet Code</span>}
                            </button>
                          </div>
                          <pre className="p-5 overflow-x-auto text-[11px] font-mono leading-relaxed bg-zinc-950 text-zinc-300 min-h-[220px]">
                            <code>{code}</code>
                          </pre>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-border/60 select-none">
                        <button onClick={() => setTab(tab === "preview" ? "code" : "preview")} className="text-xs text-muted-foreground hover:text-foreground border border-border px-3.5 py-1.5 rounded-lg hover:bg-muted font-semibold cursor-pointer">
                          {tab === "preview" ? "View Raw Source Code" : "Return to Live Sandbox Canvas"}
                        </button>
                        <button onClick={() => handleCopyCode(comp.id, code)} className="text-xs bg-blue-600 text-white px-4 py-1.5 rounded-lg font-bold border-0 cursor-pointer hover:bg-blue-700">
                          Copy Structural Code Component
                        </button>
                      </div>
                    </section>
                  );
                })()}
              </div>
            )
          )}

          {/* FLOATING DIALOG CONFIRMATION WINDOW MODAL */}
          <AnimatePresence>
            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-xs" />
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-2xl z-10 text-left border-blue-600/20">
                  <h4 className="text-base font-extrabold text-foreground">Confirm Operation Parameter Inject</h4>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Are you certain you want to commit these deployment parameter targets to production CDN lines?</p>
                  <div className="flex justify-end gap-2 mt-5">
                    <button onClick={() => setIsModalOpen(false)} className="text-xs font-semibold text-slate-500 border border-border px-4 py-2 rounded-lg hover:bg-muted cursor-pointer">Cancel Action</button>
                    <button onClick={() => { setIsModalOpen(false); addToast("Parameters Saved", "Cluster metrics synced successfully.", "success"); }} className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg border-0 cursor-pointer">Approve Change</button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* FLOATING ACTION NOTIFICATION TOAST OVERLAYS */}
          <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
            <AnimatePresence>
              {toasts.map((toast) => (
                <motion.div
                  key={toast.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 rounded-xl border bg-card shadow-xl border-l-4 border-l-green-500 pointer-events-auto flex items-start gap-3 text-left border-border/80"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-foreground">{toast.title}</h5>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{toast.description}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </main>
      </div>
    </Layout>
  );
}