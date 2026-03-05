---
title: "feat: Build KLAR Interactive Job Application"
type: feat
status: active
date: 2026-03-05
origin: docs/brainstorms/2026-03-05-klar-application-brainstorm.md
---

# feat: Build KLAR Interactive Job Application

## Overview

Build an interactive Next.js web application that serves as Dominik Benger's job application to KLAR (getklar.com) — the eCom Data Operating System. Instead of a traditional cover letter, this is a working prototype deployed to Vercel that demonstrates deep business research, strategic thinking, and technical capability. The app targets 4 open roles (Growth Lead, PO Marketing Measurement, Product Adoption, Senior eCom Manager) and will be sent directly to KLAR's co-founder.

## Problem Statement

Traditional job applications (cover letter + resume) fail to demonstrate the actual skills a candidate brings. For a data-driven SaaS company like KLAR, the best signal of fit is showing — not telling — through research depth, strategic thinking, and working prototypes. Dominik has the technical ability to build this signal; the task is to structure and ship it as a polished web experience.

## Proposed Solution

A polished Next.js app deployed to Vercel at `klar.dbenger.com` containing:
- **Landing/hero page** — hooks the viewer in 3-5 seconds with a bold headline and CTA
- **Interactive business analysis** (`/analysis`) — research-driven, visual, not a wall of text
- **5 strategic recommendations** (`/recommendations/[1-5]`) — each with insight, opportunity, proposal, skill mapping, and a fully interactive MVP prototype
- **"Why KLAR + Dominik" about page** (`/about`) — lean, KLAR-specific, linking to dbenger.com for full portfolio
- **Persistent AI chatbot** — Gemini Flash with KLAR-specific context (resume + analysis + recommendations + job descriptions)

(see brainstorm: `docs/brainstorms/2026-03-05-klar-application-brainstorm.md`)

## Technical Approach

### Architecture

**Framework:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Recharts, Framer Motion, Gemini Flash API, Vercel deployment.

Chosen over the hybrid static HTML approach (used by dbenger.com) because React components enable truly interactive MVPs with state management, data filtering, and chart animations. App Router provides clean URL structure. (see brainstorm: architecture decision)

**Reference implementation:** `/Users/dbenger/projects/web-app-resume/` (dbenger.com) provides proven patterns for:
- Gemini Flash API route (`src/app/api/ai/experience-qa/route.ts`)
- Knowledge base pattern (`src/app/api/ai/knowledge.ts`)
- Tailwind design system (`tailwind.config.ts`)
- Vercel deployment pipeline

**Directory structure:**
```
src/
├── app/
│   ├── layout.tsx              # Root layout (nav, footer, chat provider)
│   ├── page.tsx                # Landing / Hero
│   ├── globals.css             # Global styles, dark mode, accessibility
│   ├── analysis/
│   │   └── page.tsx            # KLAR Business Analysis
│   ├── recommendations/
│   │   ├── page.tsx            # Recommendations overview (card grid)
│   │   └── [id]/
│   │       └── page.tsx        # Individual recommendation + MVP
│   ├── about/
│   │   └── page.tsx            # Why KLAR + Dominik
│   └── api/ai/
│       ├── klar-knowledge.ts   # Shared knowledge base (resume + KLAR context)
│       └── chat/
│           └── route.ts        # Gemini Flash chat endpoint
├── components/
│   ├── layout/                 # FloatingNav, Footer, ChatWidget, ChatProvider
│   ├── sections/               # HeroSection, AnalysisSection, etc.
│   ├── recommendations/        # Rec1MVP, Rec2MVP, ... (individual MVP components)
│   └── ui/                     # Card, Button, Badge, ExpandableSection
├── data/
│   ├── recommendations.ts      # Typed recommendation data (5 entries)
│   ├── analysis.ts             # KLAR business analysis structured data
│   └── skills-roles.ts         # Skills-to-roles mapping for /about
└── lib/
    └── utils.ts                # Type helpers, constants
```

**Rendering strategy:**
- All pages except AI routes: `force-static` (SSG at build time)
- AI chat route: `force-dynamic` (server-side, proxied API key)

### Implementation Phases

#### Phase 0: Project Scaffolding

