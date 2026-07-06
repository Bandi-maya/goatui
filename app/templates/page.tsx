"use client";

import React from "react";
import Layout from "@/components/Layout";
import { LayoutGrid, Eye, Download, Star, ExternalLink } from "lucide-react";
import Button from "@/app/components/ui/button";

export default function TemplatesPage() {
  const templates = [
    {
      title: "Developer Console Admin Dashboard",
      description: "An full screen dashboard layout with collapsible side navigation, nested sub-charts, analytics grids, and list tables.",
      category: "Dashboard",
      stars: 4.8,
      downloadCount: "2.4k"
    },
    {
      title: "High-End SaaS Marketing Platform",
      description: "Tailored landing templates implementing spotlights, magnetic buttons, noise gradients, pricing toggles, and FAQs.",
      category: "Marketing",
      stars: 4.9,
      downloadCount: "5.1k"
    },
    {
      title: "Interactive Documentation Hub",
      description: "Perfect for API documentations. Supports scroll-spies, searchable index columns, tab layouts, and code toggles.",
      category: "Documentation",
      stars: 4.7,
      downloadCount: "1.2k"
    }
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-6 sm:px-8 py-12 space-y-10 text-left">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Premium Templates</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Complete production-grade Next.js boilerplate templates using GOATUI design systems. Setup pages in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template, idx) => (
            <div key={idx} className="border border-border bg-card/45 rounded-2xl p-6 flex flex-col justify-between hover:border-primary/40 transition-colors shadow-soft">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-secondary/80 px-2 py-0.5 rounded border border-border text-muted-foreground">
                    {template.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-amber-500" />
                    <span>{template.stars}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-base text-foreground leading-snug">{template.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{template.description}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/80 flex items-center justify-between gap-4">
                <span className="text-[10px] font-bold text-muted-foreground">{template.downloadCount} installs</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8 text-xs font-bold gap-1.5">
                    <Eye className="h-3.5 w-3.5" />
                    Live Demo
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
