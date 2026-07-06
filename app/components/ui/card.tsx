import * as React from "react"
import { OutlineDraw } from "./OutlineDraw"

export interface CardProps extends React.HTMLAttributes<any> {
  variant?: string;
  hoverable?: boolean;
  disabled?: boolean;
  loading?: boolean;
  readonly?: boolean;
  size?: string;
  state?: string;
  fullWidth?: boolean;
}

export interface CardHeaderProps extends React.HTMLAttributes<any> {
}

export interface CardTitleProps extends React.HTMLAttributes<any> {
}

export interface CardDescriptionProps extends React.HTMLAttributes<any> {
}

export interface CardContentProps extends React.HTMLAttributes<any> {
}

export interface CardFooterProps extends React.HTMLAttributes<any> {
}


const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

const CardContext = React.createContext({ size: "default" });

const Card = React.forwardRef<HTMLDivElement, CardProps>((
  {
    className,
  style,
  variant = "default",
  hoverable = false,
  disabled = false,
  loading = false,
  readonly = false,
  size = "default",
  state = "default",
  fullWidth = false,
  ...props
  },
  ref
) => {
  const [spotlightPos, setSpotlightPos] = React.useState({ x: 0, y: 0 });
  const [spotlightOpacity, setSpotlightOpacity] = React.useState(0);

  const states: Record<string, string> = {
    default: "border-[var(--border)]",
    success: "border-[var(--success)] shadow-[var(--success)]/10 shadow-md",
    warning: "border-[var(--warning)] shadow-[var(--warning)]/10 shadow-md",
    error: "border-[var(--destructive)] shadow-[var(--destructive)]/10 shadow-md",
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !hoverable) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setSpotlightPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setSpotlightOpacity(1);
  };

  const handleMouseLeave = () => {
    setSpotlightOpacity(0);
  };

  return (
    <CardContext.Provider value={{ size }}>
      <div
        ref={ref}
        style={style}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={clsx(
          "rounded-2xl border transition-all duration-300 relative overflow-hidden optiflow-outline-parent z-10",
          variant === "default" && "bg-[var(--card)] text-[var(--card-foreground)]",
          variant === "glass" && "bg-[var(--card)]/60 backdrop-blur-md text-[var(--card-foreground)]",
          variant === "secondary" && "bg-[var(--secondary)] text-[var(--secondary-foreground)]",
          states[state] || states.default,
          hoverable && "hover:-translate-y-1 hover:shadow-lg hover:border-[var(--ring)]/40",
          disabled && "opacity-50 pointer-events-none",
          fullWidth ? "w-full" : "w-auto",
          className
        )}
        {...props}
      >
        {/* Spotlight light reflection underlay */}
        {hoverable && !disabled && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-[inherit] -z-10"
            style={{
              opacity: spotlightOpacity,
              background: `radial-gradient(500px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(14, 165, 233, 0.08), transparent 85%)`
            }}
          />
        )}

        {/* Tracing border overlay */}
        {hoverable && !disabled && (
          <OutlineDraw rx="16px" state={state} />
        )}

        {loading && (
          <div className="absolute inset-0 bg-[var(--background)]/40 backdrop-blur-xs z-10 flex items-center justify-center animate-fade-in">
            <svg className="h-6 w-6 animate-spin text-[var(--primary)]" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" className="opacity-25" />
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
            </svg>
          </div>
        )}
        {props.children}
      </div>
    </CardContext.Provider>
  );
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>((
  {
    className, ...props
  },
  ref
) => {
  const { size } = React.useContext(CardContext);
  const paddings: Record<string, string> = {
    sm: "p-4 space-y-1",
    default: "p-6 space-y-1.5",
    lg: "p-8 space-y-2",
    xl: "p-10 space-y-2.5",
  };
  return (
    <div
      ref={ref}
      className={clsx("flex flex-col relative z-10", paddings[size] || paddings.default, className)}
      {...props}
    />
  );
})
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLDivElement, CardTitleProps>((
  {
    className, children, ...props
  },
  ref
) => (
  <h3
    ref={ref}
    className={clsx("font-bold text-lg leading-tight tracking-tight text-[var(--foreground)]", className)}
    {...props}
  >
    {children}
  </h3>
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLDivElement, CardDescriptionProps>((
  {
    className, children, ...props
  },
  ref
) => (
  <p
    ref={ref}
    className={clsx("text-sm text-[var(--muted-foreground)] font-medium", className)}
    {...props}
  >
    {children}
  </p>
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>((
  {
    className, ...props
  },
  ref
) => {
  const { size } = React.useContext(CardContext);
  const paddings: Record<string, string> = {
    sm: "px-4 pb-4 pt-0",
    default: "px-6 pb-6 pt-0",
    lg: "px-8 pb-8 pt-0",
    xl: "px-10 pb-10 pt-0",
  };
  return (
    <div ref={ref} className={clsx("relative z-10", paddings[size] || paddings.default, className)} {...props} />
  );
})
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>((
  {
    className, ...props
  },
  ref
) => {
  const { size } = React.useContext(CardContext);
  const paddings: Record<string, string> = {
    sm: "px-4 pb-4 mt-2",
    default: "px-6 pb-6 mt-4",
    lg: "px-8 pb-8 mt-6",
    xl: "px-10 pb-10 mt-8",
  };
  return (
    <div
      ref={ref}
      className={clsx(
        "flex items-center border-t border-[var(--border)]/15 pt-4 relative z-10",
        paddings[size] || paddings.default,
        className
      )}
      {...props}
    />
  );
})
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
export default Card
