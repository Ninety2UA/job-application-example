# Task Tracker

## Phase 0: Project Scaffolding
| Task | Description | Status |
|------|-------------|--------|
| T01 | Initialize Next.js 16 project (App Router, TypeScript, Tailwind v4, ESLint) | Done |
| T02 | Initialize git repo + initial commit | Done |
| T03 | Install dependencies (recharts, framer-motion, @vercel/analytics) | Done |
| T04 | Configure Tailwind with KLAR dark mode palette (dark bg, emerald accents) | Done |
| T05 | Set up Satoshi font via next/font/local | Done |
| T06 | Create `.env.local` with `GEMINI_API_KEY` | Done |
| T07 | Set up root layout (dark mode, font loading, metadata, viewport) | Done |
| T08 | Create `globals.css` (dark mode base, prefers-reduced-motion, scrollbar) | Done |

## Phase 1: KLAR Deep Research
| Task | Description | Status |
|------|-------------|--------|
| T09 | Research getklar.com — product pages, pricing, features, ICP | Done |
| T10 | Research getklar.com/blog — content themes, strategy | Done |
| T11 | Research eCom Unity community + newsletter | Done |
| T12 | Research founders (Max Rast, Cillie Burger, Frank Birzle) | Done |
| T13 | Analyze competitor landscape (Triple Whale, Northbeam, Rockerbox, Polar, Lifetimely, Peel) | Done |
| T14 | Fetch and analyze 4 job description URLs | Done |
| T15 | Synthesize into structured data files (`src/data/analysis.ts`) | Done |
| T16 | Refine 5 recommendation ideas based on research findings | Done |

## Phase 2: Landing Page + Navigation
| Task | Description | Status |
|------|-------------|--------|
| T17 | Build HeroSection (headline, subtitle, CTA) | Done |
| T18 | Build FloatingNav (hamburger mobile, full desktop) | Done |
| T19 | Build Footer (links to dbenger.com, LinkedIn, email, resume) | Done |
| T20 | Add entrance animations (Framer Motion fade-in, slide-up) | Done |

## Phase 3: Analysis Page
| Task | Description | Status |
|------|-------------|--------|
| T21 | Build /analysis page — Business Model Breakdown section | Done |
| T22 | Build /analysis — Product-Market Fit Assessment section | Done |
| T23 | Build /analysis — Competitive Landscape section (comparison table) | Done |
| T24 | Build /analysis — Growth Levers & Gaps section | Done |
| T25 | Build /analysis — Market Tailwinds & Headwinds section | Done |
| T26 | Add interactive elements (expandable cards, scroll reveals) | Done |

## Phase 4: Recommendations + MVPs
| Task | Description | Status |
|------|-------------|--------|
| T27 | Build /recommendations index page (card grid with role tags) | Done |
| T28 | Build /recommendations/1 — Attribution Confidence Score Dashboard MVP | Done |
| T29 | Build /recommendations/2 — Paid Growth Playbook (funnel calculator) MVP | Done |
| T30 | Build /recommendations/3 — Customer Onboarding Flow Optimizer MVP | Done |
| T31 | Build /recommendations/4 — Creative Performance Analyzer MVP | Done |
| T32 | Build /recommendations/5 — eCom Unity Conversion Pipeline MVP | Done |
| T33 | Add Previous/Next navigation between recommendation pages | Done |
| T34 | Create TypeScript interfaces + data for all 5 recommendations | Done |

## Phase 5: About Page
| Task | Description | Status |
|------|-------------|--------|
| T35 | Build interactive Skills-to-Roles matrix (click role to highlight skills) | Done |
| T36 | Build "Why KLAR" narrative section | Done |
| T37 | Build Proof Points section (8 key metrics from Google) | Done |
| T38 | Build CTA strip (dbenger.com, LinkedIn, email, "Let's Talk") | Done |

## Phase 6: AI Chat Widget
| Task | Description | Status |
|------|-------------|--------|
| T39 | Create `klar-knowledge.ts` (resume + KLAR analysis + recommendations + job descriptions) | Done |
| T40 | Build `POST /api/ai/chat` route (Gemini Flash proxy, server-side key) | Done |
| T41 | Build ChatWidget component (FAB, panel, mobile full-screen) | Done |
| T42 | Build ChatProvider context (preserve history across navigation) | Done |
| T43 | Add suggested questions (page-aware, 2-3 per page) | Done |
| T44 | Add welcome message + loading/error states | Done |

