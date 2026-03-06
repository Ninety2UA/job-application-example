"use client";

import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";

type TestChannel = "meta" | "google" | "tiktok";

const channelDefaults: Record<
  TestChannel,
  {
    name: string;
    dailySpend: number;
    convRate: number;
    avgOrderValue: number;
  }
> = {
  meta: {
    name: "Meta Ads",
    dailySpend: 2000,
    convRate: 3.2,
    avgOrderValue: 85,
  },
  google: {
    name: "Google Ads",
    dailySpend: 1500,
    convRate: 4.1,
    avgOrderValue: 92,
  },
  tiktok: {
    name: "TikTok",
    dailySpend: 800,
    convRate: 2.5,
    avgOrderValue: 68,
  },
};

function calcPower(
  sampleSize: number,
  mde: number,
  baseRate: number
): number {
  // Simplified power approximation
  const se = Math.sqrt((baseRate * (1 - baseRate) * 2) / sampleSize);
  const zAlpha = 1.96; // 95% confidence
  const zStat = (mde * baseRate) / se;
  const power = 1 - normalCdf(zAlpha - zStat);
  return Math.min(99, Math.max(5, Math.round(power * 100)));
}

function normalCdf(x: number): number {
  const a1 = 0.254829592,
    a2 = -0.284496736,
    a3 = 1.421413741,
    a4 = -1.453152027,
    a5 = 1.061405429;
  const p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);
  const t = 1.0 / (1.0 + p * x);
  const y =
    1.0 -
    ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return 0.5 * (1.0 + sign * y);
}

