"use client";

/* GOAT UI lab: all 30 modal variants, live in open state.
   Each tile replays its entrance physics on demand. */

import React, { useState } from "react";
import { MODAL_VARIANTS } from "@/components/catalog/ModalFamily";

function Tile({ name, tag, C }: { name: string; tag: string; C: React.ComponentType<{ contained?: boolean; defaultOpen?: boolean }> }) {
  const [gen, setGen] = useState(0);
  return (
    <section className="gmf-tile" aria-label={name}>
      <div className="gmf-tile-head">
        <b>{name}</b>
        <span>{tag}</span>
        <button
          type="button"
          className="gmf-tile-replay"
          onClick={() => setGen((g) => g + 1)}
          aria-label={`Replay ${name} animation`}
        >
          replay
        </button>
      </div>
      <div className="gmf-stage">
        <div className="gmf" key={gen} style={{ position: "absolute", inset: 0 }}>
          <C contained defaultOpen />
        </div>
      </div>
    </section>
  );
}

export default function ModalsLabPage() {
  return (
    <main className="gmf-lab gmf">
      <header className="gmf-lab-head">
        <h1>Modals & Dialogs - 30 variants</h1>
        <p>
          Dialogs, sheets, drawers, popovers, lightboxes, confirmations and
          command overlays. Spring physics everywhere, axe-clean, 4px grid.
        </p>
      </header>
      <div className="gmf-lab-grid">
        {MODAL_VARIANTS.map((v) => (
          <Tile key={v.name} name={v.name} tag={v.tag} C={v.C} />
        ))}
      </div>
    </main>
  );
}
