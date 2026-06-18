"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import * as React from "react";
import { Sun, Moon, Search, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 items-center justify-between px-6 sm:px-8 max-w-7xl">
        <div className="flex items-center gap-8">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-2.5 transition-all hover:opacity-90">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/20">
              {/* Premium geometric goat-like horn SVG logo */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M16 3c1 0 2 1 3 3 1.5 3 .5 6-1 8.5L12 21l-6-6.5c-1.5-2.5-2.5-5.5-1-8.5 1-2 2-3 3-3" />
                <path d="M12 12c.5-1.5 1.5-2.5 3-2.5" />
                <path d="M12 12C11.5 10.5 10.5 9.5 9 9.5" />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">
              Goat <span className="text-primary font-medium">UI</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/docs">
              <Button
                variant={isActive("/docs") || pathname?.startsWith("/docs") ? "secondary" : "ghost"}
                size="sm"
                className="text-sm font-semibold"
              >
                Docs
              </Button>
            </Link>
            <Link href="/components">
              <Button
                variant={isActive("/components") || pathname?.startsWith("/components") ? "secondary" : "ghost"}
                size="sm"
                className="text-sm font-semibold"
              >
                Components
              </Button>
            </Link>
            <Link href="/blocks">
              <Button
                variant={isActive("/blocks") ? "secondary" : "ghost"}
                size="sm"
                className="text-sm font-semibold"
              >
                Blocks
              </Button>
            </Link>
            <Link href="/templates">
              <Button
                variant={isActive("/templates") ? "secondary" : "ghost"}
                size="sm"
                className="text-sm font-semibold"
              >
                Templates
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                variant={isActive("/pricing") ? "secondary" : "ghost"}
                size="sm"
                className="text-sm font-semibold"
              >
                Pricing
              </Button>
            </Link>
            <Link href="/changelog">
              <Button
                variant={isActive("/changelog") ? "secondary" : "ghost"}
                size="sm"
                className="text-sm font-semibold"
              >
                Changelog
              </Button>
            </Link>
          </nav>
        </div>

        {/* Action Button & Theme Switcher */}
        <div className="flex items-center gap-2">
          {/* Search Trigger Button */}
          <button
            onClick={() => {
              const event = new KeyboardEvent("keydown", {
                key: "k",
                metaKey: true,
                bubbles: true,
              });
              document.dispatchEvent(event);
            }}
            className="flex h-9 w-40 items-center justify-between rounded-lg border border-input bg-background/50 px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground md:w-48 lg:w-56"
          >
            <span className="flex items-center gap-1.5">
              <Search className="h-3.5 w-3.5" />
              Search docs...
            </span>
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[9px] font-medium opacity-100 sm:flex">
              Ctrl K
            </kbd>
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-block"
          >
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <span className="sr-only">GitHub</span>
            </Button>
          </a>

          {/* Theme switcher */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4 text-foreground" />
              ) : (
                <Sun className="h-4 w-4 text-foreground" />
              )}
            </Button>
          )}

          <Link href="/docs">
            <Button variant="primary" size="sm" className="h-9 font-medium shadow-lg shadow-primary/10">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
