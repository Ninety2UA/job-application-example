"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";

type Channel = "meta" | "google" | "tiktok" | "email";

const channelConfig: Record<Channel, { name: string; color: string; saturationK: number; maxReturn: number }> = {
  meta:   { name: "Meta Ads",   color: "#10b981", saturationK: 0.00008, maxReturn: 4.2 },
  google: { name: "Google Ads", color: "#3b82f6", saturationK: 0.00006, maxReturn: 3.8 },
  tiktok: { name: "TikTok",     color: "#f43f5e", saturationK: 0.00012, maxReturn: 5.5 },
  email:  { name: "Email/SMS",  color: "#f59e0b", saturationK: 0.00015, maxReturn: 6.0 },
};

// Concave saturation function: ROAS = maxReturn * e^(-k * spend)
function calcROAS(spend: number, k: number, maxReturn: number): number {
  return Math.max(0.2, maxReturn * Math.exp(-k * spend));
}

function generateCurveData(channel: Channel, maxSpend: number) {
  const { saturationK, maxReturn } = channelConfig[channel];
  const points = [];
  for (let spend = 0; spend <= maxSpend; spend += maxSpend / 40) {
    const roas = calcROAS(spend, saturationK, maxReturn);
    points.push({
      spend,
      roas: Math.round(roas * 100) / 100,
      revenue: Math.round(spend * roas),
    });
  }
  return points;
}

export default function Rec7MVP() {
  const [selectedChannel, setSelectedChannel] = useState<Channel>("meta");
  const [currentSpend, setCurrentSpend] = useState(15000);

  const curveData = generateCurveData(selectedChannel, 50000);
  const config = channelConfig[selectedChannel];
  const currentROAS = calcROAS(currentSpend, config.saturationK, config.maxReturn);
  const marginalROAS = calcROAS(currentSpend + 1000, config.saturationK, config.maxReturn);

  // Find optimal point (where marginal ROAS = ~1.0, break-even)
  let optimalSpend = 0;
  for (let s = 0; s <= 50000; s += 500) {
    if (calcROAS(s, config.saturationK, config.maxReturn) >= 1.0) {
      optimalSpend = s;
    }
  }

  const saturationPct = Math.min(100, Math.round((currentSpend / optimalSpend) * 100));

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Channel Saturation Curves</h3>
        <p className="text-sm text-muted">
          See how ROAS declines as spend increases — find where your budget stops working
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex gap-2">
          {(Object.keys(channelConfig) as Channel[]).map((ch) => (
            <button
              key={ch}
              onClick={() => setSelectedChannel(ch)}
              className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                selectedChannel === ch
                  ? "border-transparent text-background"
                  : "border-card-border text-muted hover:border-accent/30"
              }`}
              style={
                selectedChannel === ch
                  ? { backgroundColor: channelConfig[ch].color }
                  : undefined
              }
            >
              {channelConfig[ch].name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-muted">Monthly Spend:</label>
          <input
            type="range"
            min={1000}
            max={45000}
            step={1000}
            value={currentSpend}
            onChange={(e) => setCurrentSpend(Number(e.target.value))}
            className="w-32 accent-accent"
          />
          <span className="w-16 text-right text-sm font-semibold text-accent">
            €{(currentSpend / 1000).toFixed(0)}k
          </span>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-4 gap-3">
        <div className="rounded-xl bg-background p-3 text-center">
          <p className="text-xl font-bold text-accent">{currentROAS.toFixed(1)}x</p>
          <p className="text-xs text-muted">Current ROAS</p>
        </div>
        <div className="rounded-xl bg-background p-3 text-center">
          <p className="text-xl font-bold text-amber-500">{marginalROAS.toFixed(1)}x</p>
          <p className="text-xs text-muted">Marginal ROAS</p>
        </div>
        <div className="rounded-xl bg-background p-3 text-center">
          <p className="text-xl font-bold text-foreground">€{(optimalSpend / 1000).toFixed(0)}k</p>
          <p className="text-xs text-muted">Break-Even Point</p>
        </div>
        <div className="rounded-xl bg-background p-3 text-center">
          <p className={`text-xl font-bold ${saturationPct > 80 ? "text-red-500" : saturationPct > 50 ? "text-amber-500" : "text-accent"}`}>
            {saturationPct}%
          </p>
          <p className="text-xs text-muted">Saturation Level</p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={curveData}>
            <defs>
              <linearGradient id="roasGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={config.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={config.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              dataKey="spend"
              tick={{ fill: "#a1a1aa", fontSize: 11 }}
              tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`}
            />
            <YAxis tick={{ fill: "#a1a1aa", fontSize: 11 }} tickFormatter={(v) => `${v}x`} />
            <Tooltip
              contentStyle={{
                background: "#141414",
                border: "1px solid #27272a",
                borderRadius: 12,
                fontSize: 12,
              }}
              formatter={(value, name) => [
                name === "roas" ? `${value ?? 0}x ROAS` : `€${Number(value ?? 0).toLocaleString()}`,
                name === "roas" ? "ROAS" : "Revenue",
              ]}
              labelFormatter={(v) => `Spend: €${Number(v).toLocaleString()}`}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area
              type="monotone"
              dataKey="roas"
              stroke={config.color}
              fill="url(#roasGradient)"
              strokeWidth={2}
              name="ROAS"
            />
            <ReferenceLine
              x={currentSpend}
              stroke="#fafafa"
              strokeDasharray="5 5"
              label={{ value: "You", fill: "#fafafa", fontSize: 11, position: "top" }}
            />
            <ReferenceLine
              y={1}
              stroke="#ef4444"
              strokeDasharray="3 3"
              label={{ value: "Break-even", fill: "#ef4444", fontSize: 10, position: "right" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-4 text-xs text-muted/60">
        Synthetic saturation curves using exponential decay model. In production, these curves would
        be generated by KLAR&apos;s MMM engine from actual campaign data and calibrated with incrementality tests.
      </p>
    </div>
  );
}
