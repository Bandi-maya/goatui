import * as React from "react";

export interface OutlineDrawProps {
  className?: string;
  rx?: string;
  state?: string;
}

const OutlineDraw = ({ className = "", rx = "var(--radius)", state = "default" }: OutlineDrawProps) => {
  const stateClasses: Record<string, string> = {
    default: "",
    success: "optiflow-outline-rect-success",
    warning: "optiflow-outline-rect-warning",
    error: "optiflow-outline-rect-error",
  };

  return (
    <svg
      className={`absolute inset-0 pointer-events-none w-full h-full z-20 overflow-visible ${className}`}
      fill="none"
    >
      <rect
        x="0.5"
        y="0.5"
        width="calc(100% - 1px)"
        height="calc(100% - 1px)"
        rx={rx}
        pathLength="1"
        className={`optiflow-outline-rect ${stateClasses[state] || ""}`}
      />
    </svg>
  );
};

OutlineDraw.displayName = "OutlineDraw";

export { OutlineDraw };
export default OutlineDraw;
