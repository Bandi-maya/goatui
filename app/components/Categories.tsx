"use client"
import { CATEGORIES } from "@/lib/categories";
import { ALL_COMPONENTS, ComponentItem } from "@/lib/constants";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

export function Categories({ searchQuery, handleComponentClick, activeComponent, filteredComponents }: any) {
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
        "Foundation": true, "Forms": true, "Navigation": true, "Data Display": true,
        "Feedback": true, "Overlay": true, "Marketing": true, "Dashboard": true, "Utilities": true
    });

    const toggleCategory = (cat: string) => {
        setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
    };

    const categoryGroups = useMemo(() => {
        const groups: Record<string, ComponentItem[]> = {};
        filteredComponents.forEach(comp => {
            if (!groups[comp.category]) groups[comp.category] = [];
            groups[comp.category].push(comp);
        });
        return groups;
    }, [filteredComponents]);

    return <div className="space-y-4">
        {CATEGORIES.map((cat) => {
            const items = categoryGroups[cat] || [];
            if (items.length === 0) return null;
            const isExpanded = expandedCategories[cat];

            return (
                <div key={cat} className="space-y-1">
                    <button
                        onClick={() => toggleCategory(cat)}
                        className="w-full flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 hover:text-foreground px-2 py-1 select-none cursor-pointer border-0 bg-transparent"
                    >
                        <span>{cat}</span>
                        {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    </button>

                    {isExpanded && (
                        <div className="flex flex-col gap-0.5 pl-1.5 mt-0.5 border-l border-border/60 ml-2">
                            {items.map((item) => {
                                const active = activeComponent === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => handleComponentClick(item.id)}
                                        className={`w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-left transition-all border-0 bg-transparent cursor-pointer ${active ? "bg-blue-600/10 text-blue-600 font-semibold" : "text-slate-500 dark:text-slate-400 hover:bg-muted"
                                            }`}
                                    >
                                        <span>{item.name}</span>
                                        {active && <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            );
        })}
    </div>
}