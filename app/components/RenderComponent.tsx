import { Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Code, Copy, Eye, Inbox, Loader2, Star, Terminal, Trash2, UploadCloud, X } from "lucide-react";
import { MiniPreview } from "./MiniPreview";
import { GeneratedCodeForComponent } from "./GenarateCodeForComponent";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { ALL_COMPONENTS } from "@/lib/constants";
import Steps from "../ui/steps";
import Button from "../ui/button";
import InputComponent from "../ui/input";
import Checkbox from "../ui/checkbox";
import Radio from "../ui/radio";
import Switch from "../ui/switch";
import Rating from "../ui/rating";
import Slider from "../ui/slider";
import Navbar from "../ui/navbar";
import Breadcrumb from "../ui/breadcrumb";
import Pagination from "../ui/pagination";
import Tabs from "../ui/tabs";
import Card from "../ui/card";
import Statistics from "../ui/statistics";
import ListGroup from "../ui/list-group";
import Table from "../ui/table";
import Alert from "../ui/alert";
import ProgressBar from "../ui/progress-bar";
import Toast from "../ui/toast";
import Modal from "../ui/modal";
import Tooltip from "../ui/tooltip";
import Dropdown from "../ui/dropdown";
import Hero from "../ui/hero";
import MetricCard from "../ui/metric-card";
import Skeleton from "../ui/skeleton";
import Badge from "../ui/badge";
import Avatar from "../ui/avatar";
import Popconfirm from "../ui/popconfirm";
import Drawer from "../ui/drawer";
import Result from "../ui/result";
import Spin from "../ui/spin";
import Empty from "../ui/empty";
import Timeline from "../ui/timeline";
import Upload from "../ui/upload";
import Select from "../ui/select";

