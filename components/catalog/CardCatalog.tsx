"use client";
import * as React from "react";
import { CARD_FAMILY } from "./CardFamily";
import "./CardFamily.css";

export default function CardCatalog({ index }: { index: number }) {
  const item = CARD_FAMILY[index];
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
    return () => { ro.disconnect(); window.removeEventListener("resize", fit); };
  }, [index]);
  if (!item) return null;
  const C = item.Component;
  return (
    <div className="cf-catalog" data-card={item.name} style={{ width: "100%" }}>
      <div ref={stageRef} style={{ height, overflow: "hidden" }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: "fit-content", margin: "0 auto" }}>
          <C />
        </div>
      </div>
    </div>
  );
}
