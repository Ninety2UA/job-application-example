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
  Legend,
  Cell,
} from "recharts";

type MeasuredChannel = "meta" | "google" | "tiktok" | "email";

interface MethodEstimate {
  value: number;
  confidence: number;
  errorMargin: number;
  freshness: "Fresh" | "Stale" | "N/A";
}

const channelData: Record<
  MeasuredChannel,
  {
    name: string;
    mta: MethodEstimate;
    mmm: MethodEstimate;
    incrementality: MethodEstimate;
  }
> = {
  meta: {
    name: "Meta Ads",
    mta: { value: 162000, confidence: 72, errorMargin: 28000, freshness: "Fresh" },
    mmm: { value: 148000, confidence: 85, errorMargin: 18000, freshness: "Fresh" },
    incrementality: {
      value: 138000,
      confidence: 95,
      errorMargin: 8000,
      freshness: "Fresh",
    },
  },
  google: {
    name: "Google Ads",
    mta: { value: 142000, confidence: 78, errorMargin: 22000, freshness: "Fresh" },
    mmm: { value: 128000, confidence: 82, errorMargin: 16000, freshness: "Fresh" },
    incrementality: {
      value: 132000,
      confidence: 93,
      errorMargin: 9000,
      freshness: "Stale",
    },
  },
  tiktok: {
    name: "TikTok",
    mta: { value: 88000, confidence: 58, errorMargin: 35000, freshness: "Fresh" },
    mmm: { value: 112000, confidence: 78, errorMargin: 22000, freshness: "Fresh" },
    incrementality: {
      value: 95000,
      confidence: 90,
      errorMargin: 12000,
      freshness: "N/A",
    },
  },
  email: {
    name: "Email/SMS",
    mta: { value: 72000, confidence: 92, errorMargin: 8000, freshness: "Fresh" },
    mmm: { value: 58000, confidence: 75, errorMargin: 18000, freshness: "Fresh" },
    incrementality: {
      value: 64000,
      confidence: 88,
      errorMargin: 10000,
      freshness: "Stale",
    },
  },
};

const methodColors = {
  MTA: "#8b5cf6",
  MMM: "#3b82f6",
  Incrementality: "#f59e0b",
  Unified: "#10b981",
};

const freshnessColors: Record<string, string> = {
  Fresh: "text-accent",
  Stale: "text-amber-500",
  "N/A": "text-zinc-500",
};

function calcUnifiedWeighted(
  data: {
    mta: MethodEstimate;
    mmm: MethodEstimate;
    incrementality: MethodEstimate;
  },
  weights: { mta: number; mmm: number; inc: number }
) {
  const totalWeight =
    weights.mta * data.mta.confidence +
    weights.mmm * data.mmm.confidence +
    weights.inc * data.incrementality.confidence;

  if (totalWeight === 0) {
    return { value: 0, confidence: 0, errorMargin: 0 };
  }

  const value = Math.round(
    (data.mta.value * weights.mta * data.mta.confidence +
      data.mmm.value * weights.mmm * data.mmm.confidence +
      data.incrementality.value * weights.inc * data.incrementality.confidence) /
      totalWeight
  );

  const confidence = Math.min(
    98,
    Math.round(
      ((data.mta.confidence * weights.mta +
        data.mmm.confidence * weights.mmm +
        data.incrementality.confidence * weights.inc) /
        (weights.mta + weights.mmm + weights.inc || 1)) *
        1.15
    )
  );

  const errorMargin = Math.round(
    (data.mta.errorMargin * (1 - data.mta.confidence / 100) * weights.mta +
      data.mmm.errorMargin * (1 - data.mmm.confidence / 100) * weights.mmm +
      data.incrementality.errorMargin *
        (1 - data.incrementality.confidence / 100) *
        weights.inc) /
      ((weights.mta + weights.mmm + weights.inc || 1) * 0.67)
  );

  return { value, confidence, errorMargin };
}

/** Calculate agreement score (0-100) based on coefficient of variation */
function calcAgreement(data: {
  mta: MethodEstimate;
  mmm: MethodEstimate;
  incrementality: MethodEstimate;
}): number {
  const values = [data.mta.value, data.mmm.value, data.incrementality.value];
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance =
    values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  const stdDev = Math.sqrt(variance);
  const cv = stdDev / mean; // coefficient of variation
  // Map CV to agreement score: CV=0 -> 100%, CV=0.20+ -> 50%
  return Math.max(0, Math.min(100, Math.round(100 - cv * 350)));
}

