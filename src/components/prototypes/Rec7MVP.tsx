"use client";

import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
  Cell,
} from "recharts";

type Channel = "meta" | "google" | "tiktok" | "email";
type ViewMode = "single" | "compare";

const channelConfig: Record<
  Channel,
  { name: string; color: string; saturationK: number; maxReturn: number }
> = {
  meta: {
    name: "Meta Ads",
    color: "#10b981",
    saturationK: 0.00008,
    maxReturn: 4.2,
  },
  google: {
    name: "Google Ads",
    color: "#3b82f6",
    saturationK: 0.00006,
    maxReturn: 3.8,
  },
  tiktok: {
    name: "TikTok",
    color: "#f43f5e",
    saturationK: 0.00012,
    maxReturn: 5.5,
  },
  email: {
    name: "Email/SMS",
    color: "#f59e0b",
    saturationK: 0.00015,
    maxReturn: 6.0,
  },
};

const channels: Channel[] = ["meta", "google", "tiktok", "email"];

// Concave saturation function: ROAS = maxReturn * e^(-k * spend)
function calcROAS(spend: number, k: number, maxReturn: number): number {
  return Math.max(0.2, maxReturn * Math.exp(-k * spend));
}

function calcRevenue(spend: number, k: number, maxReturn: number): number {
  return spend * calcROAS(spend, k, maxReturn);
}

