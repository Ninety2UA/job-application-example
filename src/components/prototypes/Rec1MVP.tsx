"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// --- Data types ---

interface ChannelData {
  name: string;
  baseConfidence: number;
  revenue: number;
  pixelHealth: number;
  matchRate: number;
  windowCoverage: number;
}

// --- Synthetic data with per-channel quality factors ---

const channelsBase: ChannelData[] = [
  { name: "Meta Ads", baseConfidence: 92, revenue: 340000, pixelHealth: 95, matchRate: 89, windowCoverage: 91 },
  { name: "Google Ads", baseConfidence: 88, revenue: 280000, pixelHealth: 90, matchRate: 86, windowCoverage: 88 },
  { name: "TikTok", baseConfidence: 61, revenue: 120000, pixelHealth: 58, matchRate: 63, windowCoverage: 62 },
  { name: "Influencer", baseConfidence: 45, revenue: 95000, pixelHealth: 38, matchRate: 52, windowCoverage: 44 },
  { name: "Email/SMS", baseConfidence: 97, revenue: 210000, pixelHealth: 98, matchRate: 96, windowCoverage: 97 },
  { name: "Direct", baseConfidence: 78, revenue: 180000, pixelHealth: 75, matchRate: 80, windowCoverage: 79 },
];

// --- Time period modifiers (simulate data freshness) ---

const periodModifiers: Record<string, number[]> = {
  "7d":  [0, -1, -3, -2, 1, -1],
  "30d": [0, 0, 0, 0, 0, 0],
  "90d": [2, 1, -5, -4, 0, 3],
};

type Period = "7d" | "30d" | "90d";

// --- Helpers ---

const confidenceColors: Record<string, string> = {
  high: "#10b981",
  medium: "#f59e0b",
  low: "#ef4444",
};

