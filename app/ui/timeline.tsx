export default function Timeline() {
    return <div className="w-full max-w-xs space-y-4 text-left select-none">
        {[
            { label: "Deployment Successful Node Shard 1", time: "10:42 AM", dot: "bg-green-500" },
            { label: "Database Core Architecture Seeded", time: "10:39 AM", dot: "bg-blue-600" },
            { label: "Staging Pipeline Verification Sequence Init", time: "09:12 AM", dot: "bg-amber-500" }
        ].map((item, idx, arr) => (
            <div key={idx} className="flex gap-4 relative pl-1">
                {idx !== arr.length - 1 && <div className="absolute left-2.5 top-3 bottom-0 w-px bg-slate-200 dark:bg-zinc-800 -ml-[0.5px]" />}
                <div className={`h-2.5 w-2.5 rounded-full mt-1 shrink-0 border-2 border-card relative z-10 ${item.dot}`} />
                <div>
                    <h5 className="text-xs font-bold text-foreground leading-none">{item.label}</h5>
                    <span className="text-[10px] text-muted-foreground font-mono mt-0.5 block">{item.time}</span>
                </div>
            </div>
        ))}
    </div>
}