# KLAR Application Project — Claude Code Prompt

## Objective

Build an interactive web application that serves as my job application to **KLAR** (getklar.com) — the eCom Data Operating System for attribution, retention, and profitability analytics. This isn't a cover letter. It's a working prototype that demonstrates I've already started the job: researching their business, identifying opportunities, and building tangible solutions.

The deliverable is a polished Next.js web app deployed to Vercel that I will send directly to KLAR's co-founder alongside my application.

---

## Context

### About KLAR
- **Product:** Data Operating System for eCommerce — multi-touch attribution, unified marketing measurement, creative analysis, retention reporting, influencer CRM, profitability reporting, industry benchmarking
- **Customers:** 2,000+ eCom/DTC brands (Loop Earplugs, Holy, Snocks, BLACKROLL, Armed Angels, yfood, etc.)
- **GTM:** Inbound flywheel — customer referrals, agency partnerships, eCom Unity community (1,300+ operators)
- **Team:** ~20–30, Munich HQ, distributed-first. Founded by Max (CEO, marketing/ops background), Cillier & Frank (tech). Met 10+ years ago in Cape Town
- **Guiding principle:** "Do Work You Are Proud Of"
- **Website:** https://getklar.com
- **About / Jobs:** https://getklar.com/about

### About Me (Resume attached as context)
- **Name:** Dominik Benger — based in Munich
- **Background:** Nearly 8 years at Google (Dublin → Hamburg → Amsterdam) as Senior Analytical Lead and Technical Apps Lead. Managed large Google Ads portfolios across 25+ clients in apps & gaming, Northern Europe. Deep expertise in Google Ads (App Campaigns, PMax, Demand Gen), BigQuery, Looker, mobile measurement (SKAN, MMPs), and LTV/cohort analytics
- **Current focus:** Independent consultant (dbenger.com) specializing in performance marketing, user acquisition, analytics, and AI/LLM implementation for app & gaming companies. Actively building hands-on AI engineering skills — Claude Code, prompt engineering, automation workflows, RAG pipelines, agent frameworks
- **Why KLAR:** Intersection of eCom analytics + SaaS + growth — maps directly to my experience scaling data-driven solutions for advertisers. Munich-based. Culture fit with "Do Work You Are Proud Of"
- **Resume file:** `Dominik_Benger_-_Resume__V3_.pdf`

### My Existing Portfolio Site — dbenger.com (reference this)
Fetch and study https://dbenger.com before building. It's a Next.js + Tailwind + Vercel app I built that already contains:
- **Interactive career timeline** — visual journey (Zagreb → Dublin → Hamburg → Amsterdam → Munich) with role cards, tech tags, and category filtering (Apps & Gaming, Retail & FMCG, Leadership, Analytics, AI & Innovation)
- **AI chatbot assistant** — floating chat widget powered by Gemini Flash with my resume/experience as context. Users can ask about my background, skills, and projects
- **AI Solution Matcher** — a second AI feature where users describe a challenge and get a customized 3-step collaboration plan (Audit → Build → Operate)
- **Detailed experience sections** — each role expandable with subsections (Revenue & Client Impact, Performance Operations, AI Integration, Key Projects, etc.) and tech stack tags
- **Key projects** — iOS SKAN Reporting Pack (linked to GitHub), One-Stop Shop BI Platform, Global Data Sharing Compliance Policy
- **Collaboration model** — Audit / Build / Operate service tiers with descriptions

**Why this matters for the KLAR app:** Don't rebuild what already exists. The KLAR application site should be a *focused, KLAR-specific deliverable* — not a second portfolio. Reference dbenger.com for the full picture; use the KLAR app to show depth of research, strategic thinking, and working prototypes. Reuse proven patterns from dbenger.com (especially the AI chat architecture) but keep the KLAR app lean and purpose-built.

### Open Roles I'm Targeting (for reference — the app should position me across these)
1. **Growth Lead/Manager** — amplifying KLAR's inbound flywheel, paid acquisition, B2C mindset in B2B (contact: max@getklar.com)
2. **Product Owner - Marketing Measurement** — attribution product IC, working with data science/engineering on MTA, MMM, incrementality (contact: product-hiring@getklar.com)
3. **Product Adoption & Experience Manager** — user enablement, onboarding, education infrastructure (contact: uli@getklar.com)
4. **Senior eCommerce Manager** — customer-facing strategic partner, onboarding, product feedback loop (contact: franz@getklar.com)

Job description URLs:
- https://getklar.getoutline.com/s/726bf6b9-5676-4969-8912-fe9facfd7677
- https://getklar.getoutline.com/s/11f1c57e-7d97-4677-89eb-96d784a55700
- https://getklar.getoutline.com/s/308173b0-1ef2-4f53-8c24-a9cb2862ca4c
- https://getklar.getoutline.com/s/d1d04b04-22bf-4da1-855a-610d26b9a606

---

## Architecture & Structure

