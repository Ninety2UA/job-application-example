# Project Status

## What we're building
- Interactive job application web app for KLAR (getklar.com) — Next.js 15 App Router, TypeScript, Tailwind CSS, Recharts, Gemini Flash AI chatbot
- 6 pages: Landing, Analysis, Recommendations (overview + 5 individual), About
- 5 interactive MVP prototypes demonstrating strategic recommendations
- AI chatbot with KLAR-specific knowledge base
- Dark mode, KLAR-aligned design (emerald/green accents)
- Deploy to Vercel at `klar.dbenger.com`

## What's done
| Commit | Scope |
|--------|-------|
| (not yet initialized) | Project planning complete — brainstorm, plan, CLAUDE.md, STATUS.md, tasks.md, session-wrap command |

## Current state
- **Git:** Not yet initialized
- **Code:** No source code yet — project is in planning phase
- **Build:** N/A (no `package.json` yet)
- **Deployment:** Not deployed

### Files that exist
```
CLAUDE.md                                          # Project instructions & conventions
.claude/commands/session-wrap.md                   # Session wrap-up slash command
docs/
├── brainstorms/
│   └── 2026-03-05-klar-application-brainstorm.md  # Key decisions & rationale
├── plans/
│   └── 2026-03-05-feat-klar-interactive-job-application-plan.md  # Implementation plan
├── prompt/
│   └── klar-application-claude-code-prompt_new.md # Full project specification
├── resume/
│   └── Dominik Benger - Resume [V3].pdf           # Source resume
├── STATUS.md                                      # This file
└── tasks.md                                       # Task tracker
```

## Decisions made
| Area | Decision |
|------|----------|
| Architecture | Next.js 15 App Router with React components (NOT static HTML like dbenger.com) |
| Styling | Tailwind CSS (npm-installed), dark mode default, emerald/green accents |
| Charts | Recharts for MVP data visualizations |
| Animations | Framer Motion (subtle entrance animations, scroll-triggered reveals) |
| AI | Gemini Flash via server-side API route (reuse pattern from dbenger.com) |
| Fonts | Satoshi/General Sans/Cabinet Grotesk (self-hosted, NOT Google Fonts) |
| Language | English throughout |
| Deployment | Vercel, target domain `klar.dbenger.com` |
| Design | KLAR-aligned dark mode, sibling to dbenger.com but distinct identity |
| Rendering | force-static for all pages, force-dynamic for AI chat route only |

## What's next
- **Phase 0:** Project scaffolding — `npx create-next-app`, git init, Tailwind config, font setup, `.env.local`
- **Phase 1:** KLAR deep research — fetch and analyze getklar.com, blog, competitors, job descriptions, founders
- Then: Landing page, Analysis, 5 Recommendations with MVPs, About, AI Chat, Polish & Deploy

## Reference project
- dbenger.com codebase at `/Users/dbenger/projects/web-app-resume/` — proven patterns for Gemini API, Tailwind config, Vercel deployment
- Gemini API key exists in that project's `.env.local` — reuse for this project
