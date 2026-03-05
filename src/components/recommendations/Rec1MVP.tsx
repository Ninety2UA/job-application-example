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
  Cell,
} from "recharts";

const channels = [
  { name: "Meta Ads", confidence: 92, revenue: 340000, status: "high" },
  { name: "Google Ads", confidence: 88, revenue: 280000, status: "high" },
  { name: "TikTok", confidence: 61, revenue: 120000, status: "medium" },
  { name: "Influencer", confidence: 45, revenue: 95000, status: "low" },
  { name: "Email/SMS", confidence: 97, revenue: 210000, status: "high" },
  { name: "Direct", confidence: 78, revenue: 180000, status: "medium" },
];

const confidenceColors: Record<string, string> = {
  high: "#10b981",
  medium: "#f59e0b",
  low: "#ef4444",
};

function getStatus(score: number, threshold: number) {
  if (score >= threshold) return "high";
  if (score >= threshold - 20) return "medium";
  return "low";
}

export default function Rec1MVP() {
  const [threshold, setThreshold] = useState(70);

  const data = channels.map((ch) => ({
    ...ch,
    status: getStatus(ch.confidence, threshold),
  }));

  const highCount = data.filter((d) => d.status === "high").length;
  const lowCount = data.filter((d) => d.status === "low").length;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Attribution Confidence Dashboard</h3>
          <p className="text-sm text-muted">
            Adjust the confidence threshold to see which channels you can trust
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
          />
          <span className="w-10 text-sm font-semibold text-accent">{threshold}%</span>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-background p-3 text-center">
          <p className="text-2xl font-bold text-accent">{highCount}</p>
          <p className="text-xs text-muted">Trusted Channels</p>
        </div>
        <div className="rounded-xl bg-background p-3 text-center">
          <p className="text-2xl font-bold text-amber-500">
            {data.filter((d) => d.status === "medium").length}
          </p>
          <p className="text-xs text-muted">Review Needed</p>
        </div>
        <div className="rounded-xl bg-background p-3 text-center">
          <p className="text-2xl font-bold text-red-500">{lowCount}</p>
          <p className="text-xs text-muted">Low Confidence</p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis type="number" domain={[0, 100]} tick={{ fill: "#a1a1aa", fontSize: 12 }} />
            <YAxis dataKey="name" type="category" tick={{ fill: "#a1a1aa", fontSize: 12 }} width={80} />
            <Tooltip
              contentStyle={{ background: "#141414", border: "1px solid #27272a", borderRadius: 12, fontSize: 12 }}
              formatter={(value) => [`${value}%`, "Confidence"]}
            />
            <Bar dataKey="confidence" radius={[0, 6, 6, 0]}>
              {data.map((entry, i) => (
                <Cell key={i} fill={confidenceColors[entry.status]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-4 text-xs text-muted/60">
        Synthetic data for demonstration. In production, confidence scores would be
        calculated from pixel health, match rates, and attribution window coverage.
      </p>
    </div>
  );
}
