# KLAR Interactive Job Application — Dominik Benger

## Project Overview
Interactive Next.js web app serving as Dominik Benger's job application to KLAR (getklar.com) — the eCom Data Operating System. Not a cover letter: a working prototype demonstrating deep business research, strategic thinking, and technical capability. Deployed to Vercel at `dbenger-job-application-klar.vercel.app`.

## Startup Ritual
**At the start of every new session, before taking any action, you MUST:**

1. **Read project status files** (in parallel):
   - `CLAUDE.md` — this file (project instructions, conventions, pitfalls)
   - `docs/STATUS.md` — current project state, what's done, what's next
   - `docs/tasks.md` — task backlog and priorities

2. **Check git state** (in parallel):
   - `git status` — uncommitted changes, staged files, current branch
   - `git log --oneline -10` — recent commit history
   - `git diff --stat` — summary of working tree changes

3. **Summarize current status to the user**, including:
   - Current branch and any uncommitted work
   - What was done in the last few commits
   - Which phase we're in and next steps from `docs/tasks.md`
   - Anything that needs attention (e.g., uncommitted changes, failing builds)

4. **Wait for the user's instructions** before making any changes.

Do NOT skip this ritual. Do NOT start modifying files until you have read the above and presented the summary. This ensures continuity across sessions and prevents accidentally overwriting in-progress work.

## Session Wrap-Up
At the end of each session, run `/session-wrap` to:
- Summarize what was accomplished
- Update `CLAUDE.md` Session Continuity, `docs/STATUS.md`, and `docs/tasks.md`
- Record new pitfalls and learnings in auto-memory
- Ensure the next session can start immediately with zero context loss

## Tech Stack
- **Framework:** Next.js 15+ (App Router, TypeScript) — proper React components, NOT the static HTML approach from dbenger.com
- **Styling:** Tailwind CSS (npm-installed, NOT CDN)
- **Charts:** Recharts for MVP data visualizations
- **Animations:** Framer Motion (scroll-triggered reveals, entrance animations)
- **AI Backend:** Gemini Flash (server-side API route, same pattern as dbenger.com)
- **Fonts:** Satoshi, General Sans, or Cabinet Grotesk (self-hosted or Fontshare — NOT Google Fonts, NOT Inter/Roboto/Plus Jakarta Sans)
- **Analytics:** @vercel/analytics
- **Deployment:** Vercel (auto-deploy from GitHub, fallback: `npx vercel --prod`)

## Project Structure
```
src/
├── app/
│   ├── layout.tsx              # Root layout (nav, footer, chat provider, fonts, metadata)
│   ├── page.tsx                # Landing / Hero
│   ├── globals.css             # Global styles, dark mode base, accessibility
│   ├── analysis/
│   │   └── page.tsx            # KLAR Business Model & Market Analysis
│   ├── prototypes/
│   │   ├── page.tsx            # Overview card grid (all 10 prototypes)
│   │   └── [id]/
│   │       └── page.tsx        # Individual prototype + interactive MVP
│   ├── about/
│   │   └── page.tsx            # Why KLAR + Dominik (capabilities, skills matrix, CTA)
│   ├── not-found.tsx           # Custom 404 page
│   └── api/ai/
│       ├── klar-knowledge.ts   # Shared knowledge base (resume + KLAR context + prototypes)
│       └── chat/
│           └── route.ts        # POST — Gemini Flash chat proxy (force-dynamic)
├── components/
│   ├── layout/                 # FloatingNav, Footer, ChatWidget, ChatProvider, EmbeddedChat
│   ├── prototypes/             # PrototypeContent, Rec1MVP–Rec10MVP
│   └── ui/                     # Card, Button, Badge, ExpandableSection
├── data/
│   ├── prototypes.ts           # Typed prototype data (10 entries with metadata)
│   ├── analysis.ts             # KLAR business analysis structured data
│   └── skills-roles.ts         # Skills-to-roles mapping for /about page
└── lib/
    └── utils.ts                # Type helpers, constants
public/
├── fonts/                      # Self-hosted font files (woff2)
├── og-image.png                # Open Graph image (1200×630) "Dominik Benger × KLAR"
├── icon.svg                    # Favicon
└── resume/                     # PDF resume for download
docs/
├── brainstorms/                # Brainstorm documents
├── plans/                      # Implementation plans
├── prompt/                     # Claude Code prompt specification
├── resume/                     # Source resume PDF
├── STATUS.md                   # Project status (read at session start, updated at session wrap)
└── tasks.md                    # Task tracker (read at session start, updated at session wrap)
.claude/
└── commands/
    └── session-wrap.md         # /session-wrap slash command
```

