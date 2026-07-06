import { Trash2, UploadCloud } from "lucide-react";

export default function Upload({ antdUploadStaged, setAntdUploadStaged }: any) {
    return <div className="w-full max-w-sm text-left">
        <div
            onClick={() => setAntdUploadStaged("compiled-deployment-package.zip")}
            className="w-full border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-xl p-6 text-center transition-all flex flex-col items-center justify-center cursor-pointer bg-card/20 hover:border-blue-500/50"
        >
            <UploadCloud className="h-8 w-8 text-blue-600 mb-2" />
            <span className="text-xs font-bold text-foreground">Click here to select or map active system files</span>
            <p className="text-[10px] text-muted-foreground mt-1">Supports distribution ZIP bundles up to 64MB logs.</p>
        </div>
        {antdUploadStaged && (
            <div className="mt-3 border border-green-500/20 bg-green-500/5 rounded-xl p-2.5 flex items-center justify-between text-xs text-green-700 dark:text-green-400 font-semibold animate-fadeIn">
                <span className="truncate">{antdUploadStaged}</span>
                <button onClick={() => setAntdUploadStaged(null)} className="text-red-500 border-0 bg-transparent cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
        )}
    </div>
}