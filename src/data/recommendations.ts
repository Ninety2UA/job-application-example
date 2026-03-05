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
  // --- PO Marketing Measurement Deep-Dive ---
  {
    id: 6,
    title: "Attribution Model Comparator",
    subtitle: "See how different models tell different stories about the same revenue",
    insight:
      "eCom brands using platform-reported last-click data overcount conversions by 30-50%. Different attribution models credit channels differently — making budget decisions unreliable without model comparison. KLAR already offers 7 models, but brands rarely understand why the numbers diverge.",
    opportunity:
      "A side-by-side model comparison view answers the #1 question from new KLAR customers: 'Why don't your numbers match Facebook?' Showing exactly how credit shifts between models builds trust, reduces churn from attribution confusion, and makes the case for KLAR's advanced Data-Driven and MMM models.",
    proposal: [
      "Build a model comparison view where brands select 2-3 attribution models and see revenue credit shift across channels in real time",
      "Highlight the biggest disagreement between models with a 'conflict zone' callout — this is where budget decisions are most vulnerable",
      "Add a 'Model Recommendation Engine' that suggests the best model based on brand's customer journey length, channel mix, and data maturity",
      "Create educational tooltips explaining *why* each model credits differently — turning confusion into understanding",
    ],
    skillMapping: [
      "Developed iOS SKAN Reporting Pack at Google — navigating attribution model transitions at scale",
      "Built KPI scorecards comparing attribution methodologies across 25+ advertiser accounts",
      "Deep expertise in multi-touch attribution from managing $XXXmm+ quarterly ad spend",
    ],
    roles: ["PO Marketing Measurement"],
    icon: "scale",
  },
  {
    id: 7,
    title: "Channel Saturation Curve Analyzer",
    subtitle: "Find where your next dollar stops working",
    insight:
      "Most eCom brands scale ad spend linearly without understanding diminishing returns. Spending 2x on a channel rarely returns 2x — channels saturate, CPAs rise, and marginal ROAS declines. Saturation curves are the key output of MMM that directly drives budget decisions.",
    opportunity:
      "Visualizing diminishing returns curves per channel is the 'aha moment' that sells MMM to skeptical brands. KLAR's MMM model already calculates these curves — surfacing them as an interactive budget simulator would be the most compelling feature demo in sales calls and the most used dashboard by power users.",
    proposal: [
      "Surface saturation curves from KLAR's MMM engine as interactive visualizations per channel",
      "Add a budget optimizer that recommends reallocation from saturated to under-invested channels — showing projected revenue lift without increasing total spend",
      "Build a 'What-If' simulator: drag budget between channels and see projected ROAS change in real time",
      "Include historical saturation drift — show how curves shift seasonally (Q4 saturation differs from Q1)",
    ],
    skillMapping: [
      "Optimized $XXXmm+ quarterly ad budgets across channels at Google — directly worked with saturation dynamics",
      "Built automated performance analysis pipelines that identified diminishing returns patterns",
      "Experience with MMM concepts and budget allocation frameworks at enterprise scale",
    ],
    roles: ["PO Marketing Measurement"],
    icon: "trending",
  },
  {
    id: 8,
    title: "Incrementality Test Planner",
    subtitle: "Design holdout experiments with statistical rigor",
    insight:
      "Platform-reported ROAS frequently overstates true incrementality. 2025 benchmarks from Stella showed no consistent relationship between platform ROAS and actual incremental lift — some brands showed 4.0x platform ROAS but <1.0x incrementality factor. Without holdout testing, brands are flying blind.",
    opportunity:
      "KLAR's incrementality testing (currently in beta) could become a key differentiator. A self-service test planner that handles power calculations, geo-region selection, and projected outcomes would justify the Core+Attribution tier and give brands confidence that their measurement is grounded in causal evidence, not correlation.",
    proposal: [
      "Build a self-service incrementality test planner: select channel, configure holdout %, test duration, and daily spend",
      "Auto-calculate statistical power, minimum detectable effect, and required sample size — remove the need for a data scientist",
      "Add a test timeline visualization showing projected treatment vs control group outcomes",
      "Feed test results back into MTA and MMM calibration — creating a feedback loop that improves all measurement over time",
    ],
    skillMapping: [
      "Designed A/B testing and incrementality measurement frameworks at Google for app campaigns",
      "Built automated analysis pipelines with statistical rigor for 25+ advertiser accounts",
      "Experience with geo-based testing methodologies and causal inference in advertising",
    ],
    roles: ["PO Marketing Measurement"],
    icon: "beaker",
  },
  {
    id: 9,
    title: "Privacy Signal Loss Simulator",
    subtitle: "Quantify what you can't see in a cookieless world",
    insight:
      "~70% of iOS users opt out of tracking after ATT. Third-party cookies are dying. Cross-device journeys are invisible. eCom brands lose 30-60% of their attribution data to privacy changes — and most don't realize how much they're missing or how it distorts their decisions.",
    opportunity:
      "A simulator showing the growing gap between platform-reported metrics and reality would be KLAR's most powerful sales tool. It turns 'trust our first-party attribution' into 'see exactly how much your current setup is missing' — making the ROI of KLAR's tracking crystal clear.",
    proposal: [
      "Build an interactive signal loss simulator with sliders for iOS ATT opt-out rate, cookie consent rate, and cross-device blindness",
      "Show a real-time waterfall chart: total conversions → visible conversions → modeled recoverable → permanently invisible",
      "Compare platform-reported performance vs estimated true performance — quantifying the 'attribution gap'",
      "Add a 'KLAR recovery rate' showing how much signal KLAR's first-party tracking recovers compared to pixel-only attribution",
    ],
    skillMapping: [
      "Developed iOS SKAN Reporting Pack handling attribution confidence in privacy-constrained environments",
      "Expert in SKAdNetwork, ATT frameworks, and privacy-first measurement from Google",
      "Managed advertiser transitions through iOS 14.5 — firsthand experience with signal loss impact",
    ],
    roles: ["PO Marketing Measurement"],
    icon: "eye-off",
  },
  {
    id: 10,
    title: "Unified Measurement Framework",
    subtitle: "Triangulate truth from MTA, MMM, and incrementality",
    insight:
      "No single measurement method gives the full picture. MTA is granular but misses non-click impact. MMM captures upper-funnel effects but lacks campaign-level precision. Incrementality is ground truth but can't run continuously. Each method has blind spots — used alone, they mislead.",
    opportunity:
      "KLAR's unified measurement engine — combining MTA, MMM, and incrementality — is their single strongest differentiator. No competitor unifies all three into one dynamic model. Visualizing how these three methods converge on a 'triangulated truth' for each channel would be the ultimate product vision showcase.",
    proposal: [
      "Build a per-channel measurement dashboard showing three independent estimates (MTA, MMM, incrementality) with confidence intervals",
      "Calculate a 'Unified Estimate' that weights each method based on data quality and recency — showing higher confidence than any single method alone",
      "Add a 'Measurement Health' indicator showing which methods have fresh data and which need recalibration",
      "Create a methodology explainer that educates brands on *why* triangulation produces better decisions than any single method",
    ],
    skillMapping: [
      "Built measurement frameworks combining multiple attribution methodologies at Google (SKAN, MTA, MMPs)",
      "Pioneered end-to-end performance insights platform synthesizing data from multiple measurement sources",
      "Expert in translating complex measurement concepts into actionable business insights for C-suite audiences",
    ],
    roles: ["PO Marketing Measurement"],
    icon: "triangle",
  },
];
