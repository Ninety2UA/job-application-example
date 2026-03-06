"use client";

import { useState, useMemo } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Step {
  title: string;
  time: string;          // display label
  timeMinutes: number;   // numeric for computation
  done: boolean;
  unlocksFeatures?: string[];
}

interface Milestone {
  id: string;
  label: string;
  description: string;
  requiredSteps: number[]; // indices of steps that count toward this milestone
}

interface Segment {
  id: string;
  label: string;
  description: string;
  steps: Step[];
  ttv: string;
  features: string[];
  milestones: Milestone[];
  benchmarkProgress: number; // average brand progress % at this stage
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const segments: Segment[] = [
  {
    id: "starter",
    label: "Starter Brand",
    description: "< 1M revenue, 1-2 channels, no data team",
    steps: [
      { title: "Connect Shopify", time: "2 min", timeMinutes: 2, done: true, unlocksFeatures: ["Revenue Dashboard"] },
      { title: "Install KLAR Pixel", time: "5 min", timeMinutes: 5, done: true, unlocksFeatures: ["Basic Attribution"] },
      { title: "Connect Meta Ads", time: "3 min", timeMinutes: 3, done: true, unlocksFeatures: ["Basic Attribution"] },
      { title: "View First Dashboard", time: "1 min", timeMinutes: 1, done: false, unlocksFeatures: ["Revenue Dashboard"] },
      { title: "Set Up Revenue Goals", time: "5 min", timeMinutes: 5, done: false, unlocksFeatures: ["P&L Report"] },
    ],
    ttv: "15 minutes",
    features: ["Basic Attribution", "Revenue Dashboard", "P&L Report"],
    milestones: [
      { id: "connected", label: "Connected", description: "Data sources linked", requiredSteps: [0, 1, 2] },
      { id: "first-insight", label: "First Insight", description: "Viewed first dashboard", requiredSteps: [3] },
      { id: "fully-activated", label: "Fully Activated", description: "All steps completed", requiredSteps: [0, 1, 2, 3, 4] },
    ],
    benchmarkProgress: 72,
  },
  {
    id: "scaling",
    label: "Scaling Brand",
    description: "1-10M revenue, 3-5 channels, marketing team",
    steps: [
      { title: "Connect All Ad Platforms", time: "15 min", timeMinutes: 15, done: true, unlocksFeatures: ["Multi-Touch Attribution"] },
      { title: "Configure Attribution Model", time: "10 min", timeMinutes: 10, done: true, unlocksFeatures: ["Multi-Touch Attribution"] },
      { title: "Import Historical Data", time: "5 min", timeMinutes: 5, done: false, unlocksFeatures: ["Retention Cohorts"] },
      { title: "Set Up Creative Tracking", time: "10 min", timeMinutes: 10, done: false, unlocksFeatures: ["Creative Analysis"] },
      { title: "Configure Retention Cohorts", time: "5 min", timeMinutes: 5, done: false, unlocksFeatures: ["Retention Cohorts"] },
      { title: "Invite Team Members", time: "2 min", timeMinutes: 2, done: false, unlocksFeatures: ["Team Access"] },
    ],
    ttv: "45 minutes",
    features: ["Multi-Touch Attribution", "Creative Analysis", "Retention Cohorts", "Team Access"],
    milestones: [
      { id: "connected", label: "Connected", description: "Platforms linked & attribution set", requiredSteps: [0, 1] },
      { id: "first-insight", label: "First Insight", description: "Historical data imported", requiredSteps: [2] },
      { id: "fully-activated", label: "Fully Activated", description: "All steps completed", requiredSteps: [0, 1, 2, 3, 4, 5] },
    ],
    benchmarkProgress: 55,
  },
  {
    id: "enterprise",
    label: "Enterprise Brand",
    description: "10M+ revenue, 5+ channels, data team",
    steps: [
      { title: "Dedicated Onboarding Call", time: "30 min", timeMinutes: 30, done: true, unlocksFeatures: ["Dedicated CSM"] },
      { title: "Full Platform Integration", time: "60 min", timeMinutes: 60, done: true, unlocksFeatures: ["Full Suite"] },
      { title: "Custom Attribution Config", time: "120 min", timeMinutes: 120, done: false, unlocksFeatures: ["Full Suite"] },
      { title: "MMM Model Calibration", time: "1 week", timeMinutes: 2400, done: false, unlocksFeatures: ["MMM"] },
      { title: "Influencer CRM Setup", time: "1 day", timeMinutes: 480, done: false, unlocksFeatures: ["Influencer CRM"] },
      { title: "Team Training Workshop", time: "2 hours", timeMinutes: 120, done: false, unlocksFeatures: ["Custom Dashboards"] },
      { title: "Custom Dashboard Build", time: "1 week", timeMinutes: 2400, done: false, unlocksFeatures: ["Custom Dashboards"] },
    ],
    ttv: "1-2 weeks",
    features: ["Full Suite", "MMM", "Influencer CRM", "Custom Dashboards", "Dedicated CSM"],
    milestones: [
      { id: "connected", label: "Connected", description: "Onboarded & integrated", requiredSteps: [0, 1] },
      { id: "first-insight", label: "First Insight", description: "Attribution configured", requiredSteps: [2] },
      { id: "fully-activated", label: "Fully Activated", description: "All steps completed", requiredSteps: [0, 1, 2, 3, 4, 5, 6] },
    ],
    benchmarkProgress: 38,
  },
];

/* ------------------------------------------------------------------ */
/*  Helper: format remaining time                                      */
/* ------------------------------------------------------------------ */

function formatTimeRemaining(minutes: number): string {
  if (minutes <= 0) return "Complete!";
  if (minutes < 60) return `~${minutes} min remaining`;
  if (minutes < 1440) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `~${hours}h ${mins}m remaining` : `~${hours}h remaining`;
  }
  const days = Math.round(minutes / 1440);
  return `~${days} day${days > 1 ? "s" : ""} remaining`;
}

