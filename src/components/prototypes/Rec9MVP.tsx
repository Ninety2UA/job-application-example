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
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";

const channels = ["Meta Ads", "Google Ads", "TikTok", "Email", "Influencer"];
const AOV = 85; // Average order value in EUR

const baseConversions: Record<string, number> = {
  "Meta Ads": 4200,
  "Google Ads": 3800,
  TikTok: 1800,
  Email: 2600,
  Influencer: 950,
};

// How much each signal loss factor affects each channel (max fraction lost)
const iosImpact: Record<string, number> = {
  "Meta Ads": 0.55,
  "Google Ads": 0.25,
  TikTok: 0.5,
  Email: 0.05,
  Influencer: 0.4,
};
const cookieImpact: Record<string, number> = {
  "Meta Ads": 0.3,
  "Google Ads": 0.35,
  TikTok: 0.25,
  Email: 0.1,
  Influencer: 0.2,
};
const crossDeviceImpact: Record<string, number> = {
  "Meta Ads": 0.2,
  "Google Ads": 0.15,
  TikTok: 0.3,
  Email: 0.08,
  Influencer: 0.35,
};

// KLAR recovery rate per channel (first-party data quality varies)
const klarRecoveryByChannel: Record<string, number> = {
  "Meta Ads": 0.68,
  "Google Ads": 0.62,
  TikTok: 0.58,
  Email: 0.75,
  Influencer: 0.55,
};

// Year-over-year privacy trend data (attribution gap % for the industry)
const privacyTrendData = [
  { year: "2019", gap: 12, event: "" },
  { year: "2020", gap: 18, event: "CCPA" },
  { year: "2021", gap: 42, event: "iOS 14.5" },
  { year: "2022", gap: 51, event: "GA4 transition" },
  { year: "2023", gap: 58, event: "Cookie deprecation signals" },
  { year: "2024", gap: 63, event: "DSA/DMA enforcement" },
  { year: "2025", gap: 68, event: "3P cookie phase-out" },
  { year: "2026", gap: 72, event: "Post-cookie era" },
];

type SortKey = "channel" | "total" | "visible" | "lost" | "recovered" | "rate" | "revenue";
type SortDir = "asc" | "desc";

