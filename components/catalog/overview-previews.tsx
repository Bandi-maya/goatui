import * as React from "react"
import {
  AppWindow, KeyRound, PanelTop, ChevronsUpDown, CircleAlert, ChartColumn, TextCursorInput, Users, User, Tag,
  ChevronRight, MousePointerClick, CalendarDays, Square, SquareCheck, ListFilter, Command, MousePointer2, Table2,
  MessageSquare, PanelRight, Menu, Inbox, Upload, Sparkles, Eye, List, Loader, Gauge, Bell, Hash, Layers, Circle,
  CircleDot, Star, CircleCheck, Search, SlidersHorizontal, Footprints, ToggleLeft, Rows3, Type, AlignLeft, Clock,
  GitCommitVertical, Info, FolderTree, CloudUpload, Activity, LayoutDashboard, Minus, CircleHelp, Flag, Tags,
} from "lucide-react"

// Own mini mockups used by the components overview gallery. Static markup only, theme tokens only.

type Entry = { icon: React.ComponentType<{ className?: string }>; blurb: string; preview: React.ReactNode }

const bar = (w: string, c = "bg-muted-foreground/25") => <div className={`h-2 rounded-full ${c}`} style={{ width: w }} />
const pill = (t: string, c = "bg-primary/15 text-primary") => (
  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${c}`}>{t}</span>
)
const field = (t: string, w = "w-44", extra = "") => (
  <div className={`flex h-8 ${w} items-center rounded-md border border-border bg-background px-2.5 text-[11px] text-muted-foreground ${extra}`}>{t}</div>
)
const btn = (t: string, v: "p" | "o" | "g" = "p") => (
  <span
    className={`rounded-md px-3 py-1.5 text-[11px] font-semibold ${
      v === "p" ? "bg-primary text-primary-foreground" : v === "o" ? "border border-border text-foreground" : "text-muted-foreground"
    }`}
  >
    {t}
  </span>
)
const panel = (children: React.ReactNode, w = "w-48") => (
  <div className={`${w} rounded-lg border border-border bg-card p-3 shadow-sm`}>{children}</div>
)
const dot = (c: string) => <span className={`h-2 w-2 rounded-full ${c}`} />
const avatar = (t: string, c: string, ml = "") => (
  <span className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-card text-[10px] font-bold text-white ${c} ${ml}`}>{t}</span>
)
const row = (t: string, right?: React.ReactNode, active = false) => (
  <div className={`flex items-center justify-between rounded px-2 py-1 text-[11px] ${active ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>
    <span>{t}</span>
    {right}
  </div>
)
const check = (on: boolean, t: string, round = false) => (
  <div className="flex items-center gap-2 text-[11px] text-foreground">
    <span
      className={`flex h-4 w-4 items-center justify-center border ${round ? "rounded-full" : "rounded"} ${on ? "border-primary bg-primary" : "border-border"}`}
    >
      {on && (round ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : <span className="text-[9px] leading-none text-white">✓</span>)}
    </span>
    {t}
  </div>
)
const ring = (p: number, size = 56) => {
  const r = size / 2 - 5
  const c = 2 * Math.PI * r
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth="5" className="stroke-muted" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth="5" strokeLinecap="round"
        className="stroke-primary" strokeDasharray={`${(c * p) / 100} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="54%" textAnchor="middle" className="fill-foreground text-[11px] font-bold">{p}%</text>
    </svg>
  )
}
const spark = (
  <svg width="120" height="34" viewBox="0 0 120 34" fill="none" className="stroke-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 28 L20 20 L38 24 L58 10 L78 16 L98 6 L118 12" />
  </svg>
)
const bars = (
  <div className="flex h-12 items-end gap-1.5">
    {[40, 65, 50, 85, 60, 95].map((h, i) => (
      <div key={i} className="w-3 rounded-t bg-primary/70" style={{ height: `${h}%` }} />
    ))}
  </div>
)
const modalBox = (title: string, body: string, w = "w-52") => (
  <div className="rounded-xl bg-black/10 p-4 dark:bg-white/5">
    <div className={`${w} rounded-lg border border-border bg-card p-3 shadow-lg`}>
      <div className="mb-1 text-[11px] font-bold text-foreground">{title}</div>
      <div className="mb-3 text-[10px] text-muted-foreground">{body}</div>
      <div className="flex justify-end gap-2">{btn("Cancel", "o")}{btn("OK")}</div>
    </div>
  </div>
)

