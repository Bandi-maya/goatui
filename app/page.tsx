"use client";

import Link from "next/link";
import * as React from "react";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { ArrowRight, Copy, Check, Terminal, ShieldCheck, Zap, Layers, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [copied, setCopied] = React.useState(false);
  const commandText = "npx goatui init";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(commandText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <div className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden bg-background">
        
        {/* Visual Background: Deep Grids & Glows */}
        <div className="absolute inset-0 bg-grid opacity-30 dark:opacity-20 pointer-events-none" />
        
        {/* Mask gradient to fade the grid lines on edges */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_45%,transparent_0%,var(--background)_85%)] pointer-events-none" />
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/3 -z-10 h-[350px] w-[500px] rounded-full bg-primary/10 blur-[130px] animate-pulse pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 -z-10 h-[300px] w-[450px] rounded-full bg-blue-500/5 blur-[110px] pointer-events-none" />

        <div className="w-full max-w-7xl px-6 sm:px-8 py-12 md:py-20 flex flex-col lg:grid lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column: Hero Copywriting */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            
            {/* Announcement Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
              Goat UI v1.0 is officially live
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl leading-[1.05] text-foreground"
            >
              Build Beautiful <br />
              Interfaces <span className="text-primary">Faster</span>.
            </motion.h1>

            {/* Subtitle description */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-xl text-lg text-muted-foreground leading-relaxed"
            >
              A world-class UI component ecosystem designed for developers and product teams. 
              Copy-paste accessible, fully typed components built on top of Tailwind CSS v4 and React 19.
            </motion.p>

            {/* CTAs and Install Command Block */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2"
            >
              <Link href="/docs" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto h-12 px-6 text-sm font-semibold shadow-lg shadow-primary/25 group">
                  Explore Components
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              
              {/* Copy-paste CLI install wrapper */}
              <div 
                onClick={copyToClipboard}
                className="flex items-center justify-between gap-3 px-4 h-12 rounded-lg border border-border bg-card/60 hover:bg-card hover:border-zinc-400 dark:hover:border-zinc-700 cursor-pointer transition-all active:scale-[0.98] text-sm font-mono w-full sm:w-64"
              >
                <div className="flex items-center gap-2 text-muted-foreground select-none">
                  <Terminal className="h-4 w-4 text-primary" />
                  <span>$</span>
                  <span className="text-foreground">{commandText}</span>
                </div>
                <button className="text-muted-foreground hover:text-foreground">
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </motion.div>

            {/* Component Stats Row */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-3 gap-6 sm:gap-10 border-t border-border/80 w-full pt-8 mt-4"
            >
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-foreground">300+</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Components</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-foreground">0</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Dependencies</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-foreground">100%</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">TypeScript</span>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Premium Floating Mockups */}
          <div className="lg:col-span-5 relative w-full h-[400px] sm:h-[480px] flex items-center justify-center">
            
            {/* Glow under cards */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

            {/* Card 1: Command Menu mockup (background layer) */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-[-20px] top-[10%] w-[320px] rounded-xl border border-border bg-card/90 shadow-2xl p-4 backdrop-blur-md z-10 hidden sm:block"
            >
              <div className="flex items-center gap-2 pb-3 border-b border-border/80">
                <Search className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Type a command...</span>
              </div>
              <div className="space-y-2 pt-3">
                <div className="flex items-center justify-between rounded px-2 py-1.5 text-xs bg-primary/10 text-primary">
                  <span className="font-medium">Add Button Component</span>
                  <span className="text-[10px] text-primary/80 font-mono">⏎</span>
                </div>
                <div className="flex items-center justify-between rounded px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted">
                  <span>Search Documentation</span>
                  <span className="text-[10px] font-mono">⌘K</span>
                </div>
                <div className="flex items-center justify-between rounded px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted">
                  <span>Toggle Dark Mode</span>
                  <span className="text-[10px] font-mono">⌘D</span>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Visual Chart Card (foreground centered layer) */}
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-[290px] sm:w-[320px] rounded-xl border border-border bg-card shadow-2xl p-5 z-20 hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="flex items-center justify-between pb-3">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Output</h4>
                  <p className="text-2xl font-bold text-foreground mt-0.5">$24,856</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Zap className="h-4 w-4" />
                </div>
              </div>
              
              {/* Graphic chart SVG */}
              <div className="h-24 w-full mt-4 flex items-end">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40">
                  <defs>
                    <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 35 Q15 25 30 15 T60 25 T90 5 T100 8 L100 40 L0 40 Z"
                    fill="url(#chartGlow)"
                  />
                  <path
                    d="M0 35 Q15 25 30 15 T60 25 T90 5 T100 8"
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-4 border-t border-border/60">
                <span>Updated 2m ago</span>
                <span className="text-green-500 font-semibold">+14.2%</span>
              </div>
            </motion.div>

            {/* Card 3: Interactive Security Toggle (upper right layer) */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute right-[-10px] bottom-[10%] w-[260px] sm:w-[280px] rounded-xl border border-border bg-card/90 shadow-2xl p-4 backdrop-blur-md z-10 hidden sm:block"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-foreground truncate">Authentication Safeguards</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">MFA is active</p>
                </div>
                <div className="h-5 w-9 rounded-full bg-primary p-0.5 cursor-pointer flex justify-end">
                  <div className="h-4 w-4 rounded-full bg-white shadow-sm" />
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </Layout>
  );
}
