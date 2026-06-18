"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Sidebar() {
  const pathname = usePathname()

  const categories = [
    {
      title: "Getting Started",
      links: [
        { name: "Introduction", href: "/docs" },
        { name: "Installation", href: "/docs/installation" },
        { name: "Theming", href: "/docs/theming" },
      ],
    },
    {
      title: "Components",
      links: [
        { name: "3D Product Viewer", href: "/components/3d-product-viewer" },
        { name: "Agent Card", href: "/components/agent-card" },
        { name: "Badge", href: "/components/badge" },
        { name: "Button", href: "/components/button" },
        { name: "Checkbox", href: "/components/checkbox" },
        { name: "Input", href: "/components/input" },
        { name: "Navbar", href: "/components/navbar" },
      ],
    },
  ]

  return (
    <div className="w-full space-y-6 text-left">
      {categories.map((cat, idx) => (
        <div key={idx} className="space-y-2">
          <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground/80 px-2">
            {cat.title}
          </h4>
          <div className="flex flex-col gap-0.5">
            {cat.links.map((link) => {
              const active = pathname === link.href || pathname === `${link.href}/`
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    active
                      ? "text-blue-600 bg-blue-600/5 dark:bg-blue-600/10 font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