/* ------------------------------------------------------------------ */
/*  Helper: health score (0-100)                                       */
/* ------------------------------------------------------------------ */

function computeHealthScore(
  completedCount: number,
  totalSteps: number,
  benchmarkProgress: number
): number {
  if (totalSteps === 0) return 0;
  const progress = (completedCount / totalSteps) * 100;
  // Score is based on progress relative to benchmark:
  // At benchmark = 70, ahead = 85-100, behind = proportionally lower
  const ratio = benchmarkProgress > 0 ? progress / benchmarkProgress : 1;
  const score = Math.min(100, Math.round(ratio * 70 + (progress / 100) * 30));
  return Math.max(0, score);
}

function healthColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 50) return "text-yellow-400";
  return "text-red-400";
}

function healthBgColor(score: number): string {
  if (score >= 80) return "bg-emerald-400";
  if (score >= 50) return "bg-yellow-400";
  return "bg-red-400";
}

function healthLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 50) return "On Track";
  return "Needs Attention";
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Rec3MVP() {
  const [selectedSegment, setSelectedSegment] = useState("scaling");
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set([0, 1]));

  const segment = segments.find((s) => s.id === selectedSegment) ?? segments[1];
  const progress = (completedSteps.size / segment.steps.length) * 100;

  /* Derived computations */
  const timeRemaining = useMemo(() => {
    let total = 0;
    segment.steps.forEach((step, i) => {
      if (!completedSteps.has(i)) total += step.timeMinutes;
    });
    return total;
  }, [segment, completedSteps]);

  const healthScore = useMemo(
    () => computeHealthScore(completedSteps.size, segment.steps.length, segment.benchmarkProgress),
    [completedSteps.size, segment]
  );

  /* Feature unlock map: feature -> is unlocked */
  const featureUnlockMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    segment.features.forEach((f) => { map[f] = false; });
    // A feature is unlocked if ALL steps that unlock it are completed
    segment.features.forEach((feature) => {
      const stepsForFeature = segment.steps
        .map((step, idx) => ({ step, idx }))
        .filter(({ step }) => step.unlocksFeatures?.includes(feature));
      if (stepsForFeature.length === 0) {
        map[feature] = false;
      } else {
        map[feature] = stepsForFeature.every(({ idx }) => completedSteps.has(idx));
      }
    });
    return map;
  }, [segment, completedSteps]);

  const unlockedCount = Object.values(featureUnlockMap).filter(Boolean).length;

  /* Milestone progress */
  const milestoneData = useMemo(() => {
    return segment.milestones.map((m) => {
      const done = m.requiredSteps.filter((i) => completedSteps.has(i)).length;
      const total = m.requiredSteps.length;
      const complete = done === total;
      return { ...m, done, total, complete, pct: Math.round((done / total) * 100) };
    });
  }, [segment, completedSteps]);

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleSegmentChange = (id: string) => {
    setSelectedSegment(id);
    const seg = segments.find((s) => s.id === id) ?? segments[1];
    const defaults = new Set<number>();
    seg.steps.forEach((s, i) => { if (s.done) defaults.add(i); });
    setCompletedSteps(defaults);
  };

  /* Gauge SVG for health score */
  const gaugeRadius = 36;
  const gaugeCircumference = 2 * Math.PI * gaugeRadius;
  const gaugeOffset = gaugeCircumference - (healthScore / 100) * gaugeCircumference;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Onboarding Flow Optimizer</h3>
        <p className="text-sm text-muted">
          Select a brand segment to see the personalized onboarding experience
        </p>
      </div>

      {/* Segment selector */}
      <div className="mb-6 grid grid-cols-3 gap-2">
        {segments.map((seg) => (
          <button
            key={seg.id}
            onClick={() => handleSegmentChange(seg.id)}
            className={`rounded-xl border p-3 text-left transition-all ${
              selectedSegment === seg.id
                ? "border-accent bg-accent/5"
                : "border-card-border hover:border-accent/30"
            }`}
          >
            <p className="text-sm font-semibold">{seg.label}</p>
            <p className="mt-0.5 text-xs text-muted">{seg.description}</p>
          </button>
        ))}
      </div>

      {/* Stats row: Time remaining + Health score + Features unlocked */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {/* Time remaining */}
        <div className="rounded-xl border border-card-border bg-card p-3 text-center">
          <p className="text-xs text-muted uppercase tracking-wider mb-1">Time Left</p>
          <p className={`text-sm font-bold ${timeRemaining === 0 ? "text-accent" : "text-foreground"}`}>
            {formatTimeRemaining(timeRemaining)}
          </p>
        </div>

        {/* Health score gauge */}
        <div className="rounded-xl border border-card-border bg-card p-3 flex flex-col items-center">
          <p className="text-xs text-muted uppercase tracking-wider mb-1">Health Score</p>
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40" cy="40" r={gaugeRadius}
                fill="none" stroke="#27272a" strokeWidth="6"
              />
              <circle
                cx="40" cy="40" r={gaugeRadius}
                fill="none"
                stroke={healthScore >= 80 ? "#34d399" : healthScore >= 50 ? "#facc15" : "#f87171"}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={gaugeCircumference}
                strokeDashoffset={gaugeOffset}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-lg font-bold ${healthColor(healthScore)}`}>{healthScore}</span>
            </div>
          </div>
          <p className={`text-xs font-medium mt-0.5 ${healthColor(healthScore)}`}>{healthLabel(healthScore)}</p>
        </div>

        {/* Features unlocked */}
        <div className="rounded-xl border border-card-border bg-card p-3 text-center">
          <p className="text-xs text-muted uppercase tracking-wider mb-1">Unlocked</p>
          <p className="text-2xl font-bold text-foreground">
            {unlockedCount}<span className="text-sm text-muted font-normal">/{segment.features.length}</span>
          </p>
          <p className="text-xs text-muted">features</p>
        </div>
      </div>

      {/* Progress bar + benchmark comparison */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Setup Progress</span>
          <span className="font-semibold text-accent">{Math.round(progress)}%</span>
        </div>
        <div className="relative mt-2 h-3 overflow-hidden rounded-full bg-background">
          {/* Benchmark marker */}
          <div
            className="absolute top-0 h-full w-0.5 bg-yellow-400/60 z-10"
            style={{ left: `${segment.benchmarkProgress}%` }}
          />
          {/* Progress fill */}
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between">
          <p className="text-xs text-muted">
            Est. time-to-value: <span className="text-accent font-medium">{segment.ttv}</span>
          </p>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="inline-block w-2 h-2 rounded-full bg-yellow-400/60" />
            <span className="text-muted">
              Avg. {segment.label}: {segment.benchmarkProgress}%
            </span>
          </div>
        </div>
        {/* Benchmark comparison insight */}
        <div className={`mt-2 rounded-lg px-3 py-2 text-xs font-medium ${
          progress >= segment.benchmarkProgress
            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
        }`}>
          {progress >= segment.benchmarkProgress
            ? `You're ahead of the average ${segment.label.toLowerCase()} by ${Math.round(progress - segment.benchmarkProgress)} percentage points. Great pace!`
            : `You're ${Math.round(segment.benchmarkProgress - progress)} points behind the average ${segment.label.toLowerCase()}. Complete the next step to catch up.`
          }
        </div>
      </div>

      {/* Activation milestones */}
      <div className="mb-6">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
          Activation Milestones
        </p>
        <div className="grid grid-cols-3 gap-2">
          {milestoneData.map((m) => (
            <div
              key={m.id}
              className={`rounded-xl border p-3 text-center transition-all ${
                m.complete
                  ? "border-accent bg-accent/5"
                  : "border-card-border"
              }`}
            >
              {/* Icon */}
              <div className={`mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full ${
                m.complete ? "bg-accent" : "bg-card-border/30"
              }`}>
                {m.id === "connected" && (
                  <svg className={`h-4 w-4 ${m.complete ? "text-background" : "text-muted"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101" />
                  </svg>
                )}
                {m.id === "first-insight" && (
                  <svg className={`h-4 w-4 ${m.complete ? "text-background" : "text-muted"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
                {m.id === "fully-activated" && (
                  <svg className={`h-4 w-4 ${m.complete ? "text-background" : "text-muted"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <p className={`text-xs font-semibold ${m.complete ? "text-accent" : "text-foreground"}`}>
                {m.label}
              </p>
              <p className="text-[10px] text-muted mt-0.5">{m.description}</p>
              {/* Mini progress bar */}
              {!m.complete && (
                <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-background">
                  <div
                    className="h-full rounded-full bg-accent/50 transition-all duration-500"
                    style={{ width: `${m.pct}%` }}
                  />
                </div>
              )}
              {m.complete && (
                <p className="mt-1 text-[10px] text-accent font-medium">Achieved</p>
              )}
              {!m.complete && (
                <p className="mt-1 text-[10px] text-muted">{m.done}/{m.total} steps</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Steps checklist */}
      <div className="space-y-2 mb-6">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
          Setup Steps
        </p>
        {segment.steps.map((step, i) => (
          <button
            key={i}
            onClick={() => toggleStep(i)}
            className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${
              completedSteps.has(i)
                ? "border-accent/20 bg-accent/5"
                : "border-card-border hover:border-accent/30"
            }`}
          >
            <div
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                completedSteps.has(i)
                  ? "border-accent bg-accent"
                  : "border-card-border"
              }`}
            >
              {completedSteps.has(i) && (
                <svg className="h-3 w-3 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${completedSteps.has(i) ? "text-foreground" : "text-muted"}`}>
                {step.title}
              </p>
              {step.unlocksFeatures && step.unlocksFeatures.length > 0 && (
                <p className="text-[10px] text-muted/60 mt-0.5 truncate">
                  Unlocks: {step.unlocksFeatures.join(", ")}
                </p>
              )}
            </div>
            <span className="text-xs text-muted shrink-0">{step.time}</span>
          </button>
        ))}
      </div>

      {/* Feature unlock visualization */}
      <div className="mb-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
          Feature Access — {segment.label}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {segment.features.map((f) => {
            const unlocked = featureUnlockMap[f];
            return (
              <div
                key={f}
                className={`relative rounded-xl border p-3 text-center transition-all duration-500 ${
                  unlocked
                    ? "border-accent/30 bg-accent/5"
                    : "border-card-border bg-card opacity-50"
                }`}
              >
                {/* Lock / unlock icon */}
                <div className={`mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full ${
                  unlocked ? "bg-accent/20" : "bg-card-border/30"
                }`}>
                  {unlocked ? (
                    <svg className="h-3.5 w-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg className="h-3.5 w-3.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                </div>
                <p className={`text-xs font-medium ${unlocked ? "text-accent" : "text-muted"}`}>
                  {f}
                </p>
                {unlocked && (
                  <span className="mt-1 inline-block rounded-full bg-accent/10 px-2 py-0.5 text-[10px] text-accent">
                    Active
                  </span>
                )}
                {!unlocked && (
                  <span className="mt-1 inline-block rounded-full bg-card-border/30 px-2 py-0.5 text-[10px] text-muted">
                    Locked
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-xs text-muted/60">
        Prototype showing segmented onboarding with health scoring, benchmark comparison, milestone tracking, and feature unlocking. Click steps to toggle completion.
      </p>
    </div>
  );
}
