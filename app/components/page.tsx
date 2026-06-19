"use client";

import React, { useState, useEffect, useMemo } from "react";
import Layout from "@/components/Layout";
import { AnimatePresence, motion } from "framer-motion";
import {
  Copy, Check, Laptop, Tablet, Smartphone, Grid, CircleDot,
  Square, Terminal, Eye, Code, ChevronRight, ChevronDown, ChevronLeft,
  Star, Info, AlertTriangle, CheckCircle2, XCircle, MoreHorizontal,
  Search, Settings, HelpCircle, LogOut, Menu, X, Sparkles, Loader2,
  UploadCloud, Inbox, Calendar, Sliders, Play, Trash2, ShieldAlert
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ALL_COMPONENTS, CATEGORIES, ComponentItem } from "@/lib/constants";
import { MiniPreview } from "./MiniPreview";
import { GeneratedCodeForComponent } from "./GenarateCodeForComponent";

export default function ComponentsGalleryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const [activeTabs, setActiveTabs] = useState<Record<string, "preview" | "code">>({});
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [copiedInstall, setCopiedInstall] = useState<Record<string, boolean>>({});
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "Foundation": true, "Forms": true, "Navigation": true, "Data Display": true,
    "Feedback": true, "Overlay": true, "Marketing": true, "Dashboard": true, "Utilities": true
  });

  const [canvasBg, setCanvasBg] = useState<"grid" | "dot" | "solid">("grid");
  const [canvasWidth, setCanvasWidth] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const [options, setOptions] = useState({
    btnVariant: "primary", btnSize: "default", btnLoading: false, btnDisabled: false,
    inputType: "text", inputPlaceholder: "Enter cloud email...", inputDisabled: false, inputHasError: false,
    chkChecked: false, chkDisabled: false, radioLayout: "vertical", radioDisabled: false,
    switchChecked: false, switchDisabled: false, ratingValue: 4, breadSeparator: "chevron",
    tabsVariant: "underline", progressValue: 60, toastVariant: "success", tooltipSide: "top",
    badgeVariant: "default", badgeLabel: "Active Node", avatarSize: "md", avatarStatus: "online",
    alertVariant: "success"
  });

  const [toasts, setToasts] = useState<Array<{ id: number; title: string; description: string; variant: string }>>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState<number | null>(0);
  const [activeTabSelect, setActiveTabSelect] = useState("tab-1");
  const [listGroupActive, setListGroupActive] = useState("inbox");
  const [tableHoveredRow, setTableHoveredRow] = useState<number | null>(null);

  // Antd interactive helper states
  const [antdStepActive, setAntdStepActive] = useState(1);
  const [antdSelectOpen, setAntdSelectOpen] = useState(false);
  const [antdSelectedOption, setAntdSelectedOption] = useState("React Framework");
  const [antdUploadStaged, setAntdUploadStaged] = useState<string | null>(null);
  const [antdDrawerOpen, setAntdDrawerOpen] = useState(false);
  const [antdPopconfirmOpen, setAntdPopconfirmOpen] = useState(false);

  const updateOption = (key: string, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedStates(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setCopiedStates(prev => ({ ...prev, [id]: false })), 2000);
  };

  const handleCopyInstall = (id: string, cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedInstall(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setCopiedInstall(prev => ({ ...prev, [id]: false })), 2000);
  };

  const addToast = (title: string, description: string, variant: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, description, variant }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const filteredComponents = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return ALL_COMPONENTS;
    return ALL_COMPONENTS.filter(comp => (
      comp.name.toLowerCase().includes(query) ||
      comp.category.toLowerCase().includes(query) ||
      comp.description.toLowerCase().includes(query) ||
      comp.tags.some(tag => tag.toLowerCase().includes(query))
    ));
  }, [searchQuery]);

  const categoryGroups = useMemo(() => {
    const groups: Record<string, ComponentItem[]> = {};
    filteredComponents.forEach(comp => {
      if (!groups[comp.category]) groups[comp.category] = [];
      groups[comp.category].push(comp);
    });
    return groups;
  }, [filteredComponents]);

  const handleComponentClick = (id: string) => {
    if (id === "overview") {
      setActiveComponent(null);
      window.history.pushState(null, "", window.location.pathname);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setActiveComponent(id);
      window.history.pushState(null, "", `#${id}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const id = window.location.hash.replace("#", "");
      if (id && ALL_COMPONENTS.some(c => c.id === id)) setActiveComponent(id);
    }
  }, []);

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const widthClasses = {
    desktop: "w-full max-w-full",
    tablet: "w-full max-w-[768px]",
    mobile: "w-full max-w-[375px]"
  };

  const selectedComponentDetails = useMemo(() => {
    if (!activeComponent) return null;
    return ALL_COMPONENTS.find(comp => comp.id === activeComponent) || null;
  }, [activeComponent]);

  return (
    <Layout>
      <div className="flex-1 flex flex-col md:flex-row bg-background text-foreground min-h-[calc(100vh-4rem)]">
        
        {/* ================= SIDEBAR (LEFT) ================= */}
        <aside className="hidden md:block w-72 shrink-0 border-r border-border bg-card/10 sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto z-20">
          <div className="p-5 space-y-6 font-sans">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Filter components ledger..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs rounded-lg bg-card/60 focus-visible:ring-blue-600 border-border"
              />
            </div>

            <button
              onClick={() => handleComponentClick("overview")}
              className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-left font-bold transition-all border-0 bg-transparent cursor-pointer ${
                activeComponent === null ? "bg-blue-600/10 text-blue-600" : "text-slate-700 dark:text-slate-300 hover:bg-muted"
              }`}
            >
              <Grid className="h-4 w-4" />
              <span>Overview Canvas Grid</span>
            </button>

            <div className="space-y-4">
              {CATEGORIES.map((cat) => {
                const items = categoryGroups[cat] || [];
                if (items.length === 0) return null;
                const isExpanded = expandedCategories[cat];

                return (
                  <div key={cat} className="space-y-1">
                    <button
                      onClick={() => toggleCategory(cat)}
                      className="w-full flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 hover:text-foreground px-2 py-1 select-none cursor-pointer border-0 bg-transparent"
                    >
                      <span>{cat}</span>
                      {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    </button>

                    {isExpanded && (
                      <div className="flex flex-col gap-0.5 pl-1.5 mt-0.5 border-l border-border/60 ml-2">
                        {items.map((item) => {
                          const active = activeComponent === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleComponentClick(item.id)}
                              className={`w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-left transition-all border-0 bg-transparent cursor-pointer ${
                                active ? "bg-blue-600/10 text-blue-600 font-semibold" : "text-slate-500 dark:text-slate-400 hover:bg-muted"
                              }`}
                            >
                              <span>{item.name}</span>
                              {active && <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ================= MAIN CONTENT (RIGHT) ================= */}
        <main className="flex-1 flex flex-col p-6 md:p-10 min-w-0 bg-background/50 relative">
          
          {activeComponent === null && (
            <div className="max-w-7xl mx-auto w-full mb-8 space-y-4 text-left animate-fadeIn">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Antd Expansion Engine</span>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">Components Library</h1>
              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                A clean, premium React & Tailwind component sandbox configured for modular injection. Built with high-fidelity, standalone, dependency-free raw snippets.
              </p>
            </div>
          )}

          {activeComponent !== null && (
            <div className="max-w-7xl mx-auto w-full mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-card/40 border border-border/80 rounded-xl p-3.5 backdrop-blur-sm shadow-sm">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Sandbox Canvas Configurator:</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-0.5 rounded-lg border border-border bg-card p-0.5 shadow-sm">
                    <button onClick={() => setCanvasBg("grid")} className={`p-1.5 rounded border-0 bg-transparent cursor-pointer ${canvasBg === "grid" ? "bg-muted text-foreground" : "text-muted-foreground"}`}><Grid className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setCanvasBg("dot")} className={`p-1.5 rounded border-0 bg-transparent cursor-pointer ${canvasBg === "dot" ? "bg-muted text-foreground" : "text-muted-foreground"}`}><CircleDot className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setCanvasBg("solid")} className={`p-1.5 rounded border-0 bg-transparent cursor-pointer ${canvasBg === "solid" ? "bg-muted text-foreground" : "text-muted-foreground"}`}><Square className="h-3.5 w-3.5" /></button>
                  </div>
                  <div className="flex items-center gap-0.5 rounded-lg border border-border bg-card p-0.5 shadow-sm">
                    <button onClick={() => setCanvasWidth("desktop")} className={`p-1.5 rounded border-0 bg-transparent cursor-pointer ${canvasWidth === "desktop" ? "bg-muted text-foreground" : "text-muted-foreground"}`}><Laptop className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setCanvasWidth("tablet")} className={`p-1.5 rounded border-0 bg-transparent cursor-pointer ${canvasWidth === "tablet" ? "bg-muted text-foreground" : "text-muted-foreground"}`}><Tablet className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setCanvasWidth("mobile")} className={`p-1.5 rounded border-0 bg-transparent cursor-pointer ${canvasWidth === "mobile" ? "bg-muted text-foreground" : "text-muted-foreground"}`}><Smartphone className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* OVERVIEW GRID VIEW */}
          {activeComponent === null ? (
            <div className="max-w-7xl mx-auto w-full mb-16 space-y-6 text-left animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {filteredComponents.map((comp) => (
                  <div key={comp.id} className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 hover:border-blue-600/40 hover:shadow-lg transition-all duration-300">
                    <div className="space-y-3">
                      <div className="h-28 rounded-lg border border-border/80 bg-slate-50 dark:bg-zinc-900/50 flex items-center justify-center overflow-hidden relative transition-colors">
                        <MiniPreview id={comp.id} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-foreground">{comp.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{comp.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleComponentClick(comp.id)}
                      className="mt-4 w-full flex items-center justify-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 border border-blue-600/20 dark:border-blue-400/20 hover:bg-blue-600 hover:text-white py-2 rounded-lg transition-all cursor-pointer"
                    >
                      Inspect Component <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* INDIVIDUAL REFACTOR PREVIEW VIEW CANVAS */
            selectedComponentDetails && (
              <div className="max-w-7xl mx-auto w-full space-y-6 text-left animate-fadeIn">
                <button onClick={() => handleComponentClick("overview")} className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold mb-2 hover:underline border-0 bg-transparent cursor-pointer p-0">
                  <ChevronLeft className="h-4 w-4" /> Back to Dashboard Overview Canvas Grid
                </button>

                {(() => {
                  const comp = selectedComponentDetails;
                  const tab = activeTabs[comp.id] || "preview";
                  const setTab = (t: "preview" | "code") => setActiveTabs(prev => ({ ...prev, [comp.id]: t }));
                  const code = GeneratedCodeForComponent(comp.id, options);

                  return (
                    <section id={comp.id} className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-6 shadow-sm focus:outline-none">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-600/10 px-2 py-0.5 rounded">{comp.category}</span>
                            <span className="text-xs text-muted-foreground">/ {comp.id}</span>
                          </div>
                          <h3 className="text-xl font-bold tracking-tight mt-1 text-foreground">{comp.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed">{comp.description}</p>
                        </div>
                        <div className="flex items-center border border-border bg-slate-50 dark:bg-zinc-900/40 rounded-lg p-0.5 pr-2 gap-1 text-[11px] font-mono">
                          <span className="bg-muted px-2 py-1 rounded font-medium">install</span>
                          <span className="px-1.5">{comp.id}</span>
                          <button onClick={() => handleCopyInstall(comp.id, comp.installationCommand)} className="hover:text-foreground border-0 bg-transparent cursor-pointer">
                            {copiedInstall[comp.id] ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex border-b border-border text-xs font-semibold gap-1">
                        <button onClick={() => setTab("preview")} className={`px-4 py-2 border-b-2 border-0 bg-transparent cursor-pointer ${tab === "preview" ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground"}`}><Eye className="h-3.5 w-3.5 inline mr-1" /> Preview Component</button>
                        <button onClick={() => setTab("code")} className={`px-4 py-2 border-b-2 border-0 bg-transparent cursor-pointer ${tab === "code" ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground"}`}><Code className="h-3.5 w-3.5 inline mr-1" /> Inspect Clean Markup</button>
                      </div>

                      {tab === "preview" ? (
                        <div className="space-y-6">
                          <div className="w-full flex items-center justify-center">
                            <div className={`min-h-[300px] border border-border rounded-xl flex items-center justify-center p-6 md:p-8 transition-all relative overflow-hidden bg-card/25 shadow-sm ${widthClasses[canvasWidth]} ${canvasBg === "grid" ? "bg-grid" : canvasBg === "dot" ? "bg-dot" : "bg-card/20"}`}>
                              
                              {/* ANTD STEPPER PIPELINE */}
                              {comp.id === "steps" && (
                                <div className="w-full max-w-md flex flex-col md:flex-row items-start gap-4 text-left select-none">
                                  {[
                                    { title: "Authenticate", desc: "Verify gateway configuration keys" },
                                    { title: "Compile Build", desc: "Bundle structural runtime modules" },
                                    { title: "CDN Release", desc: "Propagate active edge instances" }
                                  ].map((step, idx) => (
                                    <div key={idx} className="flex-1 flex flex-col gap-2 relative">
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => setAntdStepActive(idx)}
                                          className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all cursor-pointer ${
                                            idx < antdStepActive ? "bg-green-500 border-green-500 text-white" :
                                            idx === antdStepActive ? "bg-blue-600 border-blue-600 text-white shadow shadow-blue-600/20" :
                                            "border-slate-200 dark:border-zinc-800 bg-card text-muted-foreground"
                                          }`}
                                        >
                                          {idx < antdStepActive ? "✓" : idx + 1}
                                        </button>
                                        <span className={`text-xs font-bold ${idx === antdStepActive ? "text-blue-600" : "text-foreground"}`}>{step.title}</span>
                                      </div>
                                      <p className="text-[10px] text-muted-foreground pl-10 leading-tight">{step.desc}</p>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* ANTD SEARCHABLE SELECT INTERACTIVE PANEL */}
                              {comp.id === "select" && (
                                <div className="w-full max-w-xs relative text-left select-none">
                                  <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 mb-1.5">Runtime Architecture Infrastructure</label>
                                  <div
                                    onClick={() => setAntdSelectOpen(!antdSelectOpen)}
                                    className="w-full h-10 border border-slate-200 dark:border-zinc-800 rounded-xl bg-card/60 px-3.5 py-2 flex items-center justify-between text-xs font-medium text-foreground cursor-pointer hover:border-blue-500 transition-colors"
                                  >
                                    <span>{antdSelectedOption}</span>
                                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${antdSelectOpen ? "rotate-180" : ""}`} />
                                  </div>
                                  {antdSelectOpen && (
                                    <div className="absolute top-[105%] left-0 w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-1 shadow-2xl z-50 animate-fadeIn">
                                      {["React Core Engine", "Vue Modular Cluster", "Angular Structural Base", "NextJS Build Framework"].map((opt) => (
                                        <button
                                          key={opt}
                                          onClick={() => { setAntdSelectedOption(opt); setAntdSelectOpen(false); }}
                                          className={`w-full text-left text-xs font-medium px-3 py-2 rounded-lg flex items-center justify-between border-0 bg-transparent cursor-pointer ${
                                            antdSelectedOption === opt ? "bg-blue-600 text-white" : "text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900"
                                          }`}
                                        >
                                          <span>{opt}</span>
                                          {antdSelectedOption === opt && <Check className="h-3.5 w-3.5" />}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* ANTD DRAG AND DROP FILE UPLOAD AREA */}
                              {comp.id === "upload" && (
                                <div className="w-full max-w-sm text-left">
                                  <div
                                    onClick={() => setAntdUploadStaged("compiled-deployment-package.zip")}
                                    className="w-full border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-xl p-6 text-center transition-all flex flex-col items-center justify-center cursor-pointer bg-card/20 hover:border-blue-500/50"
                                  >
                                    <UploadCloud className="h-8 w-8 text-blue-600 mb-2" />
                                    <span className="text-xs font-bold text-foreground">Click here to select or map active system files</span>
                                    <p className="text-[10px] text-muted-foreground mt-1">Supports distribution ZIP bundles up to 64MB logs.</p>
                                  </div>
                                  {antdUploadStaged && (
                                    <div className="mt-3 border border-green-500/20 bg-green-500/5 rounded-xl p-2.5 flex items-center justify-between text-xs text-green-700 dark:text-green-400 font-semibold animate-fadeIn">
                                      <span className="truncate">{antdUploadStaged}</span>
                                      <button onClick={() => setAntdUploadStaged(null)} className="text-red-500 border-0 bg-transparent cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* ANTD CHRONOLOGICAL ACTIVITY TIMELINE DOTS */}
                              {comp.id === "timeline" && (
                                <div className="w-full max-w-xs space-y-4 text-left select-none">
                                  {[
                                    { label: "Deployment Successful Node Shard 1", time: "10:42 AM", dot: "bg-green-500" },
                                    { label: "Database Core Architecture Seeded", time: "10:39 AM", dot: "bg-blue-600" },
                                    { label: "Staging Pipeline Verification Sequence Init", time: "09:12 AM", dot: "bg-amber-500" }
                                  ].map((item, idx, arr) => (
                                    <div key={idx} className="flex gap-4 relative pl-1">
                                      {idx !== arr.length - 1 && <div className="absolute left-2.5 top-3 bottom-0 w-px bg-slate-200 dark:bg-zinc-800 -ml-[0.5px]" />}
                                      <div className={`h-2.5 w-2.5 rounded-full mt-1 shrink-0 border-2 border-card relative z-10 ${item.dot}`} />
                                      <div>
                                        <h5 className="text-xs font-bold text-foreground leading-none">{item.label}</h5>
                                        <span className="text-[10px] text-muted-foreground font-mono mt-0.5 block">{item.time}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* ANTD EMPTY INBOX PLACEHOLDER STATS */}
                              {comp.id === "empty" && (
                                <div className="w-full max-w-sm rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 bg-card/10 p-8 text-center select-none">
                                  <div className="h-12 w-12 rounded-full bg-slate-50 dark:bg-zinc-900 flex items-center justify-center mx-auto mb-3 border border-slate-100 dark:border-zinc-800">
                                    <Inbox className="h-5 w-5 text-muted-foreground/60" />
                                  </div>
                                  <h4 className="text-xs font-bold text-foreground">No Historical Architecture Data Tracked</h4>
                                  <p className="text-[11px] text-muted-foreground max-w-xs mx-auto mt-1 leading-relaxed">Adjust configuration rules or change filtering scopes.</p>
                                </div>
                              )}

                              {/* ANTD SPIN SYSTEM INDICATOR MODAL */}
                              {comp.id === "spin" && (
                                <div className="w-full max-w-sm border border-slate-200 dark:border-zinc-800 rounded-xl p-6 bg-card/40 flex flex-col items-center justify-center text-center h-44 select-none">
                                  <Loader2 className="h-7 w-7 text-blue-600 animate-spin mb-2" />
                                  <span className="text-xs font-bold text-blue-600">Resolving Data Parameters...</span>
                                </div>
                              )}

                              {/* ANTD TRANSACTION RESULT COMPACT DISPLAY HEADER */}
                              {comp.id === "result" && (
                                <div className="w-full max-w-md rounded-xl border border-slate-200 dark:border-zinc-800 bg-card p-6 text-center space-y-4 shadow-sm animate-fadeIn">
                                  <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto" />
                                  <div>
                                    <h4 className="text-sm font-extrabold text-foreground">Cluster Synchronization Success</h4>
                                    <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">CDN distribution models executed securely without trace mutations.</p>
                                  </div>
                                </div>
                              )}

                              {/* ANTD OVERLAY CANVAS SHEET SIDE DRAWER */}
                              {comp.id === "drawer" && (
                                <div>
                                  <button onClick={() => setAntdDrawerOpen(true)} className="bg-blue-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl border-0 cursor-pointer shadow">
                                    Trigger Side Drawer Sheet Panel
                                  </button>
                                  {antdDrawerOpen && (
                                    <div className="fixed inset-0 z-50 flex justify-end">
                                      <div onClick={() => setAntdDrawerOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-xs" />
                                      <div className="relative w-80 h-full bg-white dark:bg-zinc-950 border-l border-slate-200 dark:border-zinc-900 p-5 shadow-2xl flex flex-col justify-between animate-fadeIn">
                                        <div className="flex items-center justify-between border-b pb-3">
                                          <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground">Drawer Dashboard Parameters</h4>
                                          <button onClick={() => setAntdDrawerOpen(false)} className="border-0 bg-transparent cursor-pointer text-muted-foreground"><X className="h-4 w-4" /></button>
                                        </div>
                                        <button onClick={() => setAntdDrawerOpen(false)} className="w-full bg-blue-600 text-white py-2 rounded-xl text-xs font-bold border-0 cursor-pointer">Close Drawer</button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* ANTD POPCONFIRM INSIDE ANCHOR TOOLTIP */}
                              {comp.id === "popconfirm" && (
                                <div className="relative inline-block">
                                  <button onClick={() => setAntdPopconfirmOpen(!antdPopconfirmOpen)} className="bg-red-500 hover:bg-red-650 text-white font-bold text-xs py-2.5 px-4 rounded-xl border-0 cursor-pointer shadow">
                                    Purge Workspace Node
                                  </button>
                                  {antdPopconfirmOpen && (
                                    <div className="absolute bottom-[110%] left-1/2 -translate-x-1/2 w-48 rounded-xl border border-border bg-card p-3 shadow-2xl z-50 text-left">
                                      <p className="text-[11px] font-bold text-foreground">Delete cloud cluster instances?</p>
                                      <div className="flex justify-end gap-1 mt-2">
                                        <button onClick={() => setAntdPopconfirmOpen(false)} className="text-[9px] font-bold px-2 py-0.5 bg-muted rounded border-0 cursor-pointer text-foreground">Cancel</button>
                                        <button onClick={() => { setAntdPopconfirmOpen(false); addToast("Database Cleared", "Staging indices removed.", "success"); }} className="text-[9px] font-bold px-2 py-0.5 bg-red-500 text-white border-0 cursor-pointer">Purge</button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* DEFAULT PLACEHOLDER INJECTION WRAPPERS */}
                              {comp.id === "button" && <button className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-xl text-xs border-0 cursor-pointer">Click Me</button>}
                              {comp.id === "input" && <Input placeholder="Input preview template frame..." className="max-w-xs focus-visible:ring-blue-600" />}
                              {comp.id === "checkbox" && <div className="flex items-center gap-2 text-xs font-bold"><input type="checkbox" className="accent-blue-600" /> Verify Component Parameter Actions</div>}
                              {comp.id === "radio" && <div className="flex gap-4 text-xs font-bold"><label className="flex items-center gap-1"><input type="radio" name="r" defaultChecked className="accent-blue-600" /> Option Primary</label></div>}
                              {comp.id === "switch" && <div className="h-5 w-9 bg-blue-600 rounded-full p-0.5 flex justify-end"><div className="h-4 w-4 bg-white rounded-full" /></div>}
                              {comp.id === "rating" && <div className="flex gap-1"><Star className="h-5 w-5 fill-amber-400 stroke-amber-400" /><Star className="h-5 w-5 stroke-muted-foreground" /></div>}
                              {comp.id === "slider" && <input type="range" className="accent-blue-600 w-full max-w-xs" />}
                              {comp.id === "navbar" && <div className="w-full max-w-md border rounded-xl bg-card p-3 flex justify-between text-xs font-bold"><span>Logo</span><span>Docs</span></div>}
                              {comp.id === "breadcrumb" && <div className="text-xs text-muted-foreground">Home &gt; Components &gt; <span className="text-blue-600 font-bold">Timeline</span></div>}
                              {comp.id === "pagination" && <div className="flex gap-1 text-xs"><button className="h-7 px-2.5 border rounded-lg bg-blue-600 text-white font-bold">1</button></div>}
                              {comp.id === "tabs" && <div className="border-b text-xs font-bold text-blue-600 pb-1 border-blue-600">Active Pipeline Node</div>}
                              {comp.id === "card" && <div className="border rounded-xl p-4 w-48 text-left bg-card"><div className="h-2 w-12 bg-blue-600 rounded mb-1" /><div className="h-1.5 w-full bg-muted rounded" /></div>}
                              {comp.id === "statistics" && <div className="text-left"><span className="text-xs text-muted-foreground">Gateway Load</span><h4 className="text-xl font-black">94.2%</h4></div>}
                              {comp.id === "list-group" && <div className="w-48 border rounded-xl bg-card p-2 text-xs text-blue-600 font-bold bg-blue-600/5">Indexed Choice Stack</div>}
                              {comp.id === "table" && <div className="w-48 border rounded-xl bg-card p-2 text-[10px] text-muted-foreground">Tabular visualization canvas</div>}
                              {comp.id === "alert" && <div className="border border-green-500/20 bg-green-500/10 rounded-xl p-3 text-xs text-green-700 dark:text-green-400 font-bold">✓ Parameters Updated</div>}
                              {comp.id === "progress-bar" && <div className="w-40 bg-slate-200 h-2 rounded-full overflow-hidden"><div className="bg-blue-600 h-full w-2/3" /></div>}
                              {comp.id === "toast" && <button onClick={() => addToast("Sync Complete", "CDN channels updated.", "success")} className="bg-blue-600 text-white font-bold text-xs py-2 px-4 rounded-xl border-0 cursor-pointer">Trigger Floating Toast Notification</button>}
                              {comp.id === "modal" && <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white font-bold text-xs py-2 px-4 rounded-xl border-0 cursor-pointer">Launch Modal Window Dialog</button>}
                              {comp.id === "tooltip" && <div className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-semibold border text-foreground">Hover triggers tooltips info boxes</div>}
                              {comp.id === "dropdown" && <button className="border text-xs px-4 py-2 rounded-xl bg-card">Action Configuration Drops</button>}
                              {comp.id === "hero" && <div className="text-center"><h3 className="text-lg font-black text-foreground">Premium Layout Blocks</h3></div>}
                              {comp.id === "metric-card" && <div className="border rounded-xl p-4 bg-card w-40 text-left"><p className="text-[11px] text-muted-foreground">Cluster Core</p><h4 className="text-lg font-bold text-blue-600">Active Node</h4></div>}
                              {comp.id === "skeleton" && <div className="w-40 space-y-2 animate-pulse"><div className="h-3.5 bg-slate-200 dark:bg-zinc-800 rounded w-full" /><div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-5/6" /></div>}
                              {comp.id === "badge" && <span className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">Active</span>}
                              {comp.id === "avatar" && <div className="h-10 w-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">GOAT</div>}

                            </div>
                          </div>
                        </div>
                      ) : (
                        /* CODE PREVIEW GENERATION VIEW */
                        <div className="w-full border border-border rounded-xl bg-card overflow-hidden flex flex-col text-left">
                          <div className="bg-secondary/40 border-b border-border/80 px-4 py-2 flex items-center justify-between text-xs font-semibold select-none">
                            <div className="flex items-center gap-1.5">
                              <Terminal className="h-3.5 w-3.5 text-blue-600" />
                              <span>Production-Ready Modular React Markup File</span>
                            </div>
                            <button
                              onClick={() => handleCopyCode(comp.id, code)}
                              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground font-medium py-1 px-2.5 rounded border border-border/80 bg-background/50 cursor-pointer"
                            >
                              {copiedStates[comp.id] ? <span className="text-green-500 font-bold">Copied!</span> : <span>Copy Snippet Code</span>}
                            </button>
                          </div>
                          <pre className="p-5 overflow-x-auto text-[11px] font-mono leading-relaxed bg-zinc-950 text-zinc-300 min-h-[220px]">
                            <code>{code}</code>
                          </pre>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-border/60 select-none">
                        <button onClick={() => setTab(tab === "preview" ? "code" : "preview")} className="text-xs text-muted-foreground hover:text-foreground border border-border px-3.5 py-1.5 rounded-lg hover:bg-muted font-semibold cursor-pointer">
                          {tab === "preview" ? "View Raw Source Code" : "Return to Live Sandbox Canvas"}
                        </button>
                        <button onClick={() => handleCopyCode(comp.id, code)} className="text-xs bg-blue-600 text-white px-4 py-1.5 rounded-lg font-bold border-0 cursor-pointer hover:bg-blue-700">
                          Copy Structural Code Component
                        </button>
                      </div>
                    </section>
                  );
                })()}
              </div>
            )
          )}

          {/* FLOATING DIALOG CONFIRMATION WINDOW MODAL */}
          <AnimatePresence>
            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-xs" />
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-2xl z-10 text-left border-blue-600/20">
                  <h4 className="text-base font-extrabold text-foreground">Confirm Operation Parameter Inject</h4>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Are you certain you want to commit these deployment parameter targets to production CDN lines?</p>
                  <div className="flex justify-end gap-2 mt-5">
                    <button onClick={() => setIsModalOpen(false)} className="text-xs font-semibold text-slate-500 border border-border px-4 py-2 rounded-lg hover:bg-muted cursor-pointer">Cancel Action</button>
                    <button onClick={() => { setIsModalOpen(false); addToast("Parameters Saved", "Cluster metrics synced successfully.", "success"); }} className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg border-0 cursor-pointer">Approve Change</button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* FLOATING ACTION NOTIFICATION TOAST OVERLAYS */}
          <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
            <AnimatePresence>
              {toasts.map((toast) => (
                <motion.div
                  key={toast.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 rounded-xl border bg-card shadow-xl border-l-4 border-l-green-500 pointer-events-auto flex items-start gap-3 text-left border-border/80"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-foreground">{toast.title}</h5>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{toast.description}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </main>
      </div>
    </Layout>
  );
}