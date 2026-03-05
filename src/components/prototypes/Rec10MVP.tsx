"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ErrorBar,
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

const channelData: Record<MeasuredChannel, { name: string; mta: MethodEstimate; mmm: MethodEstimate; incrementality: MethodEstimate }> = {
  meta: {
    name: "Meta Ads",
    mta:            { value: 162000, confidence: 72, errorMargin: 28000, freshness: "Fresh" },
    mmm:            { value: 148000, confidence: 85, errorMargin: 18000, freshness: "Fresh" },
    incrementality: { value: 138000, confidence: 95, errorMargin: 8000,  freshness: "Fresh" },
  },
  google: {
    name: "Google Ads",
    mta:            { value: 142000, confidence: 78, errorMargin: 22000, freshness: "Fresh" },
    mmm:            { value: 128000, confidence: 82, errorMargin: 16000, freshness: "Fresh" },
    incrementality: { value: 132000, confidence: 93, errorMargin: 9000,  freshness: "Stale" },
  },
  tiktok: {
    name: "TikTok",
    mta:            { value: 88000,  confidence: 58, errorMargin: 35000, freshness: "Fresh" },
    mmm:            { value: 112000, confidence: 78, errorMargin: 22000, freshness: "Fresh" },
    incrementality: { value: 95000,  confidence: 90, errorMargin: 12000, freshness: "N/A" },
  },
  email: {
    name: "Email/SMS",
    mta:            { value: 72000,  confidence: 92, errorMargin: 8000,  freshness: "Fresh" },
    mmm:            { value: 58000,  confidence: 75, errorMargin: 18000, freshness: "Fresh" },
    incrementality: { value: 64000,  confidence: 88, errorMargin: 10000, freshness: "Stale" },
  },
};

function calcUnified(data: { mta: MethodEstimate; mmm: MethodEstimate; incrementality: MethodEstimate }) {
  // Weighted by confidence
  const totalConf = data.mta.confidence + data.mmm.confidence + data.incrementality.confidence;
  const value = Math.round(
    (data.mta.value * data.mta.confidence +
     data.mmm.value * data.mmm.confidence +
     data.incrementality.value * data.incrementality.confidence) /
    totalConf
  );
  const confidence = Math.min(98, Math.round((totalConf / 3) * 1.15));
  const errorMargin = Math.round(
    (data.mta.errorMargin * (1 - data.mta.confidence / 100) +
     data.mmm.errorMargin * (1 - data.mmm.confidence / 100) +
     data.incrementality.errorMargin * (1 - data.incrementality.confidence / 100)) / 2
  );
  return { value, confidence, errorMargin };
}

const methodColors = {
  MTA: "#8b5cf6",
  MMM: "#3b82f6",
  Incrementality: "#f59e0b",
  Unified: "#10b981",
};

const freshnessColors: Record<string, string> = {
  Fresh: "text-accent",
  Stale: "text-amber-500",
  "N/A": "text-muted/40",
};

export default function Rec10MVP() {
  const [selectedChannel, setSelectedChannel] = useState<MeasuredChannel>("meta");

  const data = channelData[selectedChannel];
  const unified = calcUnified(data);

  const chartData = [
    { method: "MTA", Value: data.mta.value, error: data.mta.errorMargin },
    { method: "MMM", Value: data.mmm.value, error: data.mmm.errorMargin },
    { method: "Incrementality", Value: data.incrementality.value, error: data.incrementality.errorMargin },
    { method: "Unified", Value: unified.value, error: unified.errorMargin },
  ];

  // Overview comparison across all channels
  const overviewData = (Object.keys(channelData) as MeasuredChannel[]).map((ch) => {
    const d = channelData[ch];
    const u = calcUnified(d);
    return {
      name: d.name,
      MTA: d.mta.value,
      MMM: d.mmm.value,
      Incrementality: d.incrementality.value,
      Unified: u.value,
    };
  });

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Unified Measurement Framework</h3>
        <p className="text-sm text-muted">
          See how MTA, MMM, and incrementality converge on a triangulated truth
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
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

      {/* Method cards */}
      <div className="mb-4 grid grid-cols-4 gap-3">
        {[
          { label: "MTA", est: data.mta, color: methodColors.MTA },
          { label: "MMM", est: data.mmm, color: methodColors.MMM },
          { label: "Incrementality", est: data.incrementality, color: methodColors.Incrementality },
          { label: "Unified", est: { ...unified, freshness: "Fresh" as const }, color: methodColors.Unified },
        ].map((m) => (
          <div key={m.label} className="rounded-xl bg-background p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: m.color }} />
              <span className="text-[10px] font-medium text-muted">{m.label}</span>
            </div>
            <p className="text-lg font-bold" style={{ color: m.color }}>
              €{(m.est.value / 1000).toFixed(0)}k
            </p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px] text-muted">{m.est.confidence}% conf.</span>
              {"freshness" in m.est && (
                <span className={`text-[10px] font-medium ${freshnessColors[m.est.freshness]}`}>
                  {m.est.freshness}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Per-channel detail chart */}
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="method" tick={{ fill: "#a1a1aa", fontSize: 11 }} />
            <YAxis
              tick={{ fill: "#a1a1aa", fontSize: 11 }}
              tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{ background: "#141414", border: "1px solid #27272a", borderRadius: 12, fontSize: 12 }}
              formatter={(value) => [`€${Number(value ?? 0).toLocaleString()}`, "Revenue"]}
            />
            <Bar dataKey="Value" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={methodColors[entry.method as keyof typeof methodColors]}
                />
              ))}
              <ErrorBar dataKey="error" width={4} stroke="#a1a1aa" strokeWidth={1} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Overview all channels */}
      <div className="mt-6">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
          Cross-Channel Overview
        </p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={overviewData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="name" tick={{ fill: "#a1a1aa", fontSize: 10 }} />
              <YAxis
                tick={{ fill: "#a1a1aa", fontSize: 10 }}
                tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{ background: "#141414", border: "1px solid #27272a", borderRadius: 12, fontSize: 12 }}
                formatter={(value) => [`€${Number(value ?? 0).toLocaleString()}`]}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="MTA" fill={methodColors.MTA} radius={[3, 3, 0, 0]} />
              <Bar dataKey="MMM" fill={methodColors.MMM} radius={[3, 3, 0, 0]} />
              <Bar dataKey="Incrementality" fill={methodColors.Incrementality} radius={[3, 3, 0, 0]} />
              <Bar dataKey="Unified" fill={methodColors.Unified} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted/60">
        Synthetic measurement data. In production, KLAR&apos;s unified engine dynamically weights each method
        based on data recency, statistical power, and channel characteristics — producing a single trusted estimate.
      </p>
    </div>
  );
}
