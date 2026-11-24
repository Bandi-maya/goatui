"use client";

import { useEffect, useState, type ComponentType } from "react";
import { motion, useReducedMotion, animate } from "framer-motion";
import "./LoadersFamily.css";

/* ------------------------------------------------------------------ */
/* Shared helpers                                                      */
/* ------------------------------------------------------------------ */

const springSoft = { type: "spring" as const, stiffness: 260, damping: 22 };
const springBouncy = { type: "spring" as const, stiffness: 320, damping: 14 };

function SrOnly({ children }: { children: string }) {
  return <span className="gu-sr">{children}</span>;
}

/* ------------------------------------------------------------------ */
/* v01 · OrbitLoader — three satellites on a spring-pulsed orbit       */
/* ------------------------------------------------------------------ */

export function OrbitLoader({ size = 64 }: { size?: number }) {
  const rm = useReducedMotion();
  return (
    <div
      className="gu-ld-orbit"
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    >
      <span className="gu-ld-orbit-core" />
      {[0, 1, 2].map((i) => (
        <span key={i} className="gu-ld-orbit-arm" style={{ animationDelay: `${(-i * 2.8) / 3}s` }}>
          <motion.span
            className="gu-ld-orbit-dot"
            animate={rm ? { scale: 1 } : { scale: [1, 1.45] }}
            transition={
              rm
                ? undefined
                : { ...springBouncy, repeat: Infinity, repeatType: "reverse", delay: i * 0.45 }
            }
          />
        </span>
      ))}
      <SrOnly>Loading</SrOnly>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v02 · BlobMorphLoader — elastic shape morph with gradient           */
/* ------------------------------------------------------------------ */

export function BlobMorphLoader({ size = 56 }: { size?: number }) {
  const rm = useReducedMotion();
  return (
    <div className="gu-ld-stage" role="status" aria-label="Loading">
      <motion.div
        className="gu-ld-blob"
        style={{ width: size, height: size }}
        animate={
          rm
            ? { borderRadius: "42% 58% 55% 45% / 48% 44% 56% 52%" }
            : {
                borderRadius: [
                  "42% 58% 55% 45% / 48% 44% 56% 52%",
                  "58% 42% 40% 60% / 42% 58% 44% 56%",
                ],
                rotate: [0, 160],
                scale: [1, 1.08],
              }
        }
        transition={
          rm
            ? undefined
            : {
                borderRadius: { duration: 2.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                rotate: { ...springSoft, repeat: Infinity, repeatType: "reverse" },
                scale: { ...springSoft, repeat: Infinity, repeatType: "reverse" },
              }
        }
      />
      <SrOnly>Loading</SrOnly>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v03 · SonarLoader — radar ping rings                                */
/* ------------------------------------------------------------------ */

export function SonarLoader({ size = 64 }: { size?: number }) {
  const rm = useReducedMotion();
  return (
    <div
      className="gu-ld-sonar"
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    >
      {[0, 1, 2].map((i) => (
        <span key={i} className="gu-ld-sonar-ring" style={{ animationDelay: `${i * 0.7}s` }} />
      ))}
      <motion.span
        className="gu-ld-sonar-core"
        animate={rm ? { scale: 1 } : { scale: [1, 1.25] }}
        transition={rm ? undefined : { ...springBouncy, repeat: Infinity, repeatType: "reverse" }}
      />
      <SrOnly>Loading</SrOnly>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v04 · CubeFlipLoader — 3D tile tumbling on springs                  */
/* ------------------------------------------------------------------ */

export function CubeFlipLoader({ size = 40 }: { size?: number }) {
  const rm = useReducedMotion();
  return (
    <div className="gu-ld-stage gu-ld-perspective" role="status" aria-label="Loading">
      <motion.div
        className="gu-ld-cube"
        style={{ width: size, height: size }}
        animate={
          rm
            ? { rotateX: 0, rotateY: 0 }
            : {
                rotateX: [0, -180],
                rotateY: [0, -180],
                scale: [1, 0.86],
              }
        }
        transition={
          rm
            ? undefined
            : {
                rotateX: { ...springSoft, repeat: Infinity, repeatType: "reverse" },
                rotateY: { ...springSoft, stiffness: 180, repeat: Infinity, repeatType: "reverse", delay: 0.4 },
                scale: { ...springSoft, repeat: Infinity, repeatType: "reverse" },
              }
        }
      />
      <SrOnly>Loading</SrOnly>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v05 · EqualizerLoader — staggered elastic bars                      */
/* ------------------------------------------------------------------ */

export function EqualizerLoader({ bars = 5 }: { bars?: number }) {
  const rm = useReducedMotion();
  const heights = [0.35, 0.85, 0.55, 1, 0.5];
  return (
    <div className="gu-ld-eq" role="status" aria-label="Loading">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.span
          key={i}
          className="gu-ld-eq-bar"
          animate={
            rm
              ? { scaleY: 0.6 }
              : { scaleY: [heights[i % heights.length], heights[(i + 2) % heights.length]] }
          }
          transition={
            rm
              ? undefined
              : { ...springBouncy, repeat: Infinity, repeatType: "reverse", delay: i * 0.12 }
          }
        />
      ))}
      <SrOnly>Loading</SrOnly>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v06 · ChaseDotsLoader — three dots elastic-chasing along a track    */
/* ------------------------------------------------------------------ */

export function ChaseDotsLoader() {
  const rm = useReducedMotion();
  return (
    <div className="gu-ld-chase" role="status" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="gu-ld-chase-dot"
          animate={rm ? { x: 28 } : { x: [0, 56] }}
          transition={
            rm
              ? undefined
              : {
                  ...springBouncy,
                  stiffness: 240,
                  damping: 16,
                  duration: 1.4,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.16,
                }
          }
        />
      ))}
      <SrOnly>Loading</SrOnly>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v07 · SkeletonCard — shimmer card placeholder                       */
/* ------------------------------------------------------------------ */

export function SkeletonCard() {
  return (
    <div className="gu-sk-card" role="status" aria-label="Loading card content">
      <div className="gu-sk gu-sk-media" />
      <div className="gu-sk-card-body">
        <div className="gu-sk gu-sk-line w70" />
        <div className="gu-sk gu-sk-line w95" />
        <div className="gu-sk gu-sk-line w45" />
      </div>
      <SrOnly>Loading card content</SrOnly>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v08 · SkeletonList — avatar rows placeholder                        */
/* ------------------------------------------------------------------ */

export function SkeletonList({ rows = 3 }: { rows?: number }) {
  return (
    <div className="gu-sk-list" role="status" aria-label="Loading list">
      {Array.from({ length: rows }).map((_, i) => (
        <div className="gu-sk-list-row" key={i}>
          <div className="gu-sk gu-sk-avatar" style={{ animationDelay: `${i * 0.15}s` }} />
          <div className="gu-sk-list-lines">
            <div className="gu-sk gu-sk-line w55" style={{ animationDelay: `${i * 0.15}s` }} />
            <div className="gu-sk gu-sk-line w85" style={{ animationDelay: `${i * 0.15 + 0.05}s` }} />
          </div>
        </div>
      ))}
      <SrOnly>Loading list</SrOnly>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v09 · SkeletonArticle — editorial text placeholder                  */
/* ------------------------------------------------------------------ */

export function SkeletonArticle() {
  return (
    <div className="gu-sk-article" role="status" aria-label="Loading article">
      <div className="gu-sk gu-sk-kicker w30" />
      <div className="gu-sk gu-sk-headline w85" />
      <div className="gu-sk gu-sk-headline w60" />
      <div className="gu-sk-article-gap" />
      <div className="gu-sk gu-sk-line w95" />
      <div className="gu-sk gu-sk-line w100" />
      <div className="gu-sk gu-sk-line w90" />
      <div className="gu-sk gu-sk-line w40" />
      <SrOnly>Loading article</SrOnly>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v10 · SkeletonProfile — identity block placeholder                  */
/* ------------------------------------------------------------------ */

export function SkeletonProfile() {
  return (
    <div className="gu-sk-profile" role="status" aria-label="Loading profile">
      <div className="gu-sk gu-sk-avatar lg" />
      <div className="gu-sk-profile-mid">
        <div className="gu-sk gu-sk-line w60" />
        <div className="gu-sk gu-sk-line w40" />
      </div>
      <div className="gu-sk-profile-stats">
        {[0, 1, 2].map((i) => (
          <div className="gu-sk-profile-stat" key={i}>
            <div className="gu-sk gu-sk-line w40" />
            <div className="gu-sk gu-sk-line w70" />
          </div>
        ))}
      </div>
      <SrOnly>Loading profile</SrOnly>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v11 · SkeletonChart — bars rising placeholder                       */
/* ------------------------------------------------------------------ */

export function SkeletonChart({ bars = 7 }: { bars?: number }) {
  const heights = [38, 62, 48, 80, 56, 92, 70];
  return (
    <div className="gu-sk-chart" role="status" aria-label="Loading chart">
      <div className="gu-sk-chart-plot">
        {Array.from({ length: bars }).map((_, i) => (
          <span
            key={i}
            className="gu-sk-chart-bar"
            style={{ height: `${heights[i % heights.length]}%`, animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </div>
      <div className="gu-sk-chart-axis" />
      <SrOnly>Loading chart</SrOnly>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v12 · SkeletonMediaPlayer — 16:9 media placeholder                  */
/* ------------------------------------------------------------------ */

export function SkeletonMediaPlayer() {
  return (
    <div className="gu-sk-player" role="status" aria-label="Loading media">
      <div className="gu-sk gu-sk-screen">
        <span className="gu-sk-play" aria-hidden="true" />
      </div>
      <div className="gu-sk-player-rail">
        <div className="gu-sk gu-sk-line w100" style={{ height: 4, borderRadius: 999 }} />
        <div className="gu-sk-player-meta">
          <div className="gu-sk gu-sk-line w30" />
          <div className="gu-sk gu-sk-line w15" />
        </div>
      </div>
      <SrOnly>Loading media</SrOnly>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v13 · SlideBarLoader — indeterminate capsule gliding on a track     */
/* ------------------------------------------------------------------ */

export function SlideBarLoader({ width = 168 }: { width?: number }) {
  const rm = useReducedMotion();
  const cap = 56;
  return (
    <div
      className="gu-ld-slidebar"
      style={{ width }}
      role="progressbar"
      aria-label="Loading"
    >
      <motion.span
        className="gu-ld-slidebar-cap"
        style={{ width: cap }}
        animate={rm ? { x: (width - cap) / 2 } : { x: [0, width - cap] }}
        transition={
          rm
            ? undefined
            : { ...springSoft, stiffness: 140, damping: 18, repeat: Infinity, repeatType: "reverse" }
        }
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v14 · CountUpLoader — conic ring counting to 100, tabular numerals  */
/* ------------------------------------------------------------------ */

export function CountUpLoader({ size = 64 }: { size?: number }) {
  const rm = useReducedMotion();
  const [pct, setPct] = useState(0);
  useEffect(() => {
    if (rm) {
      setPct(100);
      return;
    }
    const controls = animate(0, 100, {
      duration: 2.6,
      ease: [0.65, 0, 0.35, 1],
      repeat: Infinity,
      repeatDelay: 0.6,
      onUpdate: (v) => setPct(Math.round(v)),
    });
    return () => controls.stop();
  }, [rm]);
  return (
    <div
      className="gu-ld-count"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-label="Loading progress"
    >
      <div
        className="gu-ld-count-ring"
        style={{
          width: size,
          height: size,
          background: `conic-gradient(hsl(var(--primary)) ${pct * 3.6}deg, hsl(var(--muted)) 0deg)`,
        }}
      >
        <div className="gu-ld-count-hole">
          <motion.span
            className="gu-num gu-ld-count-num"
            animate={{ scale: !rm && pct === 100 ? 1.22 : 1 }}
            transition={springBouncy}
          >
            {pct}
          </motion.span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v15 · LoadingButton — busy button, keyboard accessible              */
/* ------------------------------------------------------------------ */

export function LoadingButton({ label = "Save changes" }: { label?: string }) {
  const rm = useReducedMotion();
  const [busy, setBusy] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setBusy((b) => !b), 3200);
    return () => clearInterval(id);
  }, []);
  return (
    <button
      type="button"
      className={"gu-ld-btn" + (busy ? " is-busy" : "")}
      aria-busy={busy}
      aria-disabled={busy}
      onClick={(e) => {
        if (busy) {
          e.preventDefault();
          return;
        }
        setBusy(true);
      }}
    >
      <motion.span
        className="gu-ld-btn-spinner"
        aria-hidden="true"
        animate={
          !busy ? { opacity: 0, scale: 0.6 } : rm ? { opacity: 1, scale: 1 } : { opacity: 1, scale: [1, 1.18], rotate: 360 }
        }
        transition={
          !busy || rm
            ? { duration: 0.25 }
            : {
                rotate: { duration: 1.1, repeat: Infinity, ease: "linear" },
                scale: { ...springBouncy, repeat: Infinity, repeatType: "reverse" },
                opacity: { duration: 0.2 },
              }
        }
      />
      <motion.span
        className="gu-ld-btn-label"
        animate={{ opacity: busy ? 0.72 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {busy ? "Saving…" : label}
      </motion.span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* v16 · CradleLoader — Newton's cradle end balls on springs           */
/* ------------------------------------------------------------------ */

export function CradleLoader() {
  const rm = useReducedMotion();
  const period = 1.6;
  return (
    <div className="gu-ld-cradle" role="status" aria-label="Loading">
      {[0, 1, 2, 3, 4].map((i) => {
        const isLeft = i === 0;
        const isRight = i === 4;
        return (
          <motion.span
            key={i}
            className="gu-ld-cradle-ball"
            animate={
              rm
                ? { rotate: 0 }
                : isLeft
                  ? { rotate: [-32, 0] }
                  : isRight
                    ? { rotate: [0, 32] }
                    : { rotate: 0 }
            }
            transition={
              rm || (!isLeft && !isRight)
                ? undefined
                : {
                    ...springSoft,
                    stiffness: 200,
                    damping: 14,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: isRight ? period / 2 : 0,
                  }
            }
          >
            <i className="gu-ld-cradle-string" />
            <i className="gu-ld-cradle-orb" />
          </motion.span>
        );
      })}
      <SrOnly>Loading</SrOnly>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v17 · GridWaveLoader — diagonal pulse sweeping a 3x3 grid           */
/* ------------------------------------------------------------------ */

export function GridWaveLoader({ cell = 10 }: { cell?: number }) {
  const rm = useReducedMotion();
  return (
    <div
      className="gu-ld-grid"
      style={{ gridTemplateColumns: `repeat(3, ${cell}px)` }}
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: 9 }).map((_, i) => {
        const delay = ((i % 3) + Math.floor(i / 3)) * 0.14;
        return (
          <motion.span
            key={i}
            className="gu-ld-grid-cell"
            style={{ width: cell, height: cell }}
            animate={rm ? { opacity: 0.55, scale: 1 } : { opacity: [0.25, 1], scale: [0.8, 1.12] }}
            transition={rm ? undefined : { ...springBouncy, repeat: Infinity, repeatType: "reverse", delay }}
          />
        );
      })}
      <SrOnly>Loading</SrOnly>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v18 · TypingLoader — chat bubble with bouncing dots                 */
/* ------------------------------------------------------------------ */

export function TypingLoader() {
  const rm = useReducedMotion();
  return (
    <div className="gu-ld-typing" role="status" aria-label="Someone is typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="gu-ld-typing-dot"
          animate={rm ? { y: 0 } : { y: [0, -5] }}
          transition={
            rm
              ? undefined
              : { ...springBouncy, stiffness: 420, damping: 12, repeat: Infinity, repeatType: "reverse", delay: i * 0.14 }
          }
        />
      ))}
      <SrOnly>Someone is typing</SrOnly>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v19 · StackLoader — tiles dropping into a stack, then reset         */
/* ------------------------------------------------------------------ */

export function StackLoader() {
  const rm = useReducedMotion();
  return (
    <div className="gu-ld-stack" role="status" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="gu-ld-stack-tile"
          style={{ bottom: i * 14 }}
          animate={
            rm
              ? { y: 0, opacity: 1 }
              : { y: [-56, 0, 0, 0], opacity: [0, 1, 1, 0], scale: [1, 1, 1, 0.7] }
          }
          transition={
            rm
              ? undefined
              : {
                  type: "tween",
                  duration: 2.4,
                  times: [0, 0.22, 0.82, 1],
                  ease: ["backOut", "easeInOut", "easeIn"],
                  repeat: Infinity,
                  delay: i * 0.5,
                }
          }
        />
      ))}
      <SrOnly>Loading</SrOnly>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v20 · LiquidFillLoader — jar filling with a sloshing wave           */
/* ------------------------------------------------------------------ */

export function LiquidFillLoader({ size = 56 }: { size?: number }) {
  return (
    <div
      className="gu-ld-liquid"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-label="Loading"
    >
      <div className="gu-ld-liquid-fill">
        <svg className="gu-ld-liquid-wave w1" viewBox="0 0 120 12" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 6 Q 15 0 30 6 T 60 6 T 90 6 T 120 6 V12 H0 Z" />
        </svg>
        <svg className="gu-ld-liquid-wave w2" viewBox="0 0 120 12" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 6 Q 15 0 30 6 T 60 6 T 90 6 T 120 6 V12 H0 Z" />
        </svg>
      </div>
      <SrOnly>Loading</SrOnly>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v21 · InfinityLoader — stroke-drawn infinity loop                   */
/* ------------------------------------------------------------------ */

export function InfinityLoader({ width = 72 }: { width?: number }) {
  const rm = useReducedMotion();
  return (
    <div className="gu-ld-stage" role="status" aria-label="Loading">
      <svg
        className="gu-ld-infinity"
        width={width}
        height={width / 2}
        viewBox="0 0 72 36"
        fill="none"
        aria-hidden="true"
      >
        <path
          className="gu-ld-infinity-path"
          d="M18 18 C 18 8, 30 8, 36 18 C 42 28, 54 28, 54 18 C 54 8, 42 8, 36 18 C 30 28, 18 28, 18 18 Z"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      {!rm && <span className="gu-ld-infinity-glint" aria-hidden="true" />}
      <SrOnly>Loading</SrOnly>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v22 · SunburstLoader — twelve tapered rays cascading                */
/* ------------------------------------------------------------------ */

export function SunburstLoader({ size = 56 }: { size?: number }) {
  return (
    <div
      className="gu-ld-sunburst"
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className="gu-ld-sunburst-ray"
          style={{ rotate: `${i * 30}deg`, animationDelay: `${(i * 1.2) / 12}s` }}
        />
      ))}
      <SrOnly>Loading</SrOnly>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v23 · HeartbeatLoader — ECG trace with a live bpm readout           */
/* ------------------------------------------------------------------ */

export function HeartbeatLoader() {
  const rm = useReducedMotion();
  return (
    <div className="gu-ld-ecg" role="status" aria-label="Loading">
      <svg className="gu-ld-ecg-trace" width="96" height="32" viewBox="0 0 96 32" fill="none" aria-hidden="true">
        <path
          className="gu-ld-ecg-path"
          d="M0 16 H22 L28 16 L32 6 L38 26 L43 10 L47 16 H62 L67 13 L72 19 L77 16 H96"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="gu-ld-ecg-read">
        <motion.span
          className="gu-ld-ecg-heart"
          animate={rm ? { scale: 1 } : { scale: [1, 1.35] }}
          transition={rm ? undefined : { ...springBouncy, duration: 0.55, repeat: Infinity, repeatType: "reverse" }}
          aria-hidden="true"
        >
          ♥
        </motion.span>
        <span className="gu-num">72</span>
        <span className="gu-ld-ecg-unit">bpm</span>
      </span>
      <SrOnly>Loading</SrOnly>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v24 · CoinLoader — flipping coin with synced floor shadow           */
/* ------------------------------------------------------------------ */

export function CoinLoader({ size = 44 }: { size?: number }) {
  const rm = useReducedMotion();
  const dur = 1.5;
  return (
    <div className="gu-ld-coin-wrap" role="status" aria-label="Loading">
      <motion.div
        className="gu-ld-coin"
        style={{ width: size, height: size }}
        animate={rm ? { rotateY: 0, y: 0 } : { rotateY: [0, 360], y: [0, -14] }}
        transition={
          rm
            ? undefined
            : {
                rotateY: { duration: dur, repeat: Infinity, ease: "easeInOut" },
                y: { ...springBouncy, repeat: Infinity, repeatType: "reverse" },
              }
        }
      >
        <span className="gu-ld-coin-face" aria-hidden="true">₹</span>
      </motion.div>
      <motion.span
        className="gu-ld-coin-shadow"
        animate={rm ? { scaleX: 1, opacity: 0.28 } : { scaleX: [1, 0.55], opacity: [0.28, 0.12] }}
        transition={rm ? undefined : { ...springSoft, repeat: Infinity, repeatType: "reverse" }}
        aria-hidden="true"
      />
      <SrOnly>Loading</SrOnly>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v25 · HourglassLoader — flipping hourglass with draining sand       */
/* ------------------------------------------------------------------ */

export function HourglassLoader({ size = 40 }: { size?: number }) {
  return (
    <div className="gu-ld-hour-wrap" role="status" aria-label="Loading">
      <div className="gu-ld-hour" style={{ width: size, height: size * 1.2 }}>
        <svg viewBox="0 0 40 48" width={size} height={size * 1.2} aria-hidden="true">
          <path className="gu-ld-hour-glass" d="M8 4 H32 V10 C32 18 24 20 20 24 C16 20 8 18 8 10 Z" />
          <path className="gu-ld-hour-glass" d="M8 44 H32 V38 C32 30 24 28 20 24 C16 28 8 30 8 38 Z" />
          <path className="gu-ld-hour-sand top" d="M12 8 H28 V10 C28 15 23 17 20 20 C17 17 12 15 12 10 Z" />
          <path className="gu-ld-hour-sand bottom" d="M12 40 H28 V38 C28 33 23 31 20 28 C17 31 12 33 12 38 Z" />
          <line className="gu-ld-hour-stream" x1="20" y1="22" x2="20" y2="30" />
        </svg>
      </div>
      <SrOnly>Loading</SrOnly>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v26 · ConveyorLoader — parcels riding an animated belt              */
/* ------------------------------------------------------------------ */

export function ConveyorLoader({ width = 160 }: { width?: number }) {
  const rm = useReducedMotion();
  return (
    <div className="gu-ld-belt" style={{ width }} role="status" aria-label="Loading">
      <div className="gu-ld-belt-track">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className={"gu-ld-belt-box b" + i}
            animate={rm ? { x: i * 48, opacity: 1 } : { x: [width, -28], opacity: [0, 1, 1, 0] }}
            transition={
              rm
                ? undefined
                : {
                    duration: 3,
                    times: [0, 0.08, 0.92, 1],
                    repeat: Infinity,
                    delay: i * 1,
                    ease: "linear",
                  }
            }
          />
        ))}
      </div>
      <div className="gu-ld-belt-line" aria-hidden="true" />
      <div className="gu-ld-belt-wheels" aria-hidden="true">
        <span /><span />
      </div>
      <SrOnly>Loading</SrOnly>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v27 · SignalLoader — wifi arcs lighting in sequence                 */
/* ------------------------------------------------------------------ */

export function SignalLoader({ size = 48 }: { size?: number }) {
  return (
    <div className="gu-ld-stage" role="status" aria-label="Loading">
      <svg width={size} height={size * 0.75} viewBox="0 0 48 36" fill="none" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            className={"gu-ld-signal-arc a" + i}
            d={["M8 18 C 16 8, 32 8, 40 18", "M14 25 C 19 18, 29 18, 34 25", "M20 31 C 22 28, 26 28, 28 31"][i]}
            strokeWidth="4"
            strokeLinecap="round"
            style={{ animationDelay: `${i * 0.35}s` }}
          />
        ))}
        <circle className="gu-ld-signal-dot" cx="24" cy="33" r="3" />
      </svg>
      <SrOnly>Loading</SrOnly>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v28 · BounceBallLoader — squash-and-stretch spring bounce           */
/* ------------------------------------------------------------------ */

export function BounceBallLoader({ size = 28 }: { size?: number }) {
  const rm = useReducedMotion();
  const dur = 0.85;
  return (
    <div className="gu-ld-ball-wrap" role="status" aria-label="Loading">
      <motion.span
        className="gu-ld-ball"
        style={{ width: size, height: size }}
        animate={
          rm
            ? { y: 0, scaleX: 1, scaleY: 1 }
            : { y: [0, -44], scaleX: [1.18, 0.92], scaleY: [0.82, 1.1] }
        }
        transition={
          rm
            ? undefined
            : { ...springBouncy, stiffness: 380, damping: 13, repeat: Infinity, repeatType: "reverse" }
        }
      />
      <motion.span
        className="gu-ld-ball-shadow"
        animate={rm ? { scaleX: 1, opacity: 0.3 } : { scaleX: [1, 0.5], opacity: [0.3, 0.1] }}
        transition={rm ? undefined : { ...springSoft, repeat: Infinity, repeatType: "reverse" }}
        aria-hidden="true"
      />
      <SrOnly>Loading</SrOnly>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v29 · SkeletonDashboard — composite KPI + sparkline placeholder     */
/* ------------------------------------------------------------------ */

export function SkeletonDashboard() {
  return (
    <div className="gu-sk-dash" role="status" aria-label="Loading dashboard">
      <div className="gu-sk-dash-kpis">
        {[0, 1, 2].map((i) => (
          <div className="gu-sk-dash-kpi" key={i}>
            <div className="gu-sk gu-sk-line w50" style={{ animationDelay: `${i * 0.12}s` }} />
            <div className="gu-sk gu-sk-line w70" style={{ height: 12, animationDelay: `${i * 0.12 + 0.05}s` }} />
          </div>
        ))}
      </div>
      <div className="gu-sk-dash-spark">
        {[52, 70, 44, 84, 60, 92, 68, 76].map((h, i) => (
          <span key={i} className="gu-sk-chart-bar" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
        ))}
      </div>
      <SrOnly>Loading dashboard</SrOnly>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v30 · SpiralLoader — pulse travelling around a ring of dots         */
/* ------------------------------------------------------------------ */

export function SpiralLoader({ size = 56 }: { size?: number }) {
  const rm = useReducedMotion();
  const n = 8;
  const r = size / 2 - 6;
  return (
    <div
      className="gu-ld-spiral"
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: n }).map((_, i) => {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        return (
          <motion.span
            key={i}
            className="gu-ld-spiral-dot"
            style={{
              left: size / 2 + Math.cos(angle) * r - 4,
              top: size / 2 + Math.sin(angle) * r - 4,
            }}
            animate={rm ? { scale: 1, opacity: 0.7 } : { scale: [0.55, 1.35], opacity: [0.3, 1] }}
            transition={
              rm
                ? undefined
                : { ...springBouncy, repeat: Infinity, repeatType: "reverse", delay: (i * 1.3) / n }
            }
          />
        );
      })}
      <SrOnly>Loading</SrOnly>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Gallery registry + preview grid                                     */
/* ------------------------------------------------------------------ */

type Entry = {
  id: string;
  name: string;
  batch: number;
  note: string;
  wide?: boolean;
  Component: ComponentType<Record<string, never>>;
};

export const LOADER_VARIANTS: Entry[] = [
  { id: "v01", name: "OrbitLoader", batch: 1, note: "Satellites on a spring-pulsed orbit", Component: OrbitLoader },
  { id: "v02", name: "BlobMorphLoader", batch: 1, note: "Elastic morphing blob", Component: BlobMorphLoader },
  { id: "v03", name: "SonarLoader", batch: 1, note: "Radar ping rings", Component: SonarLoader },
  { id: "v04", name: "CubeFlipLoader", batch: 1, note: "3D tumbling tile", Component: CubeFlipLoader },
  { id: "v05", name: "EqualizerLoader", batch: 1, note: "Staggered elastic bars", Component: EqualizerLoader },
  { id: "v06", name: "ChaseDotsLoader", batch: 1, note: "Elastic chase on a track", Component: ChaseDotsLoader },
  { id: "v07", name: "SkeletonCard", batch: 2, note: "Shimmer card placeholder", wide: true, Component: SkeletonCard },
  { id: "v08", name: "SkeletonList", batch: 2, note: "Avatar rows placeholder", wide: true, Component: SkeletonList },
  { id: "v09", name: "SkeletonArticle", batch: 2, note: "Editorial text placeholder", wide: true, Component: SkeletonArticle },
  { id: "v10", name: "SkeletonProfile", batch: 2, note: "Identity block placeholder", wide: true, Component: SkeletonProfile },
  { id: "v11", name: "SkeletonChart", batch: 2, note: "Rising bars placeholder", wide: true, Component: SkeletonChart },
  { id: "v12", name: "SkeletonMediaPlayer", batch: 2, note: "16:9 media placeholder", wide: true, Component: SkeletonMediaPlayer },
  { id: "v13", name: "SlideBarLoader", batch: 3, note: "Gliding capsule on a track", Component: SlideBarLoader },
  { id: "v14", name: "CountUpLoader", batch: 3, note: "Conic ring counting to 100", Component: CountUpLoader },
  { id: "v15", name: "LoadingButton", batch: 3, note: "Busy-state button", Component: LoadingButton },
  { id: "v16", name: "CradleLoader", batch: 3, note: "Newton's cradle springs", Component: CradleLoader },
  { id: "v17", name: "GridWaveLoader", batch: 3, note: "Diagonal pulse sweep", Component: GridWaveLoader },
  { id: "v18", name: "TypingLoader", batch: 3, note: "Chat bubble bounce", Component: TypingLoader },
  { id: "v19", name: "StackLoader", batch: 4, note: "Tiles dropping into a stack", Component: StackLoader },
  { id: "v20", name: "LiquidFillLoader", batch: 4, note: "Sloshing fill jar", Component: LiquidFillLoader },
  { id: "v21", name: "InfinityLoader", batch: 4, note: "Stroke-drawn infinity", Component: InfinityLoader },
  { id: "v22", name: "SunburstLoader", batch: 4, note: "Twelve cascading rays", Component: SunburstLoader },
  { id: "v23", name: "HeartbeatLoader", batch: 4, note: "ECG trace, live bpm", Component: HeartbeatLoader },
  { id: "v24", name: "CoinLoader", batch: 4, note: "Flipping coin, synced shadow", Component: CoinLoader },
  { id: "v25", name: "HourglassLoader", batch: 5, note: "Flipping hourglass, draining sand", Component: HourglassLoader },
  { id: "v26", name: "ConveyorLoader", batch: 5, note: "Parcels on an animated belt", wide: true, Component: ConveyorLoader },
  { id: "v27", name: "SignalLoader", batch: 5, note: "Arcs lighting in sequence", Component: SignalLoader },
  { id: "v28", name: "BounceBallLoader", batch: 5, note: "Squash-and-stretch bounce", Component: BounceBallLoader },
  { id: "v29", name: "SkeletonDashboard", batch: 5, note: "KPI + sparkline placeholder", wide: true, Component: SkeletonDashboard },
  { id: "v30", name: "SpiralLoader", batch: 5, note: "Pulse travelling a dot ring", Component: SpiralLoader },
];

export function LoadersGallery({ batch, only }: { batch?: number; only?: string }) {
  let entries = LOADER_VARIANTS;
  if (only) entries = entries.filter((e) => e.id === only.toLowerCase() || e.name.toLowerCase() === only.toLowerCase());
  else if (batch && batch >= 1 && batch <= 5) entries = entries.filter((e) => e.batch === batch);
  return (
    <div className="gu-lab">
      <header className="gu-lab-head">
        <span className="gu-lab-eyebrow">GOAT UI · Loaders &amp; Skeletons</span>
        <h1>{only ? `Variant ${only.toUpperCase()}` : batch ? `Batch ${batch} of 5` : "All 30 variants"}</h1>
        <p>
          {entries.length} variant{entries.length === 1 ? "" : "s"} · spring physics · reduced-motion aware · copy-paste
          ready
        </p>
      </header>
      <div className="gu-lab-grid">
        {entries.map((e) => (
          <section key={e.id} className={"gu-lab-cell" + (e.wide ? " wide" : "")} tabIndex={0} aria-label={`${e.id} ${e.name}`}>
            <div className="gu-lab-stage">
              <e.Component />
            </div>
            <footer className="gu-lab-meta">
              <span className="gu-lab-id">{e.id}</span>
              <span className="gu-lab-name">{e.name}</span>
              <span className="gu-lab-note">{e.note}</span>
            </footer>
          </section>
        ))}
      </div>
    </div>
  );
}
