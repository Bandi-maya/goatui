"use client"
import React from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from "@/app/components/ui/dialog"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription, DrawerClose } from "@/app/components/ui/drawer"
import { Popover, PopoverTrigger, PopoverContent } from "@/app/components/ui/popover"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/app/components/ui/hover-card"

const btn = "rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-transform hover:bg-muted active:scale-95"
const solid = "rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background transition-transform active:scale-95"

function AppModalDemo({ C }: { C: React.ComponentType<any> }) {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <button className={btn} onClick={() => setOpen(true)}>Open modal</button>
      <C isOpen={open} onClose={() => setOpen(false)} className="!bg-card !text-foreground">
        <div className="p-6">
          <h3 className="text-lg font-bold">Publish changes?</h3>
          <p className="mt-1 text-sm text-muted-foreground">Everyone with access will see the update right away.</p>
          <div className="mt-5 flex justify-end gap-2">
            <button className={btn} onClick={() => setOpen(false)}>Cancel</button>
            <button className={solid} onClick={() => setOpen(false)}>Publish</button>
          </div>
        </div>
      </C>
    </>
  )
}

function ModalDemo({ C }: { C: React.ComponentType<any> }) {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <button className={btn} onClick={() => setOpen(true)}>Open modal</button>
      <C isOpen={open} onClose={() => setOpen(false)} className="!bg-card !text-foreground" title="Invite teammate" description="They get an email with a link to join your workspace.">
        <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="name@company.com" />
        <div className="mt-4 flex justify-end gap-2">
          <button className={btn} onClick={() => setOpen(false)}>Cancel</button>
          <button className={solid} onClick={() => setOpen(false)}>Send invite</button>
        </div>
      </C>
    </>
  )
}

function SheetDemo({ C }: { C: React.ComponentType<any> }) {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <button className={btn} onClick={() => setOpen(true)}>Open sheet</button>
      <C isOpen={open} onClose={() => setOpen(false)} side="bottom" className="!bg-card !text-foreground" title="Share project" description="Choose who can view this project.">
        <div className="space-y-2 text-sm">
          {["Anyone with the link", "Team members only", "Only me"].map((t) => (
            <button key={t} className={btn + " block w-full text-left"} onClick={() => setOpen(false)}>{t}</button>
          ))}
        </div>
      </C>
    </>
  )
}

function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger><button className={btn}>Open dialog</button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Discard draft?</DialogTitle>
          <DialogDescription>Your unsaved changes will be lost.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose><button className={btn}>Keep editing</button></DialogClose>
          <DialogClose><button className={solid}>Discard</button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DrawerDemo() {
  return (
    <Drawer>
      <DrawerTrigger><button className={btn}>Open drawer</button></DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription>Narrow the list down.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose><button className={solid}>Apply</button></DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger className={btn}>Open popover</PopoverTrigger>
      <PopoverContent>
        <p className="text-sm font-semibold text-neutral-900">Dimensions</p>
        <p className="mt-1 text-xs text-neutral-500">Set the width and height of this layer.</p>
      </PopoverContent>
    </Popover>
  )
}

function HoverCardDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger><span className="cursor-pointer text-sm font-semibold underline underline-offset-4">@goatui</span></HoverCardTrigger>
      <HoverCardContent>
        <p className="text-sm font-semibold text-neutral-900">GOAT UI</p>
        <p className="mt-1 text-xs text-neutral-500">Copy-paste components, free to use.</p>
      </HoverCardContent>
    </HoverCard>
  )
}

export const renderOverlayPrimitive = (nameLower: string, C: React.ComponentType<any>, mods: Record<string, any>): React.ReactNode | null => {
  if (nameLower === "appmodal") return <AppModalDemo C={C} />
  if (nameLower === "modal") return <ModalDemo C={C} />
  if (nameLower === "sheet") return <SheetDemo C={C} />
  if (nameLower === "dialog") return <DialogDemo />
  if (nameLower === "drawer") return <DrawerDemo />
  if (nameLower === "popover") return <PopoverDemo />
  if (nameLower === "hovercard") return <HoverCardDemo />
  if (nameLower === "popconfirm") return <C />
  return null
}
