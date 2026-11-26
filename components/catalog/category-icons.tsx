"use client"

import React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  GridViewIcon, BadgeCheckIcon, BrowserIcon, Chart01Icon, Database01Icon, FormIcon, InputCursorTextIcon, DropletIcon,
  Loading03Icon, Menu01Icon, LayoutTopIcon, Navigation01Icon, Package01Icon, Layout01Icon, SlidersHorizontalIcon, Table01Icon, SquareIcon,
} from "@hugeicons/core-free-icons"

type P = { className?: string }
const S = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>{children}</svg>
)

// Custom icons (drawn to match the Hugeicons stroke style) for categories the pack has no good symbol for.
const AccordionSvg = ({ className }: P) => (<S className={className}><rect x="3" y="3" width="18" height="5" rx="1.5" /><path d="M16 5.5l-1.5 1M16 5.5l-1.5-1" /><rect x="3" y="10" width="18" height="11" rx="1.5" /><path d="M7 14h10M7 17.5h6" /></S>)
const ButtonSvg = ({ className }: P) => (<S className={className}><rect x="2.5" y="7" width="19" height="9" rx="4.5" /><path d="M8 11.5h8" /><path d="M14.5 19.5l1-2.5 1 2.5 2.2-1.2-1.6-1.6" /></S>)
const CardSvg = ({ className }: P) => (<S className={className}><rect x="3" y="4" width="18" height="16" rx="2.5" /><path d="M3 11h18M7 15.5h6" /></S>)
const ModalSvg = ({ className }: P) => (<S className={className}><rect x="2.5" y="3" width="19" height="18" rx="2.5" opacity=".45" /><rect x="6" y="7" width="12" height="10" rx="2" /><path d="M8.5 10h5M8.5 13.5h3M15.5 8.5l.01.01" /></S>)
const TabsSvg = ({ className }: P) => (<S className={className}><path d="M3 9V6.5A1.5 1.5 0 014.5 5H9l1.5 2H21" opacity="0" /><path d="M3 20V8a2 2 0 012-2h4a2 2 0 012 2v1h8a2 2 0 012 2v9a1 1 0 01-1 1H4a1 1 0 01-1-1z" /><path d="M11 9V8M3 12h8" opacity="0" /></S>)
const ToastSvg = ({ className }: P) => (<S className={className}><rect x="3" y="14" width="18" height="6" rx="3" /><path d="M7 17h6" /><path d="M12 3v6M9 6l3 3 3-3" opacity="0" /><rect x="6" y="5" width="12" height="6" rx="3" opacity=".45" /></S>)

const huge = (icon: any) => ({ className }: P) => <HugeiconsIcon icon={icon} size={16} strokeWidth={1.5} className={className} />

const map: Record<string, React.ComponentType<P>> = {
  All: huge(GridViewIcon),
  Accordions: AccordionSvg,
  "Badges & Avatars": huge(BadgeCheckIcon),
  Blocks: huge(BrowserIcon),
  Buttons: ButtonSvg,
  Cards: CardSvg,
  Charts: huge(Chart01Icon),
  "Data display": huge(Database01Icon),
  Forms: huge(FormIcon),
  Inputs: huge(InputCursorTextIcon),
  "Liquid glass": huge(DropletIcon),
  Loaders: huge(Loading03Icon),
  Menus: huge(Menu01Icon),
  Modals: ModalSvg,
  Navbars: huge(LayoutTopIcon),
  "Navigation flows": huge(Navigation01Icon),
  Primitives: huge(Package01Icon),
  Sections: huge(Layout01Icon),
  Sliders: huge(SlidersHorizontalIcon),
  Tables: huge(Table01Icon),
  Standalone: huge(SquareIcon),
  Tabs: TabsSvg,
  Toasts: ToastSvg,
}

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const C = map[name] || huge(GridViewIcon)
  return <C className={className} />
}
