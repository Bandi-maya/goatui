"use client";

import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Search, Component, ArrowRight, X } from "lucide-react";
import Input from "@/app/components/ui/input";
import { componentsRegistry } from "@/lib/component-registry";
import { useRouter } from "next/navigation";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const registryItems = componentsRegistry.map(c => ({
    name: c.name,
    category: c.category,
    href: `/components/${c.name.toLowerCase()}`,
    type: "Component"
  }));

  const staticRoutes = [
    { name: "Sandbox Playground", category: "Core Tooling", href: "/playground", type: "Page" },
    { name: "Blocks Explorer", category: "Layout", href: "/blocks", type: "Page" },
    { name: "Themes Configurator", category: "Customization", href: "/themes", type: "Page" },
    { name: "Animation Engine Showcase", category: "Framer Motion", href: "/animations", type: "Page" },
    { name: "Icons Registry", category: "Design System", href: "/icons", type: "Page" },
    { name: "Pricing Tiers", category: "Pricing", href: "/pricing", type: "Page" },
    { name: "Changelog & Updates", category: "Documentation", href: "/changelog", type: "Page" },
    { name: "About GoatUI", category: "Overview", href: "/about", type: "Page" }
  ];

  const searchItems = [...staticRoutes, ...registryItems];

  const filtered = searchItems.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase()) ||
    item.type.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-6 py-16 space-y-8 text-left">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">AI Search Experience</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Search components, styling files, themes, design guides, animations, and templates.
          </p>
        </div>

        {/* Input box */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Type search variables or keywords..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 h-12 text-sm"
            autoFocus
          />
        </div>

        {/* Results list */}
        <div className="border border-border bg-card/45 rounded-2xl p-2 divide-y divide-border/60 shadow-soft">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground select-none">
              No results match &quot;{query}&quot;
            </div>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={idx}
                onClick={() => router.push(item.href)}
                className="w-full flex items-center justify-between p-4 hover:bg-secondary/40 transition-colors text-left group first:rounded-t-xl last:rounded-b-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Component className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-foreground block">{item.name}</span>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">{item.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-secondary/80 px-2 py-0.5 rounded border border-border text-muted-foreground">
                    {item.type}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-0.5" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
