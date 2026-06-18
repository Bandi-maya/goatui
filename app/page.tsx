"use client";

import Link from "next/link";
import * as React from "react";
import Layout from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Copy, Check, Terminal, Shield, Zap, Layers, Sparkles, 
  Activity, Bell, Search, Star, Globe, Sun, Moon, CheckSquare, 
  ListFilter, Play, Settings, User, Eye, Code, Grid, BookOpen, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { AgentCard } from "@/components/ui/agent-card";

// Component categories list for Explorer Left Sidebar
const EXPLORER_CATEGORIES = [
  { name: "Overview", active: false },
  { name: "Components", active: true },
  { name: "Layout", active: false },
  { name: "Forms", active: false },
  { name: "Data Display", active: false },
  { name: "Navigation", active: false },
  { name: "Overlay", active: false },
  { name: "Charts", active: false },
  { name: "Utilities", active: false },
];

export default function Home() {
  const [copied, setCopied] = React.useState(false);
  const commandText = "npx goatui init";

  // Mouse coords tracker for reactive glow highlights in Hero
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    setMousePos({ x: clientX, y: clientY });
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  // Button config state in explorer properties panel
  const [expVariant, setExpVariant] = React.useState<"default" | "outline" | "ghost" | "link" | "destructive">("default");
  const [expState, setExpState] = React.useState<"default" | "hover" | "active" | "disabled" | "loading">("default");
  
  // Dynamic code generation based on configuration
  const getButtonCode = () => {
    const variantStr = expVariant !== "default" ? ` variant="${expVariant}"` : "";
    const stateStr = expState === "disabled" ? " disabled" : expState === "loading" ? " loading" : "";
    return `import { Button } from "goat-ui";

export default function App() {
  return (
    <Button${variantStr}${stateStr}>
      Button
    </Button>
  );
}`;
  };

  return (
    <Layout>
      <div 
        onMouseMove={handleMouseMove}
        className="w-full bg-background text-foreground transition-colors duration-300"
      >
        
        {/* ================= HERO SECTION ================= */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-border py-16 md:py-24">
          
          {/* Background Grid and Glowing dots */}
          <div className="absolute inset-0 bg-dot opacity-45 dark:opacity-20 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,transparent_0%,var(--background)_90%)] pointer-events-none" />

          {/* Mouse Reactive Highlights */}
          <div 
            className="absolute -z-10 h-[400px] w-[500px] rounded-full bg-primary/10 blur-[130px] opacity-70 transition-transform duration-200 pointer-events-none hidden md:block"
            style={{
              transform: `translate3d(${(mousePos.x - 500) * 0.1}px, ${(mousePos.y - 300) * 0.1}px, 0)`,
            }}
          />

          <div className="w-full max-w-7xl px-6 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10 mx-auto">
            
            {/* Left Side: Headline & Copy */}
            <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
              
              {/* Product Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Next-Generation SaaS Design System</span>
              </div>

              {/* Title */}
              <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl leading-[1.05] text-foreground">
                Professional UI Library <br />
                <span className="bg-gradient-to-r from-primary via-blue-500 to-indigo-600 bg-clip-text text-transparent">
                  Build Better. Faster. Together.
                </span>
              </h1>

              {/* Description */}
              <p className="max-w-xl text-base text-muted-foreground leading-relaxed">
                A modern, accessible, and highly customizable component library built for developers and teams. Fully styled out of the box with Tailwind CSS.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2">
                <Link href="#explorer" className="w-full sm:w-auto">
                  <Button variant="primary" className="h-12 px-6 font-semibold w-full sm:w-auto shadow-lg shadow-primary/20">
                    Get Started
                  </Button>
                </Link>
                <Link href="#showcase" className="w-full sm:w-auto">
                  <Button variant="outline" className="h-12 px-6 font-semibold w-full sm:w-auto">
                    Explore Components
                  </Button>
                </Link>
              </div>

              {/* Feature Badges Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-border/80 w-full pt-8 mt-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <Layers className="h-4 w-4 text-primary" />
                  <span>120+ Components</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Accessible</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <Settings className="h-4 w-4 text-primary" />
                  <span>Customizable</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <User className="h-4 w-4 text-primary" />
                  <span>Developer First</span>
                </div>
              </div>

            </div>

            {/* Right Side: Interactive Mockup cards (Behance style) */}
            <div className="lg:col-span-5 relative h-[450px] w-full flex items-center justify-center">
              
              {/* Floating glow particles */}
              <div className="absolute top-[20%] right-[10%] h-44 w-44 rounded-full bg-blue-500/10 blur-[80px] pointer-events-none" />
              
              {/* Analytics Card (floating layer 1) */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute right-0 top-6 w-[280px] sm:w-[320px] rounded-2xl border border-border bg-card p-5 shadow-xl shadow-zinc-200/50 dark:shadow-none z-10"
              >
                <div className="flex items-center justify-between pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Analytics</span>
                    <h3 className="text-2xl font-extrabold text-foreground mt-0.5">24.5K</h3>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-bold text-green-600">
                    <Activity className="h-3 w-3" />
                    +12.5% last month
                  </span>
                </div>
                
                {/* SVG Visual line chart */}
                <div className="h-24 w-full mt-4 flex items-end">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40">
                    <path
                      d="M0 35 L10 32 L25 35 L40 20 L55 28 L70 15 L85 10 L100 5 L100 40 L0 40 Z"
                      fill="rgba(37, 99, 235, 0.08)"
                    />
                    <path
                      d="M0 35 L10 32 L25 35 L40 20 L55 28 L70 15 L85 10 L100 5"
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </motion.div>

              {/* User Profile Card (floating layer 2) */}
              <motion.div 
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute left-0 bottom-[15%] w-[220px] rounded-2xl border border-border bg-card p-4 shadow-xl z-20"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                    JC
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <h4 className="text-xs font-bold text-foreground">Jane Carter</h4>
                    <span className="text-[10px] text-muted-foreground">jane.carter@gmail.com</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3">
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary uppercase">Pro User</span>
                  <div className="h-4 w-7 rounded-full bg-primary p-0.5 cursor-pointer flex justify-end">
                    <div className="h-3 w-3 rounded-full bg-white shadow-sm" />
                  </div>
                </div>
              </motion.div>

              {/* Floating Decorative SVG Badges (floating layer 3) */}
              <motion.div 
                animate={{ y: [0, -15, 0], rotate: [0, 3, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                className="absolute left-[15%] top-[10%] h-10 w-10 rounded-xl bg-card border border-border shadow-lg flex items-center justify-center text-primary z-30"
              >
                <Globe className="h-5 w-5 animate-pulse" />
              </motion.div>

              <motion.div 
                animate={{ y: [0, 12, 0], rotate: [0, -4, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                className="absolute right-[10%] bottom-[8%] h-12 w-12 rounded-xl bg-card border border-border shadow-lg flex items-center justify-center text-primary z-30"
              >
                <Zap className="h-6 w-6" />
              </motion.div>

            </div>

          </div>
        </section>


        {/* ================= STATISTICS SECTION ================= */}
        <section className="py-12 border-b border-border bg-card/15">
          <div className="max-w-7xl px-6 sm:px-8 mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center justify-center text-center p-4">
              <span className="text-4xl font-extrabold text-foreground">120+</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Components</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-4">
              <span className="text-4xl font-extrabold text-foreground">30+</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Categories</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-4">
              <span className="text-4xl font-extrabold text-foreground">2</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Themes</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-4">
              <span className="text-4xl font-extrabold text-foreground">100%</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Open Source</span>
            </div>
          </div>
        </section>


        {/* ================= COMPONENT EXPLORER SECTION ================= */}
        <section id="explorer" className="py-16 md:py-24 border-b border-border scroll-mt-16">
          <div className="max-w-7xl px-6 sm:px-8 mx-auto space-y-12">
            <div className="text-left max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Interactive Component Explorer</h2>
              <p className="mt-2 text-muted-foreground text-sm">
                Interact with variables, code preview setups, and layout sizes inside a real production-grade sandbox workspace.
              </p>
            </div>

            {/* Mockup Desktop Sandbox (3-column layout) */}
            <div className="w-full rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col md:grid md:grid-cols-12 min-h-[600px]">
              
              {/* Explorer Sidebar Column (Left: Grid-Cols-2) */}
              <aside className="col-span-2 border-b md:border-b-0 md:border-r border-border bg-secondary/15 p-5 text-left flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-primary text-primary-foreground flex items-center justify-center">
                      <span className="text-xs font-bold">G</span>
                    </div>
                    <span className="font-bold text-xs tracking-tight">Goat UI Explorer</span>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    {EXPLORER_CATEGORIES.map((cat, idx) => (
                      <button
                        key={idx}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          cat.active 
                            ? "bg-primary/10 text-primary" 
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-border/80 flex items-center justify-between text-xs text-muted-foreground font-semibold">
                  <span>v1.2.0</span>
                  <Settings className="h-4 w-4 hover:text-foreground cursor-pointer" />
                </div>
              </aside>

              {/* Explorer Canvas Column (Center: Grid-Cols-7) */}
              <main className="col-span-7 flex flex-col p-6 min-w-0 bg-background text-left">
                
                {/* Header title */}
                <div className="flex items-center justify-between pb-4 border-b border-border/80 mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Button</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Buttons allow users to take actions, and make choices, with a single tap.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary">Interactive</span>
                    <span className="px-2 py-0.5 rounded-full bg-zinc-500/10 border border-zinc-500/20 text-[10px] font-bold text-muted-foreground">Form</span>
                  </div>
                </div>

                {/* State Table of variants */}
                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground font-bold">
                        <th className="py-2.5 font-bold">Variant</th>
                        <th className="py-2.5 px-2 font-bold">Default</th>
                        <th className="py-2.5 px-2 font-bold">Hover</th>
                        <th className="py-2.5 px-2 font-bold">Active</th>
                        <th className="py-2.5 px-2 font-bold font-semibold">Disabled</th>
                        <th className="py-2.5 px-2 font-bold">Loading</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/80">
                      
                      {/* Row 1: Primary */}
                      <tr>
                        <td className="py-3.5 font-bold text-foreground">Primary</td>
                        <td className="py-3.5 px-2">
                          <Button variant="primary" size="sm">Button</Button>
                        </td>
                        <td className="py-3.5 px-2">
                          <Button variant="primary" size="sm" className="bg-primary-hover">Button</Button>
                        </td>
                        <td className="py-3.5 px-2">
                          <Button variant="primary" size="sm" className="scale-95 bg-primary-hover">Button</Button>
                        </td>
                        <td className="py-3.5 px-2">
                          <Button variant="primary" size="sm" disabled>Button</Button>
                        </td>
                        <td className="py-3.5 px-2">
                          <Button variant="primary" size="sm" loading>Button</Button>
                        </td>
                      </tr>

                      {/* Row 2: Secondary */}
                      <tr>
                        <td className="py-3.5 font-bold text-foreground">Secondary</td>
                        <td className="py-3.5 px-2">
                          <Button variant="secondary" size="sm">Button</Button>
                        </td>
                        <td className="py-3.5 px-2">
                          <Button variant="secondary" size="sm" className="bg-muted">Button</Button>
                        </td>
                        <td className="py-3.5 px-2">
                          <Button variant="secondary" size="sm" className="scale-95 bg-muted">Button</Button>
                        </td>
                        <td className="py-3.5 px-2">
                          <Button variant="secondary" size="sm" disabled>Button</Button>
                        </td>
                        <td className="py-3.5 px-2">
                          <Button variant="secondary" size="sm" loading>Button</Button>
                        </td>
                      </tr>

                      {/* Row 3: Outline */}
                      <tr>
                        <td className="py-3.5 font-bold text-foreground">Outline</td>
                        <td className="py-3.5 px-2">
                          <Button variant="outline" size="sm">Button</Button>
                        </td>
                        <td className="py-3.5 px-2">
                          <Button variant="outline" size="sm" className="bg-accent">Button</Button>
                        </td>
                        <td className="py-3.5 px-2">
                          <Button variant="outline" size="sm" className="scale-95 bg-accent">Button</Button>
                        </td>
                        <td className="py-3.5 px-2">
                          <Button variant="outline" size="sm" disabled>Button</Button>
                        </td>
                        <td className="py-3.5 px-2">
                          <Button variant="outline" size="sm" loading>Button</Button>
                        </td>
                      </tr>

                      {/* Row 4: Ghost */}
                      <tr>
                        <td className="py-3.5 font-bold text-foreground">Ghost</td>
                        <td className="py-3.5 px-2">
                          <Button variant="ghost" size="sm">Button</Button>
                        </td>
                        <td className="py-3.5 px-2">
                          <Button variant="ghost" size="sm" className="bg-accent text-accent-foreground">Button</Button>
                        </td>
                        <td className="py-3.5 px-2">
                          <Button variant="ghost" size="sm" className="scale-95 bg-accent text-accent-foreground">Button</Button>
                        </td>
                        <td className="py-3.5 px-2">
                          <Button variant="ghost" size="sm" disabled>Button</Button>
                        </td>
                        <td className="py-3.5 px-2">
                          <Button variant="ghost" size="sm" loading>Button</Button>
                        </td>
                      </tr>

                      {/* Row 5: Danger */}
                      <tr>
                        <td className="py-3.5 font-bold text-foreground">Danger</td>
                        <td className="py-3.5 px-2">
                          <Button variant="primary" size="sm" className="bg-red-600 hover:bg-red-700 text-white">Button</Button>
                        </td>
                        <td className="py-3.5 px-2">
                          <Button variant="primary" size="sm" className="bg-red-700 text-white">Button</Button>
                        </td>
                        <td className="py-3.5 px-2">
                          <Button variant="primary" size="sm" className="scale-95 bg-red-700 text-white">Button</Button>
                        </td>
                        <td className="py-3.5 px-2">
                          <Button variant="primary" size="sm" className="bg-red-600/50" disabled>Button</Button>
                        </td>
                        <td className="py-3.5 px-2">
                          <Button variant="primary" size="sm" className="bg-red-600 hover:bg-red-700 text-white" loading>Button</Button>
                        </td>
                      </tr>

                    </tbody>
                  </table>
                </div>

                {/* Explorer Code Generator Output */}
                <div className="mt-8 border-t border-border pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">Code Playground</span>
                    <button 
                      onClick={() => handleCopyCode(getButtonCode())}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-semibold"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>Copy Code</span>
                    </button>
                  </div>
                  
                  <pre className="p-4 rounded-xl bg-zinc-950 text-zinc-300 font-mono text-xs overflow-x-auto border border-border">
                    <code>{getButtonCode()}</code>
                  </pre>
                </div>

              </main>

              {/* Explorer Properties Column (Right: Grid-Cols-3) */}
              <aside className="col-span-3 border-t md:border-t-0 md:border-l border-border bg-secondary/15 p-5 text-left space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Properties</h4>
                </div>

                {/* Properties list */}
                <div className="space-y-3.5 border-b border-border/80 pb-5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-medium">Name</span>
                    <span className="font-semibold text-foreground">button</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-medium">Component</span>
                    <span className="font-semibold text-foreground">Button</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-medium">Category</span>
                    <span className="font-semibold text-foreground">Basic</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-medium">Type</span>
                    <span className="font-semibold text-foreground">Component</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-medium">Status</span>
                    <span className="inline-flex items-center gap-1 rounded bg-green-500/10 px-1.5 py-0.2 text-[9px] font-bold text-green-600">Stable</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-medium">Accessibility</span>
                    <span className="font-semibold text-foreground">AA</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-medium">Last Updated</span>
                    <span className="font-semibold text-foreground text-muted-foreground">2 days ago</span>
                  </div>
                </div>

                {/* Interactive Variant Modifiers */}
                <div className="space-y-3 text-xs">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Variants</h4>
                  <div className="flex flex-col gap-1.5">
                    {(["default", "outline", "ghost", "link", "destructive"] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() => setExpVariant(v)}
                        className={`w-full text-left px-3 py-2 rounded-lg border text-xs font-semibold capitalize transition-all ${
                          expVariant === v 
                            ? "bg-card border-primary text-primary shadow-sm" 
                            : "bg-background border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

              </aside>

            </div>
          </div>
        </section>


        {/* ================= DESIGN SYSTEM PANEL (SHOWCASE) ================= */}
        <section id="showcase" className="py-16 md:py-24 bg-secondary/15">
          <div className="max-w-7xl px-6 sm:px-8 mx-auto space-y-16">
            
            {/* Header section */}
            <div className="text-left border-b border-border pb-6">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Design System Specifications</h2>
              <p className="mt-2 text-muted-foreground text-sm">
                A structured overview of core tokens, colors, custom shapes, alerts, typography scales, and visual interfaces.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              
              {/* Left Column: Visual Tokens Showcase */}
              <div className="space-y-12">
                
                {/* Theme Preview Cards */}
                <div className="space-y-4 text-left">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/60">Theme Preview</h3>
                  <p className="text-xs text-muted-foreground">Goat UI is available in Light &amp; Dark (Leather Black) themes.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Light theme preview widget */}
                    <div className="rounded-xl border border-zinc-200 bg-white p-4 space-y-3 shadow-sm text-zinc-900">
                      <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400">
                        <span>Light Mode</span>
                        <Sun className="h-3.5 w-3.5 text-orange-500" />
                      </div>
                      <div className="h-24 rounded-lg bg-zinc-50 border border-zinc-200/80 flex items-center justify-center p-3">
                        <div className="w-full bg-white border border-zinc-200 rounded-lg p-2.5 flex items-center gap-2.5">
                          <div className="h-6 w-6 rounded bg-primary" />
                          <div className="flex-1 space-y-1">
                            <div className="h-2 w-16 bg-zinc-200 rounded" />
                            <div className="h-1.5 w-12 bg-zinc-150 rounded" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dark theme preview widget */}
                    <div className="rounded-xl border border-zinc-800 bg-[#0A0A0A] p-4 space-y-3 shadow-sm text-zinc-100">
                      <div className="flex items-center justify-between text-[10px] font-bold text-zinc-600">
                        <span>Dark Mode (Leather)</span>
                        <Moon className="h-3.5 w-3.5 text-blue-500" />
                      </div>
                      <div className="h-24 rounded-lg bg-[#111111] border border-zinc-850 flex items-center justify-center p-3">
                        <div className="w-full bg-[#181818] border border-zinc-800 rounded-lg p-2.5 flex items-center gap-2.5">
                          <div className="h-6 w-6 rounded bg-primary" />
                          <div className="flex-1 space-y-1">
                            <div className="h-2 w-16 bg-zinc-800 rounded" />
                            <div className="h-1.5 w-12 bg-zinc-850 rounded" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Color Palette Grid */}
                <div className="space-y-4 text-left">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/60">Color Palette</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
                    <div className="rounded-xl border border-border bg-card p-3 text-center space-y-2">
                      <div className="h-10 w-full rounded-lg bg-[#2563EB]" />
                      <div className="text-[10px]">
                        <span className="font-bold block text-foreground">Primary</span>
                        <span className="text-muted-foreground">#2563EB</span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-3 text-center space-y-2">
                      <div className="h-10 w-full rounded-lg bg-[#1D4ED8]" />
                      <div className="text-[10px]">
                        <span className="font-bold block text-foreground">Primary Hover</span>
                        <span className="text-muted-foreground">#1D4ED8</span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-3 text-center space-y-2">
                      <div className="h-10 w-full rounded-lg bg-[#DBEAFE]" />
                      <div className="text-[10px]">
                        <span className="font-bold block text-foreground">Primary Light</span>
                        <span className="text-muted-foreground">#DBEAFE</span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-3 text-center space-y-2">
                      <div className="h-10 w-full rounded-lg bg-[#16A34A]" />
                      <div className="text-[10px]">
                        <span className="font-bold block text-foreground">Success</span>
                        <span className="text-muted-foreground">#16A34A</span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-3 text-center space-y-2">
                      <div className="h-10 w-full rounded-lg bg-[#F59E0B]" />
                      <div className="text-[10px]">
                        <span className="font-bold block text-foreground">Warning</span>
                        <span className="text-muted-foreground">#F59E0B</span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-3 text-center space-y-2">
                      <div className="h-10 w-full rounded-lg bg-[#EF4444]" />
                      <div className="text-[10px]">
                        <span className="font-bold block text-foreground">Danger</span>
                        <span className="text-muted-foreground">#EF4444</span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-3 text-center space-y-2">
                      <div className="h-10 w-full rounded-lg bg-[#64748B]" />
                      <div className="text-[10px]">
                        <span className="font-bold block text-foreground">Neutral</span>
                        <span className="text-muted-foreground">#64748B</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Typography scale */}
                <div className="space-y-4 text-left">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/60">Typography</h3>
                  <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                    <div className="flex items-center gap-6 pb-4 border-b border-border/60">
                      <span className="text-5xl font-extrabold text-primary">Aa</span>
                      <div className="text-xs">
                        <span className="font-bold block text-foreground">Font Family: Inter</span>
                        <span className="text-muted-foreground">Line Height: 1.5</span>
                      </div>
                    </div>
                    <div className="space-y-2.5 text-xs text-muted-foreground">
                      <div className="flex items-center justify-between border-b border-border/40 pb-2">
                        <span className="font-bold text-foreground text-lg">Display</span>
                        <span>36px / 700</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-border/40 pb-2">
                        <span className="font-bold text-foreground text-md">Heading 1</span>
                        <span>28px / 600</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-border/40 pb-2">
                        <span className="font-bold text-foreground text-sm">Heading 2</span>
                        <span>22px / 600</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-border/40 pb-2">
                        <span className="font-bold text-foreground">Heading 3</span>
                        <span>18px / 600</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-border/40 pb-2">
                        <span className="text-foreground">Body Large</span>
                        <span>16px / 400</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Body / Small</span>
                        <span>14px / 12px</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Custom SVG Icon list */}
                <div className="space-y-4 text-left">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/60">Icons</h3>
                  <div className="rounded-xl border border-border bg-card p-5 grid grid-cols-6 gap-4 text-center justify-items-center">
                    <div className="p-2 border border-border/60 bg-secondary/35 rounded-lg text-primary hover:bg-secondary transition-colors" title="Settings"><Settings className="h-4.5 w-4.5" /></div>
                    <div className="p-2 border border-border/60 bg-secondary/35 rounded-lg text-primary hover:bg-secondary transition-colors" title="Alerts"><AlertCircle className="h-4.5 w-4.5" /></div>
                    <div className="p-2 border border-border/60 bg-secondary/35 rounded-lg text-primary hover:bg-secondary transition-colors" title="Bell"><Bell className="h-4.5 w-4.5" /></div>
                    <div className="p-2 border border-border/60 bg-secondary/35 rounded-lg text-primary hover:bg-secondary transition-colors" title="Search"><Search className="h-4.5 w-4.5" /></div>
                    <div className="p-2 border border-border/60 bg-secondary/35 rounded-lg text-primary hover:bg-secondary transition-colors" title="Shield"><Shield className="h-4.5 w-4.5" /></div>
                    <div className="p-2 border border-border/60 bg-secondary/35 rounded-lg text-primary hover:bg-secondary transition-colors" title="Activity"><Activity className="h-4.5 w-4.5" /></div>
                  </div>
                </div>

              </div>

              {/* Right Column: Interactive UI Showcase Components */}
              <div className="space-y-12">
                
                {/* Visual Buttons list */}
                <div className="space-y-4 text-left">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/60">Buttons</h3>
                  <div className="rounded-xl border border-border bg-card p-5 flex flex-wrap gap-3">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="primary" className="bg-red-600 hover:bg-red-700 text-white border-transparent shadow-[0_4px_12px_rgba(239,68,68,0.15)]">Danger</Button>
                  </div>
                </div>

                {/* Form fields & Inputs preview */}
                <div className="space-y-4 text-left">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/60">Inputs &amp; Checkboxes</h3>
                  <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground/85">Text Field</label>
                        <Input placeholder="Enter text..." className="bg-card text-xs" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground/85">Select Input</label>
                        <select className="w-full text-xs rounded-lg border border-border bg-card px-2.5 py-2 font-semibold">
                          <option>Select Option</option>
                          <option>Option One</option>
                          <option>Option Two</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 pt-2">
                      <div className="flex items-center gap-2">
                        <Checkbox id="chk-showcase-checked" defaultChecked />
                        <label htmlFor="chk-showcase-checked" className="text-xs font-semibold text-foreground select-none cursor-pointer">Checkbox</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" id="rad-showcase-1" name="rad-sh" defaultChecked className="h-4 w-4 rounded-full border border-border text-primary focus:ring-primary" />
                        <label htmlFor="rad-showcase-1" className="text-xs font-semibold text-foreground select-none cursor-pointer">Option one</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" id="rad-showcase-2" name="rad-sh" className="h-4 w-4 rounded-full border border-border text-primary focus:ring-primary" />
                        <label htmlFor="rad-showcase-2" className="text-xs font-semibold text-foreground select-none cursor-pointer">Option two</label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="space-y-4 text-left">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/60">Badges</h3>
                  <div className="rounded-xl border border-border bg-card p-5 flex flex-wrap gap-2.5">
                    <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">New</span>
                    <span className="inline-flex items-center rounded-md bg-orange-500/10 px-2.5 py-0.5 text-xs font-semibold text-orange-500 border border-orange-500/20">Beta</span>
                    <span className="inline-flex items-center rounded-md bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-500 border border-purple-500/20">Pro</span>
                    <span className="inline-flex items-center rounded-md bg-green-500/10 px-2.5 py-0.5 text-xs font-semibold text-green-600 border border-green-500/20">Success</span>
                    <span className="inline-flex items-center rounded-md bg-red-500/10 px-2.5 py-0.5 text-xs font-semibold text-red-500 border border-red-500/20">Error</span>
                    <span className="inline-flex items-center rounded-md bg-zinc-500/10 px-2.5 py-0.5 text-xs font-semibold text-zinc-500 border border-zinc-500/20">Info</span>
                  </div>
                </div>

                {/* Alerts alerts */}
                <div className="space-y-4 text-left">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/60">Alerts</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl border border-green-500/20 bg-green-500/5 p-4 text-xs text-green-600">
                      <span className="font-semibold">Success! Your changes have been saved.</span>
                      <button className="text-green-500 hover:text-green-700">✕</button>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-orange-500/20 bg-orange-500/5 p-4 text-xs text-orange-600">
                      <span className="font-semibold">Warning! Please check your input.</span>
                      <button className="text-orange-500 hover:text-orange-700">✕</button>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-500">
                      <span className="font-semibold">Error! Something went wrong.</span>
                      <button className="text-red-500 hover:text-red-700">✕</button>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-primary">
                      <span className="font-semibold">Info. This is an informative message.</span>
                      <button className="text-primary hover:text-blue-800">✕</button>
                    </div>
                  </div>
                </div>

                {/* Table & Pagination Grid */}
                <div className="space-y-4 text-left">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/60">Table &amp; Pagination</h3>
                  <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-sm">
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-border text-muted-foreground">
                            <th className="py-2 font-bold">Name</th>
                            <th className="py-2 px-2 font-bold">Role</th>
                            <th className="py-2 px-2 font-bold">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/80">
                          <tr>
                            <td className="py-3 font-semibold text-foreground">John Carter</td>
                            <td className="py-3 px-2 text-muted-foreground">Developer</td>
                            <td className="py-3 px-2">
                              <span className="rounded bg-green-500/10 border border-green-500/20 px-1.5 py-0.2 text-[9px] font-bold text-green-500">Active</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 font-semibold text-foreground">Sarah Miller</td>
                            <td className="py-3 px-2 text-muted-foreground">Designer</td>
                            <td className="py-3 px-2">
                              <span className="rounded bg-green-500/10 border border-green-500/20 px-1.5 py-0.2 text-[9px] font-bold text-green-500">Active</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 font-semibold text-foreground">Michael Brown</td>
                            <td className="py-3 px-2 text-muted-foreground">Manager</td>
                            <td className="py-3 px-2">
                              <span className="rounded bg-zinc-500/10 border border-zinc-500/20 px-1.5 py-0.2 text-[9px] font-bold text-zinc-400">Inactive</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/80 text-xs">
                      <button className="px-2.5 py-1.5 border border-border bg-background rounded-lg text-[10px] font-bold hover:bg-muted transition-colors">Previous</button>
                      <div className="flex items-center gap-1">
                        <button className="h-6 w-6 rounded bg-primary text-primary-foreground font-bold flex items-center justify-center">1</button>
                        <button className="h-6 w-6 rounded hover:bg-muted text-muted-foreground font-bold flex items-center justify-center">2</button>
                        <button className="h-6 w-6 rounded hover:bg-muted text-muted-foreground font-bold flex items-center justify-center">3</button>
                        <button className="h-6 w-6 rounded hover:bg-muted text-muted-foreground font-bold flex items-center justify-center">4</button>
                        <button className="h-6 w-6 rounded hover:bg-muted text-muted-foreground font-bold flex items-center justify-center">5</button>
                      </div>
                      <button className="px-2.5 py-1.5 border border-border bg-background rounded-lg text-[10px] font-bold hover:bg-muted transition-colors">Next</button>
                    </div>

                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>

      </div>
    </Layout>
  );
}
