import "@/components/catalog/ChartFamily.css";
import {
  StatDeltaCard,
  SparklineGradient,
  RoundedBars,
  GradientHBars,
  DonutCenter,
  SegmentedDonut,
  RadialProgress,
  SemicircleGauge,
  HeatmapGrid,
  AreaLineChart,
  StackedBars,
  ActivityRings,
  BulletChart,
  SparkBarMini,
  CountUpStat,
  IconStatCard,
  GroupedBars,
  TrendBadgeCard,
  CandlestickChart,
  FunnelChart,
  ScatterPlot,
  RadarChart,
  StepLineChart,
  DotGauge,
  FlipStatCard,
  WaterfallChart,
  MiniPieLegend,
  RangeStatBar,
  PulseLiveStat,
  ProgressList,
} from "@/components/catalog/ChartFamily";

export const metadata = {
  title: "Charts & stats | GOAT UI lab",
  description: "30 copy-paste chart and stat components, SVG only, no chart libraries.",
};

const FAMILY = [
  { name: "StatDeltaCard", C: StatDeltaCard },
  { name: "SparklineGradient", C: SparklineGradient },
  { name: "RoundedBars", C: RoundedBars },
  { name: "GradientHBars", C: GradientHBars },
  { name: "DonutCenter", C: DonutCenter },
  { name: "SegmentedDonut", C: SegmentedDonut },
  { name: "RadialProgress", C: RadialProgress },
  { name: "SemicircleGauge", C: SemicircleGauge },
  { name: "HeatmapGrid", C: HeatmapGrid },
  { name: "AreaLineChart", C: AreaLineChart },
  { name: "StackedBars", C: StackedBars },
  { name: "ActivityRings", C: ActivityRings },
  { name: "BulletChart", C: BulletChart },
  { name: "SparkBarMini", C: SparkBarMini },
  { name: "CountUpStat", C: CountUpStat },
  { name: "IconStatCard", C: IconStatCard },
  { name: "GroupedBars", C: GroupedBars },
  { name: "TrendBadgeCard", C: TrendBadgeCard },
  { name: "CandlestickChart", C: CandlestickChart },
  { name: "FunnelChart", C: FunnelChart },
  { name: "ScatterPlot", C: ScatterPlot },
  { name: "RadarChart", C: RadarChart },
  { name: "StepLineChart", C: StepLineChart },
  { name: "DotGauge", C: DotGauge },
  { name: "FlipStatCard", C: FlipStatCard },
  { name: "WaterfallChart", C: WaterfallChart },
  { name: "MiniPieLegend", C: MiniPieLegend },
  { name: "RangeStatBar", C: RangeStatBar },
  { name: "PulseLiveStat", C: PulseLiveStat },
  { name: "ProgressList", C: ProgressList },
];

export default function ChartsLabPage() {
  return (
    <main className="gf-lab">
      <header className="gf-lab-head">
        <p className="gf-lab-eyebrow">GOAT UI lab</p>
        <h1>Charts &amp; stats</h1>
        <p>
          30 copy-paste components. SVG only, spring physics, reduced-motion aware.
          No chart libraries.
        </p>
      </header>
      <div className="gf-grid" id="gf-grid">
        {FAMILY.map(({ name, C }, i) => (
          <figure className="gf-lab-item" key={name} data-gf-idx={i}>
            <figcaption>
              <span className="gf-lab-num">{String(i + 1).padStart(2, "0")}</span>
              <code>{name}</code>
            </figcaption>
            <C />
          </figure>
        ))}
      </div>
    </main>
  );
}