export default function Rec8MVP() {
  const [channel, setChannel] = useState<TestChannel>("meta");
  const [holdoutPct, setHoldoutPct] = useState(20);
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [mdePct, setMdePct] = useState(10);

  const config = channelDefaults[channel];
  const mde = mdePct / 100;
  const dailyVisitors = Math.round(config.dailySpend / 2.5); // Approx CPC
  const totalSample = dailyVisitors * durationWeeks * 7;
  const holdoutSample = Math.round(totalSample * (holdoutPct / 100));
  const treatmentSample = totalSample - holdoutSample;
  const power = calcPower(holdoutSample, mde, config.convRate / 100);
  const requiredSample = Math.round(
    (1.96 + 0.84) ** 2 *
      2 *
      ((config.convRate / 100) * (1 - config.convRate / 100)) /
      ((mde * config.convRate) / 100) ** 2
  );

  // Assumed true lift for projections (use 15% as the assumed true effect)
  const assumedLift = 0.15;

  // Generate projection data with confidence interval bands
  const projectionData = useMemo(() => {
    const data = [];
    const baseDaily =
      dailyVisitors * (config.convRate / 100) * config.avgOrderValue;
    const dailyStdDev = baseDaily * 0.12; // 12% daily variance

    for (let day = 0; day <= durationWeeks * 7; day++) {
      const noise =
        1 +
        Math.sin(day * 0.7) * 0.08 +
        Math.cos(day * 1.3) * 0.05;
      const treatmentRev = baseDaily * noise;
      const controlRev = baseDaily * (1 - assumedLift) * noise;

      // Confidence interval narrows with sqrt of accumulated days
      const ciMultiplier =
        day > 0 ? dailyStdDev / Math.sqrt(day) : dailyStdDev;

      const treatmentScaled = treatmentRev * (1 - holdoutPct / 100);
      const controlScaled = controlRev * (holdoutPct / 100);

      data.push({
        day,
        Treatment: Math.round(treatmentScaled),
        TreatmentUpper: Math.round(
          treatmentScaled + ciMultiplier * (1 - holdoutPct / 100)
        ),
        TreatmentLower: Math.round(
          treatmentScaled - ciMultiplier * (1 - holdoutPct / 100)
        ),
        Control: Math.round(controlScaled),
        ControlUpper: Math.round(
          controlScaled + ciMultiplier * (holdoutPct / 100)
        ),
        ControlLower: Math.round(
          controlScaled - ciMultiplier * (holdoutPct / 100)
        ),
      });
    }
    return data;
  }, [channel, holdoutPct, durationWeeks, dailyVisitors, config]);

  const isUnderpowered = power < 80;
  const weeksNeeded = Math.ceil(
    requiredSample / (dailyVisitors * 7 * (holdoutPct / 100))
  );

  // Cost of test calculation
  const baseDaily =
    dailyVisitors * (config.convRate / 100) * config.avgOrderValue;
  const totalTestDays = durationWeeks * 7;
  // Forgone revenue = holdout group misses the lift
  const forgoneRevenue = Math.round(
    baseDaily * assumedLift * (holdoutPct / 100) * totalTestDays
  );

  // Estimated incremental lift
  const totalTreatmentRevenue = Math.round(
    baseDaily * (1 - holdoutPct / 100) * totalTestDays
  );
  const totalControlRevenue = Math.round(
    baseDaily * (1 - assumedLift) * (holdoutPct / 100) * totalTestDays
  );
  // Normalize control to treatment scale for comparison
  const controlNormalized = Math.round(
    totalControlRevenue / (holdoutPct / 100) * (1 - holdoutPct / 100)
  );
  const incrementalRevenue = totalTreatmentRevenue - controlNormalized;
  const liftPct = Math.round(assumedLift * 100);

  // Test readiness checklist
  const checks = [
    {
      label: "Statistical Power",
      detail: `${power}% (need 80%+)`,
      pass: power >= 80,
    },
    {
      label: "Sample Size",
      detail: `${holdoutSample.toLocaleString()} / ${requiredSample.toLocaleString()} required`,
      pass: holdoutSample >= requiredSample,
    },
    {
      label: "Test Duration",
      detail: `${durationWeeks} weeks (need 3+)`,
      pass: durationWeeks >= 3,
    },
    {
      label: "MDE Reasonable",
      detail: `${mdePct}% (5-15% ideal)`,
      pass: mdePct >= 5 && mdePct <= 15,
    },
  ];
  const allPassing = checks.every((c) => c.pass);

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Incrementality Test Planner</h3>
        <p className="text-sm text-muted">
          Design a geo-holdout test — configure parameters and check statistical
          power
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
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
          <label className="text-xs font-medium text-muted">
            Holdout: {holdoutPct}%
          </label>
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
          <label className="text-xs font-medium text-muted">
            Duration: {durationWeeks} weeks
          </label>
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
        <div>
          <label className="text-xs font-medium text-muted">
            MDE: {mdePct}%
          </label>
          <input
            type="range"
            min={5}
            max={25}
            step={1}
            value={mdePct}
            onChange={(e) => setMdePct(Number(e.target.value))}
            className="mt-1 w-full accent-accent"
          />
          <div className="flex justify-between text-[10px] text-muted/60">
            <span>5%</span>
            <span>25%</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="mb-4 grid grid-cols-4 gap-3">
        <div className="rounded-xl bg-background p-3 text-center">
          <p
            className={`text-xl font-bold ${
              isUnderpowered ? "text-red-500" : "text-accent"
            }`}
          >
            {power}%
          </p>
          <p className="text-xs text-muted">Statistical Power</p>
        </div>
        <div className="rounded-xl bg-background p-3 text-center">
          <p className="text-xl font-bold text-foreground">
            {holdoutSample.toLocaleString()}
          </p>
          <p className="text-xs text-muted">Holdout Size</p>
        </div>
        <div className="rounded-xl bg-background p-3 text-center">
          <p className="text-xl font-bold text-foreground">
            {treatmentSample.toLocaleString()}
          </p>
          <p className="text-xs text-muted">Treatment Size</p>
        </div>
        <div className="rounded-xl bg-background p-3 text-center">
          <p className="text-xl font-bold text-foreground">{mdePct}%</p>
          <p className="text-xs text-muted">Min Detectable Effect</p>
        </div>
      </div>

      {/* Underpowered warning */}
      {isUnderpowered && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/5 p-3">
          <p className="text-xs font-medium text-red-500">
            Underpowered test ({power}% power). You need {weeksNeeded}+ weeks at{" "}
            {holdoutPct}% holdout, or increase holdout percentage / MDE for
            reliable results.
          </p>
        </div>
      )}

      {/* Projection chart with confidence interval bands */}
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={projectionData}>
            <defs>
              <linearGradient id="treatmentCI" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="controlCI" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              dataKey="day"
              tick={{ fill: "#a1a1aa", fontSize: 11 }}
              label={{
                value: "Days",
                position: "bottom",
                fill: "#a1a1aa",
                fontSize: 10,
                offset: -5,
              }}
            />
            <YAxis
              tick={{ fill: "#a1a1aa", fontSize: 11 }}
              tickFormatter={(v) => `\u20AC${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                background: "#141414",
                border: "1px solid #27272a",
                borderRadius: 12,
                fontSize: 12,
              }}
              formatter={(value, name) => {
                const label = String(name);
                if (
                  label.includes("Upper") ||
                  label.includes("Lower")
                )
                  return [null, null];
                return [
                  `\u20AC${Number(value ?? 0).toLocaleString()}`,
                  label,
                ];
              }}
              itemSorter={() => 0}
            />
            <Legend
              wrapperStyle={{ fontSize: 12 }}
              formatter={(value) => {
                if (value === "Treatment" || value === "Control") return value;
                return null;
              }}
            />
            <ReferenceLine
              x={durationWeeks * 7}
              stroke="#a1a1aa"
              strokeDasharray="5 5"
              label={{
                value: "End",
                fill: "#a1a1aa",
                fontSize: 10,
              }}
            />

            {/* Treatment confidence band */}
            <Area
              type="monotone"
              dataKey="TreatmentUpper"
              stroke="none"
              fill="url(#treatmentCI)"
              legendType="none"
              activeDot={false}
            />
            <Area
              type="monotone"
              dataKey="TreatmentLower"
              stroke="none"
              fill="#0a0a0a"
              legendType="none"
              activeDot={false}
            />

            {/* Control confidence band */}
            <Area
              type="monotone"
              dataKey="ControlUpper"
              stroke="none"
              fill="url(#controlCI)"
              legendType="none"
              activeDot={false}
            />
            <Area
              type="monotone"
              dataKey="ControlLower"
              stroke="none"
              fill="#0a0a0a"
              legendType="none"
              activeDot={false}
            />

            {/* Main lines */}
            <Area
              type="monotone"
              dataKey="Treatment"
              stroke="#10b981"
              strokeWidth={2}
              fill="none"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="Control"
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="none"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom panels: Cost + Lift + Checklist */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {/* Cost of Test */}
        <div className="rounded-xl border border-card-border bg-card p-4">
          <h4 className="mb-2 text-xs font-semibold text-muted">
            Cost of Test
          </h4>
          <p className="text-2xl font-bold text-amber-500">
            {"\u20AC"}
            {forgoneRevenue.toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted">
            Estimated forgone revenue from the {holdoutPct}% holdout group over{" "}
            {durationWeeks} weeks (assuming {Math.round(assumedLift * 100)}%
            true lift).
          </p>
        </div>

        {/* Estimated Lift */}
        <div className="rounded-xl border border-card-border bg-card p-4">
          <h4 className="mb-2 text-xs font-semibold text-muted">
            Estimated Incremental Lift
          </h4>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-accent">+{liftPct}%</p>
            <p className="text-sm font-semibold text-accent/70">
              ({"\u20AC"}
              {Math.abs(incrementalRevenue).toLocaleString()})
            </p>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-muted">
            Projected incremental revenue from the treatment group over the
            control, normalized to equal scale.
          </p>
        </div>

        {/* Test Readiness Checklist */}
        <div className="rounded-xl border border-card-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-xs font-semibold text-muted">
              Test Readiness
            </h4>
            {allPassing ? (
              <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent">
                Ready to Launch
              </span>
            ) : (
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-500">
                Not Ready
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            {checks.map((check) => (
              <div key={check.label} className="flex items-center gap-2">
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded text-[10px] font-bold ${
                    check.pass
                      ? "bg-accent/15 text-accent"
                      : "bg-red-500/15 text-red-500"
                  }`}
                >
                  {check.pass ? "\u2713" : "\u2717"}
                </span>
                <span className="flex-1 text-[11px] text-muted">
                  {check.label}
                </span>
                <span
                  className={`text-[10px] font-medium ${
                    check.pass ? "text-accent/70" : "text-red-500/70"
                  }`}
                >
                  {check.detail}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted/60">
        Simplified power calculation with synthetic projection data. In
        production, KLAR&apos;s incrementality engine would use historical
        variance, seasonality, and geo-region selection for precise test design.
      </p>
    </div>
  );
}
