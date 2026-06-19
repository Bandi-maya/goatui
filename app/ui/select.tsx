import { Check, ChevronDown } from "lucide-react";

export default function Select({ antdSelectedOption, antdSelectOpen, setAntdSelectOpen, setAntdSelectedOption }: any) {
    return <div className="w-full max-w-xs relative text-left select-none">
        <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 mb-1.5">Runtime Architecture Infrastructure</label>
        <div
            onClick={() => setAntdSelectOpen(!antdSelectOpen)}
            className="w-full h-10 border border-slate-200 dark:border-zinc-800 rounded-xl bg-card/60 px-3.5 py-2 flex items-center justify-between text-xs font-medium text-foreground cursor-pointer hover:border-blue-500 transition-colors"
        >
            <span>{antdSelectedOption}</span>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${antdSelectOpen ? "rotate-180" : ""}`} />
        </div>
        {antdSelectOpen && (
            <div className="absolute top-[105%] left-0 w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-1 shadow-2xl z-50 animate-fadeIn">
                {["React Core Engine", "Vue Modular Cluster", "Angular Structural Base", "NextJS Build Framework"].map((opt) => (
                    <button
                        key={opt}
                        onClick={() => { setAntdSelectedOption(opt); setAntdSelectOpen(false); }}
                        className={`w-full text-left text-xs font-medium px-3 py-2 rounded-lg flex items-center justify-between border-0 bg-transparent cursor-pointer ${antdSelectedOption === opt ? "bg-blue-600 text-white" : "text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900"
                            }`}
                    >
                        <span>{opt}</span>
                        {antdSelectedOption === opt && <Check className="h-3.5 w-3.5" />}
                    </button>
                ))}
            </div>
        )}
    </div>
}