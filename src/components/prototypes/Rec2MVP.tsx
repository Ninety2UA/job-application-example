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

const channelDefaults = {
  meta: { cpc: 1.8, ctr: 2.1, convRate: 3.2, name: "Meta Ads" },
  linkedin: { cpc: 6.5, ctr: 0.8, convRate: 1.8, name: "LinkedIn" },
  google: { cpc: 3.2, ctr: 3.5, convRate: 4.1, name: "Google Ads" },
  content: { cpc: 0.5, ctr: 1.2, convRate: 1.5, name: "Content/SEO" },
};

export default function Rec2MVP() {
  const [budget, setBudget] = useState(20000);
  const [mix, setMix] = useState({ meta: 40, linkedin: 25, google: 25, content: 10 });

  const funnelData = Object.entries(channelDefaults).map(([key, ch]) => {
    const pct = mix[key as keyof typeof mix] / 100;
    const spend = budget * pct;
    const clicks = spend / ch.cpc;
    const leads = clicks * (ch.convRate / 100);
    const demos = leads * 0.35;
    const deals = demos * 0.25;
    return { name: ch.name, Clicks: Math.round(clicks), Leads: Math.round(leads), Demos: Math.round(demos), Deals: Math.round(deals) };
  });

  const totals = funnelData.reduce(
    (acc, d) => ({
      clicks: acc.clicks + d.Clicks,
      leads: acc.leads + d.Leads,
      demos: acc.demos + d.Demos,
      deals: acc.deals + d.Deals,
    }),
    { clicks: 0, leads: 0, demos: 0, deals: 0 }
  );

  const handleMix = (key: string, value: number) => {
    const remaining = 100 - value;
    const otherKeys = Object.keys(mix).filter((k) => k !== key);
    const otherTotal = otherKeys.reduce((sum, k) => sum + mix[k as keyof typeof mix], 0);
    const newMix = { ...mix, [key]: value };
    otherKeys.forEach((k) => {
      newMix[k as keyof typeof mix] = otherTotal > 0
        ? Math.round((mix[k as keyof typeof mix] / otherTotal) * remaining)
        : Math.round(remaining / otherKeys.length);
    });
    setMix(newMix);
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Paid Growth Funnel Calculator</h3>
        <p className="text-sm text-muted">
          Adjust budget and channel mix to project pipeline impact
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
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
            />
            <span className="w-20 text-right text-sm font-semibold text-accent">
              ${(budget / 1000).toFixed(0)}k
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(channelDefaults).map(([key, ch]) => (
            <div key={key}>
              <label className="text-xs text-muted">{ch.name}</label>
              <div className="flex items-center gap-1">
                <input
                  type="range"
                  min={0}
                  max={80}
                  value={mix[key as keyof typeof mix]}
                  onChange={(e) => handleMix(key, Number(e.target.value))}
                  className="flex-1 accent-accent"
                />
                <span className="w-8 text-xs text-accent">{mix[key as keyof typeof mix]}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-4 gap-3">
        {[
          { label: "Clicks", value: totals.clicks.toLocaleString() },
          { label: "Leads", value: totals.leads.toLocaleString() },
          { label: "Demos", value: totals.demos.toLocaleString() },
          { label: "Deals", value: totals.deals.toLocaleString() },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-background p-3 text-center">
            <p className="text-xl font-bold text-accent">{s.value}</p>
            <p className="text-xs text-muted">{s.label}/mo</p>
          </div>
        ))}
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={funnelData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="name" tick={{ fill: "#a1a1aa", fontSize: 11 }} />
            <YAxis tick={{ fill: "#a1a1aa", fontSize: 12 }} />
            <Tooltip contentStyle={{ background: "#141414", border: "1px solid #27272a", borderRadius: 12, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Leads" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Demos" fill="#059669" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Deals" fill="#047857" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-4 text-xs text-muted/60">
        Synthetic conversion rates based on B2B SaaS benchmarks. Actual results would
        vary based on creative quality, targeting, and landing page optimization.
      </p>
    </div>
  );
}
