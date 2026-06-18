"use client";

import React, { useState, useEffect, useMemo } from "react";
import Layout from "@/components/Layout";
import { AnimatePresence, motion } from "framer-motion";
import {
  Copy, Check, Laptop, Tablet, Smartphone, Grid, CircleDot,
  Square, Terminal, Eye, Code, ChevronRight, ChevronDown, ChevronLeft,
  Star, Info, AlertTriangle, CheckCircle2, XCircle, MoreHorizontal,
  Search, Settings, HelpCircle, LogOut, Menu, X, Sparkles
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { MagneticButton } from "@/components/goat/MagneticButton";

// Types
interface ComponentItem {
  id: string;
  name: string;
  category: string;
  description: string;
  installationCommand: string;
  tags: string[];
}

// Categories order
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

// All components list
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

// Fully self-contained JSX/Tailwind code generators (No file dependencies imports)
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
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border select-none transition-colors ${variantClasses}">
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
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-950 p-4 space-y-3 flex flex-col text-xs font-semibold text-slate-600 dark:text-slate-400">
          <a href="#features" className="hover:text-blue-600">Features</a>
          <a href="#pricing" className="hover:text-blue-600">Pricing</a>
          <a href="#docs" className="hover:text-blue-600">Docs</a>
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg border-0 font-bold">Get Started</button>
        </div>
      )}
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
        className="h-8 px-3 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-900 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
      >
        Previous
      </button>
      {[1, 2, 3, 4].map((idx) => (
        <button
          key={idx}
          onClick={() => setCurrentPage(idx)}
          className={\`
            h-8 w-8 rounded-xl flex items-center justify-center font-bold transition-all cursor-pointer
            \x24{idx === currentPage 
              ? "bg-blue-600 text-white" 
              : "border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 text-foreground"
            }
          \`}
        >
          {idx}
        </button>
      ))}
      <button 
        onClick={() => setCurrentPage(prev => Math.min(4, prev + 1))}
        disabled={currentPage === 4}
        className="h-8 px-3 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-900 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
      >
        Next
      </button>
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
      ${options.tabsVariant === 'underline' ? `
      <div className="flex border-b border-slate-200 dark:border-zinc-800 text-xs font-semibold gap-4">
        {["tab-1", "tab-2", "tab-3"].map((id, idx) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={\`pb-2 border-b-2 transition-all cursor-pointer \${
              activeTab === id 
                ? "border-blue-600 text-blue-600" 
                : "border-transparent text-slate-500 hover:text-foreground"
            }\`}
          >
            Dashboard \${idx + 1}
          </button>
        ))}
      </div>` : `
      <div className="flex bg-slate-100 dark:bg-zinc-900 p-1 rounded-lg text-xs font-semibold gap-1 max-w-xs">
        {["tab-1", "tab-2", "tab-3"].map((id, idx) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={\`flex-1 py-1.5 rounded-md text-center transition-all cursor-pointer \${
              activeTab === id 
                ? "bg-white dark:bg-zinc-800 text-foreground shadow-sm" 
                : "text-slate-500 hover:text-foreground"
            }\`}
          >
            Option \${idx + 1}
          </button>
        ))}
      </div>`}

      <div className="p-4 border border-slate-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-905 text-xs text-slate-600 dark:text-slate-400">
        {activeTab === "tab-1" && <p>Viewing <strong>Dashboard 1</strong> settings. Deploy and configure active node components.</p>}
        {activeTab === "tab-2" && <p>Viewing <strong>Option 2</strong> settings. Modify layout configurations, grid details, and metrics.</p>}
        {activeTab === "tab-3" && <p>Viewing <strong>Details 3</strong> logs. Fetch database queries, connection settings, and actions.</p>}
      </div>
    </div>
  );
}`;
    }

    case "card": {
      return `import React from 'react';

export default function CustomCard() {
  return (
    <div className="w-full max-w-xs rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 text-left shadow-sm hover:shadow-md transition-all duration-300">
      <div className="h-36 bg-slate-100 dark:bg-zinc-800 rounded-xl mb-4 flex items-center justify-center text-[10px] font-bold text-slate-400">
        IMAGE CANVAS
      </div>
      <div className="space-y-2">
        <span className="inline-block text-[9px] font-bold text-blue-600 uppercase bg-blue-600/10 px-2 py-0.5 rounded">
          Technology
        </span>
        <h4 className="font-bold text-sm text-foreground">Goat Agent Pro</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Deploy and run autonomous software engineers locally with complete sandbox privacy.
        </p>
      </div>
      <button className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow shadow-blue-600/10 border-0 cursor-pointer active:scale-[0.98]">
        Deploy Agent
      </button>
    </div>
  );
}`;
    }

    case "statistics": {
      return `import React from 'react';

export default function CustomStatCard() {
  return (
    <div className="w-full max-w-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 text-left shadow-sm">
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium select-none">Monthly Active Users</p>
      <div className="flex items-baseline gap-2 mt-2">
        <h4 className="text-2xl font-extrabold text-foreground">48,259</h4>
        <span className="text-xs text-green-500 font-bold">
          ▲ +14.2%
        </span>
      </div>
      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 select-none">
        Compared to last calendar month
      </p>
    </div>
  );
}`;
    }

    case "list-group": {
      return `import React, { useState } from 'react';

export default function CustomListGroup() {
  const [activeItem, setActiveItem] = useState("inbox");

  const listItems = [
    { id: "inbox", label: "Inbox Messages", count: 12 },
    { id: "sent", label: "Sent Emails", count: 4 },
    { id: "draft", label: "Draft Proposals", count: 2 }
  ];

  return (
    <div className="w-full max-w-sm rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden text-left shadow-sm">
      {listItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveItem(item.id)}
          className={\`
            w-full flex items-center justify-between px-4 py-3 text-xs font-semibold border-b border-slate-100 dark:border-zinc-900 last:border-b-0 cursor-pointer transition-colors border-0
            \x24{activeItem === item.id 
              ? "bg-blue-600/10 text-blue-600" 
              : "hover:bg-slate-50 dark:hover:bg-zinc-900/50 text-slate-650 dark:text-slate-400"
            }
          \`}
        >
          <span>{item.label}</span>
          <span className={\`
            px-2 py-0.5 rounded-full text-[10px] font-bold
            \x24{activeItem === item.id ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-zinc-800 text-slate-600"}
          \`}>
            {item.count}
          </span>
        </button>
      ))}
    </div>
  );
}`;
    }

    case "table": {
      return `import React from 'react';

export default function CustomUserTable() {
  const users = [
    { id: 1, name: "Sarah Connor", email: "sarah@skynet.ai", role: "Prompt Engineer", status: "Active" },
    { id: 2, name: "John Connor", email: "john@skynet.ai", role: "Architect", status: "Active" },
    { id: 3, name: "T-800", email: "terminator@cyberdyne.org", role: "Security Auditor", status: "Offline" }
  ];

  return (
    <div className="w-full overflow-x-auto border border-slate-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 shadow-sm">
      <table className="w-full border-collapse text-left text-xs">
        <thead>
          <tr className="border-b border-slate-200 dark:border-zinc-850 bg-slate-55 dark:bg-zinc-900 font-semibold text-slate-700 dark:text-slate-300">
            <th className="p-3">User</th>
            <th className="p-3">Role</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-slate-100 dark:border-zinc-800 last:border-b-0 hover:bg-slate-50/50 dark:hover:bg-zinc-900/30 transition-colors">
              <td className="p-3">
                <div>
                  <div className="font-semibold text-foreground">{user.name}</div>
                  <div className="text-[10px] text-muted-foreground">{user.email}</div>
                </div>
              </td>
              <td className="p-3 text-muted-foreground">{user.role}</td>
              <td className="p-3">
                <span className={\`px-2 py-0.5 rounded-full text-[10px] font-bold \x24{
                  user.status === "Active" 
                    ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" 
                    : "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400"
                }\`}>
                  {user.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`;
    }

    case "alert": {
      const styles = {
        success: { border: "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-400", title: "Action Successful" },
        info: { border: "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400", title: "Information Update" },
        warning: { border: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400", title: "Quota Notice" },
        danger: { border: "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400", title: "Authentication Error" }
      }[options.alertVariant as string] || { border: "border-blue-500/20 bg-blue-500/10", title: "Notice" };

      return `import React from 'react';

export default function CustomAlertBanner() {
  return (
    <div className="w-full max-w-md flex items-start gap-3 rounded-xl border p-4 text-xs ${styles.border}">
      <div>
        <strong className="font-bold block mb-0.5">${styles.title}</strong>
        <span>Your configuration parameter updates have been applied automatically.</span>
      </div>
    </div>
  );
}`;
    }

    case "progress-bar": {
      return `import React from 'react';

export default function CustomProgress() {
  return (
    <div className="w-full max-w-sm space-y-2 text-left">
      <div className="flex justify-between text-xs font-semibold">
        <span className="text-foreground">Downloading assets...</span>
        <span className="text-blue-600">${options.progressValue}%</span>
      </div>
      <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-3 overflow-hidden border border-slate-200 dark:border-zinc-800/80">
        <div 
          className="bg-blue-600 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(37,99,235,0.2)]"
          style={{ width: "${options.progressValue}%" }}
        />
      </div>
    </div>
  );
}`;
    }

    case "toast": {
      return `import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function CustomToastDemo() {
  const [toasts, setToasts] = useState([]);

  const addToast = (title, desc) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, desc }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={() => addToast("Saved", "Settings configured.")}
        className="bg-blue-600 text-white font-medium py-2.5 px-4 rounded-xl text-xs hover:bg-blue-700 transition-colors cursor-pointer border-0"
      >
        Trigger Success Toast
      </button>

      {/* Floating Stack */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl border-l-4 border-l-green-500 flex items-start gap-3 text-left transition-all duration-200"
          >
            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-foreground">{toast.title}</h5>
              <p className="text-[10px] text-muted-foreground mt-0.5">{toast.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}`;
    }

    case "modal": {
      return `import React, { useState } from 'react';

export default function CustomModalDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-colors shadow border-0 cursor-pointer"
      >
        Open Confirmation Dialog
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsOpen(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Modal Container */}
          <div className="relative w-full max-w-sm rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-2xl z-10 text-left">
            <h4 className="text-base font-bold text-foreground">Confirm Action</h4>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Are you sure you want to deploy active webhooks? This updates server hooks immediately.
            </p>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-slate-500 border border-slate-200 dark:border-zinc-800 px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors border-0 cursor-pointer"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`;
    }

    case "tooltip": {
      const positionStyles = {
        top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
        left: "right-full top-1/2 -translate-y-1/2 mr-2",
        right: "left-full top-1/2 -translate-y-1/2 ml-2"
      }[options.tooltipSide as string] || "bottom-full left-1/2 -translate-x-1/2 mb-2";

      return `import React from 'react';

export default function CustomTooltip() {
  return (
    <div className="relative inline-block group">
      <button className="bg-slate-100 hover:bg-slate-200 dark:bg-zinc-850 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-zinc-800 text-foreground cursor-pointer">
        Hover trigger
      </button>
      <div className="absolute hidden group-hover:block bg-zinc-950 text-zinc-100 text-[10px] font-semibold py-1.5 px-2.5 rounded-lg shadow-md whitespace-nowrap z-20 pointer-events-none ${positionStyles}">
        Context info details
      </div>
    </div>
  );
}`;
    }

    case "dropdown": {
      return `import React, { useState } from 'react';
import { ChevronDown, Settings, HelpCircle, LogOut } from 'lucide-react';

export default function CustomDropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left select-none">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 text-foreground text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
      >
        Menu Options
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-1 shadow-lg z-20">
          <button className="w-full text-xs text-slate-700 dark:text-slate-300 px-3 py-2 hover:bg-blue-600 hover:text-white rounded-lg text-left flex items-center gap-2 cursor-pointer border-0">
            <Settings className="h-3.5 w-3.5" /> Configuration
          </button>
          <button className="w-full text-xs text-slate-700 dark:text-slate-300 px-3 py-2 hover:bg-blue-600 hover:text-white rounded-lg text-left flex items-center gap-2 cursor-pointer border-0">
            <HelpCircle className="h-3.5 w-3.5" /> Help Docs
          </button>
          <div className="h-px bg-slate-100 dark:bg-zinc-800 my-1" />
          <button className="w-full text-xs text-red-500 px-3 py-2 hover:bg-red-650 hover:text-white rounded-lg text-left flex items-center gap-2 cursor-pointer border-0">
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      )}
    </div>
  );
}`;
    }

    case "accordion": {
      return `import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function CustomAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  const Accordionitems = [
    { title: "Is it accessible?", desc: "Yes, our designs support WAI-ARIA specs." },
    { title: "Can I customize the colors?", desc: "Yes, fully styled with standard Tailwind config classes." }
  ];

  return (
    <div className="w-full max-w-sm rounded-xl border border-slate-200 dark:border-zinc-800 p-2 space-y-1">
      {Accordionitems.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} className="rounded-lg border border-slate-100 dark:border-zinc-800/85 overflow-hidden animate-fadeIn">
            <button
              onClick={() => setOpenIndex(isOpen ? -1 : idx)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-zinc-900 cursor-pointer border-0 bg-transparent text-foreground"
            >
              <span>{item.title}</span>
              <ChevronDown className={\`h-3.5 w-3.5 transition-transform duration-200 \${isOpen ? "rotate-180" : ""}\`} />
            </button>
            {isOpen && (
              <div className="p-3 bg-slate-50/50 dark:bg-zinc-900/10 text-xs text-slate-500 border-t border-slate-100 dark:border-zinc-800/40">
                {item.desc}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}`;
    }

    case "hero": {
      return `import React from 'react';

export default function CustomHeroSection() {
  return (
    <div className="w-full max-w-xl rounded-xl border border-slate-200 dark:border-zinc-800 p-6 md:p-8 text-center space-y-4 shadow bg-white dark:bg-zinc-950">
      <span className="inline-block text-[9px] font-bold text-blue-600 uppercase bg-blue-600/10 px-2.5 py-1 rounded-full">
        Goat UI v1.0
      </span>
      <h3 className="text-2xl font-extrabold text-foreground leading-tight">
        Build High-Performance Interfaces
      </h3>
      <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
        Copy-paste Tailwind blocks designed for local speed, responsiveness, and premium styling defaults.
      </p>
      <div className="flex justify-center gap-3 pt-2">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-xs transition-colors border-0 cursor-pointer">
          Get Started
        </button>
        <button className="border border-slate-200 dark:border-zinc-800 text-foreground font-semibold py-2 px-4 rounded-lg text-xs transition-colors hover:bg-slate-50 dark:hover:bg-zinc-900 cursor-pointer">
          Learn More
        </button>
      </div>
    </div>
  );
}`;
    }

    case "metric-card": {
      return `import React from 'react';

export default function CustomMetricCard() {
  const chartBars = [20, 32, 28, 45, 38, 56, 42, 60, 48];

  return (
    <div className="w-full max-w-xs rounded-xl border border-slate-200 dark:border-zinc-800 p-5 bg-white dark:bg-zinc-900 text-left shadow space-y-4">
      <p className="text-xs text-slate-500 font-medium">Server CPU Usage</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-3xl font-extrabold text-foreground">42.8%</h4>
        <span className="text-[10px] text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded">
          Healthy
        </span>
      </div>
      
      <div className="flex items-end gap-1.5 h-10 select-none pt-2">
        {chartBars.map((val, idx) => (
          <div 
            key={idx} 
            className="bg-blue-600/20 hover:bg-blue-600 rounded-sm flex-1 transition-colors h-full"
            style={{ height: \`\${val}%\` }}
          />
        ))}
      </div>
    </div>
  );
}`;
    }

    case "skeleton": {
      return `import React from 'react';

export default function CustomProfileSkeleton() {
  return (
    <div className="w-full max-w-xs space-y-3 animate-pulse p-3 border border-slate-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-zinc-800" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-2/3" />
          <div className="h-2.5 bg-slate-200 dark:bg-zinc-800 rounded w-1/2" />
        </div>
      </div>
      <div className="h-2.5 bg-slate-200 dark:bg-zinc-800 rounded w-full mt-2" />
      <div className="h-2.5 bg-slate-200 dark:bg-zinc-800 rounded w-5/6" />
    </div>
  );
}`;
    }

    default:
      return ``;
  }
};

// Component Card Thumbnail Renderers (MiniPreview)
const MiniPreview = ({ id }: { id: string }) => {
  switch (id) {
    case "button":
      return <div className="h-6 w-16 bg-blue-600 rounded flex items-center justify-center text-[8px] font-bold text-white shadow-sm shadow-blue-600/10">Click</div>;
    case "badge":
      return <div className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[8px] font-bold">New</div>;
    case "avatar":
      return (
        <div className="flex -space-x-1.5 animate-fadeIn">
          <div className="h-6 w-6 rounded-full border border-card bg-slate-350 dark:bg-zinc-800" />
          <div className="h-6 w-6 rounded-full border border-card bg-blue-600 text-[8px] font-bold text-white flex items-center justify-center animate-fadeIn">A</div>
        </div>
      );
    case "input":
      return <div className="h-6 w-24 border border-border rounded bg-card px-1.5 flex items-center text-[7px] text-muted-foreground select-none">Search...</div>;
    case "checkbox":
      return <div className="h-4 w-4 border border-blue-600 bg-blue-600 rounded-sm flex items-center justify-center text-[8px] text-white">✓</div>;
    case "radio":
      return (
        <div className="flex gap-2.5">
          <div className="h-3.5 w-3.5 rounded-full border border-blue-600 flex items-center justify-center"><div className="h-1.5 w-1.5 bg-blue-600 rounded-full" /></div>
          <div className="h-3.5 w-3.5 rounded-full border border-border" />
        </div>
      );
    case "switch":
      return <div className="h-4.5 w-8 rounded-full bg-blue-600 p-0.5 flex justify-end"><div className="h-3.5 w-3.5 rounded-full bg-white" /></div>;
    case "rating":
      return (
        <div className="flex gap-0.5">
          {[1, 2, 3].map(i => <Star key={i} className="h-2.5 w-2.5 fill-amber-400 stroke-amber-400" />)}
          <Star className="h-2.5 w-2.5 stroke-muted-foreground" />
        </div>
      );
    case "navbar":
      return (
        <div className="w-full max-w-[140px] border border-border rounded bg-card p-1 flex items-center justify-between text-[6px]">
          <div className="font-bold flex items-center gap-1"><div className="h-2 w-2 rounded bg-blue-600" />Logo</div>
          <div className="flex gap-1.5 text-muted-foreground"><span>Link</span><span>Link</span></div>
        </div>
      );
    case "breadcrumb":
      return <div className="text-[7px] text-muted-foreground font-medium">Home &gt; Docs &gt; <span className="text-blue-600 font-semibold">Inputs</span></div>;
    case "pagination":
      return (
        <div className="flex gap-1 select-none">
          <div className="h-4 w-4 rounded border border-border flex items-center justify-center text-[6px]">&lt;</div>
          <div className="h-4 w-4 rounded bg-blue-600 text-white flex items-center justify-center text-[6px] font-bold">2</div>
          <div className="h-4 w-4 rounded border border-border flex items-center justify-center text-[6px]">&gt;</div>
        </div>
      );
    case "tabs":
      return (
        <div className="flex border-b border-border text-[6px] gap-2 w-full max-w-[100px]">
          <span className="border-b border-blue-600 text-blue-600 pb-0.5 font-bold">Tab 1</span>
          <span className="text-muted-foreground pb-0.5">Tab 2</span>
        </div>
      );
    case "card":
      return (
        <div className="w-20 border border-border rounded bg-card p-1.5 space-y-1">
          <div className="h-1.5 w-10 bg-blue-600 rounded" />
          <div className="h-1 w-12 bg-muted rounded" />
          <div className="h-1 w-8 bg-muted rounded" />
        </div>
      );
    case "statistics":
      return (
        <div className="text-center">
          <div className="text-[12px] font-bold text-foreground">$12,450</div>
          <div className="text-[6px] text-green-500 font-semibold flex items-center justify-center gap-0.5">▲ +12%</div>
        </div>
      );
    case "list-group":
      return (
        <div className="w-20 border border-border rounded bg-card overflow-hidden">
          <div className="h-3.5 border-b border-border bg-blue-500/10 text-blue-600 text-[6px] flex items-center px-1 font-semibold">Selected</div>
          <div className="h-3.5 text-[6px] flex items-center px-1 text-muted-foreground">Item Choice</div>
        </div>
      );
    case "table":
      return (
        <div className="w-20 border border-border rounded bg-card flex flex-col gap-0.5 p-1">
          <div className="h-1 bg-muted rounded w-full" />
          <div className="h-1.5 bg-blue-600/10 rounded w-full" />
          <div className="h-1 bg-muted rounded w-full" />
        </div>
      );
    case "alert":
      return <div className="w-24 border border-green-500/20 bg-green-500/10 rounded p-1 text-[6px] text-green-700 dark:text-green-400 font-medium">✓ Updated</div>;
    case "progress-bar":
      return (
        <div className="w-20 bg-slate-200 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
          <div className="bg-blue-600 h-full w-3/5" />
        </div>
      );
    case "toast":
      return <div className="w-20 border border-border rounded bg-card p-1 shadow-md text-[6px] absolute bottom-1.5 right-1.5 border-l-2 border-l-green-500 flex items-center gap-1 animate-pulse">✓ Saved</div>;
    case "modal":
      return (
        <div className="w-24 border border-border rounded-lg bg-card p-1.5 shadow-xl relative scale-95 border-blue-600/20">
          <div className="h-1 w-10 bg-muted rounded mb-1" />
          <div className="h-2 w-16 bg-blue-600/10 rounded" />
        </div>
      );
    case "tooltip":
      return (
        <div className="flex flex-col items-center">
          <div className="px-1.5 py-0.5 bg-zinc-850 dark:bg-zinc-800 text-white rounded text-[5px] shadow relative z-10">Tooltip</div>
          <div className="h-1 w-1.5 bg-zinc-850 dark:bg-zinc-800 rotate-45 -mt-0.5" />
        </div>
      );
    case "dropdown":
      return (
        <div className="w-16 border border-border rounded bg-card p-0.5 shadow-md flex flex-col gap-0.5">
          <div className="h-2 w-12 bg-blue-600/10 rounded" />
          <div className="h-2 w-8 bg-muted rounded" />
        </div>
      );
    case "hero":
      return (
        <div className="text-center px-2">
          <div className="h-2 w-16 bg-blue-600 rounded mx-auto mb-1" />
          <div className="h-1 w-20 bg-muted rounded mx-auto" />
        </div>
      );
    case "metric-card":
      return (
        <div className="w-20 border border-border rounded bg-card p-1.5 space-y-1">
          <div className="h-1 w-12 bg-muted rounded" />
          <div className="h-4 bg-blue-600/10 rounded flex items-center justify-center text-[7px] text-blue-600 font-bold">98.2%</div>
        </div>
      );
    case "skeleton":
      return (
        <div className="w-20 space-y-1 animate-pulse">
          <div className="h-2 bg-slate-200 dark:bg-zinc-800 rounded w-full" />
          <div className="h-1.5 bg-slate-200 dark:bg-zinc-800 rounded w-5/6" />
        </div>
      );
    default:
      return null;
  }
};

export default function ComponentsGalleryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // activeComponent is null initially (displays the full Overview Grid)
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  
  const [activeTabs, setActiveTabs] = useState<Record<string, "preview" | "code">>({});
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [copiedInstall, setCopiedInstall] = useState<Record<string, boolean>>({});
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "Foundation": true,
    "Forms": true,
    "Navigation": true,
    "Data Display": true,
    "Feedback": true,
    "Overlay": true,
    "Marketing": true,
    "Dashboard": true,
    "Utilities": true
  });

  // Canvas background and width layout variables
  const [canvasBg, setCanvasBg] = useState<"grid" | "dot" | "solid">("grid");
  const [canvasWidth, setCanvasWidth] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // Options configurations mapping states
  const [options, setOptions] = useState({
    // Button
    btnVariant: "primary",
    btnSize: "default",
    btnLoading: false,
    btnDisabled: false,
    // Input
    inputType: "text",
    inputPlaceholder: "Enter your email...",
    inputDisabled: false,
    inputHasError: false,
    // Checkbox
    chkChecked: false,
    chkDisabled: false,
    // Radio
    radioLayout: "vertical",
    radioDisabled: false,
    // Switch
    switchChecked: false,
    switchDisabled: false,
    // Rating
    ratingValue: 4,
    // Breadcrumb
    breadSeparator: "chevron",
    // Tabs
    tabsVariant: "underline",
    // Progress bar
    progressValue: 60,
    // Toast
    toastVariant: "success",
    // Tooltip
    tooltipSide: "top",
    // Badge
    badgeVariant: "default",
    badgeLabel: "New",
    // Avatar
    avatarSize: "md",
    avatarStatus: "online",
    // Alert
    alertVariant: "success",
  });

  // Local state alerts toast lists
  const [toasts, setToasts] = useState<Array<{ id: number; title: string; description: string; variant: string }>>([]);

  // Local state for modal showcase
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Local component interactive variables
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState<number | null>(0);
  const [activeTabSelect, setActiveTabSelect] = useState("tab-1");
  const [listGroupActive, setListGroupActive] = useState("inbox");
  const [tableHoveredRow, setTableHoveredRow] = useState<number | null>(null);

  const updateOption = (key: string, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedStates(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const handleCopyInstall = (id: string, cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedInstall(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedInstall(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  // Toast trigger helper
  const addToast = (title: string, description: string, variant: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, description, variant }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3050);
  };

  // Filter components list instantly
  const filteredComponents = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return ALL_COMPONENTS;
    return ALL_COMPONENTS.filter(comp => {
      return (
        comp.name.toLowerCase().includes(query) ||
        comp.category.toLowerCase().includes(query) ||
        comp.description.toLowerCase().includes(query) ||
        comp.tags.some(tag => tag.toLowerCase().includes(query))
      );
    });
  }, [searchQuery]);

  // Group filtered components by category
  const categoryGroups = useMemo(() => {
    const groups: Record<string, ComponentItem[]> = {};
    filteredComponents.forEach(comp => {
      if (!groups[comp.category]) {
        groups[comp.category] = [];
      }
      groups[comp.category].push(comp);
    });
    return groups;
  }, [filteredComponents]);

  // Smooth scroll / component view selection handler
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

  // URL Hash on mount
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const id = window.location.hash.replace("#", "");
      if (id && ALL_COMPONENTS.some(c => c.id === id)) {
        setActiveComponent(id);
      } else {
        setActiveComponent(null);
      }
    }
  }, []);

  // Expand / collapse category in sidebar
  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  // Width container configurations
  const widthClasses = {
    desktop: "w-full max-w-full",
    tablet: "w-full max-w-[768px]",
    mobile: "w-full max-w-[375px]"
  };

  // Retrieve currently selected component details
  const selectedComponentDetails = useMemo(() => {
    if (!activeComponent) return null;
    return ALL_COMPONENTS.find(comp => comp.id === activeComponent) || null;
  }, [activeComponent]);

  return (
    <Layout>
      <div className="flex-1 flex flex-col md:flex-row bg-background text-foreground min-h-[calc(100vh-4rem)]">
        
        {/* ====================================================
            SIDEBAR (LEFT)
            ==================================================== */}
        <aside className="hidden md:block w-72 shrink-0 border-r border-border bg-card/10 sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto z-20">
          <div className="p-5 space-y-6 font-sans">
            
            {/* Instant Search input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Filter components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs rounded-lg bg-card/60 focus-visible:ring-blue-600 border-border"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-[10px] text-muted-foreground hover:text-foreground font-semibold px-1 rounded hover:bg-muted border-0 cursor-pointer bg-transparent"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Home Overview Trigger */}
            <button
              onClick={() => handleComponentClick("overview")}
              className={`
                w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-left font-bold transition-all cursor-pointer border-0 bg-transparent
                ${activeComponent === null 
                  ? "bg-blue-600/10 text-blue-600" 
                  : "text-slate-700 dark:text-slate-300 hover:bg-muted hover:text-foreground"
                }
              `}
            >
              <Grid className="h-4 w-4" />
              <span>Overview Grid</span>
            </button>

            {/* Sticky categories list */}
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
                      {isExpanded ? (
                        <ChevronDown className="h-3 w-3 transition-transform" />
                      ) : (
                        <ChevronRight className="h-3 w-3 transition-transform" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="flex flex-col gap-0.5 pl-1.5 mt-0.5 border-l border-border/60 ml-2 animate-fadeIn">
                        {items.map((item) => {
                          const active = activeComponent === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleComponentClick(item.id)}
                              className={`
                                w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-left transition-all cursor-pointer border-0 bg-transparent
                                ${active 
                                  ? "bg-blue-600/10 text-blue-600 font-semibold" 
                                  : "text-slate-500 dark:text-slate-400 hover:bg-muted hover:text-foreground"
                                }
                              `}
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

        {/* ====================================================
            CONTENT AREA (RIGHT)
            ==================================================== */}
        <main className="flex-1 flex flex-col p-6 md:p-10 min-w-0 bg-background/50 relative">
          
          {/* Header Title Section - Only shown on Overview Grid */}
          {activeComponent === null && (
            <div className="max-w-7xl mx-auto w-full mb-8 space-y-4">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Showcase</span>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                  Components Gallery
                </h1>
                <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  Explore our minimal, clean, and premium UI components library designed with Blue theme. Adjust props in real-time, inspect code variants, and copy-paste components instantly.
                </p>
              </div>

              {/* Mobile Search input bar */}
              <div className="block md:hidden relative max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search components..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-xs rounded-lg focus-visible:ring-blue-600"
                />
              </div>
            </div>
          )}
          
          {/* Global Preview Controls for Interactive Previews - Only shown when a component is selected */}
          {activeComponent !== null && (
            <div className="max-w-7xl mx-auto w-full mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-card/40 border border-border/80 rounded-xl p-3.5 backdrop-blur-sm shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Canvas Customizer:</span>
                </div>
                <div className="flex items-center gap-3">
                  {/* Canvas Background Controls */}
                  <div className="flex items-center gap-0.5 rounded-lg border border-border bg-card p-0.5 shadow-sm">
                    <button
                      onClick={() => setCanvasBg("grid")}
                      className={`p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors cursor-pointer border-0 bg-transparent ${canvasBg === "grid" ? "bg-muted text-foreground" : ""}`}
                      title="Grid Background"
                    >
                      <Grid className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setCanvasBg("dot")}
                      className={`p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors cursor-pointer border-0 bg-transparent ${canvasBg === "dot" ? "bg-muted text-foreground" : ""}`}
                      title="Dot Background"
                    >
                      <CircleDot className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setCanvasBg("solid")}
                      className={`p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors cursor-pointer border-0 bg-transparent ${canvasBg === "solid" ? "bg-muted text-foreground" : ""}`}
                      title="Solid Background"
                    >
                      <Square className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Sizing Controls */}
                  <div className="flex items-center gap-0.5 rounded-lg border border-border bg-card p-0.5 shadow-sm">
                    <button
                      onClick={() => setCanvasWidth("desktop")}
                      className={`p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors cursor-pointer border-0 bg-transparent ${canvasWidth === "desktop" ? "bg-muted text-foreground" : ""}`}
                      title="Desktop"
                    >
                      <Laptop className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setCanvasWidth("tablet")}
                      className={`p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors cursor-pointer border-0 bg-transparent ${canvasWidth === "tablet" ? "bg-muted text-foreground" : ""}`}
                      title="Tablet Sizing"
                    >
                      <Tablet className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setCanvasWidth("mobile")}
                      className={`p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors cursor-pointer border-0 bg-transparent ${canvasWidth === "mobile" ? "bg-muted text-foreground" : ""}`}
                      title="Mobile Sizing"
                    >
                      <Smartphone className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              VIEW CONDITION 1: OVERVIEW GRID
              ==================================================== */}
          {activeComponent === null ? (
            <div className="max-w-7xl mx-auto w-full mb-16 space-y-6 animate-fadeIn">
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Grid className="h-5 w-5 text-blue-600" />
                Overview Grid
              </h2>
              
              {filteredComponents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {filteredComponents.map((comp) => (
                    <div key={comp.id} className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 hover:border-blue-600/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                      <div className="space-y-3">
                        {/* Component Mini Preview Frame */}
                        <div className="h-28 rounded-lg border border-border/80 bg-slate-50 dark:bg-zinc-900/50 flex items-center justify-center overflow-hidden relative group-hover:bg-blue-600/5 transition-colors">
                          <MiniPreview id={comp.id} />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                            {comp.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                            {comp.description}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleComponentClick(comp.id)}
                        className="mt-4 w-full flex items-center justify-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 border border-blue-600/20 dark:border-blue-400/20 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 py-2 rounded-lg transition-all active:scale-[0.98] cursor-pointer"
                      >
                        View Component
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 border border-dashed border-border rounded-xl bg-card/20">
                  <HelpCircle className="h-10 w-10 text-muted-foreground/60 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-foreground">No components found matching your filters</p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-3 text-xs text-blue-600 hover:underline font-semibold border-0 cursor-pointer bg-transparent"
                  >
                    Reset search query
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ====================================================
                VIEW CONDITION 2: INDIVIDUAL DETAILED SHOWCASE
                ==================================================== */
            selectedComponentDetails && (
              <div className="max-w-7xl mx-auto w-full space-y-6 animate-fadeIn text-left">
                {/* Back button link */}
                <button
                  onClick={() => handleComponentClick("overview")}
                  className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold mb-2 hover:underline cursor-pointer border-0 bg-transparent p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to Overview Grid
                </button>

                {(() => {
                  const comp = selectedComponentDetails;
                  const tab = activeTabs[comp.id] || "preview";
                  const setTab = (t: "preview" | "code") => {
                    setActiveTabs(prev => ({ ...prev, [comp.id]: t }));
                  };

                  const code = getGeneratedCodeForComponent(comp.id, options);
                  const isCopied = copiedStates[comp.id] || false;
                  const isInstallCopied = copiedInstall[comp.id] || false;

                  return (
                    <section
                      id={comp.id}
                      tabIndex={-1}
                      className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-6 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-600/30"
                    >
                      {/* Header metadata */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-600/10 px-2 py-0.5 rounded select-none">
                              {comp.category}
                            </span>
                            <span className="text-muted-foreground/40 text-xs">/</span>
                            <span className="text-xs text-muted-foreground font-medium">{comp.id}</span>
                          </div>
                          <h3 className="text-xl font-bold tracking-tight mt-1 text-foreground">
                            {comp.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed">
                            {comp.description}
                          </p>
                        </div>

                        {/* Copy Installation Command */}
                        <div className="flex items-center gap-1.5 self-start sm:self-auto select-none">
                          <div className="flex items-center border border-border bg-slate-50 dark:bg-zinc-900/40 rounded-lg p-0.5 pr-2 gap-1 text-[11px] font-mono text-muted-foreground">
                            <span className="bg-muted px-2 py-1 rounded text-foreground font-medium select-none">add</span>
                            <span className="px-1.5">{comp.id}</span>
                            <button
                              onClick={() => handleCopyInstall(comp.id, comp.installationCommand)}
                              className="hover:text-foreground transition-colors p-1 cursor-pointer border-0 bg-transparent"
                              title="Copy install command"
                            >
                              {isInstallCopied ? (
                                <Check className="h-3 w-3 text-green-500" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Component Preview / Code Canvas tab bar */}
                      <div className="flex border-b border-border text-xs font-semibold gap-1 select-none">
                        <button
                          onClick={() => setTab("preview")}
                          className={`px-4 py-2 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer border-0 bg-transparent ${
                            tab === "preview" 
                              ? "border-blue-600 text-blue-600" 
                              : "border-transparent text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Live Preview
                        </button>
                        <button
                          onClick={() => setTab("code")}
                          className={`px-4 py-2 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer border-0 bg-transparent ${
                            tab === "code" 
                              ? "border-blue-600 text-blue-600" 
                              : "border-transparent text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Code className="h-3.5 w-3.5" />
                          Code View
                        </button>
                      </div>

                      {/* Sandbox rendering canvas */}
                      {tab === "preview" ? (
                        <div className="space-y-6">
                          
                          {/* Active Showcase Frame */}
                          <div className="w-full flex items-center justify-center">
                            <div 
                              className={`
                                h-full min-h-[300px] border border-border rounded-xl flex items-center justify-center p-6 md:p-8 transition-all duration-300 relative overflow-hidden bg-card/25 shadow-sm
                                ${widthClasses[canvasWidth]}
                                ${canvasBg === "grid" ? "bg-grid" : canvasBg === "dot" ? "bg-dot" : "bg-card/20"}
                              `}
                            >
                              
                              {/* ================= BUTTON PREVIEW ================= */}
                              {comp.id === "button" && (
                                <div className="flex flex-wrap items-center justify-center gap-4">
                                  <button
                                    onClick={() => alert("Button Clicked!")}
                                    disabled={options.btnDisabled}
                                    className={`
                                      inline-flex items-center justify-center font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 duration-200 disabled:opacity-50 disabled:pointer-events-none
                                      ${{
                                        primary: "bg-blue-600 hover:bg-blue-700 text-white shadow focus:ring-blue-600",
                                        secondary: "bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-foreground focus:ring-slate-500 shadow-sm",
                                        outline: "border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 text-foreground focus:ring-slate-500",
                                        ghost: "hover:bg-slate-100 dark:hover:bg-zinc-800 text-foreground focus:ring-slate-500",
                                        gradient: "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow focus:ring-blue-600",
                                        neon: "border border-blue-500 text-blue-500 bg-transparent hover:bg-blue-500/10 focus:ring-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.2)] hover:shadow-[0_0_15px_rgba(37,99,235,0.4)]",
                                        glass: "bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/10 text-foreground shadow hover:bg-white/30"
                                      }[options.btnVariant] || "bg-blue-600 text-white"}
                                      ${{
                                        default: "px-5 py-2.5 text-sm rounded-xl",
                                        sm: "px-3.5 py-1.5 text-xs rounded-lg",
                                        lg: "px-6 py-3.5 text-base rounded-xl",
                                        icon: "p-2.5 rounded-xl"
                                      }[options.btnSize] || "px-5 py-2.5 text-sm"}
                                    `}
                                  >
                                    {options.btnLoading && <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
                                    {options.btnSize === "icon" ? <Sparkles className="h-4.5 w-4.5" /> : "Click Me"}
                                  </button>
                                  
                                  <MagneticButton
                                    magneticStrength={0.35}
                                    glowColor="rgba(37, 99, 235, 0.2)"
                                    onClick={() => alert("Magnetic Glow Button Clicked!")}
                                  >
                                    ⚡ Magnetic Glow
                                  </MagneticButton>
                                </div>
                              )}

                              {/* ================= INPUT PREVIEW ================= */}
                              {comp.id === "input" && (
                                <div className="w-full max-w-sm space-y-2.5">
                                  <div className="space-y-1.5 text-left">
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-350">Email Address</label>
                                    <input
                                      type={options.inputType}
                                      placeholder={options.inputPlaceholder}
                                      disabled={options.inputDisabled}
                                      className={`flex h-10 w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50 ${options.inputHasError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                    />
                                    {options.inputHasError ? (
                                      <p className="text-[11px] text-red-500 font-medium">Please enter a valid email address.</p>
                                    ) : (
                                      <p className="text-[11px] text-muted-foreground">We'll never share your data.</p>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* ================= CHECKBOX PREVIEW ================= */}
                              {comp.id === "checkbox" && (
                                <div className="flex items-center gap-2.5 text-left select-none">
                                  <input
                                    type="checkbox"
                                    id={`chk-${comp.id}`}
                                    checked={options.chkChecked}
                                    disabled={options.chkDisabled}
                                    onChange={(e) => updateOption("chkChecked", e.target.checked)}
                                    className="h-5 w-5 rounded border-slate-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-600 accent-blue-650 cursor-pointer disabled:cursor-not-allowed"
                                  />
                                  <label
                                    htmlFor={`chk-${comp.id}`}
                                    className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none disabled:opacity-50"
                                  >
                                    Accept Terms of Service
                                  </label>
                                </div>
                              )}

                              {/* ================= RADIO PREVIEW ================= */}
                              {comp.id === "radio" && (
                                <div className={`w-full max-w-sm ${options.radioLayout === "horizontal" ? "flex items-center justify-center gap-6" : "flex flex-col gap-3"} text-left`}>
                                  {[
                                    { id: "starter", name: "Starter Tier", price: "Free" },
                                    { id: "pro", name: "Professional", price: "$19/mo" }
                                  ].map(item => (
                                    <label
                                      key={item.id}
                                      className={`
                                        flex items-center justify-between rounded-xl border p-3.5 cursor-pointer transition-all active:scale-[0.99] select-none
                                        ${options.radioDisabled ? "opacity-60 cursor-not-allowed" : ""}
                                        ${options.radioLayout === "vertical" ? "w-full" : "w-1/2"}
                                        ${item.id === "pro" ? "border-blue-600 bg-blue-600/5 shadow-sm" : "border-slate-200 dark:border-zinc-800"}
                                      `}
                                    >
                                      <div className="flex items-center gap-3">
                                        <input
                                          type="radio"
                                          name="billing-tier"
                                          disabled={options.radioDisabled}
                                          defaultChecked={item.id === "pro"}
                                          className="h-4 w-4 border-slate-305 text-blue-600 focus:ring-blue-600 accent-blue-600 cursor-pointer"
                                        />
                                        <span className="text-xs font-semibold text-foreground">{item.name}</span>
                                      </div>
                                      <span className="text-xs font-bold text-blue-600">{item.price}</span>
                                    </label>
                                  ))}
                                </div>
                              )}

                              {/* ================= SWITCH PREVIEW ================= */}
                              {comp.id === "switch" && (
                                <div className="flex items-center gap-3 text-left">
                                  <button
                                    role="switch"
                                    disabled={options.switchDisabled}
                                    aria-checked={options.switchChecked}
                                    onClick={() => updateOption("switchChecked", !options.switchChecked)}
                                    className={`
                                      relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600
                                      ${options.switchChecked ? "bg-blue-600" : "bg-slate-200 dark:bg-zinc-800"}
                                      ${options.switchDisabled ? "opacity-50 cursor-not-allowed" : ""}
                                    `}
                                  >
                                    <span
                                      className={`
                                        pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out
                                        ${options.switchChecked ? "translate-x-5" : "translate-x-0"}
                                      `}
                                    />
                                  </button>
                                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 select-none">
                                    Dark Mode Settings
                                  </span>
                                </div>
                              )}

                              {/* ================= RATING PREVIEW ================= */}
                              {comp.id === "rating" && (
                                <div className="flex flex-col items-center gap-2">
                                  <div className="flex items-center gap-1 select-none">
                                    {[1, 2, 3, 4, 5].map((val) => (
                                      <button
                                        key={val}
                                        onClick={() => updateOption("ratingValue", val)}
                                        className="p-1 hover:scale-115 transition-transform cursor-pointer border-0 bg-transparent text-foreground"
                                      >
                                        <Star 
                                          className={`h-6 w-6 transition-all ${
                                            val <= options.ratingValue 
                                              ? "fill-amber-400 stroke-amber-400 text-amber-400" 
                                              : "stroke-slate-400 text-transparent"
                                          }`}
                                        />
                                      </button>
                                    ))}
                                  </div>
                                  <span className="text-xs font-semibold text-muted-foreground select-none">
                                    Score: {options.ratingValue} / 5.0
                                  </span>
                                </div>
                              )}

                              {/* ================= NAVBAR PREVIEW ================= */}
                              {comp.id === "navbar" && (
                                <div className="w-full max-w-xl border border-border rounded-xl bg-card overflow-hidden text-left shadow-sm">
                                  <header className="w-full border-b border-border bg-card px-5 py-3.5 flex items-center justify-between">
                                    <div className="flex items-center gap-2.5 font-bold text-sm tracking-tight text-foreground select-none">
                                      <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-white text-[10px]">G</div>
                                      GoatUI
                                    </div>
                                    <nav className="flex items-center gap-4 text-xs font-medium text-muted-foreground select-none">
                                      <span className="hover:text-blue-600 transition-colors cursor-pointer">Explore</span>
                                      <span className="hover:text-blue-600 transition-colors cursor-pointer">Pricing</span>
                                      <span className="hover:text-blue-600 transition-colors cursor-pointer">Docs</span>
                                    </nav>
                                    <button className="bg-blue-600 hover:bg-blue-750 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg transition-colors border-0 cursor-pointer">
                                      Get Started
                                    </button>
                                  </header>
                                  <div className="p-4 text-center text-[10px] text-muted-foreground select-none">
                                    Mini navbar container preview header.
                                  </div>
                                </div>
                              )}

                              {/* ================= BREADCRUMB PREVIEW ================= */}
                              {comp.id === "breadcrumb" && (
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground select-none font-medium">
                                  <span className="hover:text-blue-600 cursor-pointer">Home</span>
                                  <span className="text-muted-foreground/60">{options.breadSeparator === "chevron" ? ">" : options.breadSeparator === "slash" ? "/" : "•"}</span>
                                  <span className="hover:text-blue-600 cursor-pointer">Docs</span>
                                  <span className="text-muted-foreground/60">{options.breadSeparator === "chevron" ? ">" : options.breadSeparator === "slash" ? "/" : "•"}</span>
                                  <span className="text-blue-600 font-semibold">Breadcrumbs</span>
                                </div>
                              )}

                              {/* ================= PAGINATION PREVIEW ================= */}
                              {comp.id === "pagination" && (
                                <div className="flex items-center gap-1 text-xs select-none">
                                  <button className="h-8 px-3 rounded-lg border border-border hover:bg-muted text-muted-foreground cursor-pointer font-medium">
                                    Previous
                                  </button>
                                  {[1, 2, 3, 4].map(idx => (
                                    <button
                                      key={idx}
                                      className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold transition-all cursor-pointer ${
                                        idx === 2 
                                          ? "bg-blue-600 text-white" 
                                          : "border border-border hover:bg-muted text-foreground"
                                      }`}
                                    >
                                      {idx}
                                    </button>
                                  ))}
                                  <button className="h-8 px-3 rounded-lg border border-border hover:bg-muted text-muted-foreground cursor-pointer font-medium">
                                    Next
                                  </button>
                                </div>
                              )}

                              {/* ================= TABS PREVIEW ================= */}
                              {comp.id === "tabs" && (
                                <div className="w-full max-w-sm space-y-4 text-left">
                                  {options.tabsVariant === "underline" ? (
                                    <div className="flex border-b border-border text-xs font-semibold gap-4 select-none">
                                      {["tab-1", "tab-2", "tab-3"].map((id, idx) => (
                                        <button
                                          key={id}
                                          onClick={() => setActiveTabSelect(id)}
                                          className={`pb-2 border-b-2 transition-all cursor-pointer border-0 bg-transparent ${
                                            activeTabSelect === id 
                                              ? "border-blue-600 text-blue-600" 
                                              : "border-transparent text-muted-foreground hover:text-foreground"
                                          }`}
                                        >
                                          Dashboard {idx + 1}
                                        </button>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="flex bg-muted p-1 rounded-lg text-xs font-semibold gap-1 max-w-xs select-none">
                                      {["tab-1", "tab-2", "tab-3"].map((id, idx) => (
                                        <button
                                          key={id}
                                          onClick={() => setActiveTabSelect(id)}
                                          className={`flex-1 py-1.5 rounded-md text-center transition-all cursor-pointer border-0 ${
                                            activeTabSelect === id 
                                              ? "bg-card text-foreground shadow-sm" 
                                              : "text-muted-foreground hover:text-foreground"
                                          }`}
                                        >
                                          Option {idx + 1}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                  <div className="p-4 border border-border/80 rounded-xl bg-card/60 text-xs text-muted-foreground leading-relaxed">
                                    {activeTabSelect === "tab-1" && <p>Viewing <strong>Dashboard 1</strong> settings. Deploy and configure active node components.</p>}
                                    {activeTabSelect === "tab-2" && <p>Viewing <strong>Option 2</strong> settings. Modify layout configurations, grid details, and metrics.</p>}
                                    {activeTabSelect === "tab-3" && <p>Viewing <strong>Details 3</strong> logs. Fetch database queries, connection settings, and actions.</p>}
                                  </div>
                                </div>
                              )}

                              {/* ================= CARD PREVIEW ================= */}
                              {comp.id === "card" && (
                                <div className="w-full max-w-xs rounded-xl border border-border bg-card p-5 text-left shadow-sm hover:border-blue-600/30 transition-all duration-300">
                                  <div className="h-32 bg-slate-100 dark:bg-zinc-800 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 bg-background/50 px-3 py-1 rounded">IMAGE COVER</span>
                                  </div>
                                  <div className="space-y-1.5">
                                    <span className="text-[9px] font-bold text-blue-600 uppercase bg-blue-600/10 px-2 py-0.5 rounded">AI Dev</span>
                                    <h4 className="font-bold text-sm text-foreground">Goat Agent Pro</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                      Deploy autonomous developer agents running locally on your environment.
                                    </p>
                                  </div>
                                  <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-xs transition-colors border-0 cursor-pointer active:scale-[0.98]">
                                    Deploy Agent
                                  </button>
                                </div>
                              )}

                              {/* ================= STATISTICS PREVIEW ================= */}
                              {comp.id === "statistics" && (
                                <div className="w-full max-w-xs rounded-xl border border-border bg-card p-5 text-left shadow-sm">
                                  <p className="text-xs text-muted-foreground font-medium select-none">Monthly Active Users</p>
                                  <div className="flex items-baseline gap-2 mt-2">
                                    <h4 className="text-2xl font-extrabold text-foreground">48,259</h4>
                                    <span className="text-xs text-green-500 font-bold">
                                      ▲ +14.2%
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-muted-foreground mt-1 select-none">
                                    from last calendar month
                                  </p>
                                </div>
                              )}

                              {/* ================= LIST GROUP PREVIEW ================= */}
                              {comp.id === "list-group" && (
                                <div className="w-full max-w-sm rounded-xl border border-border bg-card overflow-hidden text-left shadow-sm">
                                  {[
                                    { id: "inbox", label: "Inbox Messages", count: "12" },
                                    { id: "sent", label: "Sent Items", count: "4" },
                                    { id: "draft", label: "Draft Proposals", count: "2" }
                                  ].map(item => (
                                    <button
                                      key={item.id}
                                      onClick={() => setListGroupActive(item.id)}
                                      className={`
                                        w-full flex items-center justify-between px-4 py-3 text-xs font-semibold border-b border-border/80 last:border-b-0 cursor-pointer transition-colors border-0 bg-transparent
                                        ${listGroupActive === item.id 
                                          ? "bg-blue-600/10 text-blue-600 font-semibold" 
                                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                        }
                                      `}
                                    >
                                      <span>{item.label}</span>
                                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${listGroupActive === item.id ? 'bg-blue-600 text-white' : 'bg-muted text-muted-foreground'}`}>{item.count}</span>
                                    </button>
                                  ))}
                                </div>
                              )}

                              {/* ================= TABLE PREVIEW ================= */}
                              {comp.id === "table" && (
                                <div className="w-full overflow-x-auto border border-border rounded-xl bg-card shadow-sm">
                                  <table className="w-full border-collapse text-left text-xs">
                                    <thead>
                                      <tr className="border-b border-border bg-muted/40 font-semibold">
                                        <th className="p-3">User</th>
                                        <th className="p-3">Role</th>
                                        <th className="p-3">Status</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {[
                                        { id: 1, name: "Sarah Connor", email: "sarah@skynet.ai", role: "AI Prompt Engineer", status: "Active" },
                                        { id: 2, name: "John Connor", email: "john@skynet.ai", role: "System Architect", status: "Active" },
                                        { id: 3, name: "T-800", email: "terminator@cyberdyne.org", role: "Security Auditor", status: "Offline" }
                                      ].map((user, idx) => (
                                        <tr 
                                          key={user.id} 
                                          onMouseEnter={() => setTableHoveredRow(idx)}
                                          onMouseLeave={() => setTableHoveredRow(null)}
                                          className={`
                                            border-b border-border/60 last:border-b-0 transition-colors
                                            ${tableHoveredRow === idx ? "bg-blue-600/5" : ""}
                                          `}
                                        >
                                          <td className="p-3">
                                            <div>
                                              <div className="font-semibold text-foreground">{user.name}</div>
                                              <div className="text-[10px] text-muted-foreground">{user.email}</div>
                                            </div>
                                          </td>
                                          <td className="p-3 text-muted-foreground">{user.role}</td>
                                          <td className="p-3">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                              user.status === "Active" 
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                                                : "bg-zinc-100 text-zinc-650 dark:bg-zinc-800 dark:text-zinc-400"
                                            }`}>
                                              {user.status}
                                            </span>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}

                              {/* ================= ALERT PREVIEW ================= */}
                              {comp.id === "alert" && (
                                <div className="w-full max-w-md space-y-3 text-left">
                                  {options.alertVariant === "success" && (
                                    <div className="flex items-start gap-3 rounded-lg border border-green-500/20 bg-green-500/10 p-3.5 text-xs text-green-700 dark:text-green-400">
                                      <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
                                      <div>
                                        <strong className="font-bold block mb-0.5">Updated Successfully</strong>
                                        <span>Deployment triggers are live. Active servers synced.</span>
                                      </div>
                                    </div>
                                  )}
                                  {options.alertVariant === "info" && (
                                    <div className="flex items-start gap-3 rounded-lg border border-blue-500/20 bg-blue-500/10 p-3.5 text-xs text-blue-700 dark:text-blue-400">
                                      <Info className="h-4.5 w-4.5 shrink-0" />
                                      <div>
                                        <strong className="font-bold block mb-0.5">Deployment Configs</strong>
                                        <span>Server parameters adjusted automatically. Check developer logs.</span>
                                      </div>
                                    </div>
                                  )}
                                  {options.alertVariant === "warning" && (
                                    <div className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3.5 text-xs text-amber-700 dark:text-amber-400">
                                      <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
                                      <div>
                                        <strong className="font-bold block mb-0.5">Action Warning</strong>
                                        <span>Token quota exceeding threshold limits. Refresh credentials.</span>
                                      </div>
                                    </div>
                                  )}
                                  {options.alertVariant === "danger" && (
                                    <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3.5 text-xs text-red-700 dark:text-red-400">
                                      <XCircle className="h-4.5 w-4.5 shrink-0" />
                                      <div>
                                        <strong className="font-bold block mb-0.5">Connection Error</strong>
                                        <span>Failed to authenticate webhook trigger key. Invalid signature.</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* ================= PROGRESS BAR PREVIEW ================= */}
                              {comp.id === "progress-bar" && (
                                <div className="w-full max-w-sm space-y-2 text-left">
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span className="text-foreground">Downloading assets...</span>
                                    <span className="text-blue-600">{options.progressValue}%</span>
                                  </div>
                                  <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-3 overflow-hidden border border-border/40">
                                    <div 
                                      className="bg-blue-600 h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                                      style={{ width: `${options.progressValue}%` }}
                                    />
                                  </div>
                                  <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value={options.progressValue}
                                    onChange={(e) => updateOption("progressValue", Number(e.target.value))}
                                    className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-blue-600 mt-4"
                                  />
                                </div>
                              )}

                              {/* ================= TOAST PREVIEW ================= */}
                              {comp.id === "toast" && (
                                <div className="flex flex-col items-center gap-4">
                                  <div className="flex flex-wrap justify-center gap-2 select-none">
                                    <button
                                      onClick={() => addToast("Successfully Updated", "Deployment configuration saved.", "success")}
                                      className="bg-green-600 text-white font-medium py-2 px-4 rounded-lg text-xs hover:bg-green-700 transition-colors cursor-pointer border-0 font-bold"
                                    >
                                      Trigger Success
                                    </button>
                                    <button
                                      onClick={() => addToast("Alert Quota Limit", "Database API calls warning.", "warning")}
                                      className="bg-amber-600 text-white font-medium py-2 px-4 rounded-lg text-xs hover:bg-amber-700 transition-colors cursor-pointer border-0 font-bold"
                                    >
                                      Trigger Warning
                                    </button>
                                    <button
                                      onClick={() => addToast("Auth Connection Error", "Could not verify credentials.", "danger")}
                                      className="bg-red-600 text-white font-medium py-2 px-4 rounded-lg text-xs hover:bg-red-700 transition-colors cursor-pointer border-0 font-bold"
                                    >
                                      Trigger Error
                                    </button>
                                  </div>
                                  <p className="text-[10px] text-muted-foreground select-none">Toasts slide up at the screen corner when clicked.</p>
                                </div>
                              )}

                              {/* ================= MODAL PREVIEW ================= */}
                              {comp.id === "modal" && (
                                <div>
                                  <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-lg text-xs transition-colors shadow-md active:scale-[0.98] cursor-pointer border-0"
                                  >
                                    Trigger Action Modal
                                  </button>
                                </div>
                              )}

                              {/* ================= TOOLTIP PREVIEW ================= */}
                              {comp.id === "tooltip" && (
                                <div className="flex justify-center gap-4 relative select-none">
                                  <div className="group relative inline-block">
                                    <button className="bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-foreground text-xs font-semibold py-2 px-4 rounded-lg border border-border select-none cursor-pointer">
                                      Hover tooltip
                                    </button>
                                    <div className={`
                                      absolute hidden group-hover:block bg-zinc-900 text-zinc-100 text-[10px] font-semibold py-1.5 px-2.5 rounded-lg shadow-md whitespace-nowrap z-30 transition-all pointer-events-none
                                      ${options.tooltipSide === "top" ? "bottom-full left-1/2 -translate-x-1/2 mb-2" : ""}
                                      ${options.tooltipSide === "bottom" ? "top-full left-1/2 -translate-x-1/2 mt-2" : ""}
                                      ${options.tooltipSide === "left" ? "right-full top-1/2 -translate-y-1/2 mr-2" : ""}
                                      ${options.tooltipSide === "right" ? "left-full top-1/2 -translate-y-1/2 ml-2" : ""}
                                    `}>
                                      Context tooltips preview content details
                                      <div className={`
                                        absolute h-1.5 w-1.5 bg-zinc-900 rotate-45
                                        ${options.tooltipSide === "top" ? "top-full left-1/2 -translate-x-1/2 -mt-1" : ""}
                                        ${options.tooltipSide === "bottom" ? "bottom-full left-1/2 -translate-x-1/2 -mb-1" : ""}
                                        ${options.tooltipSide === "left" ? "left-full top-1/2 -translate-y-1/2 -ml-1" : ""}
                                        ${options.tooltipSide === "right" ? "right-full top-1/2 -translate-y-1/2 -mr-1" : ""}
                                      `} />
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* ================= DROPDOWN PREVIEW ================= */}
                              {comp.id === "dropdown" && (
                                <div className="relative select-none">
                                  <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold py-2.5 px-4 rounded-lg flex items-center gap-1.5 shadow-sm select-none cursor-pointer"
                                  >
                                    User Profiles
                                    <ChevronDown className="h-3.5 w-3.5" />
                                  </button>
                                  
                                  {dropdownOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-48 rounded-xl border border-border bg-card p-1 shadow-lg z-30 text-left animate-fadeIn">
                                      <button className="w-full text-xs text-foreground px-3 py-2 hover:bg-blue-600 hover:text-white rounded-lg transition-colors text-left flex items-center gap-2 cursor-pointer border-0">
                                        <Settings className="h-3.5 w-3.5" /> Settings Config
                                      </button>
                                      <button className="w-full text-xs text-foreground px-3 py-2 hover:bg-blue-600 hover:text-white rounded-lg transition-colors text-left flex items-center gap-2 cursor-pointer border-0">
                                        <HelpCircle className="h-3.5 w-3.5" /> Documentation
                                      </button>
                                      <div className="h-px bg-border my-1" />
                                      <button className="w-full text-xs text-red-500 px-3 py-2 hover:bg-red-650 hover:text-white rounded-lg transition-colors text-left flex items-center gap-2 cursor-pointer border-0">
                                        <LogOut className="h-3.5 w-3.5" /> Disconnect User
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* ================= BADGE PREVIEW ================= */}
                              {comp.id === "badge" && (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold select-none transition-colors border ${{
                                  default: "bg-blue-600 text-white hover:bg-blue-700 border-transparent",
                                  secondary: "bg-slate-100 dark:bg-zinc-800 text-foreground hover:bg-slate-200 border-transparent",
                                  destructive: "bg-red-500 text-white hover:bg-red-650 border-transparent",
                                  outline: "border-slate-200 dark:border-zinc-800 text-foreground"
                                }[options.badgeVariant] || "bg-blue-600 text-white"}`}>
                                  {options.badgeLabel}
                                </span>
                              )}

                              {/* ================= AVATAR PREVIEW ================= */}
                              {comp.id === "avatar" && (
                                <div className="flex flex-col items-center gap-4 select-none">
                                  <div className="flex items-center gap-6">
                                    <div className="relative">
                                      <div className={`
                                        rounded-full bg-slate-350 dark:bg-zinc-800 flex items-center justify-center font-bold text-foreground overflow-hidden border border-border
                                        ${options.avatarSize === "sm" ? "h-8 w-8 text-xs" : ""}
                                        ${options.avatarSize === "md" ? "h-11 w-11 text-sm" : ""}
                                        ${options.avatarSize === "lg" ? "h-16 w-16 text-lg" : ""}
                                      `}>
                                        <img 
                                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
                                          alt="Avatar User" 
                                          className="h-full w-full object-cover"
                                        />
                                      </div>
                                      {options.avatarStatus !== "none" && (
                                        <span className={`
                                          absolute bottom-0 right-0 rounded-full border-2 border-card
                                          ${options.avatarSize === "sm" ? "h-2.5 w-2.5" : "h-3.5 w-3.5"}
                                          ${options.avatarStatus === "online" ? "bg-green-500" : options.avatarStatus === "busy" ? "bg-red-500" : "bg-gray-400"}
                                        `} />
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-[10px] text-muted-foreground select-none">Pulsing status display indicators</p>
                                </div>
                              )}

                              {/* ================= ACCORDION PREVIEW ================= */}
                              {comp.id === "accordion" && (
                                <div className="w-full max-w-sm rounded-xl border border-border bg-card p-2 text-left space-y-1">
                                  {[
                                    { id: 0, title: "Is it accessible?", desc: "Yes, our designs respect standard WAI-ARIA specs." },
                                    { id: 1, title: "Can I customize the colors?", desc: "Yes, fully styled with standard Tailwind config classes." }
                                  ].map(item => {
                                    const isOpen = accordionOpen === item.id;
                                    return (
                                      <div key={item.id} className="rounded-lg border border-slate-100 dark:border-zinc-800 overflow-hidden">
                                        <button
                                          onClick={() => setAccordionOpen(isOpen ? null : item.id)}
                                          className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold hover:bg-muted/50 cursor-pointer border-0 bg-transparent text-foreground"
                                        >
                                          <span>{item.title}</span>
                                          <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                                        </button>
                                        {isOpen && (
                                          <div className="p-3 bg-muted/20 text-xs text-slate-500 border-t border-border/40 animate-fadeIn leading-relaxed">
                                            {item.desc}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}

                              {/* ================= HERO PREVIEW ================= */}
                              {comp.id === "hero" && (
                                <div className="w-full max-w-xl rounded-xl border border-border bg-card p-6 md:p-8 text-center space-y-4 shadow-sm relative overflow-hidden">
                                  <span className="text-[9px] font-bold text-blue-600 uppercase bg-blue-600/10 px-2.5 py-1 rounded-full select-none">
                                    Goat UI v1.0
                                  </span>
                                  <h3 className="text-2xl font-extrabold tracking-tight text-foreground leading-tight">
                                    Build High-Performance Interfaces
                                  </h3>
                                  <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                                    Seamless copy-paste React design elements optimized for local speed, responsiveness, and dark mode features.
                                  </p>
                                  <div className="flex justify-center gap-3 pt-2">
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-xs transition-colors cursor-pointer border-0">
                                      Get Started
                                    </button>
                                    <button className="border border-border hover:bg-muted text-foreground font-semibold py-2 px-4 rounded-lg text-xs transition-colors cursor-pointer">
                                      Learn More
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* ================= METRIC CARD PREVIEW ================= */}
                              {comp.id === "metric-card" && (
                                <div className="w-full max-w-xs rounded-xl border border-border bg-card p-5 text-left shadow-sm space-y-4">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs text-muted-foreground font-medium select-none">Server Load Rate</span>
                                    <MoreHorizontal className="h-4.5 w-4.5 text-muted-foreground" />
                                  </div>
                                  <div className="flex items-baseline gap-2">
                                    <h4 className="text-3xl font-extrabold text-foreground tracking-tight">42.8%</h4>
                                    <span className="text-[10px] text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded select-none">
                                      Healthy
                                    </span>
                                  </div>
                                  {/* Mini graphical indicator bar */}
                                  <div className="flex items-end justify-between gap-1.5 h-10 pt-2 select-none">
                                    {[20, 32, 28, 45, 38, 56, 42, 60, 48].map((h, i) => (
                                      <div 
                                        key={i} 
                                        className="bg-blue-600/20 hover:bg-blue-600 rounded-sm flex-1 transition-colors cursor-pointer"
                                        style={{ height: `${h}%` }}
                                        title={`Hour ${i+1}: ${h}%`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* ================= SKELETON PREVIEW ================= */}
                              {comp.id === "skeleton" && (
                                <div className="w-full max-w-xs space-y-3 animate-pulse text-left select-none p-3 border border-border/80 rounded-xl bg-card">
                                  <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-zinc-800" />
                                    <div className="space-y-1.5 flex-1">
                                      <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-2/3" />
                                      <div className="h-2.5 bg-slate-200 dark:bg-zinc-800 rounded w-1/2" />
                                    </div>
                                  </div>
                                  <div className="h-2.5 bg-slate-200 dark:bg-zinc-800 rounded w-full mt-2" />
                                  <div className="h-2.5 bg-slate-200 dark:bg-zinc-800 rounded w-5/6" />
                                </div>
                              )}

                            </div>
                          </div>

                          {/* Playground variables config panels */}
                          <div className="border border-border/60 bg-card/10 rounded-xl p-4 md:p-5 space-y-4">
                            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider select-none text-left">Playground Customizer</h4>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
                              {/* Button controllers */}
                              {comp.id === "button" && (
                                <>
                                  <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-foreground">Accent Variant</label>
                                    <select
                                      value={options.btnVariant}
                                      onChange={(e) => updateOption("btnVariant", e.target.value)}
                                      className="w-full text-xs rounded-lg border border-border bg-card px-2.5 py-2 font-medium focus-visible:outline-none"
                                    >
                                      <option value="primary">Primary</option>
                                      <option value="secondary">Secondary</option>
                                      <option value="outline">Outline</option>
                                      <option value="ghost">Ghost</option>
                                      <option value="gradient">Gradient</option>
                                      <option value="neon">Neon</option>
                                      <option value="glass">Glass</option>
                                    </select>
                                  </div>

                                  <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-foreground">Button Size</label>
                                    <select
                                      value={options.btnSize}
                                      onChange={(e) => updateOption("btnSize", e.target.value)}
                                      className="w-full text-xs rounded-lg border border-border bg-card px-2.5 py-2 font-medium focus-visible:outline-none"
                                    >
                                      <option value="default">Default</option>
                                      <option value="sm">Small</option>
                                      <option value="lg">Large</option>
                                      <option value="icon">Icon only</option>
                                    </select>
                                  </div>

                                  <div className="flex flex-col gap-2 pt-4">
                                    <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground select-none cursor-pointer">
                                      <Checkbox checked={options.btnLoading} onCheckedChange={(checked) => updateOption("btnLoading", !!checked)} className="border-blue-600 data-[state=checked]:bg-blue-600 animate-fadeIn" />
                                      Loading state
                                    </label>
                                    <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground select-none cursor-pointer">
                                      <Checkbox checked={options.btnDisabled} onCheckedChange={(checked) => updateOption("btnDisabled", !!checked)} className="border-blue-600 data-[state=checked]:bg-blue-600 animate-fadeIn" />
                                      Disabled
                                    </label>
                                  </div>
                                </>
                              )}

                              {/* Badge controllers */}
                              {comp.id === "badge" && (
                                <>
                                  <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-foreground">Badge Accent Variant</label>
                                    <select
                                      value={options.badgeVariant}
                                      onChange={(e) => updateOption("badgeVariant", e.target.value)}
                                      className="w-full text-xs rounded-lg border border-border bg-card px-2.5 py-2 font-medium focus-visible:outline-none"
                                    >
                                      <option value="default">Default (Blue)</option>
                                      <option value="secondary">Secondary</option>
                                      <option value="destructive">Destructive</option>
                                      <option value="outline">Outline</option>
                                    </select>
                                  </div>

                                  <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-foreground">Label</label>
                                    <Input
                                      value={options.badgeLabel}
                                      onChange={(e) => updateOption("badgeLabel", e.target.value)}
                                      className="h-8.5 text-xs rounded-lg focus-visible:ring-blue-600"
                                    />
                                  </div>
                                </>
                              )}

                              {/* Avatar controllers */}
                              {comp.id === "avatar" && (
                                <>
                                  <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-foreground">Avatar Size</label>
                                    <select
                                      value={options.avatarSize}
                                      onChange={(e) => updateOption("avatarSize", e.target.value)}
                                      className="w-full text-xs rounded-lg border border-border bg-card px-2.5 py-2 font-medium focus-visible:outline-none"
                                    >
                                      <option value="sm">Small</option>
                                      <option value="md">Medium</option>
                                      <option value="lg">Large</option>
                                    </select>
                                  </div>

                                  <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-foreground">Online Status</label>
                                    <select
                                      value={options.avatarStatus}
                                      onChange={(e) => updateOption("avatarStatus", e.target.value)}
                                      className="w-full text-xs rounded-lg border border-border bg-card px-2.5 py-2 font-medium focus-visible:outline-none"
                                    >
                                      <option value="online">Online</option>
                                      <option value="busy">Busy</option>
                                      <option value="offline">Offline</option>
                                      <option value="none">None</option>
                                    </select>
                                  </div>
                                </>
                              )}

                              {/* Inputs controllers */}
                              {comp.id === "input" && (
                                <>
                                  <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-foreground">Field Type</label>
                                    <select
                                      value={options.inputType}
                                      onChange={(e) => updateOption("inputType", e.target.value)}
                                      className="w-full text-xs rounded-lg border border-border bg-card px-2.5 py-2 font-medium focus-visible:outline-none"
                                    >
                                      <option value="text">Text</option>
                                      <option value="password">Password</option>
                                      <option value="email">Email</option>
                                      <option value="number">Number</option>
                                    </select>
                                  </div>

                                  <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-foreground">Placeholder text</label>
                                    <Input
                                      value={options.inputPlaceholder}
                                      onChange={(e) => updateOption("inputPlaceholder", e.target.value)}
                                      className="h-8.5 text-xs rounded-lg focus-visible:ring-blue-600"
                                    />
                                  </div>

                                  <div className="flex flex-col gap-2 pt-4">
                                    <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground select-none cursor-pointer">
                                      <Checkbox checked={options.inputDisabled} onCheckedChange={(checked) => updateOption("inputDisabled", !!checked)} className="border-blue-600 data-[state=checked]:bg-blue-600" />
                                      Disabled state
                                    </label>
                                    <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground select-none cursor-pointer">
                                      <Checkbox checked={options.inputHasError} onCheckedChange={(checked) => updateOption("inputHasError", !!checked)} className="border-blue-600 data-[state=checked]:bg-blue-600" />
                                      Error validation state
                                    </label>
                                  </div>
                                </>
                              )}

                              {/* Checkbox controllers */}
                              {comp.id === "checkbox" && (
                                <>
                                  <div className="flex flex-col gap-2 pt-4">
                                    <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground select-none cursor-pointer">
                                      <Checkbox checked={options.chkChecked} onCheckedChange={(checked) => updateOption("chkChecked", !!checked)} className="border-blue-600 data-[state=checked]:bg-blue-600 animate-fadeIn" />
                                      Checked state
                                    </label>
                                    <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground select-none cursor-pointer">
                                      <Checkbox checked={options.chkDisabled} onCheckedChange={(checked) => updateOption("chkDisabled", !!checked)} className="border-blue-600 data-[state=checked]:bg-blue-600 animate-fadeIn" />
                                      Disabled interaction
                                    </label>
                                  </div>
                                </>
                              )}

                              {/* Radio Button controllers */}
                              {comp.id === "radio" && (
                                <>
                                  <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-foreground">Radio Group Layout</label>
                                    <select
                                      value={options.radioLayout}
                                      onChange={(e) => updateOption("radioLayout", e.target.value)}
                                      className="w-full text-xs rounded-lg border border-border bg-card px-2.5 py-2 font-medium focus-visible:outline-none"
                                    >
                                      <option value="vertical">Vertical Group</option>
                                      <option value="horizontal">Horizontal Row</option>
                                    </select>
                                  </div>

                                  <div className="flex flex-col gap-2 pt-4">
                                    <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground select-none cursor-pointer">
                                      <Checkbox checked={options.radioDisabled} onCheckedChange={(checked) => updateOption("radioDisabled", !!checked)} className="border-blue-600 data-[state=checked]:bg-blue-600" />
                                      Disabled group
                                    </label>
                                  </div>
                                </>
                              )}

                              {/* Switch controllers */}
                              {comp.id === "switch" && (
                                <>
                                  <div className="flex flex-col gap-2 pt-4">
                                    <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground select-none cursor-pointer">
                                      <Checkbox checked={options.switchChecked} onCheckedChange={(checked) => updateOption("switchChecked", !!checked)} className="border-blue-600 data-[state=checked]:bg-blue-600" />
                                      Toggled switch on
                                    </label>
                                    <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground select-none cursor-pointer">
                                      <Checkbox checked={options.switchDisabled} onCheckedChange={(checked) => updateOption("switchDisabled", !!checked)} className="border-blue-600 data-[state=checked]:bg-blue-600" />
                                      Disabled Switch
                                    </label>
                                  </div>
                                </>
                              )}

                              {/* Rating controllers */}
                              {comp.id === "rating" && (
                                <>
                                  <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-foreground">Rating Score</label>
                                    <select
                                      value={options.ratingValue}
                                      onChange={(e) => updateOption("ratingValue", Number(e.target.value))}
                                      className="w-full text-xs rounded-lg border border-border bg-card px-2.5 py-2 font-medium focus-visible:outline-none"
                                    >
                                      <option value="1">1 Star</option>
                                      <option value="2">2 Stars</option>
                                      <option value="3">3 Stars</option>
                                      <option value="4">4 Stars</option>
                                      <option value="5">5 Stars</option>
                                    </select>
                                  </div>
                                </>
                              )}

                              {/* Breadcrumbs controllers */}
                              {comp.id === "breadcrumb" && (
                                <>
                                  <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-foreground">Separator icon</label>
                                    <select
                                      value={options.breadSeparator}
                                      onChange={(e) => updateOption("breadSeparator", e.target.value)}
                                      className="w-full text-xs rounded-lg border border-border bg-card px-2.5 py-2 font-medium focus-visible:outline-none"
                                    >
                                      <option value="chevron">Chevron (&gt;)</option>
                                      <option value="slash">Slash (/)</option>
                                      <option value="dot">Bullet (•)</option>
                                    </select>
                                  </div>
                                </>
                              )}

                              {/* Tabs controllers */}
                              {comp.id === "tabs" && (
                                <>
                                  <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-foreground">Tab Styles</label>
                                    <select
                                      value={options.tabsVariant}
                                      onChange={(e) => updateOption("tabsVariant", e.target.value)}
                                      className="w-full text-xs rounded-lg border border-border bg-card px-2.5 py-2 font-medium focus-visible:outline-none"
                                    >
                                      <option value="underline">Classic Underline</option>
                                      <option value="pills">Pill Segments</option>
                                    </select>
                                  </div>
                                </>
                              )}

                              {/* Alerts controllers */}
                              {comp.id === "alert" && (
                                <>
                                  <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-foreground">Alert Type</label>
                                    <select
                                      value={options.alertVariant}
                                      onChange={(e) => updateOption("alertVariant", e.target.value)}
                                      className="w-full text-xs rounded-lg border border-border bg-card px-2.5 py-2 font-medium focus-visible:outline-none"
                                    >
                                      <option value="success">Success (Green)</option>
                                      <option value="info">Information (Blue)</option>
                                      <option value="warning">Warning (Amber)</option>
                                      <option value="danger">Destructive (Red)</option>
                                    </select>
                                  </div>
                                </>
                              )}

                              {/* Progress Bar controllers */}
                              {comp.id === "progress-bar" && (
                                <>
                                  <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-foreground">Progress Fill Value</label>
                                    <Input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={options.progressValue}
                                      onChange={(e) => updateOption("progressValue", Math.min(100, Math.max(0, Number(e.target.value))))}
                                      className="h-8.5 text-xs rounded-lg focus-visible:ring-blue-600"
                                    />
                                  </div>
                                </>
                              )}

                              {/* Toast controllers */}
                              {comp.id === "toast" && (
                                <>
                                  <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-foreground">Toast Alert Type</label>
                                    <select
                                      value={options.toastVariant}
                                      onChange={(e) => updateOption("toastVariant", e.target.value)}
                                      className="w-full text-xs rounded-lg border border-border bg-card px-2.5 py-2 font-medium focus-visible:outline-none"
                                    >
                                      <option value="success">Success</option>
                                      <option value="warning">Warning</option>
                                      <option value="danger">Destructive</option>
                                    </select>
                                  </div>
                                </>
                              )}

                              {/* Tooltip controllers */}
                              {comp.id === "tooltip" && (
                                <>
                                  <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-foreground">Tooltip Alignment</label>
                                    <select
                                      value={options.tooltipSide}
                                      onChange={(e) => updateOption("tooltipSide", e.target.value)}
                                      className="w-full text-xs rounded-lg border border-border bg-card px-2.5 py-2 font-medium focus-visible:outline-none"
                                    >
                                      <option value="top">Top aligned</option>
                                      <option value="bottom">Bottom aligned</option>
                                      <option value="left">Left aligned</option>
                                      <option value="right">Right aligned</option>
                                    </select>
                                  </div>
                                </>
                              )}

                              {/* Standard description fallback for utility components */}
                              {!["button", "badge", "avatar", "input", "checkbox", "radio", "switch", "rating", "breadcrumb", "tabs", "alert", "progress-bar", "toast", "tooltip"].includes(comp.id) && (
                                <div className="col-span-full py-1 text-xs text-muted-foreground italic select-none">
                                  Interact with this component dynamically in the live canvas view above.
                                </div>
                              )}

                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Code block panel */
                        <div className="w-full border border-border rounded-xl bg-card overflow-hidden flex flex-col text-left">
                          <div className="bg-secondary/40 border-b border-border/80 px-4 py-2 flex items-center justify-between text-xs font-semibold select-none">
                            <div className="flex items-center gap-1.5">
                              <Terminal className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
                              <span>Generated Code Snippet</span>
                            </div>
                            <button
                              onClick={() => handleCopyCode(comp.id, code)}
                              className="flex items-center gap-1 text-[11px] hover:text-foreground text-muted-foreground font-medium py-1 px-2.5 rounded border border-border/80 bg-background/50 hover:bg-background cursor-pointer"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="h-3.5 w-3.5 text-green-500" />
                                  <span className="text-green-500">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="p-5 overflow-x-auto text-[11px] font-mono leading-relaxed bg-zinc-950 text-zinc-300 min-h-[200px]">
                            <code>{code}</code>
                          </pre>
                        </div>
                      )}

                      {/* Showcase footer action buttons */}
                      <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-border/60 select-none">
                        <button
                          onClick={() => setTab(tab === "preview" ? "code" : "preview")}
                          className="text-xs text-muted-foreground hover:text-foreground border border-border px-3.5 py-1.5 rounded-lg hover:bg-muted font-medium transition-colors cursor-pointer"
                        >
                          {tab === "preview" ? "View Code" : "View Preview"}
                        </button>
                        <button
                          onClick={() => handleCopyCode(comp.id, code)}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-600/10 border border-blue-600/20 dark:border-blue-400/20 px-3.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
                        >
                          Copy Component Code
                        </button>
                      </div>
                    </section>
                  );
                })()}
              </div>
            )
          )}

          {/* ====================================================
              FLOATING INTERACTIVE MODAL OVERLAY
              ==================================================== */}
          <AnimatePresence>
            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsModalOpen(false)}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Dialog content */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-2xl z-10 text-left border-blue-600/20"
                >
                  <h4 className="text-base font-bold text-foreground">Confirm Actions Trigger</h4>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-sans">
                    Are you sure you want to verify these webhook client connections? Doing so updates deployment servers.
                  </p>
                  
                  <div className="flex justify-end gap-2.5 mt-6">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="text-xs font-semibold text-slate-500 border border-border px-4 py-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        addToast("Connection Approved", "Server hooks updated successfully.", "success");
                      }}
                      className="text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer border-0 font-bold"
                    >
                      Approve Connection
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* ====================================================
              FLOATING TOAST CONTAINER (BOTTOM-RIGHT)
              ==================================================== */}
          <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
            <AnimatePresence>
              {toasts.map((toast) => (
                <motion.div
                  key={toast.id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                  className={`
                    p-4 rounded-xl border bg-card shadow-lg border-l-4 pointer-events-auto flex items-start gap-3 text-left border-border/80
                    ${toast.variant === "success" ? "border-l-green-500" : ""}
                    ${toast.variant === "warning" ? "border-l-amber-500" : ""}
                    ${toast.variant === "danger" ? "border-l-red-500" : ""}
                  `}
                >
                  {toast.variant === "success" && <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />}
                  {toast.variant === "warning" && <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />}
                  {toast.variant === "danger" && <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />}

                  <div>
                    <h5 className="text-xs font-bold text-foreground">{toast.title}</h5>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{toast.description}</p>
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
