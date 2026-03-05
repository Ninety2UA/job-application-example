"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Badge from "@/components/ui/Badge";
import { type Prototype } from "@/data/prototypes";
import Rec1MVP from "./Rec1MVP";
import Rec2MVP from "./Rec2MVP";
import Rec3MVP from "./Rec3MVP";
import Rec4MVP from "./Rec4MVP";
import Rec5MVP from "./Rec5MVP";
import Rec6MVP from "./Rec6MVP";
import Rec7MVP from "./Rec7MVP";
import Rec8MVP from "./Rec8MVP";
import Rec9MVP from "./Rec9MVP";
import Rec10MVP from "./Rec10MVP";

const mvpComponents: Record<number, React.ComponentType> = {
  1: Rec1MVP,
  2: Rec2MVP,
  3: Rec3MVP,
  4: Rec4MVP,
  5: Rec5MVP,
  6: Rec6MVP,
  7: Rec7MVP,
  8: Rec8MVP,
  9: Rec9MVP,
  10: Rec10MVP,
};

export default function PrototypeContent({
  rec,
  prev,
  next,
}: {
  rec: Prototype;
  prev?: Prototype;
  next?: Prototype;
}) {
  const MvpComponent = mvpComponents[rec.id];

  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          href="/prototypes"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          All Prototypes
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-lg font-bold text-accent">
            {rec.id}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {rec.roles.map((role) => (
              <Badge key={role} variant="accent">{role}</Badge>
            ))}
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{rec.title}</h1>
        <p className="mt-2 text-lg text-muted">{rec.subtitle}</p>
      </motion.div>

      {/* Insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-10 rounded-2xl border border-accent/20 bg-accent/5 p-6"
      >
        <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">
          The Insight
        </h2>
        <p className="mt-2 text-foreground leading-relaxed">{rec.insight}</p>
      </motion.div>

      {/* Opportunity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-6 rounded-2xl border border-card-border bg-card p-6"
      >
        <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">
          The Opportunity
        </h2>
        <p className="mt-2 text-muted leading-relaxed">{rec.opportunity}</p>
      </motion.div>

      {/* Proposal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 rounded-2xl border border-card-border bg-card p-6"
      >
        <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">
          The Proposal
        </h2>
        <ul className="mt-3 space-y-2">
          {rec.proposal.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-muted">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Skill Mapping */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-6 rounded-2xl border border-card-border bg-card p-6"
      >
        <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">
          Skill Mapping
        </h2>
        <ul className="mt-3 space-y-2">
          {rec.skillMapping.map((skill, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {skill}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Working MVP */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-10"
      >
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">
          Working MVP Prototype
        </h2>
        <div className="rounded-2xl border border-card-border bg-card p-6">
          {MvpComponent && <MvpComponent />}
        </div>
      </motion.div>

      {/* Prev/Next navigation */}
      <div className="mt-12 flex items-center justify-between">
        {prev ? (
          <Link
            href={`/prototypes/${prev.id}`}
            className="group flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
          >
            <svg className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            {prev.title}
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/prototypes/${next.id}`}
            className="group flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors text-right"
          >
            {next.title}
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </section>
  );
}
