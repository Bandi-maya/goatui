"use client";

import React, { useState, useEffect, useMemo } from "react";
import Layout from "@/components/Layout";
import { AnimatePresence, motion } from "framer-motion";
import {
  Laptop, Tablet, Smartphone, Grid, CircleDot,
  Square,
  CheckCircle2,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ALL_COMPONENTS } from "@/lib/constants";
import { Categories } from "./Categories";
import { RenderComponent } from "./RenderComponent";

export default function ComponentsGalleryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  const [canvasBg, setCanvasBg] = useState<"grid" | "dot" | "solid">("grid");
  const [canvasWidth, setCanvasWidth] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const [toasts, setToasts] = useState<Array<{ id: number; title: string; description: string; variant: string }>>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
              className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-left font-bold transition-all border-0 bg-transparent cursor-pointer ${activeComponent === null ? "bg-blue-600/10 text-blue-600" : "text-slate-700 dark:text-slate-300 hover:bg-muted"
                }`}
            >
              <Grid className="h-4 w-4" />
              <span>Overview Canvas Grid</span>
            </button>

            <Categories
              searchQuery={searchQuery}
              handleComponentClick={handleComponentClick}
              activeComponent={activeComponent}
              filteredComponents={filteredComponents}
            />

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
          <RenderComponent
            filteredComponents={filteredComponents}
            handleComponentClick={handleComponentClick}
            canvasWidth={canvasWidth}
            canvasBg={canvasBg}
            addToast={addToast}
            setIsModalOpen={setIsModalOpen}
            activeComponent={activeComponent}
          />

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