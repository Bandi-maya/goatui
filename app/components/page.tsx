"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { entryFor } from "@/components/catalog/overview-previews"
import { useTheme } from "next-themes"
import Link from "next/link"
import { glassItems } from "@/components/catalog/glass-items"
import { 
  Search, 
  Code, 
  Copy, 
  Download, 
  ChevronRight, 
  ChevronDown, 
  Settings, 
  Moon, 
  Sun,
  Monitor,
  Layout,
  Component,
  FileText,
  Layers,
  Grid,
  X,
  Check,
  Smartphone,
  Tablet,
  Monitor as Desktop,
  Zap,
  Package,
  Clock,
  Shield,
  User,
  Tag as TagIcon
} from "lucide-react"

import { componentsRegistry } from "@/lib/component-registry";

// Component metadata interface
interface ComponentMeta {
  name: string
  category: string
  component: React.ComponentType<any>
  description: string
  tags: string[]
  status: "stable" | "beta" | "experimental"
  lastUpdated: string
  props?: PropMeta[]
  variants?: string[]
  source?: string
}

interface PropMeta {
  name: string
  type: string
  default: string
  description: string
}

// Category mapping
const CATEGORY_MAP: Record<string, string> = {
  button: "Forms",
  input: "Forms",
  select: "Forms",
  checkbox: "Forms",
  radio: "Forms",
  switch: "Forms",
  card: "Layout",
  accordion: "Layout",
  tabs: "Layout",
  dialog: "Overlay",
  drawer: "Overlay",
  popover: "Overlay",
  tooltip: "Overlay",
  dropdown: "Navigation",
  breadcrumb: "Navigation",
  pagination: "Navigation",
  table: "Data Display",
  badge: "Data Display",
  avatar: "Data Display",
  progress: "Data Display",
  skeleton: "Utilities",
  spinner: "Utilities",
  alert: "Feedback",
  toast: "Feedback",
  calendar: "Forms",
  date: "Forms",
  time: "Forms",
  file: "Forms",
  upload: "Forms",
  search: "Forms",
  autocomplete: "Forms",
  combobox: "Forms",
  multi: "Forms",
  rating: "Forms",
  slider: "Forms",
  stepper: "Forms",
  steps: "Forms",
  timeline: "Data Display",
  tree: "Data Display",
  data: "Data Display",
  metric: "Data Display",
  stat: "Data Display",
  analytics: "Data Display",
  empty: "Feedback",
  notification: "Feedback",
  modal: "Overlay",
  sheet: "Overlay",
  context: "Overlay",
  command: "Overlay",
  hover: "Overlay",
  chip: "Data Display",
  tag: "Data Display",
  list: "Data Display",
  group: "Data Display",
  otp: "Forms",
  password: "Forms",
  textarea: "Forms",
  hero: "Layout",
  navbar: "Layout",
  responsive: "Layout",
  app: "Overlay",
  outline: "Utilities",
  loading: "Utilities",
  result: "Feedback",
  popconfirm: "Overlay",
  spin: "Utilities",
}

