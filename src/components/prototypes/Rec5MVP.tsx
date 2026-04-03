"use client";

import { useState, useMemo } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";

// --- Data ---

interface Member {
  name: string;
  activity: number;
  topicRelevance: number;
  intentScore: number;
  segment: string;
  channel: string;
  companySize: string;
  joinedWeeksAgo: number;
  eventsAttended: number;
  contentViews: number;
}

const members: Member[] = [
  { name: "Brand Alpha", activity: 92, topicRelevance: 88, intentScore: 91, segment: "hot", channel: "attribution", companySize: "Enterprise", joinedWeeksAgo: 12, eventsAttended: 5, contentViews: 34 },
  { name: "Brand Beta", activity: 78, topicRelevance: 95, intentScore: 87, segment: "hot", channel: "retention", companySize: "Mid-Market", joinedWeeksAgo: 8, eventsAttended: 3, contentViews: 28 },
  { name: "Brand Gamma", activity: 85, topicRelevance: 72, intentScore: 79, segment: "warm", channel: "attribution", companySize: "Enterprise", joinedWeeksAgo: 16, eventsAttended: 4, contentViews: 22 },
  { name: "Brand Delta", activity: 45, topicRelevance: 88, intentScore: 65, segment: "warm", channel: "profitability", companySize: "Mid-Market", joinedWeeksAgo: 20, eventsAttended: 2, contentViews: 15 },
  { name: "Brand Epsilon", activity: 62, topicRelevance: 55, intentScore: 58, segment: "warm", channel: "creative", companySize: "SMB", joinedWeeksAgo: 6, eventsAttended: 1, contentViews: 9 },
  { name: "Brand Zeta", activity: 35, topicRelevance: 42, intentScore: 38, segment: "cold", channel: "attribution", companySize: "SMB", joinedWeeksAgo: 30, eventsAttended: 0, contentViews: 4 },
  { name: "Brand Eta", activity: 28, topicRelevance: 35, intentScore: 31, segment: "cold", channel: "retention", companySize: "SMB", joinedWeeksAgo: 24, eventsAttended: 0, contentViews: 2 },
  { name: "Brand Theta", activity: 88, topicRelevance: 92, intentScore: 90, segment: "hot", channel: "profitability", companySize: "Enterprise", joinedWeeksAgo: 10, eventsAttended: 6, contentViews: 41 },
  { name: "Brand Iota", activity: 55, topicRelevance: 68, intentScore: 61, segment: "warm", channel: "creative", companySize: "Mid-Market", joinedWeeksAgo: 14, eventsAttended: 2, contentViews: 11 },
  { name: "Brand Kappa", activity: 70, topicRelevance: 80, intentScore: 75, segment: "warm", channel: "attribution", companySize: "Mid-Market", joinedWeeksAgo: 18, eventsAttended: 3, contentViews: 19 },
  { name: "Brand Lambda", activity: 20, topicRelevance: 25, intentScore: 22, segment: "cold", channel: "retention", companySize: "SMB", joinedWeeksAgo: 35, eventsAttended: 0, contentViews: 1 },
  { name: "Brand Mu", activity: 95, topicRelevance: 85, intentScore: 90, segment: "hot", channel: "creative", companySize: "Enterprise", joinedWeeksAgo: 4, eventsAttended: 4, contentViews: 38 },
  { name: "Brand Nu", activity: 72, topicRelevance: 78, intentScore: 76, segment: "warm", channel: "profitability", companySize: "Mid-Market", joinedWeeksAgo: 9, eventsAttended: 3, contentViews: 20 },
  { name: "Brand Xi", activity: 40, topicRelevance: 50, intentScore: 44, segment: "cold", channel: "creative", companySize: "SMB", joinedWeeksAgo: 28, eventsAttended: 1, contentViews: 6 },
  { name: "Brand Omicron", activity: 82, topicRelevance: 90, intentScore: 86, segment: "hot", channel: "attribution", companySize: "Enterprise", joinedWeeksAgo: 5, eventsAttended: 5, contentViews: 32 },
  { name: "Brand Pi", activity: 58, topicRelevance: 62, intentScore: 60, segment: "warm", channel: "retention", companySize: "Mid-Market", joinedWeeksAgo: 22, eventsAttended: 1, contentViews: 13 },
];

