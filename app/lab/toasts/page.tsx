"use client";

import { TOAST_FAMILY } from "@/components/catalog/ToastFamily";

export default function ToastsLabPage() {
  return (
    <main className="tf-root" style={{ minHeight: "100vh", background: "#f2f4f7", padding: "48px 0 96px" }}>
      <header style={{ maxWidth: 1560, margin: "0 auto", padding: "0 24px 8px" }}>
        <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#5b88d6", margin: 0 }}>
          GOAT UI · Lab
        </p>
        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", margin: "8px 0 6px" }}>
          Toasts, alerts & notifications
        </h1>
        <p style={{ fontSize: 14, color: "#4b5261", margin: 0, maxWidth: 640 }}>
          Thirty mechanics — glass, stacks, goo, gauges, swipe physics and more. Every variant is one
          self-contained component: copy it, paste it, ship it. Motion honors prefers-reduced-motion.
        </p>
      </header>
      <div className="tf-grid">
        {TOAST_FAMILY.map(({ key, Component }) => (
          <Component key={key} />
        ))}
      </div>
    </main>
  );
}
