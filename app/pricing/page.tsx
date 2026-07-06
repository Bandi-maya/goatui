"use client";

import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Check, Shield, Star, Sparkles, HelpCircle } from "lucide-react";
import Button from "@/app/components/ui/button";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  const plans = [
    {
      title: "Community Free",
      price: "0",
      description: "Perfect for personal side projects, hacks, and open-source contributions.",
      buttonText: "Get Started Free",
      buttonVariant: "outline" as const,
      features: [
        "Access to 70+ Core components",
        "Community Discord support",
        "React and NextJS templates basic",
        "Tailwind CSS code copying"
      ],
      recommended: false
    },
    {
      title: "Developer Pro",
      price: billingCycle === "monthly" ? "29" : "19",
      description: "Everything you need to build production-grade web applications with high-fidelity animations.",
      buttonText: "Upgrade to Pro",
      buttonVariant: "primary" as const,
      features: [
        "All Community features included",
        "Access to all 120+ Components",
        "All Blocks & page templates library",
        "Zero-Reload Theme Engine variables",
        "Priority developer support channel"
      ],
      recommended: true
    },
    {
      title: "Team Enterprise",
      price: "Custom",
      description: "Custom design token syncing, integrations support, and private registries for teams.",
      buttonText: "Book Demo Call",
      buttonVariant: "outline" as const,
      features: [
        "All Developer Pro features included",
        "Custom design system token configurations",
        "Private component registry hosting",
        "Unlimited project seats",
        "SLA guaranteed developer support"
      ],
      recommended: false
    }
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-6 py-16 space-y-12 text-center">
        {/* Header section */}
        <div className="space-y-4 max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-[10px] font-bold text-primary uppercase tracking-wider">
            Pricing Plans
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            Flexible Plans for Developers
          </h1>
          <p className="text-sm text-muted-foreground">
            Get access to custom widgets, pre-compiled templates, theme variable editors, and Framer Motion animation engines.
          </p>
        </div>

        {/* Switcher */}
        <div className="flex justify-center">
          <div className="flex items-center bg-secondary/50 border border-border/80 rounded-xl p-1 shadow-soft">
            <button 
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                billingCycle === "monthly" ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Billed Monthly
            </button>
            <button 
              onClick={() => setBillingCycle("annual")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === "annual" ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Billed Annually
              <span className="text-[9px] font-extrabold bg-blue-500/10 border border-blue-500/20 text-primary px-1.5 py-0.2 rounded uppercase">Save 30%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left items-stretch max-w-6xl mx-auto pt-6">
          {plans.map((plan, idx) => (
            <div 
              key={idx}
              className={`border rounded-3xl p-6 flex flex-col justify-between hover:shadow-xl transition-all relative ${
                plan.recommended 
                  ? "border-primary bg-card shadow-xl shadow-primary/5 ring-1 ring-primary/30" 
                  : "border-border bg-card/45"
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-3.5 right-6 inline-flex items-center gap-1 bg-primary text-white text-[9px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border border-primary/20 shadow-md">
                  <Sparkles className="h-3 w-3" />
                  Recommended plan
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-extrabold text-lg text-foreground">{plan.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1 text-foreground">
                  <span className="text-4xl font-extrabold tracking-tight">
                    {plan.price !== "Custom" && "$"}
                    {plan.price}
                  </span>
                  {plan.price !== "Custom" && (
                    <span className="text-xs text-muted-foreground">/ month</span>
                  )}
                </div>

                <div className="pt-4 border-t border-border/60">
                  <ul className="space-y-3 text-xs text-muted-foreground">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-4">
                <Button 
                  variant={plan.buttonVariant} 
                  className="w-full h-11 text-xs font-bold"
                >
                  {plan.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
