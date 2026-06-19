/** Install command + copyable source for the "navbar" component. */
export const installCommand = "npx goatui add navbar";

export const source = `import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function CustomNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full border-b border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-2.5 text-sm font-bold text-foreground">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-blue-600 text-xs font-bold text-white shadow shadow-blue-600/20">
            G
          </div>
          GoatUI
        </div>
        <nav className="hidden items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-400 md:flex">
          <a href="#features" className="transition-colors hover:text-blue-600">Features</a>
          <a href="#pricing" className="transition-colors hover:text-blue-600">Pricing</a>
          <a href="#docs" className="transition-colors hover:text-blue-600">Documentation</a>
        </nav>
        <div className="hidden md:block">
          <button className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow transition-colors hover:bg-blue-700 cursor-pointer border-0">
            Get Started
          </button>
        </div>
        <button
          className="border-0 bg-transparent p-1 text-foreground md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
    </header>
  );
}`;
