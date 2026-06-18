import type { Metadata } from "next";
import Layout from "@/components/Layout";

export const metadata: Metadata = {
  title: "About | Peacock UI",
  description: "Learn about the mission, architecture, and technology behind the framework-agnostic Peacock UI library.",
};

export default function AboutPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent inline-block">
            About Peacock UI
          </h1>
          <p className="mt-4 text-zinc-400 text-lg">
            A look into the technology and design values behind our component system.
          </p>
        </div>

        <div className="mt-16 space-y-12">
          {/* Card Component from Peacock */}
          <wc-card className="block rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-zinc-100">The Mission</h2>
            <p className="mt-4 text-zinc-300 leading-relaxed">
              Peacock UI (formerly GoatUI) was founded on the idea that modern web interfaces shouldn't be locked into specific JavaScript frameworks. By leveraging the Web Components standard, we build interfaces that outlive framework trends, load instantly, and remain highly customizable.
            </p>
          </wc-card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6">
              <h3 className="text-lg font-semibold text-zinc-200">Built with Stencil</h3>
              <p className="mt-2 text-zinc-400 text-sm leading-relaxed">
                Stencil compiles down to lightweight, framework-free web components that run natively in all modern web browsers. No virtual DOM overhead, no heavy bundlers—just vanilla custom elements.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6">
              <h3 className="text-lg font-semibold text-zinc-200">Static Export Ready</h3>
              <p className="mt-2 text-zinc-400 text-sm leading-relaxed">
                With Next.js static exports, Peacock UI components are pre-compiled and served directly. Perfect for deployment on static content delivery networks (CDNs) for maximum speed.
              </p>
            </div>
          </div>

          <wc-card className="block rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-zinc-100">Performance First</h2>
            <p className="mt-4 text-zinc-300 leading-relaxed">
              Because Peacock UI loads component definitions dynamically via an optimized loader, only the components actually present on a page are downloaded. This translates to higher Google Lighthouse scores, lower data usage, and a snappier feel for end users.
            </p>
          </wc-card>
        </div>
      </div>
    </Layout>
  );
}
