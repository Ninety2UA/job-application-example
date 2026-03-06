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

type Model = "lastClick" | "firstTouch" | "linear" | "uShape" | "dataDriven" | "mmm";

const modelLabels: Record<Model, string> = {
  lastClick: "Last Click",
  firstTouch: "First Touch",
  linear: "Linear",
  uShape: "U-Shape",
  dataDriven: "Data-Driven",
  mmm: "MMM",
};

const modelColors: Record<Model, string> = {
  lastClick: "#6b7280",
  firstTouch: "#8b5cf6",
  linear: "#3b82f6",
  uShape: "#f59e0b",
  dataDriven: "#10b981",
  mmm: "#06b6d4",
};

// Revenue attribution per channel per model (same total: €480,000)
const attributionData: Record<Model, Record<string, number>> = {
  lastClick:    { "Meta Ads": 185000, "Google Ads": 142000, "TikTok": 48000, "Email/SMS": 72000, "Direct": 33000 },
  firstTouch:   { "Meta Ads": 128000, "Google Ads": 95000,  "TikTok": 112000, "Email/SMS": 18000, "Direct": 127000 },
  linear:       { "Meta Ads": 142000, "Google Ads": 118000, "TikTok": 78000,  "Email/SMS": 62000, "Direct": 80000 },
  uShape:       { "Meta Ads": 155000, "Google Ads": 125000, "TikTok": 88000,  "Email/SMS": 45000, "Direct": 67000 },
  dataDriven:   { "Meta Ads": 148000, "Google Ads": 132000, "TikTok": 72000,  "Email/SMS": 58000, "Direct": 70000 },
  mmm:          { "Meta Ads": 162000, "Google Ads": 108000, "TikTok": 95000,  "Email/SMS": 42000, "Direct": 73000 },
};

const channels = ["Meta Ads", "Google Ads", "TikTok", "Email/SMS", "Direct"];
const totalRevenue = 480000;

// --- Helpers ---

function getVarianceColor(variancePct: number): string {
  if (variancePct <= 15) return "#10b981"; // green - high agreement
  if (variancePct <= 30) return "#f59e0b"; // amber - moderate
  return "#ef4444"; // red - dangerous disagreement
}

function getVarianceLabel(variancePct: number): string {
  if (variancePct <= 15) return "High Agreement";
  if (variancePct <= 30) return "Moderate";
  return "Dangerous Disagreement";
}

// --- Main Component ---

