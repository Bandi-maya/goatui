import { CheckCircle2 } from "lucide-react";

export default function Result() {
    return <div className="w-full max-w-md rounded-xl border border-slate-200 dark:border-zinc-800 bg-card p-6 text-center space-y-4 shadow-sm animate-fadeIn">
        <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto" />
        <div>
            <h4 className="text-sm font-extrabold text-foreground">Cluster Synchronization Success</h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">CDN distribution models executed securely without trace mutations.</p>
        </div>
    </div>
}