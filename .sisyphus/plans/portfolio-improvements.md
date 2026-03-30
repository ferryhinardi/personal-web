# Portfolio Site Comprehensive Improvements

## TL;DR

> **Quick Summary**: Incrementally improve the personal-web portfolio across security, code quality, testing, accessibility, performance, and mobile UX — prioritized for recruiter impact within a safety-first framework.
> 
> **Deliverables**:
> - Security hardened: no secrets in client bundle, webhook notifications server-side
> - Code quality: shared useFetch hook, proper error handling, type-safe casts
> - Test coverage: hook tests, a11y tests, page tests with axe integration
> - Accessibility: focus trap in CommandPalette, 44px+ touch targets
> - Performance: lazy-loaded dashboard charts, dynamic analytics import, measured improvements
> - Mobile UX: verified responsive behavior at key breakpoints
> 
> **Estimated Effort**: Large (~15 atomic commits across 7 phases)
> **Parallel Execution**: YES - 5 waves
> **Critical Path**: Baseline → Security → Code Quality → Tests → A11y/Perf/Mobile

---

## Context

### Original Request
User requested: "create comprehensive plan for improvement this repository" — their personal-web portfolio site built with React 18.3 + Vite 6.4 + TypeScript 5.9 + Tailwind CSS 4.x + pnpm 10.

### Interview Summary
**Key Discussions**:
- **Portfolio Goal**: Job Hunting (attract recruiters/hiring managers)
- **Pain Points**: Mobile Experience, Visual Design, Performance
- **Change Appetite**: Incremental Polish (keep current structure, fix issues, add small improvements)

**Research Findings**:
- Security: Webhook tokens exposed in client bundle via `VITE_*` env vars; hard-coded admin password `'ferry2025'` in `AdminDashboard.tsx:41`; legacy `public/index.html` with jQuery
- Performance: framer-motion in 48+ files (properly tree-shakable — no action needed); recharts/react-ga4 are lazy-load candidates; OptimizedImage and prefers-reduced-motion already well-built
- Code Quality: 7 `as any` casts, 4 `.catch(console.error)` swallowing errors, duplicated fetch patterns across 4 pages
- Testing: 9 test files exist covering major components; 14 hooks with ZERO tests; 0 page tests; no axe a11y testing
- Accessibility: CommandPalette uses custom modal WITHOUT focus trap; drawer social icons 40×40px (below 44px minimum)
- Mobile: Tailwind responsive classes used extensively; PerformanceContext detects device capability; responsive images via OptimizedImage

### Metis Review
**Identified Gaps** (addressed):
- No baseline measurements exist — added Phase 0 measurement task
- `.env` remote history unknown — added verification task
- AdminDashboard publicly accessible with hardcoded password — added removal task
- CommandPalette lacks focus trap — added a11y fix task
- Inline arrow function refactoring CUT — low ROI, high risk
- framer-motion changes CUT — pervasive (48+ files), properly imported

---

## Work Objectives

### Core Objective
Harden security, improve code quality, expand test coverage, fix accessibility issues, optimize performance, and polish mobile UX — all while preserving the existing site structure and visual design.

### Concrete Deliverables
- Serverless API endpoint at `api/contact.ts` for webhook notifications
- Shared `useFetch` hook replacing duplicated fetch patterns
- 5 new test files (3 hooks + CommandPalette focus-trap + 1 page)
- Focus trap in CommandPalette modal
- 44px+ touch targets on all interactive mobile elements
- Lazy-loaded recharts and dynamic-imported analytics
- Documented before/after bundle size and performance metrics

### Definition of Done
- [ ] `pnpm build` succeeds with no warnings
- [ ] `pnpm exec tsc --noEmit` exits 0
- [ ] `pnpm test -- --run` exits 0 with all tests passing
- [ ] `grep -rl "webhook\|ferry2025\|SLACK\|DISCORD\|TELEGRAM" dist/assets/` returns NO results
- [ ] Bundle size delta documented in evidence files

### Must Have
- No secrets/tokens in production client bundle
- All existing tests continue passing after every change
- Baseline measurements captured BEFORE any optimization
- Each change is an atomic, independently deployable commit

### Must NOT Have (Guardrails)
- NO framer-motion import changes (48+ files, properly tree-shakable)
- NO inline arrow function refactoring (low ROI, high regression risk)
- NO new dependencies without explicit justification
- NO color palette, typography, or layout structure changes
- NO component API or file structure changes
- NO coverage thresholds until baseline coverage measured
- NO "full API backend" — webhook fix is ONE serverless function only
- NO Firebase configuration changes (client API keys are public by design)

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: YES (vitest 4.0.18 + @testing-library/react 16.3.2)
- **Automated tests**: YES (Tests-after for most tasks; TDD for a11y focus-trap fix)
- **Framework**: vitest + @testing-library/react (existing)
- **A11y testing**: Add `vitest-axe` or `jest-axe` for automated accessibility assertions

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Build verification**: `pnpm build` + grep for forbidden patterns
- **Type safety**: `pnpm exec tsc --noEmit` exit code 0
- **Test suite**: `pnpm test -- --run` exit code 0
- **Bundle analysis**: `pnpm build` output size comparison
- **Mobile UX**: Playwright at 375px, 640px, 768px viewports
- **A11y**: axe-core returning 0 critical/serious violations

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — baseline + security foundation):
├── Task 1: Capture baseline measurements [quick]
├── Task 2: Verify .env git history + fix .gitignore [quick]
├── Task 3: Remove legacy public/index.html [quick]
└── Task 4: Remove hardcoded admin password [quick]

Wave 2 (After Wave 1 — security completion + code quality):
├── Task 5: Create serverless webhook API + migrate Contact form (depends: 1) [deep]
├── Task 6: Extract shared useFetch hook (depends: 1) [unspecified-high]
├── Task 7: Fix .catch(console.error) error swallowing (depends: 6) [quick]
└── Task 8: Remove as-any casts with proper types (depends: 1) [quick]

Wave 3 (After Wave 2 — testing + accessibility, MAX PARALLEL):
├── Task 9: Add hook tests — useGuestbook (depends: 6) [unspecified-high]
├── Task 10: Add hook tests — useReactions, useMousePosition (depends: 9) [unspecified-high]
├── Task 11: Add CommandPalette focus-trap (TDD) (depends: 1) [deep]
├── Task 12: Add page test — LinksPage (depends: 6) [unspecified-high]
├── Task 13: Integrate axe a11y testing (depends: 1) [unspecified-high]
└── Task 14: Fix touch target sizes (depends: 1) [quick]

Wave 4 (After Wave 3 — performance + mobile polish):
├── Task 15: Lazy-load recharts for dashboard (depends: 1) [quick]
├── Task 16: Dynamic-import react-ga4 analytics (depends: 1) [quick]
├── Task 17: Migrate 4 pages to useFetch hook (depends: 6, 7) [unspecified-high]
└── Task 18: Capture final measurements + document delta (depends: 15, 16) [quick]

