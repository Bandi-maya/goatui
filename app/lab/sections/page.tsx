"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import * as F from "@/components/catalog/SectionsFamily";

const ORDER = [
  "MagneticHero", "OrbitHero", "SwapHero", "TiltHero", "CommandHero", "StickerHero",
  "CurtainHero", "OdometerHero", "TerminalHero", "RippleHero", "SwitchPricing", "SeatPricing",
  "ExpandPricing", "CompareTable", "DeckPricing", "UsagePricing", "LitPricing", "MorphPricing",
  "FlipPricing", "ReceiptPricing", "WordmarkFooter", "NewsletterFooter", "DisclosureFooter", "LaunchFooter",
  "RibbonFooter", "PrefsFooter", "FocusFooter", "ClockFooter", "SlideFooter", "StatusFooter",
] as const;
const REG = F as unknown as Record<string, React.ComponentType | undefined>;
const ITEMS = (ORDER as readonly string[]).map((name, i) => ({ id: `v${String(i + 1).padStart(2, "0")}`, name }));

function Cell({ id, name, wide }: { id: string; name: string; wide?: boolean }) {
  const C = REG[name];
  return (
    <figure className={`lab-cell ${wide ? "wide" : ""}`} id={id} style={{ margin: 0 }}>
      <figcaption style={{ font: "500 12px var(--font-geist-mono),monospace", padding: "8px 12px", color: "#a1a1aa", background: "#111", display: "flex", justifyContent: "space-between" }}>
        <span>{id}</span><span>{name}</span>
      </figcaption>
      {C ? <C /> : <div style={{ padding: 32, color: "#f87171" }}>missing export {name}</div>}
    </figure>
  );
}

function Lab() {
  const sp = useSearchParams();
  const only = sp.get("only");
  const batch = Number(sp.get("batch") || "1");
  const items = only ? ITEMS.filter((i) => i.id === only) : ITEMS.slice((batch - 1) * 6, batch * 6);
  return (
    <main style={{ background: "#000", minHeight: "100vh", padding: only ? 0 : 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: only ? "1fr" : "repeat(auto-fit,minmax(min(100%,560px),1fr))", gap: 16 }}>
        {items.map((i) => <Cell key={i.id} id={i.id} name={i.name} wide={!!only} />)}
      </div>
    </main>
  );
}

export default function Page() {
  return <React.Suspense fallback={null}><Lab /></React.Suspense>;
}
