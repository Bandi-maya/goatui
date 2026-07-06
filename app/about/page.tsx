import type { Metadata } from "next";
import Layout from "@/components/Layout";
import { Sparkles, Shield, Layers, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "About | GOATUI",
  description: "Learn about the mission, architecture, and design system behind GOATUI.",
};

export default function AboutPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-6 py-20 sm:py-28 text-left space-y-12">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent inline-block">
            About GOATUI
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            A look into the architecture, design tokens, and values behind our next-generation component ecosystem.
          </p>
        </div>

        <div className="mt-16 space-y-12">
          {/* Mission Card */}
          <div className="block rounded-2xl border border-border bg-card/40 p-8 shadow-xl">
            <h2 className="text-xl font-bold text-foreground">The Mission</h2>
            <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
              GOATUI was founded on the idea that modern developer workspaces shouldn&apos;t look like generic SaaS templates. By combining component registries, theme variable systems, and live playground sandboxes, we build tools that empower developers to build beautiful apps instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-border bg-card/25 p-6 space-y-3">
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-primary flex items-center justify-center">
                <Layers className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Fully Dynamic Variables</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Define styling hooks directly in globals.css variables and watch components swap color palettes instantly with zero reload overhead.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card/25 p-6 space-y-3">
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-primary flex items-center justify-center">
                <Zap className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Spring Physics Engine</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Interactive components leverage natural dampening curves, outlining draw boundaries, and magnetic hover vectors seamlessly.
              </p>
            </div>
          </div>

          <div className="block rounded-2xl border border-border bg-card/40 p-8 shadow-xl">
            <h2 className="text-xl font-bold text-foreground">Performance First</h2>
            <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
              Because GOATUI compiles down to optimized React hooks and primitives, layout shift is completely minimized. Translating directly into high Google Lighthouse rankings, low bundle sizes, and quick load speeds.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
