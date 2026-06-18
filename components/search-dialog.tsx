"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Command, X, Sparkles, FileText, ArrowRight } from "lucide-react"

export function SearchDialog() {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
      if (e.key === "Escape") {
        setOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    
    // Listen for custom trigger from navbar
    const handleOpenSearch = () => setOpen(true)
    window.addEventListener("open-search", handleOpenSearch)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("open-search", handleOpenSearch)
    }
  }, [])

  // Sample components matching the 335 items
  const componentsList = [
    { id: "button", name: "Button", category: "Foundation", desc: "Interactive button trigger" },
    { id: "input", name: "Input", category: "Forms", desc: "Text input field component" },
    { id: "checkbox", name: "Checkbox", category: "Forms", desc: "Toggle checkable state" },
    { id: "badge", name: "Badge", category: "Data Display", desc: "Visual status indicator label" },
    { id: "agent-card", name: "Agent Card", category: "Marketing", desc: "AI Agent layout card structure" },
    { id: "3d-product-viewer", name: "3D Product Viewer", category: "Interactive", desc: "Three-dimensional product inspect viewport" },
    { id: "navbar", name: "Navbar", category: "Navigation", desc: "Glassmorphic header navigation bar" },
  ]

  const filtered = search
    ? componentsList.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.category.toLowerCase().includes(search.toLowerCase())
      )
    : componentsList.slice(0, 5)

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-md dark:bg-black/60"
          />

          {/* Dialog Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/95 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900/95 backdrop-blur-xl mx-4"
          >
            <div className="flex items-center border-b border-zinc-200/80 px-4 dark:border-zinc-800">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search components, docs, guides..."
                className="flex h-12 w-full bg-transparent px-3 text-sm font-medium outline-none placeholder:text-muted-foreground/70 text-foreground"
                autoFocus
              />
              <div className="flex items-center gap-1">
                <kbd className="pointer-events-none hidden h-5 select-none items-center gap-0.5 rounded border border-zinc-200 bg-muted px-1.5 font-mono text-[10px] font-bold text-muted-foreground dark:border-zinc-800 sm:inline-flex">
                  <span className="text-xs">ESC</span>
                </kbd>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer border-0 bg-transparent"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="max-h-[300px] overflow-y-auto p-2">
              <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                {search ? "Search Results" : "Popular Components"}
              </div>
              
              {filtered.length === 0 ? (
                <div className="px-4 py-8 text-center text-xs text-muted-foreground font-semibold">
                  No components found matching &ldquo;{search}&rdquo;.
                </div>
              ) : (
                <div className="space-y-0.5 mt-1">
                  {filtered.map((item) => (
                    <a
                      key={item.id}
                      href={`/components#${item.id}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-blue-600/10 hover:text-blue-600 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-7 w-7 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground group-hover:text-blue-600 group-hover:border-blue-600/30">
                          <FileText className="h-3.5 w-3.5" />
                        </div>
                        <div className="text-left">
                          <span className="font-bold text-foreground block group-hover:text-blue-600">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-normal mt-0.5 block">
                            {item.desc}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground font-bold uppercase tracking-wider group-hover:bg-blue-600/20 group-hover:text-blue-600">
                          {item.category}
                        </span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground/40 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-zinc-200/80 bg-zinc-50/50 px-4 py-2 text-[10px] font-semibold text-muted-foreground dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-blue-600" />
                <span>Tip: Use keys <kbd className="font-mono bg-muted px-1 rounded border border-border">Ctrl+K</kbd> to search anywhere</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