// Component descriptions
const COMPONENT_DESCRIPTIONS: Record<string, string> = {
  button: "Buttons allow users to take actions, submit forms, and trigger events.",
  input: "Input fields allow users to enter and edit text content.",
  card: "Cards contain content and actions about a single subject.",
  select: "Select allows users to choose from a list of options.",
  checkbox: "Checkboxes allow users to select one or more options from a set.",
  dialog: "Dialogs focus user attention on a specific task or piece of information.",
  tabs: "Tabs organize content into separate views that users can switch between.",
  table: "Tables display data in rows and columns for easy comparison.",
  badge: "Badges display small counts or labels.",
  avatar: "Avatars represent users or entities.",
  alert: "Alerts display important messages to users.",
  tooltip: "Tooltips display additional information when users hover over elements.",
  dropdown: "Dropdown menus display a list of actions or options.",
  accordion: "Accordions allow users to expand and collapse sections of content.",
  switch: "Switches toggle between two states, typically on/off.",
  slider: "Sliders allow users to select a value from a range.",
  progress: "Progress bars indicate the completion status of a task.",
  skeleton: "Skeleton screens show placeholder content while data loads.",
  toast: "Toasts display brief messages that appear and disappear automatically.",
  pagination: "Pagination allows users to navigate through large datasets.",
  breadcrumb: "Breadcrumbs show the user's location within a hierarchy.",
  calendar: "Calendars allow users to select dates from a calendar view.",
  file: "File inputs allow users to upload files.",
  rating: "Rating components allow users to provide feedback on a scale.",
  stepper: "Steppers guide users through multi-step processes.",
  timeline: "Timelines display events in chronological order.",
  tree: "Tree views display hierarchical data.",
  data: "Data tables display structured data with sorting and filtering.",
  metric: "Metric cards display key performance indicators.",
  stat: "Stat cards display statistics and metrics.",
  analytics: "Analytics cards display data visualizations.",
  empty: "Empty states indicate when no content is available.",
  notification: "Notifications display important alerts and messages.",
  modal: "Modals focus user attention on a specific task.",
  sheet: "Sheets slide in from the edge of the screen.",
  context: "Context menus display actions relevant to the current context.",
  command: "Command palettes allow users to quickly execute commands.",
  hover: "Hover cards display additional information on hover.",
  chip: "Chips represent entities or attributes.",
  tag: "Tags categorize and label content.",
  list: "List groups display related items.",
  group: "List groups organize related content.",
  otp: "OTP inputs allow users to enter one-time passwords.",
  password: "Password inputs allow users to enter sensitive information.",
  textarea: "Textareas allow users to enter multi-line text.",
  hero: "Hero sections introduce the main content of a page.",
  navbar: "Navbars provide navigation and branding.",
  responsive: "Responsive tabs adapt to different screen sizes.",
  app: "App modals display full-screen overlays.",
  outline: "Outline draws animated borders around elements.",
  loading: "Loading spinners indicate content is loading.",
  result: "Result cards display search or operation results.",
  popconfirm: "Pop confirms ask for confirmation before actions.",
  spin: "Spin components display loading animations.",
}



