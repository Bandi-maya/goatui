"use client";

import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { AgentCard } from "@/components/ui/agent-card";
import { MagneticButton } from "@/components/goat/MagneticButton";
import { 
  Copy, Check, Laptop, Tablet, Smartphone, Grid, CircleDot, 
  Square, RefreshCw, Terminal, Eye, Code, Layers, Sparkles 
} from "lucide-react";

// List of available components grouped by category
const COMPONENT_GROUPS = [
  {
    name: "Foundation",
    items: [
      { id: "button", name: "Button", description: "Standard button component for user triggers." },
      { id: "magnetic-button", name: "Magnetic Button", description: "Premium copy-paste button with hover magnetism." }
    ]
  },
  {
    name: "Data Entry",
    items: [
      { id: "input", name: "Input", description: "Text field for forms, search, and login inputs." },
      { id: "checkbox", name: "Checkbox", description: "Boolean selection state element." }
    ]
  },
  {
    name: "Data Display",
    items: [
      { id: "badge", name: "Badge", description: "Small visual count or status tag." },
      { id: "agent-card", name: "Agent Card", description: "Premium AI agent information profile panel." }
    ]
  }
];

export default function ComponentsGalleryPage() {
  const [activeComponent, setActiveComponent] = useState("button");
  const [previewTab, setPreviewTab] = useState<"preview" | "code">("preview");
  const [codeFormat, setCodeFormat] = useState<"react" | "vue" | "svelte" | "html" | "tailwind">("react");
  const [canvasBg, setCanvasBg] = useState<"grid" | "dot" | "solid">("grid");
  const [canvasWidth, setCanvasWidth] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [copied, setCopied] = useState(false);

  // Button property states
  const [btnVariant, setBtnVariant] = useState<"primary" | "secondary" | "outline" | "ghost" | "gradient" | "neon" | "glass">("primary");
  const [btnSize, setBtnSize] = useState<"default" | "sm" | "lg" | "icon">("default");
  const [btnLoading, setBtnLoading] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);

  // Input property states
  const [inputType, setInputType] = useState("text");
  const [inputPlaceholder, setInputPlaceholder] = useState("Enter your email...");
  const [inputDisabled, setInputDisabled] = useState(false);

  // Checkbox property states
  const [chkChecked, setChkChecked] = useState(false);
  const [chkDisabled, setChkDisabled] = useState(false);

  // Badge property states
  const [badgeVariant, setBadgeVariant] = useState<"default" | "secondary" | "destructive" | "outline">("default");
  const [badgeCount, setBadgeCount] = useState("New");

  // Agent Card property states
  const [agentName, setAgentName] = useState("Ava");
  const [agentRole, setAgentRole] = useState("AI Developer Agent");
  const [agentStatus, setAgentStatus] = useState<"active" | "inactive">("active");

  // Magnetic Button property states
  const [magStrength, setMagStrength] = useState(0.35);
  const [magGlowColor, setMagGlowColor] = useState("rgba(37, 99, 235, 0.2)"); // Blue glow default

  // Helper to copy code to clipboard
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Code generator helper based on active component and current selected configurations
  const getGeneratedCode = () => {
    switch (activeComponent) {
      case "button":
        if (codeFormat === "react") {
          return `import { Button } from "@/components/ui/button"

export default function Demo() {
  return (
    <Button 
      variant="${btnVariant}" 
      size="${btnSize}"${btnLoading ? "\n      loading" : ""}${btnDisabled ? "\n      disabled" : ""}
    >
      Click Me
    </Button>
  )
}`;
        } else if (codeFormat === "html") {
          return `<button class="inline-flex items-center justify-center rounded-md font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 bg-blue-600 text-white hover:bg-blue-700 h-9 px-4 py-2">
  Click Me
</button>`;
        } else if (codeFormat === "vue") {
          return `<template>
  <wc-button variant="${btnVariant}" size="${btnSize}" :loading="${btnLoading}" :disabled="${btnDisabled}">
    Click Me
  </wc-button>
</template>`;
        } else if (codeFormat === "svelte") {
          return `<WcButton variant="${btnVariant}" size="${btnSize}" loading={${btnLoading}} disabled={${btnDisabled}}>
  Click Me
</WcButton>`;
        } else if (codeFormat === "tailwind") {
          return `<!-- Button Accent Variant: ${btnVariant} -->
<button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-95 bg-blue-600 text-white hover:bg-blue-600/90 h-9 px-4 py-2">
  Click Me
</button>`;
        }
        break;

      case "magnetic-button":
        if (codeFormat === "react") {
          return `import { MagneticButton } from "@/components/goat/MagneticButton"

export default function Demo() {
  return (
    <MagneticButton 
      magneticStrength={${magStrength}} 
      glowColor="${magGlowColor}"
    >
      Explore Components
    </MagneticButton>
  )
}`;
        } else if (codeFormat === "html") {
          return `<button class="relative overflow-hidden group px-6 py-3 rounded-xl font-medium text-sm border bg-zinc-900 border-zinc-800 text-zinc-200">
  Explore Components
</button>`;
        } else {
          return `<!-- Magnetic Button copy-paste markup -->
<MagneticButton magneticStrength={${magStrength}} glowColor="${magGlowColor}">
  Explore Components
</MagneticButton>`;
        }
        break;

      case "input":
        if (codeFormat === "react") {
          return `import { Input } from "@/components/ui/input"

export default function Demo() {
  return (
    <Input 
      type="${inputType}" 
      placeholder="${inputPlaceholder}"${inputDisabled ? "\n      disabled" : ""} 
    />
  )
}`;
        } else {
          return `<input 
  type="${inputType}" 
  placeholder="${inputPlaceholder}" 
  class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
/>`;
        }
        break;

      case "checkbox":
        if (codeFormat === "react") {
          return `import { Checkbox } from "@/components/ui/checkbox"

export default function Demo() {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms"${chkDisabled ? " disabled" : ""} />
      <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Accept terms and conditions
      </label>
    </div>
  )
}`;
        } else {
          return `<input type="checkbox" class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />`;
        }
        break;

      case "badge":
        if (codeFormat === "react") {
          return `import { Badge } from "@/components/ui/badge"

export default function Demo() {
  return (
    <Badge variant="${badgeVariant}">
      ${badgeCount}
    </Badge>
  )
}`;
        } else {
          return `<span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">${badgeCount}</span>`;
        }
        break;

      case "agent-card":
        if (codeFormat === "react") {
          return `import { AgentCard } from "@/components/ui/agent-card"

export default function Demo() {
  return (
    <AgentCard 
      name="${agentName}" 
      role="${agentRole}" 
      status="${agentStatus}" 
    />
  )
}`;
        } else {
          return `<!-- Agent Card UI Component Structure -->
<div class="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
  <div class="flex items-start justify-between">
    <div class="flex items-center gap-3">
      <div class="h-11 w-11 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
        ⚡
      </div>
      <div>
        <h4 class="font-semibold text-sm">${agentName}</h4>
        <p class="text-xs text-gray-500">${agentRole}</p>
      </div>
    </div>
  </div>
</div>`;
        }
        break;
    }
    return ``;
  };

  const activeCode = getGeneratedCode();

  // Canvas width layout sizes
  const widthClasses = {
    desktop: "w-full max-w-full",
    tablet: "w-full max-w-[768px]",
    mobile: "w-full max-w-[375px]"
  };

  return (
    <Layout>
      <div className="flex-1 flex flex-col md:flex-row bg-background text-foreground min-h-[calc(100vh-4rem)]">
        
        {/* Panel 1: Left Navigation / Categories (260px) */}
        <aside className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-border bg-card/15 p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold tracking-tight mb-1">Component Gallery</h2>
            <p className="text-xs text-muted-foreground">Interactive sandbox preview.</p>
          </div>
          
          <div className="space-y-4">
            {COMPONENT_GROUPS.map((group) => (
              <div key={group.name} className="space-y-1.5">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 px-2.5">
                  {group.name}
                </h4>
                <div className="flex flex-col gap-0.5">
                  {group.items.map((item) => {
                    const active = activeComponent === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveComponent(item.id);
                          setPreviewTab("preview");
                        }}
                        className={`
                          w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-left transition-all
                          ${active 
                            ? "bg-primary/10 text-primary font-semibold" 
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }
                        `}
                      >
                        <span>{item.name}</span>
                        {active && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Panel 2: Center Component Preview / Main Area */}
        <main className="flex-1 flex flex-col p-6 min-w-0 bg-background/50">
          
          {/* Top Panel Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/80 pb-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Component</span>
                <span className="text-muted-foreground/50">/</span>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {activeComponent.replace("-", " ")}
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight mt-1 text-foreground">
                {activeComponent.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
              </h1>
            </div>

            {/* Grid & Sizing Controls */}
            <div className="flex items-center gap-3 self-stretch sm:self-auto justify-end">
              
              {/* Canvas Background Controls */}
              <div className="flex items-center gap-0.5 rounded-lg border border-border bg-card p-0.5 shadow-sm">
                <button
                  onClick={() => setCanvasBg("grid")}
                  className={`p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors ${canvasBg === "grid" ? "bg-muted text-foreground" : ""}`}
                  title="Grid Background"
                >
                  <Grid className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setCanvasBg("dot")}
                  className={`p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors ${canvasBg === "dot" ? "bg-muted text-foreground" : ""}`}
                  title="Dot Background"
                >
                  <CircleDot className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setCanvasBg("solid")}
                  className={`p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors ${canvasBg === "solid" ? "bg-muted text-foreground" : ""}`}
                  title="Solid Background"
                >
                  <Square className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Sizing Controls */}
              <div className="flex items-center gap-0.5 rounded-lg border border-border bg-card p-0.5 shadow-sm">
                <button
                  onClick={() => setCanvasWidth("desktop")}
                  className={`p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors ${canvasWidth === "desktop" ? "bg-muted text-foreground" : ""}`}
                  title="Desktop Sizing"
                >
                  <Laptop className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setCanvasWidth("tablet")}
                  className={`p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors ${canvasWidth === "tablet" ? "bg-muted text-foreground" : ""}`}
                  title="Tablet Sizing"
                >
                  <Tablet className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setCanvasWidth("mobile")}
                  className={`p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors ${canvasWidth === "mobile" ? "bg-muted text-foreground" : ""}`}
                  title="Mobile Sizing"
                >
                  <Smartphone className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>
          </div>

          {/* Visual Canvas Wrapper */}
          <div className="flex-1 flex flex-col">
            
            {/* Tabs for preview / code views */}
            <div className="flex border-b border-border">
              <button
                onClick={() => setPreviewTab("preview")}
                className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                  previewTab === "preview" 
                    ? "border-primary text-primary" 
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                Preview
              </button>
              <button
                onClick={() => setPreviewTab("code")}
                className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                  previewTab === "code" 
                    ? "border-primary text-primary" 
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Code className="h-3.5 w-3.5" />
                Code View
              </button>
            </div>

            {/* Live Canvas Area */}
            <div className="flex-1 mt-4 flex items-center justify-center min-h-[350px]">
              
              {previewTab === "preview" ? (
                <div 
                  className={`
                    h-full min-h-[350px] border border-border rounded-xl flex items-center justify-center p-8 transition-all duration-300 relative overflow-hidden bg-card/25 shadow-sm
                    ${widthClasses[canvasWidth]}
                    ${canvasBg === "grid" ? "bg-grid" : canvasBg === "dot" ? "bg-dot" : "bg-card"}
                  `}
                >
                  
                  {/* Selected component renderer */}
                  {activeComponent === "button" && (
                    <Button 
                      variant={btnVariant} 
                      size={btnSize} 
                      loading={btnLoading} 
                      disabled={btnDisabled}
                      onClick={() => alert("Button Clicked!")}
                    >
                      Click Me
                    </Button>
                  )}

                  {activeComponent === "magnetic-button" && (
                    <MagneticButton 
                      magneticStrength={Number(magStrength)} 
                      glowColor={magGlowColor}
                      onClick={() => alert("Magnetic Button Clicked!")}
                    >
                      Explore Components
                    </MagneticButton>
                  )}

                  {activeComponent === "input" && (
                    <div className="w-full max-w-sm">
                      <Input 
                        type={inputType} 
                        placeholder={inputPlaceholder}
                        disabled={inputDisabled}
                      />
                    </div>
                  )}

                  {activeComponent === "checkbox" && (
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id="gallery-checkbox" 
                        checked={chkChecked}
                        disabled={chkDisabled}
                        onCheckedChange={(checked) => setChkChecked(!!checked)}
                      />
                      <label htmlFor="gallery-checkbox" className="text-sm font-medium text-foreground select-none cursor-pointer">
                        Accept terms &amp; conditions
                      </label>
                    </div>
                  )}

                  {activeComponent === "badge" && (
                    <Badge variant={badgeVariant}>
                      {badgeCount}
                    </Badge>
                  )}

                  {activeComponent === "agent-card" && (
                    <AgentCard 
                      name={agentName} 
                      role={agentRole} 
                      status={agentStatus}
                    />
                  )}

                </div>
              ) : (
                /* Code display panel in explorer center */
                <div className="w-full h-full border border-border rounded-xl bg-card overflow-hidden flex flex-col text-left">
                  
                  {/* Tab formats header */}
                  <div className="bg-secondary/40 border-b border-border/80 px-4 py-2 flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-1">
                      <Terminal className="h-3.5 w-3.5 text-primary" />
                      <span>Generated Code</span>
                    </div>

                    <button 
                      onClick={() => handleCopyCode(activeCode)}
                      className="flex items-center gap-1.5 hover:text-foreground text-muted-foreground font-medium py-1 px-2.5 rounded border border-border/80 bg-background/50 hover:bg-background"
                    >
                      {copied ? (
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

                  {/* Fenced scrollable code output */}
                  <pre className="p-5 overflow-auto text-xs font-mono leading-relaxed bg-zinc-950 text-zinc-300 flex-1 min-h-[280px]">
                    <code>{activeCode}</code>
                  </pre>
                </div>
              )}

            </div>

            {/* Actions Bar directly below the preview area */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-border/80">
              <div className="flex items-center gap-1 bg-secondary/40 rounded-lg p-0.5 border border-border">
                {(["react", "vue", "svelte", "html", "tailwind"] as const).map((format) => (
                  <button
                    key={format}
                    onClick={() => {
                      setCodeFormat(format);
                      setPreviewTab("code");
                    }}
                    className={`
                      px-3 py-1 text-xs font-semibold rounded-md capitalize transition-all
                      ${codeFormat === format 
                        ? "bg-card text-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                      }
                    `}
                  >
                    {format}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleCopyCode(activeCode)}
                  className="text-xs flex items-center gap-1.5"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy Code
                </Button>
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={() => {
                    const blob = new Blob([activeCode], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `${activeComponent}.tsx`;
                    link.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="text-xs"
                >
                  Download Source
                </Button>
              </div>
            </div>

          </div>
        </main>

        {/* Panel 3: Right Configurator / Properties Adjuster (280px) */}
        <aside className="w-full md:w-72 shrink-0 border-t md:border-t-0 md:border-l border-border bg-card/10 p-6 space-y-6">
          <div>
            <h2 className="text-sm font-bold tracking-tight uppercase text-muted-foreground/60">Properties</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Adjust custom props in real-time.</p>
          </div>

          <div className="border-t border-border/60 pt-4 space-y-5">
            
            {/* BUTTON Config options */}
            {activeComponent === "button" && (
              <div className="space-y-4 text-left">
                {/* Variant */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Variant</label>
                  <select
                    value={btnVariant}
                    onChange={(e) => setBtnVariant(e.target.value as any)}
                    className="w-full text-xs rounded-lg border border-border bg-card px-2.5 py-2 font-medium"
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

                {/* Size */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Size</label>
                  <select
                    value={btnSize}
                    onChange={(e) => setBtnSize(e.target.value as any)}
                    className="w-full text-xs rounded-lg border border-border bg-card px-2.5 py-2 font-medium"
                  >
                    <option value="default">Default</option>
                    <option value="sm">Small</option>
                    <option value="lg">Large</option>
                    <option value="icon">Icon only</option>
                  </select>
                </div>

                {/* Boolean options */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <label htmlFor="btn-loading" className="text-muted-foreground">Loading state</label>
                    <Checkbox id="btn-loading" checked={btnLoading} onCheckedChange={(checked) => setBtnLoading(!!checked)} />
                  </div>
                  <div className="flex items-center justify-between text-xs font-medium">
                    <label htmlFor="btn-disabled" className="text-muted-foreground">Disabled</label>
                    <Checkbox id="btn-disabled" checked={btnDisabled} onCheckedChange={(checked) => setBtnDisabled(!!checked)} />
                  </div>
                </div>
              </div>
            )}

            {/* MAGNETIC BUTTON Config options */}
            {activeComponent === "magnetic-button" && (
              <div className="space-y-4 text-left">
                {/* Strength */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Magnet Strength</label>
                  <select
                    value={magStrength}
                    onChange={(e) => setMagStrength(Number(e.target.value))}
                    className="w-full text-xs rounded-lg border border-border bg-card px-2.5 py-2 font-medium"
                  >
                    <option value={0.2}>Low (0.2)</option>
                    <option value={0.35}>Medium (0.35)</option>
                    <option value={0.6}>Strong (0.6)</option>
                  </select>
                </div>

                {/* Glow Color */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Hover Glow Color</label>
                  <select
                    value={magGlowColor}
                    onChange={(e) => setMagGlowColor(e.target.value)}
                    className="w-full text-xs rounded-lg border border-border bg-card px-2.5 py-2 font-medium"
                  >
                    <option value="rgba(37, 99, 235, 0.2)">Blue</option>
                    <option value="rgba(16, 185, 129, 0.2)">Green</option>
                    <option value="rgba(244, 63, 94, 0.2)">Rose</option>
                    <option value="rgba(168, 85, 247, 0.2)">Purple</option>
                  </select>
                </div>
              </div>
            )}

            {/* INPUT Config options */}
            {activeComponent === "input" && (
              <div className="space-y-4 text-left">
                {/* Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Type</label>
                  <select
                    value={inputType}
                    onChange={(e) => setInputType(e.target.value)}
                    className="w-full text-xs rounded-lg border border-border bg-card px-2.5 py-2 font-medium"
                  >
                    <option value="text">Text</option>
                    <option value="password">Password</option>
                    <option value="email">Email</option>
                    <option value="number">Number</option>
                  </select>
                </div>

                {/* Placeholder */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Placeholder</label>
                  <Input 
                    value={inputPlaceholder} 
                    onChange={(e) => setInputPlaceholder(e.target.value)} 
                    className="bg-card text-xs"
                  />
                </div>

                {/* Disabled Toggle */}
                <div className="flex items-center justify-between text-xs font-medium pt-2">
                  <label htmlFor="inp-disabled" className="text-muted-foreground">Disabled</label>
                  <Checkbox id="inp-disabled" checked={inputDisabled} onCheckedChange={(checked) => setInputDisabled(!!checked)} />
                </div>
              </div>
            )}

            {/* CHECKBOX Config options */}
            {activeComponent === "checkbox" && (
              <div className="space-y-4 text-left">
                <div className="flex items-center justify-between text-xs font-medium pt-2">
                  <label htmlFor="chk-checked" className="text-muted-foreground">Checked</label>
                  <Checkbox id="chk-checked" checked={chkChecked} onCheckedChange={(checked) => setChkChecked(!!checked)} />
                </div>
                <div className="flex items-center justify-between text-xs font-medium">
                  <label htmlFor="chk-disabled" className="text-muted-foreground">Disabled</label>
                  <Checkbox id="chk-disabled" checked={chkDisabled} onCheckedChange={(checked) => setChkDisabled(!!checked)} />
                </div>
              </div>
            )}

            {/* BADGE Config options */}
            {activeComponent === "badge" && (
              <div className="space-y-4 text-left">
                {/* Variant */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Variant</label>
                  <select
                    value={badgeVariant}
                    onChange={(e) => setBadgeVariant(e.target.value as any)}
                    className="w-full text-xs rounded-lg border border-border bg-card px-2.5 py-2 font-medium"
                  >
                    <option value="default">Default</option>
                    <option value="secondary">Secondary</option>
                    <option value="destructive">Destructive</option>
                    <option value="outline">Outline</option>
                  </select>
                </div>

                {/* Count Text */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Count label</label>
                  <Input 
                    value={badgeCount} 
                    onChange={(e) => setBadgeCount(e.target.value)} 
                    className="bg-card text-xs"
                  />
                </div>
              </div>
            )}

            {/* AGENT CARD Config options */}
            {activeComponent === "agent-card" && (
              <div className="space-y-4 text-left">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Name</label>
                  <Input 
                    value={agentName} 
                    onChange={(e) => setAgentName(e.target.value)} 
                    className="bg-card text-xs"
                  />
                </div>

                {/* Role */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Role</label>
                  <Input 
                    value={agentRole} 
                    onChange={(e) => setAgentRole(e.target.value)} 
                    className="bg-card text-xs"
                  />
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Status</label>
                  <select
                    value={agentStatus}
                    onChange={(e) => setAgentStatus(e.target.value as any)}
                    className="w-full text-xs rounded-lg border border-border bg-card px-2.5 py-2 font-medium"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            )}

          </div>
        </aside>

      </div>
    </Layout>
  );
}
