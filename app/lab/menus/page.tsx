"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  SpringDropMenu,
  FrostSheetSelect,
  RingRadialMenu,
  FlipPanelSelect,
  DockMagnifyMenu,
  CommandPalette,
  ContextRippleMenu,
  ChipMultiSelect,
  CascadeSubMenu,
  DialRotarySelect,
  SpeedDialFAB,
  ActionSheetSwipe,
  SegmentedPillSelect,
  TreeNavMenu,
  PieContextMenu,
  GridAppMenu,
  AccordionSpringMenu,
  MegaMenuHoverIntent,
  ComboboxTypeahead,
  SplitButtonMenu,
  DrawerSideMenu,
  CurtainMenu,
  MeterSelect,
  EmojiGridMenu,
  ToastStackMenu,
  SearchMorphDropdown,
  StepBreadcrumbMenu,
  InkUnderlineMenu,
  OrbitalMenu,
  SpotlightContextMenu,
} from "@/components/catalog/MenuFamily";

interface Def {
  n: number;
  name: string;
  desc: string;
  el: (open: boolean) => React.ReactNode;
}

const VARIANTS: Def[] = [
  { n: 1, name: "SpringDropMenu", desc: "Origin-aware dropdown: damped spring scale + staggered item entrance, full keyboard nav.", el: (o) => <SpringDropMenu defaultOpen={o} /> },
  { n: 2, name: "FrostSheetSelect", desc: "Frosted-glass select: blur slide-down sheet with a spring-drawn check on selection.", el: (o) => <FrostSheetSelect defaultOpen={o} /> },
  { n: 3, name: "RingRadialMenu", desc: "True-circle radial FAB: satellites fly out on a 92px radius with bouncy stagger.", el: (o) => <RingRadialMenu defaultOpen={o} /> },
  { n: 4, name: "FlipPanelSelect", desc: "3D flip-down select: panel unfolds on rotateX inside an 800px perspective stage.", el: (o) => <FlipPanelSelect defaultOpen={o} /> },
  { n: 5, name: "DockMagnifyMenu", desc: "macOS dock: cursor-proximity magnification driven by spring-interpolated size.", el: () => <DockMagnifyMenu /> },
  { n: 6, name: "CommandPalette", desc: "⌘K palette: fuzzy search, grouped results, roving highlight and run feedback.", el: (o) => <CommandPalette defaultOpen={o} /> },
  { n: 7, name: "ContextRippleMenu", desc: "Right-click canvas: circular clip-path reveal anchored at the cursor.", el: (o) => <ContextRippleMenu defaultOpen={o} /> },
  { n: 8, name: "ChipMultiSelect", desc: "Multi-select with spring-animated chips and popLayout removal inside the control.", el: (o) => <ChipMultiSelect defaultOpen={o} /> },
  { n: 9, name: "CascadeSubMenu", desc: "Two-level cascade: submenus slide in from the right with hover-intent delay.", el: (o) => <CascadeSubMenu defaultOpen={o} /> },
  { n: 10, name: "DialRotarySelect", desc: "Rotary dial: pointer-drag rotation that snaps to five stops with a bouncy spring.", el: (o) => <DialRotarySelect defaultOpen={o} /> },
  { n: 11, name: "SpeedDialFAB", desc: "Vertical speed dial: labeled satellites stagger up from the FAB over a blur scrim.", el: (o) => <SpeedDialFAB defaultOpen={o} /> },
  { n: 12, name: "ActionSheetSwipe", desc: "Mobile bottom sheet inside a phone frame: spring rise + drag-to-dismiss.", el: (o) => <ActionSheetSwipe defaultOpen={o} /> },
  { n: 13, name: "SegmentedPillSelect", desc: "Segmented control: shared-layout pill glides between options, tabular readout.", el: (o) => <SegmentedPillSelect defaultOpen={o} /> },
  { n: 14, name: "TreeNavMenu", desc: "File tree: indent guides, spring height expansion, mono type for structure.", el: (o) => <TreeNavMenu defaultOpen={o} /> },
  { n: 15, name: "PieContextMenu", desc: "Radial pie menu: SVG wedges tracked by pointer angle, spring spin-in.", el: (o) => <PieContextMenu defaultOpen={o} /> },
  { n: 16, name: "GridAppMenu", desc: "3x3 launcher grid: diagonal-order stagger, tile press compression with overshoot.", el: (o) => <GridAppMenu defaultOpen={o} /> },
  { n: 17, name: "AccordionSpringMenu", desc: "Inline accordion: spring height animation, staggered row reveal, single-open.", el: (o) => <AccordionSpringMenu defaultOpen={o} /> },
  { n: 18, name: "MegaMenuHoverIntent", desc: "Nav bar mega menu: 220ms hover-intent grace, crossfading panel columns.", el: (o) => <MegaMenuHoverIntent defaultOpen={o} /> },
  { n: 19, name: "ComboboxTypeahead", desc: "Grouped combobox: typeahead filtering, aria-activedescendant, tabular counts.", el: (o) => <ComboboxTypeahead defaultOpen={o} /> },
  { n: 20, name: "SplitButtonMenu", desc: "Joined deploy button: independent press springs on action and chevron halves.", el: (o) => <SplitButtonMenu defaultOpen={o} /> },
  { n: 21, name: "DrawerSideMenu", desc: "Right drawer: overshoot slide-in, staggered nav links, blur scrim dismiss.", el: (o) => <DrawerSideMenu defaultOpen={o} /> },
  { n: 22, name: "CurtainMenu", desc: "Twin curtains part from center to reveal oversized numbered nav links.", el: (o) => <CurtainMenu defaultOpen={o} /> },
  { n: 23, name: "MeterSelect", desc: "Vertical drag meter: fills, snaps to decile ticks, mono tabular value.", el: (o) => <MeterSelect defaultOpen={o} /> },
  { n: 24, name: "EmojiGridMenu", desc: "Emoji picker: category tabs with gliding pill, roving-tabindex grid, recent rail.", el: (o) => <EmojiGridMenu defaultOpen={o} /> },
  { n: 25, name: "ToastStackMenu", desc: "Notification stack: spring entrance, layout reflow, swipe-to-dismiss toasts.", el: (o) => <ToastStackMenu defaultOpen={o} /> },
  { n: 26, name: "SearchMorphDropdown", desc: "Shared-layout morph: a pill input unfolds into a full results panel.", el: (o) => <SearchMorphDropdown defaultOpen={o} /> },
  { n: 27, name: "StepBreadcrumbMenu", desc: "Progress stepper dropdown: drawn checks, growing connectors, pulsing current.", el: (o) => <StepBreadcrumbMenu defaultOpen={o} /> },
  { n: 28, name: "InkUnderlineMenu", desc: "Sliding gradient ink bar under tabs with an attached reports dropdown.", el: (o) => <InkUnderlineMenu defaultOpen={o} /> },
  { n: 29, name: "OrbitalMenu", desc: "Satellites spiral out of the FAB over a rotating dashed orbit ring.", el: (o) => <OrbitalMenu defaultOpen={o} /> },
  { n: 30, name: "SpotlightContextMenu", desc: "Right-click menu with a radial spotlight that follows the cursor.", el: (o) => <SpotlightContextMenu defaultOpen={o} /> },
];

