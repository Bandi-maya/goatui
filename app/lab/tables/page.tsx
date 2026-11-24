"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import * as TF from "@/components/catalog/TableFamily";
import "@/components/catalog/TableFamily.css";

const VARIANTS: { id: string; name: string; C: React.ComponentType }[] = [
  { id: "v01", name: "SortableGridTable", C: TF.SortableGridTable },
  { id: "v02", name: "ExpandingInvoiceTable", C: TF.ExpandingInvoiceTable },
  { id: "v03", name: "KanbanPipelineTable", C: TF.KanbanPipelineTable },
  { id: "v04", name: "PricingTiersTable", C: TF.PricingTiersTable },
  { id: "v05", name: "FeatureComparisonTable", C: TF.FeatureComparisonTable },
  { id: "v06", name: "CompactDataGrid", C: TF.CompactDataGrid },
  { id: "v07", name: "FloatingCardRowsTable", C: TF.FloatingCardRowsTable },
  { id: "v08", name: "TimelineActivityTable", C: TF.TimelineActivityTable },
  { id: "v09", name: "ProgressMeterTable", C: TF.ProgressMeterTable },
  { id: "v10", name: "SparklineMetricsTable", C: TF.SparklineMetricsTable },
  { id: "v11", name: "HeatmapActivityTable", C: TF.HeatmapActivityTable },
  { id: "v12", name: "TreeFileTable", C: TF.TreeFileTable },
  { id: "v13", name: "ResponsiveStackTable", C: TF.ResponsiveStackTable },
  { id: "v14", name: "GroupedSubtotalTable", C: TF.GroupedSubtotalTable },
  { id: "v15", name: "InlineEditTable", C: TF.InlineEditTable },
  { id: "v16", name: "StatusPulseTable", C: TF.StatusPulseTable },
  { id: "v17", name: "LeaderboardRankTable", C: TF.LeaderboardRankTable },
  { id: "v18", name: "CalendarEventTable", C: TF.CalendarEventTable },
  { id: "v19", name: "SkillMatrixTable", C: TF.SkillMatrixTable },
  { id: "v20", name: "LedgerTotalsTable", C: TF.LedgerTotalsTable },
  { id: "v21", name: "FileManagerTable", C: TF.FileManagerTable },
  { id: "v22", name: "DirectoryRosterTable", C: TF.DirectoryRosterTable },
  { id: "v23", name: "LogStreamTable", C: TF.LogStreamTable },
  { id: "v24", name: "KpiDigestTable", C: TF.KpiDigestTable },
  { id: "v25", name: "PriorityInboxTable", C: TF.PriorityInboxTable },
  { id: "v26", name: "GanttScheduleTable", C: TF.GanttScheduleTable },
  { id: "v27", name: "SegmentedAssignTable", C: TF.SegmentedAssignTable },
  { id: "v28", name: "WideScrollTable", C: TF.WideScrollTable },
  { id: "v29", name: "FilterChipsTable", C: TF.FilterChipsTable },
  { id: "v30", name: "RadialStatusTable", C: TF.RadialStatusTable },
];

function LabInner() {
  const params = useSearchParams();
  const only = params.get("only");
  const demo = params.get("demo") === "1";
  const still = params.get("still") === "1";
  const stillStyle = still ? (
    <style>{`.tf-root *,.tf-root *::before,.tf-root *::after{animation:none!important;transition:none!important} .tfv10-line{stroke-dashoffset:0!important}`}</style>
  ) : null;

  useEffect(() => {
    if (!demo) return;
    // Scripted interactions so a headless capture can record the motion.
    const fire = (sel: string) => {
      const el = document.querySelector<HTMLElement>(sel);
      el?.click();
    };
    const timers = [
      window.setTimeout(() => fire("[data-demo-sort]"), 800),
      window.setTimeout(() => fire("[data-demo-sort]"), 1600),
      window.setTimeout(() => fire("[data-demo-expand]"), 2400),
      window.setTimeout(() => fire("[data-demo-toggle]"), 2400),
      window.setTimeout(() => fire("[data-demo-star]"), 2400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [demo]);

  if (only) {
    const v = VARIANTS.find((x) => x.id === only);
    if (!v) return <div>unknown variant</div>;
    return (
      <main className="tf-lab-single">
        <style>{`body{background:#fff!important} nextjs-portal{display:none!important}`}</style>
        {stillStyle}
        <v.C />
      </main>
    );
  }

  return (
    <main className="tf-lab">
      <style>{`body{background:#fff!important} nextjs-portal{display:none!important}`}</style>
      {stillStyle}
      <h1>GOAT UI - Table family (30 variants)</h1>
      {VARIANTS.map((v) => (
        <section key={v.id} id={v.id} className="tf-lab-cell">
          <h2>
            <span className="tf-lab-num">{v.id}</span> {v.name}
          </h2>
          <v.C />
        </section>
      ))}
    </main>
  );
}

export default function TablesLabPage() {
  return (
    <Suspense fallback={null}>
      <LabInner />
    </Suspense>
  );
}
