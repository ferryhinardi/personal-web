# Baseline Measurements
**Date**: 2026-03-30 22:26:47 UTC  
**Task**: T1 - Baseline Capture  
**Status**: ✅ All systems healthy

## Build Output
```
✓ 3012 modules transformed.
✓ built in 6.33s

vite v6.4.1 production build results:
- build/registerSW.js                            0.13 kB
- build/manifest.webmanifest                     0.86 kB
- build/index.html                              12.04 kB │ gzip:   2.73 kB
- build/assets/AdminDashboard-DgqPulfb.css       3.79 kB │ gzip:   1.15 kB
- build/assets/index-DwSm76Py.css              138.09 kB │ gzip:  21.57 kB
- build/assets/separator-BaP2pm6J.js             0.41 kB │ gzip:   0.28 kB
- build/assets/NotFoundPage-DD2N8Ksb.js          0.77 kB │ gzip:   0.45 kB
- build/assets/badge-B1AlPvgc.js                 0.90 kB │ gzip:   0.44 kB
- build/assets/label-DXV0yIb-.js                 1.42 kB │ gzip:   0.56 kB
- build/assets/useGitHubActivity-CCs6MwLN.js     1.91 kB │ gzip:   0.89 kB
- build/assets/github-activity-CAhF5aud.js       2.83 kB │ gzip:   0.90 kB
- build/assets/section-transition-BKp2-6J3.js    3.33 kB │ gzip:   1.50 kB
- build/assets/UsesPage-DkHFjbna.js              3.47 kB │ gzip:   1.42 kB
- build/assets/skills-radar-Cd27-h_5.js          3.53 kB │ gzip:   1.52 kB
- build/assets/SEOHead-8bDq6qaC.js               3.61 kB │ gzip:   1.29 kB
- build/assets/ChangelogPage-CJCnwfpY.js         3.69 kB │ gzip:   1.45 kB
- build/assets/LinksPage-leHme5bt.js             3.99 kB │ gzip:   1.50 kB
- build/assets/floating-badge-BcMeyg_K.js        4.77 kB │ gzip:   2.08 kB
- build/assets/web-vitals-Cy8-ZkK4.js            6.07 kB │ gzip:   2.47 kB
- build/assets/AchievementsPage-ClMHkpW6.js      7.35 kB │ gzip:   2.60 kB
- build/assets/Portfolio-DS4fvyez.js             8.22 kB │ gzip:   3.14 kB
- build/assets/Resume-BVCsroo6.js                9.47 kB │ gzip:   2.71 kB
- build/assets/GuestbookPage-BzHyrSw-.js         9.90 kB │ gzip:   3.49 kB
- build/assets/DashboardPage-D4VehAwi.js        10.46 kB │ gzip:   2.98 kB
- build/assets/analytics-CgYz0tUN.js            13.02 kB │ gzip:   4.54 kB
- build/assets/ProjectModal-DwtiF37W.js         14.18 kB │ gzip:   3.06 kB
- build/assets/AdminDashboard-D64mVu9J.js       21.70 kB │ gzip:   5.53 kB
- build/assets/ui-icons-uv9LtCMj.js             23.13 kB │ gzip:   8.83 kB
- build/assets/Contact-B7-FAmJJ.js              27.92 kB │ gzip:   9.84 kB
- build/assets/radix-vendor-Y6rUUNzy.js         36.35 kB │ gzip:  11.61 kB
- build/assets/About-BZQOe6qH.js                39.24 kB │ gzip:  13.46 kB
- build/assets/framer-motion-Br6CNO2o.js       127.74 kB │ gzip:  41.01 kB
- build/assets/react-vendor-BJ-0LPfN.js        140.33 kB │ gzip:  45.38 kB
- build/assets/index-BWxX8BEF.js               248.27 kB │ gzip:  76.24 kB
- build/assets/firebase-vendor-BoGO_DEy.js     335.17 kB │ gzip:  81.80 kB
- build/assets/charts-cSzCsI1R.js              404.56 kB │ gzip: 112.79 kB

PWA generated: 155 precache entries (7200.76 KiB)
- build/sw.js
- build/workbox-daba6f28.js
```