function getStatus(score: number, threshold: number): string {
  if (score >= threshold) return "high";
  if (score >= threshold - 20) return "medium";
  return "low";
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}k`;
  return `$${value}`;
}

// --- Custom Tooltip ---

function BarTooltipContent({ active, payload }: { active?: boolean; payload?: Array<{ payload: Record<string, unknown> }> }) {
  if (!active || !payload || payload.length === 0) return null;
  const d = payload[0].payload;
  const status = String(d.status);
  const color = confidenceColors[status] ?? "#a1a1aa";
  return (
    <div style={{ background: "#141414", border: "1px solid #27272a", borderRadius: 12, fontSize: 12, padding: "8px 12px" }}>
      <p className="text-foreground font-medium">{String(d.name)}</p>
      <p className="font-semibold mt-1" style={{ color }}>Confidence: {Number(d.confidence)}%</p>
      <p className="text-muted">Revenue: {formatCurrency(Number(d.revenue))}</p>
      <p className="text-muted">Pixel Health: {Number(d.pixelHealth)}%</p>
      <p className="text-muted">Match Rate: {Number(d.matchRate)}%</p>
    </div>
  );
}

// --- Component ---

export default function Rec1MVP() {
  const [threshold, setThreshold] = useState(70);
  const [period, setPeriod] = useState<Period>("30d");

  const data = useMemo(() => {
    const mods = periodModifiers[period];
    return channelsBase.map((ch, i) => {
      const mod = mods[i];
      const confidence = Math.max(0, Math.min(100, ch.baseConfidence + mod));
      const pixelHealth = Math.max(0, Math.min(100, ch.pixelHealth + mod));
      const matchRate = Math.max(0, Math.min(100, ch.matchRate + Math.round(mod * 0.8)));
      const windowCoverage = Math.max(0, Math.min(100, ch.windowCoverage + Math.round(mod * 1.1)));
      return {
        name: ch.name,
        confidence,
        revenue: ch.revenue,
        pixelHealth,
        matchRate,
        windowCoverage,
        status: getStatus(confidence, threshold),
      };
    });
  }, [threshold, period]);

  const highCount = data.filter((d) => d.status === "high").length;
  const mediumCount = data.filter((d) => d.status === "medium").length;
  const lowCount = data.filter((d) => d.status === "low").length;

  const lowConfidenceChannels = data.filter((d) => d.status === "low" || d.status === "medium");
  const revenueAtRisk = data
    .filter((d) => d.status === "low")
    .reduce((sum, d) => sum + d.revenue, 0);
  const revenueInReview = data
    .filter((d) => d.status === "medium")
    .reduce((sum, d) => sum + d.revenue, 0);
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const riskPct = totalRevenue > 0 ? ((revenueAtRisk / totalRevenue) * 100).toFixed(1) : "0";

  // Build dynamic insight text
  const insightText = useMemo(() => {
    const belowThreshold = data.filter((d) => d.confidence < threshold);
    if (belowThreshold.length === 0) {
      return `All channels meet the ${threshold}% confidence threshold. Your attribution data is reliable across the board.`;
    }
    const names = belowThreshold.map((d) => d.name);
    const lowestChannel = [...belowThreshold].sort((a, b) => a.confidence - b.confidence)[0];
    const suggestions: string[] = [];
    if (lowestChannel.pixelHealth < 60) suggestions.push(`${lowestChannel.name}'s pixel implementation`);
    if (lowestChannel.matchRate < 60) suggestions.push(`${lowestChannel.name}'s match rate configuration`);
    if (lowestChannel.windowCoverage < 60) suggestions.push(`${lowestChannel.name}'s attribution window setup`);
    const suggestionStr = suggestions.length > 0
      ? ` Consider reviewing ${suggestions.join(" and ")}.`
      : "";
    return `${belowThreshold.length} channel${belowThreshold.length > 1 ? "s" : ""} fall${belowThreshold.length === 1 ? "s" : ""} below your ${threshold}% threshold (${names.join(", ")}).${suggestionStr}`;
  }, [data, threshold]);

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Attribution Confidence Dashboard</h3>
          <p className="text-sm text-muted">
            Adjust threshold and time period to evaluate channel data quality
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-muted">Threshold:</label>
          <input
            type="range"
            min={40}
            max={95}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-32 accent-accent"
            aria-label="Confidence threshold"
          />
          <span className="w-10 text-sm font-semibold text-accent">{threshold}%</span>
        </div>
      </div>

      {/* Time period selector */}
      <div className="mb-5 flex gap-1 rounded-lg bg-background p-1 w-fit">
        {(["7d", "30d", "90d"] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              period === p
                ? "bg-accent text-black"
                : "text-muted hover:text-foreground"
            }`}
          >
            {p === "7d" ? "7 Days" : p === "30d" ? "30 Days" : "90 Days"}
          </button>
        ))}
      </div>

      {/* Summary stats */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl bg-background p-3 text-center">
          <p className="text-2xl font-bold text-accent">{highCount}</p>
          <p className="text-xs text-muted">Trusted</p>
        </div>
        <div className="rounded-xl bg-background p-3 text-center">
          <p className="text-2xl font-bold text-amber-500">{mediumCount}</p>
          <p className="text-xs text-muted">Review Needed</p>
        </div>
        <div className="rounded-xl bg-background p-3 text-center">
          <p className="text-2xl font-bold text-red-500">{lowCount}</p>
          <p className="text-xs text-muted">Low Confidence</p>
        </div>
        <div className="rounded-xl bg-background p-3 text-center">
          <p className="text-2xl font-bold text-red-400">{formatCurrency(revenueAtRisk)}</p>
          <p className="text-xs text-muted">Revenue at Risk</p>
        </div>
      </div>

      {/* Bar chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis type="number" domain={[0, 100]} tick={{ fill: "#a1a1aa", fontSize: 12 }} />
            <YAxis dataKey="name" type="category" tick={{ fill: "#a1a1aa", fontSize: 12 }} width={80} />
            <Tooltip content={<BarTooltipContent />} />
            <Bar dataKey="confidence" radius={[0, 6, 6, 0]}>
              {data.map((entry, i) => (
                <Cell key={i} fill={confidenceColors[entry.status]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Data Quality Breakdown Table */}
      <div className="mt-6">
        <h4 className="mb-3 text-sm font-semibold text-foreground">Data Quality Breakdown</h4>
        <div className="overflow-x-auto rounded-xl border border-card-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-card-border bg-background">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted">Channel</th>
                <th className="px-4 py-2.5 text-center text-xs font-medium text-muted">Pixel Health</th>
                <th className="px-4 py-2.5 text-center text-xs font-medium text-muted">Match Rate</th>
                <th className="px-4 py-2.5 text-center text-xs font-medium text-muted">Window Coverage</th>
                <th className="px-4 py-2.5 text-center text-xs font-medium text-muted">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {data.map((ch, i) => (
                <tr key={i} className="border-b border-card-border/50 last:border-0">
                  <td className="px-4 py-2.5 font-medium text-foreground">{ch.name}</td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={ch.pixelHealth >= threshold ? "text-accent" : ch.pixelHealth >= threshold - 20 ? "text-amber-500" : "text-red-500"}>
                      {ch.pixelHealth}%
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={ch.matchRate >= threshold ? "text-accent" : ch.matchRate >= threshold - 20 ? "text-amber-500" : "text-red-500"}>
                      {ch.matchRate}%
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={ch.windowCoverage >= threshold ? "text-accent" : ch.windowCoverage >= threshold - 20 ? "text-amber-500" : "text-red-500"}>
                      {ch.windowCoverage}%
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        ch.status === "high"
                          ? "bg-emerald-500/10 text-accent"
                          : ch.status === "medium"
                          ? "bg-amber-500/10 text-amber-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {ch.confidence}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue at Risk Breakdown */}
      {(revenueAtRisk > 0 || revenueInReview > 0) && (
        <div className="mt-5 rounded-xl border border-card-border bg-background p-4">
          <h4 className="mb-2 text-sm font-semibold text-foreground">Revenue Exposure</h4>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted">Total Attributed Revenue</p>
              <p className="text-lg font-bold text-foreground">{formatCurrency(totalRevenue)}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Revenue in Low-Confidence Channels</p>
              <p className="text-lg font-bold text-red-500">
                {formatCurrency(revenueAtRisk)}{" "}
                <span className="text-sm font-normal text-muted">({riskPct}%)</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">Revenue Needing Review</p>
              <p className="text-lg font-bold text-amber-500">{formatCurrency(revenueInReview)}</p>
            </div>
          </div>
          {/* Revenue bar visual */}
          <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-card-border/30">
            {data
              .filter((d) => d.status === "high")
              .reduce((sum, d) => sum + d.revenue, 0) > 0 && (
              <div
                className="bg-accent transition-all"
                style={{
                  width: `${(data.filter((d) => d.status === "high").reduce((sum, d) => sum + d.revenue, 0) / totalRevenue) * 100}%`,
                }}
              />
            )}
            {revenueInReview > 0 && (
              <div
                className="bg-amber-500 transition-all"
                style={{ width: `${(revenueInReview / totalRevenue) * 100}%` }}
              />
            )}
            {revenueAtRisk > 0 && (
              <div
                className="bg-red-500 transition-all"
                style={{ width: `${(revenueAtRisk / totalRevenue) * 100}%` }}
              />
            )}
          </div>
          <div className="mt-2 flex gap-4 text-xs text-muted">
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-accent" /> Trusted
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-500" /> Review
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-red-500" /> At Risk
            </span>
          </div>
        </div>
      )}

      {/* Dynamic Insight Card */}
      <div className="mt-5 rounded-xl border border-card-border bg-background p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10">
            <svg className="h-3.5 w-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Insight</h4>
            <p className="mt-0.5 text-sm text-muted">{insightText}</p>
            {lowConfidenceChannels.length > 0 && (
              <p className="mt-1.5 text-xs text-muted/60">
                Tip: Channels with pixel health below 60% typically see the biggest confidence lift from implementation fixes.
              </p>
            )}
          </div>
        </div>
      </div>

      <p className="mt-5 text-xs text-muted/60">
        Synthetic data for demonstration. In production, confidence scores are
        calculated from pixel health, match rates, and attribution window coverage.
      </p>
    </div>
  );
}
