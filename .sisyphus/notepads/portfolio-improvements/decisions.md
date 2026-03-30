
## [2026-03-31] Task T3: Remove legacy public/index.html
- **Was file confirmed as legacy artifact:** YES
  - Contains: jQuery 1.10.2, `%PUBLIC_URL%` CRA placeholders, legacy DOM selectors
  - Old template from Ceevee by Styleshout + Udemy course (Create React App era)
- **Any references found:** NO
  - Searched: src/, api/, vite.config.ts, vercel.json, *.json configs
  - Service worker (usePWA.ts) doesn't reference it
- **Action taken:** DELETED
  - File removed: `/Users/ferryhinardi/Workspace/personal-web/public/index.html`
  - Root `index.html` (Vite entry point) left untouched
  - Build verification: `pnpm build` ✓ SUCCESS (5.92s, PWA generated)
  - Test verification: `pnpm test -- --run` ✓ ALL 228 TESTS PASSED (9 test files)
- **Impact:** Zero — real entry point is root `index.html` (modern, SEO-optimized)

## [2026-03-31] Task T4: Remove hardcoded admin password
- **Hardcoded password found:** YES
  - Location 1: `src/pages/AdminDashboard.tsx:41` in handleLogin()
  - Location 2: `src/pages/AdminDashboard.tsx:207` in handleSaveToGitHub()
  - Value: `'ferry2025'` (production secret exposed to client bundle)
- **Replacement approach:** `import.meta.env.VITE_ADMIN_PASSWORD`
  - Fail-closed behavior: YES (denies access if env var not set or empty)
  - Only embedded in bundle if explicitly set in build environment
  - Admin access now requires setting env var in Vercel dashboard
- **Related changes:**
  - Updated UI login note from hardcoded password hint to env var reference (line 280)
- **Verification results:**
  - TypeScript type check: ✓ PASS (pnpm exec tsc --noEmit)
  - Test suite: ✓ ALL 228 TESTS PASS (9 test files, 1.16s)
  - Production build: ✓ SUCCESS (5.79s)
  - Bundle security: ✓ VERIFIED — NO 'ferry2025' found in dist/assets/
- **Deployment requirement:** Set `VITE_ADMIN_PASSWORD` in Vercel project environment variables
