"use client"

import * as React from "react"
import { Menu, X, ArrowRight, Sparkles } from "lucide-react"

export interface NavbarProps {
  brandName?: string
  links?: { name: string; href: string }[]
}

export function Navbar({
  brandName = "Aegis",
  links = [
    { name: "Features", href: "#" },
    { name: "Pricing", href: "#" },
    { name: "Resources", href: "#" },
    { name: "Contact", href: "#" },
  ],
}: NavbarProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="w-full max-w-4xl rounded-2xl border border-border bg-card/60 backdrop-blur-md px-5 py-3.5 shadow-soft hover:shadow-hover hover:border-blue-600/10 transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-left relative overflow-hidden">
      
      {/* Top Header line */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-sm tracking-tight text-foreground select-none">
          <div className="h-5 w-5 rounded bg-blue-600 text-white flex items-center justify-center text-[10px]">
            <span>A</span>
          </div>
          <span>{brandName}</span>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer border-0 bg-transparent"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav Menu and CTA Section */}
      <div
        className={`
          flex-col md:flex-row md:items-center gap-5 md:flex
          ${open ? "flex" : "hidden"}
        `}
      >
        <nav className="flex flex-col md:flex-row items-start md:items-center gap-1">
          {links.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className="px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all"
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 pt-2 md:pt-0 border-t border-border md:border-t-0">
          <button className="text-xs font-semibold text-muted-foreground hover:text-foreground px-2.5 py-1.5 cursor-pointer border-0 bg-transparent">
            Log In
          </button>
          <button className="inline-flex items-center gap-1 rounded-xl bg-blue-600 text-white text-[11px] font-bold px-3 py-1.5 hover:bg-blue-700 shadow-md shadow-blue-500/10 transition-all cursor-pointer border-0">
            <span>Get Started</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
