
## T5 — Serverless Webhook API (2026-03-31)

### Pattern: Vercel Serverless Handler
- `api/contact.ts` follows the same pattern as `api/update-resume.js`
- Export default async function handler(req: VercelRequest, res: VercelResponse)
- Use `@vercel/node` types for typed request/response
- No frameworks needed — plain Node.js fetch works in Vercel serverless functions

### Security: VITE_* vs process.env
- `import.meta.env.VITE_*` vars are inlined into client bundle at build time (visible in DevTools)
- `process.env.*` in `api/` functions stays server-side — never shipped to client
- Pattern to eliminate exposure: stop calling getWebhookConfig() from client; POST to /api/contact instead
- After change: grep -rl "SLACK_WEBHOOK|DISCORD_WEBHOOK|TELEGRAM_BOT" build/assets/ → ZERO results

### Contact Form Architecture
- Formspree remains primary submission (handles email delivery, spam protection)
- /api/contact is secondary (sends Slack/Discord/Telegram notifications after Formspree succeeds)
- This dual approach: user-visible success tied to Formspree; notification delivery is fire-and-forget

### TypeScript for api/ directory
- api/ functions compile via the root tsconfig.json (tsc picks them up)
- VercelRequest/VercelResponse types available via @vercel/node (already installed)

## T6: useFetch hook (2026-03-31)

### Hook pattern
- Generic `useFetch<T>(url, options?)` created at `src/hooks/useFetch.ts`
- Follows exact `useResumeData` pattern: `useState` triple + `useEffect` with `cancelled` flag
- `options` intentionally excluded from `useEffect` dep array — adding it causes infinite loops when callers pass inline object literals
- Non-ok responses throw `Error(\`HTTP error! status: ${res.status}\`)` before `.json()`
- Error normalization: `err instanceof Error ? err : new Error(String(err))`

### Test pattern for hooks
- Hook tests live in `src/hooks/__tests__/` (mirrors `src/components/__tests__/` structure)
- Use `renderHook` + `waitFor` from `@testing-library/react` — no need for component wrappers
- Mock `global.fetch` via `vi.spyOn(global, 'fetch')` + `vi.mocked(global.fetch).mockResolvedValueOnce(...)` in `beforeEach`/`afterEach` with `vi.restoreAllMocks()`
- Unmount cleanup test: hold a `Promise` reference externally, unmount, then resolve — verify state did NOT update (loading stays `true`, data stays `null`)
- Import style: `import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest'`

### Test counts
- Before T6: 228 tests across 9 files
- After T6: 232 tests across 10 files (+4 new in `useFetch.test.ts`)

## T7: Error Handling Refactor (`.catch(console.error)` Replacement)

**Pattern Applied:**
- Added error state (`const [error, setError] = useState<Error | null>(null)`) to all 4 page components
- Modified catch handlers to set error state with contextual messages
- Added `ErrorDisplay` component rendering in JSX when error is truthy
- Used consistent error display formatting: checks for error state before data/loading state in ternary chain

**Files Modified:**
1. `src/pages/LinksPage.tsx` - Error state + ErrorDisplay
2. `src/pages/AchievementsPage.tsx` - Error state + ErrorDisplay
3. `src/pages/ChangelogPage.tsx` - Error state + ErrorDisplay
4. `src/pages/UsesPage.tsx` - Error state + ErrorDisplay
5. `src/hooks/usePWA.ts` - Changed `.catch(console.error)` to `console.warn('PWA registration failed:', error)`

**Error Handling Strategy:**
- Page components: Use error state + ErrorDisplay component for user-facing errors
- Non-page utilities (usePWA): Use console.warn() for non-critical registration failures
- Consistent error normalization: `err instanceof Error ? err : new Error(String(err))`

**JSX Pattern (All Pages):**
```
{loading ? <Skeleton /> : error ? <ErrorDisplay /> : data ? <Content /> : <FallbackMessage />}
```

**Verification Results:**
- ✓ grep for `.catch(console.error)` returns ZERO matches
- ✓ TypeScript type check: clean, no errors
- ✓ All 232 tests pass in CI mode

**Commit:** `fix(error-handling): replace console.error swallowing with contextual handlers`

## T8: Remove `as any` Type Casts (2026-03-31)

### Problem
- `as any` casts in production code bypass TypeScript type checking
- Non-standard browser APIs (`navigator.deviceMemory`, `navigator.connection`) lack type definitions
- Casting to `any` in animation transition logic was imprecise

### Solution: TypeScript Declaration Merging

Created `src/types/navigator.d.ts` using **ambient type declarations** and **interface merging**:

```typescript
declare global {
  interface NavigatorDeviceMemory {
    deviceMemory?: number;
  }
  interface NetworkInformation extends EventTarget {
    effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
  }
  interface Navigator extends NavigatorDeviceMemory {
    connection?: NetworkInformation;
  }
}
```

**Why this works:**
- Global `declare global` block allows ambient type augmentation without importing
- Interface merging extends `Navigator` without creating a new type
- Optional properties (`?`) match browser support variance across different engines

### Files Modified