export default function Rec6MVP() {
  const [selectedModels, setSelectedModels] = useState<Model[]>(["lastClick", "dataDriven", "mmm"]);
  const [showPercentage, setShowPercentage] = useState(false);
  const [drillDownChannel, setDrillDownChannel] = useState<string | null>(null);

  const toggleModel = (model: Model) => {
    setSelectedModels((prev) =>
      prev.includes(model)
        ? prev.filter((m) => m !== model)
        : prev.length < 3
        ? [...prev, model]
        : prev
    );
  };

  // Main chart data
  const chartData = useMemo(
    () =>
      channels.map((channel) => {
        const row: Record<string, string | number> = { name: channel };
        selectedModels.forEach((model) => {
          const val = attributionData[model][channel];
          row[modelLabels[model]] = showPercentage
            ? Math.round((val / totalRevenue) * 1000) / 10
            : val;
        });
        return row;
      }),
    [selectedModels, showPercentage]
  );

  // Biggest disagreement
  const maxDelta = useMemo(
    () =>
      channels.reduce(
        (best, channel) => {
          if (selectedModels.length < 2) return best;
          const values = selectedModels.map((m) => attributionData[m][channel]);
          const delta = Math.max(...values) - Math.min(...values);
          return delta > best.delta ? { channel, delta } : best;
        },
        { channel: "", delta: 0 }
      ),
    [selectedModels]
  );

  // Model agreement (variance) per channel
  const varianceData = useMemo(() => {
    if (selectedModels.length < 2) return [];
    return channels.map((channel) => {
      const values = selectedModels.map((m) => attributionData[m][channel]);
      const avg = values.reduce((s, v) => s + v, 0) / values.length;
      const variance = Math.sqrt(
        values.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / values.length
      );
      const variancePct = Math.round((variance / avg) * 100);
      return {
        name: channel,
        variance: variancePct,
        avgValue: avg,
        fill: getVarianceColor(variancePct),
      };
    });
  }, [selectedModels]);

  // Budget allocation recommendations
  const budgetData = useMemo(() => {
    return channels.map((channel) => {
      const row: Record<string, string | number> = { channel };
      let maxAlloc = 0;
      let minAlloc = 100;
      selectedModels.forEach((model) => {
        const modelTotal = Object.values(attributionData[model]).reduce((s, v) => s + v, 0);
        const pct = Math.round((attributionData[model][channel] / modelTotal) * 1000) / 10;
        row[modelLabels[model]] = pct;
        maxAlloc = Math.max(maxAlloc, pct);
        minAlloc = Math.min(minAlloc, pct);
      });
      row.spread = Math.round((maxAlloc - minAlloc) * 10) / 10;
      return row;
    });
  }, [selectedModels]);

  // Max spread row for highlighting
  const maxSpreadChannel = useMemo(
    () =>
      budgetData.reduce<{ channel: string; spread: number }>(
        (best, row) => {
          const spread = Number(row.spread ?? 0);
          return spread > best.spread
            ? { channel: row.channel as string, spread }
            : best;
        },
        { channel: "", spread: 0 }
      ),
    [budgetData]
  );

  // Channel drill-down data: all 6 models for a given channel
  const drillDownData = useMemo(() => {
    if (!drillDownChannel) return [];
    return (Object.keys(modelLabels) as Model[])
      .map((model) => ({
        model: modelLabels[model],
        value: attributionData[model][drillDownChannel],
        pct: Math.round((attributionData[model][drillDownChannel] / totalRevenue) * 1000) / 10,
        color: modelColors[model],
      }))
      .sort((a, b) => b.value - a.value);
  }, [drillDownChannel]);

  // Dynamic insight text
  const insightText = useMemo(() => {
    if (varianceData.length === 0) return null;
    const sorted = [...varianceData].sort((a, b) => a.variance - b.variance);
    const safest = sorted[0];
    const riskiest = sorted[sorted.length - 1];

    return `${safest.name} shows the highest model agreement (\u00B1${safest.variance}% variance) -- safe to optimize. ${riskiest.name} shows ${riskiest.variance > 30 ? "dangerous" : "notable"} disagreement (\u00B1${riskiest.variance}% variance) -- ${riskiest.variance > 30 ? "run an incrementality test before reallocating budget" : "monitor closely before making large budget shifts"}.`;
  }, [varianceData]);

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Attribution Model Comparator</h3>
        <p className="text-sm text-muted">
          Select up to 3 models to compare how they credit the same {"\u20AC"}480K revenue
        </p>
      </div>

      {/* Model selector + View toggle */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(modelLabels) as Model[]).map((model) => (
            <button
              key={model}
              onClick={() => toggleModel(model)}
              className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                selectedModels.includes(model)
                  ? "border-transparent text-background"
                  : "border-card-border text-muted hover:border-accent/30"
              }`}
              style={
                selectedModels.includes(model)
                  ? { backgroundColor: modelColors[model] }
                  : undefined
              }
            >
              {modelLabels[model]}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPercentage(false)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
              !showPercentage
                ? "border-accent bg-accent/10 text-accent"
                : "border-card-border text-muted hover:border-accent/30"
            }`}
          >
            {"\u20AC"} Values
          </button>
          <button
            onClick={() => setShowPercentage(true)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
              showPercentage
                ? "border-accent bg-accent/10 text-accent"
                : "border-card-border text-muted hover:border-accent/30"
            }`}
          >
            % Share
          </button>
        </div>
      </div>

      {/* Main grouped bar chart */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            onClick={(state) => {
              if (state?.activeLabel) {
                const label = String(state.activeLabel);
                setDrillDownChannel(
                  drillDownChannel === label ? null : label
                );
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="name" tick={{ fill: "#a1a1aa", fontSize: 11 }} />
            <YAxis
              tick={{ fill: "#a1a1aa", fontSize: 11 }}
              tickFormatter={
                showPercentage
                  ? (v) => `${v}%`
                  : (v) => `\u20AC${(v / 1000).toFixed(0)}k`
              }
            />
            <Tooltip
              contentStyle={{
                background: "#141414",
                border: "1px solid #27272a",
                borderRadius: 12,
                fontSize: 12,
              }}
              formatter={(value) =>
                showPercentage
                  ? [`${Number(value ?? 0)}%`, undefined]
                  : [`\u20AC${Number(value ?? 0).toLocaleString()}`, undefined]
              }
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {selectedModels.map((model) => (
              <Bar
                key={model}
                dataKey={modelLabels[model]}
                fill={modelColors[model]}
                radius={[4, 4, 0, 0]}
                cursor="pointer"
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-1 text-center text-[10px] text-muted/50">
        Click a channel to drill down into all 6 models
      </p>

      {/* Channel Drill-Down Panel */}
      {drillDownChannel && drillDownData.length > 0 && (
        <div className="mt-4 rounded-xl border border-accent/20 bg-accent/5 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-foreground">
              {drillDownChannel} &mdash; All 6 Models
            </h4>
            <button
              onClick={() => setDrillDownChannel(null)}
              className="text-muted hover:text-foreground text-sm px-1"
              aria-label="Close drill-down"
            >
              &times;
            </button>
          </div>
          <div className="space-y-2">
            {drillDownData.map((item) => (
              <div key={item.model} className="flex items-center gap-3">
                <span className="w-24 text-xs text-muted shrink-0">{item.model}</span>
                <div className="flex-1 h-4 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(item.value / drillDownData[0].value) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
                <span className="w-16 text-right text-xs font-semibold text-foreground">
                  {"\u20AC"}{(item.value / 1000).toFixed(0)}k
                </span>
                <span className="w-10 text-right text-[10px] text-muted">{item.pct}%</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-muted/60">
            Spread: {"\u20AC"}{((drillDownData[0].value - drillDownData[drillDownData.length - 1].value) / 1000).toFixed(0)}k between highest and lowest model
          </p>
        </div>
      )}

      {/* Conflict zone alert */}
      {maxDelta.delta > 0 && (
        <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
          <p className="text-xs font-medium text-amber-500">
            Conflict Zone: {maxDelta.channel} &mdash; {"\u20AC"}{maxDelta.delta.toLocaleString()} disagreement between models.
            Budget decisions for this channel are most vulnerable to model choice.
          </p>
        </div>
      )}

      {/* Two columns: Model Agreement + Budget Impact */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {/* Model Agreement Chart */}
        <div className="rounded-xl border border-card-border bg-card p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted">
            Model Agreement by Channel
          </p>
          {varianceData.length > 0 ? (
            <>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={varianceData} layout="vertical" barSize={14}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                    <XAxis
                      type="number"
                      tick={{ fill: "#a1a1aa", fontSize: 10 }}
                      tickFormatter={(v) => `\u00B1${v}%`}
                      domain={[0, "dataMax + 5"]}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fill: "#a1a1aa", fontSize: 10 }}
                      width={70}
                    />
                    <Tooltip
                      contentStyle={{ background: "#141414", border: "1px solid #27272a", borderRadius: 12, fontSize: 12 }}
                      formatter={(value) => [`\u00B1${Number(value ?? 0)}% variance`, "Agreement"]}
                    />
                    <Bar dataKey="variance" radius={[0, 4, 4, 0]}>
                      {varianceData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  High Agreement
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Moderate
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  Dangerous
                </span>
              </div>
            </>
          ) : (
            <p className="text-xs text-muted/60 py-8 text-center">Select 2+ models to see agreement</p>
          )}
        </div>

        {/* Budget Impact Simulator */}
        <div className="rounded-xl border border-card-border bg-card p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted">
            Implied Budget Allocation (%)
          </p>
          {selectedModels.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-card-border text-left text-muted">
                    <th className="pb-2 pr-2 font-medium">Channel</th>
                    {selectedModels.map((m) => (
                      <th key={m} className="pb-2 px-1 font-medium text-right" style={{ color: modelColors[m] }}>
                        {modelLabels[m].split(" ").map((w, i) => (
                          <span key={i}>{i > 0 ? <br /> : null}{w}</span>
                        ))}
                      </th>
                    ))}
                    <th className="pb-2 pl-1 font-medium text-right text-muted">Spread</th>
                  </tr>
                </thead>
                <tbody>
                  {budgetData.map((row) => {
                    const isMaxSpread = row.channel === maxSpreadChannel.channel;
                    return (
                      <tr
                        key={row.channel as string}
                        className={`border-b border-card-border/50 ${isMaxSpread ? "bg-amber-500/5" : ""}`}
                      >
                        <td className="py-1.5 pr-2 font-medium text-foreground">{row.channel as string}</td>
                        {selectedModels.map((m) => (
                          <td key={m} className="py-1.5 px-1 text-right text-muted">
                            {row[modelLabels[m]] as number}%
                          </td>
                        ))}
                        <td className={`py-1.5 pl-1 text-right font-semibold ${isMaxSpread ? "text-amber-500" : "text-muted"}`}>
                          {row.spread as number}pp
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {maxSpreadChannel.spread > 0 && (
                <p className="mt-2 text-[10px] text-amber-500/80">
                  {maxSpreadChannel.channel} has the largest allocation spread ({maxSpreadChannel.spread}pp) -- models fundamentally disagree on this channel&apos;s contribution.
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted/60 py-8 text-center">Select models to see budget implications</p>
          )}
        </div>
      </div>

      {/* Dynamic Insight */}
      {insightText && (
        <div className="mt-4 rounded-xl border border-accent/15 bg-accent/5 p-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent">
            Insight
          </p>
          <p className="text-xs text-foreground/80 leading-relaxed">
            {insightText}
          </p>
        </div>
      )}

      <p className="mt-4 text-xs text-muted/60">
        Synthetic data demonstrating how the same {"\u20AC"}480K revenue is credited differently by each model.
        In production, this would use KLAR&apos;s actual attribution engine across all 7 supported models.
      </p>
    </div>
  );
}