function AgreementBadge({ score }: { score: number }) {
  if (score >= 85)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
        <span>&#10003;</span> {score}%
      </span>
    );
  if (score >= 60)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
        <span>&#9888;</span> {score}%
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-400">
      <span>&#9888;</span> {score}%
    </span>
  );
}

function getRecommendation(agreement: number, channelName: string): { text: string; type: "success" | "warning" | "danger" } {
  if (agreement >= 85) {
    return {
      text: `High confidence in ${channelName} measurement. All three methods converge. Safe to optimize budget allocation based on unified estimate.`,
      type: "success",
    };
  }
  if (agreement >= 60) {
    return {
      text: `Moderate confidence in ${channelName}. Methods show some divergence \u2014 recommend running an incrementality test to calibrate MTA and MMM models for this channel.`,
      type: "warning",
    };
  }
  return {
    text: `Methods diverge significantly for ${channelName}. Do NOT make major budget decisions based on any single method. Run a geo-holdout incrementality test and recalibrate MMM priors before reallocating spend.`,
    type: "danger",
  };
}

export default function Rec10MVP() {
  const [selectedChannel, setSelectedChannel] =
    useState<MeasuredChannel>("meta");
  const [mtaWeight, setMtaWeight] = useState(50);
  const [mmmWeight, setMmmWeight] = useState(70);
  const [incWeight, setIncWeight] = useState(90);

  const weights = useMemo(
    () => ({
      mta: mtaWeight / 100,
      mmm: mmmWeight / 100,
      inc: incWeight / 100,
    }),
    [mtaWeight, mmmWeight, incWeight]
  );

  const data = channelData[selectedChannel];
  const unified = calcUnifiedWeighted(data, weights);
  const agreement = calcAgreement(data);
  const recommendation = getRecommendation(agreement, data.name);

  // Confidence interval overlap chart data (horizontal ranges)
  const rangeChartData = useMemo(() => {
    const methods = [
      {
        method: "MTA",
        low: data.mta.value - data.mta.errorMargin,
        mid: data.mta.value,
        high: data.mta.value + data.mta.errorMargin,
        color: methodColors.MTA,
      },
      {
        method: "MMM",
        low: data.mmm.value - data.mmm.errorMargin,
        mid: data.mmm.value,
        high: data.mmm.value + data.mmm.errorMargin,
        color: methodColors.MMM,
      },
      {
        method: "Incr.",
        low: data.incrementality.value - data.incrementality.errorMargin,
        mid: data.incrementality.value,
        high: data.incrementality.value + data.incrementality.errorMargin,
        color: methodColors.Incrementality,
      },
      {
        method: "Unified",
        low: unified.value - unified.errorMargin,
        mid: unified.value,
        high: unified.value + unified.errorMargin,
        color: methodColors.Unified,
      },
    ];
    return methods;
  }, [data, unified]);

  // Find the overlap zone of all 3 methods (not unified)
  const overlapZone = useMemo(() => {
    const methods = [
      { low: data.mta.value - data.mta.errorMargin, high: data.mta.value + data.mta.errorMargin },
      { low: data.mmm.value - data.mmm.errorMargin, high: data.mmm.value + data.mmm.errorMargin },
      { low: data.incrementality.value - data.incrementality.errorMargin, high: data.incrementality.value + data.incrementality.errorMargin },
    ];
    const overlapLow = Math.max(...methods.map((m) => m.low));
    const overlapHigh = Math.min(...methods.map((m) => m.high));
    return overlapLow < overlapHigh ? { low: overlapLow, high: overlapHigh } : null;
  }, [data]);

  // Global min/max for the range chart
  const rangeMin = Math.min(...rangeChartData.map((d) => d.low)) * 0.9;
  const rangeMax = Math.max(...rangeChartData.map((d) => d.high)) * 1.05;

  // Overview comparison across all channels
  const overviewData = useMemo(
    () =>
      (Object.keys(channelData) as MeasuredChannel[]).map((ch) => {
        const d = channelData[ch];
        const u = calcUnifiedWeighted(d, weights);
        return {
          name: d.name,
          MTA: d.mta.value,
          MMM: d.mmm.value,
          Incrementality: d.incrementality.value,
          Unified: u.value,
        };
      }),
    [weights]
  );

  // Total portfolio view
  const portfolio = useMemo(() => {
    let totalRevenue = 0;
    let totalErrorSq = 0;
    (Object.keys(channelData) as MeasuredChannel[]).forEach((ch) => {
      const d = channelData[ch];
      const u = calcUnifiedWeighted(d, weights);
      totalRevenue += u.value;
      totalErrorSq += u.errorMargin ** 2; // sum of squares for independent errors
    });
    return {
      revenue: totalRevenue,
      errorMargin: Math.round(Math.sqrt(totalErrorSq)),
    };
  }, [weights]);

  // Per-channel agreement scores
  const channelAgreements = useMemo(
    () =>
      (Object.keys(channelData) as MeasuredChannel[]).map((ch) => ({
        key: ch,
        name: channelData[ch].name,
        agreement: calcAgreement(channelData[ch]),
      })),
    []
  );

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Unified Measurement Framework</h3>
        <p className="text-sm text-muted">
          See how MTA, MMM, and incrementality converge on a triangulated truth
          {" \u2014 "}adjust method weights to explore sensitivity
        </p>
      </div>

      {/* Channel selector */}
      <div className="mb-4 flex flex-wrap gap-2">
        {(Object.keys(channelData) as MeasuredChannel[]).map((ch) => (
          <button
            key={ch}
            onClick={() => setSelectedChannel(ch)}
            className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
              selectedChannel === ch
                ? "border-accent bg-accent/10 text-accent"
                : "border-card-border text-muted hover:border-accent/30"
            }`}
          >
            {channelData[ch].name}
          </button>
        ))}
      </div>

      {/* Method weight sliders */}
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: methodColors.MTA }}
            />
            MTA Weight: {mtaWeight}%
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={mtaWeight}
            onChange={(e) => setMtaWeight(Number(e.target.value))}
            className="mt-1 w-full accent-violet-500"
          />
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: methodColors.MMM }}
            />
            MMM Weight: {mmmWeight}%
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={mmmWeight}
            onChange={(e) => setMmmWeight(Number(e.target.value))}
            className="mt-1 w-full accent-blue-500"
          />
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: methodColors.Incrementality }}
            />
            Incrementality Weight: {incWeight}%
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={incWeight}
            onChange={(e) => setIncWeight(Number(e.target.value))}
            className="mt-1 w-full accent-amber-500"
          />
        </div>
      </div>

      {/* Method cards */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "MTA", est: data.mta, color: methodColors.MTA },
          { label: "MMM", est: data.mmm, color: methodColors.MMM },
          {
            label: "Incrementality",
            est: data.incrementality,
            color: methodColors.Incrementality,
          },
          {
            label: "Unified",
            est: { ...unified, freshness: "Fresh" as const },
            color: methodColors.Unified,
          },
        ].map((m) => (
          <div key={m.label} className="rounded-xl bg-background p-3">
            <div className="mb-1 flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: m.color }}
              />
              <span className="text-[10px] font-medium text-muted">{m.label}</span>
            </div>
            <p className="text-lg font-bold" style={{ color: m.color }}>
              {"\u20AC"}
              {(m.est.value / 1000).toFixed(0)}k
            </p>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-[10px] text-muted">
                {m.est.confidence}% conf.
              </span>
              {"freshness" in m.est && (
                <span
                  className={`text-[10px] font-medium ${
                    freshnessColors[m.est.freshness]
                  }`}
                >
                  {m.est.freshness}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Convergence & Agreement */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-card-border bg-card px-3 py-2">
          <span className="text-xs text-muted">Agreement Score:</span>
          <AgreementBadge score={agreement} />
        </div>
        {channelAgreements
          .filter((c) => c.key !== selectedChannel)
          .map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedChannel(c.key as MeasuredChannel)}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-card-border px-2 py-1.5 text-[10px] text-muted transition-all hover:border-accent/30"
            >
              {c.name}: <AgreementBadge score={c.agreement} />
            </button>
          ))}
      </div>

      {/* Confidence Interval Overlap Visualization */}
      <div className="mb-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
          Confidence Interval Overlap {"\u2014"} {data.name}
        </p>
        <div className="space-y-2.5 rounded-xl border border-card-border bg-card p-4">
          {rangeChartData.map((row) => {
            const totalRange = rangeMax - rangeMin;
            const leftPct = ((row.low - rangeMin) / totalRange) * 100;
            const widthPct = ((row.high - row.low) / totalRange) * 100;
            const midPct = ((row.mid - rangeMin) / totalRange) * 100;

            return (
              <div key={row.method} className="relative">
                <div className="mb-0.5 flex items-center justify-between">
                  <span className="text-[10px] font-medium" style={{ color: row.color }}>
                    {row.method}
                  </span>
                  <span className="text-[10px] text-muted">
                    {"\u20AC"}
                    {(row.mid / 1000).toFixed(0)}k ({"\u00B1\u20AC"}
                    {((row.high - row.low) / 2000).toFixed(0)}k)
                  </span>
                </div>
                <div className="relative h-5 w-full rounded bg-zinc-800/50">
                  {/* Overlap zone highlight (only for non-Unified rows) */}
                  {overlapZone && row.method !== "Unified" && (
                    <div
                      className="absolute top-0 h-full rounded bg-accent/10"
                      style={{
                        left: `${((overlapZone.low - rangeMin) / totalRange) * 100}%`,
                        width: `${((overlapZone.high - overlapZone.low) / totalRange) * 100}%`,
                      }}
                    />
                  )}
                  {/* Range bar */}
                  <div
                    className="absolute top-1 h-3 rounded-full opacity-70"
                    style={{
                      left: `${leftPct}%`,
                      width: `${Math.max(widthPct, 1)}%`,
                      backgroundColor: row.color,
                    }}
                  />
                  {/* Center dot */}
                  <div
                    className="absolute top-0.5 h-4 w-1.5 rounded-full"
                    style={{
                      left: `${midPct}%`,
                      backgroundColor: row.color,
                      transform: "translateX(-50%)",
                    }}
                  />
                </div>
              </div>
            );
          })}
          {/* Overlap zone label */}
          {overlapZone && (
            <div className="mt-1 flex items-center gap-1.5 text-[10px] text-muted">
              <span className="inline-block h-2.5 w-4 rounded bg-accent/20" />
              Agreement zone: {"\u20AC"}
              {(overlapZone.low / 1000).toFixed(0)}k {"\u2013 \u20AC"}
              {(overlapZone.high / 1000).toFixed(0)}k
            </div>
          )}
          {!overlapZone && (
            <div className="mt-1 text-[10px] text-red-400">
              No overlap zone {"\u2014"} methods do not agree within confidence intervals
            </div>
          )}
        </div>
      </div>

      {/* Actionable recommendation */}
      <div
        className={`mb-5 rounded-xl border p-4 ${
          recommendation.type === "success"
            ? "border-accent/20 bg-accent/5"
            : recommendation.type === "warning"
            ? "border-amber-500/20 bg-amber-500/5"
            : "border-red-500/20 bg-red-500/5"
        }`}
      >
        <p
          className={`text-xs font-semibold mb-1 ${
            recommendation.type === "success"
              ? "text-accent"
              : recommendation.type === "warning"
              ? "text-amber-400"
              : "text-red-400"
          }`}
        >
          {recommendation.type === "success"
            ? "Recommendation: Optimize"
            : recommendation.type === "warning"
            ? "Recommendation: Validate"
            : "Recommendation: Investigate"}
        </p>
        <p className="text-sm text-foreground/90">{recommendation.text}</p>
      </div>

      {/* Total portfolio view */}
      <div className="mb-5 rounded-xl border border-accent/20 bg-card p-4">
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted">
          Total Portfolio (All Channels)
        </p>
        <div className="flex items-baseline gap-3">
          <p className="text-2xl font-bold text-accent">
            {"\u20AC"}
            {(portfolio.revenue / 1000).toFixed(0)}k
          </p>
          <span className="text-sm text-muted">
            {"\u00B1 \u20AC"}
            {(portfolio.errorMargin / 1000).toFixed(0)}k
          </span>
        </div>
        <p className="mt-1 text-[10px] text-muted">
          Unified attributed revenue across{" "}
          {Object.keys(channelData).length} channels (weighted by current
          slider settings)
        </p>
      </div>

      {/* Overview all channels */}
      <div className="mt-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
          Cross-Channel Overview
        </p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={overviewData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#a1a1aa", fontSize: 10 }}
              />
              <YAxis
                tick={{ fill: "#a1a1aa", fontSize: 10 }}
                tickFormatter={(v) => `\u20AC${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  background: "#141414",
                  border: "1px solid #27272a",
                  borderRadius: 12,
                  fontSize: 12,
                }}
                formatter={(value) => [
                  `\u20AC${Number(value ?? 0).toLocaleString()}`,
                ]}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar
                dataKey="MTA"
                fill={methodColors.MTA}
                radius={[3, 3, 0, 0]}
              />
              <Bar
                dataKey="MMM"
                fill={methodColors.MMM}
                radius={[3, 3, 0, 0]}
              />
              <Bar
                dataKey="Incrementality"
                fill={methodColors.Incrementality}
                radius={[3, 3, 0, 0]}
              />
              <Bar
                dataKey="Unified"
                fill={methodColors.Unified}
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted/60">
        Synthetic measurement data. In production, KLAR&apos;s unified engine
        dynamically weights each method based on data recency, statistical power,
        and channel characteristics {"\u2014"} producing a single trusted estimate.
      </p>
    </div>
  );
}
