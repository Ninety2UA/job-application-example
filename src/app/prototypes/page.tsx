"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { prototypes } from "@/data/prototypes";
import Badge from "@/components/ui/Badge";

const generalRecs = prototypes.filter((r) => r.id <= 5);
const measurementRecs = prototypes.filter((r) => r.id > 5);

export default function PrototypesPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <p className="text-sm font-medium uppercase tracking-widest text-accent">
          Strategic Prototypes
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          What I&apos;d Build at KLAR
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          10 research-backed prototypes — each with a concrete proposal, skill mapping,
          and a working interactive prototype.
        </p>
      </motion.div>

      {/* Cross-Role Prototypes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 }}
        className="mb-8"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-card-border" />
          <span className="text-xs font-medium uppercase tracking-widest text-muted">
            Cross-Role Strategies
          </span>
          <div className="h-px flex-1 bg-card-border" />
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2">
        {generalRecs.map((rec, i) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link
              href={`/prototypes/${rec.id}`}
              className="group block h-full cursor-pointer rounded-2xl border border-card-border bg-card p-6 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-sm font-bold text-accent">
                  {rec.id}
                </span>
                <svg
                  className="h-4 w-4 text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold group-hover:text-accent transition-colors">
                {rec.title}
              </h2>
              <p className="mt-1 text-sm text-muted">{rec.subtitle}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {rec.roles.map((role) => (
                  <Badge key={role} variant="accent">
                    {role}
                  </Badge>
                ))}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* PO Marketing Measurement Deep-Dive */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="mb-8 mt-16"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-accent/30" />
          <span className="text-xs font-medium uppercase tracking-widest text-accent">
            PO Marketing Measurement Deep-Dive
          </span>
          <div className="h-px flex-1 bg-accent/30" />
        </div>
        <p className="text-center text-sm text-muted">
          Five additional prototypes demonstrating deep expertise in attribution, MMM, incrementality,
          and privacy-first measurement — the core of KLAR&apos;s measurement product.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2">
        {measurementRecs.map((rec, i) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.08 }}
          >
            <Link
              href={`/prototypes/${rec.id}`}
              className="group block h-full cursor-pointer rounded-2xl border border-accent/10 bg-card p-6 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-sm font-bold text-accent">
                  {rec.id}
                </span>
                <svg
                  className="h-4 w-4 text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold group-hover:text-accent transition-colors">
                {rec.title}
              </h2>
              <p className="mt-1 text-sm text-muted">{rec.subtitle}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {rec.roles.map((role) => (
                  <Badge key={role} variant="accent">
                    {role}
                  </Badge>
                ))}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
