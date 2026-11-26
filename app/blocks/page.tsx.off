"use client";

import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Copy, Check, Eye, Code, Terminal, Sparkles, AlertCircle } from "lucide-react";
import Button from "@/app/components/ui/button";

export default function BlocksPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const blocks = [
    {
      title: "Split Authentication Card",
      description: "A complete card with layout dividers, social login triggers, and input fields.",
      code: `<div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-xl space-y-6">
  <div className="space-y-1.5 text-center">
    <h3 className="text-xl font-bold">Welcome to GOATUI</h3>
    <p className="text-xs text-muted-foreground">Sign in to start custom building layouts.</p>
  </div>
  <form className="space-y-4">
    <div className="space-y-1">
      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email</label>
      <input type="email" placeholder="you@domain.com" className="w-full text-xs border rounded-lg p-2.5 bg-secondary/20" />
    </div>
    <div className="space-y-1">
      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Password</label>
      <input type="password" placeholder="••••••••" className="w-full text-xs border rounded-lg p-2.5 bg-secondary/20" />
    </div>
    <button className="w-full py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-md">Sign In</button>
  </form>
</div>`,
      preview: (
        <div className="w-full max-w-sm bg-card border border-border rounded-xl p-5 shadow-lg space-y-4 text-left">
          <div className="space-y-1 text-center">
            <h4 className="text-base font-bold text-foreground">Welcome to GOATUI</h4>
            <span className="text-[10px] text-muted-foreground block">Sign in to start custom building layouts.</span>
          </div>
          <div className="space-y-3">
            <div className="space-y-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Email Address</span>
              <input type="email" placeholder="you@domain.com" className="w-full text-xs border border-border rounded-lg p-2 bg-secondary/20 text-foreground" disabled />
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Password</span>
              <input type="password" placeholder="••••••••" className="w-full text-xs border border-border rounded-lg p-2 bg-secondary/20 text-foreground" disabled />
            </div>
            <button className="w-full py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-md pointer-events-none opacity-80">Sign In</button>
          </div>
        </div>
      )
    },
    {
      title: "Pricing Header Block",
      description: "Clean layout for pricing plans introduction section.",
      code: `<div className="text-center space-y-4 py-8">
  <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-[10px] font-bold text-primary">
    Pricing
  </div>
  <h2 className="text-3xl font-extrabold tracking-tight">Flexible Plans for Developers</h2>
  <p className="text-sm text-muted-foreground max-w-md mx-auto">Get access to custom widgets, pre-compiled templates, and animation packs.</p>
</div>`,
      preview: (
        <div className="text-center space-y-3 py-4 max-w-sm">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-[9px] font-bold text-primary uppercase">
            Pricing plans
          </div>
          <h4 className="text-lg font-extrabold text-foreground">Flexible Plans for Developers</h4>
          <p className="text-[11px] text-muted-foreground">Get access to custom widgets, templates, and anim-packs.</p>
        </div>
      )
    }
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-6 sm:px-8 py-12 space-y-10 text-left">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Blocks Explorer</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Complete page layouts and sections assembled from core library primitives. Pre-styled with Tailwind CSS.
          </p>
        </div>

        <div className="space-y-12">
          {blocks.map((block, i) => (
            <div key={i} className="border border-border rounded-2xl overflow-hidden shadow-soft">
              {/* Header */}
              <div className="p-4 bg-card/60 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-sm text-foreground">{block.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{block.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs font-bold" 
                    onClick={() => handleCopy(block.code, i)}
                  >
                    {copiedIndex === i ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 mr-2" />}
                    {copiedIndex === i ? "Copied" : "Copy JSX"}
                  </Button>
                </div>
              </div>

              {/* Viewport content */}
              <div className="p-8 bg-secondary/15 flex items-center justify-center min-h-[220px]">
                {block.preview}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
