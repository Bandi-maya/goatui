"use client";

import React, { useState } from "react";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Activity, Shield, Sparkles, HelpCircle } from "lucide-react";
import Button from "@/app/components/ui/button";

export default function AnimationsPage() {
  const [activeAnim, setActiveAnim] = useState<string | null>(null);

  const animationsList = [
    {
      name: "spring",
      title: "Spring Physics Curve",
      description: "Tasteful dynamic translation animations using physical spring dampening variables.",
      preview: (
        <motion.div
          animate={activeAnim === "spring" ? { x: [0, 80, -40, 20, 0] } : {}}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold"
        >
          S
        </motion.div>
      )
    },
    {
      name: "glow",
      title: "Spotlight Glow Borders",
      description: "Draw outlines around interfaces dynamically based on mouse coordinate vectors.",
      preview: (
        <div className="relative group p-4 border border-border rounded-xl overflow-hidden cursor-pointer w-32 text-center text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,102,255,0.08),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
          Spotlight Hover
        </div>
      )
    },
    {
      name: "draw",
      title: "Outline Draw Path",
      description: "Sequentially draw borders around components using SVG dasharrays path offsets.",
      preview: (
        <div className="relative h-10 w-32 border border-dashed border-border/80 rounded flex items-center justify-center overflow-hidden group">
          <span className="text-[10px] font-mono font-bold text-muted-foreground group-hover:text-primary transition-colors">Draw path</span>
          <div className="absolute inset-0 border border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )
    },
    {
      name: "typography",
      title: "Kinetic Typography",
      description: "Animate character lines sequentially on loading phases or viewport entrances.",
      preview: (
        <div className="flex gap-0.5 overflow-hidden">
          {"OS_MOTION".split("").map((char, i) => (
            <motion.span
              key={i}
              initial={{ y: 15, opacity: 0 }}
              animate={activeAnim === "typography" ? { y: 0, opacity: 1 } : { y: 0, opacity: 0.8 }}
              transition={{ delay: i * 0.05 }}
              className="text-xs font-mono font-bold text-primary"
            >
              {char}
            </motion.span>
          ))}
        </div>
      )
    }
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-6 sm:px-8 py-12 space-y-10 text-left">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Animation Engine</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            A premium collection of high-fidelity developer OS micro-interactions. Tailored for spring-physics engines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {animationsList.map((anim, idx) => (
            <div key={idx} className="border border-border bg-card/45 rounded-2xl p-6 flex flex-col justify-between hover:border-primary/40 transition-colors shadow-soft h-52">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1.5">
                  <h3 className="font-bold text-sm text-foreground">{anim.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">{anim.description}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs font-bold shrink-0"
                  onClick={() => setActiveAnim(anim.name)}
                >
                  Play Trigger
                </Button>
              </div>

              <div className="h-20 bg-secondary/15 rounded-xl border border-border/60 flex items-center justify-center overflow-hidden">
                {anim.preview}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