1. **`src/types/navigator.d.ts`** (new)
   - Defines `NavigatorDeviceMemory` interface with `deviceMemory?: number`
   - Defines `NetworkInformation` interface matching W3C Network Information API
   - Merges both into global `Navigator` interface

2. **`src/hooks/usePerformance.ts`** (line 18)
   - Changed: `(navigator as any).deviceMemory` → `navigator.deviceMemory`
   - TypeScript now knows the property exists and is optional

3. **`src/contexts/PerformanceContext.tsx`** (lines 77, 83, 159-164)
   - Line 77: `(navigator as any).deviceMemory` → `navigator.deviceMemory`
   - Line 83: `(navigator as any).connection` → `navigator.connection`
   - Lines 159-164: Replaced `(base as any).duration` with typed object approach:
     ```typescript
     transition: (base: object) => {
       const baseDuration = (base as {duration?: number}).duration;
       return {
         ...base,
         duration: typeof baseDuration === 'number' ? baseDuration * config.durationMultiplier : undefined,
       };
     },
     ```
     This is **more precise** than `as any` — only claims `duration` is an optional number property

### Pattern: Precise Intersection Types Over `as any`

For temporary casts where full type is unknown:
- Use: `(value as {propertyName?: Type}).propertyName`
- Avoid: `(value as any).propertyName`

This maintains type safety by explicitly declaring only the property you need.

### Verification Results
- ✓ `grep -rn 'as any' src/ --include='*.ts' --include='*.tsx' | grep -v __tests__` → 0 results in target files
- ✓ `pnpm exec tsc --noEmit` → exit 0, no errors
- ✓ `pnpm test -- --run` → all 232 tests pass
- ✓ No changes to component logic or behavior — only type safety improvements

### Commit
`fix(types): replace as-any casts with proper navigator type declarations`

## T10: useReactions and useMousePosition Hook Tests (2026-03-31)

### Firebase Mock Pattern (useReactions)
- Use `vi.mock('firebase/firestore', ...)` with captured snapshot callbacks — same pattern as useGuestbook
- Capture `onNext`/`onError` via module-level `let` variables in `mockOnSnapshot`
- `mockReturnValueOnce({db: null, isConfigured: false})` is NOT sufficient — hook renders multiple times across React's effect cycle, consuming the "once" on the initial render and then getting the default on re-renders triggered by state updates
- Use `vi.mocked(useFirebase).mockReturnValue(...)` (persistent) for "not configured" tests, then restore to default at end of test — same pattern as useGuestbook.test.ts lines 177-189
- Always `mockReset()` in `beforeEach` for setDoc/deleteDoc/getDoc, `mockClear()` for onSnapshot

### useMousePosition Testing Patterns
- Mock `framer-motion` with `async (importOriginal)` to spread original exports and override only `useReducedMotion`
- Import `useReducedMotion` after `vi.mock` to get the mocked version for `vi.mocked()` control
- Use `vi.spyOn(window, 'addEventListener')` and `vi.spyOn(window, 'removeEventListener')` — restore with `vi.restoreAllMocks()` in `afterEach`
- Filter spy calls by event name: `addEventListenerSpy.mock.calls.filter((call: unknown[]) => call[0] === 'mousemove')` — TypeScript needs explicit `unknown[]` type for strict mode
- For element-level listeners: create `document.createElement('div')` and spy on its `addEventListener`/`removeEventListener`
- `requestAnimationFrame` must be stubbed globally via `vi.stubGlobal` for mouse move tests; clean up with `vi.unstubAllGlobals()`
- `window.dispatchEvent(new MouseEvent('mousemove', {clientX, clientY}))` triggers the real handler chain
- Set `window.innerWidth`/`window.innerHeight` via `Object.defineProperty` for normalized coordinate calculations

### Test Count
- T10 added 10 useReactions tests + 8 useMousePosition tests = 18 new tests
- Total: 258 tests (was 240 after T9)

## [2026-03-31] Task: T11

### Focus Trap Implementation (Vanilla DOM)

**Pattern: `e.currentTarget` over `ref` in framer-motion mocked tests**
- framer-motion mock `({children, ...props}: any) => <div {...props}>{children}</div>` does NOT forward `ref` because React treats `ref` as a special prop, not in `...props` spread
- Using `dialogRef.current` in the keydown handler returns `null` in jsdom tests because ref is never attached
- Solution: use `e.currentTarget` inside `handleDialogKeyDown` — this is always the dialog div that received the event

**Focus Trap Handler**
- Attached as `onKeyDown` on the dialog `motion.div` (not on `window`)
- Escape: `setIsOpen(false)` + `triggerRef.current?.focus()` to return focus to trigger button
- Tab/Shift+Tab: query `e.currentTarget.querySelectorAll(focusable selector)`, filter disabled, wrap first↔last
- Selector: `'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'`

**triggerRef pattern**
- `triggerRef = useRef<HTMLButtonElement>(null)` on the trigger `<button ref={triggerRef}>`
- Works correctly in tests because it's a plain `<button>`, not a framer-motion component

**Test count**
- Before T11: 258 tests
- After T11: 261 tests (+3 new Focus Trap tests)
- CommandPalette now has 35 tests (was 32)
