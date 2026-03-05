"use client";

import { motion } from "framer-motion";
import { analysisSections, competitors } from "@/data/analysis";
import ExpandableSection from "@/components/ui/ExpandableSection";
import CompetitorTable from "@/components/sections/CompetitorTable";

export default function AnalysisPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <p className="text-sm font-medium uppercase tracking-widest text-accent">
          Business Analysis
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          KLAR: The eCom Data Operating System
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          A deep dive into KLAR&apos;s business model, competitive positioning,
          growth levers, and market dynamics — researched from public sources.
        </p>
      </motion.div>

      <div className="space-y-4">
        {analysisSections.map((section, i) => (
          <ExpandableSection
            key={section.id}
            title={section.title}
            subtitle={section.subtitle}
            defaultOpen={i === 0}
          >
            <div className="space-y-4">
              {section.highlights && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-4">
                  {section.highlights.map((h) => (
                    <div key={h.label} className="rounded-xl bg-background p-3">
                      <p className="text-lg font-bold text-accent">{h.value}</p>
                      <p className="text-xs text-muted">{h.label}</p>
                    </div>
                  ))}
                </div>
              )}
              {section.content.map((paragraph, j) => (
                <p key={j} className="text-sm leading-relaxed text-muted">
                  {paragraph}
                </p>
              ))}
              {section.id === "competitive-landscape" && (
                <div className="mt-6">
                  <CompetitorTable competitors={competitors} />
                </div>
              )}
            </div>
          </ExpandableSection>
        ))}
      </div>
    </section>
  );
}
