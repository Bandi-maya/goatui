"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Component, ArrowRight, X, Command, Sun, Moon } from "lucide-react";
import { useRouter } from "next/navigation";
import { componentsRegistry } from "@/lib/component-registry";

export function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleOpenSearch = () => setIsOpen(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("open-search", handleOpenSearch);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("open-search", handleOpenSearch);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const registryItems = componentsRegistry.map(c => ({
    name: c.name,
    category: c.category,
    href: `/components/${c.name.toLowerCase()}`,
    type: "Component"
  }));

  const staticRoutes: { name: string; category: string; href: string; type: string }[] = [
    // { name: "Sandbox Playground", category: "Core Tooling", href: "/playground", type: "Page" },
    // { name: "Blocks Explorer", category: "Layout", href: "/blocks", type: "Page" },
    // { name: "Themes Configurator", category: "Customization", href: "/themes", type: "Page" },
    // { name: "Animation Engine Showcase", category: "Framer Motion", href: "/animations", type: "Page" },
    // { name: "Icons Registry", category: "Design System", href: "/icons", type: "Page" },
    // { name: "Pricing Tiers", category: "Pricing", href: "/pricing", type: "Page" },
    // { name: "Changelog & Updates", category: "Documentation", href: "/changelog", type: "Page" },
    // { name: "About GoatUI", category: "Overview", href: "/about", type: "Page" }
  ];

  const searchItems = [...staticRoutes, ...registryItems];

  const filtered = searchItems.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase()) ||
    item.type.toLowerCase().includes(query.toLowerCase())
  );

  const navigateTo = (href: string) => {
    router.push(href);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-background/85 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", stiffness: 350, damping: 26 }}
            className="relative w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden text-left"
          >
            <div className="p-4 border-b border-border flex items-center gap-3">
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search components, documentation, playground..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/60 text-foreground"
                autoFocus
              />
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-secondary/80 rounded-lg text-muted-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[360px] overflow-y-auto p-2 space-y-1">
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No matches found for &quot;{query}&quot;
                </div>
              ) : (
                filtered.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigateTo(item.href)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary/40 transition-colors text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                      <Component className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-foreground truncate">{item.name}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{item.category}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-secondary/80 px-2 py-0.5 rounded border border-border text-muted-foreground">
                        {item.type}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-0.5" />
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="p-3.5 bg-secondary/20 border-t border-border flex items-center justify-between text-[9px] font-bold text-muted-foreground select-none uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Command className="w-3.5 h-3.5" />
                GOATUI Navigator
              </span>
              <span>ESC to exit</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