const renderComponentDemo = (Component: React.ComponentType<any>, name: string, variant: string) => {
  try {
    const nameLower = name.toLowerCase();
    
    if (nameLower === 'accordion') {
      return (
        <Component>
          <div className="p-4 border border-border rounded-lg mb-2">Accordion Trigger 1</div>
          <div className="p-4 border border-border rounded-lg">Accordion Trigger 2</div>
        </Component>
      );
    }
    if (nameLower === 'alert') {
      return <Component variant={variant}>This is an alert message!</Component>;
    }
    if (nameLower === 'breadcrumb') {
      return <Component />;
    }
    if (nameLower === 'avatar') {
      return <Component src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" fallback="JD" />;
    }
    if (nameLower === 'avatargroup') {
      return <Component max={3} />;
    }
    if (nameLower === 'badge') {
      return <Component variant={variant}>Badge</Component>;
    }
    if (nameLower === 'button') {
      return <Component variant={variant}>Button</Component>;
    }
    if (nameLower === 'card') {
      return (
        <Component className="w-[300px] p-6 border rounded-xl">
          <div className="font-bold text-lg mb-2">Card Title</div>
          <p className="text-sm text-muted-foreground">This is the card body content.</p>
        </Component>
      );
    }
    if (nameLower === 'checkbox') {
      return <Component id="checkbox-demo" label="Accept terms and conditions" />;
    }
    if (nameLower === 'chip') {
      return <Component label="Chip Label" />;
    }
    if (nameLower === 'combobox' || nameLower === 'autocomplete' || nameLower === 'select') {
      return <Component placeholder="Select option..." />;
    }
    if (nameLower === 'input' || nameLower === 'passwordinput' || nameLower === 'textarea' || nameLower === 'searchinput') {
      return <Component placeholder="Type here..." />;
    }
    if (nameLower === 'progress' || nameLower === 'progressbar') {
      return <Component value={60} className="w-[250px]" />;
    }
    if (nameLower === 'progresscircle') {
      return <Component value={75} />;
    }
    if (nameLower === 'rating') {
      return <Component value={4} />;
    }
    if (nameLower === 'slider') {
      return <Component defaultValue={[50]} max={100} step={1} className="w-[250px]" />;
    }
    if (nameLower === 'switch') {
      return <Component id="switch-demo" label="Toggle Option" />;
    }
    if (nameLower === 'tab' || nameLower === 'tabs' || nameLower === 'responsivetabs') {
      return <Component />;
    }
    if (nameLower === 'tag') {
      return <Component>Tag text</Component>;
    }
    if (nameLower === 'toast') {
      return <Component message="This is a toast notification!" />;
    }
    if (nameLower === 'timeline') {
      return <Component />;
    }
    if (nameLower === 'steps' || nameLower === 'stepper') {
      return <Component currentStep={1} steps={['Step 1', 'Step 2', 'Step 3']} />;
    }
    if (nameLower === 'loadingspinner' || nameLower === 'spin') {
      return <Component />;
    }
    if (nameLower === 'skeleton') {
      return <Component className="h-6 w-[200px]" />;
    }
    if (nameLower === 'navbar') {
      return <Component />;
    }
    if (nameLower === 'hero') {
      return <Component />;
    }
    
    return <Component variant={variant}>Demo content</Component>;
  } catch (err) {
    console.error(`Error rendering component ${name}:`, err);
    return <div className="text-destructive font-mono text-xs">Failed to render {name}: {String(err)}</div>;
  }
}

