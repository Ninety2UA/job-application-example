export interface Skill {
  name: string;
  description: string;
  roles: string[];
}

export interface Role {
  id: string;
  title: string;
  contact: string;
  summary: string;
}

export const roles: Role[] = [
  {
    id: "growth",
    title: "Growth Lead",
    contact: "max@getklar.com",
    summary: "Amplify KLAR's inbound flywheel with paid acquisition and B2C marketing DNA",
  },
  {
    id: "measurement",
    title: "PO Marketing Measurement",
    contact: "product-hiring@getklar.com",
    summary: "Own the attribution product — MTA, MMM, and incrementality measurement",
  },
  {
    id: "adoption",
    title: "Product Adoption & Experience",
    contact: "uli@getklar.com",
    summary: "Build onboarding, education, and enablement infrastructure for KLAR customers",
  },
  {
    id: "ecom",
    title: "Senior eCom Manager",
    contact: "franz@getklar.com",
    summary: "Strategic customer partner driving onboarding, retention, and product feedback",
  },
];

export const skills: Skill[] = [
  {
    name: "Performance Marketing & Paid Acquisition",
    description: "Managed $XXXmm+ quarterly Google Ads spend with 40% YoY growth. Deep Meta, Google, TikTok expertise.",
    roles: ["growth", "ecom"],
  },
  {
    name: "Attribution & Measurement",
    description: "Built iOS SKAN Reporting Pack. Expert in MTA, MMM concepts, privacy-first measurement (SKAdNetwork, Adjust, AppsFlyer).",
    roles: ["measurement", "growth"],
  },
  {
    name: "BigQuery & Analytics Infrastructure",
    description: "Built KPI scorecards, cohort/LTV views, executive dashboards in BigQuery + Looker for 25+ clients.",
    roles: ["measurement", "ecom"],
  },
  {
    name: "Client Strategy & Consulting",
    description: "Engaged C-suite executives at leading global brands. 100% client satisfaction rate. Managed 25+ accounts simultaneously.",
    roles: ["ecom", "growth"],
  },
  {
    name: "Product Enablement & Onboarding",
    description: "Trained 50+ reps, designed global compliance training, built customized tools improving client productivity 40%.",
    roles: ["adoption", "ecom"],
  },
  {
    name: "Platform Building & AI Integration",
    description: "Pioneered performance insights platform (3,000+ users). Integrated Gemini AI into analytics workflows.",
    roles: ["measurement", "adoption"],
  },
  {
    name: "Go-to-Market & Scaling",
    description: "Designed GTM playbooks scaling to 1,500+ clients with 300% YoY investment growth. Community-to-pipeline conversion.",
    roles: ["growth", "adoption"],
  },
  {
    name: "Creative Analysis & Optimization",
    description: "Built automated creative trend analysis across Google Ads App Campaigns. A/B testing and incrementality measurement.",
    roles: ["measurement", "growth"],
  },
  {
    name: "International Growth",
    description: "Drove 55% average YoY increase in market exports across 25+ clients in Benelux + Nordics.",
    roles: ["ecom", "growth"],
  },
  {
    name: "Data-Driven Operations",
    description: "Ran daily performance engines: automated pipelines, anomaly detection, rapid optimization standups with senior stakeholders.",
    roles: ["measurement", "ecom", "adoption"],
  },
];