Wave FINAL (After ALL tasks — 4 parallel reviews, then user okay):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA (unspecified-high)
└── Task F4: Scope fidelity check (deep)
-> Present results -> Get explicit user okay
```

### Dependency Matrix

| Task | Blocked By | Blocks |
|------|-----------|--------|
| 1 (baseline) | — | 5, 6, 8, 11, 13, 14, 15, 16, 18 |
| 2 (.env verify) | — | — |
| 3 (remove legacy HTML) | — | — |
| 4 (remove admin pwd) | — | — |
| 5 (serverless webhook) | 1 | — |
| 6 (useFetch hook) | 1 | 7, 9, 12, 17 |
| 7 (error handling) | 6 | 17 |
| 8 (as-any casts) | 1 | — |
| 9 (hook tests - guestbook) | 6 | 10 |
| 10 (hook tests - reactions, mouse) | 9 | — |
| 11 (CommandPalette focus-trap TDD) | 1 | — |
| 12 (page test - LinksPage) | 6 | — |
| 13 (axe integration) | 1 | — |
| 14 (touch targets) | 1 | — |
| 15 (lazy recharts) | 1 | 18 |
| 16 (dynamic GA4) | 1 | 18 |
| 17 (migrate pages to useFetch) | 6, 7 | — |
| 18 (final measurements) | 15, 16 | — |

### Agent Dispatch Summary

- **Wave 1**: **4** — T1 `quick`, T2 `quick`, T3 `quick`, T4 `quick`
- **Wave 2**: **4** — T5 `deep`, T6 `unspecified-high`, T7 `quick`, T8 `quick`
- **Wave 3**: **6** — T9 `unspecified-high`, T10 `unspecified-high`, T11 `deep`, T12 `unspecified-high`, T13 `unspecified-high`, T14 `quick`
- **Wave 4**: **4** — T15 `quick`, T16 `quick`, T17 `unspecified-high`, T18 `quick`
- **FINAL**: **4** — F1 `oracle`, F2 `unspecified-high`, F3 `unspecified-high`, F4 `deep`

---

## TODOs

### Wave 1 — Baseline + Security Foundation (Start Immediately)

- [x] 1. Capture Baseline Measurements

  **What to do**:
  - Run `pnpm build` and record total bundle size (JS + CSS chunks)
  - Run `pnpm test -- --run` and record pass/fail count
  - Run `pnpm test:coverage` and capture coverage percentage
  - Run Lighthouse CI or `pnpm exec lighthouse http://localhost:4173 --output=json` after `pnpm preview`
  - Save all outputs to `.sisyphus/evidence/task-1-baseline.md`

  **Must NOT do**:
  - Do NOT make any code changes — this is measurement only
  - Do NOT install new dependencies

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  - Reason: Simple command execution and output recording

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3, 4)
  - **Blocks**: Tasks 5, 6, 8, 11, 13, 14, 15, 16, 18
  - **Blocked By**: None

  **References**:
  - `package.json` — scripts section for available commands
  - `vitest.config.ts:13-24` — coverage configuration (provider: v8)
  - `vite.config.ts` — build configuration with manualChunks

  **Acceptance Criteria**:
  - [ ] `.sisyphus/evidence/task-1-baseline.md` exists with: total JS bundle size, CSS size, test count, coverage %, Lighthouse performance score
  - [ ] `pnpm build` exit code 0
  - [ ] `pnpm test -- --run` exit code 0

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: Build succeeds and output is recorded
    Tool: Bash
    Preconditions: Clean working directory, all deps installed
    Steps:
      1. Run `pnpm build 2>&1 | tee /tmp/build-output.txt`
      2. Extract total size: `du -sh dist/`
      3. Extract JS chunk sizes: `ls -la dist/assets/*.js | awk '{print $5, $9}'`
      4. Save to `.sisyphus/evidence/task-1-baseline.md`
    Expected Result: Build succeeds, all sizes captured in evidence file
    Evidence: .sisyphus/evidence/task-1-baseline.md

  Scenario: Test suite runs and coverage captured
    Tool: Bash
    Preconditions: Build completed
    Steps:
      1. Run `pnpm test -- --run 2>&1 | tee /tmp/test-output.txt`
      2. Run `pnpm test:coverage 2>&1 | tee /tmp/coverage-output.txt`
      3. Extract pass/fail counts and coverage % from output
      4. Append to `.sisyphus/evidence/task-1-baseline.md`
    Expected Result: All tests pass, coverage % recorded
    Evidence: .sisyphus/evidence/task-1-baseline.md
  ```

  **Commit**: YES
  - Message: `chore(baseline): capture initial bundle size and test coverage`
  - Files: `.sisyphus/evidence/task-1-baseline.md`

- [x] 2. Verify .env Git History + Harden .gitignore

  **What to do**:
  - Run `git log --all --diff-filter=A -- .env` to check if `.env` was ever committed
  - If committed: document in evidence file that credentials need rotation
  - Verify `.gitignore` covers `.env` (check if line 91 pattern covers bare `.env` or only `.env.local*`)
  - If `.env` is NOT covered by `.gitignore`, add explicit `.env` entry
  - Verify `.env` is not currently tracked: `git ls-files --error-unmatch .env` should error

  **Must NOT do**:
  - Do NOT rotate credentials (separate task if needed)
  - Do NOT modify `.env` contents
  - Do NOT touch Firebase configuration

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`git-master`]
  - Reason: Git history investigation + .gitignore modification

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3, 4)
  - **Blocks**: None
  - **Blocked By**: None

  **References**:
  - `.gitignore:91` — current env file exclusion pattern (covers `.env.local` variants)
  - `.env` — exists locally with Firebase credentials (lines 4-9)

  **Acceptance Criteria**:
  - [ ] `git log --all --diff-filter=A -- .env` output documented
  - [ ] `git ls-files --error-unmatch .env 2>&1` returns error (file is NOT tracked)
  - [ ] `.gitignore` explicitly contains `.env` entry

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: .env is not tracked by git
    Tool: Bash
    Preconditions: None
    Steps:
      1. Run `git ls-files --error-unmatch .env 2>&1; echo "EXIT: $?"`
      2. Verify exit code is non-zero (file not tracked)
    Expected Result: Exit code 1, error message "did not match any file(s) known to git"
    Evidence: .sisyphus/evidence/task-2-env-verify.txt

  Scenario: .gitignore covers .env
    Tool: Bash
    Preconditions: .gitignore updated
    Steps:
      1. Run `grep -n "^\.env$" .gitignore`
      2. Verify line exists with exact pattern `.env`
    Expected Result: At least one line matching `^\.env$`
    Evidence: .sisyphus/evidence/task-2-gitignore-check.txt
  ```

  **Commit**: YES
  - Message: `fix(security): verify .env not in git history, harden .gitignore`
  - Files: `.gitignore`
  - Pre-commit: `git ls-files --error-unmatch .env` should fail

