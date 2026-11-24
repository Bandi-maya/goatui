"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { NAV_FLOW } from "@/components/catalog/NavFlowFamily";

function Cell({
  name,
  label,
  kind,
  wide,
  Component,
}: {
  name: string;
  label: string;
  kind: string;
  wide?: boolean;
  Component: React.ComponentType;
}) {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);
  const [height, setHeight] = React.useState<number | undefined>(undefined);

  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const inner = stage.firstElementChild as HTMLElement | null;
    if (!inner) return;
    const fit = () => {
      const avail = stage.clientWidth;
      const need = inner.offsetWidth || 1;
      const s = need > avail ? avail / need : 1;
      setScale(s);
      setHeight(inner.offsetHeight * s);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(stage);
    ro.observe(inner);
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);

  return (
    <section className={wide ? "nf-lab-cell wide" : "nf-lab-cell"} aria-label={label} data-nav={name}>
      <span className="nf-name">
        <b>{name}</b> {label} <span className="nf-kind">{kind}</span>
      </span>
      <div ref={stageRef} className="nf-lab-stage" style={{ height }}>
        <div
          className="nf-lab-scale"
          style={{ transform: `scale(${scale})`, transformOrigin: "top center", width: "100%" }}
        >
          <Component />
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const params = useSearchParams();
  const only = params.get("only");
  const batch = params.get("batch");

  if (only) {
    const entry = NAV_FLOW.find((e) => e.name === only);
    if (entry) {
      const Only = entry.Component;
      return (
        <div className="nf-only" data-nav={only}>
          <h1 className="nf-sr-only">{entry.label}</h1>
          <div>
            <Only />
          </div>
        </div>
      );
    }
  }

  const batches = [0, 1, 2, 3, 4].map((b) => NAV_FLOW.filter((_, i) => i % 5 === b));
  const b = batch ? Math.min(5, Math.max(1, parseInt(batch, 10) || 1)) - 1 : -1;
  const entries = b >= 0 ? batches[b] : NAV_FLOW;

  return (
    <div className="nf-lab">
      <div className="nf-lab-inner">
        <div className="nf-lab-head">
          <p className="kicker">GOAT UI / NAV + FLOW{b >= 0 ? ` / SHEET ${b + 1} OF 5` : ""}</p>
          <h1>Thirty ways to move through a product.</h1>
          <p>
            Steppers, timelines, pagination, breadcrumbs, tab-style navs and sidebars.
            Click, drag and arrow-key through them. Every control springs.
          </p>
        </div>
        <div className="nf-lab-grid">
          {[0, 1].map((col) => (
            <div className="nf-lab-column" key={col}>
              {entries.filter((_, i) => i % 2 === col).map(({ name, label, kind, wide, Component }) => (
                <Cell key={name} name={name} label={label} kind={kind} wide={wide} Component={Component} />
              ))}
            </div>
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
