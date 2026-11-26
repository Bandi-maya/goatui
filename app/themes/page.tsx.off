"use client";

import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Sliders, Copy, Check, Sparkle, RefreshCw } from "lucide-react";
import Button from "@/app/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export default function ThemesPage() {
  const { theme, setTheme } = useTheme();
  const [copied, setCopied] = useState<string | null>(null);

  const themeList = [
    { name: "goat-dark", title: "Goat Dark", bg: "bg-[#0B0F19]", border: "border-slate-800", text: "text-slate-100", variables: `--background: 222 47% 11%;
--foreground: 210 40% 98%;
--primary: 217 91% 60%;` },
    { name: "goat-light", title: "Goat Light", bg: "bg-[#FFFFFF]", border: "border-zinc-200", text: "text-zinc-900", variables: `--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;
--primary: 221.2 83.2% 53.3%;` },
    { name: "leather-black", title: "Leather Black", bg: "bg-[#050505]", border: "border-zinc-800", text: "text-zinc-100", variables: `--background: 24 18% 4%;
--foreground: 42 25% 92%;
--primary: 217 91% 60%;` },
    { name: "midnight-blue", title: "Midnight Blue", bg: "bg-[#02040A]", border: "border-slate-900", text: "text-slate-100", variables: `--background: 224 71% 4%;
--foreground: 210 40% 98%;
--primary: 217 91% 60%;` },
    { name: "cyber-neon", title: "Cyber Neon", bg: "bg-[#050005]", border: "border-purple-950", text: "text-[#E0FFFF]", variables: `--background: 320 80% 2%;
--foreground: 180 100% 90%;
--primary: 320 100% 60%;` },
    { name: "glass-frost", title: "Glass Frost", bg: "bg-[#F0F2F5]/80", border: "border-white/30", text: "text-zinc-900", variables: `--background: 0 0% 95%;
--foreground: 0 0% 10%;
--primary: 217 91% 60%;` },
    { name: "enterprise-gray", title: "Enterprise Gray", bg: "bg-[#202225]", border: "border-zinc-700", text: "text-zinc-100", variables: `--background: 210 10% 15%;
--foreground: 210 10% 95%;
--primary: 210 10% 50%;` },
    { name: "luxury-gold", title: "Luxury Gold", bg: "bg-[#0C0A05]", border: "border-amber-950", text: "text-[#F5E6CC]", variables: `--background: 30 20% 5%;
--foreground: 45 40% 90%;
--primary: 43 74% 49%;` }
  ];

  const handleCopy = (vars: string, name: string) => {
    navigator.clipboard.writeText(vars);
    setCopied(name);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-6 sm:px-8 py-12 space-y-10 text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Theme Configurator</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Dynamic color schemes utilizing CSS variables. Toggle and copy layouts for custom design tokens.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground bg-secondary/40 px-3 py-1.5 rounded-xl border border-border">
            <RefreshCw className="h-3.5 w-3.5 text-primary" />
            <span>Active theme: <span className="text-foreground capitalize">{theme.replace("-", " ")}</span></span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {themeList.map((t, idx) => {
            const isActive = theme === t.name;
            return (
              <div 
                key={idx} 
                className={`border rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all ${
                  isActive ? "border-primary shadow-lg shadow-primary/5" : "border-border bg-card/45"
                }`}
              >
                {/* Header preview */}
                <div className={`p-5 flex-1 space-y-4 ${t.bg} ${t.text}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider">{t.title}</span>
                    {isActive && (
                      <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>
                  
                  <div className="h-20 rounded-xl border flex items-center justify-center p-3 bg-card/10 backdrop-blur-sm">
                    <div className="w-full bg-card/20 border rounded-lg p-2 flex items-center gap-2">
                      <div className="h-5 w-5 rounded bg-primary" />
                      <div className="flex-1 space-y-1">
                        <div className="h-1.5 w-12 bg-foreground/40 rounded" />
                        <div className="h-1 w-8 bg-foreground/20 rounded" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer copy action */}
                <div className="p-3 bg-secondary/35 border-t border-border/80 flex items-center justify-between gap-3 text-left">
                  <button 
                    onClick={() => setTheme(t.name as any)}
                    className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline"
                  >
                    Apply Theme
                  </button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0" 
                    onClick={() => handleCopy(t.variables, t.name)}
                  >
                    {copied === t.name ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
