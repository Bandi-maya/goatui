// Types
export interface ComponentItem {
  id: string;
  name: string;
  category: string;
  description: string;
  installationCommand: string;
  tags: string[];
}


// Categories order matching Antd layout paradigm
export const CATEGORIES = [
  "Foundation",
  "Forms",
  "Navigation",
  "Data Display",
  "Feedback",
  "Overlay",
  "Marketing",
  "Dashboard",
  "Utilities"
];

// Complete components ledger containing initial elements + expanded Antd core components
export const ALL_COMPONENTS: ComponentItem[] = [
  {
    id: "button",
    name: "Buttons",
    category: "Foundation",
    description: "Standard action triggers with variants for primary actions, secondary triggers, gradients, outlines, ghosts, loading state, and icons.",
    installationCommand: "npx goatui add button",
    tags: ["button", "trigger", "action", "click", "interactive", "form"]
  },
  {
    id: "badge",
    name: "Badges",
    category: "Foundation",
    description: "Small visual count or status tag indicating tags, status badges, counter indicators, and notifications.",
    installationCommand: "npx goatui add badge",
    tags: ["badge", "tag", "pill", "status", "counter", "label"]
  },
  {
    id: "avatar",
    name: "Avatars",
    category: "Foundation",
    description: "Circular user profile visuals with online status indicators, image profiles, and text fallback initials.",
    installationCommand: "npx goatui add avatar",
    tags: ["avatar", "user", "profile", "image", "initials", "fallback"]
  },
  {
    id: "input",
    name: "Inputs",
    category: "Forms",
    description: "Flexible text input component supporting passwords with toggling, search input icons, helper text, error messages, and validation.",
    installationCommand: "npx goatui add input",
    tags: ["input", "form", "text", "password", "email", "search", "validation"]
  },
  {
    id: "select",
    name: "Select (Dropdown Select)",
    category: "Forms",
    description: "Antd-inspired searchable single/multi dropdown selection component with active states, tag filtering, and custom clean item layouts.",
    installationCommand: "npx goatui add select",
    tags: ["select", "dropdown", "combobox", "form", "options", "choice"]
  },
  {
    id: "checkbox",
    name: "Checkboxes",
    category: "Forms",
    description: "Selection boxes for binary toggle items, list checkboxes, validation states, and disabled actions.",
    installationCommand: "npx goatui add checkbox",
    tags: ["checkbox", "check", "select", "form", "toggle", "binary"]
  },
  {
    id: "radio",
    name: "Radio Buttons",
    category: "Forms",
    description: "Selection buttons for mutually exclusive form options, radio card selectors, and horizontal/vertical configurations.",
    installationCommand: "npx goatui add radio",
    tags: ["radio", "option", "choice", "select", "form", "group"]
  },
  {
    id: "switch",
    name: "Switches",
    category: "Forms",
    description: "Toggled slider controls for settings dashboards, binary states, and preferences panels.",
    installationCommand: "npx goatui add switch",
    tags: ["switch", "toggle", "settings", "preference", "binary", "slider"]
  },
  {
    id: "slider",
    name: "Slider (Range Slider)",
    category: "Forms",
    description: "Interactive slider tool component for picking precise numerical data metrics, variable step nodes, and active percentage indicators.",
    installationCommand: "npx goatui add slider",
    tags: ["slider", "range", "track", "metric", "form", "input"]
  },
  {
    id: "upload",
    name: "Upload (File Dropzone)",
    category: "Forms",
    description: "Premium file upload area container supporting drag-and-drop mechanics, file type validation, transfer states, and progress lists.",
    installationCommand: "npx goatui add upload",
    tags: ["upload", "file", "dropzone", "attachment", "form", "drag"]
  },
  {
    id: "rating",
    name: "Ratings",
    category: "Forms",
    description: "Interactive rating score stars supporting user feedback score updates, read-only stats, and customizable hover items.",
    installationCommand: "npx goatui add rating",
    tags: ["rating", "star", "score", "feedback", "review", "interactive"]
  },
  {
    id: "navbar",
    name: "Navigation Bars",
    category: "Navigation",
    description: "Full-width site headers with logo indicators, menu navigation anchors, and glassmorphic floating frames.",
    installationCommand: "npx goatui add navbar",
    tags: ["navbar", "navigation", "header", "menu", "link", "floating"]
  },
  {
    id: "steps",
    name: "Steps (Wizard Navigation)",
    category: "Navigation",
    description: "Linear multi-step execution map pipeline indicating transaction progress paths, active step states, and item checkmarks.",
    installationCommand: "npx goatui add steps",
    tags: ["steps", "wizard", "timeline", "process", "navigation", "progress"]
  },
  {
    id: "breadcrumb",
    name: "Breadcrumbs",
    category: "Navigation",
    description: "Inline navigation maps indicating page hierarchy tree, support for chevron dividers, and custom home icon anchors.",
    installationCommand: "npx goatui add breadcrumb",
    tags: ["breadcrumb", "navigation", "path", "hierarchy", "links", "divider"]
  },
  {
    id: "pagination",
    name: "Pagination",
    category: "Navigation",
    description: "Multi-page navigation controls for search results, tables, items pages lists, and next/prev controls.",
    installationCommand: "npx goatui add pagination",
    tags: ["pagination", "page", "next", "previous", "navigation", "table"]
  },
  {
    id: "tabs",
    name: "Tabs",
    category: "Navigation",
    description: "Toggled tab navigation bars supporting underlined highlights, filled pill blocks, and animated content updates.",
    installationCommand: "npx goatui add tabs",
    tags: ["tabs", "navigation", "segment", "toggle", "content"]
  },
  {
    id: "card",
    name: "Cards",
    category: "Data Display",
    description: "General-purpose card wrappers for articles, product catalog displays, rich image cards, and glass panels.",
    installationCommand: "npx goatui add card",
    tags: ["card", "container", "panel", "box", "display", "content"]
  },
  {
    id: "statistics",
    name: "Statistics",
    category: "Data Display",
    description: "Sleek stat numbers panels displaying metric targets, positive trend ratings, negative graphs, and labels.",
    installationCommand: "npx goatui add statistics",
    tags: ["statistics", "stat", "metric", "dashboard", "number", "kpi"]
  },
  {
    id: "timeline",
    name: "Timeline (Activity Logs)",
    category: "Data Display",
    description: "Vertical stacked timeline trail displaying sequentially sorted deployment tasks, transaction history, updates, and chronological notes.",
    installationCommand: "npx goatui add timeline",
    tags: ["timeline", "activity", "logs", "history", "tracking", "display"]
  },
  {
    id: "empty",
    name: "Empty States",
    category: "Data Display",
    description: "Clean contextual placeholders signaling query fault data, blank database metrics, search misses, or filter states.",
    installationCommand: "npx goatui add empty",
    tags: ["empty", "state", "placeholder", "nodata", "null", "search"]
  },
  {
    id: "list-group",
    name: "List Groups",
    category: "Data Display",
    description: "Group structures displaying related lines list items, badges, interactive links items, and rich email list headers.",
    installationCommand: "npx goatui add list-group",
    tags: ["list", "group", "stack", "items", "menu", "selection"]
  },
  {
    id: "table",
    name: "Tables",
    category: "Data Display",
    description: "Structured layout tables for list items presenting user info columns, status pills, and interactive hover updates.",
    installationCommand: "npx goatui add table",
    tags: ["table", "grid", "data", "rows", "columns", "tabular"]
  },
  {
    id: "alert",
    name: "Alerts",
    category: "Feedback",
    description: "Status notification banners displaying warnings, info logs, critical errors, and success updates.",
    installationCommand: "npx goatui add alert",
    tags: ["alert", "status", "banner", "notification", "warning", "success"]
  },
  {
    id: "progress-bar",
    name: "Progress Bars",
    category: "Feedback",
    description: "Linear progression status indicators showing determinate fill bars, custom percentage text, and loading progress state.",
    installationCommand: "npx goatui add progress-bar",
    tags: ["progress", "bar", "status", "loading", "determinate", "percentage"]
  },
  {
    id: "spin",
    name: "Spinners (Loaders)",
    category: "Feedback",
    description: "Antd style modular full-overlay container spinners or inline looping loader graphics for explicit section data loads.",
    installationCommand: "npx goatui add spin",
    tags: ["spin", "loader", "spinner", "loading", "waiting", "async"]
  },
  {
    id: "result",
    name: "Result Panel",
    category: "Feedback",
    description: "Large operational presentation layouts notifying end users of successful checkouts, 404 router errors, or access rejections.",
    installationCommand: "npx goatui add result",
    tags: ["result", "feedback", "success", "error", "404", "statuspage"]
  },
  {
    id: "toast",
    name: "Toast Notifications",
    category: "Feedback",
    description: "Corner slide-in temporary feedback toast alerts, supports auto-dismissals, status icons, and close control widgets.",
    installationCommand: "npx goatui add toast",
    tags: ["toast", "notification", "feedback", "slide", "alert", "trigger"]
  },
  {
    id: "modal",
    name: "Modals",
    category: "Overlay",
    description: "Overlay window blocks rendering context information on top of the primary page workspace.",
    installationCommand: "npx goatui add modal",
    tags: ["modal", "dialog", "popup", "overlay", "backdrop", "window"]
  },
  {
    id: "drawer",
    name: "Drawer (Side Panels)",
    category: "Overlay",
    description: "Side-anchored modal canvas sheet panels sliding gracefully out from layout frames to display auxiliary parameters or option nodes.",
    installationCommand: "npx goatui add drawer",
    tags: ["drawer", "panel", "sheet", "overlay", "sidebar", "options"]
  },
  {
    id: "popconfirm",
    name: "Popconfirm Alerts",
    category: "Overlay",
    description: "Compact context-attached micro overlay trigger popover seeking instant user validation before carrying out destructive operations.",
    installationCommand: "npx goatui add popconfirm",
    tags: ["popconfirm", "popover", "confirmation", "tooltip", "delete", "trigger"]
  },
  {
    id: "tooltip",
    name: "Tooltips",
    category: "Overlay",
    description: "Small hovered info boxes appearing relative to anchor elements in top, bottom, left, or right alignments.",
    installationCommand: "npx goatui add tooltip",
    tags: ["tooltip", "hover", "information", "label", "popover"]
  },
  {
    id: "dropdown",
    name: "Dropdowns",
    category: "Overlay",
    description: "Hover or click interactive action panels list overlay with separating lines, icon links, and toggling.",
    installationCommand: "npx goatui add dropdown",
    tags: ["dropdown", "select", "menu", "popover", "action", "options"]
  },
  {
    id: "hero",
    name: "Hero Sections",
    category: "Marketing",
    description: "Premium conversion-focused hero blocks layout structures containing headlines, visual media frameworks, and call-to-actions.",
    installationCommand: "npx goatui add hero",
    tags: ["hero", "marketing", "banner", "headline", "landing", "page"]
  },
  {
    id: "metric-card",
    name: "Metric Cards",
    category: "Dashboard",
    description: "Dashboard widgets rendering visual counts progress indicators, team members activity feeds, and summary tasks stats.",
    installationCommand: "npx goatui add metric-card",
    tags: ["metric", "widget", "dashboard", "panel", "charts", "kpi"]
  },
  {
    id: "skeleton",
    name: "Skeleton Loaders",
    category: "Utilities",
    description: "Visual placeholder blocks displaying pulsing skeleton shapes while user components retrieve data.",
    installationCommand: "npx goatui add skeleton",
    tags: ["skeleton", "loader", "placeholder", "loading", "utilities", "shimmer"]
  }
];
