import * as React from "react"

export default function Popconfirm({ open: openProp, onOpenChange, onConfirm }: any) {
    const [inner, setInner] = React.useState(false)
    const open = openProp ?? inner
    const setOpen = (v: boolean) => { setInner(v); onOpenChange?.(v) }
    return <div className="relative inline-block">
        <button onClick={() => setOpen(!open)} className="rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-foreground shadow transition-transform hover:bg-muted active:scale-95">
            Delete project
        </button>
        {open && (
            <div className="absolute bottom-[110%] left-1/2 z-50 w-52 -translate-x-1/2 rounded-xl border border-border bg-card p-3 text-left shadow-2xl">
                <p className="text-[12px] font-bold text-foreground">Delete this project?</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">This cannot be undone.</p>
                <div className="mt-3 flex justify-end gap-1.5">
                    <button onClick={() => setOpen(false)} className="cursor-pointer rounded-md border border-border bg-muted px-2.5 py-1 text-[11px] font-bold text-foreground">Cancel</button>
                    <button onClick={() => { setOpen(false); onConfirm?.() }} className="cursor-pointer rounded-md bg-foreground px-2.5 py-1 text-[11px] font-bold text-background">Delete</button>
                </div>
            </div>
        )}
    </div>
}
