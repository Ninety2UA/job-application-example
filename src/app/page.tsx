"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import EmbeddedChat from "@/components/layout/EmbeddedChat";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 text-sm font-medium uppercase tracking-widest text-accent"
          >
            An Interactive Job Application
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl"
          >
            I didn&apos;t write a cover letter.{" "}
            <span className="text-accent" style={{ textShadow: "0 0 40px rgba(16,185,129,0.15)" }}>
              I built this instead.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mx-auto mt-6 max-w-xl text-lg text-muted"
          >
            Deep business research, 10 strategic prototypes with working demos,
            and an AI assistant — all built for KLAR.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link
              href="/analysis"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
            >
              See What I Found
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/prototypes"
              className="inline-flex items-center gap-2 rounded-full border border-card-border px-8 py-3.5 text-sm font-medium text-muted transition-colors hover:border-accent/30 hover:text-foreground"
            >
              View Prototypes
            </Link>
            <a
              href="/resume/dominik-benger-resume.pdf"
              download
              className="inline-flex items-center gap-2 rounded-full border border-card-border px-8 py-3.5 text-sm font-medium text-muted transition-colors hover:border-accent/30 hover:text-foreground"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Resume
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 grid grid-cols-3 gap-6 text-center"
          >
            {[
              { value: "10", label: "Strategic Prototypes" },
              { value: "10", label: "Working MVP Prototypes" },
              { value: "4", label: "Target Roles" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-accent">{stat.value}</p>
                <p className="mt-1 text-xs text-muted">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Embedded Chat */}
      <section className="px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl"
        >
          <p className="mb-4 text-center text-sm font-medium uppercase tracking-widest text-accent">
            Have Questions?
          </p>
          <h2 className="mb-8 text-center text-2xl font-bold tracking-tight sm:text-3xl">
            Ask the AI assistant
          </h2>
          <EmbeddedChat />
          <p className="mt-4 text-center text-xs text-muted/60">
            Built by{" "}
            <a href="https://dbenger.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-muted">
              Dominik Benger
            </a>{" "}
            for{" "}
            <a href="https://getklar.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-muted">
              KLAR
            </a>
          </p>
        </motion.div>
      </section>
    </>
  );
}
