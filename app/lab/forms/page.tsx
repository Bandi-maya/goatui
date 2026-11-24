"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import FormsFamily from "@/components/catalog/FormsFamily";

/* Preview sheet only - nothing here is in the library yet. Bandi picks. */
function Sheet() {
  const sp = useSearchParams();
  const batch = Number(sp.get("batch")) || 0;
  const onlyRaw = sp.get("only") || "";
  const only = /^v(0[1-9]|[12]\d|30)$/.test(onlyRaw) ? onlyRaw : "";
  return <FormsFamily batch={batch} only={only} />;
}

export default function LabForms() {
  return (
    <div className="lab" style={{ background: "#f3f4f6", colorScheme: "light", padding: "40px 18px 64px", minHeight: "70vh" }}>
      <style>{`
        .lab .crumb, .lab .crumb a, .lab .crumb .sep { color: #52525b; }
        .lab .crumb a:hover { color: #17171c; }
        .lab .lab-sub { color: #52525b; }
        .lab .lab-h1 { color: #17171c; }
      `}</style>
      <div className="wrap">
        <div className="crumb"><a href="/">GOAT UI</a><span className="sep">/</span><span>Lab</span><span className="sep">/</span><span>Forms</span></div>
        <h1 className="lab-h1">Forms and form layouts</h1>
        <p className="lab-sub">
          30 complete form patterns: auth, checkout, booking, wizards, conversational flows and more.
          Real state, real validation, spring motion and full keyboard support. Try them.
        </p>
        <div style={{ marginTop: 36 }}>
          <Suspense>
            <Sheet />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
