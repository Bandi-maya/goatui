"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LoadersGallery } from "@/components/catalog/LoadersFamily";

function LoadersPreview() {
  const sp = useSearchParams();
  const rawBatch = sp.get("batch");
  const batch = rawBatch ? Number.parseInt(rawBatch, 10) : undefined;
  const only = sp.get("only") || undefined;
  return (
    <LoadersGallery batch={batch !== undefined && Number.isFinite(batch) ? batch : undefined} only={only} />
  );
}

export default function Page() {
  return (
    <main style={{ background: "hsl(var(--background))", minHeight: "100vh" }}>
      <Suspense fallback={null}>
        <LoadersPreview />
      </Suspense>
    </main>
  );
}