## Commands
- `npm run dev` — Start dev server (Turbopack)
- `npm run build` — Production build (verify no errors before deploy)
- `npm run lint` — ESLint

## Site Map & Navigation
```
/ (Landing / Hero)
├── /analysis              → KLAR Business Model & Market Analysis (5 sections)
├── /prototypes            → Card grid overview of all 10 prototypes
│   ├── /prototypes/1–5    → Cross-Role Strategy prototypes + interactive MVPs
│   └── /prototypes/6–10   → PO Marketing Measurement prototypes + interactive MVPs
├── /about                 → Why KLAR + Dominik (capabilities, skills matrix, CTA)
└── [AI Chat Widget]       → Persistent floating overlay (Gemini Flash)
```

**Navigation pattern:**
- **Mobile:** Sticky header with hamburger menu
- **Desktop:** Full horizontal nav with links: Analysis, Prototypes, Why KLAR + Dominik
- **Prototype pages:** Previous/Next buttons at bottom for sequential flow
- **Deep links:** Every page must be self-orienting (visitor landing on `/prototypes/3` should understand context)

## Design System

### Aesthetic
KLAR-aligned dark mode. Data-forward, editorial, professional but not corporate. Should feel like something KLAR's team would build internally. Sibling to dbenger.com — same quality bar, different identity.

### Color Palette (KLAR dark mode)
- **Background:** Dark zinc/neutral (`#0a0a0a` to `#1a1a1a`)
- **Text:** Off-white (`#fafafa`)
- **Primary accent:** Emerald/green (KLAR brand-aligned, e.g., Tailwind emerald-500 `#10b981`)
- **Secondary:** Muted gray for borders, cards, subtle elements
- **Error/warning:** Standard red/amber

### Typography
- **Font family:** Satoshi (preferred), General Sans, or Cabinet Grotesk
- **Loading:** `next/font/local` with `display: swap` and preloaded critical weights
- **NOT:** Inter, Roboto, Plus Jakarta Sans (distinct from dbenger.com)

### Animation Philosophy
- Subtle entrance animations only (fade-in, slide-up)
- Scroll-triggered reveals via Framer Motion
- No continuous motion
- Respect `prefers-reduced-motion` — disable/reduce animations when OS preference is set
- Performance > flair, especially on mobile

### Responsive
- Mobile-first (co-founder will likely see this on their phone first)
- Test on: iPhone Safari, Android Chrome, desktop Chrome/Firefox/Safari
- Breakpoints: Tailwind defaults (sm, md, lg, xl)

## Architecture Decisions
- **Full React App Router** (NOT static HTML like dbenger.com) — React components enable interactive MVPs with state management, data filtering, chart animations. Better code organization for 5 separate MVPs
- **Server-side AI proxy** — `POST /api/ai/chat` proxies to Gemini Flash. API key stays server-side, never exposed in client bundle
- **Static rendering for content** — All pages except `/api/ai/chat` use `force-static` (SSG). Chat route uses `force-dynamic`
- **Typed data files** — All content lives in TypeScript interfaces in `src/data/`, not scattered in components. Recommendations, analysis data, skills mapping all have defined types
- **Chat state in React context** — Chat history preserved across page navigation via context provider at layout level. Lost on full page refresh (acceptable)
- **Recharts for MVPs** — Pre-built React chart components for rapid interactive dashboards. Custom SVG only if a specific visualization demands pixel-perfect control

## Content & Context

### Target Audience
KLAR co-founder (Sebastian Schulze / Max Rast) and hiring team. 4 open roles:
1. **Growth Lead/Manager** — amplifying inbound flywheel, paid acquisition (contact: max@getklar.com)
2. **PO Marketing Measurement** — attribution product IC, MTA/MMM/incrementality (contact: product-hiring@getklar.com)
3. **Product Adoption & Experience Manager** — onboarding, education infrastructure (contact: uli@getklar.com)
4. **Senior eCommerce Manager** — customer-facing strategic partner (contact: franz@getklar.com)

