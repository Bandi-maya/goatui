"use client";

import React, { useState } from "react";
import Layout from "@/components/Layout";
import { 
  File, Folder, Code, Play, RefreshCw, ZoomIn, ZoomOut, Maximize, 
  ChevronRight, LayoutGrid, Terminal, Eye, Copy, Check, Download,
  Smartphone, Tablet, Laptop, Settings, Save, Undo, Redo, HelpCircle
} from "lucide-react";
import Button from "@/app/components/ui/button";
import Input from "@/app/components/ui/input";
import { useTheme } from "@/components/theme-provider";

export default function PlaygroundPage() {
  const { theme } = useTheme();
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [zoom, setZoom] = useState(100);
  const [copied, setCopied] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    "[System] GOATUI Sandbox Engine Initialized successfully.",
    "[Compile] Watching components hierarchy folder...",
    "[Layout] Desktop viewport initialized."
  ]);

  const [activeFile, setActiveFile] = useState("App.tsx");
  const [buttonText, setButtonText] = useState("Interactive Button");
  const [buttonVariant, setButtonVariant] = useState<"primary" | "secondary" | "outline" | "destructive">("primary");
  const [buttonLoading, setButtonLoading] = useState(false);

  const getCodeSnippet = () => {
    return `import { Button } from "@/components/ui/button";

export default function App() {
  return (
    <Button 
      variant="${buttonVariant}"
      loading={${buttonLoading}}
    >
      ${buttonText}
    </Button>
  );
}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopied(true);
    setConsoleLogs(prev => [...prev, "[Clipboard] Copied App.tsx code snippet."]);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    setConsoleLogs(prev => [...prev, "[Export] Exporting App.tsx components package..."]);
  };

  const files = [
    { name: "App.tsx", type: "file" },
    { name: "components.json", type: "file" },
    { name: "theme.config.ts", type: "file" },
    { name: "package.json", type: "file" }
  ];

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-4rem)] bg-background text-foreground overflow-hidden">
        {/* Toolbar Header */}
        <div className="h-12 border-b border-border bg-card flex items-center justify-between px-6 shrink-0 select-none">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Goat Sandbox</span>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground border-l border-border pl-4">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span>Sandbox Server Live</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Viewport togglers */}
            <div className="flex items-center border border-border bg-secondary/40 rounded-lg p-0.5">
              <button 
                onClick={() => { setViewport("desktop"); setConsoleLogs(prev => [...prev, "[Layout] Viewport changed to desktop."]) }} 
                className={`p-1.5 rounded-md ${viewport === "desktop" ? "bg-primary text-white" : "hover:text-foreground text-muted-foreground"}`}
              >
                <Laptop className="h-3.5 w-3.5" />
              </button>
              <button 
                onClick={() => { setViewport("tablet"); setConsoleLogs(prev => [...prev, "[Layout] Viewport changed to tablet."]) }} 
                className={`p-1.5 rounded-md ${viewport === "tablet" ? "bg-primary text-white" : "hover:text-foreground text-muted-foreground"}`}
              >
                <Tablet className="h-3.5 w-3.5" />
              </button>
              <button 
                onClick={() => { setViewport("mobile"); setConsoleLogs(prev => [...prev, "[Layout] Viewport changed to mobile."]) }} 
                className={`p-1.5 rounded-md ${viewport === "mobile" ? "bg-primary text-white" : "hover:text-foreground text-muted-foreground"}`}
              >
                <Smartphone className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Zoom controls */}
            <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
              <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-1 hover:text-foreground"><ZoomOut className="h-3.5 w-3.5" /></button>
              <span className="w-10 text-center font-mono">{zoom}%</span>
              <button onClick={() => setZoom(Math.min(150, zoom + 10))} className="p-1 hover:text-foreground"><ZoomIn className="h-3.5 w-3.5" /></button>
            </div>

            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-bold" onClick={handleCopy}>
              {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
              Copy Code
            </Button>
            <Button variant="primary" size="sm" className="h-8 gap-1.5 text-xs font-bold" onClick={handleExport}>
              <Download className="h-3.5 w-3.5" />
              Export Package
            </Button>
          </div>
        </div>

        {/* Workspace Panels */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Explorer Tree (Left Sidebar) */}
          <aside className="w-56 border-r border-border bg-card flex flex-col shrink-0 text-left select-none">
            <div className="p-4 border-b border-border text-xs font-bold uppercase tracking-wider text-muted-foreground">Explorer</div>
            <div className="flex-1 p-2 space-y-1 overflow-y-auto">
              <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground font-semibold">
                <ChevronRight className="h-3.5 w-3.5 rotate-90" />
                <span>workspace</span>
              </div>
              <div className="pl-4 space-y-0.5">
                {files.map((file) => (
                  <button
                    key={file.name}
                    onClick={() => setActiveFile(file.name)}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
                      activeFile === file.name 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-secondary/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <File className="h-3.5 w-3.5 shrink-0" />
                    <span>{file.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Code Editor and Live Canvas Layout */}
          <main className="flex-1 flex flex-col overflow-hidden">
            {/* Split Panel */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
              {/* Center Canvas Preview Frame */}
              <div className="lg:col-span-7 bg-secondary/15 flex flex-col items-center justify-center p-6 overflow-hidden relative">
                {/* Viewport mock bounding box */}
                <div 
                  style={{
                    transform: `scale(${zoom / 100})`,
                    transition: "all 0.3s ease"
                  }}
                  className={`border border-border bg-card rounded-2xl shadow-xl flex flex-col overflow-hidden transition-all ${
                    viewport === "desktop" && "w-full h-full max-h-[460px]"
                  } ${
                    viewport === "tablet" && "w-[580px] h-[400px]"
                  } ${
                    viewport === "mobile" && "w-[360px] h-[480px]"
                  }`}
                >
                  <div className="h-8 border-b border-border bg-secondary/20 flex items-center px-4 shrink-0 select-none justify-between">
                    <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">{viewport} canvas</span>
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 flex items-center justify-center p-8 bg-dot opacity-[0.4] relative overflow-auto">
                    <Button 
                      variant={buttonVariant} 
                      loading={buttonLoading} 
                      className="shadow-xl"
                    >
                      {buttonText}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Properties configurator panel */}
              <aside className="lg:col-span-5 border-l border-border bg-card overflow-y-auto text-left">
                {/* Properties panel */}
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">React Properties</h3>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground/80">Button Text</label>
                        <Input value={buttonText} onChange={(e) => setButtonText(e.target.value)} />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground/80 block">Style Variant</label>
                        <div className="grid grid-cols-2 gap-2">
                          {(["primary", "secondary", "outline", "destructive"] as const).map((v) => (
                            <button
                              key={v}
                              onClick={() => {
                                setButtonVariant(v);
                                setConsoleLogs(prev => [...prev, `[Prop] Button variant updated to: ${v}`]);
                              }}
                              className={`py-1.5 text-[10px] font-semibold border rounded-lg capitalize transition-all ${
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

                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <label htmlFor="chk-playground-loading" className="text-[10px] uppercase font-bold text-muted-foreground/80 select-none cursor-pointer">Loading State</label>
                        <input 
                          type="checkbox" 
                          id="chk-playground-loading"
                          checked={buttonLoading} 
                          onChange={(e) => {
                            setButtonLoading(e.target.checked);
                            setConsoleLogs(prev => [...prev, `[Prop] Loading state changed to: ${e.target.checked}`]);
                          }} 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Generated JSX</h3>
                    <pre className="p-4 bg-[#0A0A0A] border border-zinc-800 rounded-xl text-[10px] font-mono text-zinc-300 overflow-x-auto leading-relaxed select-all">
                      {getCodeSnippet()}
                    </pre>
                  </div>
                </div>
              </aside>
            </div>

            {/* Console Log Drawer (Bottom panel) */}
            <footer className="h-28 border-t border-border bg-card shrink-0 flex flex-col text-left">
              <div className="h-7 border-b border-border/80 bg-secondary/35 flex items-center justify-between px-6 select-none shrink-0">
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Terminal className="h-3 w-3" />
                  Execution Console logs
                </span>
                <button onClick={() => setConsoleLogs([])} className="text-[9px] font-bold text-primary hover:underline">Clear Logs</button>
              </div>
              <div className="flex-1 p-3 overflow-y-auto font-mono text-[10px] text-muted-foreground space-y-1 select-text">
                {consoleLogs.map((log, i) => (
                  <div key={i} className={log.includes("[System]") ? "text-primary" : log.includes("[Compile]") ? "text-yellow-500" : ""}>
                    {log}
                  </div>
                ))}
              </div>
            </footer>
          </main>
        </div>
      </div>
    </Layout>
  );
}
