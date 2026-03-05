"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { roles, skills } from "@/data/skills-roles";
import Badge from "@/components/ui/Badge";

export default function AboutPage() {
  const [activeRole, setActiveRole] = useState<string | null>(null);

  const filteredSkills = activeRole
    ? skills.filter((s) => s.roles.includes(activeRole))
    : skills;

  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <p className="text-sm font-medium uppercase tracking-widest text-accent">
          About
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Why KLAR + Dominik
        </h1>
      </motion.div>

      {/* Why KLAR narrative */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-12 rounded-2xl border border-accent/20 bg-accent/5 p-6 sm:p-8"
      >
        <p className="text-foreground leading-relaxed">
          I spent nearly 8 years at Google helping the largest app and gaming advertisers in Europe
          turn data into business outcomes. I built KPI scorecards, attribution frameworks,
          and analytics platforms used by thousands. Now I want to do that for eCom brands —
          and KLAR is building exactly the platform I&apos;d want to work with.
        </p>
        <p className="mt-4 text-foreground leading-relaxed">
          What excites me most: KLAR isn&apos;t just another analytics tool. The &quot;Data Operating System&quot;
          vision — combining attribution, profitability, retention, and creative analysis into
          one platform — is the right architecture for where eCom is heading. And the eCom Unity
          community gives you a distribution moat that no competitor can replicate.
        </p>
        <p className="mt-4 text-muted text-sm">
          I&apos;m based in Munich, aligned with &quot;Do Work You Are Proud Of,&quot; and ready to start immediately.
        </p>
      </motion.div>

      {/* Proof Points */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-12"
      >
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">
          Proof Points from Google
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { value: "$XXXmm+", label: "Quarterly Revenue" },
            { value: "40%", label: "Avg. YoY Growth" },
            { value: "3,000+", label: "BI Platform Users" },
            { value: "100%", label: "Client Satisfaction" },
            { value: "25+", label: "Clients Managed" },
            { value: "1,500+", label: "Clients Scaled" },
            { value: "300%", label: "YoY Investment Growth" },
            { value: "55%", label: "Market Export Growth" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-card-border bg-card p-4">
              <p className="text-xl font-bold text-accent">{stat.value}</p>
              <p className="mt-1 text-xs text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Skills-to-Roles Matrix */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">
          Skills-to-Roles Matrix
        </h2>
        <p className="mb-4 text-sm text-muted">
          Click a role to highlight matching skills.
        </p>
        <div className="mb-6 flex flex-wrap gap-2">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setActiveRole(activeRole === role.id ? null : role.id)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                activeRole === role.id
                  ? "border-accent bg-accent text-background"
                  : "border-card-border text-muted hover:border-accent/30"
              }`}
            >
              {role.title}
            </button>
          ))}
          {activeRole && (
            <button
              onClick={() => setActiveRole(null)}
              className="rounded-full border border-card-border px-4 py-2 text-sm text-muted hover:text-foreground transition-colors"
            >
              Show All
            </button>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {filteredSkills.map((skill) => (
            <motion.div
              key={skill.name}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="rounded-xl border border-card-border bg-card p-4"
            >
              <p className="font-medium text-sm">{skill.name}</p>
              <p className="mt-1 text-xs text-muted">{skill.description}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {skill.roles.map((r) => {
                  const role = roles.find((rl) => rl.id === r);
                  return (
                    <Badge
                      key={r}
                      variant={activeRole === r ? "accent" : "default"}
                    >
                      {role?.title || r}
                    </Badge>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-accent/20 bg-accent/5 p-6 sm:p-8 text-center"
      >
        <h2 className="text-2xl font-bold">Let&apos;s Talk</h2>
        <p className="mt-2 text-muted">
          I&apos;d love to discuss how I can contribute to KLAR&apos;s next chapter.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href="mailto:domi@dbenger.com"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
          >
            domi@dbenger.com
          </a>
          <a
            href="https://dbenger.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-card-border px-6 py-3 text-sm font-medium text-muted transition-colors hover:border-accent/30 hover:text-foreground"
          >
            Full Portfolio at dbenger.com
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/dombenger/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-card-border px-6 py-3 text-sm font-medium text-muted transition-colors hover:border-accent/30 hover:text-foreground"
          >
            LinkedIn
          </a>
        </div>
      </motion.div>
    </section>
  );
}
