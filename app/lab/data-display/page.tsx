"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { DATA_DISPLAY } from "@/components/catalog/DataDisplayFamily";

function Gallery() {
  const params = useSearchParams();
  const only = params.get("only");
  const batch = params.get("batch");

  if (only) {
    const entry = DATA_DISPLAY.find((e) => e.name === only);
    if (entry) {
      const Only = entry.Component;
      return (
        <div className="dd-only" data-dd={only}>
          <h1 className="dd-sr">{entry.label}</h1>
          <Only />
        </div>
      );
    }
  }

  const batches = [0, 1, 2, 3, 4].map((b) => DATA_DISPLAY.filter((_, i) => i % 5 === b));
  const b = batch ? Math.min(5, Math.max(1, parseInt(batch, 10) || 1)) - 1 : -1;
  const entries = b >= 0 ? batches[b] : DATA_DISPLAY;

  return (
    <div className="dd-lab">
      <div className="dd-lab-inner">
        <div className="dd-lab-head">
          <p>GOAT UI / DATA DISPLAY{b >= 0 ? ` / SHEET ${b + 1} OF 5` : ""}</p>
          <h1>Thirty ways to show the data.</h1>
          <p>
            Avatars, progress, empty states, stats, badges and tables.
            Sort, expand, select and edit. Every control springs.
          </p>
        </div>
        <div className="dd-lab-grid">
          {entries.map(({ name, label, Component }) => (
            <section key={name} className="dd-lab-cell" aria-label={label} data-dd={name}>
              <span className="dd-lab-tag">
                {name} · {label}
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
