# Implementation Plan: Personal Portfolio Upgrade

> **Scope**: 11 new features across 8 phases, Firebase backend, multi-theme system, i18n, and dynamic OG images.
> **Constraint**: Every phase is independently deployable. All existing features (PWA, admin dashboard, print resume, animations, CI/CD) are preserved.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Firebase Data Model](#firebase-data-model)
3. [Theme System Architecture](#theme-system-architecture)
4. [i18n Approach](#i18n-approach)
5. [Dynamic OG Images](#dynamic-og-images)
6. [Phase 0 — Routing & Layout Foundation](#phase-0--routing--layout-foundation)
7. [Phase 1 — Firebase Integration](#phase-1--firebase-integration)
8. [Phase 2 — Theme System (Multi-Theme)](#phase-2--theme-system-multi-theme)
9. [Phase 3 — i18n Support](#phase-3--i18n-support)
10. [Phase 4 — Dashboard Page](#phase-4--dashboard-page)
11. [Phase 5 — Guestbook & Emoji Reactions](#phase-5--guestbook--emoji-reactions)
12. [Phase 6 — Content Pages (Achievements, Uses, Changelog, Links)](#phase-6--content-pages)
13. [Phase 7 — Dynamic OG Images & Polish](#phase-7--dynamic-og-images--polish)
14. [Dependency Graph](#dependency-graph)
15. [Risk Mitigation](#risk-mitigation)

---

## Architecture Overview

### Current State

```
src/
  main.tsx           → BrowserRouter with 3 routes: /, /print, /admin
  App.tsx            → Single-page layout (Header → About → Resume → Portfolio → Contact → Footer)
  components/        → 12 component files + 39 UI primitives
  contexts/          → PerformanceContext
  hooks/             → 8 custom hooks
  types/             → resume.types.ts
  utils/             → 6 utility modules
  pages/             → PrintResume, AdminDashboard
api/
  update-resume.js   → Vercel serverless function
```

### Target State

```
src/
  main.tsx           → BrowserRouter with shared layout wrapper
  App.tsx            → Preserved single-page layout (home route)
  layouts/
    RootLayout.tsx   → Shared shell: Header nav, Footer, theme/i18n providers
    PageLayout.tsx   → Standard page wrapper (title, breadcrumb, back link)
  components/        → Existing + new page-specific components
  contexts/
    PerformanceContext.tsx   → Preserved
    ThemeContext.tsx         → NEW: multi-theme state
    I18nContext.tsx          → NEW: language state (wraps react-i18next)
    FirebaseContext.tsx      → NEW: Firebase app/auth instance
  hooks/
    (existing 8)
    useFirebase.ts          → NEW: Firestore helpers
    useGuestbook.ts         → NEW: real-time guestbook
    useReactions.ts         → NEW: emoji reactions
    useViewCount.ts         → NEW: page view counter
    useTheme.ts             → NEW: multi-theme hook
  i18n/
    config.ts               → react-i18next initialization
    locales/
      en.json               → English translations
      id.json               → Indonesian translations
  lib/
    firebase.ts             → Firebase app initialization
    firebase-admin.ts       → Server-side helpers (Vercel functions)
  pages/
    PrintResume.tsx          → Preserved
    AdminDashboard.tsx       → Preserved
    DashboardPage.tsx        → NEW: GitHub activity, WakaTime, typing stats
    GuestbookPage.tsx        → NEW: real-time message board
    AchievementsPage.tsx     → NEW: certificates & badges
    UsesPage.tsx             → NEW: tools/setup page
    ChangelogPage.tsx        → NEW: site changelog
    LinksPage.tsx            → NEW: link-in-bio page
  types/
    resume.types.ts          → Preserved
    firebase.types.ts        → NEW: Firestore document types
    theme.types.ts           → NEW: theme type definitions
api/
    update-resume.js         → Preserved
    og/[...path].ts          → NEW: dynamic OG image generation
```

### Hybrid Navigation Strategy

The main portfolio sections (Hero, About, Resume, Portfolio, Contact) stay as anchor-scroll sections within the `/` route, preserving the single-page feel. New features get their own routes (`/dashboard`, `/guestbook`, etc.) with a shared layout that includes a compact header with navigation links to both the home sections and new pages.

```
/                → App.tsx (single-page scroll)
/print           → PrintResume (preserved)
/admin           → AdminDashboard (preserved)
/dashboard       → DashboardPage (NEW)
/guestbook       → GuestbookPage (NEW)
/achievements    → AchievementsPage (NEW)
/uses            → UsesPage (NEW)
/changelog       → ChangelogPage (NEW)
/links           → LinksPage (NEW)
```

---

## Firebase Data Model

### Firestore Collections

```
firestore/
├── guestbook/                    # Guestbook messages
│   └── {messageId}
│       ├── name: string
│       ├── message: string
│       ├── email?: string        # Hidden, for admin only
│       ├── avatar?: string       # Generated from name initials or optional URL
│       ├── country?: string      # Derived from IP via Vercel headers
│       ├── approved: boolean     # Moderation flag
│       ├── createdAt: Timestamp
│       └── updatedAt: Timestamp
│
├── reactions/                    # Emoji reactions (per-page)
│   └── {pageSlug}               # e.g., "home", "guestbook", "dashboard"
│       ├── totals: Map<string, number>   # { "🔥": 42, "❤️": 18, ... }
│       └── userReactions/        # Subcollection
│           └── {visitorId}       # Anonymous fingerprint (localStorage UUID)
│               └── emojis: string[]      # ["🔥", "❤️"]
│
├── viewCounts/                   # Page view counters
│   └── {pageSlug}
│       ├── total: number
│       └── unique: number
│
├── achievements/                 # Certificates & badges (admin-managed)
│   └── {achievementId}
│       ├── title: string
│       ├── issuer: string
│       ├── date: Timestamp
│       ├── image?: string        # Badge/cert image URL
│       ├── url?: string          # Verification URL
│       ├── category: string      # "certification" | "award" | "badge"
│       └── order: number         # Display sort order
│
└── changelog/                    # Site changelog entries
    └── {entryId}
        ├── version: string       # "2.1.0"
        ├── title: string
        ├── description: string
        ├── changes: string[]     # Bullet-point list
        ├── date: Timestamp
        └── type: string          # "feature" | "fix" | "improvement"
```

### Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Guestbook: anyone can create (rate-limited via app logic), only admin can update/delete
    match /guestbook/{messageId} {
      allow read: if true;
      allow create: if request.resource.data.keys().hasAll(['name', 'message', 'createdAt'])
                    && request.resource.data.name.size() > 0
                    && request.resource.data.name.size() <= 100
                    && request.resource.data.message.size() > 0
                    && request.resource.data.message.size() <= 500;
      allow update, delete: if false; // Admin SDK only
    }

    // Reactions: anyone can read totals, write own reactions
    match /reactions/{pageSlug} {
      allow read: if true;
      allow update: if true; // Totals updated via transaction

      match /userReactions/{visitorId} {
        allow read, write: if true;
      }
    }

    // View counts: readable by all, incremented via transaction
    match /viewCounts/{pageSlug} {
      allow read: if true;
      allow update: if true;
      allow create: if true;
    }

    // Achievements: read-only for public
    match /achievements/{achievementId} {
      allow read: if true;
      allow write: if false; // Admin SDK only
    }

    // Changelog: read-only for public
    match /changelog/{entryId} {
      allow read: if true;
      allow write: if false; // Admin SDK only
    }
  }
}
```

### Why This Model

- **No authentication required for visitors** — guestbook uses name/message fields, reactions use localStorage-based visitor IDs, view counts use Firestore transactions for atomic increments.
- **Admin operations** (approve guestbook, manage achievements/changelog) use the existing Vercel serverless functions with Firebase Admin SDK + a shared secret, matching the existing `api/update-resume.js` pattern.
- **Real-time** — Firestore `onSnapshot` gives us live guestbook updates and reaction counts without polling.
- **Subcollection pattern for reactions** prevents read-amplification; the totals map is a single document read, while per-user tracking uses a subcollection keyed by visitor ID.

---

## Theme System Architecture

### Design: CSS Custom Properties + Tailwind v4 `@theme`

The current codebase uses Tailwind v4's `@theme` directive with oklch color tokens in `src/index.css`. The multi-theme system extends this by defining multiple theme presets as CSS custom property sets, switched via a `data-theme` attribute on `<html>`.

### Theme Presets (5 initial themes)

| Theme | Description | Hue |
|-------|-------------|-----|
| `default` | Current blue theme | 240 |
| `rose` | Warm rose/pink | 350 |
| `emerald` | Nature green | 160 |
| `amber` | Warm amber/gold | 45 |
| `violet` | Purple/violet | 280 |

Each theme defines the same set of CSS custom properties at different hue values. Dark mode remains orthogonal — every theme works in both light and dark modes.

### Implementation

**`src/index.css` additions:**

```css
/* Theme definitions — each overrides the primary color scale hue */
[data-theme="default"] { --theme-hue: 240; }
[data-theme="rose"]    { --theme-hue: 350; }
[data-theme="emerald"] { --theme-hue: 160; }
[data-theme="amber"]   { --theme-hue: 45;  }
[data-theme="violet"]  { --theme-hue: 280; }

@theme {
  --color-primary-50:  oklch(0.97 0.01 var(--theme-hue));
  --color-primary-100: oklch(0.93 0.03 var(--theme-hue));
  /* ... rest of scale uses var(--theme-hue) instead of hardcoded 240 */
}
```

Since oklch hue is a single axis, rotating it gives us a full color theme with minimal CSS. The dark mode neutral scale (grays) stays the same across all themes.

**`src/contexts/ThemeContext.tsx`:**

```typescript
type ThemeName = 'default' | 'rose' | 'emerald' | 'amber' | 'violet';

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  isDark: boolean;
  toggleDarkMode: () => void;
}
```

- Persists to `localStorage` under key `theme`.
- Sets `data-theme` attribute on `document.documentElement`.
- Absorbs the existing `useDarkMode` hook logic so dark mode and theme selection are unified in one context.

**`src/hooks/useTheme.ts`:**

Convenience hook that returns `useContext(ThemeContext)`. All existing dark mode consumers (`Header.tsx`, `CommandPalette.tsx`) migrate from `useDarkMode()` to `useTheme()`.

### Theme Picker UI

A `ThemePicker` component (added to the Header and CommandPalette) shows 5 colored circles. Clicking one sets the theme. It uses the existing `Button` component and fits in the nav bar next to the dark mode toggle.

---

## i18n Approach

### Library: `react-i18next` + `i18next`

**Rationale**: Most popular React i18n library, works with Vite out of the box, supports lazy-loaded namespace bundles, has TypeScript support, and the bundle is small (~3KB gzipped for the core).

### File Structure

```
src/i18n/
  config.ts           → i18next.init({ ... })
  locales/
    en.json           → { "nav.home": "Home", "hero.greeting": "I'm", ... }
    id.json           → { "nav.home": "Beranda", "hero.greeting": "Saya", ... }
```

### Namespace Strategy

A single namespace (`translation`) is sufficient for this portfolio site — the total string count will be under 200 keys. No need for namespace splitting given the small scope.

### Translation Key Convention

Dot-separated, section-scoped:

```json
{
  "nav.home": "Home",
  "nav.about": "About",
  "hero.greeting": "I'm",
  "hero.description": "Crafting Digital Experiences",
  "about.title": "About Me",
  "contact.title": "Get In Touch",
  "guestbook.title": "Guestbook",
  "guestbook.placeholder": "Leave a message...",
  "theme.default": "Blue",
  "theme.rose": "Rose",
  "common.loading": "Loading...",
  "common.error": "Something went wrong"
}
```

### Integration Points

1. **`src/main.tsx`** — Import `./i18n/config` before rendering (side-effect import).
2. **All components** — Replace hardcoded English strings with `const { t } = useTranslation()`.
3. **Language picker** — Dropdown in Header nav, persisted to `localStorage`, sets `i18next.changeLanguage()`.
4. **`resumeData.json`** — Stays in English. The JSON content (bio, work history) is NOT translated — only UI chrome strings are. This is a pragmatic decision: resume content is authored by Ferry and is English-primary. The `id.json` file translates navigation, buttons, section titles, and new page content.
5. **HTML `lang` attribute** — Updated via `useEffect` on language change.

### Bundle Impact

- `i18next`: ~6KB gzipped
- `react-i18next`: ~3KB gzipped
- Locale JSON files: ~2KB each (lazy loaded)
- **Total**: ~11KB added to initial bundle, well within the 220KB budget.

---

## Dynamic OG Images

### Challenge: Vite (not Next.js)

Next.js has built-in `ImageResponse` for OG generation. With Vite + Vercel, we use **Vercel Serverless Functions** (Edge or Node.js) with the `@vercel/og` package, which works independently of Next.js.

### Implementation

**`api/og/[...path].ts`** — Vercel serverless function (catch-all route):

```typescript
import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') ?? 'Ferry Hinardi';
  const description = searchParams.get('description') ?? 'Software Engineer';
  const page = searchParams.get('page') ?? 'home';

  return new ImageResponse(
    (
      <div style={{ /* JSX-to-image layout */ }}>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

**Usage in `<Helmet>`:**

```tsx
<Helmet>
  <meta
    property="og:image"
    content={`https://ferryhinardi.com/api/og?title=${encodeURIComponent(pageTitle)}&page=${slug}`}
  />
</Helmet>
```

### Route Mapping

| Page | OG URL |
|------|--------|
| `/` | `/api/og?title=Ferry Hinardi&description=Software Engineer` |
| `/dashboard` | `/api/og?title=Dashboard&page=dashboard` |
| `/guestbook` | `/api/og?title=Guestbook&page=guestbook` |
| `/achievements` | `/api/og?title=Achievements&page=achievements` |
| etc. | ... |

### `vercel.json` Update

No change needed — the existing rewrite `/((?!api).*)` already excludes `/api/*` routes, so `/api/og/...` will hit the serverless function.

### Design

The OG image template renders:
- Name and title
- Page-specific icon/illustration
- Theme-aware colors (reads a `theme` query param)
- Professional gradient background matching the site's design language

---

## Phase 0 — Routing & Layout Foundation

**Goal**: Restructure routing to support multi-page architecture with hybrid navigation, without changing any visible behavior.

**Complexity**: M (Medium)
**Dependencies**: None (foundational)

### Files to Create

| File | Purpose |
|------|---------|
| `src/layouts/RootLayout.tsx` | Shared layout shell with `<Outlet />`, providers, analytics |
| `src/layouts/PageLayout.tsx` | Standard page wrapper (title, breadcrumb, scroll-to-top) |
| `src/components/Navigation.tsx` | Extracted nav component used in both home page header and page headers |

### Files to Modify

| File | Changes |
|------|---------|
| `src/main.tsx` | Refactor to nested `<Route>` structure with `RootLayout` as parent |
| `src/App.tsx` | Wrap in layout, keep as index route content |
| `src/components/Header.tsx` | Extract navigation items to shared config; add links to new pages in nav |
| `src/components/CommandPalette.tsx` | Add page navigation commands (dashboard, guestbook, etc.) |

### Key Implementation Details

**`src/main.tsx` (after):**

```tsx
import RootLayout from './layouts/RootLayout';

<BrowserRouter>
  <Routes>
    <Route element={<RootLayout />}>
      <Route path="/" element={<App />} />
      <Route path="/print" element={<PrintResume />} />
      <Route path="/admin" element={
        <Suspense fallback={<Loading fullScreen message="Loading dashboard..." />}>
          <AdminDashboard />
        </Suspense>
      } />
      {/* New page routes added in later phases */}
    </Route>
  </Routes>
</BrowserRouter>
```

**`src/layouts/RootLayout.tsx`:**

```tsx
export default function RootLayout() {
  return (
    <HelmetProvider>
      <PerformanceProvider>
        <ErrorBoundary>
          <PWAWrapper>
            <Outlet />
          </PWAWrapper>
        </ErrorBoundary>
      </PerformanceProvider>
    </HelmetProvider>
  );
}
```

This moves the provider stack from `App.tsx` and `main.tsx` into a single shared layout, so all routes (existing and new) get the same context providers.

**Navigation config** (`src/config/navigation.ts`):

```typescript
export const mainSections = [
  { label: 'Home', href: '/#home', icon: Home },
  { label: 'About', href: '/#about', icon: User },
  { label: 'Resume', href: '/#resume', icon: FileText },
  { label: 'Works', href: '/#portfolio', icon: Briefcase },
  { label: 'Contact', href: '/#contact', icon: Mail },
];

export const pages = [
  { label: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { label: 'Guestbook', href: '/guestbook', icon: MessageSquare },
  { label: 'Achievements', href: '/achievements', icon: Award },
  { label: 'Uses', href: '/uses', icon: Wrench },
  { label: 'Changelog', href: '/changelog', icon: GitBranch },
  { label: 'Links', href: '/links', icon: Link },
];
```

### Navigation Behavior

- On `/` route: clicking section links uses smooth scroll (existing behavior).
- On other routes: clicking section links navigates to `/#about` etc., which React Router handles as navigation to `/` + hash.
- Page links use standard `<Link to="/dashboard">` from React Router.

### Testing Strategy

- Update existing `Header.test.tsx` to wrap in `MemoryRouter` (currently missing, may need adding).
- Add `RootLayout.test.tsx` — verify providers render, outlet renders children.
- Add `PageLayout.test.tsx` — verify title prop renders, back link works.
- Verify all 9 existing tests still pass with `pnpm test -- --run`.

---

## Phase 1 — Firebase Integration

**Goal**: Set up Firebase project, initialize client SDK, create Firestore helper hooks, and add the serverless admin functions.

**Complexity**: M (Medium)
**Dependencies**: Phase 0 (layout must exist for provider placement)

### New Dependencies

```bash
pnpm add firebase
```

Estimated bundle impact: Firebase modular SDK with only `firestore` and `app` modules is ~12KB gzipped (tree-shaken).

### Files to Create

| File | Purpose |
|------|---------|
| `src/lib/firebase.ts` | Firebase app initialization (client-side) |
| `src/contexts/FirebaseContext.tsx` | React context providing Firestore instance |
| `src/hooks/useFirebase.ts` | Generic Firestore CRUD helpers |
| `src/hooks/useViewCount.ts` | Page view counter (Firestore transaction) |
| `src/types/firebase.types.ts` | TypeScript types for all Firestore documents |
| `api/firebase-admin.js` | Firebase Admin SDK initialization for serverless functions |
| `firestore.rules` | Security rules file |
| `firebase.json` | Firebase project config (for deploying rules) |

### Files to Modify

| File | Changes |
|------|---------|
| `.env.example` | Add `VITE_FIREBASE_*` config variables |
| `src/layouts/RootLayout.tsx` | Wrap children in `<FirebaseProvider>` |
| `vite.config.ts` | Add `firebase` to `manualChunks` for separate vendor chunk |

### Key Implementation Details

**`src/lib/firebase.ts`:**

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

**`src/hooks/useViewCount.ts`:**

```typescript
import { doc, getDoc, runTransaction } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useViewCount(pageSlug: string) {
  // On mount: increment view count via Firestore transaction
  // Returns { total, unique } from the document
  // Uses localStorage visitor ID for unique tracking
}
```

**Code splitting**: Firebase SDK is added to `manualChunks` in `vite.config.ts`:

```typescript
if (id.includes('node_modules/firebase')) {
  return 'firebase-vendor';
}
```

This keeps Firebase out of the main bundle and loads it only when needed.

### Environment Variables

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### Testing Strategy

- `src/lib/__tests__/firebase.test.ts` — Mock `firebase/app` and `firebase/firestore`, verify initialization.
- `src/hooks/__tests__/useViewCount.test.ts` — Mock Firestore `runTransaction`, verify increment logic.
- All existing tests remain untouched (Firebase context is additive).

---

## Phase 2 — Theme System (Multi-Theme)

**Goal**: Replace the binary dark/light toggle with a multi-theme system (5 color themes × 2 modes = 10 appearances).

**Complexity**: M (Medium)
**Dependencies**: Phase 0 (layout for provider placement)

### Files to Create

| File | Purpose |
|------|---------|
| `src/contexts/ThemeContext.tsx` | Theme + dark mode unified context |
| `src/hooks/useTheme.ts` | Convenience hook |
| `src/components/ui/theme-picker.tsx` | Color theme selector UI |
| `src/types/theme.types.ts` | Theme type definitions |

### Files to Modify

| File | Changes |
|------|---------|
| `src/index.css` | Replace hardcoded hue `240` with `var(--theme-hue)`, add `[data-theme]` rules |
| `src/hooks/useDarkMode.ts` | Deprecate (logic moves into `ThemeContext`) |
| `src/components/Header.tsx` | Replace `useDarkMode()` with `useTheme()`, add `ThemePicker` |
| `src/components/CommandPalette.tsx` | Replace `useDarkMode()` with `useTheme()`, add theme commands |
| `src/layouts/RootLayout.tsx` | Wrap in `<ThemeProvider>` |
| `src/App.tsx` | Remove direct `useDarkMode` usage if any |

### Key Implementation Details

**CSS strategy** — Instead of duplicating the entire primary scale 5 times, we use oklch's hue channel with a CSS variable:

```css
/* src/index.css — theme variable */
:root {
  --theme-hue: 240; /* default blue */
}

[data-theme="rose"]    { --theme-hue: 350; }
[data-theme="emerald"] { --theme-hue: 160; }
[data-theme="amber"]   { --theme-hue: 45;  }
[data-theme="violet"]  { --theme-hue: 280; }
```

The `@theme` block in `index.css` already uses oklch — we just replace the literal `240` with `var(--theme-hue)`. If Tailwind v4's `@theme` doesn't support `var()` in static analysis, we fall back to defining the full color scale per theme in `@layer base`, which is slightly more CSS but equally functional.

**Fallback approach (if `@theme` + `var()` doesn't work):**

```css
@layer base {
  :root {
    --color-primary-500: oklch(0.57 0.24 240);
    /* ...full scale */
  }
  [data-theme="rose"] {
    --color-primary-500: oklch(0.57 0.24 350);
    /* ...full scale */
  }
}
```

**ThemeContext migration** — The `useDarkMode` hook currently:
1. Reads/writes `localStorage('darkMode')`
2. Toggles `dark` class on `<html>`

The new `ThemeContext` does the same plus:
1. Reads/writes `localStorage('theme')` for color theme
2. Sets `data-theme` attribute on `<html>`
3. Exposes both `{ theme, setTheme, isDark, toggleDarkMode }`

All 4 consumers of `useDarkMode` (`Header.tsx`, `CommandPalette.tsx`, and any others) switch to `useTheme()`.

### Testing Strategy

- `src/contexts/__tests__/ThemeContext.test.tsx` — Verify theme persistence, dark mode toggle, CSS class/attribute setting.
- Update `Header.test.tsx` mock from `useDarkMode` to `useTheme`.
- Update `CommandPalette.test.tsx` mock similarly.
- Visual regression: manual check that all 5 themes × 2 modes render correctly.

---

## Phase 3 — i18n Support

**Goal**: Add English + Indonesian language support for all UI strings.

**Complexity**: M (Medium)
**Dependencies**: Phase 0 (layout for provider), Phase 2 (theme picker label translations)

### New Dependencies

```bash
pnpm add i18next react-i18next
```

### Files to Create

| File | Purpose |
|------|---------|
| `src/i18n/config.ts` | i18next initialization |
| `src/i18n/locales/en.json` | English translations |
| `src/i18n/locales/id.json` | Indonesian translations |
| `src/components/ui/language-picker.tsx` | Language selector dropdown |

### Files to Modify

| File | Changes |
|------|---------|
| `src/main.tsx` | Import `./i18n/config` (side-effect) |
| `src/components/Header.tsx` | Add `LanguagePicker`, use `t()` for nav labels |
| `src/components/About.tsx` | Use `t()` for section title and static text |
| `src/components/Resume.tsx` | Use `t()` for section titles |
| `src/components/Portfolio.tsx` | Use `t()` for section title, filter labels |
| `src/components/Contact.tsx` | Use `t()` for form labels, placeholders, section title |
| `src/components/Footer.tsx` | Use `t()` for footer text |
| `src/components/CommandPalette.tsx` | Use `t()` for command labels, add language toggle command |
| `src/layouts/PageLayout.tsx` | Use `t()` for breadcrumb "Home" label |
| `index.html` | Set `lang` attribute dynamically (or via `useEffect`) |

### Key Implementation Details

**`src/i18n/config.ts`:**

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import id from './locales/id.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    id: { translation: id },
  },
  lng: localStorage.getItem('language') || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
```

**Translation scope**: Only UI chrome is translated. Resume content from `resumeData.json` (bio, job descriptions, project details) stays in English. This avoids the complexity of maintaining parallel resume data files and reflects that the resume content is authored in English.

**What gets translated** (~150 keys):
- Navigation labels (Home, About, Resume, Works, Contact, Dashboard, Guestbook, etc.)
- Section titles ("About Me", "My Resume", "Selected Works", "Get In Touch")
- Button text ("Let's Connect", "Explore My Work", "Download Resume", "Send Message")
- Form labels and placeholders
- Error messages and loading states
- Theme names ("Blue", "Rose", "Emerald", "Amber", "Violet")
- New page content (Guestbook instructions, Dashboard labels, etc.)

### Testing Strategy

- `src/i18n/__tests__/config.test.ts` — Verify both locales load, fallback works.
- Update all existing component tests to either mock `react-i18next` or wrap in `I18nextProvider`.
- Add a simple mock: `vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key, i18n: { changeLanguage: vi.fn() } }) }))`.
- This mock pattern ensures all existing tests pass without needing actual translations.

---

## Phase 4 — Dashboard Page

**Goal**: Add a `/dashboard` page showing GitHub activity, WakaTime coding stats, and typing speed stats.

**Complexity**: L (Large)
**Dependencies**: Phase 0 (routing), Phase 1 (Firebase for view count), Phase 3 (i18n for labels)

### Files to Create

| File | Purpose |
|------|---------|
| `src/pages/DashboardPage.tsx` | Main dashboard page component |
| `src/components/dashboard/GitHubContributions.tsx` | GitHub contribution graph widget |
| `src/components/dashboard/WakaTimeStats.tsx` | WakaTime coding activity widget |
| `src/components/dashboard/TypingStats.tsx` | Typing speed/stats widget |
| `src/components/dashboard/CodingActivity.tsx` | Weekly coding hours chart |
| `src/components/dashboard/TopLanguages.tsx` | Language breakdown donut chart |
| `src/hooks/useWakaTime.ts` | WakaTime API integration hook |

### Files to Modify

| File | Changes |
|------|---------|
| `src/main.tsx` | Add `/dashboard` route |
| `src/config/navigation.ts` | Dashboard entry already defined in Phase 0 |
| `.env.example` | Add `VITE_WAKATIME_API_KEY` |

### Key Implementation Details

**Data sources:**

1. **GitHub Activity** — Reuse existing `useGitHubActivity` hook. Enhance it with the GitHub GraphQL API for contribution calendar data (the current REST API doesn't expose this).

2. **WakaTime** — Public API endpoint `https://wakatime.com/api/v1/users/{user}/stats/last_7_days`. Requires API key passed via environment variable. If no API key configured, the widget shows a graceful "Not configured" state.

3. **Typing Stats** — Static data from `resumeData.json` (or a new section), or an embedded MonkeyType/TypeRacer widget. Simplest approach: display self-reported stats with a link to the typing test profile.

**Layout**: Uses `PageLayout` wrapper. Content is a responsive grid of card widgets using the existing `card` CSS class and shadcn `Card` component.

**Charts**: Reuses `recharts` (already in dependencies) for the coding activity bar chart and language donut chart. The charts chunk is already code-split in `vite.config.ts`.

**Lazy loading**: `DashboardPage` is lazy-imported in `main.tsx`:

```tsx
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
```

### Testing Strategy

- `src/pages/__tests__/DashboardPage.test.tsx` — Mock all data hooks, verify widgets render.
- `src/hooks/__tests__/useWakaTime.test.ts` — Mock fetch, verify data transformation.
- `src/components/dashboard/__tests__/GitHubContributions.test.tsx` — Snapshot test.

---

## Phase 5 — Guestbook & Emoji Reactions

**Goal**: Add a real-time guestbook page and per-page emoji reactions.

**Complexity**: L (Large)
**Dependencies**: Phase 1 (Firebase), Phase 0 (routing), Phase 3 (i18n)

### Files to Create

| File | Purpose |
|------|---------|
| `src/pages/GuestbookPage.tsx` | Guestbook page with message list + form |
| `src/components/guestbook/GuestbookMessage.tsx` | Single message card |
| `src/components/guestbook/GuestbookForm.tsx` | Message submission form |
| `src/components/ui/emoji-reactions.tsx` | Reusable emoji reaction bar |
| `src/hooks/useGuestbook.ts` | Real-time Firestore listener for guestbook |
| `src/hooks/useReactions.ts` | Emoji reaction state + Firestore sync |
| `api/guestbook-moderate.js` | Serverless function for admin moderation |

### Files to Modify

| File | Changes |
|------|---------|
| `src/main.tsx` | Add `/guestbook` route |
| `src/App.tsx` | Add `EmojiReactions` component to the home page footer area |
| `src/layouts/PageLayout.tsx` | Add optional `EmojiReactions` slot |

### Key Implementation Details

**Guestbook real-time listener:**

```typescript
export function useGuestbook() {
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'guestbook'),
      where('approved', '==', true),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, []);

  return { messages, addMessage, loading, error };
}
```

**Emoji reactions component:**

Available emojis: `['🔥', '❤️', '👍', '🎉', '🚀', '👀']`

The `EmojiReactions` component:
1. Reads totals from `reactions/{pageSlug}` document.
2. Reads current user's selections from `reactions/{pageSlug}/userReactions/{visitorId}`.
3. On click: runs a Firestore transaction to increment/decrement the total and update the user's selection.
4. Visitor ID is a UUID stored in `localStorage` — no auth needed.

**Rate limiting for guestbook:**
- Client-side: disable form for 30 seconds after submission.
- Server-side: the `api/guestbook-moderate.js` function can query by IP/timestamp for abuse detection.
- New messages are created with `approved: false` by default. An admin endpoint approves them (or auto-approve can be enabled).

### Testing Strategy

- `src/hooks/__tests__/useGuestbook.test.ts` — Mock Firestore `onSnapshot`, verify message list updates.
- `src/hooks/__tests__/useReactions.test.ts` — Mock Firestore `runTransaction`, verify toggle logic.
- `src/pages/__tests__/GuestbookPage.test.tsx` — Render test with mock data.
- `src/components/ui/__tests__/emoji-reactions.test.tsx` — Click handling, selected state.

---

## Phase 6 — Content Pages (Achievements, Uses, Changelog, Links)

**Goal**: Add four static/semi-static content pages.

**Complexity**: M (Medium)
**Dependencies**: Phase 0 (routing), Phase 1 (Firebase for achievements/changelog data), Phase 3 (i18n)

### Files to Create

| File | Purpose |
|------|---------|
| `src/pages/AchievementsPage.tsx` | Certificates & badges gallery |
| `src/pages/UsesPage.tsx` | Tools, hardware, software setup |
| `src/pages/ChangelogPage.tsx` | Site version history |
| `src/pages/LinksPage.tsx` | Link-in-bio page |
| `src/components/achievements/AchievementCard.tsx` | Single achievement display card |
| `src/components/changelog/ChangelogEntry.tsx` | Single changelog version entry |
| `src/components/links/LinkCard.tsx` | Single link card with icon |
| `public/data/uses.json` | Uses/setup data (static JSON, like resumeData.json) |
| `public/data/links.json` | Links page data (static JSON) |

### Files to Modify

| File | Changes |
|------|---------|
| `src/main.tsx` | Add 4 new routes |
| `src/i18n/locales/en.json` | Add page-specific translation keys |
| `src/i18n/locales/id.json` | Add Indonesian translations |

### Key Implementation Details

**Achievements page:**
- Data comes from Firestore `achievements` collection (populated via admin).
- Grid layout using shadcn `Card` components.
- Categories: Certifications, Awards, Badges — filterable via tabs.
- Each card shows: image, title, issuer, date, verification link.

**Uses page:**
- Static data from `public/data/uses.json`.
- Sections: Editor & Terminal, Development Tools, Hardware, Software, Browser Extensions.
- Each item: name, description, optional link, optional image.
- Design: grouped list with section headings, similar to popular /uses pages.

**Changelog page:**
- Data from Firestore `changelog` collection.
- Entries sorted by date descending.
- Each entry: version badge, title, date, description, change list.
- Visual timeline design using CSS `border-left` with dots.

**Links page:**
- Static data from `public/data/links.json`.
- Centered card layout (link-in-bio style).
- Profile photo at top, followed by link cards.
- Each card: icon, label, URL — with hover animation using existing `motion` patterns.
- Useful for sharing a single URL that links to all profiles/pages.

### Testing Strategy

- One test file per page (`AchievementsPage.test.tsx`, etc.) — render tests with mock data.
- `UsesPage.test.tsx` — Mock `fetch('/data/uses.json')`, verify sections render.
- `LinksPage.test.tsx` — Mock `fetch('/data/links.json')`, verify links render.

---

## Phase 7 — Dynamic OG Images & Polish

**Goal**: Add dynamic OG image generation, final polish, performance optimization, and comprehensive testing.

**Complexity**: M (Medium)
**Dependencies**: All previous phases (this is the final polish phase)

### New Dependencies

```bash
pnpm add -D @vercel/og
```

(Dev dependency — only used in serverless functions, not bundled into the client.)

### Files to Create

| File | Purpose |
|------|---------|
| `api/og.ts` | Edge function for dynamic OG image generation |
| `src/components/SEOHead.tsx` | Reusable SEO component with dynamic OG tags |

### Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Replace inline `<Helmet>` JSON-LD with `<SEOHead>` |
| `src/pages/DashboardPage.tsx` | Add `<SEOHead>` with page-specific OG |
| `src/pages/GuestbookPage.tsx` | Add `<SEOHead>` |
| `src/pages/AchievementsPage.tsx` | Add `<SEOHead>` |
| `src/pages/UsesPage.tsx` | Add `<SEOHead>` |
| `src/pages/ChangelogPage.tsx` | Add `<SEOHead>` |
| `src/pages/LinksPage.tsx` | Add `<SEOHead>` |
| `vercel.json` | Update sitemap/robots if needed |
| `public/sitemap.xml` | Add new page URLs |
| `public/robots.txt` | Ensure new routes are crawlable |

### Key Implementation Details

**`api/og.ts`:**

```typescript
import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const title = url.searchParams.get('title') || 'Ferry Hinardi';
  const description = url.searchParams.get('description') || 'Software Engineer';
  const theme = url.searchParams.get('theme') || 'default';

  // Load custom font (optional)
  const fontData = await fetch(
    new URL('../../public/fonts/Inter-Bold.woff', import.meta.url)
  ).then(res => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
          padding: '60px',
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, color: '#fff' }}>{title}</div>
        <div style={{ fontSize: 28, color: '#94a3b8', marginTop: 16 }}>{description}</div>
        <div style={{
          fontSize: 20,
          color: '#22d3ee',
          marginTop: 40,
          padding: '8px 20px',
          border: '2px solid #22d3ee30',
          borderRadius: 8,
        }}>
          ferryhinardi.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'Inter', data: fontData, weight: 700 }],
    }
  );
}
```

**`src/components/SEOHead.tsx`:**

```tsx
interface SEOHeadProps {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
}

export function SEOHead({ title, description, path, type = 'website' }: SEOHeadProps) {
  const fullTitle = path === '/' ? title : `${title} | Ferry Hinardi`;
  const url = `https://ferryhinardi.com${path}`;
  const ogImage = `https://ferryhinardi.com/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
```

### Polish Tasks

1. **Sitemap update** — Add all new routes to `public/sitemap.xml`.
2. **PWA manifest update** — Add shortcuts for new pages in `vite.config.ts` PWA manifest.
3. **Performance audit** — Run Lighthouse on all pages, ensure > 90 score.
4. **Bundle analysis** — Run `pnpm build` and verify total < 220KB.
5. **Accessibility audit** — Ensure all new pages meet WCAG 2.1 AA.
6. **Command palette** — Verify all new pages are navigable via Cmd+K.
7. **Print styles** — Ensure new pages have reasonable print output.

### Testing Strategy

- `api/__tests__/og.test.ts` — Verify edge function returns `ImageResponse` with correct headers.
- `src/components/__tests__/SEOHead.test.tsx` — Verify meta tags render correctly.
- End-to-end: manually verify OG images render on social media preview tools (e.g., opengraph.xyz).
- Full test suite: `pnpm test -- --run` must pass with all tests from all phases.

---

## Dependency Graph

```
Phase 0: Routing & Layout Foundation
  │
  ├──→ Phase 1: Firebase Integration
  │       │
  │       ├──→ Phase 4: Dashboard Page (needs Firebase for view counts)
  │       │
  │       ├──→ Phase 5: Guestbook & Reactions (needs Firebase for real-time data)
  │       │
  │       └──→ Phase 6: Content Pages (needs Firebase for achievements/changelog)
  │
  ├──→ Phase 2: Theme System
  │       │
  │       └──→ Phase 3: i18n (theme names need translation)
  │               │
  │               ├──→ Phase 4: Dashboard (labels need i18n)
  │               ├──→ Phase 5: Guestbook (form labels need i18n)
  │               └──→ Phase 6: Content Pages (headings need i18n)
  │
  └──→ Phase 7: Dynamic OG & Polish (depends on all previous phases)
```

### Recommended Execution Order

```
1. Phase 0  (Routing)         — Week 1
2. Phase 1  (Firebase)        — Week 1-2  (can parallel with Phase 2)
3. Phase 2  (Themes)          — Week 1-2  (can parallel with Phase 1)
4. Phase 3  (i18n)            — Week 2-3
5. Phase 4  (Dashboard)       — Week 3-4
6. Phase 5  (Guestbook)       — Week 4-5
7. Phase 6  (Content Pages)   — Week 5-6
8. Phase 7  (OG Images)       — Week 6-7
```

Phases 1 and 2 can be developed in parallel since they don't depend on each other.

---

## Risk Mitigation

### Bundle Size

**Risk**: Firebase SDK + i18next + new page components could exceed the 220KB target.

**Mitigation**:
- Firebase is loaded in a separate `firebase-vendor` chunk (only loaded on pages that need it).
- All new pages are lazy-loaded via `React.lazy()`.
- i18next core is ~9KB gzipped — within budget.
- Monitor bundle size on every PR via the existing Lighthouse CI workflow.

### Tailwind v4 Theme Variable Compatibility

**Risk**: Tailwind v4's `@theme` directive may not support `var()` in oklch values during build-time analysis.

**Mitigation**:
- Test early in Phase 2. If `@theme` + `var()` doesn't work, fall back to defining color scales in `@layer base` per theme, which is functionally identical but slightly more verbose.
- The fallback only adds ~1KB of CSS per additional theme.

### Firebase Costs

**Risk**: Firestore reads could accumulate on a popular page.

**Mitigation**:
- View count uses a single document per page (1 read per page load).
- Guestbook loads max 50 messages per query.
- Reaction totals are a single document read per page.
- Firestore free tier allows 50K reads/day — more than sufficient for a personal portfolio.

### Existing Test Breakage

**Risk**: Provider restructuring in Phase 0 could break existing tests.

**Mitigation**:
- Phase 0 only moves providers into `RootLayout.tsx` — individual component tests mock their hooks anyway.
- Add `MemoryRouter` wrapper to any test that needs routing context.
- Run `pnpm test -- --run` as a gate at the end of every phase.

### SEO Impact

**Risk**: Moving from hash-based sections to new routes could affect existing Google indexing.

**Mitigation**:
- The home page (`/`) structure is completely unchanged — same URL, same content, same hash anchors.
- New pages are additive, so no existing URLs break.
- `sitemap.xml` is updated in Phase 7 to include new routes.
- Dynamic OG images improve social sharing appearance.

---

## Summary Table

| Phase | Name | Complexity | New Deps | Files Created | Files Modified | Est. Time |
|-------|------|------------|----------|---------------|----------------|-----------|
| 0 | Routing & Layout | M | 0 | 3 | 4 | 3-4 days |
| 1 | Firebase | M | 1 (`firebase`) | 8 | 3 | 4-5 days |
| 2 | Theme System | M | 0 | 4 | 6 | 3-4 days |
| 3 | i18n | M | 2 (`i18next`, `react-i18next`) | 4 | 10+ | 4-5 days |
| 4 | Dashboard | L | 0 | 7 | 3 | 5-7 days |
| 5 | Guestbook & Reactions | L | 0 | 7 | 3 | 5-7 days |
| 6 | Content Pages | M | 0 | 8 | 3 | 5-6 days |
| 7 | OG Images & Polish | M | 1 (`@vercel/og`) | 2 | 8+ | 4-5 days |
| **Total** | | | **4 packages** | **~43 files** | **~40 modifications** | **~6-7 weeks** |