- `npx create-next-app@latest` with TypeScript, Tailwind, App Router, ESLint
- `git init` and initial commit
- Install dependencies: `recharts`, `framer-motion`, `@vercel/analytics`
- Configure Tailwind with KLAR dark mode palette (dark backgrounds, emerald/green accents)
- Set up font (Satoshi via Fontshare or self-hosted — NOT Google Fonts)
- Create `CLAUDE.md` with project conventions
- Create `.env.local` with `GEMINI_API_KEY` (reuse from dbenger.com)
- Set up root layout with dark mode, font loading, metadata

**Success criteria:** `npm run dev` serves a blank dark-themed page with custom font

#### Phase 1: KLAR Deep Research

- Fetch and analyze getklar.com (product pages, pricing, features)
- Fetch and analyze getklar.com/blog (content strategy, themes)
- Research eCom Unity community (ecom-unity.eu, newsletter)
- Research founders on LinkedIn (Max Rast, Cillier Roux, Frank Roux)
- Analyze competitor landscape (Triple Whale, Northbeam, Rockerbox, Polar Analytics, Lifetimely, Peel Insights)
- Fetch the 4 job description URLs from getklar.getoutline.com
- Synthesize into structured analysis data (`src/data/analysis.ts`)
- Refine the 5 recommendation ideas based on actual findings

**Success criteria:** Structured data files with KLAR business model, competitive landscape, growth levers, and 5 refined recommendation concepts

**Hard dependency:** All subsequent content phases depend on this research

#### Phase 2: Landing Page + Navigation

- Build the hero section with bold headline, subtitle, and primary CTA
  - Headline direction: "I didn't write a cover letter. I built this instead." (or similar — punchy, confident)
  - CTA: "See What I Found →" linking to `/analysis`
- Build responsive navigation:
  - **Mobile:** Sticky header with hamburger menu
  - **Desktop:** Full horizontal nav
  - Links: Analysis, Recommendations, About
- Build footer with links to dbenger.com, LinkedIn, GitHub
- Add subtle entrance animations (Framer Motion fade-in/slide-up)

**Success criteria:** Landing page loads fast on mobile, nav works on all breakpoints, CTA is prominent

#### Phase 3: Analysis Page

- Build `/analysis` with 5 sections from research:
  1. Business Model Breakdown (pricing tiers, ICP, GTM)
  2. Product-Market Fit Assessment (strengths, friction points)
  3. Competitive Landscape (comparison table/chart vs. Triple Whale, Northbeam, etc.)
  4. Growth Levers & Gaps (flywheel analysis)
  5. Market Tailwinds & Headwinds (privacy, attribution complexity, eCom consolidation)
- Use interactive components: expandable cards, comparison tables, Recharts charts
- Not a wall of text — visual and scannable
- Add scroll-triggered reveal animations

**Success criteria:** Analysis page conveys depth without overwhelming; each section scannable in <30 seconds

#### Phase 4: 5 Recommendation Pages with Interactive MVPs

For each recommendation (`/recommendations/[1-5]`), build:

1. **The Insight** — 1-2 sentences from research
2. **The Opportunity** — why this matters for KLAR's growth
3. **The Proposal** — concrete action plan with phases
4. **Skill Mapping** — which Dominik skills apply (link to resume/about)
5. **Working MVP** — interactive React component with Recharts

**Seed recommendation ideas** (to be refined after Phase 1 research):
1. **Attribution Confidence Score Dashboard** — interactive prototype showing data quality/confidence metrics alongside attribution data. User adjusts confidence thresholds, sees data quality indicators update
2. **Paid Growth Playbook for B2B with B2C DNA** — interactive funnel calculator. User inputs budget/channel mix, sees projected pipeline with conversion rates
3. **Customer Onboarding Flow Optimizer** — interactive onboarding wizard prototype. User selects brand size/channels/goals, sees personalized setup flow with time-to-value estimates
4. **Cross-Channel Creative Performance Analyzer** — dashboard with channel selector, date range, creative asset performance comparison across Meta/Google/TikTok
5. **eCom Unity → KLAR Conversion Pipeline** — community engagement scoring dashboard. User sees engagement signals mapped to intent scores