### Role Positioning
Each recommendation subtly maps to 1-2 of the 4 roles via tags/labels. The `/about` page explicitly maps all 4 roles in the skills-to-roles matrix. No role selector widget — positioning is implicit through breadth.

### Language
English throughout. KLAR operates internationally, job descriptions are in English.

### What This Site Is NOT
- Not a second portfolio (dbenger.com handles that)
- Not a cover letter
- The `/about` page must be lean — no career timeline, no detailed roles, no generic skills list (those live at dbenger.com)

### Owner
- **Name:** Dominik Benger
- **Portfolio:** https://dbenger.com
- **LinkedIn:** https://www.linkedin.com/in/dombenger/
- **Email:** domi@dbenger.com
- **Resume PDF:** `docs/resume/Dominik Benger - Resume [V3].pdf`

## Reference: dbenger.com Codebase
The sibling project at `/Users/dbenger/projects/web-app-resume/` is the canonical reference for proven patterns:

| Pattern | File | Notes |
|---------|------|-------|
| Gemini API route | `src/app/api/ai/experience-qa/route.ts` | REST API proxy, server-side key |
| Knowledge base | `src/app/api/ai/knowledge.ts` | Shared `DOMINIK_CONTEXT` constant |
| Tailwind config | `tailwind.config.ts` | Custom colors, shadows, animations |
| Global CSS | `src/app/globals.css` | Accessibility, scrolling, font smoothing |
| OG image setup | `public/og-image.png` + metadata in layout | Social preview |

### Patterns to REUSE from dbenger.com
- Gemini Flash API route architecture (fetch-based, REST API v1beta)
- Knowledge base as shared TypeScript constant
- Professional quality bar (animation, typography, responsive)
- Vercel deployment pipeline

