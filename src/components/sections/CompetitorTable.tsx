"use client";

import { type CompetitorData } from "@/data/analysis";

const features = [
  { key: "attribution" as const, label: "Attribution" },
  { key: "mmm" as const, label: "MMM" },
  { key: "creative" as const, label: "Creative" },
  { key: "retention" as const, label: "Retention" },
  { key: "profitability" as const, label: "Profitability" },
  { key: "community" as const, label: "Community" },
];

function Check() {
  return (
    <svg className="mx-auto h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function Cross() {
  return (
    <svg className="mx-auto h-5 w-5 text-muted/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function CompetitorTable({ competitors }: { competitors: CompetitorData[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-card-border">
            <th className="pb-3 text-left font-medium text-muted">Platform</th>
            {features.map((f) => (
              <th key={f.key} className="pb-3 text-center font-medium text-muted">
                {f.label}
              </th>
            ))}
            <th className="pb-3 text-center font-medium text-muted">Multi-Platform</th>
            <th className="pb-3 text-right font-medium text-muted">Pricing</th>
          </tr>
        </thead>
        <tbody>
          {competitors.map((c) => (
            <tr
              key={c.name}
              className={`border-b border-card-border/50 ${
                c.name === "KLAR" ? "bg-accent/5" : ""
              }`}
            >
              <td className={`py-3 font-medium ${c.name === "KLAR" ? "text-accent" : ""}`}>
                {c.name}
              </td>
              {features.map((f) => (
                <td key={f.key} className="py-3 text-center">
                  {c[f.key] ? <Check /> : <Cross />}
                </td>
              ))}
              <td className="py-3 text-center">
                {!c.shopifyOnly ? <Check /> : <Cross />}
              </td>
              <td className="py-3 text-right text-muted">{c.pricing}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
