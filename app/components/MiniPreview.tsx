"use client";

import {
    ChevronDown,
    Star, CheckCircle2,
    Loader2,
    UploadCloud, Inbox, ShieldAlert
} from "lucide-react";

// Component Card Thumbnail Renderers inside Overview Grid (MiniPreview Layout Canvas)
export const MiniPreview = ({ id }: { id: string }) => {
    switch (id) {
        case "button":
            return <div className="h-6 w-16 bg-blue-600 rounded flex items-center justify-center text-[8px] font-bold text-white shadow-sm shadow-blue-600/10">Click</div>;
        case "select":
            return <div className="w-20 border border-border bg-card rounded px-1 py-0.5 text-[7px] text-foreground flex items-center justify-between"><span>Option...</span><ChevronDown className="h-2 w-2 text-muted-foreground" /></div>;
        case "slider":
            return <div className="w-20 bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full relative"><div className="absolute left-0 top-0 h-full w-2/3 bg-blue-600 rounded-full" /><div className="absolute left-[64%] -top-1 h-3.5 w-3.5 bg-white border-2 border-blue-600 rounded-full" /></div>;
        case "upload":
            return <div className="w-20 border border-dashed border-blue-500/40 rounded p-1.5 bg-blue-600/5 text-center"><UploadCloud className="h-3 w-3 text-blue-600 mx-auto" /><div className="text-[5px] text-muted-foreground font-bold mt-0.5">Drop bundle</div></div>;
        case "steps":
            return <div className="flex items-center gap-1"><div className="h-3.5 w-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[5px] font-bold">1</div><div className="h-px w-6 bg-slate-300" /><div className="h-3.5 w-3.5 rounded-full bg-slate-100 border text-muted-foreground flex items-center justify-center text-[5px]">2</div></div>;
        case "timeline":
            return <div className="flex flex-col gap-1.5 pl-2 relative border-l border-slate-200"><div className="h-1.5 w-1.5 bg-green-500 rounded-full -ml-[11px]" /><div className="h-1.5 w-1.5 bg-blue-600 rounded-full -ml-[11px]" /></div>;
        case "empty":
            return <div className="text-center p-2"><Inbox className="h-4 w-4 text-muted-foreground/40 mx-auto" /><div className="text-[6px] text-muted-foreground mt-0.5">No data logged</div></div>;
        case "spin":
            return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
        case "result":
            return <div className="text-center"><CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" /><div className="text-[6px] font-bold text-foreground mt-0.5">Task Success</div></div>;
        case "drawer":
            return <div className="w-24 h-16 bg-card border-l-4 border-l-blue-600 shadow-lg relative flex flex-col justify-between p-1"><div className="h-1 w-10 bg-muted rounded" /><div className="h-2 w-full bg-blue-600/10 rounded" /></div>;
        case "popconfirm":
            return <div className="w-20 border border-border rounded bg-card p-1 shadow-md text-left"><div className="flex gap-1 items-center"><ShieldAlert className="h-2.5 w-2.5 text-red-500" /><span className="text-[5px] font-bold">Purge cluster?</span></div></div>;
        case "badge":
            return <div className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[8px] font-bold">New</div>;
        case "avatar":
            return <div className="h-6 w-6 rounded-full bg-blue-600 text-[8px] font-bold text-white flex items-center justify-center animate-fadeIn">A</div>;
        case "input":
            return <div className="h-6 w-24 border border-border rounded bg-card px-1.5 flex items-center text-[7px] text-muted-foreground select-none">Search...</div>;
        case "checkbox":
            return <div className="h-4 w-4 border border-blue-600 bg-blue-600 rounded-sm flex items-center justify-center text-[8px] text-white">✓</div>;
        case "radio":
            return <div className="h-3.5 w-3.5 rounded-full border border-blue-600 flex items-center justify-center"><div className="h-1.5 w-1.5 bg-blue-600 rounded-full" /></div>;
        case "switch":
            return <div className="h-4.5 w-8 rounded-full bg-blue-600 p-0.5 flex justify-end"><div className="h-3.5 w-3.5 rounded-full bg-white" /></div>;
        case "rating":
            return <div className="flex gap-0.5"><Star className="h-2.5 w-2.5 fill-amber-400 stroke-amber-400" /><Star className="h-2.5 w-2.5 fill-amber-400 stroke-amber-400" /><Star className="h-2.5 w-2.5 stroke-muted-foreground" /></div>;
        case "navbar":
            return <div className="w-full max-w-[140px] border border-border rounded bg-card p-1 flex items-center justify-between text-[6px]"><div className="font-bold flex items-center gap-1"><div className="h-2 w-2 rounded bg-blue-600" />Logo</div></div>;
        case "breadcrumb":
            return <div className="text-[7px] text-muted-foreground font-medium">Home &gt; <span className="text-blue-600 font-semibold">Inputs</span></div>;
        case "pagination":
            return <div className="flex gap-1"><div className="h-4 w-4 rounded bg-blue-600 text-white flex items-center justify-center text-[6px] font-bold">2</div></div>;
        case "tabs":
            return <div className="flex border-b border-border text-[6px] gap-2 w-full max-w-[100px]"><span className="border-b border-blue-600 text-blue-600 pb-0.5 font-bold">Tab 1</span></div>;
        case "card":
            return <div className="w-20 border border-border rounded bg-card p-1.5 space-y-1"><div className="h-1.5 w-10 bg-blue-600 rounded" /></div>;
        case "statistics":
            return <div className="text-center"><div className="text-[12px] font-bold text-foreground">$12,450</div></div>;
        case "list-group":
            return <div className="w-20 border border-border rounded bg-card overflow-hidden"><div className="h-3.5 bg-blue-500/10 text-blue-600 text-[6px] flex items-center px-1 font-semibold">Selected Item</div></div>;
        case "table":
            return <div className="w-20 border border-border rounded bg-card flex flex-col gap-0.5 p-1"><div className="h-1.5 bg-blue-600/10 rounded w-full" /></div>;
        case "alert":
            return <div className="w-24 border border-green-500/20 bg-green-500/10 rounded p-1 text-[6px] text-green-700 dark:text-green-400 font-medium">✓ System Updated</div>;
        case "progress-bar":
            return <div className="w-20 bg-slate-200 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden"><div className="bg-blue-600 h-full w-3/5" /></div>;
        case "toast":
            return <div className="w-20 border border-border rounded bg-card p-1 shadow-md text-[6px] border-l-2 border-l-green-500 flex items-center gap-1">✓ Saved</div>;
        case "modal":
            return <div className="w-24 border border-border rounded-lg bg-card p-1.5 shadow-xl relative scale-95 border-blue-600/25"><div className="h-1 w-10 bg-muted rounded mb-1" /></div>;
        case "tooltip":
            return <div className="flex flex-col items-center"><div className="px-1.5 py-0.5 bg-zinc-850 dark:bg-zinc-800 text-white rounded text-[5px] shadow relative z-10">Tooltip info</div></div>;
        case "dropdown":
            return <div className="w-16 border border-border rounded bg-card p-0.5 shadow-md flex flex-col gap-0.5"><div className="h-2 w-12 bg-blue-600/10 rounded" /></div>;
        case "hero":
            return <div className="text-center px-2"><div className="h-2 w-16 bg-blue-600 rounded mx-auto mb-1" /></div>;
        case "metric-card":
            return <div className="w-20 border border-border rounded bg-card p-1.5 space-y-1"><div className="h-4 bg-blue-600/10 rounded flex items-center justify-center text-[7px] text-blue-600 font-bold">98.2%</div></div>;
        case "skeleton":
            return <div className="w-20 space-y-1 animate-pulse"><div className="h-2 bg-slate-200 dark:bg-zinc-800 rounded w-full" /></div>;
        default:
            return null;
    }
};