export default function Rec9MVP() {
  const [iosOptOut, setIosOptOut] = useState(70);
  const [cookieConsent, setCookieConsent] = useState(55);
  const [crossDevice, setCrossDevice] = useState(35);
  const [showKlar, setShowKlar] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("revenue");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const chartData = useMemo(
    () =>
      channels.map((ch) => {
        const base = baseConversions[ch];
        const iosLoss = Math.round(base * iosImpact[ch] * (iosOptOut / 100));
        const cookieLoss = Math.round(
          base * cookieImpact[ch] * ((100 - cookieConsent) / 100)
        );
        const xDeviceLoss = Math.round(
          base * crossDeviceImpact[ch] * (crossDevice / 100)
        );
        const totalLoss = Math.min(base - 1, iosLoss + cookieLoss + xDeviceLoss);
        const visible = base - totalLoss;
        const recoveryRate = klarRecoveryByChannel[ch];
        const modelRecoverable = Math.round(totalLoss * recoveryRate);
        const invisible = totalLoss - modelRecoverable;

        return {
          name: ch,
          Visible: visible,
          "KLAR Recovered": modelRecoverable,
          Invisible: invisible,
          total: base,
          totalLoss,
          recoveryRate: Math.round(recoveryRate * 100),
          gapPct: Math.round((totalLoss / base) * 100),
          revenueVisible: visible * AOV,
          revenueRecovered: modelRecoverable * AOV,
          revenueInvisible: invisible * AOV,
        };
      }),
    [iosOptOut, cookieConsent, crossDevice]
  );

  // Bar chart data changes based on KLAR toggle
  const barData = useMemo(
    () =>
      chartData.map((d) =>
        showKlar
          ? {
              name: d.name,
              Visible: d.Visible,
              "KLAR Recovered": d["KLAR Recovered"],
              Invisible: d.Invisible,
            }
          : {
              name: d.name,
              Visible: d.Visible,
              "KLAR Recovered": 0,
              Invisible: d["KLAR Recovered"] + d.Invisible,
            }
      ),
    [chartData, showKlar]
  );

  const totalConversions = Object.values(baseConversions).reduce(
    (a, b) => a + b,
    0
  );
  const totalVisible = chartData.reduce((sum, d) => sum + d.Visible, 0);
  const totalRecovered = chartData.reduce(
    (sum, d) => sum + d["KLAR Recovered"],
    0
  );
  const totalInvisible = chartData.reduce((sum, d) => sum + d.Invisible, 0);
  const totalLossAll = chartData.reduce((sum, d) => sum + d.totalLoss, 0);
  const overallGap = Math.round(
    ((totalConversions - totalVisible) / totalConversions) * 100
  );
  const klarRecoveryRate = Math.round(
    (totalRecovered / (totalRecovered + totalInvisible)) * 100
  );

  const revenueVisible = totalVisible * AOV;
  const revenueRecovered = totalRecovered * AOV;
  const revenueInvisible = totalInvisible * AOV;
  const revenueLost = totalLossAll * AOV;

  // Dynamic insight — find the worst-hit channel
  const worstChannel = [...chartData].sort(
    (a, b) => b.gapPct - a.gapPct
  )[0];
  const iosOnlyLoss = Math.round(
    baseConversions[worstChannel.name] *
      iosImpact[worstChannel.name] *
      (iosOptOut / 100)
  );
  const iosOnlyPct = Math.round(
    (iosOnlyLoss / baseConversions[worstChannel.name]) * 100
  );

  // Sortable table data
  const sortedTableData = useMemo(() => {
    const sorted = [...chartData];
    sorted.sort((a, b) => {
      let aVal: number, bVal: number;
      switch (sortKey) {
        case "channel":
          return sortDir === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        case "total":
          aVal = a.total;
          bVal = b.total;
          break;
        case "visible":
          aVal = a.Visible;
          bVal = b.Visible;
          break;
        case "lost":
          aVal = a.totalLoss;
          bVal = b.totalLoss;
          break;
        case "recovered":
          aVal = a["KLAR Recovered"];
          bVal = b["KLAR Recovered"];
          break;
        case "rate":
          aVal = a.recoveryRate;
          bVal = b.recoveryRate;
          break;
        case "revenue":
          aVal = a.revenueInvisible;
          bVal = b.revenueInvisible;
          break;
        default:
          return 0;
      }
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    });
    return sorted;
  }, [chartData, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function SortIndicator({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span className="ml-1 text-muted/30">&#x2195;</span>;
    return (
      <span className="ml-1 text-accent">
        {sortDir === "asc" ? "\u2191" : "\u2193"}
      </span>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Privacy Signal Loss Simulator</h3>
        <p className="text-sm text-muted">
          Adjust privacy parameters to see how much attribution data disappears
          — and how much revenue becomes invisible
        </p>
      </div>

      {/* Sliders */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div>
          <label className="text-xs font-medium text-muted">
            iOS ATT Opt-Out: {iosOptOut}%
          </label>
          <input
            type="range"
            min={40}
            max={90}
            value={iosOptOut}
            onChange={(e) => setIosOptOut(Number(e.target.value))}
            className="mt-1 w-full accent-accent"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted">
            Cookie Consent: {cookieConsent}%
          </label>
          <input
            type="range"
            min={30}
            max={80}
            value={cookieConsent}
            onChange={(e) => setCookieConsent(Number(e.target.value))}
            className="mt-1 w-full accent-accent"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted">
            Cross-Device Blindness: {crossDevice}%
          </label>
          <input
            type="range"
            min={15}
            max={60}
            value={crossDevice}
            onChange={(e) => setCrossDevice(Number(e.target.value))}
            className="mt-1 w-full accent-accent"
          />
        </div>
      </div>

      {/* Conversion stats row */}
      <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl bg-background p-3 text-center">
          <p className="text-xl font-bold text-red-500">{overallGap}%</p>
          <p className="text-xs text-muted">Attribution Gap</p>
        </div>
        <div className="rounded-xl bg-background p-3 text-center">
          <p className="text-xl font-bold text-accent">
            {totalVisible.toLocaleString()}
          </p>
          <p className="text-xs text-muted">Visible</p>
        </div>
        <div className="rounded-xl bg-background p-3 text-center">
          <p className="text-xl font-bold text-cyan-500">
            {totalRecovered.toLocaleString()}
          </p>
          <p className="text-xs text-muted">KLAR Recovered</p>
        </div>
        <div className="rounded-xl bg-background p-3 text-center">
          <p className="text-xl font-bold text-accent">{klarRecoveryRate}%</p>
          <p className="text-xs text-muted">Recovery Rate</p>
        </div>
      </div>

      {/* Revenue impact stats row */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-card-border bg-card p-3 text-center">
          <p className="text-lg font-bold text-accent">
            {"\u20AC"}
            {(revenueVisible / 1000).toFixed(0)}k
          </p>
          <p className="text-[10px] text-muted">Revenue Visible</p>
        </div>
        <div className="rounded-xl border border-cyan-500/30 bg-card p-3 text-center">
          <p className="text-lg font-bold text-cyan-500">
            {"\u20AC"}
            {(revenueRecovered / 1000).toFixed(0)}k
          </p>
          <p className="text-[10px] text-muted">KLAR Recovers</p>
        </div>
        <div className="rounded-xl border border-red-500/30 bg-card p-3 text-center">
          <p className="text-lg font-bold text-red-500">
            {"\u20AC"}
            {(revenueInvisible / 1000).toFixed(0)}k
          </p>
          <p className="text-[10px] text-muted">Revenue Invisible</p>
        </div>
      </div>

      {/* With KLAR vs Without KLAR toggle */}
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => setShowKlar(true)}
          className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
            showKlar
              ? "border-accent bg-accent/10 text-accent"
              : "border-card-border text-muted hover:border-accent/30"
          }`}
        >
          With KLAR
        </button>
        <button
          onClick={() => setShowKlar(false)}
          className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
            !showKlar
              ? "border-red-500 bg-red-500/10 text-red-400"
              : "border-card-border text-muted hover:border-red-500/30"
          }`}
        >
          Without KLAR
        </button>
        <span className="text-[10px] text-muted">
          {showKlar
            ? `KLAR recovers \u20AC${(revenueRecovered / 1000).toFixed(0)}k in hidden revenue`
            : `\u20AC${(revenueLost / 1000).toFixed(0)}k total revenue invisible to your analytics`}
        </span>
      </div>

      {/* Stacked bar chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} stackOffset="none">
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="name" tick={{ fill: "#a1a1aa", fontSize: 11 }} />
            <YAxis tick={{ fill: "#a1a1aa", fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                background: "#141414",
                border: "1px solid #27272a",
                borderRadius: 12,
                fontSize: 12,
              }}
              formatter={(value, name) => {
                const labels: Record<string, string> = {
                  Visible: "Pixel-Tracked",
                  "KLAR Recovered": "1st-Party Modeled",
                  Invisible: showKlar ? "Permanently Lost" : "Invisible (No KLAR)",
                };
                const convs = Number(value ?? 0);
                return [
                  `${convs.toLocaleString()} (\u20AC${(convs * AOV).toLocaleString()})`,
                  labels[String(name)] ?? name,
                ];
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar
              dataKey="Visible"
              stackId="a"
              fill="#10b981"
              radius={[0, 0, 0, 0]}
            />
            {showKlar && (
              <Bar
                dataKey="KLAR Recovered"
                stackId="a"
                fill="#06b6d4"
                radius={[0, 0, 0, 0]}
              />
            )}
            <Bar dataKey="Invisible" stackId="a" radius={[4, 4, 0, 0]}>
              {barData.map((_, i) => (
                <Cell key={i} fill={showKlar ? "#ef444480" : "#ef4444cc"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center justify-center gap-4 text-xs">
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-accent" /> Pixel-Tracked
        </span>
        {showKlar && (
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" /> KLAR 1st-Party
            Recovery
          </span>
        )}
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/50" />{" "}
          {showKlar ? "Permanently Invisible" : "Invisible Without KLAR"}
        </span>
      </div>

      {/* Dynamic insight */}
      <div className="mt-5 rounded-xl border border-accent/20 bg-accent/5 p-4">
        <p className="text-xs font-semibold text-accent mb-1">Key Insight</p>
        <p className="text-sm text-foreground/90">
          {worstChannel.name} loses {iosOnlyPct}% of conversions to iOS ATT alone.
          Without KLAR&apos;s first-party recovery, you&apos;d be making budget decisions on
          only {100 - worstChannel.gapPct}% of your actual data.{" "}
          <span className="text-cyan-400 font-medium">
            KLAR recovers {"\u20AC"}
            {(worstChannel.revenueRecovered / 1000).toFixed(0)}k in invisible{" "}
            {worstChannel.name} revenue.
          </span>
        </p>
      </div>

      {/* Per-channel detail table */}
      <div className="mt-6">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
          Per-Channel Breakdown
        </p>
        <div className="overflow-x-auto rounded-xl border border-card-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-card-border bg-card text-muted">
                <th
                  className="cursor-pointer p-2 text-left font-medium hover:text-foreground"
                  onClick={() => handleSort("channel")}
                >
                  Channel
                  <SortIndicator col="channel" />
                </th>
                <th
                  className="cursor-pointer p-2 text-right font-medium hover:text-foreground"
                  onClick={() => handleSort("total")}
                >
                  Total
                  <SortIndicator col="total" />
                </th>
                <th
                  className="cursor-pointer p-2 text-right font-medium hover:text-foreground"
                  onClick={() => handleSort("visible")}
                >
                  Visible
                  <SortIndicator col="visible" />
                </th>
                <th
                  className="cursor-pointer p-2 text-right font-medium hover:text-foreground"
                  onClick={() => handleSort("lost")}
                >
                  Lost
                  <SortIndicator col="lost" />
                </th>
                <th
                  className="cursor-pointer p-2 text-right font-medium hover:text-foreground"
                  onClick={() => handleSort("recovered")}
                >
                  Recovered
                  <SortIndicator col="recovered" />
                </th>
                <th
                  className="cursor-pointer p-2 text-right font-medium hover:text-foreground"
                  onClick={() => handleSort("rate")}
                >
                  Recovery %
                  <SortIndicator col="rate" />
                </th>
                <th
                  className="cursor-pointer p-2 text-right font-medium hover:text-foreground"
                  onClick={() => handleSort("revenue")}
                >
                  Rev. Impact
                  <SortIndicator col="revenue" />
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedTableData.map((row) => (
                <tr
                  key={row.name}
                  className="border-b border-card-border/50 hover:bg-card/50 transition-colors"
                >
                  <td className="p-2 font-medium text-foreground">{row.name}</td>
                  <td className="p-2 text-right text-muted">
                    {row.total.toLocaleString()}
                  </td>
                  <td className="p-2 text-right text-accent">
                    {row.Visible.toLocaleString()}
                  </td>
                  <td className="p-2 text-right text-red-400">
                    {row.totalLoss.toLocaleString()}
                  </td>
                  <td className="p-2 text-right text-cyan-400">
                    {row["KLAR Recovered"].toLocaleString()}
                  </td>
                  <td className="p-2 text-right">
                    <span
                      className={`inline-block rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                        row.recoveryRate >= 70
                          ? "bg-accent/10 text-accent"
                          : row.recoveryRate >= 60
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {row.recoveryRate}%
                    </span>
                  </td>
                  <td className="p-2 text-right text-red-400 font-medium">
                    {"\u20AC"}
                    {(row.revenueInvisible / 1000).toFixed(0)}k lost
                  </td>
                </tr>
              ))}
              {/* Totals row */}
              <tr className="bg-card/80 font-medium">
                <td className="p-2 text-foreground">Total</td>
                <td className="p-2 text-right text-muted">
                  {totalConversions.toLocaleString()}
                </td>
                <td className="p-2 text-right text-accent">
                  {totalVisible.toLocaleString()}
                </td>
                <td className="p-2 text-right text-red-400">
                  {totalLossAll.toLocaleString()}
                </td>
                <td className="p-2 text-right text-cyan-400">
                  {totalRecovered.toLocaleString()}
                </td>
                <td className="p-2 text-right">
                  <span className="inline-block rounded-full bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent">
                    {klarRecoveryRate}%
                  </span>
                </td>
                <td className="p-2 text-right text-red-400 font-medium">
                  {"\u20AC"}
                  {(revenueInvisible / 1000).toFixed(0)}k lost
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Year-over-year privacy trend */}
      <div className="mt-6">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
          Attribution Gap Growth (2019{"\u2013"}2026)
        </p>
        <p className="mb-3 text-[11px] text-muted/70">
          Industry-average attribution gap has grown 6x since iOS 14.5. The privacy
          wall is not coming{" \u2014 "}it&apos;s already here.
        </p>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={privacyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey="year"
                tick={{ fill: "#a1a1aa", fontSize: 10 }}
              />
              <YAxis
                tick={{ fill: "#a1a1aa", fontSize: 10 }}
                tickFormatter={(v) => `${v}%`}
                domain={[0, 80]}
              />
              <Tooltip
                contentStyle={{
                  background: "#141414",
                  border: "1px solid #27272a",
                  borderRadius: 12,
                  fontSize: 12,
                }}
                formatter={(value) => [`${value}%`, "Attribution Gap"]}
                labelFormatter={(label) => {
                  const item = privacyTrendData.find((d) => d.year === label);
                  return item?.event ? `${label} — ${item.event}` : label;
                }}
              />
              <Line
                type="monotone"
                dataKey="gap"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 4, fill: "#ef4444", stroke: "#0a0a0a", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#ef4444" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] text-muted/60">
          {privacyTrendData
            .filter((d) => d.event)
            .map((d) => (
              <span key={d.year}>
                {d.year}: {d.event}
              </span>
            ))}
        </div>
      </div>

      <p className="mt-5 text-xs text-muted/60">
        Synthetic signal loss model (AOV: {"\u20AC"}{AOV}). Recovery rates based on KLAR&apos;s
        first-party tracking capabilities. Actual signal loss varies by brand, audience
        demographics, and tracking implementation quality.
      </p>
    </div>
  );
}
