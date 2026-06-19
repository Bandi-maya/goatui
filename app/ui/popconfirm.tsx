export default function Popconfirm({ setAntdPopconfirmOpen, antdPopconfirmOpen, addToast }: any) {
    return <div className="relative inline-block">
        <button onClick={() => setAntdPopconfirmOpen(!antdPopconfirmOpen)} className="bg-red-500 hover:bg-red-650 text-white font-bold text-xs py-2.5 px-4 rounded-xl border-0 cursor-pointer shadow">
            Purge Workspace Node
        </button>
        {antdPopconfirmOpen && (
            <div className="absolute bottom-[110%] left-1/2 -translate-x-1/2 w-48 rounded-xl border border-border bg-card p-3 shadow-2xl z-50 text-left">
                <p className="text-[11px] font-bold text-foreground">Delete cloud cluster instances?</p>
                <div className="flex justify-end gap-1 mt-2">
                    <button onClick={() => setAntdPopconfirmOpen(false)} className="text-[9px] font-bold px-2 py-0.5 bg-muted rounded border-0 cursor-pointer text-foreground">Cancel</button>
                    <button onClick={() => { setAntdPopconfirmOpen(false); addToast("Database Cleared", "Staging indices removed.", "success"); }} className="text-[9px] font-bold px-2 py-0.5 bg-red-500 text-white border-0 cursor-pointer">Purge</button>
                </div>
            </div>
        )}
    </div>
}