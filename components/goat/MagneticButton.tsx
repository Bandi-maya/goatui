/**
 * @file MagneticButton.tsx
 * @description A premium copy-paste Magnetic Button component with cursor-tracking hover glow effect.
 * Fully self-contained, React 19 / TypeScript ready, and styled with Tailwind CSS.
 * 
 * @example
 * import { MagneticButton } from "@/components/goat/MagneticButton";
 * 
 * export default function App() {
 *   return (
 *     <div className="flex items-center justify-center min-h-screen bg-zinc-950">
 *       <MagneticButton 
 *         onClick={() => console.log("Clicked")}
 *         glowColor="rgba(20, 184, 166, 0.2)"
 *         magneticStrength={0.4}
 *       >
 *         <span>Explore Peacock UI</span>
 *       </MagneticButton>
 *     </div>
 *   );
 * }
 */

"use client";

import React, { useRef, useState } from "react";

export interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  magneticStrength?: number; // Value between 0 and 1 representing magnetism
  glowColor?: string; // CSS color string for the hover glow radial gradient
  glowSize?: number; // Radius of the radial glow in pixels
  className?: string; // Additional classes for custom layout
}

export const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
  (
    {
      children,
      magneticStrength = 0.35,
      glowColor = "rgba(45, 212, 191, 0.15)", // Teal glow by default
      glowSize = 120,
      className = "",
      onClick,
      disabled,
      type = "button",
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLButtonElement>(null);
    const resolvedRef = (forwardedRef as React.RefObject<HTMLButtonElement | null>) || internalRef;

    const [isHovered, setIsHovered] = useState(false);
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const [glowCoords, setGlowCoords] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      const button = resolvedRef.current;
      if (!button || disabled) return;

      const rect = button.getBoundingClientRect();
      
      // Calculate mouse coordinates relative to viewport
      const { clientX, clientY } = e;

      // Distance from button center
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = (clientX - centerX) * magneticStrength;
      const y = (clientY - centerY) * magneticStrength;

      // Distance relative to button top-left for the glow gradient positioning
      const glowX = clientX - rect.left;
      const glowY = clientY - rect.top;

      setCoords({ x, y });
      setGlowCoords({ x: glowX, y: glowY });
    };

    const handleMouseEnter = () => {
      if (disabled) return;
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setCoords({ x: 0, y: 0 });
    };

    // Keyboard interaction helpers for magnet effect accessibility
    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        // Trigger subtle click vibration effect
        setCoords({ x: 0, y: 3 });
        setTimeout(() => setCoords({ x: 0, y: 0 }), 100);
      }
    };

    return (
      <button
        ref={resolvedRef}
        type={type}
        disabled={disabled}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        className={`
          relative overflow-hidden group
          px-6 py-3 rounded-xl font-medium text-sm
          border border-zinc-850 dark:border-zinc-800
          bg-zinc-900/60 dark:bg-zinc-950/40
          text-zinc-200 dark:text-zinc-100
          hover:border-zinc-700 dark:hover:border-zinc-700
          transition-colors duration-200
          focus-visible:ring-2 focus-visible:ring-teal-500/80 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950
          focus-visible:outline-none
          active:scale-[0.98]
          disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100
          ${className}
        `}
        style={{
          transform: isHovered
            ? `translate3d(${coords.x}px, ${coords.y}px, 0)`
            : "translate3d(0px, 0px, 0px)",
          transition: isHovered
            ? "background-color 0.2s ease-out, border-color 0.2s ease-out, transform 0.08s linear"
            : "background-color 0.2s ease-out, border-color 0.2s ease-out, transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        }}
        aria-disabled={disabled}
        {...props}
      >
        {/* Glow backdrop layer */}
        <div
          className="absolute pointer-events-none inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle ${glowSize}px at ${glowCoords.x}px ${glowCoords.y}px, ${glowColor}, transparent 80%)`,
          }}
        />

        {/* Glossy top-highlight border effect */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-600/20 to-transparent group-hover:via-teal-400/30 transition-all duration-350" />

        {/* Button label content container */}
        <span 
          className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white transition-colors duration-200"
          style={{
            transform: isHovered
              ? `translate3d(${coords.x * 0.15}px, ${coords.y * 0.15}px, 0)`
              : "translate3d(0px, 0px, 0px)",
            transition: isHovered ? "transform 0.08s linear" : "transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          }}
        >
          {children}
        </span>
      </button>
    );
  }
);

MagneticButton.displayName = "MagneticButton";
