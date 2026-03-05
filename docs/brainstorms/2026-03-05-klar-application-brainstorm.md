# Brainstorm: KLAR Interactive Job Application

**Date:** 2026-03-05
**Status:** Complete

---

## What We're Building

An interactive Next.js web application that serves as Dominik Benger's job application to KLAR (getklar.com) -- the eCom Data Operating System. Instead of a traditional cover letter, this is a working prototype that demonstrates deep business research, strategic thinking, and technical capability.

**Deliverable:** A polished Next.js app deployed to Vercel at `klar.dbenger.com` with:
- Landing/hero page
- Interactive business analysis of KLAR
- 5 strategic recommendations, each with a fully interactive MVP prototype
- "Why KLAR + Dominik" about page (lean, linking to dbenger.com)
- Persistent AI chatbot with KLAR-specific context (Gemini Flash)

---

## Why This Approach

**Architecture: Full Next.js App Router**

Chosen over the hybrid static HTML approach (used by dbenger.com) because:
1. React components enable truly interactive MVPs with state management, data filtering, and chart animations
2. App Router provides clean URL structure for each section and recommendation
3. Demonstrates modern frontend proficiency to KLAR's tech team
4. Better code organization for 5 separate MVPs vs. a single monolithic HTML file

**Design direction:** KLAR-aligned (dark mode, green/emerald accents) as a sibling to dbenger.com. Distinctive typography (Satoshi or similar), not Inter/Roboto.

---

## Key Decisions

1. **Target roles:** Keep positioning flexible across all 4 open roles (Growth Lead, PO Marketing Measurement, Product Adoption, Senior eCom Manager)
2. **Recommendations:** Fully research-driven. The 5 ideas in the prompt are starting seeds, but final selection based on what KLAR research reveals about actual gaps and opportunities
3. **MVP interactivity:** Fully interactive -- real data visualizations, working calculators, dashboards with mock data. Each MVP should feel like a mini product demo
4. **AI backend:** Gemini Flash (same as dbenger.com). Reuse the knowledge base + API route pattern, add KLAR-specific context
5. **Timeline:** Complete today -- full scope, no cuts
6. **Tech stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Recharts, Gemini Flash API, Vercel deployment

---

## Resolved Questions

1. **Resume PDF:** User will add `Dominik_Benger_-_Resume__V3_.pdf` to the project directory
2. **Gemini API key:** Existing key from dbenger.com project will be reused
3. **Domain:** Deploy with Vercel default URL initially. Custom domain setup later if needed
4. **Target roles:** Keep positioning flexible across all 4 open roles

## Open Questions

1. **KLAR research depth:** What specific gaps and opportunities will the research reveal? This determines the final 5 recommendations. Need to research KLAR deeply before committing to specific recommendations
2. **Font selection:** Satoshi, General Sans, or Cabinet Grotesk? Need to evaluate which best matches KLAR's visual language while being distinct from dbenger.com's Plus Jakarta Sans

---

## Approach Details

### Site Structure
```
/ (Landing / Hero)
|-- /analysis        -> KLAR Business Model & Market Analysis
|-- /recommendations -> 5 Strategic Recommendations (with MVP links)
|   |-- /recommendations/1  -> Recommendation + MVP #1
|   |-- /recommendations/2  -> Recommendation + MVP #2
|   |-- /recommendations/3  -> Recommendation + MVP #3
|   |-- /recommendations/4  -> Recommendation + MVP #4
|   |-- /recommendations/5  -> Recommendation + MVP #5
|-- /about           -> Why KLAR + Dominik (lean, links to dbenger.com)
|-- [AI Chat Widget] -> Persistent chat overlay (Gemini Flash)
```

### Build Order
1. Project scaffolding (Next.js + Tailwind + design system)
2. KLAR deep research (web scraping, competitor analysis)
3. Landing page
4. Analysis page (from research output)
5. 5 recommendation pages with interactive MVPs
6. About page
7. AI chat widget
8. Polish, deploy, domain setup

### dbenger.com Patterns to Reuse
- **AI API route pattern:** Server-side Gemini Flash integration with shared knowledge base
- **Professional quality bar:** Animation, typography, responsive design standards
- **Scroll animations:** IntersectionObserver + data-animate pattern (adapted to React)

### dbenger.com Patterns NOT to Reuse
- Static HTML SPA architecture (using React components instead)
- CDN Tailwind (using npm-installed Tailwind)
- Plus Jakarta Sans font (using a different typeface)
- Teal brand palette (using KLAR's dark/green palette)
