# Portfolio Career Update — PayMongo (June 2026)

## Goal

Update the portfolio to reflect Ferry's move from Traveloka to PayMongo as a
Senior Software Engineer (2026), and refresh bio, experience years, and skills.

## Facts

- New role: **Senior Software Engineer at PayMongo**, 2026 – Present
- Left Traveloka in 2026 (entry becomes 2020 – 2026, description moves to past tense)
- Team: Payment Channels; first project is the **Invoicing** product (merchants
  create, send, and track professional invoices; payment via PayMongo Checkout;
  expands the platform into B2B billing)
- Day-to-day stack: React.js, Next.js, Golang (backend), AWS infrastructure &
  deployment, AI-assisted development with Claude
- Experience claim updated from "5+ years" to "10+ years" (first FE role 2013)

## Changes

### `public/resumeData.json`

1. `main.occupation` → "Senior Fullstack Engineer" (user correction: role is
   mostly fullstack — React/Next.js frontend, Golang backend, AWS)
2. `main.description` and `main.bio` → 10+ years; bio leads with the PayMongo
   fintech chapter, keeps Traveloka/Jaztip/Maideasy/Ryna as past highlights
3. `resume.work` → new PayMongo entry on top; Traveloka entry closed out
4. `resume.skills` → AWS entry broadened to "AWS (Infrastructure & Deployment)"
   at 80%; add "Golang" (70%) and "AI-Assisted Development (Claude)" (85%)

### `src/App.tsx`

- JSON-LD `worksFor.name`: "Traveloka" → "PayMongo"; `jobTitle` → "Senior
  Fullstack Engineer" (fixes factual inconsistency with the resume page)

## Out of scope

- `index.html` SEO meta (already says "Previously at Traveloka"; user excluded it)
- Resume PDF regeneration
- Internal PayMongo details from the project doc (metrics, timelines, names)
  must NOT appear in public copy

## Verification

- `pnpm test` (existing suite) and `pnpm build` pass
- JSON remains valid; resume page renders the new entry first

## Addendum — 2026 resume template (Jun 15, 2026)

Aligned the portfolio + printable resume to the user's official 2026 resume PDF.

Confirmed details:
- Title: Senior Software Engineer (PayMongo); portfolio occupation tagline stays
  "Senior Fullstack Engineer" per earlier user preference
- Dates: PayMongo **Jun 2026 – Present**; Traveloka **2020 – May 2026**
  (last day May 7, 2026; started PayMongo Jun 1, 2026)
- Experience claim aligned to the resume: "over nine years" (was 10+)
- PayMongo copy: blended (invoicing lead + APIs/SDKs/integration tooling)
- Skills: adopted the full AI/ML cluster from the resume (AI Agents/LLM/RAG,
  Generative AI, Claude/MCP, LangChain, Copilot, MLOps, Software Architecture)

Changes:
- `public/Ferry-Hinardi-Resume-2026.pdf` — new downloadable resume (copied in)
- `resumeData.json` — download link, summary, work dates + `highlights` bullets
  per role, `location` per role, full skills list, `languages` section
- `resume.types.ts` — `Work.highlights?`, `Work.location?`, `Language`,
  `ResumeSection.summary?` / `languages?`
- `src/pages/PrintResume.tsx` + `.css` — restyled the `/print` page to match the
  2026 template (left-aligned header, blue title, ruled section headers, bullet
  highlights, 3-column skills, Projects + Languages sections); `/print` is the
  printable/Save-as-PDF source of truth, driven by resumeData.json
- `CommandPalette.tsx` (+ test), `sitemap.xml` — point to the 2026 PDF

Verification: 271 tests pass, `pnpm build` (tsc + vite) clean, `/print` serves 200.
