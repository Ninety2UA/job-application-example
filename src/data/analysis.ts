export interface AnalysisSection {
  id: string;
  title: string;
  subtitle: string;
  content: string[];
  highlights?: { label: string; value: string }[];
}

export interface CompetitorData {
  name: string;
  attribution: boolean;
  mmm: boolean;
  creative: boolean;
  retention: boolean;
  profitability: boolean;
  community: boolean;
  shopifyOnly: boolean;
  pricing: string;
}

export const competitors: CompetitorData[] = [
  {
    name: "KLAR",
    attribution: true,
    mmm: true,
    creative: true,
    retention: true,
    profitability: true,
    community: true,
    shopifyOnly: false,
    pricing: "Custom (Tiered)",
  },
  {
    name: "Triple Whale",
    attribution: true,
    mmm: true,
    creative: true,
    retention: false,
    profitability: true,
    community: false,
    shopifyOnly: true,
    pricing: "Custom",
  },
  {
    name: "Northbeam",
    attribution: true,
    mmm: true,
    creative: true,
    retention: false,
    profitability: false,
    community: false,
    shopifyOnly: false,
    pricing: "Enterprise",
  },
  {
    name: "Polar Analytics",
    attribution: true,
    mmm: false,
    creative: false,
    retention: true,
    profitability: true,
    community: false,
    shopifyOnly: false,
    pricing: "From $300/mo",
  },
  {
    name: "Lifetimely",
    attribution: false,
    mmm: false,
    creative: false,
    retention: true,
    profitability: true,
    community: false,
    shopifyOnly: true,
    pricing: "From $149/mo",
  },
  {
    name: "Peel Insights",
    attribution: false,
    mmm: false,
    creative: false,
    retention: true,
    profitability: true,
    community: false,
    shopifyOnly: true,
    pricing: "From $149/mo",
  },
];

