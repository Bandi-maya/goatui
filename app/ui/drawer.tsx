import { X } from "lucide-react";

export default function Drawer({ antdDrawerOpen, setAntdDrawerOpen }: any) {
    return <div>
        <button onClick={() => setAntdDrawerOpen(true)} className="bg-blue-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl border-0 cursor-pointer shadow">
            Trigger Side Drawer Sheet Panel
        </button>
        {antdDrawerOpen && (
            <div className="fixed inset-0 z-50 flex justify-end">
                <div onClick={() => setAntdDrawerOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-xs" />
                <div className="relative w-80 h-full bg-white dark:bg-zinc-950 border-l border-slate-200 dark:border-zinc-900 p-5 shadow-2xl flex flex-col justify-between animate-fadeIn">
                    <div className="flex items-center justify-between border-b pb-3">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground">Drawer Dashboard Parameters</h4>
                        <button onClick={() => setAntdDrawerOpen(false)} className="border-0 bg-transparent cursor-pointer text-muted-foreground"><X className="h-4 w-4" /></button>
                    </div>
                    <button onClick={() => setAntdDrawerOpen(false)} className="w-full bg-blue-600 text-white py-2 rounded-xl text-xs font-bold border-0 cursor-pointer">Close Drawer</button>
                </div>
            </div>
        )}
    </div>
}