function calcMarginalROAS(
  spend: number,
  delta: number,
  k: number,
  maxReturn: number
): number {
  const revNow = calcRevenue(spend, k, maxReturn);
  const revAfter = calcRevenue(spend + delta, k, maxReturn);
  return delta > 0 ? (revAfter - revNow) / delta : 0;
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

function generateCompareData(maxSpend: number) {
  const points = [];
  for (let spend = 0; spend <= maxSpend; spend += maxSpend / 40) {
    const point: Record<string, number> = { spend };
    for (const ch of channels) {
      const { saturationK, maxReturn } = channelConfig[ch];
      point[ch] = Math.round(calcROAS(spend, saturationK, maxReturn) * 100) / 100;
    }
    points.push(point);
  }
  return points;
}

// Budget optimizer: greedy marginal allocation in €500 increments
function optimizeBudget(totalBudget: number): Record<Channel, number> {
  const allocation: Record<Channel, number> = {
    meta: 0,
    google: 0,
    tiktok: 0,
    email: 0,
  };
  const step = 500;
  let remaining = totalBudget;

  while (remaining >= step) {
    let bestChannel: Channel = "meta";
    let bestMarginal = -1;

    for (const ch of channels) {
      const { saturationK, maxReturn } = channelConfig[ch];
      const marginal = calcMarginalROAS(
        allocation[ch],
        step,
        saturationK,
        maxReturn
      );
      if (marginal > bestMarginal) {
        bestMarginal = marginal;
        bestChannel = ch;
      }
    }

    allocation[bestChannel] += step;
    remaining -= step;
  }

  return allocation;
}

function getBreakEvenSpend(k: number, maxReturn: number): number {
  // Solve: maxReturn * e^(-k * s) = 1 => s = -ln(1/maxReturn) / k
  if (maxReturn <= 1) return 0;
  return Math.round(-Math.log(1 / maxReturn) / k);
}

export default function Rec7MVP() {
  const [selectedChannel, setSelectedChannel] = useState<Channel>("meta");
  const [currentSpend, setCurrentSpend] = useState(15000);
  const [totalBudget, setTotalBudget] = useState(40000);
  const [viewMode, setViewMode] = useState<ViewMode>("single");

  const config = channelConfig[selectedChannel];
  const curveData = generateCurveData(selectedChannel, 50000);
  const compareData = useMemo(() => generateCompareData(50000), []);
  const currentROAS = calcROAS(
    currentSpend,
    config.saturationK,
    config.maxReturn
  );
  const marginalROAS = calcMarginalROAS(
    currentSpend,
    1000,
    config.saturationK,
    config.maxReturn
  );

  const optimalSpend = getBreakEvenSpend(config.saturationK, config.maxReturn);
  const saturationPct = Math.min(
    100,
    Math.round((currentSpend / optimalSpend) * 100)
  );

  // Budget optimizer results
  const optimalAllocation = useMemo(
    () => optimizeBudget(totalBudget),
    [totalBudget]
  );
  const allocationData = useMemo(
    () =>
      channels.map((ch) => ({
        name: channelConfig[ch].name,
        channel: ch,
        amount: optimalAllocation[ch],
        pct: Math.round((optimalAllocation[ch] / totalBudget) * 100),
        color: channelConfig[ch].color,
      })),
    [optimalAllocation, totalBudget]
  );

  // Marginal revenue table for selected channel
  const marginalIncrements = [1000, 5000, 10000];
  const marginalRows = marginalIncrements.map((delta) => {
    const revNow = calcRevenue(
      currentSpend,
      config.saturationK,
      config.maxReturn
    );
    const revAfter = calcRevenue(
      currentSpend + delta,
      config.saturationK,
      config.maxReturn
    );
    const additionalRevenue = revAfter - revNow;
    const mROAS = additionalRevenue / delta;
    return { delta, additionalRevenue, mROAS };
  });

  // Opportunity cost insight: find best and worst marginal channels
  const channelMarginals = channels.map((ch) => {
    const { saturationK, maxReturn } = channelConfig[ch];
    // Use the optimal allocation as the "current" spend for each channel
    const spend = optimalAllocation[ch] > 0 ? optimalAllocation[ch] : currentSpend;
    return {
      channel: ch,
      name: channelConfig[ch].name,
      marginal: calcMarginalROAS(spend, 5000, saturationK, maxReturn),
    };
  });
  const sortedMarginals = [...channelMarginals].sort(
    (a, b) => b.marginal - a.marginal
  );
  const bestMarginal = sortedMarginals[0];
  const worstMarginal = sortedMarginals[sortedMarginals.length - 1];
  const reallocationAmount = 5000;
  const revenueGain = Math.round(
    (bestMarginal.marginal - worstMarginal.marginal) * reallocationAmount
  );

  function marginalColor(mROAS: number): string {
    if (mROAS >= 2) return "text-accent";
    if (mROAS >= 1) return "text-amber-500";
    return "text-red-500";
  }

  function marginalBgColor(mROAS: number): string {
    if (mROAS >= 2) return "bg-accent/5";
    if (mROAS >= 1) return "bg-amber-500/5";
    return "bg-red-500/5";
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Channel Saturation Curves</h3>
        <p className="text-sm text-muted">
          See how ROAS declines as spend increases — find where your budget
          stops working
        </p>
      </div>

      {/* View mode toggle + channel selector */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3">
          {/* View toggle */}
          <div className="flex gap-1.5 rounded-lg border border-card-border p-0.5">
            <button
              onClick={() => setViewMode("single")}
              className={`cursor-pointer rounded-md px-3 py-1 text-xs font-medium transition-all ${
                viewMode === "single"
                  ? "bg-accent/15 text-accent"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Single Channel
            </button>
            <button
              onClick={() => setViewMode("compare")}
              className={`cursor-pointer rounded-md px-3 py-1 text-xs font-medium transition-all ${
                viewMode === "compare"
                  ? "bg-accent/15 text-accent"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Compare All
            </button>
          </div>

          {/* Channel buttons (only in single mode) */}
          {viewMode === "single" && (
            <div className="flex gap-2">
              {channels.map((ch) => (
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
          )}
        </div>
        {viewMode === "single" && (
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
              {currentSpend >= 1000
                ? `\u20AC${(currentSpend / 1000).toFixed(0)}k`
                : `\u20AC${currentSpend}`}
            </span>
          </div>
        )}
      </div>

      {/* Stats row (single channel mode) */}
      {viewMode === "single" && (
        <div className="mb-4 grid grid-cols-4 gap-3">
          <div className="rounded-xl bg-background p-3 text-center">
            <p className="text-xl font-bold text-accent">
              {currentROAS.toFixed(1)}x
            </p>
            <p className="text-xs text-muted">Current ROAS</p>
          </div>
          <div className="rounded-xl bg-background p-3 text-center">
            <p className="text-xl font-bold text-amber-500">
              {marginalROAS.toFixed(1)}x
            </p>
            <p className="text-xs text-muted">Marginal ROAS</p>
          </div>
          <div className="rounded-xl bg-background p-3 text-center">
            <p className="text-xl font-bold text-foreground">
              {optimalSpend >= 1000
                ? `\u20AC${(optimalSpend / 1000).toFixed(0)}k`
                : `\u20AC${optimalSpend}`}
            </p>
            <p className="text-xs text-muted">Break-Even Point</p>
          </div>
          <div className="rounded-xl bg-background p-3 text-center">
            <p
              className={`text-xl font-bold ${
                saturationPct > 80
                  ? "text-red-500"
                  : saturationPct > 50
                  ? "text-amber-500"
                  : "text-accent"
              }`}
            >
              {saturationPct}%
            </p>
            <p className="text-xs text-muted">Saturation Level</p>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === "single" ? (
            <AreaChart data={curveData}>
              <defs>
                <linearGradient id="roasGradient7" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={config.color}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={config.color}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey="spend"
                tick={{ fill: "#a1a1aa", fontSize: 11 }}
                tickFormatter={(v) => `\u20AC${(v / 1000).toFixed(0)}k`}
              />
              <YAxis
                tick={{ fill: "#a1a1aa", fontSize: 11 }}
                tickFormatter={(v) => `${v}x`}
              />
              <Tooltip
                contentStyle={{
                  background: "#141414",
                  border: "1px solid #27272a",
                  borderRadius: 12,
                  fontSize: 12,
                }}
                formatter={(value, name) => [
                  name === "roas"
                    ? `${value ?? 0}x ROAS`
                    : `\u20AC${Number(value ?? 0).toLocaleString()}`,
                  name === "roas" ? "ROAS" : "Revenue",
                ]}
                labelFormatter={(v) =>
                  `Spend: \u20AC${Number(v).toLocaleString()}`
                }
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area
                type="monotone"
                dataKey="roas"
                stroke={config.color}
                fill="url(#roasGradient7)"
                strokeWidth={2}
                name="ROAS"
              />
              <ReferenceLine
                x={currentSpend}
                stroke="#fafafa"
                strokeDasharray="5 5"
                label={{
                  value: "You",
                  fill: "#fafafa",
                  fontSize: 11,
                  position: "top",
                }}
              />
              <ReferenceLine
                y={1}
                stroke="#ef4444"
                strokeDasharray="3 3"
                label={{
                  value: "Break-even",
                  fill: "#ef4444",
                  fontSize: 10,
                  position: "right",
                }}
              />
            </AreaChart>
          ) : (
            <AreaChart data={compareData}>
              <defs>
                {channels.map((ch) => (
                  <linearGradient
                    key={ch}
                    id={`gradient-${ch}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={channelConfig[ch].color}
                      stopOpacity={0.15}
                    />
                    <stop
                      offset="95%"
                      stopColor={channelConfig[ch].color}
                      stopOpacity={0}
                    />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey="spend"
                tick={{ fill: "#a1a1aa", fontSize: 11 }}
                tickFormatter={(v) => `\u20AC${(v / 1000).toFixed(0)}k`}
              />
              <YAxis
                tick={{ fill: "#a1a1aa", fontSize: 11 }}
                tickFormatter={(v) => `${v}x`}
              />
              <Tooltip
                contentStyle={{
                  background: "#141414",
                  border: "1px solid #27272a",
                  borderRadius: 12,
                  fontSize: 12,
                }}
                formatter={(value, name) => [
                  `${Number(value ?? 0).toFixed(2)}x`,
                  channelConfig[name as Channel]?.name ?? name,
                ]}
                labelFormatter={(v) =>
                  `Spend: \u20AC${Number(v).toLocaleString()}`
                }
              />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                formatter={(value) =>
                  channelConfig[value as Channel]?.name ?? value
                }
              />
              {channels.map((ch) => (
                <Area
                  key={ch}
                  type="monotone"
                  dataKey={ch}
                  stroke={channelConfig[ch].color}
                  fill={`url(#gradient-${ch})`}
                  strokeWidth={2}
                  name={ch}
                />
              ))}
              <ReferenceLine
                y={1}
                stroke="#ef4444"
                strokeDasharray="3 3"
                label={{
                  value: "Break-even",
                  fill: "#ef4444",
                  fontSize: 10,
                  position: "right",
                }}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Marginal Revenue Table (single channel mode) */}
      {viewMode === "single" && (
        <div className="mt-6">
          <h4 className="mb-3 text-sm font-semibold text-foreground">
            Marginal Revenue at Current Spend
          </h4>
          <div className="overflow-hidden rounded-xl border border-card-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-card-border bg-background">
                  <th className="px-3 py-2 text-left font-medium text-muted">
                    Additional Spend
                  </th>
                  <th className="px-3 py-2 text-right font-medium text-muted">
                    Additional Revenue
                  </th>
                  <th className="px-3 py-2 text-right font-medium text-muted">
                    Marginal ROAS
                  </th>
                  <th className="px-3 py-2 text-center font-medium text-muted">
                    Signal
                  </th>
                </tr>
              </thead>
              <tbody>
                {marginalRows.map((row) => (
                  <tr
                    key={row.delta}
                    className={`border-b border-card-border/50 last:border-b-0 ${marginalBgColor(
                      row.mROAS
                    )}`}
                  >
                    <td className="px-3 py-2 text-foreground">
                      +{"\u20AC"}
                      {(row.delta / 1000).toFixed(0)}k
                    </td>
                    <td className="px-3 py-2 text-right text-foreground">
                      +{"\u20AC"}
                      {Math.round(row.additionalRevenue).toLocaleString()}
                    </td>
                    <td
                      className={`px-3 py-2 text-right font-semibold ${marginalColor(
                        row.mROAS
                      )}`}
                    >
                      {row.mROAS.toFixed(2)}x
                    </td>
                    <td className="px-3 py-2 text-center">
                      {row.mROAS >= 2 ? (
                        <span className="inline-block rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium text-accent">
                          Scale
                        </span>
                      ) : row.mROAS >= 1 ? (
                        <span className="inline-block rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-500">
                          Caution
                        </span>
                      ) : (
                        <span className="inline-block rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-medium text-red-500">
                          Cut
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Budget Optimizer */}
      <div className="mt-6 rounded-xl border border-card-border bg-card p-4">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h4 className="text-sm font-semibold text-foreground">
            Budget Optimizer
          </h4>
          <div className="flex items-center gap-3">
            <label className="text-xs text-muted">Total Budget:</label>
            <input
              type="range"
              min={10000}
              max={100000}
              step={5000}
              value={totalBudget}
              onChange={(e) => setTotalBudget(Number(e.target.value))}
              className="w-28 accent-accent"
            />
            <span className="w-14 text-right text-sm font-semibold text-accent">
              {"\u20AC"}
              {(totalBudget / 1000).toFixed(0)}k
            </span>
          </div>
        </div>
        <p className="mb-4 text-xs text-muted">
          Optimal allocation across channels to maximize total revenue (greedy
          marginal approach)
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Allocation bar chart */}
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={allocationData} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#27272a"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{ fill: "#a1a1aa", fontSize: 10 }}
                  tickFormatter={(v) => `\u20AC${(v / 1000).toFixed(0)}k`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: "#a1a1aa", fontSize: 10 }}
                  width={70}
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
                    "Allocation",
                  ]}
                />
                <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
                  {allocationData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Allocation percentages */}
          <div className="flex flex-col justify-center gap-2">
            {allocationData.map((entry) => (
              <div key={entry.channel} className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="flex-1 text-xs text-muted">{entry.name}</span>
                <span className="text-xs font-semibold text-foreground">
                  {"\u20AC"}
                  {(entry.amount / 1000).toFixed(1)}k
                </span>
                <span className="w-10 text-right text-xs text-muted">
                  {entry.pct}%
                </span>
              </div>
            ))}
            <div className="mt-1 border-t border-card-border pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted">
                  Blended ROAS
                </span>
                <span className="text-xs font-bold text-accent">
                  {(() => {
                    let totalRev = 0;
                    for (const ch of channels) {
                      const { saturationK, maxReturn } = channelConfig[ch];
                      totalRev += calcRevenue(
                        optimalAllocation[ch],
                        saturationK,
                        maxReturn
                      );
                    }
                    return (totalRev / totalBudget).toFixed(2);
                  })()}
                  x
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Opportunity Cost Insight */}
      {revenueGain > 0 && worstMarginal.channel !== bestMarginal.channel && (
        <div className="mt-4 rounded-xl border border-accent/20 bg-accent/5 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
              !
            </div>
            <div>
              <p className="text-xs font-semibold text-accent">
                Opportunity Cost Insight
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                Moving {"\u20AC"}
                {(reallocationAmount / 1000).toFixed(0)}k from{" "}
                <span className="font-medium text-foreground">
                  {worstMarginal.name}
                </span>{" "}
                ({worstMarginal.marginal.toFixed(1)}x marginal) to{" "}
                <span className="font-medium text-foreground">
                  {bestMarginal.name}
                </span>{" "}
                ({bestMarginal.marginal.toFixed(1)}x marginal) would generate{" "}
                <span className="font-semibold text-accent">
                  {"\u20AC"}
                  {revenueGain.toLocaleString()}
                </span>{" "}
                more revenue.
              </p>
            </div>
          </div>
        </div>
      )}

      <p className="mt-4 text-xs text-muted/60">
        Synthetic saturation curves using exponential decay model. In
        production, these curves would be generated by KLAR&apos;s MMM engine
        from actual campaign data and calibrated with incrementality tests.
      </p>
    </div>
  );
}