export const analysisSections: AnalysisSection[] = [
  {
    id: "business-model",
    title: "Business Model Breakdown",
    subtitle: "How KLAR makes money and who they serve",
    content: [
      "KLAR operates as a SaaS platform offering tiered pricing based on tracked revenue and feature access. The product suite spans multi-touch attribution (MTA), marketing mix modeling (MMM), creative analysis, retention reporting, influencer CRM, profitability analytics, and industry benchmarking.",
      "Their ICP is eCom/DTC brands doing significant revenue — from scaling Shopify stores to enterprise retailers. Named customers include Loop Earplugs, Holy, Snocks, BLACKROLL, Armed Angels, yfood, and 2,000+ total brands.",
      "KLAR's Shopify App Store listing shows 'free to install' with external billing — indicating custom pricing aligned to brand size. This is smart: it removes friction at the discovery stage while enabling value-based pricing conversations.",
    ],
    highlights: [
      { label: "Customers", value: "2,000+" },
      { label: "Platform Position", value: "eCom Data OS" },
      { label: "Revenue Model", value: "SaaS (Tiered)" },
      { label: "Distribution", value: "Shopify App + Direct" },
    ],
  },
  {
    id: "product-market-fit",
    title: "Product-Market Fit Assessment",
    subtitle: "Where KLAR is strong and where there's friction",
    content: [
      "KLAR's strongest PMF signal is breadth: they're not just attribution or just profitability — they're positioning as the single data layer for eCom operators. Case studies like Maniko (744% revenue growth) and Bergmensch (+256% CM3) validate that the product drives real business outcomes.",
      "The 'Data Operating System' positioning is powerful because it creates a platform moat: once a brand centralizes data in KLAR, switching costs are high. Competitors that focus on a single feature (Lifetimely on LTV, Northbeam on attribution) can't match this breadth.",
      "Potential friction points: (1) Onboarding complexity for smaller brands that don't have a data team, (2) Trust in attribution models — brands need to understand *why* KLAR's numbers differ from platform-reported metrics, (3) Limited Shopify App Store reviews (just 1) suggest the Shopify channel is underutilized vs. direct sales.",
    ],
    highlights: [
      { label: "Case Study: Maniko", value: "744% Revenue Growth" },
      { label: "Case Study: Bergmensch", value: "+256% CM3" },
      { label: "Key Strength", value: "Platform Breadth" },
      { label: "Friction", value: "Onboarding Complexity" },
    ],
  },
  {
    id: "competitive-landscape",
    title: "Competitive Landscape",
    subtitle: "KLAR vs. Triple Whale, Northbeam, and the field",
    content: [
      "The eCom analytics space is consolidating fast. Triple Whale leads in brand awareness (50,000+ brands, trained on $82B+ GMV) but remains Shopify-only. Northbeam targets enterprise with advanced MTA and MMM but has opaque pricing. Polar Analytics competes on AI-native features (Claude MCP integration) and incrementality testing.",
      "Rockerbox was acquired by DoubleVerify for $85M in Feb 2025 — validating the market and signaling that standalone attribution tools are becoming features of larger platforms. This is a tailwind for KLAR's 'Data OS' positioning.",
      "KLAR's unique moat: eCom Unity community (2,000+ operators) creates an owned distribution channel that no competitor has. This community-led growth model builds trust and provides product feedback that competitors can't replicate.",
    ],
  },
  {
    id: "growth-levers",
    title: "Growth Levers & Gaps",
    subtitle: "What's working in KLAR's flywheel and what could be improved",
    content: [
      "The inbound flywheel is strong: eCom Unity community → content/events → word-of-mouth referrals → product adoption → community advocacy. Max Rast's newsletter reaches operators directly, and in-person events (OMR, K5, 'Meet the Brand') build high-trust relationships.",
      "Growth gaps I see: (1) No visible paid acquisition strategy — the flywheel is organic-only, limiting scaling velocity. (2) The Shopify App Store channel is underutilized (1 review vs. Lifetimely's 454). (3) Content is strong but primarily top-of-funnel — more bottom-of-funnel comparison content could capture high-intent searchers. (4) Onboarding appears manual, suggesting product-led growth opportunities.",
      "Flywheel acceleration opportunities: paid retargeting of blog readers, systematic community-to-pipeline conversion, self-serve onboarding for smaller brands, and Shopify App Store optimization.",
    ],
    highlights: [
      { label: "Community Size", value: "2,000+ Operators" },
      { label: "Content Channel", value: "Newsletter + Events" },
      { label: "Gap: Paid Growth", value: "Not Visible" },
      { label: "Gap: App Store", value: "1 Review" },
    ],
  },
  {
    id: "market-dynamics",
    title: "Market Tailwinds & Headwinds",
    subtitle: "Privacy shifts, AI, and the future of eCom analytics",
    content: [
      "Tailwinds: (1) Privacy changes (iOS 14.5+, Safari fingerprint protection, cookie evolution) make first-party data platforms like KLAR essential — ~70% of iOS users are invisible to traditional tracking. (2) MMM demand surged 300%+ since 2021, with next-gen solutions now operating at campaign/ad-set level. (3) eCom consolidation forces brands to understand profitability across channels, not just revenue.",
      "Headwinds: (1) Competition is intensifying — Triple Whale's commerce-trained AI, Polar's AI agents, and DoubleVerify/Rockerbox's combined reach all raise the bar. (2) AI commoditization risk — if every platform adds 'AI insights', differentiation must come from data quality and actionability, not just having AI features. (3) Market education burden: many brands still rely on last-click attribution and need convincing that multi-touch matters.",
      "Net assessment: The tailwinds dramatically outweigh the headwinds. KLAR is well-positioned in a growing market where trust, data breadth, and community-driven education are competitive moats. The key is scaling distribution without losing the human touch that makes eCom Unity special.",
    ],
    highlights: [
      { label: "iOS Opt-Out Rate", value: "~70%" },
      { label: "MMM Demand Growth", value: "300%+" },
      { label: "Market Signal", value: "Rockerbox: $85M Exit" },
      { label: "Net Assessment", value: "Strong Tailwinds" },
    ],
  },
];
