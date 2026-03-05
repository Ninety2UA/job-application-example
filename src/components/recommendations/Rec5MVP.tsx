"use client";

import { useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const members = [
  { name: "Brand Alpha", activity: 92, topicRelevance: 88, intentScore: 91, segment: "hot", channel: "attribution" },
  { name: "Brand Beta", activity: 78, topicRelevance: 95, intentScore: 87, segment: "hot", channel: "retention" },
  { name: "Brand Gamma", activity: 85, topicRelevance: 72, intentScore: 79, segment: "warm", channel: "attribution" },
  { name: "Brand Delta", activity: 45, topicRelevance: 88, intentScore: 65, segment: "warm", channel: "profitability" },
  { name: "Brand Epsilon", activity: 62, topicRelevance: 55, intentScore: 58, segment: "warm", channel: "creative" },
  { name: "Brand Zeta", activity: 35, topicRelevance: 42, intentScore: 38, segment: "cold", channel: "attribution" },
  { name: "Brand Eta", activity: 28, topicRelevance: 35, intentScore: 31, segment: "cold", channel: "retention" },
  { name: "Brand Theta", activity: 88, topicRelevance: 92, intentScore: 90, segment: "hot", channel: "profitability" },
  { name: "Brand Iota", activity: 55, topicRelevance: 68, intentScore: 61, segment: "warm", channel: "creative" },
  { name: "Brand Kappa", activity: 70, topicRelevance: 80, intentScore: 75, segment: "warm", channel: "attribution" },
  { name: "Brand Lambda", activity: 20, topicRelevance: 25, intentScore: 22, segment: "cold", channel: "retention" },
  { name: "Brand Mu", activity: 95, topicRelevance: 85, intentScore: 90, segment: "hot", channel: "creative" },
];

const segmentColors: Record<string, string> = {
  hot: "#10b981",
  warm: "#f59e0b",
  cold: "#6b7280",
};

function getSegment(score: number, threshold: number): string {
  if (score >= threshold) return "hot";
  if (score >= threshold - 25) return "warm";
  return "cold";
}

export default function Rec5MVP() {
  const [threshold, setThreshold] = useState(75);
  const [filter, setFilter] = useState<string>("all");

  const data = members.map((m) => ({
    ...m,
    segment: getSegment(m.intentScore, threshold),
  }));

  const filtered = filter === "all" ? data : data.filter((m) => m.channel === filter);
  const hotCount = data.filter((d) => d.segment === "hot").length;
  const warmCount = data.filter((d) => d.segment === "warm").length;

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Community Intent Scoring Dashboard</h3>
        <p className="text-sm text-muted">
          Map eCom Unity engagement to sales-ready intent signals
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <label className="text-sm text-muted">Intent Threshold</label>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="range"
              min={40}
              max={90}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-32 accent-accent"
            />
            <span className="w-10 text-sm font-semibold text-accent">{threshold}</span>
          </div>
        </div>
        <div className="flex gap-1.5">
          {["all", "attribution", "retention", "profitability", "creative"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                filter === f
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-card-border text-muted hover:border-accent/30"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-background p-3 text-center">
          <p className="text-2xl font-bold text-accent">{hotCount}</p>
          <p className="text-xs text-muted">Sales-Ready</p>
        </div>
        <div className="rounded-xl bg-background p-3 text-center">
          <p className="text-2xl font-bold text-amber-500">{warmCount}</p>
          <p className="text-xs text-muted">Nurture</p>
        </div>
        <div className="rounded-xl bg-background p-3 text-center">
          <p className="text-2xl font-bold text-zinc-500">
            {data.filter((d) => d.segment === "cold").length}
          </p>
          <p className="text-xs text-muted">Low Intent</p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              dataKey="activity"
              type="number"
              domain={[0, 100]}
              name="Activity"
              tick={{ fill: "#a1a1aa", fontSize: 12 }}
              label={{ value: "Community Activity", position: "bottom", fill: "#a1a1aa", fontSize: 11 }}
            />
            <YAxis
              dataKey="topicRelevance"
              type="number"
              domain={[0, 100]}
              name="Topic Relevance"
              tick={{ fill: "#a1a1aa", fontSize: 12 }}
              label={{ value: "Topic Relevance", angle: -90, position: "insideLeft", fill: "#a1a1aa", fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{ background: "#141414", border: "1px solid #27272a", borderRadius: 12, fontSize: 12 }}
              formatter={(value, name) => [value, name]}
              labelFormatter={(_, payload) => {
                const item = payload[0]?.payload;
                return item ? `${item.name} (Score: ${item.intentScore})` : "";
              }}
            />
            <Scatter data={filtered}>
              {filtered.map((entry, i) => (
                <Cell key={i} fill={segmentColors[entry.segment]} r={6} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center justify-center gap-4 text-xs">
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          Sales-Ready
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
          Nurture
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-500" />
          Low Intent
        </span>
      </div>

      <p className="mt-4 text-xs text-muted/60">
        Synthetic community data. In production, engagement signals from Slack,
        events, and content interactions would feed the scoring model.
      </p>
    </div>
  );
}
