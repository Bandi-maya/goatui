import { Inbox } from "lucide-react";

export default function Empty() {
    return <div className="w-full max-w-sm rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 bg-card/10 p-8 text-center select-none">
        <div className="h-12 w-12 rounded-full bg-slate-50 dark:bg-zinc-900 flex items-center justify-center mx-auto mb-3 border border-slate-100 dark:border-zinc-800">
            <Inbox className="h-5 w-5 text-muted-foreground/60" />
        </div>
        <h4 className="text-xs font-bold text-foreground">No Historical Architecture Data Tracked</h4>
        <p className="text-[11px] text-muted-foreground max-w-xs mx-auto mt-1 leading-relaxed">Adjust configuration rules or change filtering scopes.</p>
    </div>
}