- [x] 3. Remove Legacy public/index.html

  **What to do**:
  - Verify no references to `public/index.html` in codebase: `grep -r "public/index.html" . --include='*.ts' --include='*.tsx' --include='*.js' --include='*.json'`
  - Check service worker config in `vite.config.ts` PWA section — ensure it doesn't reference `public/index.html`
  - Check `usePWA.ts` hook for any references to the legacy file
  - Delete `public/index.html` (the legacy CRA artifact with jQuery)
  - Verify build still works: `pnpm build`

  **Must NOT do**:
  - Do NOT touch the root `index.html` (Vite entry point — this is the correct one)
  - Do NOT modify PWA configuration beyond removing legacy references

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  - Reason: Simple file deletion after verification

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 4)
  - **Blocks**: None
  - **Blocked By**: None

  **References**:
  - `public/index.html:7-34` — legacy CRA template with jQuery, Bootstrap CDN, `%PUBLIC_URL%` placeholders
  - `index.html` (root) — correct Vite entry point with rich meta tags, JSON-LD
  - `vite.config.ts` — PWA plugin configuration
  - `src/hooks/usePWA.ts` — PWA registration hook

  **Acceptance Criteria**:
  - [ ] `public/index.html` does not exist: `test ! -f public/index.html`
  - [ ] `pnpm build` exits 0
  - [ ] Root `index.html` still exists and is unchanged

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: Legacy file removed and build succeeds
    Tool: Bash
    Preconditions: public/index.html exists (pre-deletion)
    Steps:
      1. Run `grep -r "public/index.html" . --include='*.ts' --include='*.tsx' --include='*.js' --include='*.json' | grep -v node_modules`
      2. Verify no references found (empty output)
      3. Delete `public/index.html`
      4. Run `pnpm build`
      5. Verify exit code 0
    Expected Result: No references found, file deleted, build succeeds
    Evidence: .sisyphus/evidence/task-3-legacy-removal.txt

  Scenario: Root index.html is NOT affected
    Tool: Bash
    Preconditions: public/index.html deleted
    Steps:
      1. Run `test -f index.html && echo "EXISTS" || echo "MISSING"`
      2. Run `grep -c "JSON-LD" index.html` (should return count > 0)
    Expected Result: Root index.html exists with JSON-LD structured data intact
    Evidence: .sisyphus/evidence/task-3-root-html-check.txt
  ```

  **Commit**: YES
  - Message: `chore(cleanup): remove legacy public/index.html CRA artifact`
  - Files: `public/index.html` (deleted)
  - Pre-commit: `pnpm build`

- [x] 4. Remove Hardcoded Admin Password

  **What to do**:
  - Open `src/pages/AdminDashboard.tsx:41` and remove the hardcoded password `'ferry2025'`
  - Replace with environment variable check: `import.meta.env.VITE_ADMIN_PASSWORD` or remove the entire authentication gate
  - If removing auth gate: add a comment explaining the page relies on route obscurity + Vercel deployment protection
  - Alternatively: remove AdminDashboard from production routes entirely (wrap in `import.meta.env.DEV` check)
  - Verify password is not in build output: `pnpm build && grep -rl "ferry2025" dist/`

  **Must NOT do**:
  - Do NOT build a full auth system
  - Do NOT add new dependencies for authentication
  - Do NOT change AdminDashboard functionality — only the access control

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  - Reason: Small targeted code change

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3)
  - **Blocks**: None
  - **Blocked By**: None

  **References**:
  - `src/pages/AdminDashboard.tsx:41` — hardcoded password `'ferry2025'` comparison
  - `src/App.tsx` — route registration for AdminDashboard (lazy-loaded)

  **Acceptance Criteria**:
  - [ ] `pnpm build && grep -rl "ferry2025" dist/assets/` returns NO results
  - [ ] `pnpm exec tsc --noEmit` exits 0
  - [ ] AdminDashboard still loads (if kept) or route returns 404 (if removed)

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: Hardcoded password not in production bundle
    Tool: Bash
    Preconditions: Code changes applied
    Steps:
      1. Run `pnpm build`
      2. Run `grep -rl "ferry2025" dist/assets/`
      3. Verify empty output (no matches)
    Expected Result: Zero files contain the hardcoded password string
    Evidence: .sisyphus/evidence/task-4-password-check.txt

  Scenario: TypeScript compilation succeeds
    Tool: Bash
    Preconditions: AdminDashboard.tsx modified
    Steps:
      1. Run `pnpm exec tsc --noEmit`
      2. Verify exit code 0
    Expected Result: No type errors
    Evidence: .sisyphus/evidence/task-4-typecheck.txt
  ```

  **Commit**: YES
  - Message: `fix(security): remove hardcoded admin password from client bundle`
  - Files: `src/pages/AdminDashboard.tsx`
  - Pre-commit: `pnpm build && grep -rl "ferry2025" dist/`

### Wave 2 — Security Completion + Code Quality (After Wave 1)