**MVP interactivity definition:** Each MVP has synthetic/hardcoded data with at least one user-manipulable parameter (dropdown, slider, toggle) and responsive Recharts visualizations that update based on user input.

**Navigation between recommendations:**
- `/recommendations` index page: card grid with title, one-line summary, role tag(s), and visual preview
- Previous/Next navigation at bottom of each recommendation page
- Role tags on each card mapping to the 4 open positions

**Success criteria:** Each MVP feels like a mini product demo, not a static mockup. Charts animate, user inputs change displayed data

#### Phase 5: About Page

- **Skills-to-Roles matrix** — interactive: click a role to highlight matching skills
- **"Why KLAR" narrative** — concise personal statement (not a cover letter)
- **Proof points** — 3-5 key metrics from Google that map to KLAR's world
- **CTA strip** — prominent link to dbenger.com, LinkedIn, GitHub, email
- **Contact CTA** — "Let's Talk" section with email link (and optional Calendly)

Keep lean. Don't duplicate dbenger.com content.

**Success criteria:** Page conveys fit in <60 seconds of reading

#### Phase 6: AI Chat Widget

- Copy chat component pattern from dbenger.com, adapt styling
- Build `src/app/api/ai/klar-knowledge.ts` with expanded knowledge base:
  - Full resume context
  - KLAR business analysis
  - All 5 recommendation summaries
  - 4 job descriptions
  - KLAR company background
- Build `src/app/api/ai/chat/route.ts`:
  - Server-side Gemini Flash proxy (API key NOT exposed client-side)
  - `system_instruction` (snake_case for REST API)
  - `thinkingBudget: 128` (NOT 0 — causes garbage with temperature > 0.3)
  - `maxOutputTokens: 1024`
  - "Output PLAIN TEXT only" in system prompt
- Chat widget UX:
  - Floating action button (FAB) in bottom-right, minimized by default
  - Expands to panel (full-screen on mobile, sidebar on desktop)
  - 2-3 suggested questions that change based on current page (page-aware context)
  - Chat history preserved across page navigation via React context/provider
  - Loading indicator and graceful error handling (user-friendly message, not crash)
  - Welcome message on first open

**Gemini API pitfalls** (from dbenger.com CLAUDE.md):
- `thinkingBudget: 0` + `temperature > 0.3` = garbage output
- REST API uses `system_instruction` (snake_case)
- Plain text responses need "Output PLAIN TEXT only" directive
- Graceful fallback if `GEMINI_API_KEY` is missing

**Success criteria:** Chatbot answers KLAR-specific questions accurately; works on mobile without obscuring content

#### Phase 7: Polish & Deployment

- **Open Graph / social meta:** Custom OG image ("Dominik Benger × KLAR — A Working Application"), title, description. This is the first impression when shared via WhatsApp/Slack/email
- **Favicon:** Custom favicon and tab title ("Dominik Benger × KLAR")
- **404 page:** Custom branded 404 with navigation back to home
- **Performance:** Lighthouse mobile score 90+, LCP <2.5s, total JS bundle <300KB gzipped for landing page
- **Accessibility:** `prefers-reduced-motion` respected, focus-visible outlines, semantic HTML, alt text
- **Analytics:** Vercel Analytics (zero-config)
- **Responsive testing:** iPhone Safari, Android Chrome, desktop Chrome/Firefox/Safari
- **Deploy to Vercel:** Push to GitHub → auto-deploy. Fallback: `npx vercel --prod`
- **Domain:** Configure `klar.dbenger.com` subdomain via Vercel

**Success criteria:** Fast, polished, works on all devices, compelling social preview when shared

## Alternative Approaches Considered

1. **Static HTML SPA** (like dbenger.com) — rejected because React components are essential for interactive MVPs with state management, filtering, and chart animations (see brainstorm: architecture decision)
2. **Multi-page static site** (Astro, Hugo) — rejected because Recharts and Framer Motion require React; Next.js provides the best DX for this stack
3. **Presentation/slide format** — rejected because it doesn't demonstrate technical capability and limits interactivity

## System-Wide Impact

### Interaction Graph

User navigates → Next.js App Router resolves page → Static page served (SSG) OR chat request → API route → Gemini Flash REST API → response streamed to chat widget. Vercel Analytics fires on each page view.

### Error & Failure Propagation

