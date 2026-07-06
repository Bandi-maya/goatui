"use client";

import React, { useState } from "react";
import Layout from "@/components/Layout";
import { 
  Search, Settings, Shield, Zap, Layers, Activity, Bell, Eye, Copy, Check,
  Play, User, Star, Globe, Sun, Moon, Info, CheckSquare, Trash
} from "lucide-react";
import Button from "@/app/components/ui/button";
import Input from "@/app/components/ui/input";

export default function IconsPage() {
  const [query, setQuery] = useState("");
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);

  const icons = [
    { name: "Settings", icon: Settings, tags: "gear config parameters" },
    { name: "Shield", icon: Shield, tags: "security guard verification safe" },
    { name: "Zap", icon: Zap, tags: "lightning flash performance fast quick speed" },
    { name: "Layers", icon: Layers, tags: "stack folders variables configurations outline" },
    { name: "Activity", icon: Activity, tags: "heartrate chart sparklines lines visualization status analytics" },
    { name: "Bell", icon: Bell, tags: "notifications alert alarm ringing status messages" },
    { name: "Search", icon: Search, tags: "magnifier query parameters filter lookup" },
    { name: "Star", icon: Star, tags: "rating bookmark favorites highlight visual" },
    { name: "Globe", icon: Globe, tags: "network world localization variables language parameters" },
    { name: "Sun", icon: Sun, tags: "light theme solar toggle color brightness brightness-high" },
    { name: "Moon", icon: Moon, tags: "dark theme night sleep toggle color brightness-low" },
    { name: "Info", icon: Info, tags: "details about guide tooltip instructions help" }
  ];

  const filtered = icons.filter(
    item => item.name.toLowerCase().includes(query.toLowerCase()) || 
            item.tags.toLowerCase().includes(query.toLowerCase())
  );

  const handleCopy = (name: string) => {
    const importStr = `import { ${name} } from "lucide-react";`;
    navigator.clipboard.writeText(importStr);
    setCopiedIcon(name);
    setTimeout(() => setCopiedIcon(null), 2000);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-6 sm:px-8 py-12 space-y-10 text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Design Icons</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Core vector graphic primitives optimized for developer UI workspaces. Handcrafted and responsive.
            </p>
          </div>
          <div className="relative w-full max-w-xs shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search icon keywords..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 h-10 text-xs"
            />
          </div>
        </div>

        {/* Grid display */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
          {filtered.map((item, idx) => {
            const Comp = item.icon;
            return (
              <div 
                key={idx}
                className="border border-border bg-card/45 rounded-2xl p-6 flex flex-col items-center justify-center space-y-4 hover:border-primary/40 transition-colors shadow-soft group relative cursor-pointer"
                onClick={() => handleCopy(item.name)}
              >
                <div className="h-10 w-10 rounded-xl bg-secondary/50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <Comp className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-foreground tracking-wide">{item.name}</span>

                {/* Hover helper copy tip */}
                <div className="absolute inset-0 flex items-center justify-center bg-card/90 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity p-4">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                    {copiedIcon === item.name ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy Import
                      </>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