## Phase 7: Polish & Deployment
| Task | Description | Status |
|------|-------------|--------|
| T45 | Create OG image (edge-generated 1200x630, "Dominik Benger x KLAR") | Done |
| T46 | Add SVG favicon + tab title ("Dominik Benger x KLAR") | Done |
| T47 | Build custom 404 page (branded, navigation back to home) | Done |
| T48 | Performance pass — Lighthouse 90+, LCP <2.5s, bundle <300KB gzipped | Pending |
| T49 | Accessibility pass — prefers-reduced-motion, focus-visible, semantic HTML, alt text | Done |
| T50 | Install Vercel Analytics | Done |
| T51 | Responsive testing — iPhone Safari, Android Chrome, desktop browsers | Done |
| T52 | Deploy to Vercel | Done |
| T53 | Configure production domain (dbenger-job-application-klar.vercel.app) | Done |
| T54 | Final QA — all pages, all MVPs, chat widget, OG preview, 404 | Done |

## Code Review Fixes
| Task | Description | Status |
|------|-------------|--------|
| T55 | Fix Array.sort() mutation in Rec4MVP | Done |
| T56 | Fix duplicate user message in chat API calls | Done |
| T57 | Remove unused clsx dependency and cn() utility | Done |
| T58 | Replace non-null assertions with fallbacks in Rec3MVP | Done |
| T59 | Add aria-expanded to ExpandableSection | Done |
| T60 | Add aria-pressed to skills-to-roles filter buttons | Done |
| T61 | Validate and truncate chat history items (security) | Done |
| T62 | Increase hamburger touch target to 44x44px | Done |

## Phase 8: PO Marketing Measurement MVPs (Session 4)
| Task | Description | Status |
|------|-------------|--------|
| T67 | Research KLAR measurement product (MTA, MMM, incrementality, attribution models) | Done |
| T68 | Add 5 new recommendation entries to recommendations.ts (IDs 6-10) | Done |
| T69 | Build Rec6MVP — Attribution Model Comparator (grouped bar chart, 6 models) | Done |
| T70 | Build Rec7MVP — Channel Saturation Curve Analyzer (area chart, diminishing returns) | Done |
| T71 | Build Rec8MVP — Incrementality Test Planner (line chart, power calculations) | Done |
| T72 | Build Rec9MVP — Privacy Signal Loss Simulator (stacked bar, 3 sliders) | Done |
| T73 | Build Rec10MVP — Unified Measurement Framework (bar chart + error bars, confidence) | Done |
| T74 | Register Rec6-10 in RecommendationContent.tsx | Done |
| T75 | Split recommendations/page.tsx into Cross-Role + PO Measurement sections | Done |
| T76 | Update landing page stats (5→10 recommendations/MVPs) | Done |
| T77 | Expand klar-knowledge.ts with 10 recommendations + PO role details | Done |
| T78 | Update ChatWidget suggested questions for measurement topics | Done |
| T79 | Commit and deploy session 4 changes | Pending |

## Design Overhaul (from /ui-ux-pro-max)
| Task | Description | Status |
|------|-------------|--------|
| T80 | Apply typography scale improvements (heading hierarchy, line-height) | Pending |
| T81 | Redesign card components (subtle gradients, better borders) | Pending |
| T82 | Polish chart styling (grid lines, tooltips, legends) | Pending |
| T83 | Improve hero section impact (gradient text, stronger CTA) | Pending |
| T84 | Navigation polish (active states, transitions) | Pending |
| T85 | Overall spacing and visual hierarchy pass | Pending |

## Future Improvements (from code review)
| Task | Description | Status |
|------|-------------|--------|
| T63 | Enhance content with research agent findings (founders, competitors, analysis) | Pending |
| T64 | Extract page animations to client wrappers for server rendering (LCP) | Pending |
| T65 | Add focus trap + Escape handler to chat widget and mobile nav | Pending |
| T66 | Fix Rec2MVP mix rounding to always sum to 100% | Pending |
