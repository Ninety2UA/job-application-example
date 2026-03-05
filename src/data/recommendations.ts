export interface Recommendation {
  id: number;
  title: string;
  subtitle: string;
  insight: string;
  opportunity: string;
  proposal: string[];
  skillMapping: string[];
  roles: string[];
  icon: string;
}

export const recommendations: Recommendation[] = [
  {
    id: 1,
    title: "Attribution Confidence Score Dashboard",
    subtitle: "Help brands know when to trust the numbers",
    insight:
      "KLAR surfaces multi-touch attribution data, but brands often struggle to judge data quality — leading to over-reliance on metrics that may not reflect true performance.",
    opportunity:
      "Introducing a confidence score layer would differentiate KLAR from every competitor. When data quality is transparent, trust increases, churn decreases, and upsell to higher tiers becomes easier because customers understand *why* premium data matters.",
    proposal: [
      "Add a data quality scoring engine that evaluates tracking coverage, pixel health, and cross-channel match rates",
      "Surface confidence indicators alongside every attribution metric in the dashboard",
      "Build an alerting system that flags when confidence drops below thresholds, with specific remediation steps",
      "Create a 'Data Health' page that gamifies tracking improvements for onboarding customers",
    ],
    skillMapping: [
      "Built KPI scorecards and alerting systems at Google (BigQuery + Looker)",
      "Designed iOS SKAN Reporting Pack handling attribution confidence in privacy-constrained environments",
      "Ran daily performance engines requiring constant data quality validation",
    ],
    roles: ["PO Marketing Measurement", "Senior eCom Manager"],
    icon: "shield",
  },
  {
    id: 2,
    title: "Paid Growth Playbook for B2B with B2C DNA",
    subtitle: "Amplify the inbound flywheel with strategic paid",
    insight:
      "KLAR's growth relies heavily on organic inbound — community referrals, content, and word-of-mouth. While this builds trust, it limits scaling velocity. Competitors like Triple Whale invest aggressively in paid acquisition.",
    opportunity:
      "KLAR's B2C-quality brand and content give paid campaigns a huge advantage — higher CTRs, lower CPAs, and stronger landing page conversion. A disciplined paid layer could 2-3x pipeline growth without compromising brand authenticity.",
    proposal: [
      "Design a Meta + LinkedIn campaign framework targeting eCom operators (KLAR's ICP) with creative that mirrors the community tone",
      "Build a funnel model projecting pipeline impact by channel, budget, and creative type",
      "Launch retargeting sequences for blog readers, eCom Unity members, and pricing page visitors",
      "Establish a ROAS-positive paid engine with weekly optimization cadence and creative testing framework",
    ],
    skillMapping: [
      "Managed $XXXmm+ quarterly ad spend at Google with 40% YoY growth",
      "Deep expertise in Meta, Google Ads, and performance marketing across app + eCom verticals",
      "Designed go-to-market playbooks that scaled to 1,500+ clients",
    ],
    roles: ["Growth Lead", "Senior eCom Manager"],
    icon: "rocket",
  },
  {
    id: 3,
    title: "Customer Onboarding Flow Optimizer",
    subtitle: "Reduce time-to-value, increase retention",
    insight:
      "KLAR serves brands from Shopify solopreneurs to enterprise retailers — a wide spectrum that a single onboarding flow can't serve well. Fast time-to-value is the #1 driver of SaaS retention.",
    opportunity:
      "A personalized, adaptive onboarding wizard reduces setup friction and gets customers to their first 'aha moment' faster. This directly impacts trial-to-paid conversion, reduces support tickets, and builds the foundation for product-led growth.",
    proposal: [
      "Build a segmented onboarding wizard: brand size, channels, goals, and technical maturity",
      "Map each segment to a prioritized setup checklist that surfaces the most relevant KLAR features first",
      "Add progress tracking and time-to-value benchmarks ('brands like yours see first insights in X days')",
      "Create an education layer — contextual tips, micro-tutorials, and a resource library integrated into the onboarding flow",
    ],
    skillMapping: [
      "Achieved 100% client satisfaction rate through personalized onboarding strategies at Google",
      "Built customized tools and dashboards for 25+ clients with wildly different needs",
      "Designed the global App Campaigns data sharing compliance training — education at scale",
    ],
    roles: ["Product Adoption & Experience", "Senior eCom Manager"],
    icon: "zap",
  },
  {
    id: 4,
    title: "Cross-Channel Creative Performance Analyzer",
    subtitle: "Unify creative insights across Meta, Google, and TikTok",
    insight:
      "KLAR already offers creative analysis, but brands struggle to compare creative performance *across* channels with unified metrics. Each platform has different attribution windows, metrics, and formats.",
    opportunity:
      "A unified creative performance view answers the #1 question media buyers have: 'Which creative concepts actually work, and where?' This deepens KLAR's value proposition and makes the tool indispensable for creative teams — expanding the buyer within each account.",
    proposal: [
      "Build a cross-channel creative dashboard with normalized metrics (cost per creative concept, ROAS by asset type, fatigue curves)",
      "Add creative tagging and grouping — let brands organize assets by concept, theme, or campaign for aggregate performance",
      "Surface top performers and underperformers with actionable recommendations ('This concept works on Meta but underperforms on TikTok — here's why')",
      "Integrate AI-powered creative insights to detect patterns humans miss",
    ],
    skillMapping: [
      "Pioneered end-to-end performance insights platforms at Google",
      "Managed creative analysis across Google Ads App Campaigns for 25+ clients",
      "Built automated analysis pipelines surfacing creative trend insights to 3,000+ users",
    ],
    roles: ["PO Marketing Measurement", "Growth Lead"],
    icon: "palette",
  },
  {
    id: 5,
    title: "eCom Unity Community Conversion Pipeline",
    subtitle: "Turn community engagement into qualified pipeline",
    insight:
      "eCom Unity has 1,300+ operators — an enormous owned audience. But community engagement and sales pipeline likely operate as separate systems with no systematic bridge between them.",
    opportunity:
      "Community members who actively ask questions, share challenges, and engage with content are signaling pain points that KLAR solves. Systematically connecting engagement data to pipeline qualification could turn eCom Unity into KLAR's most efficient acquisition channel.",
    proposal: [
      "Build an engagement scoring model: activity frequency, topic relevance, question types, and event attendance",
      "Map engagement signals to KLAR feature relevance — someone asking about attribution is a different lead than someone asking about retention",
      "Create warm handoff workflows from community to sales, triggered by score thresholds",
      "Measure community-attributed pipeline to prove ROI and justify continued investment in eCom Unity",
    ],
    skillMapping: [
      "Established and scaled Google's IGT program from 0 to 1,500+ clients using similar community-to-pipeline thinking",
      "Built lead scoring and conversion frameworks driving 300% YoY investment growth",
      "Experience bridging marketing/community engagement with business outcomes through data",
    ],
    roles: ["Growth Lead", "Product Adoption & Experience"],
    icon: "users",
  },
];