export default function ComponentsExplorer() {
  const { theme, setTheme } = useTheme()
  const [components, setComponents] = useState<ComponentMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedComponent, setSelectedComponent] = useState<ComponentMeta | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [showCode, setShowCode] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState("default")
  const [viewportSize, setViewportSize] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [commandMenuOpen, setCommandMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  // Load components on mount
  useEffect(() => {
    const loaded = componentsRegistry.map(c => {
      const lowerName = c.name.toLowerCase();
      const description = COMPONENT_DESCRIPTIONS[lowerName] || `${c.name} component.`;
      return {
        name: c.name,
        category: c.category,
        component: c.component,
        description,
        tags: [c.category.toLowerCase(), "ui", "goat-ui"],
        status: "stable" as const,
        lastUpdated: "2026-06-20",
        source: c.source
      };
    });
    setComponents(loaded)
    setExpandedCategories(new Set(Array.from(new Set(loaded.map(c => c.category)))))
    setLoading(false)
  }, [])

  // Get unique categories
  const CATEGORIES = Array.from(new Set(components.map(c => c.category))).sort()

  // Filter components
  const filteredComponents = useMemo(() => {
    return components.filter((component: ComponentMeta) => {
      const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           component.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           component.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory === "All" || component.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory, components])

  // Group components by category
  const groupedComponents = useMemo(() => {
    const groups: Record<string, ComponentMeta[]> = {}
    filteredComponents.forEach((component: ComponentMeta) => {
      if (!groups[component.category]) {
        groups[component.category] = []
      }
      groups[component.category].push(component)
    })
    return groups
  }, [filteredComponents])

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  // Select component
  const selectComponent = (component: ComponentMeta) => {
    setSelectedComponent(component)
    setSelectedVariant("default")
    setShowCode(false)
  }

  // Copy code to clipboard
  const copyCode = useCallback(() => {
    if (!selectedComponent) return
    
    const code = `import { ${selectedComponent.name} } from "@/components/ui/${selectedComponent.name.toLowerCase()}"

export default function Example() {
  return (
    <${selectedComponent.name}>
      Example
    </${selectedComponent.name}>
  )
}`
    
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [selectedComponent])

  // Download code
  const downloadCode = useCallback(() => {
    if (!selectedComponent) return
    
    const code = `import { ${selectedComponent.name} } from "@/components/ui/${selectedComponent.name.toLowerCase()}"

export default function Example() {
  return (
    <${selectedComponent.name}>
      Example
    </${selectedComponent.name}>
  )
}`
    
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${selectedComponent.name.toLowerCase()}-example.tsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [selectedComponent])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setCommandMenuOpen(true)
      }
      if (e.key === "Escape") {
        setCommandMenuOpen(false)
      }
    }
    
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Viewport size classes
  const viewportClasses = {
    desktop: "w-full",
    tablet: "max-w-[768px] mx-auto",
    mobile: "max-w-[375px] mx-auto",
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-[280px] border-r border-border bg-card flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex items-center gap-3" aria-label="Back to home">
            {/* old logo tile: <div className="w-10 h-10 rounded-xl bg-primary ..."><Component .../></div> */}
            <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-border flex items-center justify-center">
              <img src="/goat-red/assets/goat-logo.png" alt="" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-wide">GOAT UI</h1>
              <p className="text-xs text-muted-foreground">v0.1.0</p>
            </div>
          </Link>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs bg-muted rounded">⌘K</kbd>
          </div>
        </div>

        {/* Categories */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="space-y-0.5">
            <p className="px-3 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Categories</p>
            {[["All", components.length] as [string, number], ...CATEGORIES.map(c => [c, components.filter(x => x.category === c).length] as [string, number])].map(([cat, n]) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === cat ? "bg-muted font-semibold text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2">
                  {React.createElement(cat === "All" ? Grid : entryFor((components.find(x => x.category === cat) || { name: "" }).name).icon, { className: "w-4 h-4" })}
                  {cat === "All" ? "All components" : cat}
                </span>
                <span className="text-xs opacity-60">{n}</span>
              </button>
            ))}
          </div>
          {/* old nested tree sidebar (disabled):
          <div className="space-y-1">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === "All" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              <span>All Components</span>
              <span className="text-xs opacity-60">{components.length}</span>
            </button>
            
            {CATEGORIES.map(category => (
              <div key={category}>
                <button
                  onClick={() => toggleCategory(category)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {expandedCategories.has(category) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                    <span>{category}</span>
                  </div>
                  <span className="text-xs opacity-60">
                    {groupedComponents[category]?.length || 0}
                  </span>
                </button>
                
                <AnimatePresence>
                  {expandedCategories.has(category) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="ml-4 space-y-1 overflow-hidden"
                    >
                      {(groupedComponents[category] || []).map(component => (
                        <button
                          key={component.name}
                          onClick={() => selectComponent(component)}
                          className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                            selectedComponent?.name === component.name 
                              ? "bg-primary/20 text-primary" 
                              : "hover:bg-muted text-muted-foreground"
                          }`}
                        >
                          { /* old generic icon: <Component className="w-3.5 h-3.5" /> * /}
                          {React.createElement(entryFor(component.name).icon, { className: "w-3.5 h-3.5" })}
                          <span>{component.name}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
          */}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-border space-y-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Center Content */}
      <main className="flex-1 overflow-y-auto">
        {!selectedComponent ? (
          <div className="p-8">
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-2">Components</h2>
                <p className="text-muted-foreground">
                  Explore {components.length} production-ready UI components for your next project.
                </p>
              </div>
              <div className="mb-6 flex flex-wrap items-center gap-2">
                {["All", ...CATEGORIES].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      selectedCategory === cat ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                <span className="ml-auto text-xs text-muted-foreground">{filteredComponents.length} results</span>
              </div>

              {/* Liquid glass items (own engine, previews are scaled live renders) */}
              {selectedCategory === "All" && searchQuery === "" && (
                <div className="mb-10">
                  <div className="mb-3 flex items-baseline justify-between">
                    <h3 className="text-lg font-semibold">Liquid glass</h3>
                    <Link href="/glass" className="text-xs text-muted-foreground hover:text-foreground">View all →</Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {glassItems.map((g) => (
                      <Link key={g.id} href={`/glass#${g.id}`} className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                        <div className="relative h-44 overflow-hidden border-b border-border bg-muted/30">
                          <iframe src={`/goat-glass/${g.id}.html`} title={g.name} loading="lazy" tabIndex={-1} className="pointer-events-none absolute left-1/2 top-0 origin-top border-0" style={{ width: 800, height: 600, transform: "translateX(-50%) scale(0.5)", marginTop: -62 }} />
                          <div className="absolute inset-0 flex items-end justify-between gap-2 bg-gradient-to-t from-background/80 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            <span className="rounded-md bg-foreground px-3 py-1.5 text-xs font-semibold text-background">Open</span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold leading-tight">{g.name}</h3>
                          <p className="truncate text-xs text-muted-foreground">{g.blurb}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Component Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {loading ? (
                  <div className="col-span-full text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="mt-4 text-muted-foreground">Loading components...</p>
                  </div>
                ) : filteredComponents.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No components found matching your search.</p>
                  </div>
                ) : (
                  filteredComponents.map((component: ComponentMeta) => (
                    /* old plain card (generic icon):
                    <motion.div
                      key={component.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -4 }}
                      onClick={() => selectComponent(component)}
                      className="group p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 cursor-pointer transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Component className="w-6 h-6 text-primary" />
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          component.status === "stable" 
                            ? "bg-green-500/10 text-green-500" 
                            : "bg-yellow-500/10 text-yellow-500"
                        }`}>
                          {component.status}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{component.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {component.description}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {component.tags.map((tag: string) => (
                          <span key={tag} className="px-2 py-0.5 text-xs bg-muted rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                    */
                    <motion.div
                      key={component.name}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -3 }}
                      onClick={() => selectComponent(component)}
                      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 cursor-pointer transition-all duration-300"
                    >
                      <div className="relative">
                        <div className="flex h-44 items-center justify-center overflow-hidden border-b border-border bg-muted/30 p-4 pointer-events-none select-none transition-transform duration-300 group-hover:scale-[1.03]">
                          {entryFor(component.name).preview}
                        </div>
                        <div className="absolute inset-0 flex items-end justify-between gap-2 bg-gradient-to-t from-background/80 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          <span className="rounded-md bg-foreground px-3 py-1.5 text-xs font-semibold text-background">Open</span>
                          <span
                            role="button"
                            onClick={(e) => { e.stopPropagation(); navigator.clipboard?.writeText(`import { ${component.name} } from "@/components/ui/${component.name.toLowerCase()}"`) }}
                            className="flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                          >
                            <Copy className="h-3 w-3" /> Copy import
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          {React.createElement(entryFor(component.name).icon, { className: "h-4 w-4" })}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold leading-tight">{component.name}</h3>
                          <p className="truncate text-xs text-muted-foreground">{entryFor(component.name).blurb}</p>
                        </div>
                        <span className="ml-auto shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{component.category}</span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              {/* Component Header */}
              <div className="mb-8">
                <button
                  onClick={() => setSelectedComponent(null)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 rotate-[-90deg]" />
                  Back to Components
                </button>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{selectedComponent?.name}</h2>
                    <p className="text-muted-foreground">{selectedComponent?.description}</p>
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    selectedComponent?.status === "stable" 
                      ? "bg-green-500/10 text-green-500" 
                      : "bg-yellow-500/10 text-yellow-500"
                  }`}>
                    {selectedComponent?.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedComponent?.tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-1 text-sm bg-muted rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Variant Showcase */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Variants</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {(selectedComponent?.variants || ["default", "secondary", "outline", "ghost"]).map((variant: string) => (
                    <button
                      key={variant}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                        selectedVariant === variant
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border hover:border-primary/50"
                      }`}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Live Preview</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewportSize("desktop")}
                      className={`p-2 rounded-lg transition-colors ${
                        viewportSize === "desktop" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                    >
                      <Desktop className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewportSize("tablet")}
                      className={`p-2 rounded-lg transition-colors ${
                        viewportSize === "tablet" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                    >
                      <Tablet className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewportSize("mobile")}
                      className={`p-2 rounded-lg transition-colors ${
                        viewportSize === "mobile" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className={`p-8 rounded-xl border border-border bg-card ${viewportClasses[viewportSize]} transition-all duration-300`}>
                  <div className="flex items-center justify-center min-h-[200px] w-full overflow-auto">
                    {selectedComponent && renderComponentDemo(selectedComponent.component, selectedComponent.name, selectedVariant)}
                  </div>
                </div>
              </div>

              {/* Code Playground */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Code</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowCode(!showCode)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors text-sm"
                    >
                      <Code className="w-4 h-4" />
                      {showCode ? "Hide Code" : "Show Code"}
                    </button>
                    <button
                      onClick={copyCode}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors text-sm"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                    <button
                      onClick={downloadCode}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
                
                <AnimatePresence>
                  {showCode && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 rounded-xl bg-muted/50 border border-border">
                        <pre className="text-sm overflow-x-auto">
                          <code>{`import { ${selectedComponent?.name} } from "@/components/ui/${selectedComponent?.name.toLowerCase()}"

export default function Example() {
  return (
    <${selectedComponent?.name} variant="${selectedVariant}">
      Example
    </${selectedComponent?.name}>
  )
}`}</code>
                        </pre>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Right Properties Panel */}
      {selectedComponent && (
        <aside className="w-[320px] border-l border-border bg-card overflow-y-auto">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-6">Properties</h3>
            
            {/* Metadata */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Name</span>
                <span className="text-sm font-medium">{selectedComponent?.name}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Category</span>
                <span className="text-sm font-medium">{selectedComponent?.category}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className={`text-sm font-medium ${
                  selectedComponent?.status === "stable" ? "text-green-500" : "text-yellow-500"
                }`}>
                  {selectedComponent?.status}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="text-sm font-medium">
                  {selectedComponent?.lastUpdated ? new Date(selectedComponent.lastUpdated).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>

            {/* Props */}
            <div className="mb-8">
              <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <TagIcon className="w-4 h-4" />
                Props
              </h4>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-mono font-medium">variant</span>
                    <span className="text-xs text-muted-foreground">string</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Component style variant</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-mono font-medium">size</span>
                    <span className="text-xs text-muted-foreground">string</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Component size</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-mono font-medium">disabled</span>
                    <span className="text-xs text-muted-foreground">boolean</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Disable interaction</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-mono font-medium">className</span>
                    <span className="text-xs text-muted-foreground">string</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Additional CSS classes</p>
                </div>
              </div>
            </div>

            {/* Accessibility */}
            <div>
              <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Accessibility
              </h4>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">
                  This component follows WAI-ARIA best practices and is fully keyboard accessible.
                </p>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Command Menu */}
      <AnimatePresence>
        {commandMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={() => setCommandMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search components, variants, props..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-sm"
                    autoFocus
                  />
                  <kbd className="px-2 py-1 text-xs bg-muted rounded">ESC</kbd>
                </div>
              </div>
              <div className="max-h-[400px] overflow-y-auto p-2">
                {filteredComponents.slice(0, 10).map(component => (
                  <button
                    key={component.name}
                    onClick={() => {
                      selectComponent(component)
                      setCommandMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <Component className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{component.name}</div>
                      <div className="text-xs text-muted-foreground">{component.category}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
