"use client";

import React, { forwardRef, useState } from "react";

export interface ButtonProps extends React.HTMLAttributes<any> {
  variant?: string;
  size?: string;
  disabled?: boolean;
  loading?: boolean;
  readonly?: boolean;
  state?: string;
  fullWidth?: boolean;
  validate?: any;
  onSubmit?: (...args: any[]) => void;
  loadingText?: string;
  successText?: string;
  errorText?: string;
  autoSuccess?: boolean;
}


export const buttonVariants = ({
  variant = "default",
  size = "default",
  className = "",
  fullWidth = false,
  state = "default",
}: {
  variant?: string;
  size?: string;
  className?: string;
  fullWidth?: boolean;
  state?: string;
} = {}) => {
  const variants: Record<string, string> = {
    default:
      "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-lg shadow-[var(--primary)]/20 hover:bg-[var(--accent-hover)]",

    secondary:
      "bg-[var(--secondary)] text-[var(--secondary-foreground)] border border-[var(--border)] hover:bg-[var(--muted)]",

    outline:
      "border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--secondary)]",

    ghost:
      "bg-transparent text-[var(--foreground)] hover:bg-[var(--secondary)]",

    destructive:
      "bg-[var(--destructive)] text-[var(--destructive-foreground)] shadow-lg shadow-[var(--destructive)]/20 hover:opacity-90",

    success:
      "bg-[var(--success)] text-[var(--success-foreground)] shadow-lg shadow-[var(--success)]/20 hover:opacity-90",
  };

  const sizes: Record<string, string> = {
    sm: "h-9 px-4 text-xs rounded-[var(--radius)]",
    default: "h-11 px-6 text-sm rounded-[var(--radius)]",
    lg: "h-12 px-8 text-base rounded-[var(--radius)]",
    xl: "h-14 px-10 text-lg rounded-[var(--radius)]",
    icon: "h-11 w-11 rounded-[var(--radius)]",
  };

  const states: Record<string, string> = {
    default: "",
    success: "ring-2 ring-[var(--success)]/50 border-[var(--success)]",
    warning: "ring-2 ring-[var(--warning)]/50 border-[var(--warning)]",
    error: "ring-2 ring-[var(--destructive)]/50 border-[var(--destructive)]",
  };

  return `
    relative
    inline-flex
    items-center
    justify-center
    overflow-hidden
    font-semibold
    transition-all
    duration-300
    active:scale-95
    hover:-translate-y-0.5
    disabled:pointer-events-none
    disabled:opacity-50
    focus:outline-none
    focus:ring-2
    focus:ring-[var(--ring)]/50
    ${fullWidth ? "w-full" : ""}
    ${variants[variant] || variants.default}
    ${sizes[size] || sizes.default}
    ${states[state] || ""}
    ${className}
  `;
};

const Spinner = () => (
  <svg
    className="h-4 w-4 animate-spin"
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="3"
      opacity="0.25"
    />
    <path
      d="M22 12A10 10 0 0 0 12 2"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M20 6L9 17L4 12"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Button = forwardRef<HTMLButtonElement, ButtonProps>((
  {
    children,
      variant = "default",
      size = "default",
      className = "",
      style,
      disabled = false,
      loading = false,
      readonly = false,
      state = "default",
      fullWidth = false,

      validate,
      onSubmit,

      loadingText = "Processing...",
      successText = "Success",
      errorText = "Validation Failed",

      autoSuccess = true,

      ...props
  },
  ref
) => {
    const [internalLoading, setInternalLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [ripples, setRipples] = useState<Array<{ x: number; y: number; size: number; id: number }>>([]);

    const isLoading = loading || internalLoading;

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || isLoading || readonly) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 2.5;
      const newRipple = { x, y, size, id: Date.now() };
      setRipples((prev) => [...prev, newRipple]);
    };

    const onRippleAnimationEnd = (id: number) => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    };

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || isLoading || readonly) return;

      setError(false);

      if (validate) {
        const valid = validate();
        if (!valid) {
          setError(true);
          setTimeout(() => {
            setError(false);
          }, 800);
          return;
        }
      }

      if (onSubmit) {
        try {
          setInternalLoading(true);
          await onSubmit(e);
          setInternalLoading(false);

          if (autoSuccess) {
            setSuccess(true);
            setTimeout(() => {
              setSuccess(false);
            }, 2000);
          }
        } catch (err) {
          setInternalLoading(false);
          setError(true);
          setTimeout(() => {
            setError(false);
          }, 2000);
        }
      }
    };

    const computedState = error ? "error" : success ? "success" : state;

    return (
      <button
        ref={ref}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        style={style}
        className={`
          group
          ${buttonVariants({
            variant,
            size,
            className,
            fullWidth,
            state: computedState,
          })}
          ${error ? "animate-[input-shake_0.25s_ease-in-out_infinite_alternate]" : ""}
        `}
        disabled={disabled || isLoading || readonly}
        {...props}
      >
        {/* Animated Spotlight */}
        <span
          className="
            absolute
            inset-0
            opacity-0
            group-hover:opacity-100
            transition-opacity
            duration-500
            bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_70%)]
          "
        />

        {/* Shine Effect */}
        <span
          className="
            absolute
            inset-y-0
            -left-20
            w-20
            rotate-12
            bg-white/10
            blur-xl
            transition-all
            duration-700
            group-hover:left-[120%]
          "
        />

        {/* Ripples */}
        {ripples.map((r) => (
          <span
            key={r.id}
            className="absolute rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: r.x,
              top: r.y,
              width: r.size,
              height: r.size,
              backgroundColor: "rgba(255, 255, 255, 0.25)",
              animation: "ripple 600ms linear forwards",
            }}
            onAnimationEnd={() => onRippleAnimationEnd(r.id)}
          />
        ))}

        <span className="relative z-10 flex items-center gap-2 pointer-events-none">
          {isLoading ? (
            <>
              <Spinner />
              {loadingText}
            </>
          ) : success ? (
            <>
              <CheckIcon />
              {successText}
            </>
          ) : error ? (
            errorText
          ) : (
            children
          )}
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export default Button;
