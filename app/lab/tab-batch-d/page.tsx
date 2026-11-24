import TabBatchD, {
  WeatherTabs,
  PlaceDetailsTabs,
  RecipeTabs,
  TokenInspectorTabs,
  HomeControllerTabs,
} from "@/components/catalog/TabBatchD";

export default function Page() {
  return (
    <div style={{ background: "#f3f4f6", padding: "40px 18px" }}>
      <TabBatchD />
      <section
        aria-label="Compact tab bars"
        style={{
          maxWidth: 1040,
          margin: "48px auto 0",
          display: "grid",
          gap: 14,
          gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
        }}
      >
        <WeatherTabs />
        <PlaceDetailsTabs />
        <RecipeTabs />
        <TokenInspectorTabs />
        <HomeControllerTabs />
      </section>
    </div>
  );
}