export const overview: Record<string, Entry> = {
  AppModal: { icon: AppWindow, blurb: "Centered modal with backdrop and actions.", preview: modalBox("Confirm", "Save your changes?") },
  Modal: { icon: AppWindow, blurb: "Focused dialog layered above the page.", preview: modalBox("Invite team", "Send invites to 3 people.") },
  Dialog: { icon: MessageSquare, blurb: "Short dialog that asks for one decision.", preview: modalBox("Delete file?", "This cannot be undone.") },
  PasswordInput: { icon: KeyRound, blurb: "Input with a show and hide toggle.", preview: field("••••••••••  👁", "w-48") },
  ResponsiveTabs: { icon: PanelTop, blurb: "Tabs that collapse on narrow screens.", preview: (
    <div className="flex gap-1 rounded-lg bg-muted p-1 text-[11px] font-semibold">
      <span className="rounded-md bg-card px-3 py-1 text-foreground shadow-sm">Overview</span>
      <span className="px-3 py-1 text-muted-foreground">Usage</span>
      <span className="px-3 py-1 text-muted-foreground">More</span>
    </div>
  ) },
  Tabs: { icon: PanelTop, blurb: "Switch between views in the same space.", preview: (
    <div className="w-52">
      <div className="flex gap-4 border-b border-border text-[11px] font-semibold">
        <span className="border-b-2 border-primary pb-1.5 text-primary">Account</span>
        <span className="pb-1.5 text-muted-foreground">Billing</span>
        <span className="pb-1.5 text-muted-foreground">Team</span>
      </div>
      <div className="mt-3 space-y-1.5">{bar("90%")}{bar("65%")}</div>
    </div>
  ) },
  Accordion: { icon: Rows3, blurb: "Stacked sections that expand one at a time.", preview: panel(
    <div className="space-y-1">
      <div className="flex justify-between text-[11px] font-semibold text-foreground"><span>Shipping</span><span>−</span></div>
      <div className="pb-1 text-[10px] text-muted-foreground">Orders leave in 2 days.</div>
      <div className="flex justify-between border-t border-border pt-1.5 text-[11px] text-muted-foreground"><span>Returns</span><span>+</span></div>
      <div className="flex justify-between border-t border-border pt-1.5 text-[11px] text-muted-foreground"><span>Warranty</span><span>+</span></div>
    </div>, "w-52") },
  Alert: { icon: CircleAlert, blurb: "Inline message for status and warnings.", preview: (
    <div className="flex w-56 items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-[11px] font-medium text-foreground">
      <Info className="h-4 w-4 text-primary" /> Your trial ends in 3 days.
    </div>
  ) },
  AnalyticsCard: { icon: ChartColumn, blurb: "Card with a headline number and a trend line.", preview: panel(
    <>
      <div className="text-[10px] text-muted-foreground">Visitors</div>
      <div className="mb-1 flex items-baseline gap-2"><span className="text-lg font-bold text-foreground">12.4k</span><span className="text-[10px] font-semibold text-emerald-500">+8%</span></div>
      {spark}
    </>, "w-48") },
  Autocomplete: { icon: TextCursorInput, blurb: "Text input that suggests matching options.", preview: (
    <div className="w-48 space-y-1">
      {field("Ber", "w-full", "border-primary text-foreground")}
      <div className="rounded-md border border-border bg-card p-1 shadow-sm">{row("Berlin", undefined, true)}{row("Bergen")}{row("Bern")}</div>
    </div>
  ) },
  Combobox: { icon: ChevronsUpDown, blurb: "Searchable select with a typed filter.", preview: (
    <div className="w-48 space-y-1">
      {field("Select framework…  ⌄", "w-full")}
      <div className="rounded-md border border-border bg-card p-1 shadow-sm">{row("Next.js", <span>✓</span>, true)}{row("Remix")}{row("Astro")}</div>
    </div>
  ) },
  Select: { icon: ChevronsUpDown, blurb: "Pick one value from a short list.", preview: (
    <div className="w-44 space-y-1">
      {field("Medium  ⌄", "w-full")}
      <div className="rounded-md border border-border bg-card p-1 shadow-sm">{row("Small")}{row("Medium", undefined, true)}{row("Large")}</div>
    </div>
  ) },
  MultiSelect: { icon: ListFilter, blurb: "Select several values shown as chips.", preview: (
    <div className="w-52 rounded-md border border-border bg-background p-1.5">
      <div className="flex flex-wrap gap-1">{pill("Design ×")}{pill("Code ×")}{pill("Docs ×")}</div>
    </div>
  ) },
  AvatarGroup: { icon: Users, blurb: "Overlapping avatars with a +N counter.", preview: (
    <div className="flex">
      {avatar("AK", "bg-blue-500")}{avatar("MJ", "bg-emerald-500", "-ml-2")}{avatar("SR", "bg-amber-500", "-ml-2")}
      <span className="-ml-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-bold text-muted-foreground">+4</span>
    </div>
  ) },
  Avatar: { icon: User, blurb: "User image or initials in a circle.", preview: (
    <div className="flex items-center gap-3">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">JD</span>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">AB</span>
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">K</span>
    </div>
  ) },
  Badge: { icon: Tag, blurb: "Small status label or counter.", preview: (
    <div className="flex items-center gap-2">{pill("New")}{pill("Beta", "bg-amber-500/15 text-amber-500")}{pill("Live", "bg-emerald-500/15 text-emerald-500")}</div>
  ) },
  Chip: { icon: Tags, blurb: "Compact removable token.", preview: (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground">Design <span className="text-muted-foreground">×</span></span>
      <span className="flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground">Selected</span>
    </div>
  ) },
  Tag: { icon: Hash, blurb: "Keyword label for grouping content.", preview: (
    <div className="flex items-center gap-1.5">
      {["react", "ui", "tailwind"].map((t) => <span key={t} className="rounded border border-border bg-muted/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">#{t}</span>)}
    </div>
  ) },
  Breadcrumb: { icon: ChevronRight, blurb: "Shows where you are in a hierarchy.", preview: (
    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">Home <ChevronRight className="h-3 w-3" /> Docs <ChevronRight className="h-3 w-3" /><span className="font-semibold text-foreground">Button</span></div>
  ) },
  Button: { icon: MousePointerClick, blurb: "Primary action trigger in several styles.", preview: <div className="flex items-center gap-2">{btn("Primary")}{btn("Outline", "o")}{btn("Ghost", "g")}</div> },
  Calendar: { icon: CalendarDays, blurb: "Month grid for choosing dates.", preview: panel(
    <>
      <div className="mb-1.5 flex justify-between text-[10px] font-bold text-foreground"><span>‹</span><span>June 2026</span><span>›</span></div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-[9px] text-muted-foreground">
        {Array.from({ length: 21 }, (_, i) => <span key={i} className={`rounded py-0.5 ${i === 9 ? "bg-primary font-bold text-primary-foreground" : ""}`}>{i + 1}</span>)}
      </div>
    </>, "w-44") },
  DatePicker: { icon: CalendarDays, blurb: "Input that opens a calendar popup.", preview: (
    <div className="space-y-1">{field("12 Jun 2026   📅", "w-44")}<div className="w-44 rounded-md border border-border bg-card p-2 shadow-sm"><div className="grid grid-cols-7 gap-0.5 text-center text-[8px] text-muted-foreground">{Array.from({ length: 14 }, (_, i) => <span key={i} className={i === 11 ? "rounded bg-primary text-primary-foreground" : ""}>{i + 1}</span>)}</div></div></div>
  ) },
  TimePicker: { icon: Clock, blurb: "Choose hours and minutes.", preview: (
    <div className="flex items-center gap-1.5">
      <div className="rounded-md border border-border bg-background px-3 py-1.5 text-sm font-bold text-foreground">09</div><span className="font-bold text-muted-foreground">:</span>
      <div className="rounded-md border border-primary bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">30</div>
      <div className="ml-1 rounded-md bg-muted px-2 py-1 text-[10px] font-bold text-muted-foreground">AM</div>
    </div>
  ) },
  Card: { icon: Square, blurb: "Container for related content and actions.", preview: panel(<><div className="mb-2 h-14 rounded-md bg-primary/15" /><div className="text-[11px] font-bold text-foreground">Project Atlas</div><div className="mb-2 text-[10px] text-muted-foreground">Updated 2 hours ago</div>{btn("Open")}</>, "w-44") },
  Checkbox: { icon: SquareCheck, blurb: "Toggle one or many options.", preview: <div className="space-y-2">{check(true, "Accept terms")}{check(false, "Send me updates")}</div> },
  Radio: { icon: CircleDot, blurb: "Single choice with a round control.", preview: <div className="space-y-2">{check(true, "Monthly", true)}{check(false, "Yearly", true)}</div> },
  RadioGroup: { icon: CircleDot, blurb: "Group of exclusive options.", preview: panel(<div className="space-y-2">{check(false, "Starter", true)}{check(true, "Pro", true)}{check(false, "Team", true)}</div>, "w-40") },
  Switch: { icon: ToggleLeft, blurb: "Instant on and off toggle.", preview: (
    <div className="space-y-2.5">{[true, false].map((on, i) => (
      <div key={i} className="flex items-center gap-2 text-[11px] text-foreground">
        <span className={`flex h-5 w-9 items-center rounded-full p-0.5 ${on ? "justify-end bg-primary" : "bg-muted"}`}><span className="h-4 w-4 rounded-full bg-white shadow" /></span>
        {on ? "Notifications" : "Dark mode"}
      </div>
    ))}</div>
  ) },
  CommandMenu: { icon: Command, blurb: "Keyboard palette to find and run actions.", preview: (
    <div className="w-52 rounded-lg border border-border bg-card shadow-md">
      <div className="flex items-center gap-2 border-b border-border px-2.5 py-2 text-[11px] text-muted-foreground"><Search className="h-3 w-3" />Type a command…</div>
      <div className="p-1">{row("New project", <kbd className="text-[9px]">⌘N</kbd>, true)}{row("Open settings", <kbd className="text-[9px]">⌘,</kbd>)}</div>
    </div>
  ) },
  ContextMenu: { icon: MousePointer2, blurb: "Menu shown on right click.", preview: (
    <div className="w-36 rounded-lg border border-border bg-card p-1 shadow-md">{row("Copy")}{row("Rename", undefined, true)}{row("Share")}<div className="my-1 border-t border-border" />{row("Delete")}</div>
  ) },
  DropdownMenu: { icon: Menu, blurb: "Actions list opened from a button.", preview: (
    <div className="space-y-1">{btn("Options ⌄", "o")}<div className="w-36 rounded-lg border border-border bg-card p-1 shadow-md">{row("Profile")}{row("Billing", undefined, true)}{row("Sign out")}</div></div>
  ) },
  Dropdown: { icon: Menu, blurb: "Floating list attached to a trigger.", preview: (
    <div className="space-y-1">{btn("Menu ⌄", "o")}<div className="w-36 rounded-lg border border-border bg-card p-1 shadow-md">{row("Edit", undefined, true)}{row("Duplicate")}{row("Archive")}</div></div>
  ) },
  DataTable: { icon: Table2, blurb: "Sortable table with rows and status.", preview: (
    <div className="w-56 overflow-hidden rounded-lg border border-border bg-card text-[10px]">
      <div className="grid grid-cols-3 bg-muted/60 px-2 py-1 font-bold text-muted-foreground"><span>Name</span><span>Role</span><span>Status</span></div>
      {[["Ana", "Admin", "Active"], ["Ben", "Editor", "Away"], ["Cy", "Viewer", "Active"]].map((r) => (
        <div key={r[0]} className="grid grid-cols-3 border-t border-border px-2 py-1 text-foreground"><span>{r[0]}</span><span className="text-muted-foreground">{r[1]}</span><span className={r[2] === "Active" ? "text-emerald-500" : "text-amber-500"}>{r[2]}</span></div>
      ))}
    </div>
  ) },
  Table: { icon: Table2, blurb: "Plain table for rows and columns.", preview: (
    <div className="w-52 overflow-hidden rounded-lg border border-border bg-card text-[10px]">
      <div className="grid grid-cols-2 bg-muted/60 px-2 py-1 font-bold text-muted-foreground"><span>Item</span><span className="text-right">Price</span></div>
      {[["Notebook", "$12"], ["Pen set", "$8"], ["Folder", "$5"]].map((r) => (
        <div key={r[0]} className="grid grid-cols-2 border-t border-border px-2 py-1 text-foreground"><span>{r[0]}</span><span className="text-right">{r[1]}</span></div>
      ))}
    </div>
  ) },
  Drawer: { icon: PanelRight, blurb: "Panel that slides in from the edge.", preview: (
    <div className="relative h-24 w-52 overflow-hidden rounded-lg border border-border bg-muted/40">
      <div className="absolute inset-y-0 right-0 w-24 border-l border-border bg-card p-2"><div className="mb-1 text-[10px] font-bold text-foreground">Filters</div><div className="space-y-1">{bar("90%")}{bar("70%")}{bar("80%")}</div></div>
    </div>
  ) },
  Sheet: { icon: PanelRight, blurb: "Side sheet for secondary tasks.", preview: (
    <div className="relative h-24 w-52 overflow-hidden rounded-lg border border-border bg-muted/40">
      <div className="absolute inset-x-0 bottom-0 h-14 rounded-t-xl border-t border-border bg-card p-2"><div className="mx-auto mb-1.5 h-1 w-8 rounded-full bg-muted-foreground/30" />{bar("70%")}<div className="mt-1.5">{bar("45%")}</div></div>
    </div>
  ) },
  EmptyState: { icon: Inbox, blurb: "Friendly placeholder when nothing is here.", preview: (
    <div className="flex flex-col items-center gap-1.5"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground"><Inbox className="h-5 w-5" /></span><div className="text-[11px] font-bold text-foreground">No messages</div>{btn("Compose")}</div>
  ) },
  Empty: { icon: Inbox, blurb: "Minimal empty placeholder.", preview: (
    <div className="flex flex-col items-center gap-1"><Inbox className="h-8 w-8 text-muted-foreground/60" /><div className="text-[11px] text-muted-foreground">No data</div></div>
  ) },
  FileUpload: { icon: CloudUpload, blurb: "Drop zone with file picker.", preview: (
    <div className="flex w-52 flex-col items-center gap-1 rounded-lg border-2 border-dashed border-border bg-muted/30 py-4"><CloudUpload className="h-6 w-6 text-primary" /><div className="text-[11px] font-semibold text-foreground">Drop files here</div><div className="text-[9px] text-muted-foreground">PNG, JPG up to 5 MB</div></div>
  ) },
  Upload: { icon: Upload, blurb: "Button-style file upload with a list.", preview: (
    <div className="w-48 space-y-1.5">{btn("⬆ Upload file", "o")}<div className="flex items-center justify-between rounded border border-border bg-card px-2 py-1 text-[10px] text-foreground"><span>report.pdf</span><span className="text-emerald-500">✓</span></div></div>
  ) },
  Hero: { icon: Sparkles, blurb: "Large intro block with headline and call to action.", preview: (
    <div className="w-56 space-y-1.5 text-center"><div className="text-sm font-extrabold leading-tight text-foreground">Build faster with<br /><span className="text-primary">Goat UI</span></div>{bar("70%")}<div className="flex justify-center gap-2 pt-1">{btn("Start")}{btn("Docs", "o")}</div></div>
  ) },
  HoverCard: { icon: Eye, blurb: "Rich preview shown on hover.", preview: (
    <div className="space-y-1"><span className="text-[11px] font-semibold text-primary underline">@goatui</span><div className="flex w-44 items-center gap-2 rounded-lg border border-border bg-card p-2 shadow-md">{avatar("G", "bg-blue-500")}<div><div className="text-[11px] font-bold text-foreground">Goat UI</div><div className="text-[9px] text-muted-foreground">Component library</div></div></div></div>
  ) },
  Input: { icon: TextCursorInput, blurb: "Single line text field.", preview: <div className="space-y-1"><div className="text-[10px] font-semibold text-foreground">Email</div>{field("you@example.com", "w-48")}</div> },
  SearchInput: { icon: Search, blurb: "Input with search icon and clear.", preview: <div className="flex h-8 w-48 items-center gap-2 rounded-md border border-border bg-background px-2.5 text-[11px] text-muted-foreground"><Search className="h-3.5 w-3.5" />Search…</div> },
  Textarea: { icon: AlignLeft, blurb: "Multi-line text entry.", preview: <div className="h-16 w-48 rounded-md border border-border bg-background p-2 text-[11px] text-muted-foreground">Write a message…</div> },
  OtpInput: { icon: Hash, blurb: "One-time code entry boxes.", preview: <div className="flex gap-1.5">{["4", "8", "2", "", "", ""].map((d, i) => <div key={i} className={`flex h-9 w-7 items-center justify-center rounded-md border text-sm font-bold ${i === 3 ? "border-primary" : "border-border"} bg-background text-foreground`}>{d}</div>)}</div> },
  ListGroup: { icon: List, blurb: "Vertical list of related rows.", preview: <div className="w-48 overflow-hidden rounded-lg border border-border bg-card text-[11px]">{["Inbox", "Drafts", "Sent"].map((t, i) => <div key={t} className={`flex justify-between px-3 py-1.5 ${i ? "border-t border-border" : ""} ${i === 0 ? "bg-primary/10 font-semibold text-primary" : "text-muted-foreground"}`}><span>{t}</span><span>{[12, 3, 40][i]}</span></div>)}</div> },
  LoadingSpinner: { icon: Loader, blurb: "Circular indicator for loading.", preview: <div className="flex items-center gap-3"><div className="h-8 w-8 rounded-full border-4 border-muted border-t-primary" /><div className="h-5 w-5 rounded-full border-2 border-muted border-t-primary" /></div> },
  Spin: { icon: Loader, blurb: "Spinner wrapper for pending content.", preview: <div className="relative w-44 rounded-lg border border-border bg-card p-3"><div className="space-y-1.5 opacity-40">{bar("90%")}{bar("60%")}</div><div className="absolute inset-0 flex items-center justify-center"><div className="h-6 w-6 rounded-full border-[3px] border-muted border-t-primary" /></div></div> },
  MetricCard: { icon: Gauge, blurb: "Key number with change since last period.", preview: panel(<><div className="text-[10px] text-muted-foreground">Revenue</div><div className="text-xl font-bold text-foreground">$48.2k</div><div className="text-[10px] font-semibold text-emerald-500">▲ 12.5% vs last month</div></>, "w-44") },
  StatCard: { icon: Activity, blurb: "Compact stat with icon and delta.", preview: panel(<div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary"><Users className="h-4 w-4" /></span><div><div className="text-[10px] text-muted-foreground">New users</div><div className="text-base font-bold text-foreground">1,284</div></div></div>, "w-44") },
  Statistics: { icon: ChartColumn, blurb: "Group of related numbers and a chart.", preview: panel(<><div className="mb-1.5 flex justify-between text-[10px]"><span className="text-muted-foreground">Weekly</span><span className="font-bold text-foreground">3,920</span></div>{bars}</>, "w-48") },
  Navbar: { icon: LayoutDashboard, blurb: "Top bar with logo, links and actions.", preview: (
    <div className="flex w-60 items-center justify-between rounded-lg border border-border bg-card px-3 py-2"><span className="flex items-center gap-1.5 text-[11px] font-extrabold text-foreground"><span className="h-4 w-4 rounded bg-primary" />Goat</span><span className="flex gap-2.5 text-[10px] text-muted-foreground"><span className="font-semibold text-primary">Docs</span><span>Blog</span></span>{btn("Sign in")}</div>
  ) },
  Notification: { icon: Bell, blurb: "Message that appears in a corner.", preview: <div className="flex w-56 items-start gap-2 rounded-lg border border-border bg-card p-2.5 shadow-md"><span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary"><Bell className="h-3 w-3" /></span><div><div className="text-[11px] font-bold text-foreground">New comment</div><div className="text-[10px] text-muted-foreground">Mia replied to your post.</div></div></div> },
  Toast: { icon: Flag, blurb: "Brief message that disappears on its own.", preview: <div className="flex w-52 items-center gap-2 rounded-lg bg-foreground px-3 py-2 text-[11px] font-medium text-background shadow-lg"><CircleCheck className="h-4 w-4 text-emerald-400" />Changes saved</div> },
  Pagination: { icon: Footprints, blurb: "Page numbers with previous and next.", preview: <div className="flex items-center gap-1 text-[11px]"><span className="rounded border border-border px-2 py-1 text-muted-foreground">‹</span>{[1, 2, 3].map((n) => <span key={n} className={`rounded px-2 py-1 font-semibold ${n === 2 ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{n}</span>)}<span className="text-muted-foreground">…</span><span className="rounded border border-border px-2 py-1 text-muted-foreground">›</span></div> },
  Popconfirm: { icon: CircleHelp, blurb: "Small confirm bubble next to a button.", preview: <div className="space-y-1.5"><div className="w-44 rounded-lg border border-border bg-card p-2 shadow-md"><div className="mb-1.5 text-[11px] font-semibold text-foreground">Delete this item?</div><div className="flex justify-end gap-1.5">{btn("No", "o")}{btn("Yes")}</div></div>{btn("Delete", "o")}</div> },
  Popover: { icon: MessageSquare, blurb: "Floating panel anchored to an element.", preview: <div className="space-y-1.5"><div className="w-44 rounded-lg border border-border bg-card p-2.5 shadow-md"><div className="mb-1 text-[11px] font-bold text-foreground">Dimensions</div>{bar("80%")}<div className="mt-1">{bar("55%")}</div></div>{btn("Open", "o")}</div> },
  Tooltip: { icon: Info, blurb: "Short hint shown on hover or focus.", preview: <div className="flex flex-col items-center gap-1.5"><span className="rounded-md bg-foreground px-2 py-1 text-[10px] font-medium text-background">Copy to clipboard</span>{btn("Copy", "o")}</div> },
  ProgressBar: { icon: Minus, blurb: "Horizontal bar showing task progress.", preview: <div className="w-48 space-y-1"><div className="flex justify-between text-[10px] text-muted-foreground"><span>Uploading</span><span>64%</span></div><div className="h-2 rounded-full bg-muted"><div className="h-2 w-[64%] rounded-full bg-primary" /></div></div> },
  Progress: { icon: Minus, blurb: "Progress indicator in a track.", preview: <div className="w-48 space-y-2">{[80, 45, 20].map((p) => <div key={p} className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${p}%` }} /></div>)}</div> },
  ProgressCircle: { icon: Gauge, blurb: "Circular progress with a value.", preview: ring(72) },
  Rating: { icon: Star, blurb: "Star scale for feedback.", preview: <div className="flex gap-1 text-lg">{[1, 2, 3, 4, 5].map((n) => <span key={n} className={n <= 4 ? "text-amber-400" : "text-muted-foreground/30"}>★</span>)}</div> },
  Result: { icon: CircleCheck, blurb: "Outcome page for success or failure.", preview: <div className="flex flex-col items-center gap-1.5"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500"><CircleCheck className="h-6 w-6" /></span><div className="text-[11px] font-bold text-foreground">Payment complete</div>{btn("Back home")}</div> },
  Skeleton: { icon: Layers, blurb: "Grey placeholders while content loads.", preview: <div className="flex w-48 items-center gap-2.5"><div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-muted" /><div className="flex-1 space-y-1.5"><div className="h-2.5 animate-pulse rounded bg-muted" /><div className="h-2.5 w-2/3 animate-pulse rounded bg-muted" /></div></div> },
  Slider: { icon: SlidersHorizontal, blurb: "Drag a handle to pick a value.", preview: <div className="relative h-2 w-48 rounded-full bg-muted"><div className="h-2 w-[55%] rounded-full bg-primary" /><span className="absolute left-[55%] top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-card shadow" /></div> },
  Stepper: { icon: Footprints, blurb: "Numbered steps for a multi-step flow.", preview: <div className="flex items-center gap-1.5">{[1, 2, 3].map((n) => <React.Fragment key={n}><span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${n <= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{n}</span>{n < 3 && <span className={`h-0.5 w-8 ${n < 2 ? "bg-primary" : "bg-muted"}`} />}</React.Fragment>)}</div> },
  Steps: { icon: GitCommitVertical, blurb: "Labelled progress through stages.", preview: <div className="w-52 space-y-2">{["Account", "Details", "Confirm"].map((t, i) => <div key={t} className="flex items-center gap-2 text-[11px]"><span className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold ${i < 2 ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`}>{i < 1 ? "✓" : i + 1}</span><span className={i === 1 ? "font-bold text-foreground" : "text-muted-foreground"}>{t}</span></div>)}</div> },
  Timeline: { icon: GitCommitVertical, blurb: "Events in order with time stamps.", preview: <div className="w-52 space-y-2">{[["Order placed", "09:12"], ["Packed", "11:40"], ["Shipped", "14:05"]].map((e, i) => <div key={e[0]} className="flex items-center gap-2 text-[11px]">{dot(i === 2 ? "bg-primary" : "bg-muted-foreground/40")}<span className="flex-1 text-foreground">{e[0]}</span><span className="text-[9px] text-muted-foreground">{e[1]}</span></div>)}</div> },
  TreeView: { icon: FolderTree, blurb: "Nested folders and files.", preview: <div className="w-44 space-y-0.5 text-[11px] text-muted-foreground"><div className="font-semibold text-foreground">▾ src</div><div className="pl-3">▾ components</div><div className="pl-6 text-primary">button.tsx</div><div className="pl-6">card.tsx</div><div className="pl-3">▸ lib</div></div> },
}

export const fallbackEntry = (name: string): Entry => ({
  icon: Layers,
  blurb: `${name} component.`,
  preview: <div className="space-y-1.5">{bar("120px")}{bar("80px")}</div>,
})

export const entryFor = (name: string): Entry => overview[name] || fallbackEntry(name)
