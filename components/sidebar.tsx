"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export interface SidebarNavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  items?: SidebarNavItem[]
}

const docsConfig: SidebarNavItem[] = [
  {
    "title": "1. Foundation",
    "items": [
      {
        "title": "Button",
        "href": "/components/button",
        "disabled": false
      },
      {
        "title": "Icon Button",
        "href": "/components/icon-button",
        "disabled": true
      },
      {
        "title": "Split Button",
        "href": "/components/split-button",
        "disabled": true
      },
      {
        "title": "Loading Button",
        "href": "/components/loading-button",
        "disabled": true
      },
      {
        "title": "Floating Button",
        "href": "/components/floating-button",
        "disabled": true
      },
      {
        "title": "Social Button",
        "href": "/components/social-button",
        "disabled": true
      },
      {
        "title": "Gradient Button",
        "href": "/components/gradient-button",
        "disabled": true
      },
      {
        "title": "Magnetic Button",
        "href": "/components/magnetic-button",
        "disabled": true
      },
      {
        "title": "Ripple Button",
        "href": "/components/ripple-button",
        "disabled": true
      },
      {
        "title": "Glow Button",
        "href": "/components/glow-button",
        "disabled": true
      },
      {
        "title": "Input",
        "href": "/components/input",
        "disabled": false
      },
      {
        "title": "Textarea",
        "href": "/components/textarea",
        "disabled": true
      },
      {
        "title": "Search Input",
        "href": "/components/search-input",
        "disabled": true
      },
      {
        "title": "Password Input",
        "href": "/components/password-input",
        "disabled": true
      },
      {
        "title": "OTP Input",
        "href": "/components/otp-input",
        "disabled": true
      },
      {
        "title": "Currency Input",
        "href": "/components/currency-input",
        "disabled": true
      },
      {
        "title": "Number Input",
        "href": "/components/number-input",
        "disabled": true
      },
      {
        "title": "Phone Input",
        "href": "/components/phone-input",
        "disabled": true
      },
      {
        "title": "Email Input",
        "href": "/components/email-input",
        "disabled": true
      },
      {
        "title": "URL Input",
        "href": "/components/url-input",
        "disabled": true
      },
      {
        "title": "Checkbox",
        "href": "/components/checkbox",
        "disabled": false
      },
      {
        "title": "Radio",
        "href": "/components/radio",
        "disabled": true
      },
      {
        "title": "Toggle",
        "href": "/components/toggle",
        "disabled": true
      },
      {
        "title": "Switch",
        "href": "/components/switch",
        "disabled": true
      },
      {
        "title": "Segmented Control",
        "href": "/components/segmented-control",
        "disabled": true
      },
      {
        "title": "Multi Toggle",
        "href": "/components/multi-toggle",
        "disabled": true
      },
      {
        "title": "Badge",
        "href": "/components/badge",
        "disabled": false
      },
      {
        "title": "Chip",
        "href": "/components/chip",
        "disabled": true
      },
      {
        "title": "Tag",
        "href": "/components/tag",
        "disabled": true
      },
      {
        "title": "Status",
        "href": "/components/status",
        "disabled": true
      },
      {
        "title": "Counter",
        "href": "/components/counter",
        "disabled": true
      },
      {
        "title": "Heading",
        "href": "/components/heading",
        "disabled": true
      },
      {
        "title": "Text",
        "href": "/components/text",
        "disabled": true
      },
      {
        "title": "Link",
        "href": "/components/link",
        "disabled": true
      },
      {
        "title": "Code",
        "href": "/components/code",
        "disabled": true
      },
      {
        "title": "Blockquote",
        "href": "/components/blockquote",
        "disabled": true
      },
      {
        "title": "Highlight",
        "href": "/components/highlight",
        "disabled": true
      }
    ]
  },
  {
    "title": "2. Form Components",
    "items": [
      {
        "title": "Form",
        "href": "/components/form",
        "disabled": true
      },
      {
        "title": "Form Field",
        "href": "/components/form-field",
        "disabled": true
      },
      {
        "title": "Form Group",
        "href": "/components/form-group",
        "disabled": true
      },
      {
        "title": "Form Section",
        "href": "/components/form-section",
        "disabled": true
      },
      {
        "title": "Form Wizard",
        "href": "/components/form-wizard",
        "disabled": true
      },
      {
        "title": "Form Stepper",
        "href": "/components/form-stepper",
        "disabled": true
      },
      {
        "title": "Date Picker",
        "href": "/components/date-picker",
        "disabled": true
      },
      {
        "title": "Time Picker",
        "href": "/components/time-picker",
        "disabled": true
      },
      {
        "title": "DateTime Picker",
        "href": "/components/datetime-picker",
        "disabled": true
      },
      {
        "title": "Month Picker",
        "href": "/components/month-picker",
        "disabled": true
      },
      {
        "title": "Year Picker",
        "href": "/components/year-picker",
        "disabled": true
      },
      {
        "title": "File Upload",
        "href": "/components/file-upload",
        "disabled": true
      },
      {
        "title": "Image Upload",
        "href": "/components/image-upload",
        "disabled": true
      },
      {
        "title": "Avatar Upload",
        "href": "/components/avatar-upload",
        "disabled": true
      },
      {
        "title": "Drag Upload",
        "href": "/components/drag-upload",
        "disabled": true
      },
      {
        "title": "Multi Upload",
        "href": "/components/multi-upload",
        "disabled": true
      },
      {
        "title": "Select",
        "href": "/components/select",
        "disabled": true
      },
      {
        "title": "Multi Select",
        "href": "/components/multi-select",
        "disabled": true
      },
      {
        "title": "Async Select",
        "href": "/components/async-select",
        "disabled": true
      },
      {
        "title": "Search Select",
        "href": "/components/search-select",
        "disabled": true
      },
      {
        "title": "Tree Select",
        "href": "/components/tree-select",
        "disabled": true
      },
      {
        "title": "Password Strength",
        "href": "/components/password-strength",
        "disabled": true
      },
      {
        "title": "Validation Message",
        "href": "/components/validation-message",
        "disabled": true
      },
      {
        "title": "Error Summary",
        "href": "/components/error-summary",
        "disabled": true
      },
      {
        "title": "Success State",
        "href": "/components/success-state",
        "disabled": true
      },
      {
        "title": "AI Prompt Input",
        "href": "/components/ai-prompt-input",
        "disabled": true
      },
      {
        "title": "AI Chat Input",
        "href": "/components/ai-chat-input",
        "disabled": true
      },
      {
        "title": "AI File Input",
        "href": "/components/ai-file-input",
        "disabled": true
      },
      {
        "title": "AI Agent Input",
        "href": "/components/ai-agent-input",
        "disabled": true
      }
    ]
  },
  {
    "title": "3. Navigation",
    "items": [
      {
        "title": "Navbar",
        "href": "/components/navbar",
        "disabled": true
      },
      {
        "title": "Sidebar Nav",
        "href": "/components/sidebar-nav",
        "disabled": true
      },
      {
        "title": "Topbar",
        "href": "/components/topbar",
        "disabled": true
      },
      {
        "title": "Bottom Navigation",
        "href": "/components/bottom-navigation",
        "disabled": true
      },
      {
        "title": "Mega Menu",
        "href": "/components/mega-menu",
        "disabled": true
      },
      {
        "title": "Dropdown",
        "href": "/components/dropdown",
        "disabled": true
      },
      {
        "title": "Context Menu",
        "href": "/components/context-menu",
        "disabled": true
      },
      {
        "title": "Command Menu",
        "href": "/components/command-menu",
        "disabled": true
      },
      {
        "title": "Action Menu",
        "href": "/components/action-menu",
        "disabled": true
      },
      {
        "title": "Breadcrumb",
        "href": "/components/breadcrumb",
        "disabled": true
      },
      {
        "title": "Pagination",
        "href": "/components/pagination",
        "disabled": true
      },
      {
        "title": "Stepper",
        "href": "/components/stepper",
        "disabled": true
      },
      {
        "title": "Tabs",
        "href": "/components/tabs",
        "disabled": true
      },
      {
        "title": "Pills",
        "href": "/components/pills",
        "disabled": true
      },
      {
        "title": "Mobile Drawer",
        "href": "/components/mobile-drawer",
        "disabled": true
      },
      {
        "title": "Mobile Nav",
        "href": "/components/mobile-nav",
        "disabled": true
      },
      {
        "title": "Bottom Sheet",
        "href": "/components/bottom-sheet",
        "disabled": true
      },
      {
        "title": "Floating Menu",
        "href": "/components/floating-menu",
        "disabled": true
      }
    ]
  },
  {
    "title": "4. Layout",
    "items": [
      {
        "title": "Container",
        "href": "/components/container",
        "disabled": true
      },
      {
        "title": "Section",
        "href": "/components/section",
        "disabled": true
      },
      {
        "title": "Wrapper",
        "href": "/components/wrapper",
        "disabled": true
      },
      {
        "title": "Stack",
        "href": "/components/stack",
        "disabled": true
      },
      {
        "title": "Grid",
        "href": "/components/grid",
        "disabled": true
      },
      {
        "title": "Dashboard Layout",
        "href": "/components/dashboard-layout",
        "disabled": true
      },
      {
        "title": "SaaS Layout",
        "href": "/components/saas-layout",
        "disabled": true
      },
      {
        "title": "Admin Layout",
        "href": "/components/admin-layout",
        "disabled": true
      },
      {
        "title": "CRM Layout",
        "href": "/components/crm-layout",
        "disabled": true
      },
      {
        "title": "Landing Layout",
        "href": "/components/landing-layout",
        "disabled": true
      },
      {
        "title": "Responsive Grid",
        "href": "/components/responsive-grid",
        "disabled": true
      },
      {
        "title": "Masonry",
        "href": "/components/masonry",
        "disabled": true
      },
      {
        "title": "Bento Grid",
        "href": "/components/bento-grid",
        "disabled": true
      },
      {
        "title": "Auto Grid",
        "href": "/components/auto-grid",
        "disabled": true
      }
    ]
  },
  {
    "title": "5. Data Display",
    "items": [
      {
        "title": "Data Table",
        "href": "/components/data-table",
        "disabled": true
      },
      {
        "title": "Server Table",
        "href": "/components/server-table",
        "disabled": true
      },
      {
        "title": "Virtual Table",
        "href": "/components/virtual-table",
        "disabled": true
      },
      {
        "title": "Tree Table",
        "href": "/components/tree-table",
        "disabled": true
      },
      {
        "title": "Editable Table",
        "href": "/components/editable-table",
        "disabled": true
      },
      {
        "title": "Card",
        "href": "/components/card",
        "disabled": true
      },
      {
        "title": "Feature Card",
        "href": "/components/feature-card",
        "disabled": true
      },
      {
        "title": "Pricing Card",
        "href": "/components/pricing-card",
        "disabled": true
      },
      {
        "title": "Team Card",
        "href": "/components/team-card",
        "disabled": true
      },
      {
        "title": "Testimonial Card",
        "href": "/components/testimonial-card",
        "disabled": true
      },
      {
        "title": "Product Card",
        "href": "/components/product-card",
        "disabled": true
      },
      {
        "title": "Blog Card",
        "href": "/components/blog-card",
        "disabled": true
      },
      {
        "title": "List",
        "href": "/components/list",
        "disabled": true
      },
      {
        "title": "Timeline",
        "href": "/components/timeline",
        "disabled": true
      },
      {
        "title": "Activity Feed",
        "href": "/components/activity-feed",
        "disabled": true
      },
      {
        "title": "Kanban List",
        "href": "/components/kanban-list",
        "disabled": true
      },
      {
        "title": "Metric Card",
        "href": "/components/metric-card",
        "disabled": true
      },
      {
        "title": "KPI Card",
        "href": "/components/kpi-card",
        "disabled": true
      },
      {
        "title": "Progress Card",
        "href": "/components/progress-card",
        "disabled": true
      },
      {
        "title": "Analytics Card",
        "href": "/components/analytics-card",
        "disabled": true
      }
    ]
  },
  {
    "title": "6. Feedback",
    "items": [
      {
        "title": "Toast",
        "href": "/components/toast",
        "disabled": true
      },
      {
        "title": "Snackbar",
        "href": "/components/snackbar",
        "disabled": true
      },
      {
        "title": "Alert",
        "href": "/components/alert",
        "disabled": true
      },
      {
        "title": "Banner",
        "href": "/components/banner",
        "disabled": true
      },
      {
        "title": "Notice",
        "href": "/components/notice",
        "disabled": true
      },
      {
        "title": "Spinner",
        "href": "/components/spinner",
        "disabled": true
      },
      {
        "title": "Skeleton",
        "href": "/components/skeleton",
        "disabled": true
      },
      {
        "title": "Shimmer",
        "href": "/components/shimmer",
        "disabled": true
      },
      {
        "title": "Loader",
        "href": "/components/loader",
        "disabled": true
      },
      {
        "title": "Progress Bar",
        "href": "/components/progress-bar",
        "disabled": true
      },
      {
        "title": "Circular Progress",
        "href": "/components/circular-progress",
        "disabled": true
      },
      {
        "title": "Step Progress",
        "href": "/components/step-progress",
        "disabled": true
      },
      {
        "title": "Goal Progress",
        "href": "/components/goal-progress",
        "disabled": true
      }
    ]
  },
  {
    "title": "7. Overlay",
    "items": [
      {
        "title": "Modal",
        "href": "/components/modal",
        "disabled": true
      },
      {
        "title": "Drawer",
        "href": "/components/drawer",
        "disabled": true
      },
      {
        "title": "Sheet",
        "href": "/components/sheet",
        "disabled": true
      },
      {
        "title": "Dialog",
        "href": "/components/dialog",
        "disabled": true
      },
      {
        "title": "Popover",
        "href": "/components/popover",
        "disabled": true
      },
      {
        "title": "Tooltip",
        "href": "/components/tooltip",
        "disabled": true
      },
      {
        "title": "Hover Card",
        "href": "/components/hover-card",
        "disabled": true
      },
      {
        "title": "Context Panel",
        "href": "/components/context-panel",
        "disabled": true
      },
      {
        "title": "Confirm Dialog",
        "href": "/components/confirm-dialog",
        "disabled": true
      },
      {
        "title": "Delete Dialog",
        "href": "/components/delete-dialog",
        "disabled": true
      },
      {
        "title": "Action Dialog",
        "href": "/components/action-dialog",
        "disabled": true
      }
    ]
  },
  {
    "title": "8. Dashboard",
    "items": [
      {
        "title": "Revenue Card",
        "href": "/components/revenue-card",
        "disabled": true
      },
      {
        "title": "Sales Card",
        "href": "/components/sales-card",
        "disabled": true
      },
      {
        "title": "Users Card",
        "href": "/components/users-card",
        "disabled": true
      },
      {
        "title": "Conversion Card",
        "href": "/components/conversion-card",
        "disabled": true
      },
      {
        "title": "Line Chart",
        "href": "/components/line-chart",
        "disabled": true
      },
      {
        "title": "Area Chart",
        "href": "/components/area-chart",
        "disabled": true
      },
      {
        "title": "Pie Chart",
        "href": "/components/pie-chart",
        "disabled": true
      },
      {
        "title": "Donut Chart",
        "href": "/components/donut-chart",
        "disabled": true
      },
      {
        "title": "Radar Chart",
        "href": "/components/radar-chart",
        "disabled": true
      },
      {
        "title": "Heatmap",
        "href": "/components/heatmap",
        "disabled": true
      },
      {
        "title": "Activity Widget",
        "href": "/components/activity-widget",
        "disabled": true
      },
      {
        "title": "Calendar Widget",
        "href": "/components/calendar-widget",
        "disabled": true
      },
      {
        "title": "Tasks Widget",
        "href": "/components/tasks-widget",
        "disabled": true
      },
      {
        "title": "Team Widget",
        "href": "/components/team-widget",
        "disabled": true
      }
    ]
  },
  {
    "title": "9. AI Components",
    "items": [
      {
        "title": "Chat UI",
        "href": "/components/chat-ui",
        "disabled": true
      },
      {
        "title": "Chat Bubble",
        "href": "/components/chat-bubble",
        "disabled": true
      },
      {
        "title": "AI Message",
        "href": "/components/ai-message",
        "disabled": true
      },
      {
        "title": "User Message",
        "href": "/components/user-message",
        "disabled": true
      },
      {
        "title": "Agent Card",
        "href": "/components/agent-card",
        "disabled": true
      },
      {
        "title": "Agent Marketplace",
        "href": "/components/agent-marketplace",
        "disabled": true
      },
      {
        "title": "Agent Builder",
        "href": "/components/agent-builder",
        "disabled": true
      },
      {
        "title": "Prompt Builder",
        "href": "/components/prompt-builder",
        "disabled": true
      },
      {
        "title": "AI Playground",
        "href": "/components/ai-playground",
        "disabled": true
      },
      {
        "title": "AI Workflow",
        "href": "/components/ai-workflow",
        "disabled": true
      },
      {
        "title": "Model Selector",
        "href": "/components/model-selector",
        "disabled": true
      },
      {
        "title": "Token Viewer",
        "href": "/components/token-viewer",
        "disabled": true
      },
      {
        "title": "Prompt History",
        "href": "/components/prompt-history",
        "disabled": true
      }
    ]
  },
  {
    "title": "10. Authentication",
    "items": [
      {
        "title": "Login Form",
        "href": "/components/login-form",
        "disabled": true
      },
      {
        "title": "Register Form",
        "href": "/components/register-form",
        "disabled": true
      },
      {
        "title": "Forgot Password",
        "href": "/components/forgot-password",
        "disabled": true
      },
      {
        "title": "OTP Verify",
        "href": "/components/otp-verify",
        "disabled": true
      },
      {
        "title": "MFA Verify",
        "href": "/components/mfa-verify",
        "disabled": true
      },
      {
        "title": "Biometric Login",
        "href": "/components/biometric-login",
        "disabled": true
      },
      {
        "title": "User Profile",
        "href": "/components/user-profile",
        "disabled": true
      },
      {
        "title": "User Settings",
        "href": "/components/user-settings",
        "disabled": true
      },
      {
        "title": "Session Manager",
        "href": "/components/session-manager",
        "disabled": true
      }
    ]
  },
  {
    "title": "11. E-Commerce",
    "items": [
      {
        "title": "Product Grid",
        "href": "/components/product-grid",
        "disabled": true
      },
      {
        "title": "Product Gallery",
        "href": "/components/product-gallery",
        "disabled": true
      },
      {
        "title": "Cart",
        "href": "/components/cart",
        "disabled": true
      },
      {
        "title": "Checkout",
        "href": "/components/checkout",
        "disabled": true
      },
      {
        "title": "Wishlist",
        "href": "/components/wishlist",
        "disabled": true
      },
      {
        "title": "Compare",
        "href": "/components/compare",
        "disabled": true
      },
      {
        "title": "Payment Form",
        "href": "/components/payment-form",
        "disabled": true
      },
      {
        "title": "Billing Panel",
        "href": "/components/billing-panel",
        "disabled": true
      },
      {
        "title": "Invoice",
        "href": "/components/invoice",
        "disabled": true
      }
    ]
  },
  {
    "title": "12. Marketing",
    "items": [
      {
        "title": "Hero 1",
        "href": "/components/hero-1",
        "disabled": true
      },
      {
        "title": "Hero 2",
        "href": "/components/hero-2",
        "disabled": true
      },
      {
        "title": "Hero 3",
        "href": "/components/hero-3",
        "disabled": true
      },
      {
        "title": "Hero 4",
        "href": "/components/hero-4",
        "disabled": true
      },
      {
        "title": "Hero 5",
        "href": "/components/hero-5",
        "disabled": true
      },
      {
        "title": "Hero 6",
        "href": "/components/hero-6",
        "disabled": true
      },
      {
        "title": "Hero 7",
        "href": "/components/hero-7",
        "disabled": true
      },
      {
        "title": "Hero 8",
        "href": "/components/hero-8",
        "disabled": true
      },
      {
        "title": "Hero 9",
        "href": "/components/hero-9",
        "disabled": true
      },
      {
        "title": "Hero 10",
        "href": "/components/hero-10",
        "disabled": true
      },
      {
        "title": "Hero 11",
        "href": "/components/hero-11",
        "disabled": true
      },
      {
        "title": "Hero 12",
        "href": "/components/hero-12",
        "disabled": true
      },
      {
        "title": "Hero 13",
        "href": "/components/hero-13",
        "disabled": true
      },
      {
        "title": "Hero 14",
        "href": "/components/hero-14",
        "disabled": true
      },
      {
        "title": "Hero 15",
        "href": "/components/hero-15",
        "disabled": true
      },
      {
        "title": "Hero 16",
        "href": "/components/hero-16",
        "disabled": true
      },
      {
        "title": "Hero 17",
        "href": "/components/hero-17",
        "disabled": true
      },
      {
        "title": "Hero 18",
        "href": "/components/hero-18",
        "disabled": true
      },
      {
        "title": "Hero 19",
        "href": "/components/hero-19",
        "disabled": true
      },
      {
        "title": "Hero 20",
        "href": "/components/hero-20",
        "disabled": true
      },
      {
        "title": "CTA 1",
        "href": "/components/cta-1",
        "disabled": true
      },
      {
        "title": "CTA 2",
        "href": "/components/cta-2",
        "disabled": true
      },
      {
        "title": "CTA 3",
        "href": "/components/cta-3",
        "disabled": true
      },
      {
        "title": "CTA 4",
        "href": "/components/cta-4",
        "disabled": true
      },
      {
        "title": "CTA 5",
        "href": "/components/cta-5",
        "disabled": true
      },
      {
        "title": "CTA 6",
        "href": "/components/cta-6",
        "disabled": true
      },
      {
        "title": "CTA 7",
        "href": "/components/cta-7",
        "disabled": true
      },
      {
        "title": "CTA 8",
        "href": "/components/cta-8",
        "disabled": true
      },
      {
        "title": "CTA 9",
        "href": "/components/cta-9",
        "disabled": true
      },
      {
        "title": "CTA 10",
        "href": "/components/cta-10",
        "disabled": true
      },
      {
        "title": "CTA 11",
        "href": "/components/cta-11",
        "disabled": true
      },
      {
        "title": "CTA 12",
        "href": "/components/cta-12",
        "disabled": true
      },
      {
        "title": "CTA 13",
        "href": "/components/cta-13",
        "disabled": true
      },
      {
        "title": "CTA 14",
        "href": "/components/cta-14",
        "disabled": true
      },
      {
        "title": "CTA 15",
        "href": "/components/cta-15",
        "disabled": true
      },
      {
        "title": "CTA 16",
        "href": "/components/cta-16",
        "disabled": true
      },
      {
        "title": "CTA 17",
        "href": "/components/cta-17",
        "disabled": true
      },
      {
        "title": "CTA 18",
        "href": "/components/cta-18",
        "disabled": true
      },
      {
        "title": "CTA 19",
        "href": "/components/cta-19",
        "disabled": true
      },
      {
        "title": "CTA 20",
        "href": "/components/cta-20",
        "disabled": true
      },
      {
        "title": "Testimonial 1",
        "href": "/components/testimonial-1",
        "disabled": true
      },
      {
        "title": "Testimonial 2",
        "href": "/components/testimonial-2",
        "disabled": true
      },
      {
        "title": "Testimonial 3",
        "href": "/components/testimonial-3",
        "disabled": true
      },
      {
        "title": "Testimonial 4",
        "href": "/components/testimonial-4",
        "disabled": true
      },
      {
        "title": "Testimonial 5",
        "href": "/components/testimonial-5",
        "disabled": true
      },
      {
        "title": "Testimonial 6",
        "href": "/components/testimonial-6",
        "disabled": true
      },
      {
        "title": "Testimonial 7",
        "href": "/components/testimonial-7",
        "disabled": true
      },
      {
        "title": "Testimonial 8",
        "href": "/components/testimonial-8",
        "disabled": true
      },
      {
        "title": "Testimonial 9",
        "href": "/components/testimonial-9",
        "disabled": true
      },
      {
        "title": "Testimonial 10",
        "href": "/components/testimonial-10",
        "disabled": true
      },
      {
        "title": "Testimonial 11",
        "href": "/components/testimonial-11",
        "disabled": true
      },
      {
        "title": "Testimonial 12",
        "href": "/components/testimonial-12",
        "disabled": true
      },
      {
        "title": "Testimonial 13",
        "href": "/components/testimonial-13",
        "disabled": true
      },
      {
        "title": "Testimonial 14",
        "href": "/components/testimonial-14",
        "disabled": true
      },
      {
        "title": "Testimonial 15",
        "href": "/components/testimonial-15",
        "disabled": true
      },
      {
        "title": "Pricing 1",
        "href": "/components/pricing-1",
        "disabled": true
      },
      {
        "title": "Pricing 2",
        "href": "/components/pricing-2",
        "disabled": true
      },
      {
        "title": "Pricing 3",
        "href": "/components/pricing-3",
        "disabled": true
      },
      {
        "title": "Pricing 4",
        "href": "/components/pricing-4",
        "disabled": true
      },
      {
        "title": "Pricing 5",
        "href": "/components/pricing-5",
        "disabled": true
      },
      {
        "title": "Pricing 6",
        "href": "/components/pricing-6",
        "disabled": true
      },
      {
        "title": "Pricing 7",
        "href": "/components/pricing-7",
        "disabled": true
      },
      {
        "title": "Pricing 8",
        "href": "/components/pricing-8",
        "disabled": true
      },
      {
        "title": "Pricing 9",
        "href": "/components/pricing-9",
        "disabled": true
      },
      {
        "title": "Pricing 10",
        "href": "/components/pricing-10",
        "disabled": true
      },
      {
        "title": "Pricing 11",
        "href": "/components/pricing-11",
        "disabled": true
      },
      {
        "title": "Pricing 12",
        "href": "/components/pricing-12",
        "disabled": true
      },
      {
        "title": "Pricing 13",
        "href": "/components/pricing-13",
        "disabled": true
      },
      {
        "title": "Pricing 14",
        "href": "/components/pricing-14",
        "disabled": true
      },
      {
        "title": "Pricing 15",
        "href": "/components/pricing-15",
        "disabled": true
      },
      {
        "title": "FAQ 1",
        "href": "/components/faq-1",
        "disabled": true
      },
      {
        "title": "FAQ 2",
        "href": "/components/faq-2",
        "disabled": true
      },
      {
        "title": "FAQ 3",
        "href": "/components/faq-3",
        "disabled": true
      },
      {
        "title": "FAQ 4",
        "href": "/components/faq-4",
        "disabled": true
      },
      {
        "title": "FAQ 5",
        "href": "/components/faq-5",
        "disabled": true
      },
      {
        "title": "FAQ 6",
        "href": "/components/faq-6",
        "disabled": true
      },
      {
        "title": "FAQ 7",
        "href": "/components/faq-7",
        "disabled": true
      },
      {
        "title": "FAQ 8",
        "href": "/components/faq-8",
        "disabled": true
      },
      {
        "title": "FAQ 9",
        "href": "/components/faq-9",
        "disabled": true
      },
      {
        "title": "FAQ 10",
        "href": "/components/faq-10",
        "disabled": true
      }
    ]
  },
  {
    "title": "13. SaaS Blocks",
    "items": [
      {
        "title": "Dashboard 1",
        "href": "/components/dashboard-1",
        "disabled": true
      },
      {
        "title": "Dashboard 2",
        "href": "/components/dashboard-2",
        "disabled": true
      },
      {
        "title": "Dashboard 3",
        "href": "/components/dashboard-3",
        "disabled": true
      },
      {
        "title": "Dashboard 4",
        "href": "/components/dashboard-4",
        "disabled": true
      },
      {
        "title": "Dashboard 5",
        "href": "/components/dashboard-5",
        "disabled": true
      },
      {
        "title": "Dashboard 6",
        "href": "/components/dashboard-6",
        "disabled": true
      },
      {
        "title": "Dashboard 7",
        "href": "/components/dashboard-7",
        "disabled": true
      },
      {
        "title": "Dashboard 8",
        "href": "/components/dashboard-8",
        "disabled": true
      },
      {
        "title": "Dashboard 9",
        "href": "/components/dashboard-9",
        "disabled": true
      },
      {
        "title": "Dashboard 10",
        "href": "/components/dashboard-10",
        "disabled": true
      },
      {
        "title": "Dashboard 11",
        "href": "/components/dashboard-11",
        "disabled": true
      },
      {
        "title": "Dashboard 12",
        "href": "/components/dashboard-12",
        "disabled": true
      },
      {
        "title": "Dashboard 13",
        "href": "/components/dashboard-13",
        "disabled": true
      },
      {
        "title": "Dashboard 14",
        "href": "/components/dashboard-14",
        "disabled": true
      },
      {
        "title": "Dashboard 15",
        "href": "/components/dashboard-15",
        "disabled": true
      },
      {
        "title": "CRM 1",
        "href": "/components/crm-1",
        "disabled": true
      },
      {
        "title": "CRM 2",
        "href": "/components/crm-2",
        "disabled": true
      },
      {
        "title": "CRM 3",
        "href": "/components/crm-3",
        "disabled": true
      },
      {
        "title": "CRM 4",
        "href": "/components/crm-4",
        "disabled": true
      },
      {
        "title": "CRM 5",
        "href": "/components/crm-5",
        "disabled": true
      },
      {
        "title": "CRM 6",
        "href": "/components/crm-6",
        "disabled": true
      },
      {
        "title": "CRM 7",
        "href": "/components/crm-7",
        "disabled": true
      },
      {
        "title": "CRM 8",
        "href": "/components/crm-8",
        "disabled": true
      },
      {
        "title": "CRM 9",
        "href": "/components/crm-9",
        "disabled": true
      },
      {
        "title": "CRM 10",
        "href": "/components/crm-10",
        "disabled": true
      },
      {
        "title": "Project Board",
        "href": "/components/project-board",
        "disabled": true
      },
      {
        "title": "Sprint Board",
        "href": "/components/sprint-board",
        "disabled": true
      },
      {
        "title": "Roadmap",
        "href": "/components/roadmap",
        "disabled": true
      },
      {
        "title": "Employee Dashboard",
        "href": "/components/employee-dashboard",
        "disabled": true
      },
      {
        "title": "Attendance Dashboard",
        "href": "/components/attendance-dashboard",
        "disabled": true
      }
    ]
  },
  {
    "title": "14. Creative",
    "items": [
      {
        "title": "Cursor Follower",
        "href": "/components/cursor-follower",
        "disabled": true
      },
      {
        "title": "Spotlight",
        "href": "/components/spotlight",
        "disabled": true
      },
      {
        "title": "Gooey Menu",
        "href": "/components/gooey-menu",
        "disabled": true
      },
      {
        "title": "Particle Background",
        "href": "/components/particle-background",
        "disabled": true
      },
      {
        "title": "Mesh Gradient",
        "href": "/components/mesh-gradient",
        "disabled": true
      },
      {
        "title": "Aurora Background",
        "href": "/components/aurora-background",
        "disabled": true
      },
      {
        "title": "Noise Background",
        "href": "/components/noise-background",
        "disabled": true
      },
      {
        "title": "Grid Background",
        "href": "/components/grid-background",
        "disabled": true
      },
      {
        "title": "Liquid Card",
        "href": "/components/liquid-card",
        "disabled": true
      },
      {
        "title": "Glass Card",
        "href": "/components/glass-card",
        "disabled": true
      },
      {
        "title": "Neon Card",
        "href": "/components/neon-card",
        "disabled": true
      },
      {
        "title": "3D Card Component",
        "href": "/components/3d-card-component",
        "disabled": true
      },
      {
        "title": "Split Text",
        "href": "/components/split-text",
        "disabled": true
      },
      {
        "title": "Text Reveal",
        "href": "/components/text-reveal",
        "disabled": true
      },
      {
        "title": "Typewriter",
        "href": "/components/typewriter",
        "disabled": true
      },
      {
        "title": "Glitch Text",
        "href": "/components/glitch-text",
        "disabled": true
      },
      {
        "title": "Gradient Text",
        "href": "/components/gradient-text",
        "disabled": true
      }
    ]
  },
  {
    "title": "15. 3D",
    "items": [
      {
        "title": "3D Hero",
        "href": "/components/3d-hero",
        "disabled": true
      },
      {
        "title": "3D Card",
        "href": "/components/3d-card",
        "disabled": true
      },
      {
        "title": "3D Product Viewer",
        "href": "/components/3d-product-viewer",
        "disabled": true
      },
      {
        "title": "3D Globe",
        "href": "/components/3d-globe",
        "disabled": true
      },
      {
        "title": "Scroll Reveal",
        "href": "/components/scroll-reveal",
        "disabled": true
      },
      {
        "title": "Scroll Zoom",
        "href": "/components/scroll-zoom",
        "disabled": true
      },
      {
        "title": "Scroll Parallax",
        "href": "/components/scroll-parallax",
        "disabled": true
      },
      {
        "title": "Scroll Story",
        "href": "/components/scroll-story",
        "disabled": true
      },
      {
        "title": "Mouse Follow 3D",
        "href": "/components/mouse-follow-3d",
        "disabled": true
      },
      {
        "title": "Floating Objects",
        "href": "/components/floating-objects",
        "disabled": true
      },
      {
        "title": "Orbit Scene",
        "href": "/components/orbit-scene",
        "disabled": true
      }
    ]
  },
  {
    "title": "16. Studio",
    "items": [
      {
        "title": "Gradient Studio",
        "href": "/components/gradient-studio",
        "disabled": true
      },
      {
        "title": "Shadow Studio",
        "href": "/components/shadow-studio",
        "disabled": true
      },
      {
        "title": "Border Studio",
        "href": "/components/border-studio",
        "disabled": true
      },
      {
        "title": "Animation Studio",
        "href": "/components/animation-studio",
        "disabled": true
      },
      {
        "title": "Hero Builder",
        "href": "/components/hero-builder",
        "disabled": true
      },
      {
        "title": "Form Builder",
        "href": "/components/form-builder",
        "disabled": true
      },
      {
        "title": "Layout Builder",
        "href": "/components/layout-builder",
        "disabled": true
      },
      {
        "title": "React Export",
        "href": "/components/react-export",
        "disabled": true
      },
      {
        "title": "Next Export",
        "href": "/components/next-export",
        "disabled": true
      },
      {
        "title": "Tailwind Export",
        "href": "/components/tailwind-export",
        "disabled": true
      }
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-full space-y-4">
      {docsConfig.map((item, index) => (
        <div key={index} className="space-y-1">
          <h4 className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
            {item.title}
          </h4>
          {item.items?.length ? (
            <div className="grid grid-flow-row auto-rows-max text-sm gap-0.5">
              {item.items.map((subItem, index) => {
                const active = pathname === subItem.href;
                return (
                  <Link
                    key={index}
                    href={subItem.href || "#"}
                    className={cn(
                      "group flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition-all duration-150 relative",
                      subItem.disabled 
                        ? "cursor-not-allowed opacity-40 hover:bg-transparent"
                        : active
                          ? "font-medium text-primary bg-primary/10 hover:bg-primary/15"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    target={subItem.external ? "_blank" : ""}
                    rel={subItem.external ? "noreferrer" : ""}
                  >
                    <span className="truncate">{subItem.title}</span>
                    {subItem.disabled && (
                      <span className="text-[9px] uppercase font-semibold text-muted-foreground/70 bg-secondary/80 px-1 py-0.2 rounded border border-border tracking-wider scale-90 ml-2 shrink-0">
                        Stub
                      </span>
                    )}
                    
                    {/* Active side indicator pill */}
                    {active && (
                      <span className="absolute left-0 top-[20%] bottom-[20%] w-0.75 rounded bg-primary" />
                    )}
                  </Link>
                );
              })}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}

