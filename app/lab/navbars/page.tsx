"use client";
import * as React from "react";
import {
  NavbarGlassPill, NavbarSplitLedger, NavbarTickerStrip, NavbarMonoLine, NavbarNeubrutal,
  NavbarAurora, NavbarCenterOrb, NavbarScrollGhost, NavbarSegmentedTabs, NavbarCommandBar,
  MegaMenuColumns, MegaMenuCards, MegaMenuTabbed, MegaMenuMorph, MegaMenuSpotlight,
  DockMagnify, DockOrbit, DockRail, DockExpando,
  MobileSheetNav, MobileOrbReveal, MobileTabBar, MobileDrawerBlur,
  BreadcrumbChevron, BreadcrumbStepTrail, BreadcrumbPillChain, BreadcrumbTerminal,
  SearchCommandHeader, SearchMorphIcon, SearchChipSuggest,
} from "@/components/catalog/NavbarFamily";

const VARIANTS: { name: string; note: string; C: React.ComponentType; h?: number }[] = [
  { name: "NavbarGlassPill", note: "floating glass pill, spring capsule", C: NavbarGlassPill },
  { name: "NavbarSplitLedger", note: "hairline underlines, shrink on scroll", C: NavbarSplitLedger },
  { name: "NavbarTickerStrip", note: "marquee strip, magnetic links", C: NavbarTickerStrip },
  { name: "NavbarMonoLine", note: "monospace labels, arrow reveal", C: NavbarMonoLine },
  { name: "NavbarNeubrutal", note: "hard shadows, press compression", C: NavbarNeubrutal },
  { name: "NavbarAurora", note: "animated gradient frame, glow pip", C: NavbarAurora },
  { name: "NavbarCenterOrb", note: "split nav, spinning ring orb", C: NavbarCenterOrb },
  { name: "NavbarScrollGhost", note: "hide on scroll down, spring back", h: 240, C: NavbarScrollGhost },
  { name: "NavbarSegmentedTabs", note: "segmented control, sliding thumb", C: NavbarSegmentedTabs },
  { name: "NavbarCommandBar", note: "cmd-K bar with kbd hints", C: NavbarCommandBar },
  { name: "MegaMenuColumns", note: "3-col panel, staggered rows", h: 500, C: MegaMenuColumns },
  { name: "MegaMenuCards", note: "card grid dropdown, pop springs", h: 480, C: MegaMenuCards },
  { name: "MegaMenuTabbed", note: "mega menu with inner tabs", h: 470, C: MegaMenuTabbed },
  { name: "MegaMenuMorph", note: "panel morphs size per menu", h: 420, C: MegaMenuMorph },
  { name: "MegaMenuSpotlight", note: "list + live preview swap", h: 420, C: MegaMenuSpotlight },
  { name: "DockMagnify", note: "macOS distance scaling", C: DockMagnify },
  { name: "DockOrbit", note: "orbiting satellite on active", C: DockOrbit },
  { name: "DockRail", note: "vertical rail, spring tooltips", h: 300, C: DockRail },
  { name: "DockExpando", note: "active item expands to label", C: DockExpando },
  { name: "MobileSheetNav", note: "spring bottom sheet", h: 360, C: MobileSheetNav },
  { name: "MobileOrbReveal", note: "circular clip reveal, giant links", h: 420, C: MobileOrbReveal },
  { name: "MobileTabBar", note: "sliding indicator + badges", h: 280, C: MobileTabBar },
  { name: "MobileDrawerBlur", note: "overshoot drawer, blur scrim", h: 360, C: MobileDrawerBlur },
  { name: "BreadcrumbChevron", note: "collapsed middle, peek menu", C: BreadcrumbChevron },
  { name: "BreadcrumbStepTrail", note: "stepper trail, filling bars", C: BreadcrumbStepTrail },
  { name: "BreadcrumbPillChain", note: "joined pill segments", C: BreadcrumbPillChain },
  { name: "BreadcrumbTerminal", note: "shell path, click to copy", C: BreadcrumbTerminal },
  { name: "SearchCommandHeader", note: "cmd-K field, arrow-key results", h: 340, C: SearchCommandHeader },
  { name: "SearchMorphIcon", note: "icon springs into field", C: SearchMorphIcon },
  { name: "SearchChipSuggest", note: "suggestion chips, live filter", C: SearchChipSuggest },
];

export default function NavbarLabPage() {
  const [batch, setBatch] = React.useState<string | undefined>(undefined);
  React.useEffect(() => {
    const read = () => setBatch(new URLSearchParams(window.location.search).get("batch") ?? undefined);
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);
  const b = Math.max(0, Math.min(4, parseInt(batch ?? "-1", 10)));
  const showAll = Number.isNaN(b) || batch === undefined;
  const list = showAll ? VARIANTS : VARIANTS.slice(b * 6, b * 6 + 6);
  return (
    <div className="nf-root nf-lab">
      {showAll && (
        <div className="nf-lab-head">
          <h1>Navbar & Header family</h1>
          <p>30 variants - top navs, mega menus, docks, mobile, breadcrumbs, search headers. ?batch=0..4 for sheets of six.</p>
        </div>
      )}
      <div className="nf-grid">
        {list.map(({ name, note, C, h }, i) => (
          <section className="nf-cell" key={name} data-variant={name}>
            <div className="nf-cell-head">
              <h2>{showAll ? String(i + 1).padStart(2, "0") : String(b * 6 + i + 1).padStart(2, "0")} · {name}</h2>
              <span>{note}</span>
            </div>
            <div className={`nf-stage${h ? " top" : ""}`} style={h ? { minHeight: h } : undefined}>
              <C />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
