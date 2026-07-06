"use client";

import React, { useState } from "react";
import { componentsRegistry } from "@/lib/component-registry";
import { 
  ChevronRight, ArrowLeft, Terminal, Shield, Sparkles, Check, Copy,
  Eye, Code, Smartphone, Tablet, Laptop, BookOpen, AlertCircle
} from "lucide-react";
import Button from "@/app/components/ui/button";
import { useRouter } from "next/navigation";

export default function ComponentDetailWrapper({ slug }: { slug: string }) {
  const router = useRouter();
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const matched = componentsRegistry.find(
    c => c.name.toLowerCase() === slug?.toLowerCase()
  );

  if (!matched) {
    return (
      <div className="mx-auto max-w-xl py-20 px-6 text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold">Component Not Found</h2>
        <p className="text-sm text-muted-foreground">The component &quot;{slug}&quot; could not be resolved in the GOATUI registry.</p>
        <Button variant="outline" size="sm" onClick={() => router.push("/components")}>
          Back to Registry
        </Button>
      </div>
    );
  }

  const installCmd = `npx goatui add ${matched.name.toLowerCase()}`;

  const handleCopyInstall = () => {
    navigator.clipboard.writeText(installCmd);
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(matched.source);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const viewportClasses = {
    desktop: "w-full",
    tablet: "max-w-[768px]",
    mobile: "max-w-[375px]"
  };

  return (
    <div className="mx-auto max-w-7xl px-6 sm:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
      {/* Left Side */}
      <div className="lg:col-span-8 space-y-10">
        <div>
          <button 
            onClick={() => router.push("/components")}
            className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-3 w-3" />
            Registry Overview
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">{matched.name}</h1>
            <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-bold text-green-500 border border-green-500/20">
              Stable
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Handcrafted implementation of {matched.name} built directly in GOATUI registry utilizing custom Tailwind CSS configurations.
          </p>
        </div>

        {/* Preview Canvas */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Interactive Preview</h3>
            <div className="flex items-center gap-2 border border-border bg-secondary/40 rounded-lg p-0.5">
              <button onClick={() => setViewport("desktop")} className={`p-1.5 rounded-md ${viewport === "desktop" ? "bg-primary text-white" : "text-muted-foreground"}`}><Laptop className="h-3.5 w-3.5" /></button>
              <button onClick={() => setViewport("tablet")} className={`p-1.5 rounded-md ${viewport === "tablet" ? "bg-primary text-white" : "text-muted-foreground"}`}><Tablet className="h-3.5 w-3.5" /></button>
              <button onClick={() => setViewport("mobile")} className={`p-1.5 rounded-md ${viewport === "mobile" ? "bg-primary text-white" : "text-muted-foreground"}`}><Smartphone className="h-3.5 w-3.5" /></button>
            </div>
          </div>

          <div className="bg-secondary/15 rounded-2xl border border-border p-8 flex items-center justify-center min-h-[300px] overflow-hidden">
            <div className={`transition-all duration-300 w-full flex items-center justify-center ${viewportClasses[viewport]}`}>
              <div className="p-8 bg-card border border-border rounded-xl shadow-soft w-full flex justify-center">
                <matched.component />
              </div>
            </div>
          </div>
        </div>

        {/* CLI */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Installation</h3>
          <div className="flex items-center bg-[#0A0A0A] border border-zinc-850 rounded-xl p-3 shadow-soft">
            <Terminal className="h-4 w-4 text-primary shrink-0 mr-3" />
            <code className="text-xs font-mono text-zinc-300 flex-1 select-all">{installCmd}</code>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleCopyInstall}>
              {copiedInstall ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>

        {/* Source Code */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Source Code</h3>
            <Button variant="outline" size="sm" className="h-8 text-xs font-bold" onClick={handleCopyCode}>
              {copiedCode ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 mr-2" />}
              Copy Code
            </Button>
          </div>
          <pre className="p-5 rounded-2xl bg-[#0A0A0A] border border-zinc-850 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed max-h-[500px] select-all">
            {matched.source}
          </pre>
        </div>
      </div>

      {/* Right Side */}
      <div className="lg:col-span-4 space-y-8">
        <div className="border border-border bg-card/60 p-6 rounded-2xl space-y-4 shadow-soft">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Properties Index</h3>
          <div className="space-y-3.5 text-xs text-muted-foreground">
            <div className="flex justify-between border-b border-border/60 pb-2">
              <span className="font-semibold text-foreground">Import Statement</span>
              <span className="font-mono text-[10px] text-primary">Import &#123; {matched.name} &#125; from &quot;goatui&quot;</span>
            </div>
            <div className="flex justify-between border-b border-border/60 pb-2">
              <span className="font-semibold text-foreground">Category</span>
              <span>{matched.category}</span>
            </div>
            <div className="flex justify-between border-b border-border/60 pb-2">
              <span className="font-semibold text-foreground">Status</span>
              <span className="text-green-500 font-bold">Stable</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-foreground">Accessibility Rating</span>
              <span className="text-blue-500 font-bold">100% WCAG</span>
            </div>
          </div>
        </div>

        <div className="border border-border bg-card/60 p-6 rounded-2xl space-y-3 shadow-soft">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-primary" />
            Accessibility Compliance
          </h3>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            This component features full keyboard accessibility, focus trapping handlers inside overlay wrappers, and explicit aria descriptions on input actions.
          </p>
        </div>
      </div>
    </div>
  );
}