- **Gemini API failure:** Chat route returns user-friendly error message ("I'm having trouble connecting right now. Try again in a moment."). No crash, no exposed API key.
- **Missing environment variable:** Chat route checks for `GEMINI_API_KEY` presence, returns graceful error if missing.
- **Chart rendering failure:** Recharts components render inside error boundaries. Fallback: static data summary.

### State Lifecycle Risks

- **Chat state:** Held in React context at layout level. Lost on full page refresh (acceptable — no persistent storage needed for a job application).
- **No database, no user accounts, no persistent state.** This is a static site with one dynamic endpoint.

### API Surface Parity

Single API surface: `POST /api/ai/chat` — accepts `{ message: string, pageContext?: string }`, returns `{ response: string }`.

### Integration Test Scenarios

1. **Mobile navigation flow:** User on iPhone Safari navigates Landing → Analysis → Recommendations → Recommendation 3 MVP (interacts with chart) → About → opens Chat → asks a question → gets a response
2. **Deep link orientation:** User lands on `/recommendations/3` directly → can identify what the site is → can navigate to other pages
3. **Chat across pages:** User opens chat on `/analysis`, asks a question, navigates to `/recommendations/1`, reopens chat → previous conversation is preserved
4. **Slow connection:** User on 3G loads landing page → sees content within 3 seconds (SSG), charts load progressively
5. **OG preview:** User shares `klar.dbenger.com` in WhatsApp → sees custom preview image, title, and description

## Acceptance Criteria

### Functional Requirements

- [ ] Landing page loads with hero, headline, CTA, and navigation
- [ ] `/analysis` page displays 5-section interactive business analysis with charts and expandable cards
- [ ] `/recommendations` index page shows card grid of all 5 recommendations with role tags
- [ ] Each `/recommendations/[1-5]` page has: insight, opportunity, proposal, skill mapping, and working interactive MVP
- [ ] Each MVP has at least one user-manipulable input (dropdown, slider, toggle) that updates chart data
- [ ] Previous/Next navigation between recommendation pages
- [ ] `/about` page has interactive skills-to-roles matrix, "Why KLAR" narrative, proof points, and CTA strip
- [ ] AI chatbot opens from FAB, answers KLAR-specific questions, shows suggested prompts
- [ ] Chat history preserved across page navigation
- [ ] Mobile-first responsive design works on iPhone Safari, Android Chrome, desktop browsers
- [ ] Global navigation (hamburger on mobile, full nav on desktop)
- [ ] "Let's Talk" CTA exists (email link) on `/about`

### Non-Functional Requirements

- [ ] Lighthouse mobile performance score: 90+
- [ ] LCP: <2.5s on mobile
- [ ] Landing page JS bundle: <300KB gzipped
- [ ] Gemini API key server-side only (not exposed in client bundle)
- [ ] `prefers-reduced-motion` respected (disable/reduce animations)
- [ ] Custom OG image with "Dominik Benger × KLAR" branding
- [ ] Custom favicon and tab title
- [ ] Custom 404 page with navigation
- [ ] Vercel Analytics installed

### Quality Gates

- [ ] All pages render correctly on mobile (375px) and desktop (1440px)
- [ ] Chat widget doesn't obscure content on mobile (proper open/close UX)
- [ ] No console errors in production build
- [ ] `next build` completes without errors
- [ ] OG image renders correctly in WhatsApp/Slack link preview

## Success Metrics

The co-founder should think:
1. "This person has done more research on our business than most of our employees"
2. "These recommendations are specific and actionable — not generic consulting fluff"
3. "The MVPs actually work and show technical capability"
4. "This is the kind of initiative and depth we want on our team"
5. "I need to talk to this person"

Measurable proxies (via Vercel Analytics):
- Page views beyond landing (indicates engagement)
- Time on recommendation pages (indicates depth)
- Chat widget usage (indicates curiosity)

## Dependencies & Prerequisites

- **Gemini API key:** Exists in dbenger.com `.env.local` — reuse
- **Node.js 25.x, npm 11.x:** Available locally
- **Vercel account:** Already set up (dbenger.com deployed there)
- **dbenger.com codebase:** Available at `/Users/dbenger/projects/web-app-resume/` for pattern reference
- **Resume PDF:** Available at `docs/resume/Dominik Benger - Resume [V3].pdf`
- **Font (Satoshi/General Sans/Cabinet Grotesk):** Requires self-hosting or Fontshare (not Google Fonts)
- **KLAR research:** Must complete before any content pages (hard dependency for Phases 3-6)

