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
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-accent">
              About
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Why KLAR + Dominik
            </h1>
          </div>
          <a
            href="/resume/dominik-benger-resume.pdf"
            download
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-5 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent/20"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Resume
          </a>
        </div>
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

      {/* Core Capabilities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-12"
      >
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
          What I Bring to KLAR
        </h2>
        <p className="mb-6 text-sm text-muted">
          Capabilities shaped by nearly 8 years at Google — now pointed at the problems KLAR is solving.
        </p>
        <div className="space-y-4">
          {[
            {
              icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13h2v8H3zm6-4h2v12H9zm6-3h2v15h-2zm6-3h2v18h-2z" />
                </svg>
              ),
              title: "The Analytics Infrastructure KLAR Customers Need",
              description: "I built KPI scorecards, cohort/LTV models, and executive dashboards in BigQuery for 25+ advertisers — the same kind of reporting pipelines that power KLAR's Data Operating System. I know what actionable analytics looks like from the operator's seat.",
            },
            {
              icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              ),
              title: "Attribution Expertise for a Post-Privacy World",
              description: "At Google, I navigated the iOS 14.5 upheaval firsthand — building SKAdNetwork reporting, designing measurement frameworks that blended MTA with incrementality testing. KLAR's attribution product is solving this exact problem for eCom, and I've lived the technical complexity behind it.",
            },
            {
              icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              title: "AI-Powered Insights at the Speed eCom Demands",
              description: "I've integrated Gemini and Claude into analytics workflows to surface narrative insights from raw data automatically — the kind of automation that turns KLAR's dashboards from something brands check into something that tells them what to do next.",
            },
            {
              icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: "Growth That Scales — From Playbooks to Pipeline",
              description: "I designed GTM playbooks that scaled to 1,500+ clients with 300% YoY investment growth. KLAR's eCom Unity community is a distribution moat no competitor can replicate — I know how to turn community engagement into product adoption and revenue.",
            },
          ].map((cap) => (
            <div key={cap.title} className="flex gap-4 rounded-2xl border border-card-border bg-card p-5 sm:p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                {cap.icon}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{cap.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{cap.description}</p>
              </div>
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
              aria-pressed={activeRole === role.id}
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
