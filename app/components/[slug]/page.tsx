import React from "react";
import Layout from "@/components/Layout";
import { componentsRegistry } from "@/lib/component-registry";
import ComponentDetailWrapper from "@/components/component-detail";

export function generateStaticParams() {
  return componentsRegistry.map((c) => ({
    slug: c.name.toLowerCase(),
  }));
}

export default async function SingleComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Layout>
      <ComponentDetailWrapper slug={slug} />
    </Layout>
  );
}
