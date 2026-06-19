export default function Steps({ setAntdStepActive, antdStepActive }: any) {
    return <div className="w-full max-w-md flex flex-col md:flex-row items-start gap-4 text-left select-none">
        {[
            { title: "Authenticate", desc: "Verify gateway configuration keys" },
            { title: "Compile Build", desc: "Bundle structural runtime modules" },
            { title: "CDN Release", desc: "Propagate active edge instances" }
        ].map((step, idx) => (
            <div key={idx} className="flex-1 flex flex-col gap-2 relative">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setAntdStepActive(idx)}
                        className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all cursor-pointer ${idx < antdStepActive ? "bg-green-500 border-green-500 text-white" :
                            idx === antdStepActive ? "bg-blue-600 border-blue-600 text-white shadow shadow-blue-600/20" :
                                "border-slate-200 dark:border-zinc-800 bg-card text-muted-foreground"
                            }`}
                    >
                        {idx < antdStepActive ? "✓" : idx + 1}
                    </button>
                    <span className={`text-xs font-bold ${idx === antdStepActive ? "text-blue-600" : "text-foreground"}`}>{step.title}</span>
                </div>
                <p className="text-[10px] text-muted-foreground pl-10 leading-tight">{step.desc}</p>
            </div>
        ))}
    </div>
}