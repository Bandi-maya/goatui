"use client";

import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200">
      {/* Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/40 py-8 md:py-12 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
              >
                <path d="M16 3c1 0 2 1 3 3 1.5 3 .5 6-1 8.5L12 21l-6-6.5c-1.5-2.5-2.5-5.5-1-8.5 1-2 2-3 3-3" />
                <path d="M12 12c.5-1.5 1.5-2.5 3-2.5" />
                <path d="M12 12C11.5 10.5 10.5 9.5 9 9.5" />
              </svg>
            </div>
            <span className="font-bold text-base tracking-tight text-foreground">
              Goat <span className="text-primary font-medium">UI</span>
            </span>
            <span className="text-muted-foreground/30 text-sm">|</span>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Goat UI. Built for modern developer experiences.
            </p>
          </div>
          <div className="flex items-center gap-6 text-xs font-medium text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
