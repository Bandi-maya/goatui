export default function Page() {
  return (
    <iframe
      src="/kage/kage.html"
      title="Kage"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        border: 0,
        zIndex: 60,
        background: "#05070a",
      }}
    />
  );
}
