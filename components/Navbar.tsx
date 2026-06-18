"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Search, Sun, Moon, Laptop, Menu, X, Sparkles,  } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const navLinks = [
    { name: "Docs", href: "/docs" },
    { name: "Components", href: "/components" },
    { name: "Blocks", href: "/blocks" },
    { name: "Templates", href: "/templates" },
    { name: "Pricing", href: "/pricing" },
    { name: "Changelog", href: "/changelog" },
  ]

  const triggerSearch = () => {
    window.dispatchEvent(new CustomEvent("open-search"))
  }

  return (
    <header className="sticky top-0 z-45 w-full border-b border-border/80 bg-background/70 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8">
        
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-sm">G</span>
            </div>
            <span className="font-extrabold text-sm tracking-tight text-foreground bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text">
              GOATUI
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = pathname?.startsWith(link.href)
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    active
                      ? "text-blue-600 bg-blue-600/5 dark:bg-blue-600/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          
          {/* Search Trigger */}
          <button
            onClick={triggerSearch}
            className="hidden sm:flex items-center gap-2 rounded-lg border border-border bg-card/40 hover:bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground font-semibold w-40 transition-all cursor-pointer"
          >
            <Search className="h-3.5 w-3.5 text-muted-foreground/75" />
            <span className="flex-1 text-left text-muted-foreground/60">Search docs...</span>
            <kbd className="pointer-events-none rounded bg-muted px-1.5 font-mono text-[9px] font-bold border border-border/80">
              ⌘K
            </kbd>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg border border-border bg-card/40 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all cursor-pointer"
            aria-label="Toggle Theme"
          >
            <Sun className="h-4 w-4 dark:hidden" />
            <Moon className="h-4 w-4 hidden dark:block" />
          </button>

          {/* GitHub Icon */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg border border-border bg-card/40 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all hidden sm:inline-block"
          >
            
          </a>

          {/* Get Started button */}
          <Link href="/components" className="hidden md:inline-block">
            <Button variant="primary" className="h-9 px-4 text-xs font-semibold shadow-md shadow-blue-500/10">
              Get Started
            </Button>
          </Link>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-border bg-card/40 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/80 bg-background/95 backdrop-blur-md px-6 py-6 space-y-4 animate-slideDown absolute top-16 left-0 w-full shadow-lg">
          
          {/* Mobile search bar */}
          <button
            onClick={() => {
              setMobileMenuOpen(false)
              triggerSearch()
            }}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground w-full font-semibold"
          >
            <Search className="h-4 w-4" />
            <span>Search components &amp; docs...</span>
          </button>

          {/* Mobile links */}
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const active = pathname?.startsWith(link.href)
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    active
                      ? "text-blue-600 bg-blue-600/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
          </nav>

          <div className="pt-4 border-t border-border flex items-center justify-between gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground"
            >
              
              <span>GitHub Repository</span>
            </a>
            <Link href="/components" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
