"use client";

import { useState, useMemo, useCallback } from "react";
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

// --- Data types ---

interface ChannelConfig {
  cpc: number;
  ctr: number;
  convRate: number;
  name: string;
  avgDealValue: number;
}

interface SavedScenario {
  label: string;
  budget: number;
  mix: Record<string, number>;
  cpaTarget: number;
}

// --- Channel benchmarks ---

const channelDefaults: Record<string, ChannelConfig> = {
  meta: { cpc: 1.8, ctr: 2.1, convRate: 3.2, name: "Meta Ads", avgDealValue: 180 },
  linkedin: { cpc: 6.5, ctr: 0.8, convRate: 1.8, name: "LinkedIn", avgDealValue: 320 },
  google: { cpc: 3.2, ctr: 3.5, convRate: 4.1, name: "Google Ads", avgDealValue: 210 },
  content: { cpc: 0.5, ctr: 1.2, convRate: 1.5, name: "Content/SEO", avgDealValue: 150 },
};

// --- Helpers ---

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}k`;
  return `$${value.toFixed(0)}`;
}

function computeFunnel(budget: number, mix: Record<string, number>) {
  return Object.entries(channelDefaults).map(([key, ch]) => {
    const pct = (mix[key] ?? 0) / 100;
    const spend = budget * pct;
    const clicks = spend / ch.cpc;
    const leads = clicks * (ch.convRate / 100);
    const demos = leads * 0.35;
    const deals = demos * 0.25;
    const revenue = deals * ch.avgDealValue;
    const cpa = leads > 0 ? spend / leads : 0;
    const roas = spend > 0 ? revenue / spend : 0;
    return {
      key,
      name: ch.name,
      spend: Math.round(spend),
      Clicks: Math.round(clicks),
      Leads: Math.round(leads),
      Demos: Math.round(demos),
      Deals: Math.round(deals),
      revenue: Math.round(revenue),
      cpa: Math.round(cpa * 100) / 100,
      roas: Math.round(roas * 100) / 100,
    };
  });
}

// --- Component ---

export default function Rec2MVP() {
  const [budget, setBudget] = useState(20000);
  const [mix, setMix] = useState<Record<string, number>>({ meta: 40, linkedin: 25, google: 25, content: 10 });
  const [cpaTarget, setCpaTarget] = useState(30);
  const [savedScenario, setSavedScenario] = useState<SavedScenario | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const funnelData = useMemo(() => computeFunnel(budget, mix), [budget, mix]);

  const savedFunnelData = useMemo(() => {
    if (!savedScenario) return null;
    return computeFunnel(savedScenario.budget, savedScenario.mix);
  }, [savedScenario]);

  const totals = useMemo(
    () =>
      funnelData.reduce(
        (acc, d) => ({
          clicks: acc.clicks + d.Clicks,
          leads: acc.leads + d.Leads,
          demos: acc.demos + d.Demos,
          deals: acc.deals + d.Deals,
          spend: acc.spend + d.spend,
          revenue: acc.revenue + d.revenue,
        }),
        { clicks: 0, leads: 0, demos: 0, deals: 0, spend: 0, revenue: 0 }
      ),
    [funnelData]
  );

  const overallRoas = totals.spend > 0 ? (totals.revenue / totals.spend).toFixed(2) : "0";
  const overallCpa = totals.leads > 0 ? (totals.spend / totals.leads).toFixed(0) : "0";

  const handleMix = useCallback(
    (key: string, value: number) => {
      const remaining = 100 - value;
      const otherKeys = Object.keys(mix).filter((k) => k !== key);
      const otherTotal = otherKeys.reduce((sum, k) => sum + (mix[k] ?? 0), 0);
      const newMix: Record<string, number> = { ...mix, [key]: value };
      otherKeys.forEach((k) => {
        newMix[k] =
          otherTotal > 0
            ? Math.round(((mix[k] ?? 0) / otherTotal) * remaining)
            : Math.round(remaining / otherKeys.length);
      });
      setMix(newMix);
    },
    [mix]
  );

  const handleSaveScenario = () => {
    setSavedScenario({
      label: `$${(budget / 1000).toFixed(0)}k scenario`,
      budget,
      mix: { ...mix },
      cpaTarget,
    });
    setShowComparison(true);
  };

  const handleClearScenario = () => {
    setSavedScenario(null);
    setShowComparison(false);
  };

  // Build comparison chart data
  const comparisonData = useMemo(() => {
    if (!savedFunnelData || !showComparison) return null;
    return funnelData.map((current, i) => {
      const saved = savedFunnelData[i];
      return {
        name: current.name,
        "Current Leads": current.Leads,
        "Saved Leads": saved.Leads,
        "Current Deals": current.Deals,
        "Saved Deals": saved.Deals,
      };
    });
  }, [funnelData, savedFunnelData, showComparison]);

  const channelsAboveCpa = funnelData.filter((d) => d.cpa > cpaTarget && d.spend > 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Paid Growth Funnel Calculator</h3>
        <p className="text-sm text-muted">
          Adjust budget, channel mix, and CPA target to project pipeline impact
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        {/* Budget + CPA controls */}
        <div className="space-y-3">
          <div>
            <label className="text-sm text-muted">Monthly Budget</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="range"
                min={5000}
                max={100000}
                step={5000}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="flex-1 accent-accent"
                aria-label="Monthly budget"
              />
              <span className="w-20 text-right text-sm font-semibold text-accent">
                ${(budget / 1000).toFixed(0)}k
              </span>
            </div>
          </div>
          <div>
            <label className="text-sm text-muted">CPA Target</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={cpaTarget}
                onChange={(e) => setCpaTarget(Number(e.target.value))}
                className="flex-1 accent-accent"
                aria-label="CPA target"
              />
              <span className="w-20 text-right text-sm font-semibold text-accent">${cpaTarget}</span>
            </div>
          </div>
        </div>

        {/* Channel mix sliders */}
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(channelDefaults).map(([key, ch]) => (
            <div key={key}>
              <label className="text-xs text-muted">{ch.name}</label>
              <div className="flex items-center gap-1">
                <input
                  type="range"
                  min={0}
                  max={80}
                  value={mix[key] ?? 0}
                  onChange={(e) => handleMix(key, Number(e.target.value))}
                  className="flex-1 accent-accent"
                  aria-label={`${ch.name} mix percentage`}
                />
                <span className="w-8 text-xs text-accent">{mix[key] ?? 0}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {[
          { label: "Clicks/mo", value: totals.clicks.toLocaleString() },
          { label: "Leads/mo", value: totals.leads.toLocaleString() },
          { label: "Demos/mo", value: totals.demos.toLocaleString() },
          { label: "Deals/mo", value: totals.deals.toLocaleString() },
          { label: "Blended CPA", value: `$${overallCpa}` },
          { label: "Blended ROAS", value: `${overallRoas}x` },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-background p-3 text-center">
            <p className="text-lg font-bold text-accent sm:text-xl">{s.value}</p>
            <p className="text-xs text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Main chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={funnelData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="name" tick={{ fill: "#a1a1aa", fontSize: 11 }} />
            <YAxis tick={{ fill: "#a1a1aa", fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: "#141414", border: "1px solid #27272a", borderRadius: 12, fontSize: 12 }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Leads" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Demos" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Deals" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Efficiency Table */}
      <div className="mt-6">
        <h4 className="mb-3 text-sm font-semibold text-foreground">Channel Efficiency</h4>
        <div className="overflow-x-auto rounded-xl border border-card-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-card-border bg-background">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted">Channel</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted">Spend</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted">Clicks</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted">Leads</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted">CPA</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted">ROAS</th>
              </tr>
            </thead>
            <tbody>
              {funnelData.map((ch) => {
                const cpaOk = ch.spend === 0 || ch.cpa <= cpaTarget;
                return (
                  <tr key={ch.key} className="border-b border-card-border/50 last:border-0">
                    <td className="px-4 py-2.5 font-medium text-foreground">{ch.name}</td>
                    <td className="px-4 py-2.5 text-right text-muted">{formatCurrency(ch.spend)}</td>
                    <td className="px-4 py-2.5 text-right text-muted">{ch.Clicks.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-right text-muted">{ch.Leads.toLocaleString()}</td>
                    <td className={`px-4 py-2.5 text-right font-semibold ${cpaOk ? "text-accent" : "text-red-500"}`}>
                      {ch.spend > 0 ? `$${ch.cpa.toFixed(0)}` : "-"}
                      {!cpaOk && (
                        <span className="ml-1 text-xs font-normal text-red-400">
                          (+${(ch.cpa - cpaTarget).toFixed(0)})
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                          ch.roas >= 1.5
                            ? "bg-emerald-500/10 text-accent"
                            : ch.roas >= 0.8
                            ? "bg-amber-500/10 text-amber-500"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {ch.spend > 0 ? `${ch.roas.toFixed(2)}x` : "-"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CPA Warning */}
      {channelsAboveCpa.length > 0 && (
        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/10">
              <svg className="h-3.5 w-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-red-400">Channels Exceeding CPA Target (${cpaTarget})</h4>
              <p className="mt-0.5 text-sm text-muted">
                {channelsAboveCpa.map((ch) => ch.name).join(", ")}{" "}
                {channelsAboveCpa.length === 1 ? "has" : "have"} a CPA above your ${cpaTarget} target.
                Consider reducing allocation or optimizing conversion rates.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Scenario Comparison */}
      <div className="mt-6 rounded-xl border border-card-border bg-background p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-foreground">Scenario Comparison</h4>
          <div className="flex gap-2">
            <button
              onClick={handleSaveScenario}
              className="rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent/20"
            >
              Save Current Scenario
            </button>
            {savedScenario && (
              <button
                onClick={handleClearScenario}
                className="rounded-lg bg-card px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {!savedScenario && (
          <p className="text-sm text-muted/60">
            Save the current configuration to compare it against different budget allocations.
          </p>
        )}

        {savedScenario && showComparison && comparisonData && (
          <div>
            <div className="mb-3 flex flex-wrap gap-4 text-xs text-muted">
              <span>
                <span className="font-medium text-foreground">Saved:</span>{" "}
                ${(savedScenario.budget / 1000).toFixed(0)}k budget | CPA target: ${savedScenario.cpaTarget}
              </span>
              <span>
                <span className="font-medium text-foreground">Current:</span>{" "}
                ${(budget / 1000).toFixed(0)}k budget | CPA target: ${cpaTarget}
              </span>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="name" tick={{ fill: "#a1a1aa", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#a1a1aa", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ background: "#141414", border: "1px solid #27272a", borderRadius: 12, fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Saved Leads" fill="#27272a" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Current Leads" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Saved Deals" fill="#3f3f46" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Current Deals" fill="#059669" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Delta summary */}
            {savedFunnelData && (
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {(() => {
                  const savedTotals = savedFunnelData.reduce(
                    (acc, d) => ({ leads: acc.leads + d.Leads, deals: acc.deals + d.Deals, spend: acc.spend + d.spend, revenue: acc.revenue + d.revenue }),
                    { leads: 0, deals: 0, spend: 0, revenue: 0 }
                  );
                  const leadsDelta = totals.leads - savedTotals.leads;
                  const dealsDelta = totals.deals - savedTotals.deals;
                  const spendDelta = totals.spend - savedTotals.spend;
                  const revenueDelta = totals.revenue - savedTotals.revenue;
                  return [
                    { label: "Spend", delta: spendDelta, format: formatCurrency },
                    { label: "Leads", delta: leadsDelta, format: (v: number) => v.toLocaleString() },
                    { label: "Deals", delta: dealsDelta, format: (v: number) => v.toLocaleString() },
                    { label: "Revenue", delta: revenueDelta, format: formatCurrency },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg border border-card-border p-2 text-center">
                      <p className="text-xs text-muted">{item.label} Delta</p>
                      <p className={`text-sm font-bold ${item.delta > 0 ? "text-accent" : item.delta < 0 ? "text-red-500" : "text-muted"}`}>
                        {item.delta > 0 ? "+" : ""}{item.format(Math.abs(item.delta))}
                        {item.delta < 0 ? " less" : ""}
                      </p>
                    </div>
                  ));
                })()}
              </div>
            )}
          </div>
        )}
      </div>

      <p className="mt-5 text-xs text-muted/60">
        Synthetic conversion rates based on B2B SaaS benchmarks. Actual results would
        vary based on creative quality, targeting, and landing page optimization.
      </p>
    </div>
  );
}
