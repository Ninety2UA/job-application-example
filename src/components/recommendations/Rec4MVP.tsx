"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type Channel = "meta" | "google" | "tiktok";
type Metric = "roas" | "cpa" | "ctr";

const creativeData: Record<Channel, { name: string; roas: number; cpa: number; ctr: number; spend: number; type: string }[]> = {
  meta: [
    { name: "UGC Testimonial", roas: 4.2, cpa: 18, ctr: 3.1, spend: 12000, type: "Video" },
    { name: "Product Demo", roas: 3.8, cpa: 22, ctr: 2.8, spend: 8500, type: "Video" },
    { name: "Carousel Lifestyle", roas: 3.1, cpa: 28, ctr: 2.2, spend: 6000, type: "Image" },
    { name: "Static Offer", roas: 2.4, cpa: 35, ctr: 1.5, spend: 4500, type: "Image" },
    { name: "Founder Story", roas: 5.1, cpa: 15, ctr: 3.8, spend: 15000, type: "Video" },
  ],
  google: [
    { name: "UGC Testimonial", roas: 3.5, cpa: 24, ctr: 4.2, spend: 9000, type: "Video" },
    { name: "Product Demo", roas: 4.8, cpa: 16, ctr: 5.1, spend: 14000, type: "Video" },
    { name: "Carousel Lifestyle", roas: 2.9, cpa: 30, ctr: 3.0, spend: 5000, type: "Image" },
    { name: "Static Offer", roas: 3.2, cpa: 26, ctr: 3.5, spend: 7000, type: "Image" },
    { name: "Founder Story", roas: 2.8, cpa: 32, ctr: 2.5, spend: 4000, type: "Video" },
  ],
  tiktok: [
    { name: "UGC Testimonial", roas: 5.5, cpa: 12, ctr: 4.5, spend: 10000, type: "Video" },
    { name: "Product Demo", roas: 3.2, cpa: 26, ctr: 3.2, spend: 6000, type: "Video" },
    { name: "Carousel Lifestyle", roas: 1.8, cpa: 42, ctr: 1.8, spend: 3000, type: "Image" },
    { name: "Static Offer", roas: 1.2, cpa: 55, ctr: 1.0, spend: 2000, type: "Image" },
    { name: "Founder Story", roas: 6.2, cpa: 10, ctr: 5.8, spend: 18000, type: "Video" },
  ],
};

const channelLabels: Record<Channel, string> = {
  meta: "Meta Ads",
  google: "Google Ads",
  tiktok: "TikTok",
};

const metricLabels: Record<Metric, string> = {
  roas: "ROAS",
  cpa: "CPA ($)",
  ctr: "CTR (%)",
};

const channelColors: Record<Channel, string> = {
  meta: "#10b981",
  google: "#3b82f6",
  tiktok: "#f43f5e",
};

export default function Rec4MVP() {
  const [selectedChannels, setSelectedChannels] = useState<Channel[]>(["meta", "google", "tiktok"]);
  const [metric, setMetric] = useState<Metric>("roas");

  const toggleChannel = (ch: Channel) => {
    setSelectedChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  };

  const creativeNames = creativeData.meta.map((c) => c.name);
  const chartData = creativeNames.map((name) => {
    const point: Record<string, string | number> = { name };
    selectedChannels.forEach((ch) => {
      const creative = creativeData[ch].find((c) => c.name === name);
      if (creative) point[channelLabels[ch]] = creative[metric];
    });
    return point;
  });

  const topPerformer = selectedChannels.length > 0
    ? [...creativeData[selectedChannels[0]]]
        .sort((a, b) => b.roas - a.roas)[0]
    : null;

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Cross-Channel Creative Performance</h3>
        <p className="text-sm text-muted">
          Compare creative performance across channels with unified metrics
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {(Object.keys(channelLabels) as Channel[]).map((ch) => (
            <button
              key={ch}
              onClick={() => toggleChannel(ch)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                selectedChannels.includes(ch)
                  ? "border-transparent text-background"
                  : "border-card-border text-muted hover:border-accent/30"
              }`}
              style={
                selectedChannels.includes(ch)
                  ? { backgroundColor: channelColors[ch] }
                  : undefined
              }
            >
              {channelLabels[ch]}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {(Object.keys(metricLabels) as Metric[]).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                metric === m
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-card-border text-muted hover:border-accent/30"
              }`}
            >
              {metricLabels[m]}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="name" tick={{ fill: "#a1a1aa", fontSize: 10 }} angle={-20} textAnchor="end" height={50} />
            <YAxis tick={{ fill: "#a1a1aa", fontSize: 12 }} />
            <Tooltip contentStyle={{ background: "#141414", border: "1px solid #27272a", borderRadius: 12, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {selectedChannels.map((ch) => (
              <Line
                key={ch}
                type="monotone"
                dataKey={channelLabels[ch]}
                stroke={channelColors[ch]}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {topPerformer && (
        <div className="mt-4 rounded-xl bg-accent/5 border border-accent/20 p-3">
          <p className="text-xs text-accent font-medium">
            Top Performer: &quot;{topPerformer.name}&quot; — {topPerformer.roas}x ROAS, ${topPerformer.cpa} CPA
          </p>
        </div>
      )}

      <p className="mt-4 text-xs text-muted/60">
        Synthetic creative data. In production, this would pull from KLAR&apos;s creative
        analysis engine with real ad platform data.
      </p>
    </div>
  );
}