- [x] 5. Create Serverless Webhook API + Migrate Contact Form

  **What to do**:
  - Create `api/contact.ts` — a Vercel serverless function that accepts POST with JSON body `{ name, email, subject, message }`, validates input, sends notifications to Slack/Discord/Telegram using `process.env` tokens (server-side only), returns 200/400/500
  - Modify `src/components/Contact.tsx` to POST to `/api/contact` instead of calling `src/utils/webhooks.ts` directly
  - Remove client-side webhook token usage: remove `VITE_SLACK_WEBHOOK_URL`, `VITE_DISCORD_WEBHOOK_URL`, `VITE_TELEGRAM_BOT_TOKEN` from client code
  - Keep Formspree as fallback if it exists in Contact.tsx

  **Must NOT do**:
  - Do NOT add frameworks (Express, Hono) — use plain Vercel serverless handler
  - Do NOT add authentication to the endpoint
  - Do NOT change the user-visible contact form behavior
  - Do NOT touch Firebase configuration

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []
  - Reason: Multi-file change spanning server + client with security implications

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 6, 7, 8)
  - **Blocks**: None
  - **Blocked By**: Task 1 (baseline)

  **References**:
  - `src/utils/webhooks.ts:276-310` — current webhook implementation reading VITE_* env vars
  - `src/components/Contact.tsx:108-111` — where webhooks are called from
  - `api/update-resume.js` — existing serverless function pattern (use as reference for `api/contact.ts`)

  **Acceptance Criteria**:
  - [ ] `api/contact.ts` exists and exports a default handler
  - [ ] `pnpm build && grep -rl "SLACK\|DISCORD\|TELEGRAM\|webhook" dist/assets/` returns NO results
  - [ ] `pnpm exec tsc --noEmit` exits 0
  - [ ] Contact form still renders correctly

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: Webhook tokens removed from client bundle
    Tool: Bash
    Steps:
      1. Run `pnpm build`
      2. Run `grep -rl "SLACK_WEBHOOK\|DISCORD_WEBHOOK\|TELEGRAM_BOT" dist/assets/`
      3. Verify empty output
    Expected Result: Zero files contain webhook token references
    Evidence: .sisyphus/evidence/task-5-webhook-check.txt

  Scenario: Serverless function validates input
    Tool: Bash
    Steps:
      1. Run `pnpm preview &` (background)
      2. Run `curl -X POST http://localhost:4173/api/contact -H "Content-Type: application/json" -d '{}' -w "\n%{http_code}"`
      3. Verify HTTP 400 response for empty body
    Expected Result: 400 status code with validation error message
    Evidence: .sisyphus/evidence/task-5-api-validation.txt
  ```

  **Commit**: YES
  - Message: `fix(security): move webhook notifications to server-side API`
  - Files: `api/contact.ts`, `src/utils/webhooks.ts`, `src/components/Contact.tsx`

- [x] 6. Extract Shared useFetch Hook

  **What to do**:
  - Create `src/hooks/useFetch.ts` — generic data fetching hook following `useResumeData.ts` pattern
  - Hook signature: `useFetch<T>(url: string, options?: { transform?: (data: unknown) => T })` returning `{ data: T | null, loading: boolean, error: Error | null }`
  - Include cleanup flag pattern (prevent state updates after unmount) — copy from `useResumeData.ts`
  - Include contextual error handling (not just `console.error`)
  - Write tests: `src/hooks/__tests__/useFetch.test.ts` — happy path, error path, unmount cleanup

  **Must NOT do**:
  - Do NOT add external fetching libraries (no SWR, React Query, etc.)
  - Do NOT change existing `useResumeData.ts` (it stays as-is for now)
  - Do NOT migrate pages yet (Task 17 handles migration)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []
  - Reason: New hook + tests with non-trivial cleanup logic

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5, 7, 8)
  - **Blocks**: Tasks 7, 9, 12, 17
  - **Blocked By**: Task 1 (baseline)

  **References**:
  - `src/hooks/useResumeData.ts` — existing fetch hook pattern (cleanup flag, loading/error states)
  - `src/pages/LinksPage.tsx:67-110` — duplicated fetch/skeleton pattern to eventually replace
  - `src/pages/AchievementsPage.tsx:136-241` — another duplicated fetch pattern
  - `src/components/__tests__/` — existing test patterns (vi.mock style)

  **Acceptance Criteria**:
  - [ ] `src/hooks/useFetch.ts` exists with proper TypeScript generics
  - [ ] `src/hooks/__tests__/useFetch.test.ts` exists with ≥3 test cases
  - [ ] `pnpm test -- --run src/hooks/__tests__/useFetch.test.ts` passes
  - [ ] `pnpm exec tsc --noEmit` exits 0

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: Hook tests pass
    Tool: Bash
    Steps:
      1. Run `pnpm test -- --run src/hooks/__tests__/useFetch.test.ts`
      2. Verify exit code 0
      3. Verify output shows ≥3 tests passing
    Expected Result: All hook tests pass (happy path, error, cleanup)
    Evidence: .sisyphus/evidence/task-6-hook-tests.txt

  Scenario: TypeScript compilation succeeds
    Tool: Bash
    Steps:
      1. Run `pnpm exec tsc --noEmit`
      2. Verify exit code 0
    Expected Result: No type errors in new hook file
    Evidence: .sisyphus/evidence/task-6-typecheck.txt
  ```

  **Commit**: YES
  - Message: `refactor(hooks): extract shared useFetch hook with error handling`
  - Files: `src/hooks/useFetch.ts`, `src/hooks/__tests__/useFetch.test.ts`

