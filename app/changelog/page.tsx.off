"use client";

import React from "react";
import Layout from "@/components/Layout";
import { GitCommit, Sparkles, Zap, Shield, Bug } from "lucide-react";

export default function ChangelogPage() {
  const updates = [
    {
      version: "v1.0.0",
      date: "June 20, 2026",
      title: "Initial Launch Release",
      description: "Complete release of GOATUI Developer OS components platform including theme switcher configurators, command palette dialogues, and spring physics animation handlers.",
      badge: "Major",
      bullets: [
        "Registry initialized with 70+ components mapped directly.",
        "8 premium responsive color scheme themes compiled.",
        "CMD+K command palette search module embedded.",
        "Playground workspace sandbox container operational."
      ],
      icon: Sparkles,
      iconColor: "text-primary bg-primary/10"
    },
    {
      version: "v0.8.0",
      date: "May 12, 2026",
      title: "Animation Core Architecture",
      description: "Refactoring the Framer Motion configurations to utilize spring physics curves exclusively, eliminating linear layouts transition gaps.",
      badge: "Update",
      bullets: [
        "Injected spring, spotlights, glow, and outlines into components.",
        "Accessibility score reaches 100% WCAG values.",
        "Keyboard navigation loops finalized."
      ],
      icon: Zap,
      iconColor: "text-amber-500 bg-amber-500/10"
    }
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-6 py-16 space-y-12 text-left">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Product Changelog</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Follow the latest visual updates, performance optimizations, and design system refinements.
          </p>
        </div>

        {/* Vertical Timeline container */}
        <div className="relative border-l border-border pl-6 space-y-12 ml-4">
          {updates.map((update, idx) => {
            const Icon = update.icon;
            return (
              <div key={idx} className="relative space-y-4">
                {/* Timeline Dot Marker */}
                <div className={`absolute -left-10 top-0.5 h-8 w-8 rounded-full border border-border flex items-center justify-center ${update.iconColor}`}>
                  <Icon className="h-4 w-4" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-primary uppercase font-mono">{update.version}</span>
                    <span className="text-[10px] font-bold text-muted-foreground">{update.date}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-secondary border border-border px-2 py-0.5 rounded text-muted-foreground">
                      {update.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-foreground">{update.title}</h3>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">{update.description}</p>

                <ul className="space-y-1.5 text-xs text-muted-foreground pl-4 list-disc max-w-2xl">
                  {update.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
