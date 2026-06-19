import type { ComponentType } from "react";

/**
 * Category identifiers used across the registry.
 * These are stable slugs; human-readable labels live in {@link ./categories.ts}.
 */
export type CategoryId =
  | "foundation"
  | "forms"
  | "navigation"
  | "data-display"
  | "feedback"
  | "overlay"
  | "marketing"
  | "dashboard"
  | "utilities";

/**
 * Faceted tags used by the explorer filter chips.
 * Components may carry zero or more of these.
 */
export type Tag =
  | "new"
  | "popular"
  | "free"
  | "premium"
  | "animated"
  | "3d"
  | "dashboard"
  | "marketing";

/**
 * Raw keyword tags carried over from the original ledger.
 * Used for free-text search only (not filter chips).
 */
export interface RegistryEntry {
  /** Stable slug, also the URL hash target, e.g. "button". */
  id: string;
  /** Display name, e.g. "Buttons". */
  name: string;
  /** Category slug this entry belongs to. */
  category: CategoryId;
  /** Short marketing description shown on the card + detail header. */
  description: string;
  /** CLI install command, e.g. "npx goatui add button". */
  installCommand: string;
  /** Faceted filter tags. */
  tags: Tag[];
  /** Raw keyword tags used for free-text search. */
  keywords: string[];
  /** Live, interactive component rendered in the preview area. */
  Preview: ComponentType;
  /** Full copyable source string for the Code tab + copy button. */
  source: string;
}

/** Metadata subset of {@link RegistryEntry} — everything except the live component. */
export type RegistryMeta = Omit<RegistryEntry, "Preview">;