## Bundle Size Summary
| Metric | Size |
|--------|------|
| **Largest single chunk** | charts-cSzCsI1R.js: 404.56 kB (gzipped: 112.79 kB) |
| **2nd largest** | firebase-vendor-BoGO_DEy.js: 335.17 kB (gzipped: 81.80 kB) |
| **3rd largest** | index-BWxX8BEF.js (main): 248.27 kB (gzipped: 76.24 kB) |
| **4th largest** | react-vendor-BJ-0LPfN.js: 140.33 kB (gzipped: 45.38 kB) |
| **5th largest** | framer-motion-Br6CNO2o.js: 127.74 kB (gzipped: 41.01 kB) |
| **CSS total** | index-DwSm76Py.css: 138.09 kB (gzipped: 21.57 kB) |
| **HTML** | index.html: 12.04 kB (gzipped: 2.73 kB) |

### Total Uncompressed JS
- Sum of all `.js` files: ~1,640+ kB
- Primary targets: charts (404 kB), Firebase (335 kB), main bundle (248 kB)

## TypeScript Check
```
Status: ✅ PASS
Exit code: 0
Errors: None
Time: ~2s
```

## Test Results
```
✅ Test Files: 9 passed (9)
✅ Tests: 228 passed (228)
✅ No failures

Test file breakdown:
- Footer.test.tsx: 4 tests ✅
- ErrorBoundary.test.tsx: 22 tests ✅
- About.test.tsx: 6 tests ✅
- InteractiveBadge.test.tsx: 24 tests ✅
- Header.test.tsx: 5 tests ✅
- Resume.test.tsx: 50 tests ✅
- CommandPalette.test.tsx: 32 tests ✅
- Portfolio.test.tsx: 63 tests ✅
- Contact.test.tsx: 22 tests ✅

Duration: 1.32s (transform 1.33s, setup 1.90s, import 1.70s, tests 1.50s, environment 2.30s)
```

## Coverage (Not Available)
- **Status**: Coverage tool not installed (`@vitest/coverage-v8` dependency missing)
- **Note**: Can be added later if needed via `pnpm add -D @vitest/coverage-v8`

## Pre-Existing Warnings Observed
During test runs, several Framer Motion warnings appeared (non-fatal):

### Framer Motion Prop Warnings
- React does not recognize `whileHover`, `whileInView`, `whileTap`, `layoutId` props
- These are intentional framer-motion DOM props and not errors
- Components using these: Portfolio, Contact, About, Header, Resume
- **Status**: Expected behavior — not a defect

### Ref Forwarding Warnings
- `InteractiveBadgeComponent`: Function component ref warning (InteractiveBadge.test.tsx)
- `HeroSection`: Function component ref warning (Header.test.tsx)
- **Status**: Pre-existing, not blocking

### Summary
- **Total warnings**: ~15 (all Framer Motion + ref-related, non-fatal)
- **Build process**: Healthy ✅
- **Type checking**: Healthy ✅
- **Tests**: All passing ✅

## Performance Target Status
| Target | Value | Status |
|--------|-------|--------|
| Bundle size | ~1,640 kB (uncompressed) | ⚠️ Above 220 kB target |
| Tests | 228 passing | ✅ Excellent |
| TypeScript | 0 errors | ✅ Clean |
| Build time | 6.33s | ✅ Acceptable |

---

## Notes
- Baseline captured successfully with all core metrics
- Large bundle driven by: charts library (404 kB), Firebase (335 kB), main app (248 kB)
- All tests passing — foundation is stable for optimization work
- Coverage tool not configured but can be added if needed
- Pre-existing warnings are cosmetic and non-blocking
