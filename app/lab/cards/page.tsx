"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { CARD_FAMILY } from "@/components/catalog/CardFamily";

function Cell({ name, label, wide, Component }: { name: string; label: string; wide?: boolean; Component: React.ComponentType }) {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);
  const [height, setHeight] = React.useState<number | undefined>(undefined);

  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const card = stage.firstElementChild as HTMLElement | null;
    if (!card) return;
    const fit = () => {
      const avail = stage.clientWidth;
      const need = card.offsetWidth || 1;
      const s = need > avail ? avail / need : 1;
      setScale(s);
      setHeight(card.offsetHeight * s);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(stage);
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);

  return (
    <section className={wide ? "cf-lab-cell wide" : "cf-lab-cell"} aria-label={label} data-card={name}>
      <span className="cf-name">{label}</span>
      <div ref={stageRef} className="cf-lab-stage" style={{ height }}>
        <div
          className="cf-lab-scale"
          style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: "fit-content" }}
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
  const cards = CARD_FAMILY.filter((c) => !only || c.name === only);

  if (only && cards.length === 1) {
    const Only = cards[0].Component;
    return (
      <div className="cf-only" data-card={only}>
        <h1 className="cf-sr-only">{cards[0].label}</h1>
        <style>{".site-header,.site-footer{display:none!important}"}</style>
        <Only />
      </div>
    );
  }

  return (
    <div className="cf-lab">
      <div className="cf-lab-head">
        <h1>Card family</h1>
        <p>Thirty product objects. Tilt them, drag them, flip them, tear them.</p>
      </div>
      <div className="cf-lab-grid">
        {cards.map(({ name, label, wide, Component }) => (
          <Cell key={name} name={name} label={label} wide={wide} Component={Component} />
        ))}
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
