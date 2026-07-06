import * as React from "react"
import { OutlineDraw } from "./OutlineDraw"

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  errorText?: React.ReactNode;
  helperText?: React.ReactNode;
  maxLength?: number;
  showCounter?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  readonly?: boolean;
  label?: React.ReactNode;
  size?: "sm" | "default" | "lg" | "xl";
  variant?: "default" | "filled" | "glass";
  state?: "default" | "success" | "warning" | "error";
  fullWidth?: boolean;
}

const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>((
  {
    className,
    style,
    errorText,
    helperText,
    maxLength,
    showCounter,
    value,
    onChange,
    disabled = false,
    loading = false,
    readonly = false,
    readOnly = false,
    required,
    label,
    id,
    size = "default",
    variant = "default",
    state = "default",
    fullWidth = false,
    ...props
  },
  ref
) => {
  const [internalValue, setInternalValue] = React.useState(value || "");
  const [isFocused, setIsFocused] = React.useState(false);
  const generatedId = React.useId();
  const inputId = id || generatedId;
  const isReadOnly = readonly || readOnly;

  React.useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (disabled || isReadOnly || loading) return;
    if (value === undefined) {
      setInternalValue(e.target.value);
    }
    onChange?.(e);
  };

  const currentValueString = String(internalValue ?? "");
  const charCount = currentValueString.length;

  const activeState =
    errorText || state === "error"
      ? "error"
      : state === "warning"
        ? "warning"
        : state === "success"
          ? "success"
          : "default";

  return (
    <div 
      className={clsx(
        fullWidth ? "w-full" : "w-auto", 
        "flex flex-col gap-1.5 optiflow-outline-parent",
        isFocused && "optiflow-focused",
        activeState === "success" && "optiflow-success-aura",
        activeState === "error" && "optiflow-error-aura",
        activeState === "warning" && "optiflow-warning-aura"
      )}
      style={{
        ["--textarea-bg" as any]:
          variant === "filled"
            ? "var(--secondary)"
            : variant === "glass"
              ? "rgba(255,255,255,0.05)"
              : "var(--background)",

        ["--state-color" as any]:
          activeState === "error"
            ? "var(--destructive)"
            : activeState === "warning"
              ? "var(--warning)"
              : activeState === "success"
                ? "var(--success)"
                : "var(--primary)",

        ["--border-base" as any]:
          activeState !== "default"
            ? "var(--state-color)"
            : isFocused
              ? "var(--state-color)"
              : "var(--border)",
        ...style
      } as React.CSSProperties}
    >
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-[var(--muted-foreground)]"
        >
          {label} {required && <span className="text-[var(--destructive)]">*</span>}
        </label>
      )}
      <div className="relative">
        {/* Focus Aura Underlay */}
        <div className="optiflow-focus-aura-glow" />

        {/* Outline Drawing Overlay */}
        <OutlineDraw rx="12px" state={activeState} />

        <textarea
          id={inputId}
          ref={ref}
          value={internalValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={maxLength}
          disabled={disabled || loading}
          readOnly={isReadOnly}
          className={clsx(
            "flex w-full rounded-xl border outline-none transition-all duration-300 z-10 relative bg-transparent",
            
            disabled || isReadOnly
              ? "cursor-not-allowed opacity-50 bg-[var(--secondary)]"
              : "",

            variant === "glass" ? "backdrop-blur-md" : "",

            size === "sm" && "min-h-[80px] text-xs px-3 py-2",
            size === "default" && "min-h-[100px] text-sm px-4 py-3",
            size === "lg" && "min-h-[140px] text-base px-5 py-4",
            size === "xl" && "min-h-[180px] text-lg px-6 py-5",

            className
          )}
          style={{
            borderColor: "var(--border-base)",
            backgroundColor: "var(--textarea-bg)",
            color: "var(--foreground)",
            boxShadow: "none", // Prevent box shadow spam in favor of Focus Aura underlay
          }}
          {...(props as any)}
        />
        {loading && (
          <div className="absolute right-3 top-3 flex items-center justify-center z-20">
            <svg
              className="h-4 w-4 animate-spin text-[var(--muted-foreground)]"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="opacity-25"
              />
              <path
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                className="opacity-75"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="flex justify-between px-1 text-xs">
        <div>
          {errorText ? (
            <span className="font-semibold text-[var(--destructive)] flex items-center gap-1.5 animate-slide-up">
              <svg className="h-3.5 w-3.5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {errorText}
            </span>
          ) : activeState === "warning" ? (
            <span className="font-semibold text-[var(--warning)] flex items-center gap-1.5 animate-slide-up">
              <svg className="h-3.5 w-3.5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              Warning state
            </span>
          ) : activeState === "success" ? (
            <span className="font-semibold text-[var(--success)] flex items-center gap-1.5 animate-slide-up">
              <svg className="h-3.5 w-3.5 stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="20 6 9 17 4 12" className="optiflow-checkbox-draw" />
              </svg>
              Success state
            </span>
          ) : (
            helperText && <span className="text-[var(--muted-foreground)]">{helperText}</span>
          )}
        </div>
        {showCounter && maxLength && (
          <span className={clsx(charCount >= maxLength ? "text-[var(--destructive)] font-bold" : "text-[var(--muted-foreground)]")}>
            {charCount} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
})
Textarea.displayName = "Textarea"

export { Textarea }
export default Textarea