function Grid() {
  const sp = useSearchParams();
  const open = sp.get("state") === "open";
  const batch = parseInt(sp.get("batch") ?? "", 10);
  const items = Number.isFinite(batch)
    ? VARIANTS.slice((batch - 1) * 6, batch * 6)
    : VARIANTS;

  return (
    <div className="gm-lab-grid" id={`batch-${Number.isFinite(batch) ? batch : "all"}`}>
      {items.map((v) => (
        <section className="gm-card" key={v.n} id={`menu-card-${String(v.n).padStart(2, "0")}`}>
          <div className="gm-card-meta">
            <span className="gm-card-num">{String(v.n).padStart(2, "0")} / 30</span>
            <h2 className="gm-card-name">{v.name}</h2>
            <p className="gm-card-desc">{v.desc}</p>
          </div>
          <div className="gm-card-stage">{v.el(open)}</div>
        </section>
      ))}
    </div>
  );
}

export default function MenusLabPage() {
  return (
    <main className="gm-lab">
      <header className="gm-lab-head">
        <p className="gm-lab-eyebrow">GOAT UI · Menus</p>
        <h1 className="gm-lab-title">Menus, selects &amp; palettes</h1>
        <p className="gm-lab-sub">
          30 mechanics: dropdowns, selects, comboboxes, context menus, command palettes and radial menus.
        </p>
      </header>
      <Suspense fallback={null}>
        <Grid />
      </Suspense>
    </main>
  );
}
