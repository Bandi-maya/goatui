import * as React from "react"
import { clsx } from "clsx"

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps?: Array<{ label: string; description?: string }>;
  currentStep?: number;
  onStepClick?: (stepIndex: number) => void;
}


const Stepper = React.forwardRef<HTMLDivElement, StepperProps>((
  {
    className,
  steps = [], // Array of { label: "...", description: "..." }
  currentStep = 0, // 0-indexed active step
  onStepClick,
  ...props
  },
  ref
) => {
  return (
    <div
      ref={ref}
      className={clsx("flex w-full items-center justify-between select-none gap-4 text-left", className)}
      {...props}
    >
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const isPending = index > currentStep;

        return (
          <React.Fragment key={index}>
            {/* Step Element */}
            <div
              onClick={() => onStepClick && onStepClick(index)}
              className={clsx(
                "flex items-center gap-3 group transition-colors",
                onStepClick && "cursor-pointer"
              )}
            >
              {/* Point Circle */}
              <span
                className={clsx(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 font-bold text-xs transition-all",
                  isActive && "bg-[var(--primary)] border-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20 scale-105",
                  isCompleted && "bg-emerald-500 border-emerald-500 text-white",
                  isPending && "bg-transparent border-[var(--border)] text-slate-400 dark:text-slate-600"
                )}
              >
                {isCompleted ? (
                  <svg className="h-4.5 w-4.5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  index + 1
                )}
              </span>

              {/* Text metadata */}
              <div className="flex flex-col">
                <span className={clsx(
                  "text-xs font-semibold tracking-tight leading-tight",
                  isActive && "text-[var(--foreground)]",
                  isCompleted && "text-slate-500",
                  isPending && "text-slate-400 dark:text-slate-600"
                )}>
                  {step.label}
                </span>
                {step.description && (
                  <span className="text-[10px] text-slate-400 font-semibold mt-0.5 leading-none">
                    {step.description}
                  </span>
                )}
              </div>
            </div>

            {/* Connection Line Divider (except last) */}
            {index < steps.length - 1 && (
              <div
                className={clsx(
                  "h-[2px] flex-1 rounded-full transition-colors",
                  index < currentStep ? "bg-emerald-500" : "bg-[var(--border)]"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
})
Stepper.displayName = "Stepper"

export { Stepper }
export default Stepper