- [x] 7. Fix .catch(console.error) Error Swallowing

  **What to do**:
  - Replace `.catch(console.error)` in 4 files with contextual error handling:
    - `src/pages/LinksPage.tsx:93` — set error state, show ErrorDisplay component
    - `src/pages/AchievementsPage.tsx:244` — set error state, show ErrorDisplay
    - `src/pages/ChangelogPage.tsx:172` — set error state, show ErrorDisplay
    - `src/pages/UsesPage.tsx:142` — set error state, show ErrorDisplay
  - Also fix `src/hooks/usePWA.ts:30` — log with context: `console.warn('PWA registration failed:', error)`
  - Each page should show user-friendly error UI instead of silently failing

  **Must NOT do**:
  - Do NOT refactor the fetch pattern yet (Task 17 handles migration to useFetch)
  - Do NOT change component structure or layout
  - Do NOT add toast/notification library

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  - Reason: Small targeted changes in known locations

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Task 6 completing)
  - **Parallel Group**: Sequential after Task 6
  - **Blocks**: Task 17
  - **Blocked By**: Task 6

  **References**:
  - `src/pages/LinksPage.tsx:90-95` — `.catch(console.error)` location
  - `src/pages/AchievementsPage.tsx:244` — `.catch(console.error)` location
  - `src/pages/ChangelogPage.tsx:172` — `.catch(console.error)` location
  - `src/pages/UsesPage.tsx:142` — `.catch(console.error)` location
  - `src/hooks/usePWA.ts:30` — `.catch(console.error)` in SW registration
  - `src/components/ui/error.tsx` or `src/components/ErrorBoundary.tsx` — existing error display patterns

  **Acceptance Criteria**:
  - [ ] `grep -rn "\.catch(console\.error)" src/ --include='*.ts' --include='*.tsx' | grep -v node_modules | grep -v __tests__` returns NO results
  - [ ] `pnpm exec tsc --noEmit` exits 0
  - [ ] All existing tests pass: `pnpm test -- --run`

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: No console.error swallowing in production code
    Tool: Bash
    Steps:
      1. Run `grep -rn "\.catch(console\.error)" src/ --include='*.ts' --include='*.tsx' | grep -v node_modules | grep -v __tests__`
      2. Verify empty output
    Expected Result: Zero matches in production source files
    Evidence: .sisyphus/evidence/task-7-error-check.txt

  Scenario: Pages still compile and existing tests pass
    Tool: Bash
    Steps:
      1. Run `pnpm exec tsc --noEmit`
      2. Run `pnpm test -- --run`
      3. Verify both exit 0
    Expected Result: No type errors, all tests pass
    Evidence: .sisyphus/evidence/task-7-build-test.txt
  ```

  **Commit**: YES
  - Message: `fix(error-handling): replace console.error swallowing with contextual handlers`
  - Files: `src/pages/LinksPage.tsx`, `src/pages/AchievementsPage.tsx`, `src/pages/ChangelogPage.tsx`, `src/pages/UsesPage.tsx`, `src/hooks/usePWA.ts`

- [x] 8. Remove as-any Casts with Proper Types

  **What to do**:
  - Fix 7 `as any` casts in production code with proper type guards:
    - `src/hooks/usePerformance.ts:18` — `(navigator as any).deviceMemory` → use type guard: `'deviceMemory' in navigator ? (navigator as NavigatorWithDeviceMemory).deviceMemory : undefined`
    - `src/contexts/PerformanceContext.tsx:77,83` — same navigator.deviceMemory and navigator.connection patterns
    - `src/contexts/PerformanceContext.tsx:161-162` — `(base as any).duration` → use PerformanceNavigationTiming type
  - Create a types file `src/types/navigator.d.ts` for `NavigatorDeviceMemory` and `NavigatorConnection` interfaces
  - Leave test file `as any` casts alone (test files are exempted from this rule)

  **Must NOT do**:
  - Do NOT touch `as any` in test files (`src/test/setup.ts`, `src/components/__tests__/*.test.tsx`)
  - Do NOT add `@ts-ignore` or `@ts-expect-error` as replacements
  - Do NOT change runtime behavior — only improve type safety

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  - Reason: Targeted type-level changes, no logic changes

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5, 6, 7)
  - **Blocks**: None
  - **Blocked By**: Task 1 (baseline)

  **References**:
  - `src/hooks/usePerformance.ts:18` — `(navigator as any).deviceMemory`
  - `src/contexts/PerformanceContext.tsx:76-78,83,161-162` — multiple `as any` casts
  - MDN Web API docs for `Navigator.deviceMemory` and `NetworkInformation` interfaces

  **Acceptance Criteria**:
  - [ ] `grep -rn "as any" src/ --include='*.ts' --include='*.tsx' | grep -v node_modules | grep -v __tests__ | grep -v test/setup` returns NO results
  - [ ] `pnpm exec tsc --noEmit` exits 0
  - [ ] All existing tests pass: `pnpm test -- --run`

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: No as-any in production code
    Tool: Bash
    Steps:
      1. Run `grep -rn "as any" src/ --include='*.ts' --include='*.tsx' | grep -v node_modules | grep -v __tests__ | grep -v test/setup`
      2. Verify empty output
    Expected Result: Zero `as any` casts in production source files
    Evidence: .sisyphus/evidence/task-8-any-check.txt

  Scenario: Type compilation succeeds
    Tool: Bash
    Steps:
      1. Run `pnpm exec tsc --noEmit`
      2. Verify exit code 0
    Expected Result: All type guards compile correctly
    Evidence: .sisyphus/evidence/task-8-typecheck.txt
  ```

  **Commit**: YES
  - Message: `fix(types): replace as-any casts with proper navigator type guards`
  - Files: `src/hooks/usePerformance.ts`, `src/contexts/PerformanceContext.tsx`, `src/types/navigator.d.ts`

### Wave 3 — Testing + Accessibility (After Wave 2, MAX PARALLEL)

- [x] 9. Add Hook Tests — useGuestbook

  **What to do**:
  - Create `src/hooks/__tests__/useGuestbook.test.ts`
  - Test cases: happy path (fetch messages), error path (network failure), add message, loading states
  - Mock Firebase/Firestore calls using vi.mock
  - Follow existing test patterns from `src/components/__tests__/`

  **Must NOT do**:
  - Do NOT modify the hook implementation
  - Do NOT add real Firebase connections in tests

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 10-14)
  - **Blocks**: Task 10
  - **Blocked By**: Task 6

  **References**:
  - `src/hooks/useGuestbook.ts` — hook under test
  - `src/contexts/FirebaseContext.tsx` — Firebase context used by hook
  - `src/components/__tests__/Header.test.tsx` — test pattern reference

  **Acceptance Criteria**:
  - [ ] `pnpm test -- --run src/hooks/__tests__/useGuestbook.test.ts` passes with ≥3 tests
  - [ ] All existing tests still pass

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: Hook tests pass
    Tool: Bash
    Steps:
      1. Run `pnpm test -- --run src/hooks/__tests__/useGuestbook.test.ts 2>&1`
      2. Verify exit code 0 and ≥3 tests pass
    Expected Result: All guestbook hook tests pass
    Evidence: .sisyphus/evidence/task-9-guestbook-tests.txt
  ```

  **Commit**: YES
  - Message: `test(hooks): add unit tests for useGuestbook hook`
  - Files: `src/hooks/__tests__/useGuestbook.test.ts`

- [x] 10. Add Hook Tests — useReactions, useMousePosition

  **What to do**:
  - Create `src/hooks/__tests__/useReactions.test.ts` — test add/remove reaction, loading, error
  - Create `src/hooks/__tests__/useMousePosition.test.ts` — test mouse move handler, cleanup
  - Follow patterns established in Task 9

  **Must NOT do**:
  - Do NOT modify hook implementations
  - Do NOT test DOM-dependent hooks that need full browser environment (skip if hook is purely browser-dependent)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (after Task 9 establishes pattern)
  - **Parallel Group**: Wave 3
  - **Blocks**: None
  - **Blocked By**: Task 9

  **References**:
  - `src/hooks/useReactions.ts` — reactions hook
  - `src/hooks/useMousePosition.ts` — mouse position hook
  - Task 9 test file — pattern to follow

  **Acceptance Criteria**:
  - [ ] Both test files exist and pass: `pnpm test -- --run src/hooks/__tests__/useReactions.test.ts src/hooks/__tests__/useMousePosition.test.ts`
  - [ ] All existing tests still pass

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: Both hook test files pass
    Tool: Bash
    Steps:
      1. Run `pnpm test -- --run src/hooks/__tests__/ 2>&1`
      2. Verify exit code 0
    Expected Result: All hook tests pass
    Evidence: .sisyphus/evidence/task-10-hook-tests.txt
  ```

  **Commit**: YES
  - Message: `test(hooks): add unit tests for useReactions and useMousePosition`
  - Files: `src/hooks/__tests__/useReactions.test.ts`, `src/hooks/__tests__/useMousePosition.test.ts`

- [x] 11. Add Focus Trap to CommandPalette (TDD)

  **What to do**:
  - FIRST write failing test in `src/components/__tests__/CommandPalette.test.tsx`:
    - Test: When open, Tab key cycles focus within modal (does not escape)
    - Test: Shift+Tab cycles backward
    - Test: Escape closes and returns focus to trigger element
  - THEN implement focus trap in `src/components/CommandPalette.tsx:320-348`:
    - Use a lightweight approach: track first/last focusable elements, intercept Tab keydown
    - Do NOT add focus-trap library dependency — implement with vanilla DOM
  - Run tests again — they should pass

  **Must NOT do**:
  - Do NOT add external focus-trap libraries
  - Do NOT change CommandPalette visual appearance or functionality
  - Do NOT refactor the component structure

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []
  - Reason: TDD flow + a11y correctness requires careful implementation

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 9, 10, 12, 13, 14)
  - **Blocks**: None
  - **Blocked By**: Task 1

  **References**:
  - `src/components/CommandPalette.tsx:320-348` — modal markup with `role="dialog"`
  - `src/components/__tests__/CommandPalette.test.tsx` — existing tests (extend, don't replace)
  - `src/components/ui/sheet.tsx` — Radix Sheet with built-in focus trap (reference pattern)
  - WAI-ARIA Dialog pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

  **Acceptance Criteria**:
  - [ ] Focus trap test passes: `pnpm test -- --run -t "focus trap" src/components/__tests__/CommandPalette.test.tsx`
  - [ ] All existing CommandPalette tests still pass
  - [ ] `pnpm exec tsc --noEmit` exits 0

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: Focus stays trapped in open CommandPalette
    Tool: Playwright
    Steps:
      1. Navigate to `http://localhost:4173`
      2. Press `Ctrl+K` to open CommandPalette
      3. Press Tab 10 times rapidly
      4. Assert focus is still within `[role="dialog"]` element
      5. Press Escape
      6. Assert CommandPalette is closed (dialog not in DOM)
    Expected Result: Focus never escapes the modal; Escape closes it
    Evidence: .sisyphus/evidence/task-11-focus-trap.png

  Scenario: Tests pass with TDD cycle
    Tool: Bash
    Steps:
      1. Run `pnpm test -- --run src/components/__tests__/CommandPalette.test.tsx`
      2. Verify exit code 0
    Expected Result: All CommandPalette tests pass including new focus-trap tests
    Evidence: .sisyphus/evidence/task-11-test-results.txt
  ```

  **Commit**: YES
  - Message: `fix(a11y): add focus trap to CommandPalette modal`
  - Files: `src/components/CommandPalette.tsx`, `src/components/__tests__/CommandPalette.test.tsx`

- [ ] 12. Add Page Test — LinksPage

  **What to do**:
  - Create `src/pages/__tests__/LinksPage.test.tsx`
  - Test cases: renders loading skeleton, renders links after fetch, shows error on fetch failure
  - Mock fetch calls, verify rendered output
  - This establishes a template for future page tests

  **Must NOT do**:
  - Do NOT test every page — LinksPage only as a template
  - Do NOT add snapshot tests

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3
  - **Blocks**: None
  - **Blocked By**: Task 6

  **References**:
  - `src/pages/LinksPage.tsx` — page under test
  - `src/components/__tests__/` — existing test patterns

  **Acceptance Criteria**:
  - [ ] `pnpm test -- --run src/pages/__tests__/LinksPage.test.tsx` passes with ≥3 tests
  - [ ] All existing tests still pass

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: Page tests pass
    Tool: Bash
    Steps:
      1. Run `pnpm test -- --run src/pages/__tests__/LinksPage.test.tsx 2>&1`
      2. Verify exit code 0 and ≥3 tests pass
    Expected Result: LinksPage tests pass
    Evidence: .sisyphus/evidence/task-12-page-tests.txt
  ```

  **Commit**: YES
  - Message: `test(pages): add smoke tests for LinksPage`
  - Files: `src/pages/__tests__/LinksPage.test.tsx`

- [ ] 13. Integrate axe Automated Accessibility Testing

  **What to do**:
  - Install `vitest-axe` or `jest-axe` (check which works with vitest)
  - Create `src/test/a11y-utils.ts` — helper to render component and run axe
  - Add a11y tests for 3 key sections: render About, Portfolio, Contact sections and assert 0 critical/serious violations
  - Add to existing test files or create `src/components/__tests__/a11y.test.tsx`

  **Must NOT do**:
  - Do NOT test every component — 3 key sections only
  - Do NOT add Lighthouse CI configuration changes
  - Do NOT fix violations found (just establish the testing — fixes tracked separately)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3
  - **Blocks**: None
  - **Blocked By**: Task 1

  **References**:
  - `src/components/__tests__/About.test.tsx` — existing About tests to extend
  - `src/components/__tests__/Portfolio.test.tsx` — existing Portfolio tests
  - `src/components/__tests__/Contact.test.tsx` — existing Contact tests
  - vitest-axe docs: https://github.com/chaance/vitest-axe

  **Acceptance Criteria**:
  - [ ] axe a11y tests exist and pass: `pnpm test -- --run -t "accessibility"` or similar
  - [ ] 0 critical/serious axe violations for tested components
  - [ ] `pnpm exec tsc --noEmit` exits 0

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: axe tests pass with 0 critical violations
    Tool: Bash
    Steps:
      1. Run `pnpm test -- --run src/components/__tests__/a11y.test.tsx 2>&1`
      2. Verify exit code 0
      3. Verify output does not contain "critical" or "serious" violation
    Expected Result: All a11y tests pass
    Evidence: .sisyphus/evidence/task-13-axe-results.txt
  ```

  **Commit**: YES
  - Message: `test(a11y): integrate axe automated accessibility testing`
  - Files: `src/test/a11y-utils.ts`, `src/components/__tests__/a11y.test.tsx`, `package.json` (new dev dependency)

- [x] 14. Fix Touch Target Sizes

  **What to do**:
  - Fix drawer social icons in `src/components/Header.tsx:313`: change `w-10 h-10` to `w-11 h-11` (44px)
  - Verify `Button size="icon"` at `Header.tsx:169-180` (menu trigger) and `Header.tsx:153-165` (theme toggle) meet 44px minimum
  - If buttons are smaller than 44px, add `min-w-[44px] min-h-[44px]` classes
  - Use responsive classes to avoid breaking desktop layout: apply size increases only at mobile breakpoints if needed

  **Must NOT do**:
  - Do NOT change color, typography, or layout
  - Do NOT modify button component API in `src/components/ui/button.tsx`
  - Do NOT add padding/margin that shifts layout significantly

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3
  - **Blocks**: None
  - **Blocked By**: Task 1

  **References**:
  - `src/components/Header.tsx:313` — drawer social icons `w-10 h-10` (40px)
  - `src/components/Header.tsx:169-180` — mobile menu trigger button
  - `src/components/Header.tsx:153-165` — theme toggle button
  - `src/components/ui/button.tsx` — button size variants definition
  - WCAG 2.5.8: minimum 44×44px target size

  **Acceptance Criteria**:
  - [ ] `pnpm build` exits 0
  - [ ] All interactive elements ≥ 44px at 375px viewport (verified by Playwright)

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: Touch targets meet 44px minimum at mobile viewport
    Tool: Playwright
    Steps:
      1. Navigate to `http://localhost:4173`
      2. Set viewport to 375×812 (iPhone SE)
      3. Open mobile menu (click hamburger)
      4. Measure social icon bounding box: `element.boundingBox()`
      5. Assert width ≥ 44 and height ≥ 44
      6. Measure theme toggle bounding box
      7. Assert width ≥ 44 and height ≥ 44
    Expected Result: All measured elements ≥ 44×44px
    Evidence: .sisyphus/evidence/task-14-touch-targets.png

  Scenario: Desktop layout not broken
    Tool: Playwright
    Steps:
      1. Set viewport to 1280×720
      2. Take screenshot of header
      3. Verify no visual overflow or misalignment
    Expected Result: Header renders correctly at desktop width
    Evidence: .sisyphus/evidence/task-14-desktop-check.png
  ```

  **Commit**: YES
  - Message: `fix(a11y): increase touch targets to 44px minimum`
  - Files: `src/components/Header.tsx`

### Wave 4 — Performance + Mobile Polish (After Wave 3)

- [ ] 15. Lazy-load Recharts for Dashboard Pages

  **What to do**:
  - Wrap recharts imports in `src/components/dashboard/CodingStats.tsx` with `React.lazy()` and `Suspense`
  - Do the same for `src/components/ui/project-metrics.tsx` and `src/components/ui/skills-radar.tsx`
  - Add appropriate `<Suspense fallback={<Skeleton />}>` wrappers
  - Verify recharts chunk is now a separate lazy-loaded bundle

  **Must NOT do**:
  - Do NOT change chart configurations or visual output
  - Do NOT add new charting libraries
  - Do NOT modify non-dashboard components

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 16, 17, 18)
  - **Blocks**: Task 18
  - **Blocked By**: Task 1

  **References**:
  - `src/components/dashboard/CodingStats.tsx` — recharts imports
  - `src/components/ui/project-metrics.tsx` — recharts usage
  - `src/components/ui/skills-radar.tsx` — recharts usage
  - `vite.config.ts` — existing manualChunks configuration

  **Acceptance Criteria**:
  - [ ] `pnpm build` exits 0
  - [ ] Recharts is in a separate chunk (visible in build output)
  - [ ] Dashboard still renders charts correctly

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: Build succeeds with separate recharts chunk
    Tool: Bash
    Steps:
      1. Run `pnpm build 2>&1`
      2. Check `ls dist/assets/*.js` for a recharts-related chunk
      3. Compare total bundle size with Task 1 baseline
    Expected Result: Build succeeds, recharts in separate chunk
    Evidence: .sisyphus/evidence/task-15-recharts-lazy.txt

  Scenario: Dashboard charts still render
    Tool: Playwright
    Steps:
      1. Navigate to dashboard page
      2. Wait for chart elements to appear (recharts SVG)
      3. Assert chart container is visible
    Expected Result: Charts render after lazy loading
    Evidence: .sisyphus/evidence/task-15-dashboard-render.png
  ```

  **Commit**: YES
  - Message: `perf(bundle): lazy-load recharts for dashboard pages`
  - Files: `src/components/dashboard/CodingStats.tsx`, `src/components/ui/project-metrics.tsx`, `src/components/ui/skills-radar.tsx`

- [ ] 16. Dynamic-import react-ga4 Analytics

  **What to do**:
  - Change `src/utils/analytics.ts:1` from static `import ReactGA from 'react-ga4'` to dynamic `const ReactGA = await import('react-ga4')`
  - Wrap the initialization in an async IIFE or lazy init pattern
  - Ensure analytics still fires on route changes
  - Verify analytics chunk is separated from main bundle

  **Must NOT do**:
  - Do NOT remove analytics functionality
  - Do NOT change tracked events
  - Do NOT add alternative analytics libraries

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4
  - **Blocks**: Task 18
  - **Blocked By**: Task 1

  **References**:
  - `src/utils/analytics.ts:1` — current static import
  - `src/App.tsx` — where analytics is initialized
  - `vite.config.ts` — existing manualChunks has 'analytics' group

  **Acceptance Criteria**:
  - [ ] `pnpm build` exits 0
  - [ ] `pnpm exec tsc --noEmit` exits 0
  - [ ] Analytics module is loaded dynamically (not in initial main chunk)

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: Build succeeds with analytics chunk separated
    Tool: Bash
    Steps:
      1. Run `pnpm build 2>&1`
      2. Verify analytics-related chunk exists separately
      3. Compare main chunk size with Task 1 baseline
    Expected Result: Main bundle smaller, analytics loaded separately
    Evidence: .sisyphus/evidence/task-16-analytics-lazy.txt
  ```

  **Commit**: YES
  - Message: `perf(bundle): dynamic-import react-ga4 analytics`
  - Files: `src/utils/analytics.ts`

- [ ] 17. Migrate 4 Pages to Shared useFetch Hook

  **What to do**:
  - Refactor `src/pages/LinksPage.tsx` to use `useFetch` hook from Task 6 (replacing manual fetch/state/effect)
  - Refactor `src/pages/AchievementsPage.tsx` similarly
  - Refactor `src/pages/ChangelogPage.tsx` similarly
  - Refactor `src/pages/UsesPage.tsx` similarly
  - Each page should be simpler: `const { data, loading, error } = useFetch<PageDataType>(url)`

  **Must NOT do**:
  - Do NOT change page layout or visual output
  - Do NOT change URLs being fetched
  - Do NOT modify useFetch hook itself

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4
  - **Blocks**: None
  - **Blocked By**: Tasks 6, 7

  **References**:
  - `src/hooks/useFetch.ts` — the shared hook (from Task 6)
  - `src/pages/LinksPage.tsx:67-110` — fetch pattern to replace
  - `src/pages/AchievementsPage.tsx:136-241` — fetch pattern to replace
  - `src/pages/ChangelogPage.tsx:143-241` — fetch pattern to replace
  - `src/pages/UsesPage.tsx:114-141` — fetch pattern to replace

  **Acceptance Criteria**:
  - [ ] All 4 pages import and use `useFetch` hook
  - [ ] `pnpm exec tsc --noEmit` exits 0
  - [ ] All existing tests pass: `pnpm test -- --run`
  - [ ] No manual `useState`+`useEffect`+`fetch` pattern remains in these 4 files

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: Pages compile and render correctly
    Tool: Bash
    Steps:
      1. Run `pnpm exec tsc --noEmit`
      2. Run `pnpm test -- --run`
      3. Run `pnpm build`
    Expected Result: All pass with exit code 0
    Evidence: .sisyphus/evidence/task-17-migration.txt

  Scenario: No duplicated fetch patterns remain
    Tool: Bash
    Steps:
      1. Run `grep -c "useState.*loading\|setLoading\|setError.*fetch" src/pages/LinksPage.tsx src/pages/AchievementsPage.tsx src/pages/ChangelogPage.tsx src/pages/UsesPage.tsx`
      2. Verify counts are 0 or minimal (only useFetch usage, no manual pattern)
    Expected Result: Manual fetch/state patterns replaced by useFetch
    Evidence: .sisyphus/evidence/task-17-dedup-check.txt
  ```

  **Commit**: YES
  - Message: `refactor(pages): migrate data pages to shared useFetch hook`
  - Files: `src/pages/LinksPage.tsx`, `src/pages/AchievementsPage.tsx`, `src/pages/ChangelogPage.tsx`, `src/pages/UsesPage.tsx`

- [ ] 18. Capture Final Measurements + Document Delta

  **What to do**:
  - Run `pnpm build` and record final bundle sizes
  - Run `pnpm test -- --run` and record final test count
  - Run `pnpm test:coverage` and record final coverage %
  - Compare with Task 1 baseline and document delta
  - Save to `.sisyphus/evidence/task-18-final-measurements.md`

  **Must NOT do**:
  - Do NOT make any code changes
  - Do NOT set performance targets that weren't baselined

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential (last in Wave 4)
  - **Blocks**: Final Verification Wave
  - **Blocked By**: Tasks 15, 16

  **References**:
  - `.sisyphus/evidence/task-1-baseline.md` — baseline measurements to compare against

  **Acceptance Criteria**:
  - [ ] `.sisyphus/evidence/task-18-final-measurements.md` exists with before/after comparison
  - [ ] Bundle size delta is documented (positive = smaller, negative = larger)
  - [ ] Test count delta is documented (should be higher)

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: Final measurements captured and compared
    Tool: Bash
    Steps:
      1. Run `pnpm build 2>&1 | tee /tmp/final-build.txt`
      2. Run `pnpm test -- --run 2>&1 | tee /tmp/final-tests.txt`
      3. Compare with `.sisyphus/evidence/task-1-baseline.md`
      4. Create `.sisyphus/evidence/task-18-final-measurements.md` with delta table
    Expected Result: Measurements captured, delta documented
    Evidence: .sisyphus/evidence/task-18-final-measurements.md
  ```

  **Commit**: YES
  - Message: `docs(perf): document before/after bundle size and performance delta`
  - Files: `.sisyphus/evidence/task-18-final-measurements.md`

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, grep build output, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in `.sisyphus/evidence/`. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `pnpm exec tsc --noEmit` + `pnpm test -- --run` + `pnpm build`. Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names.
  Output: `Build [PASS/FAIL] | TypeCheck [PASS/FAIL] | Tests [N pass/N fail] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill for mobile viewport testing)
  Start from clean state (`pnpm build && pnpm preview`). Execute EVERY QA scenario from EVERY task. Test cross-task integration. Test at 375px, 640px, 768px, 1024px viewports. Test edge cases: empty state, invalid input, rapid actions. Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Viewports [N/N] | Edge Cases [N tested] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff. Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance. Detect cross-task contamination. Flag unaccounted changes.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

| Task | Commit Message | Key Files | Pre-commit Check |
|------|---------------|-----------|-----------------|
| 1 | `chore(baseline): capture initial bundle size and test coverage` | `.sisyphus/evidence/` | N/A |
| 2 | `fix(security): verify .env not in git history, harden .gitignore` | `.gitignore` | `git log --all -- .env` |
| 3 | `chore(cleanup): remove legacy public/index.html CRA artifact` | `public/index.html` | `pnpm build` |
| 4 | `fix(security): remove hardcoded admin password from client bundle` | `src/pages/AdminDashboard.tsx` | `pnpm build && grep -rl "ferry2025" dist/` |
| 5 | `fix(security): move webhook notifications to server-side API` | `api/contact.ts`, `src/utils/webhooks.ts`, `src/components/Contact.tsx` | `pnpm build && grep -rl "webhook\|SLACK\|DISCORD\|TELEGRAM" dist/assets/` |
| 6 | `refactor(hooks): extract shared useFetch hook with error handling` | `src/hooks/useFetch.ts` | `pnpm exec tsc --noEmit && pnpm test -- --run` |
| 7 | `fix(error-handling): replace console.error swallowing with contextual handlers` | `src/pages/LinksPage.tsx`, `AchievementsPage.tsx`, `ChangelogPage.tsx`, `UsesPage.tsx` | `pnpm exec tsc --noEmit` |
| 8 | `fix(types): replace as-any casts with proper navigator type guards` | `src/hooks/usePerformance.ts`, `src/contexts/PerformanceContext.tsx` | `pnpm exec tsc --noEmit` |
| 9 | `test(hooks): add unit tests for useGuestbook hook` | `src/hooks/__tests__/useGuestbook.test.ts` | `pnpm test -- --run` |
| 10 | `test(hooks): add unit tests for useReactions and useMousePosition` | `src/hooks/__tests__/useReactions.test.ts`, `useMousePosition.test.ts` | `pnpm test -- --run` |
| 11 | `fix(a11y): add focus trap to CommandPalette modal` | `src/components/CommandPalette.tsx`, `__tests__/CommandPalette.test.tsx` | `pnpm test -- --run` |
| 12 | `test(pages): add smoke tests for LinksPage` | `src/pages/__tests__/LinksPage.test.tsx` | `pnpm test -- --run` |
| 13 | `test(a11y): integrate axe automated accessibility testing` | `src/test/a11y-utils.ts`, test files | `pnpm test -- --run` |
| 14 | `fix(a11y): increase touch targets to 44px minimum` | `src/components/Header.tsx` | `pnpm build` |
| 15 | `perf(bundle): lazy-load recharts for dashboard pages` | `src/components/dashboard/CodingStats.tsx`, etc. | `pnpm build` (size check) |
| 16 | `perf(bundle): dynamic-import react-ga4 analytics` | `src/utils/analytics.ts` | `pnpm build` (size check) |
| 17 | `refactor(pages): migrate data pages to shared useFetch hook` | 4 page files | `pnpm exec tsc --noEmit && pnpm test -- --run` |
| 18 | `docs(perf): document before/after bundle size and performance delta` | `.sisyphus/evidence/` | N/A |

---

## Success Criteria

### Verification Commands
```bash
pnpm exec tsc --noEmit           # Expected: exit 0, no errors
pnpm test -- --run               # Expected: exit 0, all tests pass
pnpm build                       # Expected: exit 0, no warnings
grep -rl "ferry2025" dist/assets/ # Expected: no results
grep -rl "webhook" dist/assets/   # Expected: no results (after Task 5)
grep -rl "SLACK\|DISCORD\|TELEGRAM" dist/assets/  # Expected: no results
```

### Final Checklist
- [ ] All "Must Have" present (verified by F1)
- [ ] All "Must NOT Have" absent (verified by F1)
- [ ] All tests pass (verified by F2)
- [ ] Bundle size delta documented (verified by F4)
- [ ] Mobile viewports verified (verified by F3)
- [ ] No secrets in production build (verified by F2)
