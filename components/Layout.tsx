"use client"

import * as React from "react"
import Navbar from "./Navbar"
import Link from "next/link"
import {  MessageSquare, Heart } from "lucide-react"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
      {/* Top Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full">{children}</main>

      {/* Footer */}
      <footer className="w-full border-t border-border bg-card/40 py-12 px-6 sm:px-8 mt-auto">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand column */}
            <div className="space-y-4 text-left">
              <Link href="/" className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                  <span className="font-extrabold text-[10px]">G</span>
                </div>
                <span className="font-extrabold text-xs tracking-tight text-foreground">
                  GOATUI
                </span>
              </Link>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Enterprise-grade React component ecosystem. Built with absolute visual precision and modern developer accessibility.
              </p>
              <div className="flex items-center gap-3">
                
                <a href="#" className="text-muted-foreground hover:text-foreground"><MessageSquare className="h-4 w-4" /></a>
              </div>
            </div>

            {/* Links column 1 */}
            <div className="space-y-3.5 text-left">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Product</h4>
              <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <li><Link href="/components" className="hover:text-foreground">Components</Link></li>
                <li><Link href="/blocks" className="hover:text-foreground">Blocks</Link></li>
                <li><Link href="/templates" className="hover:text-foreground">Templates</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground">Pricing Plans</Link></li>
              </ul>
            </div>

            {/* Links column 2 */}
            <div className="space-y-3.5 text-left">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Resources</h4>
              <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <li><Link href="/docs" className="hover:text-foreground">Documentation</Link></li>
                <li><Link href="/docs/guide" className="hover:text-foreground">Getting Started</Link></li>
                <li><Link href="/changelog" className="hover:text-foreground">Changelog Updates</Link></li>
                <li><Link href="/showcase" className="hover:text-foreground">Community Showcase</Link></li>
              </ul>
            </div>

            {/* Links column 3 */}
            <div className="space-y-3.5 text-left">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Company</h4>
              <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-foreground">About Us</a></li>
                <li><a href="#" className="hover:text-foreground">Careers</a></li>
                <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-border/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-muted-foreground font-semibold">
            <span>&copy; {new Date().getFullYear()} GOATUI. All rights reserved.</span>
            <div className="flex items-center gap-1">
              <span>Made with</span>
              <Heart className="h-3 w-3 text-red-500 fill-red-500" />
              <span>for developer productivity.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
