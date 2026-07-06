"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Copy, Check, Terminal, Shield, Zap, Layers, Sparkles, 
  Activity, Bell, Search, Star, Globe, Sun, Moon, CheckSquare, 
  ListFilter, Play, Settings, User, Eye, Code, Grid, BookOpen, AlertCircle,
  Sliders, Command, Sparkle, RefreshCw
} from "lucide-react";
import Button from "@/app/components/ui/button";
import Input from "@/app/components/ui/input";
import Checkbox from "@/app/components/ui/checkbox";
import Badge from "@/app/components/ui/badge";
import Card from "@/app/components/ui/card";
import { useTheme } from "@/components/theme-provider";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [copied, setCopied] = useState(false);
  const commandText = "npx goatui init";

  // Mouse coords tracker for reactive glow highlights in Hero
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    setMousePos({ x: clientX, y: clientY });
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Live Component Preview Canvas States
  const [activeTab, setActiveTab] = useState<"button" | "input" | "alert">("button");
  const [buttonVariant, setButtonVariant] = useState<"primary" | "secondary" | "outline" | "destructive">("primary");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [previewText, setPreviewText] = useState("Electric Blue");
  const [alertType, setAlertType] = useState<"success" | "warning" | "error" | "info">("success");

  // Physics animation values
  const [springSpeed, setSpringSpeed] = useState(0.3);
  const [magnetHovered, setMagnetHovered] = useState(false);

  return (
    <Layout>
      <div 
        onMouseMove={handleMouseMove}
        className="w-full bg-background text-foreground transition-colors duration-500 relative"
      >
        {/* Subtle Noise Texture Layer */}
        <div className="absolute inset-0 bg-noise opacity-[0.015] pointer-events-none mix-blend-overlay z-10" />

        {/* ================= HERO SECTION (INTERACTIVE OS WORKSPACE) ================= */}
        <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden border-b border-border py-20 px-6 sm:px-8">
          {/* Background Grid & Spotlights */}
          <div className="absolute inset-0 bg-dot opacity-[0.25] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,transparent_0%,var(--background)_90%)] pointer-events-none" />

          {/* Mouse Spotlight Halo */}
          <div 
            className="absolute -z-10 h-[380px] w-[380px] rounded-full bg-primary/10 blur-[120px] opacity-80 pointer-events-none transition-transform duration-300"
            style={{
              left: mousePos.x - 190,
              top: mousePos.y - 190,
              position: "fixed"
            }}
          />

          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-20">
            {/* Title / Headline Space */}
            <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold text-primary">
                <Sparkles className="h-3 w-3" />
                <span>GoatUI Developer OS v1.0</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground">
                Next-Gen Component <br />
                <span className="bg-gradient-to-r from-blue-500 via-indigo-400 to-sky-400 bg-clip-text text-transparent">
                  Ecosystem for Creators.
                </span>
              </h1>

              <p className="max-w-lg text-sm text-muted-foreground leading-relaxed">
                Combining a registry, marketplace, theme builder, and sandbox playground into a single workspace. Handcrafted with absolute visual precision, ARIA compliance, and spring-physics.
              </p>

              {/* Install cmd */}
              <div className="flex items-center w-full max-w-md gap-3 bg-secondary/40 border border-border/80 rounded-xl p-3 shadow-soft backdrop-blur-md">
                <Terminal className="h-4 w-4 text-primary shrink-0" />
                <code className="text-xs font-mono flex-1 text-left text-muted-foreground select-all">
                  {commandText}
                </code>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => handleCopyCode(commandText)}
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <Link href="/playground">
                  <Button variant="primary" className="h-11 px-5 text-xs font-bold shadow-lg shadow-blue-500/10">
                    Open Sandbox Playground
                    <ArrowRight className="h-4.5 w-4.5 ml-2" />
                  </Button>
                </Link>
                <Link href="/components">
                  <Button variant="outline" className="h-11 px-5 text-xs font-bold">
                    Explore Components
                  </Button>
                </Link>
              </div>
            </div>

            {/* Interactive Component Canvas Widget */}
            <div className="lg:col-span-6">
              <div className="w-full bg-card/60 border border-border rounded-2xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
                
                {/* Canvas Header Controls */}
                <div className="flex items-center justify-between pb-4 border-b border-border/80 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500/80" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <div className="h-3 w-3 rounded-full bg-green-500/80" />
                    <span className="text-[10px] font-mono font-bold text-muted-foreground ml-2">sandbox_canvas.tsx</span>
                  </div>
                  
                  {/* Switcher */}
                  <div className="flex bg-secondary/80 border border-border/60 rounded-lg p-0.5">
                    {(["button", "input", "alert"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${
                          activeTab === tab 
                            ? "bg-primary text-white shadow-soft" 
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Render Selected Playground Object */}
                <div className="h-56 bg-secondary/20 border border-border/60 rounded-xl flex items-center justify-center p-6 relative">
                  <AnimatePresence mode="wait">
                    {activeTab === "button" && (
                      <motion.div
                        key="btn-demo"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <Button 
                          variant={buttonVariant} 
                          loading={buttonLoading}
                          className="shadow-xl"
                        >
                          {previewText}
                        </Button>
                      </motion.div>
                    )}

                    {activeTab === "input" && (
                      <motion.div
                        key="input-demo"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-sm space-y-1.5"
                      >
                        <Input 
                          placeholder="Type playground variables..." 
                          value={previewText}
                          onChange={(e) => setPreviewText(e.target.value)}
                        />
                      </motion.div>
                    )}

                    {activeTab === "alert" && (
                      <motion.div
                        key="alert-demo"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full"
                      >
                        <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs leading-relaxed text-left ${
                          alertType === "success" && "bg-green-500/5 border-green-500/20 text-green-500"
                        } ${
                          alertType === "warning" && "bg-orange-500/5 border-orange-500/20 text-orange-500"
                        } ${
                          alertType === "error" && "bg-red-500/5 border-red-500/20 text-red-500"
                        } ${
                          alertType === "info" && "bg-blue-500/5 border-blue-500/20 text-blue-500"
                        }`}>
                          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                          <div>
                            <span className="font-bold block uppercase text-[10px] tracking-wider">System Alert</span>
                            {previewText || "Sandbox simulation status active."}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Live Variables Editing Panel */}
                <div className="mt-6 pt-4 border-t border-border/80 grid grid-cols-2 gap-4 text-left">
                  {activeTab === "button" && (
                    <>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Style Variant</span>
                        <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                          {(["primary", "secondary", "outline", "destructive"] as const).map((v) => (
                            <button
                              key={v}
                              onClick={() => setButtonVariant(v)}
                              className={`py-1 text-[10px] font-semibold border rounded-lg transition-all ${
                                buttonVariant === v 
                                  ? "bg-primary text-white border-primary" 
                                  : "bg-secondary/40 border-border hover:border-primary/50"
                              }`}
                            >
                              {v}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col justify-end space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none cursor-pointer" htmlFor="btn-loader-switch">Loading State</label>
                          <input 
                            type="checkbox" 
                            id="btn-loader-switch"
                            checked={buttonLoading} 
                            onChange={(e) => setButtonLoading(e.target.checked)}
                            className="h-4 w-7 rounded-full bg-slate-200 dark:bg-zinc-800" 
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Button Text</span>
                          <Input 
                            value={previewText} 
                            onChange={(e) => setPreviewText(e.target.value)} 
                            className="h-8 text-[11px] font-semibold bg-secondary/20"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === "input" && (
                    <div className="col-span-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Binding Value Preview</span>
                      <p className="mt-2 text-xs font-mono bg-secondary/40 p-3 rounded-lg border border-border/60 text-muted-foreground overflow-auto">
                        const [text, setText] = useState(&quot;{previewText}&quot;);
                      </p>
                    </div>
                  )}

                  {activeTab === "alert" && (
                    <>
                      <div className="col-span-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Alert Level</span>
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          {(["success", "warning", "error", "info"] as const).map((type) => (
                            <button
                              key={type}
                              onClick={() => setAlertType(type)}
                              className={`py-1.5 text-[10px] font-semibold border rounded-lg transition-all capitalize ${
                                alertType === type 
                                  ? "bg-primary text-white border-primary" 
                                  : "bg-secondary/40 border-border hover:border-primary/50"
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ================= COMPONENT ECOSYSTEM SHOWCASE ================= */}
        <section className="py-20 border-b border-border">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
            <div className="max-w-3xl text-left">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Interactive Component Ecosystem</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Every component is a micro-application designed with deep styling APIs, automated accessibility validators, and custom keyboard loops.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="p-6 rounded-2xl border border-border bg-card/40 flex flex-col text-left space-y-4 hover:border-primary/40 transition-colors shadow-soft">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Sliders className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-foreground">Fully Dynamic Variants</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Support for outline, ghost, glassmorphic, and neon configurations instantly customizable via standard components props structure.
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-6 rounded-2xl border border-border bg-card/40 flex flex-col text-left space-y-4 hover:border-primary/40 transition-colors shadow-soft">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-foreground">Built-in Accessibility</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Fully WAI-ARIA compliant, supporting focus traps, screen reader label definitions, and semantic HTML layouts out-of-the-box.
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-6 rounded-2xl border border-border bg-card/40 flex flex-col text-left space-y-4 hover:border-primary/40 transition-colors shadow-soft">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-foreground">High-End Performance</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Zero bundle-size overhead using compiled primitives. Reaches a perfect 100 on Google Lighthouse auditing metrics.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= ANIMATION ENGINE PROVING GROUND ================= */}
        <section className="py-20 border-b border-border bg-secondary/15">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-left">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Spring Physics Animation Engine</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Tasteful micro-interactions driven by natural movement algorithms. Adjust spring configuration parameters live.
                </p>
              </div>
              
              <div className="flex items-center gap-3 bg-card border border-border/80 rounded-xl p-3 shadow-soft">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Spring Friction:</span>
                <input 
                  type="range" 
                  min="0.1" 
                  max="1" 
                  step="0.05"
                  value={springSpeed}
                  onChange={(e) => setSpringSpeed(parseFloat(e.target.value))}
                  className="w-32 accent-primary"
                />
                <span className="text-xs font-mono font-bold text-foreground w-8">{springSpeed}s</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              {/* Animation 1: Spotlight Hover */}
              <div className="bg-card/40 border border-border p-6 rounded-2xl flex flex-col justify-between h-48 hover:shadow-lg transition-all group overflow-hidden relative">
                <div 
                  className="absolute inset-0 bg-[radial-gradient(circle_at_var(--x,50%)_var(--y,50%),rgba(37,99,235,0.06),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity" 
                  style={{ "--x": "30%", "--y": "40%" } as any}
                />
                <div>
                  <h4 className="font-bold text-sm text-foreground">Spotlight Glow</h4>
                  <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">Reactive mouse highlights track and illuminate card borders naturally.</p>
                </div>
                <div className="h-1 bg-border/60 rounded-full w-full overflow-hidden">
                  <motion.div 
                    animate={{ x: ["-100%", "100%"] }} 
                    transition={{ repeat: Infinity, duration: springSpeed * 10, ease: "linear" }}
                    className="h-full w-1/3 bg-primary rounded-full" 
                  />
                </div>
              </div>

              {/* Animation 2: Magnetic Hover */}
              <div 
                className="bg-card/40 border border-border p-6 rounded-2xl flex flex-col justify-between h-48 hover:shadow-lg transition-all text-left"
                onMouseEnter={() => setMagnetHovered(true)}
                onMouseLeave={() => setMagnetHovered(false)}
              >
                <div>
                  <h4 className="font-bold text-sm text-foreground">Magnetic Hover</h4>
                  <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">Interactive triggers gravitate toward the user cursor with inertia values.</p>
                </div>
                <motion.div 
                  animate={{ 
                    x: magnetHovered ? 8 : 0, 
                    y: magnetHovered ? -4 : 0 
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="self-start px-3 py-1.5 rounded-lg bg-primary text-white text-[10px] font-bold cursor-pointer"
                >
                  Hover Magnet
                </motion.div>
              </div>

              {/* Animation 3: Kinetic Typography */}
              <div className="bg-card/40 border border-border p-6 rounded-2xl flex flex-col justify-between h-48 hover:shadow-lg transition-all text-left">
                <div>
                  <h4 className="font-bold text-sm text-foreground">Kinetic Typography</h4>
                  <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">Text shifts smoothly into view character-by-character on visibility thresholds.</p>
                </div>
                <div className="flex gap-0.5 overflow-hidden">
                  {"DYNAMICS".split("").map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ 
                        delay: i * 0.05,
                        repeat: Infinity,
                        repeatDelay: 2,
                        duration: springSpeed
                      }}
                      className="text-xs font-mono font-bold text-primary"
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Animation 4: Outline Draw */}
              <div className="bg-card/40 border border-border p-6 rounded-2xl flex flex-col justify-between h-48 hover:shadow-lg transition-all text-left group">
                <div>
                  <h4 className="font-bold text-sm text-foreground">Border Draw Outline</h4>
                  <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">SVG border paths animate sequentially on hover, wrapping elements smoothly.</p>
                </div>
                <div className="w-full relative h-10 border border-dashed border-border/80 rounded flex items-center justify-center overflow-hidden">
                  <span className="text-[9px] font-mono font-bold text-muted-foreground">Animated Outline</span>
                  <div className="absolute inset-0 border border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= THEME ENGINE DEMONSTRATOR ================= */}
        <section className="py-20 border-b border-border">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 text-left space-y-6">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Zero Reload Theme Engine</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Experience high-performance, dynamic theme transitions instantly. Select variable palettes tailored for dark developer mode configurations, gold luxury, neon cyber-spaces, and glass-frosting.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {(["goat-dark", "goat-light", "leather-black", "midnight-blue", "cyber-neon", "glass-frost", "enterprise-gray", "luxury-gold"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`px-3 py-2 text-left rounded-xl border text-[11px] font-bold capitalize transition-all ${
                      theme === t 
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/10" 
                        : "bg-secondary/20 border-border hover:border-primary/50"
                    }`}
                  >
                    {t.replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              {/* Code Visualizer representing theme modifications */}
              <div className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-2xl p-6 text-left font-mono text-xs text-zinc-300 shadow-2xl relative">
                <div className="absolute top-4 right-4 flex items-center gap-1.5 text-zinc-500">
                  <Sparkle className="h-3 w-3 text-primary animate-pulse" />
                  <span className="text-[10px] font-bold">Theme Config</span>
                </div>
                <h4 className="text-zinc-500 mb-3 select-none">{"/* CSS Theme Variables */"}</h4>
                <div className="space-y-1.5 text-[11px]">
                  <div><span className="text-primary">.theme-{theme}</span> &#123;</div>
                  <div className="pl-4">--background: <span className="text-sky-400">var(--{theme}-bg)</span>;</div>
                  <div className="pl-4">--foreground: <span className="text-sky-400">var(--{theme}-fg)</span>;</div>
                  <div className="pl-4">--card: <span className="text-sky-400">var(--{theme}-card)</span>;</div>
                  <div className="pl-4">--primary: <span className="text-emerald-400">#0066FF</span>; <span className="text-zinc-600">{"// Electric Blue"}</span></div>
                  <div className="pl-4">--accent: <span className="text-indigo-400">#0A0E1A</span>; <span className="text-zinc-600">{"// Midnight Accent"}</span></div>
                  <div className="pl-4">--glow: <span className="text-sky-300">0 0 20px rgba(0, 102, 255, 0.15)</span>;</div>
                  <div>&#125;</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= DEVELOPER EXPERIENCE / REGISTRY ================= */}
        <section className="py-20 bg-secondary/15">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
            <div className="max-w-3xl text-left">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Premium Developer Experience</h2>
              <p className="text-sm text-muted-foreground mt-2">
                CLI-powered setup operations, automated registry integration workflows, and component updates handled instantly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-card border border-border p-6 rounded-2xl space-y-3">
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-primary flex items-center justify-center">
                  <Command className="h-4.5 w-4.5" />
                </div>
                <h4 className="font-bold text-sm text-foreground">Registry Commands</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Add modules instantly using <code className="font-mono text-[10px] text-primary">npx goatui add [component]</code> to populate local source code branches.
                </p>
              </div>

              <div className="bg-card border border-border p-6 rounded-2xl space-y-3">
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-primary flex items-center justify-center">
                  <RefreshCw className="h-4.5 w-4.5" />
                </div>
                <h4 className="font-bold text-sm text-foreground">Theme Syncer</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Configure CSS variables in custom config setups and sync definitions instantly across Tailwind color schemes.
                </p>
              </div>

              <div className="bg-card border border-border p-6 rounded-2xl space-y-3">
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-primary flex items-center justify-center">
                  <Layers className="h-4.5 w-4.5" />
                </div>
                <h4 className="font-bold text-sm text-foreground">Modular Architecture</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Self-contained components importing only necessary layout boundaries. Extremely light payload deliveries.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
