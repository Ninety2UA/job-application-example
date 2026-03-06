# Project Status

## What we're building
- Interactive job application web app for KLAR (getklar.com) — Next.js 16 App Router, TypeScript, Tailwind CSS v4, Recharts, Gemini Flash AI chatbot
- 13 pages: Landing, Analysis, Prototypes (overview + 10 individual), About, 404
- 10 interactive MVP prototypes (5 cross-role + 5 PO Marketing Measurement deep-dive)
- AI chatbot with KLAR-specific knowledge base
- Dark mode, KLAR-aligned design (emerald/green accents, Satoshi font)
- Deployed to Vercel at `dbenger-job-application-klar.vercel.app`

## What's done
| Commit | Scope |
|--------|-------|
| 1a90451 | Phase 0: Scaffolded Next.js 16 + Tailwind v4 + Satoshi fonts + dark mode palette |
| 3cc6a6e | Phases 2-6: All pages, components, MVPs, chat widget, knowledge base |
| a9e34a3 | Phase 7: OG image generation, SVG favicon, metadata polish |
| 5994988 | docs: update STATUS.md to reflect completed build |
| abe1ac5 | fix: resolve code review findings — sort mutation, duplicate chat message, unused dep |
| 863c445 | fix: address remaining code review findings — safety, a11y, security |
| 0d7c687 | chore: update metadata URLs to dbenger-job-application-klar.vercel.app |
| 26de660 | docs: session wrap — update status, tasks, and continuity for deployed state |
| d299c3a | feat: add 5 PO measurement MVPs, embedded homepage chat, and resume download |
| ec54fca | fix: mobile chat panel clipping and iOS safe area handling |
| 896b35d | rename "Recommendations" to "Prototypes" across entire site |
| 3fb8887 | fix: prevent homepage from scrolling to embedded chat on load |
| 233567f | style: make View Prototypes button a lighter green variant |
| 8320109 | rename About nav to "Why KLAR + Dominik" and add CTA on homepage |
| 7e3e9f9 | add Download Resume button to about page header |
| 28a24c8 | fix: align Download Resume button with heading on about page |
| 903efc7 | style: make Download Resume button green on about page |
| f44f7e7–2bcc406 | iterate on about page proof point stats |
| b3333b6 | replace proof point stats with Core Capabilities cards |
| 2c5920a | fix: upgrade Gemini model to 3-flash-preview and embed capabilities into KLAR narrative |
| 9ec3b59 | enhance chatbot system prompt with audience awareness, tone, and conversation strategy |
| d3600e3 | style: enlarge embedded chat, reduce gap to CTA button |
| 63dd52b | revert: restore original chat color scheme |
| b5be6f8 | enhance all 10 MVP prototypes with multi-control UIs, secondary charts, data tables, and distinct bar colors |
| 0fb58ab | add portfolio link button to about page header |

## Current state
- **Git:** `main` branch, 27 commits, 1 uncommitted change (hero subtitle text)
- **Build:** Passes cleanly (`npm run build`)
- **Code:** 10 advanced MVPs (enhanced with multi-control, secondary charts, tables, insights), embedded chat, "What I Bring to KLAR" cards, Download Resume, portfolio link
- **Chatbot:** Gemini 3 Flash Preview, temp 0.7, enhanced system prompt with audience awareness
- **Naming:** "Prototypes" site-wide; "Why KLAR + Dominik" nav
- **Deployment:** Live at https://klar.dbenger.com (custom domain, old vercel.app alias removed)
- **Vercel:** Deployment Protection disabled for public access

### Route Map
```
○ /                      → Landing page (hero, CTAs, stats, "Why KLAR + Dominik" CTA, embedded AI chat)
○ /analysis              → 5-section business analysis (expandable, competitive table)
○ /prototypes            → Card grid — split into Cross-Role (1-5) and PO Measurement (6-10)
● /prototypes/[1-10]     → Individual prototype + interactive MVP
○ /about                 → Core Capabilities, Skills matrix, Download Resume, "Let's Talk" CTA
○ /_not-found            → Custom 404
ƒ /api/ai/chat           → Gemini Flash chat proxy (force-dynamic)
ƒ /opengraph-image       → Edge-generated OG image (1200x630)
```

## What's next
- **Commit hero subtitle:** Uncommitted text tweak in `src/app/page.tsx`
- **Design overhaul:** Typography scale, card redesign, gradient accents, chart styling (T80-T85)
- **Performance audit:** Lighthouse score, bundle size check (T48)
- **Content enhancement:** Incorporate research findings into analysis page (T63)
- **Responsive testing:** Enhanced MVPs need mobile testing (significantly more content now)