### Patterns NOT to reuse from dbenger.com
- Static HTML SPA architecture (using React components instead)
- CDN Tailwind (using npm-installed Tailwind)
- Plus Jakarta Sans font (using a different typeface)
- Teal brand palette (using KLAR's dark/emerald palette)
- Hash-based SPA routing (using App Router file-based routing)
- DOMPurify CDN (chat returns plain text, not HTML)

## Pitfalls

### Gemini Flash API
- **`thinkingBudget: 0` + `temperature > 0.3` = garbage output.** Always use `thinkingBudget: 128` or higher.
- **REST API field names are snake_case.** Use `system_instruction`, NOT `systemInstruction`.
- **Plain text responses:** Include "Output PLAIN TEXT only" in system prompt to prevent markdown artifacts rendering as literal text.
- **`GEMINI_API_KEY` must exist.** Set in `.env.local` (dev) and Vercel project settings (prod). If missing, chat route must return a graceful error message, not crash.
- **API endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent`
- **Config:** `temperature: 0.6`, `maxOutputTokens: 1024`, `thinkingConfig: { thinkingBudget: 128 }`

### Next.js / React
- **`route.ts` and `page.tsx` cannot coexist** in the same directory. Choose one.
- **Image/asset paths in `public/`** must use absolute paths (`/fonts/Satoshi.woff2`, NOT `../public/fonts/...`).
- **`next/font/local`** for self-hosted fonts — use `display: 'swap'` to avoid FOIT.
- **Recharts is client-only.** Chart components need `'use client'` directive. Code-split with dynamic imports if bundle gets large.

### Content
- **PDF path must match download links.** Source file has spaces (`Dominik Benger - Resume [V3].pdf`) — copy to `public/resume/` with consistent naming.
- **Knowledge base (`klar-knowledge.ts`) is the single source of truth** for all AI context. Update this file when analysis, recommendations, or resume content changes.
- **Recommendations are research-driven.** The 5 seed ideas in the prompt are starting directions — refine or replace based on actual KLAR research findings.

### Design
- **Dark mode is the default** (not a toggle). Set dark backgrounds in `globals.css` and Tailwind config, not via `dark:` prefix switching.
- **Chat widget on mobile** must not obscure page content. Use full-screen modal approach on mobile, side panel on desktop. FAB trigger in bottom-right.
- **`prefers-reduced-motion`** must be respected in `globals.css`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  }
  ```

### Deployment
- **OG image is critical.** The social preview when shared via WhatsApp/Slack is the literal first impression. Must show "Dominik Benger × KLAR" with KLAR-aligned design. Size: 1200×630px.
- **Vercel auto-deploy** from GitHub push. If it doesn't trigger: `npx vercel --prod`.
- **Target domain:** `dbenger-job-application-klar.vercel.app` (Vercel subdomain).

## Build Phases
1. **Phase 0:** Project scaffolding (Next.js + Tailwind + fonts + git init + CLAUDE.md)
2. **Phase 1:** KLAR deep research (getklar.com, blog, competitors, job descriptions, founders)
3. **Phase 2:** Landing page + responsive navigation
4. **Phase 3:** Analysis page (5 interactive sections from research)
5. **Phase 4:** 5 recommendation pages with interactive MVPs (Recharts, user inputs)
6. **Phase 5:** About page (skills-to-roles matrix, "Why KLAR", proof points, CTA)
7. **Phase 6:** AI chat widget (Gemini Flash, KLAR-specific knowledge base)
8. **Phase 7:** Polish & deploy (OG image, favicon, 404, performance, analytics, Vercel)

**Hard dependency:** Phase 1 (research) must complete before Phases 3-6. All content is research-driven.

## Success Criteria
The co-founder should think:
1. "This person has done more research on our business than most of our employees"
2. "These recommendations are specific and actionable — not generic consulting fluff"
3. "The MVPs actually work and show technical capability"
4. "This is the kind of initiative and depth we want on our team"
5. "I need to talk to this person"

## Performance Targets
- Lighthouse mobile score: 90+
- LCP: <2.5s on mobile
- Landing page JS bundle: <300KB gzipped
- Build: 0 warnings, static pages SSG'd, only chat route dynamic

## MVP Interactivity Standard
Each of the 10 recommendation MVPs must have:
- Synthetic/hardcoded data (no external API dependencies)
- At least one user-manipulable input (dropdown, slider, toggle, date range)
- Recharts visualization(s) that update reactively based on user input
- `'use client'` directive on interactive components
- Skeleton/loading state while charts render

## KLAR Research Sources
- https://getklar.com (all product pages)
- https://getklar.com/blog
- https://www.ecom-unity.eu/ (eCom Unity community)
- https://ecomunity.beehiiv.com/ (newsletter)
- LinkedIn: Max Rast (CEO), Cillie Burger (CTO), Frank Birzle (CTO)
- Competitors: Triple Whale, Northbeam, Rockerbox, Polar Analytics, Lifetimely, Peel Insights
- Job descriptions: 4 URLs on getklar.getoutline.com (see `docs/prompt/klar-application-claude-code-prompt_new.md`)

## Project Documentation
- Read `docs/STATUS.md` for current progress and state
- Read `docs/tasks.md` for the task backlog and priorities
- Read `docs/plans/2026-03-05-feat-klar-interactive-job-application-plan.md` for the full implementation plan
- Read `docs/brainstorms/2026-03-05-klar-application-brainstorm.md` for key decisions & rationale
- Read `docs/prompt/klar-application-claude-code-prompt_new.md` for the original project specification

Always read `docs/STATUS.md` and `docs/tasks.md` before starting any work.

## Session Continuity
- **Latest work (session 6):** Renamed "Recommendations" → "Prototypes" site-wide (routes, types, nav, UI text, metadata, OG image). Renamed nav "About" → "Why KLAR + Dominik" with homepage CTA. Added Download Resume button to about page. Replaced proof point stats with Core Capabilities cards. Fixed homepage scroll-to-bottom bug. Made View Prototypes button green.
- **Current phase:** Phase 7+ complete — all features deployed, polish/design overhaul pending
- **Next steps:** Design overhaul (T80-T85); Lighthouse audit (T48); content enhancement (T63); responsive testing of prototypes 6-10
- **Uncommitted:** None (only untracked .playwright-mcp/ and screenshots/ dirs)
- **Deployed:** https://dbenger-job-application-klar.vercel.app — fully up to date (commit b3333b6)
