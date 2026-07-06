import { Loader2 } from "lucide-react";

export default function Spin() {
    return <div className="w-full max-w-sm border border-slate-200 dark:border-zinc-800 rounded-xl p-6 bg-card/40 flex flex-col items-center justify-center text-center h-44 select-none">
        <Loader2 className="h-7 w-7 text-blue-600 animate-spin mb-2" />
        <span className="text-xs font-bold text-blue-600">Resolving Data Parameters...</span>
    </div>
}