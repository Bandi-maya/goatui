import type { Metadata } from "next";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Terminal, Sparkles, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Documentation | Goat UI",
  description: "Learn how to integrate and build with Goat UI web components in your React and static Next.js projects.",
};

export default function DocsPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        {/* Docs Header */}
        <div className="border-b border-border pb-8">
          <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider">
            <BookOpen className="h-4 w-4" />
            <span>Developer Guide</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground mt-2">
            Documentation
          </h1>
          <p className="mt-3 text-muted-foreground text-base max-w-xl">
            Quick start guides, configuration options, and framework integration tips to get you up and running.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1 space-y-6 text-left">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Getting Started</h4>
              <ul className="mt-3 space-y-2 text-sm">
                <li><a href="#introduction" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Introduction</a></li>
                <li><a href="#installation" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Installation</a></li>
                <li><a href="#static-export" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Static Export</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Reference</h4>
              <ul className="mt-3 space-y-2 text-sm">
                <li><a href="#typescript" className="text-muted-foreground hover:text-foreground transition-colors font-medium">TypeScript Support</a></li>
                <li><a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors font-medium">FAQs</a></li>
              </ul>
            </div>
          </aside>

          {/* Main Docs Content */}
          <div className="lg:col-span-3 space-y-16 text-left">
            
            {/* Introduction */}
            <section id="introduction" className="scroll-mt-24 space-y-3">
              <h2 className="text-2xl font-bold text-foreground">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Goat UI is a premium, open-source library of copy-paste React components styled with Tailwind CSS v4.
                Designed for high developer utility and visual consistency, all components are built directly in the project and fully customizable.
              </p>
            </section>

            {/* Installation */}
            <section id="installation" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Installation</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                To initialize Goat UI in your local React or Next.js repository, execute the following command in your terminal:
              </p>
              
              <div className="overflow-hidden rounded-xl bg-card border border-border p-4 text-xs font-mono text-zinc-300 dark:text-zinc-200 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-border/60 mb-2">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Terminal className="h-3.5 w-3.5 text-primary" />
                    <span>Terminal</span>
                  </div>
                </div>
                <div className="text-foreground py-1">
                  <span className="text-primary">npx</span> goatui init
                </div>
              </div>
            </section>

            {/* Static Export */}
            <section id="static-export" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Next.js Static Export</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Goat UI fits perfectly with static exports. To generate self-contained static directories, ensure your <code className="font-mono text-xs text-primary bg-secondary/80 px-1 py-0.5 rounded">next.config.ts</code> output configuration is configured to export:
              </p>
              
              <div className="overflow-hidden rounded-xl bg-card border border-border p-4 text-xs font-mono text-zinc-300 dark:text-zinc-200 shadow-sm">
                <div className="text-foreground">
                  <span className="text-blue-500">const</span> nextConfig: NextConfig = &#127;
                  <div className="pl-4">output: <span className="text-green-600 dark:text-green-400">&apos;export&apos;</span>,</div>
                  <div className="pl-4">images: &#123; unoptimized: <span className="text-blue-500">true</span> &#125;</div>
                  &#125;;
                </div>
              </div>
            </section>

            {/* TypeScript */}
            <section id="typescript" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">TypeScript Support</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Every component is 100% type-safe. To let TypeScript recognize the custom elements, define custom type overrides in your global type definition declarations file:
              </p>
              
              <div className="overflow-hidden rounded-xl bg-card border border-border p-4 text-xs font-mono text-zinc-300 dark:text-zinc-200 shadow-sm">
                <div className="text-foreground">
                  <span className="text-muted-foreground/80">// goatui.d.ts</span>
                  <div><span className="text-blue-500">declare module</span> <span className="text-green-600 dark:text-green-400">&quot;react&quot;</span> &#123;</div>
                  <div className="pl-4">interface <span className="text-blue-500">IntrinsicElements</span> &#123;</div>
                  <div className="pl-8">&apos;wc-button&apos;: any;</div>
                  <div className="pl-8">&apos;wc-card&apos;: any;</div>
                  <div className="pl-4">&#125;</div>
                  <div>&#125;</div>
                </div>
              </div>
            </section>

            {/* FAQs */}
            <section id="faq" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div className="border border-border bg-card/50 rounded-xl p-5 text-sm space-y-1.5">
                  <h4 className="font-semibold text-foreground flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-primary shrink-0" />
                    How do I copy components?
                  </h4>
                  <p className="text-muted-foreground text-xs leading-relaxed pl-5.5">
                    Simply navigate to the Components Gallery page, select the desired component, click the copy code action directly below the preview, and drop it into your codebase.
                  </p>
                </div>

                <div className="border border-border bg-card/50 rounded-xl p-5 text-sm space-y-1.5">
                  <h4 className="font-semibold text-foreground flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 text-primary shrink-0" />
                    Is it open source?
                  </h4>
                  <p className="text-muted-foreground text-xs leading-relaxed pl-5.5">
                    Yes! Goat UI is 100% free and open-source, licensed under MIT. You can use it in commercial projects without attribution.
                  </p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </Layout>
  );
}