### Tech Stack
- **Framework:** Next.js (App Router) with TypeScript — same stack as dbenger.com
- **Styling:** Tailwind CSS
- **Deployment:** Vercel
- **AI Chat Layer:** Adapt the same AI chatbot architecture from dbenger.com (floating widget, Gemini Flash or Anthropic API) but with KLAR-specific context: my resume, the business analysis, all 5 recommendations, and KLAR background as the system prompt. The dbenger.com implementation is the proven pattern — reuse the component structure and adapt the knowledge base
- **Data/Charts:** Recharts or similar for any data visualizations in MVPs

### Site Map & Navigation

The app should have a clean, professional navigation with these main sections:

```
/ (Landing / Hero)
├── /analysis        → KLAR Business Model & Market Analysis
├── /recommendations → 5 Strategic Recommendations (with MVP links)
│   ├── /recommendations/1  → Recommendation + MVP #1
│   ├── /recommendations/2  → Recommendation + MVP #2
│   ├── /recommendations/3  → Recommendation + MVP #3
│   ├── /recommendations/4  → Recommendation + MVP #4
│   └── /recommendations/5  → Recommendation + MVP #5
├── /about           → Why KLAR + Dominik (lean — links to dbenger.com for full portfolio)
└── [AI Chat Widget] → Persistent chat overlay (adapted from dbenger.com pattern)
```

---

## Phase 1: Research & Analysis (Do this first)

Before building anything, research KLAR deeply. Use web search to gather information from:
- https://getklar.com and all product feature pages
- Their blog: https://getklar.com/blog
- eCom Unity community: https://www.ecom-unity.eu/
- Their newsletter: https://ecomunity.beehiiv.com/
- LinkedIn profiles of founders (Max Rast, Cillier Roux, Frank Roux)
- Any press coverage, podcast appearances, or reviews (G2, Trustpilot, etc.)
- Competitor landscape: Triple Whale, Northbeam, Rockerbox, Polar Analytics, Lifetimely, Peel Insights

### Deliverable: `/analysis` page
Produce a structured business analysis covering:
1. **Business Model Breakdown** — how KLAR makes money, pricing tiers, ICP, go-to-market
2. **Product-Market Fit Assessment** — where they're strong, where there's friction
3. **Competitive Landscape** — how KLAR positions vs. Triple Whale, Northbeam, etc.
4. **Growth Levers & Gaps** — what's working in their flywheel, what could be improved
5. **Market Tailwinds & Headwinds** — privacy changes, attribution complexity, eCom consolidation

This analysis should be visual and interactive — not a wall of text. Use cards, expandable sections, comparison tables, and charts where appropriate.

---

## Phase 2: 5 Strategic Recommendations with MVP Prototypes

Based on the business analysis, develop **5 concrete recommendations** — things I would drive or build if hired. Each recommendation should follow this structure:

### For each recommendation (`/recommendations/[n]`):
1. **The Insight** — what I observed from my research (1–2 sentences)
2. **The Opportunity** — why this matters for KLAR's growth (1 paragraph)
3. **The Proposal** — what I would do, concretely (action plan with phases)
4. **Skill Mapping** — which of my skills/experience directly applies (link to resume)
5. **Working MVP** — an interactive prototype demonstrating the concept

### Recommendation Ideas (research first, then refine — these are starting directions):

1. **Attribution Confidence Score Dashboard** — build an interactive prototype showing how KLAR could surface data quality/confidence metrics alongside attribution data, helping brands know when to trust the numbers vs. dig deeper. Leverages my experience building KPI scorecards and alerting systems at Google

2. **Paid Growth Playbook for B2B with B2C DNA** — design a Meta/LinkedIn campaign framework with sample creatives, landing page wireframes, and a funnel model showing how KLAR's inbound flywheel could be amplified with paid. Interactive funnel calculator MVP. Leverages my performance marketing and UA background

3. **Customer Onboarding Flow Optimizer** — prototype an interactive onboarding wizard that guides new KLAR users through setup based on their brand size, channels, and goals. Show time-to-value reduction. Leverages my product enablement and customer strategy experience

4. **Cross-Channel Creative Performance Analyzer** — build a prototype dashboard that shows how creative assets perform across channels (Meta, Google, TikTok) with unified metrics. Directly related to my Creative Analytics Platform work and KLAR's existing creative analysis feature

5. **eCom Unity → KLAR Conversion Pipeline** — model how community engagement signals (activity, questions, pain points) could be used to identify high-intent prospects. Build a simple scoring dashboard prototype. Leverages my analytics and growth experience

**Important:** These are starting directions. After completing the research phase, refine or replace these with recommendations that are more specific to what you actually find about KLAR's gaps and opportunities. The MVPs should be functional, interactive React components — not static mockups.

---

## Phase 3: Why KLAR + Dominik (`/about`)

This is NOT a second portfolio — dbenger.com already has the interactive career timeline, detailed experience sections, AI assistant, and full background. The `/about` page here should be **lean and KLAR-specific**: why I'm the right person for this company, right now.

