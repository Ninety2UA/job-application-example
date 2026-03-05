"use client";

import { useState } from "react";

const segments = [
  {
    id: "starter",
    label: "Starter Brand",
    description: "< 1M revenue, 1-2 channels, no data team",
    steps: [
      { title: "Connect Shopify", time: "2 min", done: true },
      { title: "Install KLAR Pixel", time: "5 min", done: true },
      { title: "Connect Meta Ads", time: "3 min", done: true },
      { title: "View First Dashboard", time: "Instant", done: false },
      { title: "Set Up Revenue Goals", time: "5 min", done: false },
    ],
    ttv: "15 minutes",
    features: ["Basic Attribution", "Revenue Dashboard", "P&L Report"],
  },
  {
    id: "scaling",
    label: "Scaling Brand",
    description: "1-10M revenue, 3-5 channels, marketing team",
    steps: [
      { title: "Connect All Ad Platforms", time: "15 min", done: true },
      { title: "Configure Attribution Model", time: "10 min", done: true },
      { title: "Import Historical Data", time: "Auto", done: false },
      { title: "Set Up Creative Tracking", time: "10 min", done: false },
      { title: "Configure Retention Cohorts", time: "5 min", done: false },
      { title: "Invite Team Members", time: "2 min", done: false },
    ],
    ttv: "45 minutes",
    features: ["Multi-Touch Attribution", "Creative Analysis", "Retention Cohorts", "Team Access"],
  },
  {
    id: "enterprise",
    label: "Enterprise Brand",
    description: "10M+ revenue, 5+ channels, data team",
    steps: [
      { title: "Dedicated Onboarding Call", time: "30 min", done: true },
      { title: "Full Platform Integration", time: "1 day", done: true },
      { title: "Custom Attribution Config", time: "2 hours", done: false },
      { title: "MMM Model Calibration", time: "1 week", done: false },
      { title: "Influencer CRM Setup", time: "1 day", done: false },
      { title: "Team Training Workshop", time: "2 hours", done: false },
      { title: "Custom Dashboard Build", time: "1 week", done: false },
    ],
    ttv: "1-2 weeks",
    features: ["Full Suite", "MMM", "Influencer CRM", "Custom Dashboards", "Dedicated CSM"],
  },
];

export default function Rec3MVP() {
  const [selectedSegment, setSelectedSegment] = useState("scaling");
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set([0, 1]));

  const segment = segments.find((s) => s.id === selectedSegment)!;
  const progress = (completedSteps.size / segment.steps.length) * 100;

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
    const seg = segments.find((s) => s.id === id)!;
    const defaults = new Set<number>();
    seg.steps.forEach((s, i) => { if (s.done) defaults.add(i); });
    setCompletedSteps(defaults);
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Onboarding Flow Optimizer</h3>
        <p className="text-sm text-muted">
          Select a brand segment to see the personalized onboarding experience
        </p>
      </div>

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

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Setup Progress</span>
          <span className="font-semibold text-accent">{Math.round(progress)}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-background">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-muted">
          Estimated time-to-value: <span className="text-accent font-medium">{segment.ttv}</span>
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-2 mb-6">
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
            <div className="flex-1">
              <p className={`text-sm ${completedSteps.has(i) ? "text-foreground" : "text-muted"}`}>
                {step.title}
              </p>
            </div>
            <span className="text-xs text-muted">{step.time}</span>
          </button>
        ))}
      </div>

      {/* Features unlocked */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
          Features included in {segment.label}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {segment.features.map((f) => (
            <span
              key={f}
              className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-muted/60">
        Prototype showing segmented onboarding. Click steps to toggle completion.
      </p>
    </div>
  );
}
