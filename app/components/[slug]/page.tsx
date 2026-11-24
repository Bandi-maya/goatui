import React from "react";
import Layout from "@/components/Layout";
import {readdirSync,readFileSync} from "fs";
import {join} from "path";
import ComponentDetailWrapper from "@/components/component-detail";

export function generateStaticParams() {
  return readdirSync(join(process.cwd(),"app/components/ui")).filter(file=>/\.tsx?$/.test(file)&&file!=="OutlineDraw.tsx").map(file=>{const base=file.replace(/\.tsx?$/,"");const name=base[0]===base[0].toLowerCase()?base[0].toUpperCase()+base.slice(1).replace(/-([a-z])/g,(_,letter:string)=>letter.toUpperCase()):base;return {slug:name.toLowerCase()};});
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
