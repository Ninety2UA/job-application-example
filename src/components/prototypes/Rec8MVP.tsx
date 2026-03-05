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
  ReferenceLine,
} from "recharts";

type TestChannel = "meta" | "google" | "tiktok";

const channelDefaults: Record<TestChannel, { name: string; dailySpend: number; convRate: number; avgOrderValue: number }> = {
  meta:   { name: "Meta Ads",   dailySpend: 2000, convRate: 3.2, avgOrderValue: 85 },
  google: { name: "Google Ads", dailySpend: 1500, convRate: 4.1, avgOrderValue: 92 },
  tiktok: { name: "TikTok",     dailySpend: 800,  convRate: 2.5, avgOrderValue: 68 },
};

function calcPower(sampleSize: number, mde: number, baseRate: number): number {
  // Simplified power approximation
  const se = Math.sqrt((baseRate * (1 - baseRate) * 2) / sampleSize);
  const zAlpha = 1.96; // 95% confidence
  const zStat = (mde * baseRate) / se;
  const power = 1 - normalCdf(zAlpha - zStat);
  return Math.min(99, Math.max(5, Math.round(power * 100)));
}

function normalCdf(x: number): number {
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429;
  const p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return 0.5 * (1.0 + sign * y);
}

export default function Rec8MVP() {
  const [channel, setChannel] = useState<TestChannel>("meta");
  const [holdoutPct, setHoldoutPct] = useState(20);
  const [durationWeeks, setDurationWeeks] = useState(4);

  const config = channelDefaults[channel];
  const dailyVisitors = Math.round(config.dailySpend / 2.5); // Approx CPC
  const totalSample = dailyVisitors * durationWeeks * 7;
  const holdoutSample = Math.round(totalSample * (holdoutPct / 100));
  const treatmentSample = totalSample - holdoutSample;
  const mde = 0.1; // 10% minimum detectable effect
  const power = calcPower(holdoutSample, mde, config.convRate / 100);
  const requiredSample = Math.round((1.96 + 0.84) ** 2 * 2 * (config.convRate / 100) * (1 - config.convRate / 100) / (mde * config.convRate / 100) ** 2);

  // Generate projection data
  const projectionData = useMemo(() => {
    const data = [];
    const baseDaily = dailyVisitors * (config.convRate / 100) * config.avgOrderValue;
    for (let day = 0; day <= durationWeeks * 7; day++) {
      const noise = 1 + (Math.sin(day * 0.7) * 0.08 + Math.cos(day * 1.3) * 0.05);
      const treatmentRev = baseDaily * noise;
      const controlRev = baseDaily * 0.85 * noise; // 15% lift assumed
      data.push({
        day,
        Treatment: Math.round(treatmentRev * (1 - holdoutPct / 100)),
        Control: Math.round(controlRev * (holdoutPct / 100)),
      });
    }
    return data;
  }, [channel, holdoutPct, durationWeeks, dailyVisitors, config]);

  const isUnderpowered = power < 80;
  const weeksNeeded = Math.ceil(requiredSample / (dailyVisitors * 7 * (holdoutPct / 100)));

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Incrementality Test Planner</h3>
        <p className="text-sm text-muted">
          Design a geo-holdout test — configure parameters and check statistical power
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div>
          <label className="text-xs font-medium text-muted">Channel</label>
          <div className="mt-1 flex gap-1.5">
            {(Object.keys(channelDefaults) as TestChannel[]).map((ch) => (
              <button
                key={ch}
                onClick={() => setChannel(ch)}
                className={`cursor-pointer flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition-all ${
                  channel === ch
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-card-border text-muted hover:border-accent/30"
                }`}
              >
                {channelDefaults[ch].name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-muted">Holdout: {holdoutPct}%</label>
          <input
            type="range"
            min={10}
            max={50}
            step={5}
            value={holdoutPct}
            onChange={(e) => setHoldoutPct(Number(e.target.value))}
            className="mt-1 w-full accent-accent"
          />
          <div className="flex justify-between text-[10px] text-muted/60">
            <span>10%</span>
            <span>50%</span>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-muted">Duration: {durationWeeks} weeks</label>
          <input
            type="range"
            min={2}
            max={8}
            value={durationWeeks}
            onChange={(e) => setDurationWeeks(Number(e.target.value))}
            className="mt-1 w-full accent-accent"
          />
          <div className="flex justify-between text-[10px] text-muted/60">
            <span>2 wk</span>
            <span>8 wk</span>
          </div>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-4 gap-3">
        <div className="rounded-xl bg-background p-3 text-center">
          <p className={`text-xl font-bold ${isUnderpowered ? "text-red-500" : "text-accent"}`}>{power}%</p>
          <p className="text-xs text-muted">Statistical Power</p>
        </div>
        <div className="rounded-xl bg-background p-3 text-center">
          <p className="text-xl font-bold text-foreground">{holdoutSample.toLocaleString()}</p>
          <p className="text-xs text-muted">Holdout Size</p>
        </div>
        <div className="rounded-xl bg-background p-3 text-center">
          <p className="text-xl font-bold text-foreground">{treatmentSample.toLocaleString()}</p>
          <p className="text-xs text-muted">Treatment Size</p>
        </div>
        <div className="rounded-xl bg-background p-3 text-center">
          <p className="text-xl font-bold text-foreground">10%</p>
          <p className="text-xs text-muted">Min Detectable Effect</p>
        </div>
      </div>

      {isUnderpowered && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/5 p-3">
          <p className="text-xs font-medium text-red-500">
            Underpowered test ({power}% power). You need {weeksNeeded}+ weeks at {holdoutPct}% holdout,
            or increase holdout percentage for reliable results.
          </p>
        </div>
      )}

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={projectionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              dataKey="day"
              tick={{ fill: "#a1a1aa", fontSize: 11 }}
              label={{ value: "Days", position: "bottom", fill: "#a1a1aa", fontSize: 10, offset: -5 }}
            />
            <YAxis
              tick={{ fill: "#a1a1aa", fontSize: 11 }}
              tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{ background: "#141414", border: "1px solid #27272a", borderRadius: 12, fontSize: 12 }}
              formatter={(value) => [`€${Number(value ?? 0).toLocaleString()}`, undefined]}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <ReferenceLine
              x={durationWeeks * 7}
              stroke="#a1a1aa"
              strokeDasharray="5 5"
              label={{ value: "End", fill: "#a1a1aa", fontSize: 10 }}
            />
            <Line type="monotone" dataKey="Treatment" stroke="#10b981" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Control" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-4 text-xs text-muted/60">
        Simplified power calculation with synthetic projection data. In production, KLAR&apos;s incrementality
        engine would use historical variance, seasonality, and geo-region selection for precise test design.
      </p>
    </div>
  );
}
