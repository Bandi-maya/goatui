import type { CategoryId } from "./component-types";

export interface Category {
  id: CategoryId;
  label: string;
}

/**
 * Ordered list of categories shown in the sidebar.
 * Order here is the order rendered in the UI.
 */
export const CATEGORIES: Category[] = [
  { id: "foundation", label: "Foundation" },
  { id: "forms", label: "Forms" },
  { id: "navigation", label: "Navigation" },
  { id: "data-display", label: "Data Display" },
  { id: "feedback", label: "Feedback" },
  { id: "overlay", label: "Overlay" },
  { id: "marketing", label: "Marketing" },
  { id: "dashboard", label: "Dashboard" },
  { id: "utilities", label: "Utilities" },
];

export const CATEGORY_MAP: Record<CategoryId, Category> = CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat.id] = cat;
    return acc;
  },
  {} as Record<CategoryId, Category>
);

export function getCategoryLabel(id: CategoryId): string {
  return CATEGORY_MAP[id]?.label ?? id;
}
