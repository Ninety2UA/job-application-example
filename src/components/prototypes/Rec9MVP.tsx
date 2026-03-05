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
  Legend,
} from "recharts";

const channels = ["Meta Ads", "Google Ads", "TikTok", "Email", "Influencer"];

const baseConversions: Record<string, number> = {
  "Meta Ads": 4200,
  "Google Ads": 3800,
  "TikTok": 1800,
  "Email": 2600,
  "Influencer": 950,
};

// How much each signal loss factor affects each channel
const iosImpact: Record<string, number>      = { "Meta Ads": 0.55, "Google Ads": 0.25, "TikTok": 0.50, "Email": 0.05, "Influencer": 0.40 };
const cookieImpact: Record<string, number>    = { "Meta Ads": 0.30, "Google Ads": 0.35, "TikTok": 0.25, "Email": 0.10, "Influencer": 0.20 };
const crossDeviceImpact: Record<string, number> = { "Meta Ads": 0.20, "Google Ads": 0.15, "TikTok": 0.30, "Email": 0.08, "Influencer": 0.35 };

export default function Rec9MVP() {
  const [iosOptOut, setIosOptOut] = useState(70);
  const [cookieConsent, setCookieConsent] = useState(55);
  const [crossDevice, setCrossDevice] = useState(35);

  const chartData = channels.map((ch) => {
    const base = baseConversions[ch];
    const iosLoss = Math.round(base * iosImpact[ch] * (iosOptOut / 100));
    const cookieLoss = Math.round(base * cookieImpact[ch] * ((100 - cookieConsent) / 100));
    const xDeviceLoss = Math.round(base * crossDeviceImpact[ch] * (crossDevice / 100));
    const totalLoss = Math.min(base - 1, iosLoss + cookieLoss + xDeviceLoss);
    const visible = base - totalLoss;
    const modelRecoverable = Math.round(totalLoss * 0.65); // KLAR recovers ~65%
    const invisible = totalLoss - modelRecoverable;

    return {
      name: ch,
      Visible: visible,
      "KLAR Recovered": modelRecoverable,
      Invisible: invisible,
      total: base,
      gapPct: Math.round((totalLoss / base) * 100),
    };
  });

  const totalConversions = Object.values(baseConversions).reduce((a, b) => a + b, 0);
  const totalVisible = chartData.reduce((sum, d) => sum + d.Visible, 0);
  const totalRecovered = chartData.reduce((sum, d) => sum + d["KLAR Recovered"], 0);
  const totalInvisible = chartData.reduce((sum, d) => sum + d.Invisible, 0);
  const overallGap = Math.round(((totalConversions - totalVisible) / totalConversions) * 100);
  const klarRecoveryRate = Math.round((totalRecovered / (totalRecovered + totalInvisible)) * 100);

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Privacy Signal Loss Simulator</h3>
        <p className="text-sm text-muted">
          Adjust privacy parameters to see how much attribution data disappears
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div>
          <label className="text-xs font-medium text-muted">iOS ATT Opt-Out: {iosOptOut}%</label>
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
          <label className="text-xs font-medium text-muted">Cookie Consent: {cookieConsent}%</label>
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
          <label className="text-xs font-medium text-muted">Cross-Device Blindness: {crossDevice}%</label>
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

      <div className="mb-4 grid grid-cols-4 gap-3">
        <div className="rounded-xl bg-background p-3 text-center">
          <p className="text-xl font-bold text-red-500">{overallGap}%</p>
          <p className="text-xs text-muted">Attribution Gap</p>
        </div>
        <div className="rounded-xl bg-background p-3 text-center">
          <p className="text-xl font-bold text-accent">{totalVisible.toLocaleString()}</p>
          <p className="text-xs text-muted">Visible</p>
        </div>
        <div className="rounded-xl bg-background p-3 text-center">
          <p className="text-xl font-bold text-cyan-500">{totalRecovered.toLocaleString()}</p>
          <p className="text-xs text-muted">KLAR Recovered</p>
        </div>
        <div className="rounded-xl bg-background p-3 text-center">
          <p className="text-xl font-bold text-accent">{klarRecoveryRate}%</p>
          <p className="text-xs text-muted">Recovery Rate</p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} stackOffset="none">
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="name" tick={{ fill: "#a1a1aa", fontSize: 11 }} />
            <YAxis tick={{ fill: "#a1a1aa", fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: "#141414", border: "1px solid #27272a", borderRadius: 12, fontSize: 12 }}
              formatter={(value, name) => {
                const labels: Record<string, string> = {
                  Visible: "Pixel-Tracked",
                  "KLAR Recovered": "1st-Party Modeled",
                  Invisible: "Permanently Lost",
                };
                return [Number(value ?? 0).toLocaleString(), labels[String(name)] ?? name];
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Visible" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
            <Bar dataKey="KLAR Recovered" stackId="a" fill="#06b6d4" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Invisible" stackId="a" radius={[4, 4, 0, 0]}>
              {chartData.map((_, i) => (
                <Cell key={i} fill="#ef444480" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center justify-center gap-4 text-xs">
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-accent" /> Pixel-Tracked
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" /> KLAR 1st-Party Recovery
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/50" /> Permanently Invisible
        </span>
      </div>

      <p className="mt-4 text-xs text-muted/60">
        Synthetic signal loss model. Recovery rates based on KLAR&apos;s first-party tracking capabilities.
        Actual signal loss varies by brand, audience demographics, and tracking implementation quality.
      </p>
    </div>
  );
}
