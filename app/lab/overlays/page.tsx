"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { OVERLAY_FAMILY } from "@/components/catalog/OverlayFamily";

function Gallery() {
  const params = useSearchParams();
  const only = params.get("only");
  const batch = params.get("batch");

  if (only) {
    const entry = OVERLAY_FAMILY.find((e) => e.name === only);
    if (entry) {
      const Only = entry.Component;
      return (
        <div className="go-only" data-overlay={only}>
          <h1 className="go-sr">{entry.label}</h1>
          <Only />
        </div>
      );
    }
  }

  const batches = [0, 1, 2, 3, 4].map((b) => OVERLAY_FAMILY.filter((_, i) => i % 5 === b));
  const b = batch ? Math.min(5, Math.max(1, parseInt(batch, 10) || 1)) - 1 : -1;
  const entries = b >= 0 ? batches[b] : OVERLAY_FAMILY;

  return (
    <div className="go-lab">
      <div className="go-lab-inner">
        <div className="go-lab-head">
          <p className="go-kicker">GOAT UI / OVERLAYS{b >= 0 ? ` / SHEET ${b + 1} OF 5` : ""}</p>
          <h1>Thirty ways to float above the page.</h1>
          <p className="go-sub">
            Tooltips, popovers, dropdowns, drawers, command palettes, modals and toasts.
            Open them, dismiss them, tab through them. Every surface springs.
          </p>
        </div>
        <div className="go-lab-grid">
          {entries.map(({ name, label, kind, Component }) => (
            <section key={name} className="go-lab-cell" aria-label={label} data-overlay={name}>
              <span className="go-lab-tag">
                <b>{name}</b> {label} <span className="go-lab-kind">{kind}</span>
              </span>
              <Component />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <React.Suspense fallback={null}>
      <Gallery />
    </React.Suspense>
  );
}
