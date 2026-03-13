"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
} from "recharts";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Channel = "meta" | "google" | "tiktok";
type Metric = "roas" | "cpa" | "ctr";
type CreativeType = "All" | "Video" | "Image";
type SortMode = "best" | "worst";

interface Creative {
  name: string;
  roas: number;
  cpa: number;
  ctr: number;
  spend: number;
  type: string;
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const creativeData: Record<Channel, Creative[]> = {
  meta: [
    { name: "UGC Testimonial", roas: 4.2, cpa: 18, ctr: 3.1, spend: 12000, type: "Video" },
    { name: "Product Demo", roas: 3.8, cpa: 22, ctr: 2.8, spend: 8500, type: "Video" },
    { name: "Carousel Lifestyle", roas: 3.1, cpa: 28, ctr: 2.2, spend: 6000, type: "Image" },
    { name: "Static Offer", roas: 2.4, cpa: 35, ctr: 1.5, spend: 4500, type: "Image" },
    { name: "Founder Story", roas: 5.1, cpa: 15, ctr: 3.8, spend: 15000, type: "Video" },
  ],
  google: [
    { name: "UGC Testimonial", roas: 3.5, cpa: 24, ctr: 4.2, spend: 9000, type: "Video" },
    { name: "Product Demo", roas: 4.8, cpa: 16, ctr: 5.1, spend: 14000, type: "Video" },
    { name: "Carousel Lifestyle", roas: 2.9, cpa: 30, ctr: 3.0, spend: 5000, type: "Image" },
    { name: "Static Offer", roas: 3.2, cpa: 26, ctr: 3.5, spend: 7000, type: "Image" },
    { name: "Founder Story", roas: 2.8, cpa: 32, ctr: 2.5, spend: 4000, type: "Video" },
  ],
  tiktok: [
    { name: "UGC Testimonial", roas: 5.5, cpa: 12, ctr: 4.5, spend: 10000, type: "Video" },
    { name: "Product Demo", roas: 3.2, cpa: 26, ctr: 3.2, spend: 6000, type: "Video" },
    { name: "Carousel Lifestyle", roas: 1.8, cpa: 42, ctr: 1.8, spend: 3000, type: "Image" },
    { name: "Static Offer", roas: 1.2, cpa: 55, ctr: 1.0, spend: 2000, type: "Image" },
    { name: "Founder Story", roas: 6.2, cpa: 10, ctr: 5.8, spend: 18000, type: "Video" },
  ],
};

const channelLabels: Record<Channel, string> = {
  meta: "Meta Ads",
  google: "Google Ads",
  tiktok: "TikTok",
};

const metricLabels: Record<Metric, string> = {
  roas: "ROAS",
  cpa: "CPA ($)",
  ctr: "CTR (%)",
};

const channelColors: Record<Channel, string> = {
  meta: "#10b981",
  google: "#3b82f6",
  tiktok: "#f43f5e",
};

const allChannels: Channel[] = ["meta", "google", "tiktok"];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function metricValue(creative: Creative, metric: Metric): number {
  return creative[metric];
}

/** Color intensity for heatmap cell based on metric performance */
function heatmapColor(value: number, metric: Metric, allValues: number[]): string {
  if (allValues.length === 0) return "bg-card";
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  if (max === min) return "bg-card";
  const normalized = (value - min) / (max - min);
  // For CPA, lower is better — invert
  const goodness = metric === "cpa" ? 1 - normalized : normalized;
  if (goodness >= 0.8) return "bg-emerald-500/30 text-emerald-300";
  if (goodness >= 0.6) return "bg-emerald-500/15 text-emerald-400";
  if (goodness >= 0.4) return "bg-zinc-500/10 text-zinc-300";
  if (goodness >= 0.2) return "bg-red-500/10 text-red-400";
  return "bg-red-500/25 text-red-300";
}

function formatMetric(value: number, metric: Metric): string {
  if (metric === "roas") return `${value.toFixed(1)}x`;
  if (metric === "cpa") return `$${value}`;
  return `${value.toFixed(1)}%`;
}

/** Generate budget reallocation suggestion */
function generateSuggestion(
  selectedChannels: Channel[],
  creativeNames: string[],
  metric: Metric
): { text: string; fromCreative: string; toCreative: string; fromChannel: string; toChannel: string; improvement: string } | null {
  if (selectedChannels.length === 0 || creativeNames.length < 2) return null;

  // Find worst and best performer across all selected channels
  let worstValue = metric === "cpa" ? -Infinity : Infinity;
  let bestValue = metric === "cpa" ? Infinity : -Infinity;
  let worstCreative = creativeNames[0];
  let worstChannel = selectedChannels[0];
  let bestCreative = creativeNames[0];
  let bestChannel = selectedChannels[0];

  for (const ch of selectedChannels) {
    for (const name of creativeNames) {
      const c = creativeData[ch].find((cr) => cr.name === name);
      if (!c) continue;
      const v = metricValue(c, metric);
      if (metric === "cpa") {
        if (v > worstValue) { worstValue = v; worstCreative = name; worstChannel = ch; }
        if (v < bestValue) { bestValue = v; bestCreative = name; bestChannel = ch; }
      } else {
        if (v < worstValue) { worstValue = v; worstCreative = name; worstChannel = ch; }
        if (v > bestValue) { bestValue = v; bestCreative = name; bestChannel = ch; }
      }
    }
  }

  if (worstCreative === bestCreative && worstChannel === bestChannel) return null;

  const improvement = metric === "cpa"
    ? `${Math.round(((worstValue - bestValue) / worstValue) * 100)}% lower CPA`
    : `+${((bestValue / Math.max(worstValue, 0.1)) - 1).toFixed(1)}x ${metric.toUpperCase()} improvement`;

  return {
    text: `Shift 20% of budget from "${worstCreative}" on ${channelLabels[worstChannel]} to "${bestCreative}" on ${channelLabels[bestChannel]} for projected ${improvement}.`,
    fromCreative: worstCreative,
    toCreative: bestCreative,
    fromChannel: channelLabels[worstChannel],
    toChannel: channelLabels[bestChannel],
    improvement,
  };
}

/* ------------------------------------------------------------------ */
/*  Custom Scatter Tooltip                                             */
/* ------------------------------------------------------------------ */

function ScatterTooltipContent({ active, payload }: { active?: boolean; payload?: Array<{ payload: Record<string, unknown> }> }) {
  if (!active || !payload || payload.length === 0) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background: "#141414", border: "1px solid #27272a", borderRadius: 12, fontSize: 12, padding: "8px 12px" }}>
      <p className="text-foreground font-medium">{String(d.name)}</p>
      <p className="text-muted">{String(d.channelLabel)}</p>
      <p className="text-emerald-400">ROAS: {Number(d.roas).toFixed(1)}x</p>
      <p className="text-muted">CPA: ${Number(d.cpa)}</p>
      <p className="text-muted">Spend: ${Number(d.spend).toLocaleString()}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Rec4MVP() {
  const [selectedChannels, setSelectedChannels] = useState<Channel[]>(["meta", "google", "tiktok"]);
  const [metric, setMetric] = useState<Metric>("roas");
  const [creativeTypeFilter, setCreativeTypeFilter] = useState<CreativeType>("All");
  const [sortMode, setSortMode] = useState<SortMode>("best");

  const toggleChannel = (ch: Channel) => {
    setSelectedChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  };

  /* Filter creatives by type */
  const filteredCreativeNames = useMemo(() => {
    const names = creativeData.meta
      .filter((c) => creativeTypeFilter === "All" || c.type === creativeTypeFilter)
      .map((c) => c.name);
    return names;
  }, [creativeTypeFilter]);

  /* Line chart data */
  const chartData = useMemo(() => {
    return filteredCreativeNames.map((name) => {
      const point: Record<string, string | number> = { name };
      selectedChannels.forEach((ch) => {
        const creative = creativeData[ch].find((c) => c.name === name);
        if (creative) point[channelLabels[ch]] = creative[metric];
      });
      return point;
    });
  }, [filteredCreativeNames, selectedChannels, metric]);

  /* Heatmap data */
  const heatmapData = useMemo(() => {
    // Collect all values for normalization
    const allValues: number[] = [];
    for (const ch of selectedChannels) {
      for (const name of filteredCreativeNames) {
        const c = creativeData[ch].find((cr) => cr.name === name);
        if (c) allValues.push(metricValue(c, metric));
      }
    }

    // Build row data
    const rows = filteredCreativeNames.map((name) => {
      const cells: Record<Channel, { value: number; colorClass: string; formatted: string } | null> = {
        meta: null,
        google: null,
        tiktok: null,
      };
      let avg = 0;
      let count = 0;
      for (const ch of selectedChannels) {
        const c = creativeData[ch].find((cr) => cr.name === name);
        if (c) {
          const v = metricValue(c, metric);
          cells[ch] = {
            value: v,
            colorClass: heatmapColor(v, metric, allValues),
            formatted: formatMetric(v, metric),
          };
          avg += v;
          count++;
        }
      }
      return { name, cells, avg: count > 0 ? avg / count : 0 };
    });

    // Sort
    rows.sort((a, b) => {
      if (metric === "cpa") {
        return sortMode === "best" ? a.avg - b.avg : b.avg - a.avg;
      }
      return sortMode === "best" ? b.avg - a.avg : a.avg - b.avg;
    });

    return { rows, allValues };
  }, [filteredCreativeNames, selectedChannels, metric, sortMode]);

  /* Scatter chart data (CPA vs ROAS, bubble size = spend) */
  const scatterData = useMemo(() => {
    const points: Array<{ name: string; cpa: number; spend: number; roas: number; channel: Channel; channelLabel: string; z: number }> = [];
    for (const ch of selectedChannels) {
      for (const name of filteredCreativeNames) {
        const c = creativeData[ch].find((cr) => cr.name === name);
        if (c) {
          points.push({
            name: c.name,
            cpa: c.cpa,
            spend: c.spend,
            roas: c.roas,
            channel: ch,
            channelLabel: channelLabels[ch],
            z: c.spend, // bubble size
          });
        }
      }
    }
    return points;
  }, [filteredCreativeNames, selectedChannels]);

  /* Budget suggestion */
  const suggestion = useMemo(
    () => generateSuggestion(selectedChannels, filteredCreativeNames, metric),
    [selectedChannels, filteredCreativeNames, metric]
  );

  /* Top performer */
  const topPerformer = useMemo(() => {
    if (selectedChannels.length === 0) return null;
    return [...creativeData[selectedChannels[0]]]
      .filter((c) => creativeTypeFilter === "All" || c.type === creativeTypeFilter)
      .sort((a, b) => b.roas - a.roas)[0] ?? null;
  }, [selectedChannels, creativeTypeFilter]);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Cross-Channel Creative Performance</h3>
        <p className="text-sm text-muted">
          Compare creative performance across channels with unified metrics
        </p>
      </div>

      {/* Controls row 1: Channels + Metrics */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {(Object.keys(channelLabels) as Channel[]).map((ch) => (
            <button
              key={ch}
              onClick={() => toggleChannel(ch)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                selectedChannels.includes(ch)
                  ? "border-transparent text-background"
                  : "border-card-border text-muted hover:border-accent/30"
              }`}
              style={
                selectedChannels.includes(ch)
                  ? { backgroundColor: channelColors[ch] }
                  : undefined
              }
            >
              {channelLabels[ch]}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {(Object.keys(metricLabels) as Metric[]).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                metric === m
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-card-border text-muted hover:border-accent/30"
              }`}
            >
              {metricLabels[m]}
            </button>
          ))}
        </div>
      </div>

      {/* Controls row 2: Creative type filter */}
      <div className="mb-6 flex items-center gap-2">
        <span className="text-xs text-muted">Creative Type:</span>
        {(["All", "Video", "Image"] as CreativeType[]).map((t) => (
          <button
            key={t}
            onClick={() => setCreativeTypeFilter(t)}
            className={`rounded-lg border px-3 py-1 text-xs font-medium transition-all ${
              creativeTypeFilter === t
                ? "border-accent bg-accent/10 text-accent"
                : "border-card-border text-muted hover:border-accent/30"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Line chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="name" tick={{ fill: "#a1a1aa", fontSize: 10 }} angle={-20} textAnchor="end" height={50} />
            <YAxis tick={{ fill: "#a1a1aa", fontSize: 12 }} />
            <Tooltip contentStyle={{ background: "#141414", border: "1px solid #27272a", borderRadius: 12, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {selectedChannels.map((ch) => (
              <Line
                key={ch}
                type="monotone"
                dataKey={channelLabels[ch]}
                stroke={channelColors[ch]}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {topPerformer && (
        <div className="mt-4 rounded-xl bg-accent/5 border border-accent/20 p-3">
          <p className="text-xs text-accent font-medium">
            Top Performer: &quot;{topPerformer.name}&quot; &mdash; {topPerformer.roas}x ROAS, ${topPerformer.cpa} CPA
          </p>
        </div>
      )}

      {/* Budget reallocation suggestion */}
      {suggestion && (
        <div className="mt-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3">
          <div className="flex items-start gap-2">
            <svg className="h-4 w-4 text-yellow-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <div>
              <p className="text-xs font-semibold text-yellow-400 mb-0.5">Budget Reallocation Suggestion</p>
              <p className="text-xs text-yellow-200/80">{suggestion.text}</p>
            </div>
          </div>
        </div>
      )}

      {/* Spend Efficiency Scatter Plot */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-sm font-semibold">Spend Efficiency</h4>
            <p className="text-xs text-muted">CPA (x) vs ROAS (y) &mdash; bubble size = spend amount</p>
          </div>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                type="number"
                dataKey="cpa"
                name="CPA"
                tick={{ fill: "#a1a1aa", fontSize: 10 }}
                tickFormatter={(v: number) => `$${v}`}
                label={{ value: "CPA", position: "insideBottom", offset: -5, fill: "#71717a", fontSize: 10 }}
              />
              <YAxis
                type="number"
                dataKey="roas"
                name="ROAS"
                tick={{ fill: "#a1a1aa", fontSize: 10 }}
                tickFormatter={(v: number) => `${v}x`}
                label={{ value: "ROAS", angle: -90, position: "insideLeft", fill: "#71717a", fontSize: 10 }}
              />
              <ZAxis type="number" dataKey="z" range={[60, 400]} />
              <Tooltip content={<ScatterTooltipContent />} />
              {selectedChannels.map((ch) => {
                const channelPoints = scatterData.filter((p) => p.channel === ch);
                return (
                  <Scatter key={ch} name={channelLabels[ch]} data={channelPoints} fill={channelColors[ch]}>
                    {channelPoints.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={channelColors[ch]} fillOpacity={0.7} />
                    ))}
                  </Scatter>
                );
              })}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Heatmap Table */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-sm font-semibold">Performance Heatmap</h4>
            <p className="text-xs text-muted">{metricLabels[metric]} by creative and channel</p>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => setSortMode("best")}
              className={`rounded-lg border px-2.5 py-1 text-[10px] font-medium transition-all ${
                sortMode === "best"
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-card-border text-muted hover:border-accent/30"
              }`}
            >
              Best First
            </button>
            <button
              onClick={() => setSortMode("worst")}
              className={`rounded-lg border px-2.5 py-1 text-[10px] font-medium transition-all ${
                sortMode === "worst"
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-card-border text-muted hover:border-accent/30"
              }`}
            >
              Worst First
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-card-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-card-border">
                <th className="p-2.5 text-left text-muted font-medium">Creative</th>
                {selectedChannels.map((ch) => (
                  <th key={ch} className="p-2.5 text-center font-medium" style={{ color: channelColors[ch] }}>
                    {channelLabels[ch]}
                  </th>
                ))}
                <th className="p-2.5 text-center text-muted font-medium">Avg</th>
              </tr>
            </thead>
            <tbody>
              {heatmapData.rows.map((row) => (
                <tr key={row.name} className="border-b border-card-border/50 last:border-b-0">
                  <td className="p-2.5 text-foreground font-medium whitespace-nowrap">{row.name}</td>
                  {selectedChannels.map((ch) => {
                    const cell = row.cells[ch];
                    if (!cell) {
                      return <td key={ch} className="p-2.5 text-center text-muted">-</td>;
                    }
                    return (
                      <td key={ch} className={`p-2.5 text-center font-medium rounded-sm ${cell.colorClass}`}>
                        {cell.formatted}
                      </td>
                    );
                  })}
                  <td className="p-2.5 text-center text-muted font-medium">
                    {formatMetric(row.avg, metric)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Heatmap legend */}
        <div className="mt-2 flex items-center justify-end gap-2">
          <span className="text-[10px] text-muted">{metric === "cpa" ? "High (bad)" : "Low (bad)"}</span>
          <div className="flex gap-0.5">
            <div className="w-4 h-2 rounded-sm bg-red-500/25" />
            <div className="w-4 h-2 rounded-sm bg-red-500/10" />
            <div className="w-4 h-2 rounded-sm bg-zinc-500/10" />
            <div className="w-4 h-2 rounded-sm bg-emerald-500/15" />
            <div className="w-4 h-2 rounded-sm bg-emerald-500/30" />
          </div>
          <span className="text-[10px] text-muted">{metric === "cpa" ? "Low (good)" : "High (good)"}</span>
        </div>
      </div>

      <p className="mt-6 text-xs text-muted/60">
        Synthetic creative data. In production, this would pull from KLAR&apos;s creative
        analysis engine with real ad platform data.
      </p>
    </div>
  );
}
