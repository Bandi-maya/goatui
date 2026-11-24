import InputFamily from "@/components/catalog/InputFamily";

export const metadata = { title: "Lab: inputs & forms" };

/* Preview sheet only - nothing here is in the library yet. Bandi picks. */
export default function LabInputs() {
  return (
    <div className="lab" style={{ background: "#f3f4f6", colorScheme: "light", padding: "40px 18px 64px", minHeight: "70vh" }}>
      <style>{`
        .lab .crumb, .lab .crumb a, .lab .crumb .sep { color: #52525b; }
        .lab .crumb a:hover { color: #17171c; }
        .lab .lab-sub { color: #52525b; }
        .lab .lab-h1 { color: #17171c; }
      `}</style>
      <div className="wrap">
        <div className="crumb"><a href="/">GOAT UI</a><span className="sep">/</span><span>Lab</span><span className="sep">/</span><span>Inputs</span></div>
        <h1 className="lab-h1">Inputs and forms, in real places</h1>
        <p className="lab-sub">
          30 controls shown the way they would actually ship: inside sign-in cards, checkouts,
          booking widgets and settings pages. Every one has real state, real validation,
          spring motion and full keyboard support. Try them.
        </p>
        <InputFamily />
      </div>
    </div>
  );
}