export function RenderComponent({
    activeComponent,
    filteredComponents,
    handleComponentClick,
    canvasWidth,
    canvasBg,
    addToast,
    setIsModalOpen
}: any) {
    const [activeTabs, setActiveTabs] = useState<Record<string, "preview" | "code">>({});
    const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
    const [copiedInstall, setCopiedInstall] = useState<Record<string, boolean>>({});

    const [options, setOptions] = useState({
        btnVariant: "primary", btnSize: "default", btnLoading: false, btnDisabled: false,
        inputType: "text", inputPlaceholder: "Enter cloud email...", inputDisabled: false, inputHasError: false,
        chkChecked: false, chkDisabled: false, radioLayout: "vertical", radioDisabled: false,
        switchChecked: false, switchDisabled: false, ratingValue: 4, breadSeparator: "chevron",
        tabsVariant: "underline", progressValue: 60, toastVariant: "success", tooltipSide: "top",
        badgeVariant: "default", badgeLabel: "Active Node", avatarSize: "md", avatarStatus: "online",
        alertVariant: "success"
    });
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [accordionOpen, setAccordionOpen] = useState<number | null>(0);
    const [activeTabSelect, setActiveTabSelect] = useState("tab-1");
    const [listGroupActive, setListGroupActive] = useState("inbox");
    const [tableHoveredRow, setTableHoveredRow] = useState<number | null>(null);

    // Antd interactive helper states
    const [antdStepActive, setAntdStepActive] = useState(1);
    const [antdSelectOpen, setAntdSelectOpen] = useState(false);
    const [antdSelectedOption, setAntdSelectedOption] = useState("React Framework");
    const [antdUploadStaged, setAntdUploadStaged] = useState<string | null>(null);
    const [antdDrawerOpen, setAntdDrawerOpen] = useState(false);
    const [antdPopconfirmOpen, setAntdPopconfirmOpen] = useState(false);

    const updateOption = (key: string, value: any) => {
        setOptions(prev => ({ ...prev, [key]: value }));
    };

    const handleCopyCode = (id: string, code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedStates(prev => ({ ...prev, [id]: true }));
        setTimeout(() => setCopiedStates(prev => ({ ...prev, [id]: false })), 2000);
    };

    const handleCopyInstall = (id: string, cmd: string) => {
        navigator.clipboard.writeText(cmd);
        setCopiedInstall(prev => ({ ...prev, [id]: true }));
        setTimeout(() => setCopiedInstall(prev => ({ ...prev, [id]: false })), 2000);
    };

    const widthClasses: any = {
        desktop: "w-full max-w-full",
        tablet: "w-full max-w-[768px]",
        mobile: "w-full max-w-[375px]"
    };

    const selectedComponentDetails = useMemo(() => {
        if (!activeComponent) return null;
        return ALL_COMPONENTS.find(comp => comp.id === activeComponent) || null;
    }, [activeComponent]);

    return activeComponent === null ? (
        <div className="max-w-7xl mx-auto w-full mb-16 space-y-6 text-left animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {filteredComponents.map((comp: any) => (
                    <div key={comp.id} className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 hover:border-blue-600/40 hover:shadow-lg transition-all duration-300">
                        <div className="space-y-3">
                            <div className="h-28 rounded-lg border border-border/80 bg-slate-50 dark:bg-zinc-900/50 flex items-center justify-center overflow-hidden relative transition-colors">
                                <MiniPreview id={comp.id} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-foreground">{comp.name}</h3>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{comp.description}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleComponentClick(comp.id)}
                            className="mt-4 w-full flex items-center justify-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 border border-blue-600/20 dark:border-blue-400/20 hover:bg-blue-600 hover:text-white py-2 rounded-lg transition-all cursor-pointer"
                        >
                            Inspect Component <ChevronRight className="h-3 w-3" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    ) : (
        /* INDIVIDUAL REFACTOR PREVIEW VIEW CANVAS */
        selectedComponentDetails && (
            <div className="max-w-7xl mx-auto w-full space-y-6 text-left animate-fadeIn">
                <button onClick={() => handleComponentClick("overview")} className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold mb-2 hover:underline border-0 bg-transparent cursor-pointer p-0">
                    <ChevronLeft className="h-4 w-4" /> Back to Dashboard Overview Canvas Grid
                </button>

                {(() => {
                    const comp = selectedComponentDetails;
                    const tab = activeTabs[comp.id] || "preview";
                    const setTab = (t: "preview" | "code") => setActiveTabs((prev: any) => ({ ...prev, [comp.id]: t }));
                    const code = GeneratedCodeForComponent(comp.id, options);

                    return (
                        <section id={comp.id} className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-6 shadow-sm focus:outline-none">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-600/10 px-2 py-0.5 rounded">{comp.category}</span>
                                        <span className="text-xs text-muted-foreground">/ {comp.id}</span>
                                    </div>
                                    <h3 className="text-xl font-bold tracking-tight mt-1 text-foreground">{comp.name}</h3>
                                    <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed">{comp.description}</p>
                                </div>
                                <div className="flex items-center border border-border bg-slate-50 dark:bg-zinc-900/40 rounded-lg p-0.5 pr-2 gap-1 text-[11px] font-mono">
                                    <span className="bg-muted px-2 py-1 rounded font-medium">install</span>
                                    <span className="px-1.5">{comp.id}</span>
                                    <button onClick={() => handleCopyInstall(comp.id, comp.installationCommand)} className="hover:text-foreground border-0 bg-transparent cursor-pointer">
                                        {copiedInstall[comp.id] ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex border-b border-border text-xs font-semibold gap-1">
                                <button onClick={() => setTab("preview")} className={`px-4 py-2 border-b-2 border-0 bg-transparent cursor-pointer ${tab === "preview" ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground"}`}><Eye className="h-3.5 w-3.5 inline mr-1" /> Preview Component</button>
                                <button onClick={() => setTab("code")} className={`px-4 py-2 border-b-2 border-0 bg-transparent cursor-pointer ${tab === "code" ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground"}`}><Code className="h-3.5 w-3.5 inline mr-1" /> Inspect Clean Markup</button>
                            </div>

                            {tab === "preview" ? (
                                <div className="space-y-6">
                                    <div className="w-full flex items-center justify-center">
                                        <div className={`min-h-[300px] border border-border rounded-xl flex items-center justify-center p-6 md:p-8 transition-all relative overflow-hidden bg-card/25 shadow-sm ${widthClasses[canvasWidth]} ${canvasBg === "grid" ? "bg-grid" : canvasBg === "dot" ? "bg-dot" : "bg-card/20"}`}>

                                            {/* ANTD STEPPER PIPELINE */}
                                            {comp.id === "steps" && (
                                                <Steps
                                                    setAntdStepActive={setAntdStepActive}
                                                    antdStepActive={antdStepActive}
                                                />
                                            )}

                                            {/* ANTD SEARCHABLE SELECT INTERACTIVE PANEL */}
                                            {comp.id === "select" && (
                                                <Select
                                                    antdSelectedOption={antdSelectedOption}
                                                    antdSelectOpen={antdSelectOpen}
                                                    setAntdSelectOpen={setAntdSelectOpen}
                                                    setAntdSelectedOption={setAntdSelectedOption}
                                                />
                                            )}

                                            {/* ANTD DRAG AND DROP FILE UPLOAD AREA */}
                                            {comp.id === "upload" && (
                                                <Upload
                                                    antdUploadStaged={antdUploadStaged}
                                                    setAntdUploadStaged={setAntdUploadStaged}
                                                />
                                            )}

                                            {/* ANTD CHRONOLOGICAL ACTIVITY TIMELINE DOTS */}
                                            {comp.id === "timeline" && (
                                                <Timeline />
                                            )}

                                            {/* ANTD EMPTY INBOX PLACEHOLDER STATS */}
                                            {comp.id === "empty" && (
                                                <Empty />
                                            )}

                                            {/* ANTD SPIN SYSTEM INDICATOR MODAL */}
                                            {comp.id === "spin" && (
                                                <Spin />
                                            )}

                                            {/* ANTD TRANSACTION RESULT COMPACT DISPLAY HEADER */}
                                            {comp.id === "result" && (
                                                <Result />
                                            )}

                                            {/* ANTD OVERLAY CANVAS SHEET SIDE DRAWER */}
                                            {comp.id === "drawer" && (
                                                <Drawer
                                                    antdDrawerOpen={antdDrawerOpen}
                                                    setAntdDrawerOpen={setAntdDrawerOpen}
                                                />
                                            )}

                                            {/* ANTD POPCONFIRM INSIDE ANCHOR TOOLTIP */}
                                            {comp.id === "popconfirm" && (
                                                <Popconfirm
                                                    antdPopconfirmOpen={antdPopconfirmOpen}
                                                    setAntdPopconfirmOpen={setAntdPopconfirmOpen}
                                                    addToast={addToast}
                                                />
                                            )}

                                            {/* DEFAULT PLACEHOLDER INJECTION WRAPPERS */}
                                            {comp.id === "button" && <Button />}
                                            {comp.id === "input" && <InputComponent />}
                                            {comp.id === "checkbox" && <Checkbox />}
                                            {comp.id === "radio" && <Radio />}
                                            {comp.id === "switch" && <Switch />}
                                            {comp.id === "rating" && <Rating />}
                                            {comp.id === "slider" && <Slider />}
                                            {comp.id === "navbar" && <Navbar />}
                                            {comp.id === "breadcrumb" && <Breadcrumb />}
                                            {comp.id === "pagination" && <Pagination />}
                                            {comp.id === "tabs" && <Tabs />}
                                            {comp.id === "card" && <Card />}
                                            {comp.id === "statistics" && <Statistics />}
                                            {comp.id === "list-group" && <ListGroup />}
                                            {comp.id === "table" && <Table />}
                                            {comp.id === "alert" && <Alert />}
                                            {comp.id === "progress-bar" && <ProgressBar />}
                                            {comp.id === "toast" && <Toast addToast={addToast} />}
                                            {comp.id === "modal" && <Modal setIsModalOpen={setIsModalOpen} />}
                                            {comp.id === "tooltip" && <Tooltip />}
                                            {comp.id === "dropdown" && <Dropdown />}
                                            {comp.id === "hero" && <Hero />}
                                            {comp.id === "metric-card" && <MetricCard />}
                                            {comp.id === "skeleton" && <Skeleton />}
                                            {comp.id === "badge" && <Badge />}
                                            {comp.id === "avatar" && <Avatar />}

                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* CODE PREVIEW GENERATION VIEW */
                                <div className="w-full border border-border rounded-xl bg-card overflow-hidden flex flex-col text-left">
                                    <div className="bg-secondary/40 border-b border-border/80 px-4 py-2 flex items-center justify-between text-xs font-semibold select-none">
                                        <div className="flex items-center gap-1.5">
                                            <Terminal className="h-3.5 w-3.5 text-blue-600" />
                                            <span>Production-Ready Modular React Markup File</span>
                                        </div>
                                        <button
                                            onClick={() => handleCopyCode(comp.id, code)}
                                            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground font-medium py-1 px-2.5 rounded border border-border/80 bg-background/50 cursor-pointer"
                                        >
                                            {copiedStates[comp.id] ? <span className="text-green-500 font-bold">Copied!</span> : <span>Copy Snippet Code</span>}
                                        </button>
                                    </div>
                                    <pre className="p-5 overflow-x-auto text-[11px] font-mono leading-relaxed bg-zinc-950 text-zinc-300 min-h-[220px]">
                                        <code>{code}</code>
                                    </pre>
                                </div>
                            )}

                            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-border/60 select-none">
                                <button onClick={() => setTab(tab === "preview" ? "code" : "preview")} className="text-xs text-muted-foreground hover:text-foreground border border-border px-3.5 py-1.5 rounded-lg hover:bg-muted font-semibold cursor-pointer">
                                    {tab === "preview" ? "View Raw Source Code" : "Return to Live Sandbox Canvas"}
                                </button>
                                <button onClick={() => handleCopyCode(comp.id, code)} className="text-xs bg-blue-600 text-white px-4 py-1.5 rounded-lg font-bold border-0 cursor-pointer hover:bg-blue-700">
                                    Copy Structural Code Component
                                </button>
                            </div>
                        </section>
                    );
                })()}
            </div>
        )
    )
}