const segmentColors: Record<string, string> = {
  hot: "#10b981",
  warm: "#f59e0b",
  cold: "#6b7280",
};

const segmentValues: Record<string, number> = {
  hot: 15000,
  warm: 8000,
  cold: 2000,
};

// Weekly engagement trend (synthetic)
const weeklyTrend = [
  { week: "W1", members: 820, engaged: 310 },
  { week: "W2", members: 865, engaged: 345 },
  { week: "W3", members: 910, engaged: 362 },
  { week: "W4", members: 948, engaged: 388 },
  { week: "W5", members: 1005, engaged: 415 },
  { week: "W6", members: 1062, engaged: 448 },
  { week: "W7", members: 1130, engaged: 490 },
  { week: "W8", members: 1198, engaged: 532 },
];

function getSegment(score: number, threshold: number): string {
  if (score >= threshold) return "hot";
  if (score >= threshold - 25) return "warm";
  return "cold";
}

// --- Sub-components ---

function FunnelStage({ label, count, total, color, isLast }: { label: string; count: number; total: number; color: string; isLast: boolean }) {
  const pct = Math.round((count / total) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[11px] font-medium text-foreground">{label}</span>
          <span className="text-[11px] font-semibold" style={{ color }}>{count}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
        </div>
      </div>
      {!isLast && (
        <svg width="12" height="12" viewBox="0 0 12 12" className="shrink-0 text-muted/40">
          <path d="M4 2l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}

// --- Custom Scatter Tooltip ---

function ScatterTooltipContent({ active, payload }: { active?: boolean; payload?: Array<{ payload: Record<string, unknown> }> }) {
  if (!active || !payload || payload.length === 0) return null;
  const d = payload[0].payload;
  const seg = String(d.segment);
  const color = segmentColors[seg] ?? "#a1a1aa";
  return (
    <div style={{ background: "#141414", border: "1px solid #27272a", borderRadius: 12, fontSize: 12, padding: "8px 12px" }}>
      <p className="text-foreground font-medium">{String(d.name)}</p>
      <p className="text-muted text-[11px]">{String(d.companySize)} &middot; {String(d.channel)}</p>
      <p className="font-semibold mt-1" style={{ color }}>Intent Score: {Number(d.intentScore)}</p>
      <p className="text-muted">Activity: {Number(d.activity)}</p>
      <p className="text-muted">Topic Relevance: {Number(d.topicRelevance)}</p>
    </div>
  );
}

// --- Main Component ---

export default function Rec5MVP() {
  const [threshold, setThreshold] = useState(75);
  const [filter, setFilter] = useState<string>("all");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const data = useMemo(
    () =>
      members.map((m) => ({
        ...m,
        segment: getSegment(m.intentScore, threshold),
      })),
    [threshold]
  );

  const filtered = useMemo(
    () => (filter === "all" ? data : data.filter((m) => m.channel === filter)),
    [data, filter]
  );

  const hotCount = data.filter((d) => d.segment === "hot").length;
  const warmCount = data.filter((d) => d.segment === "warm").length;
  const coldCount = data.filter((d) => d.segment === "cold").length;

  // Pipeline value estimation
  const pipelineValue = useMemo(
    () =>
      data.reduce((sum, m) => sum + (segmentValues[m.segment] ?? 0), 0),
    [data]
  );
  const hotPipeline = hotCount * segmentValues.hot;
  const warmPipeline = warmCount * segmentValues.warm;

  // Conversion funnel (based on current threshold segmentation)
  const totalCommunity = 2000; // eCom Unity total
  const engagedCount = Math.round(totalCommunity * 0.42);
  const mqlCount = hotCount + warmCount;
  const sqlCount = hotCount;
  const oppCount = Math.max(1, Math.round(hotCount * 0.6));

  const funnelStages = [
    { label: "Community Members", count: totalCommunity, color: "#a1a1aa" },
    { label: "Engaged (42%)", count: engagedCount, color: "#6b7280" },
    { label: "MQLs (Intent Signal)", count: mqlCount, color: "#f59e0b" },
    { label: "SQLs (Sales-Ready)", count: sqlCount, color: "#10b981" },
    { label: "Opportunities", count: oppCount, color: "#059669" },
  ];

  // Next best action recommendations
  const nextActions = useMemo(() => {
    const actions: string[] = [];
    const hotByChannel: Record<string, number> = {};
    data.filter((d) => d.segment === "hot").forEach((d) => {
      hotByChannel[d.channel] = (hotByChannel[d.channel] ?? 0) + 1;
    });

    const topChannel = Object.entries(hotByChannel).sort((a, b) => b[1] - a[1])[0];
    if (topChannel) {
      actions.push(
        `${topChannel[1]} hot lead${topChannel[1] > 1 ? "s" : ""} ${topChannel[1] > 1 ? "are" : "is"} engaging with ${topChannel[0]} content -- trigger personalized demo outreach.`
      );
    }

    const warmNearHot = data.filter(
      (d) => d.segment === "warm" && d.intentScore >= threshold - 8
    );
    if (warmNearHot.length > 0) {
      actions.push(
        `${warmNearHot.length} warm lead${warmNearHot.length > 1 ? "s" : ""} within 8 points of sales-ready threshold -- invite to upcoming deep-dive workshop.`
      );
    }

    const recentHot = data.filter(
      (d) => d.segment === "hot" && d.joinedWeeksAgo <= 8
    );
    if (recentHot.length > 0) {
      actions.push(
        `${recentHot.length} recently joined member${recentHot.length > 1 ? "s" : ""} already showing hot intent -- fast-track to AE handoff.`
      );
    }

    const coldEnterprise = data.filter(
      (d) => d.segment === "cold" && d.companySize === "Enterprise"
    );
    if (coldEnterprise.length > 0) {
      actions.push(
        `${coldEnterprise.length} Enterprise account${coldEnterprise.length > 1 ? "s" : ""} in cold segment -- worth re-engagement via exclusive content.`
      );
    }

    return actions.slice(0, 3);
  }, [data, threshold]);

  // Budget allocation data for pipeline bar chart
  const pipelineBarData = [
    { label: "Hot", value: hotPipeline, fill: "#10b981" },
    { label: "Warm", value: warmPipeline, fill: "#f59e0b" },
    { label: "Cold", value: coldCount * segmentValues.cold, fill: "#6b7280" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Community Intent Scoring Dashboard</h3>
        <p className="text-sm text-muted">
          Map eCom Unity engagement to sales-ready intent signals and pipeline value
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <label className="text-sm text-muted">Intent Threshold</label>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="range"
              min={40}
              max={90}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-32 accent-accent"
            />
            <span className="w-10 text-sm font-semibold text-accent">{threshold}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["all", "attribution", "retention", "profitability", "creative"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                filter === f
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-card-border text-muted hover:border-accent/30"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl bg-background p-3 text-center">
          <p className="text-2xl font-bold text-accent">{hotCount}</p>
          <p className="text-xs text-muted">Sales-Ready</p>
        </div>
        <div className="rounded-xl bg-background p-3 text-center">
          <p className="text-2xl font-bold text-amber-500">{warmCount}</p>
          <p className="text-xs text-muted">Nurture</p>
        </div>
        <div className="rounded-xl bg-background p-3 text-center">
          <p className="text-2xl font-bold text-zinc-500">{coldCount}</p>
          <p className="text-xs text-muted">Low Intent</p>
        </div>
        <div className="rounded-xl bg-background p-3 text-center">
          <p className="text-xl font-bold text-accent">{"\u20AC"}{(pipelineValue / 1000).toFixed(0)}k</p>
          <p className="text-xs text-muted">Pipeline Value</p>
        </div>
      </div>

      {/* Scatter Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              dataKey="activity"
              type="number"
              domain={[0, 100]}
              name="Activity"
              tick={{ fill: "#a1a1aa", fontSize: 12 }}
              label={{ value: "Community Activity", position: "bottom", fill: "#a1a1aa", fontSize: 11 }}
            />
            <YAxis
              dataKey="topicRelevance"
              type="number"
              domain={[0, 100]}
              name="Topic Relevance"
              tick={{ fill: "#a1a1aa", fontSize: 12 }}
              label={{ value: "Topic Relevance", angle: -90, position: "insideLeft", fill: "#a1a1aa", fontSize: 11 }}
            />
            <Tooltip content={<ScatterTooltipContent />} />
            <Scatter
              data={filtered}
              cursor="pointer"
              onClick={(entry) => {
                if (entry && typeof entry === "object" && "name" in entry) {
                  setSelectedMember(entry as unknown as Member);
                }
              }}
            >
              {filtered.map((entry, i) => (
                <Cell
                  key={i}
                  fill={segmentColors[entry.segment]}
                  r={entry.companySize === "Enterprise" ? 8 : entry.companySize === "Mid-Market" ? 6 : 5}
                  strokeWidth={selectedMember?.name === entry.name ? 2 : 0}
                  stroke="#fff"
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs">
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          Sales-Ready
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
          Nurture
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-500" />
          Low Intent
        </span>
        <span className="ml-2 text-muted/60">|</span>
        <span className="flex items-center gap-1 text-muted/60">
          Dot size = company tier
        </span>
      </div>

      {/* Member Detail Panel */}
      {selectedMember && (
        <div className="mt-4 rounded-xl border border-accent/20 bg-accent/5 p-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-semibold text-foreground">{selectedMember.name}</h4>
              <p className="text-xs text-muted">{selectedMember.companySize} &middot; Interested in {selectedMember.channel}</p>
            </div>
            <button
              onClick={() => setSelectedMember(null)}
              className="text-muted hover:text-foreground text-sm px-1"
              aria-label="Close member detail"
            >
              &times;
            </button>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {[
              { label: "Activity", value: selectedMember.activity, suffix: "/100" },
              { label: "Topic Relevance", value: selectedMember.topicRelevance, suffix: "/100" },
              { label: "Intent Score", value: selectedMember.intentScore, suffix: "/100" },
              { label: "Events", value: selectedMember.eventsAttended, suffix: "" },
              { label: "Content Views", value: selectedMember.contentViews, suffix: "" },
              { label: "Est. Value", value: `\u20AC${((segmentValues[getSegment(selectedMember.intentScore, threshold)] ?? 0) / 1000).toFixed(0)}k`, suffix: "" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-lg font-bold text-foreground">
                  {item.value}{typeof item.value === "number" ? item.suffix : ""}
                </p>
                <p className="text-[10px] text-muted">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span
              className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase"
              style={{
                backgroundColor: segmentColors[getSegment(selectedMember.intentScore, threshold)] + "20",
                color: segmentColors[getSegment(selectedMember.intentScore, threshold)],
              }}
            >
              {getSegment(selectedMember.intentScore, threshold)}
            </span>
            <span className="text-[10px] text-muted">
              Joined {selectedMember.joinedWeeksAgo} weeks ago
            </span>
          </div>
        </div>
      )}

      {/* Two-column: Funnel + Engagement Trend */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {/* Conversion Funnel */}
        <div className="rounded-xl border border-card-border bg-card p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted">
            Conversion Funnel
          </p>
          <div className="space-y-2.5">
            {funnelStages.map((stage, i) => (
              <FunnelStage
                key={stage.label}
                label={stage.label}
                count={stage.count}
                total={totalCommunity}
                color={stage.color}
                isLast={i === funnelStages.length - 1}
              />
            ))}
          </div>
          <p className="mt-2 text-[10px] text-muted/60">
            Funnel adapts dynamically to your intent threshold setting
          </p>
        </div>

        {/* Engagement Trend */}
        <div className="rounded-xl border border-card-border bg-card p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted">
            Weekly Engagement Trend
          </p>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="week" tick={{ fill: "#a1a1aa", fontSize: 10 }} />
                <YAxis tick={{ fill: "#a1a1aa", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ background: "#141414", border: "1px solid #27272a", borderRadius: 12, fontSize: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="members"
                  stroke="#a1a1aa"
                  strokeWidth={1.5}
                  dot={false}
                  name="Total Members"
                />
                <Line
                  type="monotone"
                  dataKey="engaged"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  name="Engaged"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex items-center gap-3 text-[10px] text-muted">
            <span className="flex items-center gap-1">
              <span className="inline-block h-0.5 w-3 rounded bg-zinc-400" /> Total
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-0.5 w-3 rounded bg-accent" /> Engaged
            </span>
            <span className="ml-auto text-accent font-medium">+46% growth</span>
          </div>
        </div>
      </div>

      {/* Pipeline Value Breakdown */}
      <div className="mt-4 rounded-xl border border-card-border bg-card p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted">
          Pipeline Value by Segment
        </p>
        <div className="h-24">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pipelineBarData} layout="vertical" barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: "#a1a1aa", fontSize: 10 }}
                tickFormatter={(v) => `\u20AC${(v / 1000).toFixed(0)}k`}
              />
              <YAxis
                type="category"
                dataKey="label"
                tick={{ fill: "#a1a1aa", fontSize: 11 }}
                width={40}
              />
              <Tooltip
                contentStyle={{ background: "#141414", border: "1px solid #27272a", borderRadius: 12, fontSize: 12 }}
                formatter={(value) => [`\u20AC${Number(value ?? 0).toLocaleString()}`, "Pipeline"]}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {pipelineBarData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Next Best Action Recommendations */}
      <div className="mt-4 rounded-xl border border-accent/15 bg-accent/5 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">
          Next Best Actions
        </p>
        <ul className="space-y-1.5">
          {nextActions.map((action, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/20 text-[9px] font-bold text-accent">
                {i + 1}
              </span>
              {action}
            </li>
          ))}
        </ul>
      </div>

      {/* Member List */}
      <div className="mt-4 rounded-xl border border-card-border bg-card p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted">
          All Members ({filtered.length})
        </p>
        <div className="max-h-48 overflow-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-card-border text-left text-muted">
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium hidden sm:table-cell">Size</th>
                <th className="pb-2 font-medium text-right">Intent</th>
                <th className="pb-2 font-medium text-right">Segment</th>
                <th className="pb-2 font-medium text-right hidden sm:table-cell">Est. Value</th>
              </tr>
            </thead>
            <tbody>
              {[...filtered].sort((a, b) => b.intentScore - a.intentScore).map((m) => {
                const seg = getSegment(m.intentScore, threshold);
                return (
                  <tr
                    key={m.name}
                    className={`border-b border-card-border/50 cursor-pointer transition-colors hover:bg-accent/5 ${
                      selectedMember?.name === m.name ? "bg-accent/10" : ""
                    }`}
                    onClick={() => setSelectedMember(m)}
                  >
                    <td className="py-1.5 font-medium text-foreground">{m.name}</td>
                    <td className="py-1.5 text-muted hidden sm:table-cell">{m.companySize}</td>
                    <td className="py-1.5 text-right font-semibold" style={{ color: segmentColors[seg] }}>
                      {m.intentScore}
                    </td>
                    <td className="py-1.5 text-right">
                      <span
                        className="inline-block rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase"
                        style={{
                          backgroundColor: segmentColors[seg] + "20",
                          color: segmentColors[seg],
                        }}
                      >
                        {seg}
                      </span>
                    </td>
                    <td className="py-1.5 text-right text-muted hidden sm:table-cell">
                      {"\u20AC"}{((segmentValues[seg] ?? 0) / 1000).toFixed(0)}k
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted/60">
        Synthetic community data. In production, engagement signals from Slack,
        events, and content interactions would feed the scoring model. Pipeline values based on
        segment-tier estimates (Hot: {"\u20AC"}15k, Warm: {"\u20AC"}8k, Cold: {"\u20AC"}2k).
      </p>
    </div>
  );
}
