"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { SLIDER_FAMILY } from "@/components/catalog/SliderFamily";

const HIDE_CHROME = ".site-header,.site-footer{display:none!important}";

function Gallery() {
  const params = useSearchParams();
  const only = params.get("only");
  const batch = Number(params.get("batch")) || 0;

  const items = SLIDER_FAMILY.filter((c, i) => {
    if (only) return c.id === only;
    if (batch >= 1 && batch <= 5) return Math.floor(i / 6) === batch - 1;
    return true;
  });

  if (only && items.length === 1) {
    const Only = items[0].Component;
    return (
      <main className="sfl-only" data-variant={only}>
        <style>{HIDE_CHROME}</style>
        <h1 className="sfl-sr">{items[0].name}</h1>
        <Only />
      </main>
    );
  }

  return (
    <main className="sfl">
      <style>{HIDE_CHROME}</style>
      <header className="sfl-head">
        <h1>Sliders and carousels</h1>
        <p>
          Thirty variants, each with its own mechanic. Use <code>?batch=1..5</code> or <code>?only=v01</code>.
        </p>
      </header>
      <div className="sfl-grid">
        {items.map(({ id, name, Component }) => (
          <section key={id} className="sfl-cell" data-variant={id} aria-label={name}>
            <span className="sfl-name">
              <b className="sf-num">{id}</b> {name}
            </span>
            <div className="sfl-stage">
              <Component />
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <React.Suspense fallback={null}>
      <Gallery />
    </React.Suspense>
  );
}
