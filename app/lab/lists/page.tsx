"use client";

import * as React from "react";
import * as F from "@/components/catalog/AccordionFamily";

/* Contact sheet for the AccordionFamily lab (static-export safe:
   query params are read client-side after mount).
   /lab/lists            -> all variants in a grid
   /lab/lists?batch=1..5 -> six variants (v01-06, v07-12, ...)
   /lab/lists?only=vNN   -> one variant full-bleed              */

const VARIANTS: { id: string; name: string; C: React.ComponentType }[] = [
  { id: "v01", name: "Ledger", C: F.AccordionV01 },
  { id: "v02", name: "Dossier", C: F.AccordionV02 },
  { id: "v03", name: "Card stack", C: F.AccordionV03 },
  { id: "v04", name: "Rule lines", C: F.AccordionV04 },
  { id: "v05", name: "Stepper", C: F.AccordionV05 },
  { id: "v06", name: "Signal", C: F.AccordionV06 },
  { id: "v07", name: "Timeline", C: F.AccordionV07 },
  { id: "v08", name: "FAQ search", C: F.AccordionV08 },
  { id: "v09", name: "Chip cloud", C: F.AccordionV09 },
  { id: "v10", name: "Media rows", C: F.AccordionV10 },
  { id: "v11", name: "Progress", C: F.AccordionV11 },
  { id: "v12", name: "Command list", C: F.AccordionV12 },
  { id: "v13", name: "Horizontal", C: F.AccordionV13 },
  { id: "v14", name: "Mosaic", C: F.AccordionV14 },
  { id: "v15", name: "Tree", C: F.AccordionV15 },
  { id: "v16", name: "Reorder", C: F.AccordionV16 },
  { id: "v17", name: "Checklist", C: F.AccordionV17 },
  { id: "v18", name: "Swipe actions", C: F.AccordionV18 },
  { id: "v19", name: "Reviews", C: F.AccordionV19 },
  { id: "v20", name: "Compare", C: F.AccordionV20 },
  { id: "v21", name: "Activity", C: F.AccordionV21 },
  { id: "v22", name: "Palette", C: F.AccordionV22 },
  { id: "v23", name: "Status board", C: F.AccordionV23 },
  { id: "v24", name: "Data rows", C: F.AccordionV24 },
  { id: "v25", name: "Notifications", C: F.AccordionV25 },
  { id: "v26", name: "Tracklist", C: F.AccordionV26 },
  { id: "v27", name: "Files", C: F.AccordionV27 },
  { id: "v28", name: "Recipe", C: F.AccordionV28 },
  { id: "v29", name: "Spec sheet", C: F.AccordionV29 },
  { id: "v30", name: "Master detail", C: F.AccordionV30 },
];

export default function Page() {
  const [list, setList] = React.useState(VARIANTS);
  React.useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const only = q.get("only");
    const batch = q.get("batch");
    if (only) {
      setList(VARIANTS.filter((v) => v.id === only.toLowerCase()));
    } else if (batch) {
      const b = Math.min(Math.max(parseInt(batch, 10) || 1, 1), 5);
      setList(VARIANTS.slice((b - 1) * 6, b * 6));
    }
  }, []);
  const single = list.length === 1;
  return (
    <main
      style={{
        background: "#e9e6df",
        minHeight: "100vh",
        padding: single ? 0 : "24px 16px 48px",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <style>{"nextjs-portal{display:none!important}"}</style>
      <div
        style={
          single
            ? undefined
            : {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
                gap: 16,
                maxWidth: 1280,
                margin: "0 auto",
              }
        }
      >
        {list.map(({ id, name, C }) => (
          <section
            key={id}
            style={
              single
                ? { minHeight: "100vh", background: "#f3f1ec" }
                : {
                    background: "#f3f1ec",
                    border: "1px solid #d8d3c8",
                    borderRadius: 12,
                    minHeight: 380,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  }
            }
          >
            <header
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 8,
                padding: "8px 12px",
                borderBottom: "1px solid #e2ddd2",
                font: "600 11px/1 ui-monospace, Menlo, monospace",
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: "#8b8577",
              }}
            >
              <span style={{ color: "#8c2f22" }}>{id}</span>
              <span>{name}</span>
            </header>
            <div className="af-stage" style={{ flex: 1 }}>
              <C />
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