## Risk Analysis & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| KLAR research yields thin results | Low | High | Multiple research sources defined; competitor analysis fills gaps |
| Recharts bundle too large for mobile | Medium | Medium | Code-split chart components; lazy-load MVPs; monitor bundle size |
| Gemini API rate limiting | Low | Medium | Graceful error handling; low expected traffic (hiring team only) |
| Font loading delay (FOUT/FOIT) | Medium | Low | Use `next/font/local` with `display: swap`; preload critical font weights |
| Chat widget UX on mobile | Medium | High | Test on real iPhone Safari early; full-screen modal approach on mobile |
| Recommendations feel generic | Medium | High | Deep research in Phase 1; refine ideas based on actual KLAR gaps |
| Timeline pressure (complete today) | High | Medium | Prioritize substance (analysis + MVPs) over polish; ship incrementally |

## Design Decisions

### Language
**English.** KLAR operates internationally, job descriptions are in English, and English is the safer choice for a tech company.

### Color Palette (KLAR-aligned dark mode)
- Background: dark zinc/neutral tones (`#0a0a0a` to `#1a1a1a`)
- Text: off-white (`#fafafa`)
- Primary accent: emerald/green (KLAR brand-aligned)
- Secondary: muted gray for borders/cards
- Error/warning: standard red/amber

### Typography
- Headings: Satoshi (or General Sans / Cabinet Grotesk — evaluate which best matches KLAR)
- Body: Same family, lighter weights
- NOT Inter, Roboto, or Plus Jakarta Sans (distinct from dbenger.com)

### Animation Philosophy
Subtle entrance animations only. No continuous motion. Scroll-triggered reveals. Respect `prefers-reduced-motion`. Performance > flair on mobile.

### Role Positioning
Each recommendation subtly maps to 1-2 of the 4 open roles via tags/labels. The `/about` page explicitly lists all 4 roles with alignment statements in the skills-to-roles matrix. No role selector — the positioning is implicit through breadth.

## Future Considerations

- Custom domain `klar.dbenger.com` (post-deployment)
- German language toggle (if feedback suggests it)
- Additional recommendations if KLAR research reveals more opportunities
- Interview prep mode in chatbot (if progressing to interview stage)

## Sources & References

### Origin

- **Brainstorm document:** [docs/brainstorms/2026-03-05-klar-application-brainstorm.md](docs/brainstorms/2026-03-05-klar-application-brainstorm.md) — Key decisions carried forward: (1) Full Next.js App Router over static HTML, (2) Research-driven recommendations refined from 5 seed ideas, (3) Gemini Flash reuse from dbenger.com pattern
- **Master prompt:** [docs/prompt/klar-application-claude-code-prompt_new.md](docs/prompt/klar-application-claude-code-prompt_new.md) — Full project specification

### Internal References

- Gemini API route pattern: `/Users/dbenger/projects/web-app-resume/src/app/api/ai/experience-qa/route.ts`
- Knowledge base pattern: `/Users/dbenger/projects/web-app-resume/src/app/api/ai/knowledge.ts`
- Tailwind config template: `/Users/dbenger/projects/web-app-resume/tailwind.config.ts`
- Gemini pitfalls: `/Users/dbenger/projects/web-app-resume/docs/CLAUDE.md` (lines 104-107)
- dbenger.com architecture: `/Users/dbenger/projects/web-app-resume/docs/ebook-building-dbenger-com.md`

### External References

- KLAR website: https://getklar.com
- KLAR blog: https://getklar.com/blog
- eCom Unity community: https://www.ecom-unity.eu/
- eCom Unity newsletter: https://ecomunity.beehiiv.com/
- Competitors: Triple Whale, Northbeam, Rockerbox, Polar Analytics, Lifetimely, Peel Insights
- Job descriptions: 4 URLs on getklar.getoutline.com (see master prompt)
- Gemini Flash API: https://generativelanguage.googleapis.com/v1beta/
