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
  Legend,
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

export default function Rec6MVP() {
  const [selectedModels, setSelectedModels] = useState<Model[]>(["lastClick", "dataDriven", "mmm"]);

  const toggleModel = (model: Model) => {
    setSelectedModels((prev) =>
      prev.includes(model)
        ? prev.filter((m) => m !== model)
        : prev.length < 3
        ? [...prev, model]
        : prev
    );
  };

  const chartData = channels.map((channel) => {
    const row: Record<string, string | number> = { name: channel };
    selectedModels.forEach((model) => {
      row[modelLabels[model]] = attributionData[model][channel];
    });
    return row;
  });

  // Find the biggest disagreement
  const maxDelta = channels.reduce(
    (best, channel) => {
      if (selectedModels.length < 2) return best;
      const values = selectedModels.map((m) => attributionData[m][channel]);
      const delta = Math.max(...values) - Math.min(...values);
      return delta > best.delta ? { channel, delta } : best;
    },
    { channel: "", delta: 0 }
  );

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Attribution Model Comparator</h3>
        <p className="text-sm text-muted">
          Select up to 3 models to compare how they credit the same €480K revenue
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
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

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="name" tick={{ fill: "#a1a1aa", fontSize: 11 }} />
            <YAxis
              tick={{ fill: "#a1a1aa", fontSize: 11 }}
              tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                background: "#141414",
                border: "1px solid #27272a",
                borderRadius: 12,
                fontSize: 12,
              }}
              formatter={(value) => [`€${Number(value ?? 0).toLocaleString()}`, undefined]}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {selectedModels.map((model) => (
              <Bar
                key={model}
                dataKey={modelLabels[model]}
                fill={modelColors[model]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {maxDelta.delta > 0 && (
        <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
          <p className="text-xs font-medium text-amber-500">
            Conflict Zone: {maxDelta.channel} — €{maxDelta.delta.toLocaleString()} disagreement between models.
            Budget decisions for this channel are most vulnerable to model choice.
          </p>
        </div>
      )}

      <p className="mt-4 text-xs text-muted/60">
        Synthetic data demonstrating how the same €480K revenue is credited differently by each model.
        In production, this would use KLAR&apos;s actual attribution engine across all 7 supported models.
      </p>
    </div>
  );
}