### Include:
- **Skills-to-Roles matrix** — a visual mapping of my specific skills/experience against KLAR's open roles (Growth Lead, PO Marketing Measurement, Product Adoption Manager, Senior eCom Manager). Show where I'm a direct fit vs. adjacent fit. Make it interactive — click a role to highlight matching skills
- **"Why KLAR" narrative** — a compelling, concise personal statement (not a cover letter — more like a founder's pitch). Why this company, why this stage, why Munich, why now
- **Proof points** — 3–5 key metrics from Google that map to KLAR's world (revenue managed, YoY growth rates, client satisfaction, users on my BI platforms, clients scaled)
- **CTA strip** — prominent link to dbenger.com ("See my full portfolio, career timeline, and AI assistant →"), plus LinkedIn and GitHub (SKAN Reporting Pack)

### Don't include:
- A full career timeline (already at dbenger.com)
- Detailed role descriptions (already at dbenger.com)
- A generic skills list (already at dbenger.com)
- Another AI Solution Matcher (already at dbenger.com)

---

## Phase 4: AI Chat Widget (adapted from dbenger.com)

dbenger.com already has a working AI chatbot pattern (floating widget, Gemini Flash backend, resume as context). Reuse that architecture here with KLAR-specific knowledge:

- **Backend:** Same approach as dbenger.com — Gemini Flash API (or Anthropic API if preferred). The key difference is the system prompt context
- **System prompt context:** My full resume + the `/analysis` business analysis + all 5 recommendations + KLAR company background + the job descriptions. This is a much richer knowledge base than the generic dbenger.com chatbot
- **Behavior:** The chatbot should be able to answer KLAR-specific questions that a co-founder reviewing my application would ask:
  - "What's Dominik's experience with attribution?"
  - "Why does he think KLAR should invest in paid growth?"
  - "How would he approach the Growth Lead role differently?"
  - "What did he build at Google that's relevant to our product?"
  - "How do his recommendations connect to our roadmap?"
- **UX:** Same floating button pattern as dbenger.com — minimized by default, expands to chat panel. Styled to match this site's KLAR-aligned design, not the dbenger.com design
- **Implementation shortcut:** If the dbenger.com codebase is available locally, copy the chat component and adapter files, then swap the system prompt and styling. Don't rebuild from scratch

---

## Design Direction

- **Relationship to dbenger.com:** This site should feel like a *sibling* to dbenger.com — clearly from the same person, but purpose-built for KLAR. Don't clone the dbenger.com design. Instead, take the professional quality bar and adapt it toward KLAR's visual language
- **Aesthetic:** Data-forward, editorial, professional but not corporate. KLAR's own site uses dark backgrounds, bold typography, and green accents — lean into this. The site should feel like something KLAR's team would build internally, signaling cultural fit at a design level
- **Typography:** Use a distinctive, modern sans-serif pairing — avoid Inter/Roboto. Consider Satoshi, General Sans, or Cabinet Grotesk. dbenger.com's font choices are a reference point for quality but this site should have its own identity
- **Color palette:** Draw from KLAR's brand (dark mode, green/emerald accents) with a personal accent color. Should feel like it belongs in the KLAR ecosystem
- **Motion:** Subtle page transitions, scroll-triggered reveals on the analysis page, interactive chart animations. Match the polish level of dbenger.com but not the same animations — keep it distinct
- **Responsive:** Must work perfectly on desktop and mobile (the co-founder will likely first see this on their phone)

---

## Deployment

- Deploy to Vercel (same platform as dbenger.com)
- **Preferred domain:** `klar.dbenger.com` as a subdomain of the existing portfolio — this signals ownership and intentionality. Alternatively: `klar-application.vercel.app`
- Ensure fast load times, clean meta tags, and a good social preview (OG image) for when I share the link directly with the co-founder
- OG image should say something like "Dominik Benger × KLAR — A Working Application" with KLAR-aligned design

---

## Success Criteria

The co-founder should look at this and think:
1. "This person has done more research on our business than most of our employees"
2. "These recommendations are specific and actionable — not generic consulting fluff"
3. "The MVPs actually work and show technical capability"
4. "This is the kind of initiative and depth we want on our team"
5. "I need to talk to this person"

---

## Files & References Provided
- `Dominik_Benger_-_Resume__V3_.pdf` — my current resume
- Screenshot of "Go Deep or Go Home" article — the inspiration/philosophy behind this approach
- https://dbenger.com — my existing portfolio site (Next.js + Tailwind + Vercel). Study this for: design quality bar, AI chatbot architecture, career timeline component patterns, and overall UX approach. The KLAR app should match this quality level but have its own KLAR-aligned identity

---

## Execution Notes for Claude Code
- **First:** Fetch and study https://dbenger.com to understand the existing portfolio site's architecture, design patterns, and AI chat implementation
- **Second:** Research KLAR deeply — fetch and analyze their website, blog, competitors, and any public information before writing any code
- Use `plan` mode first to outline the full architecture, then switch to implementation
- Build incrementally: landing page → analysis → recommendations → about → chat widget
- If the dbenger.com repo is available locally, inspect it for reusable components (especially the AI chat widget, API route handlers, and layout patterns)
- Test each section before moving on
- Commit frequently with clear messages
- Prioritize the analysis quality and MVP interactivity over pixel-perfect design — substance over polish, but both matter
- The `/about` page should be the lightest lift — it's just a bridge to dbenger.com, not a rebuild
