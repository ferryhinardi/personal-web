# AGENTS.md

Guidelines for AI agents working in this React + TypeScript + Vite portfolio codebase.

## Tech Stack

- **Framework:** React 18.3 with Vite 6.4
- **Language:** TypeScript 5.9 (strict mode)
- **Package Manager:** pnpm 10 (always use pnpm, never npm/yarn)
- **Styling:** Tailwind CSS 4.x + CSS3
- **Testing:** Vitest + React Testing Library
- **Deployment:** Vercel

## Build Commands

```bash
pnpm dev              # Start dev server (localhost:3000)
pnpm build            # TypeScript compile + production build
pnpm preview          # Preview production build (localhost:4173)
```

## Testing

```bash
pnpm test                    # Run tests in watch mode
pnpm test -- --run           # Run all tests once (CI mode)
pnpm test:coverage           # Run tests with coverage report
pnpm test:ui                 # Interactive Vitest UI
```

### Running Single Tests

```bash
# Run specific test file
pnpm test src/components/__tests__/Header.test.tsx

# Run tests matching a pattern
pnpm test Header

# Run single test file in CI mode (no watch)
pnpm test -- --run src/components/__tests__/About.test.tsx

# Run tests matching describe/it name
pnpm test -t "renders without crashing"
```

### Test File Location

Tests are in `src/components/__tests__/` with `.test.tsx` extension.

## Type Checking & Linting

```bash
pnpm exec tsc --noEmit       # TypeScript type checking
```

No ESLint configured. TypeScript strict mode handles linting via:
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noFallthroughCasesInSwitch: true`

## Code Style

### Prettier Configuration

```javascript
{
  bracketSpacing: false,      // {foo} not { foo }
  jsxBracketSameLine: true,   // JSX closing bracket on same line
  singleQuote: true,          // Use single quotes
  trailingComma: 'all',       // Trailing commas everywhere
}
```

### Import Order

```typescript
// 1. React imports
import {useState, useEffect} from 'react';

// 2. External libraries
import {motion} from 'framer-motion';
import {ExternalLink} from 'lucide-react';

// 3. Types (use 'type' keyword)
import type {MainData} from '@/types/resume.types';

// 4. Internal components
import {Button} from '@/components/ui/button';

// 5. Internal utilities/hooks
import {cn} from '@/lib/utils';

// 6. Styles (last)
import './App.css';
```

### Path Aliases

```typescript
import {Button} from '@/components/ui/button';      // @/* -> ./src/*
import Header from '@components/Header';             // @components/* -> ./src/components/*
import logo from '@assets/logo.png';                 // @assets/* -> ./src/assets/*
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ErrorBoundary.tsx` |
| Hooks | camelCase with `use` prefix | `useResumeData.ts` |
| Utilities | camelCase | `animations.ts` |
| Types/Interfaces | PascalCase | `MainData`, `ResumeSection` |
| Test files | `*.test.tsx` | `Header.test.tsx` |

## Component Patterns

### Functional Components with Props

```typescript
interface AboutProps {
  data?: MainData;
}

export default function About({data}: AboutProps) {
  // Early return for null/undefined data
  if (!data) return null;

  const {name, bio, email} = data;

  return (
    <section id="about" className="section-padding">
      {/* content */}
    </section>
  );
}
```

### Custom Hooks

```typescript
export function useResumeData() {
  const [data, setData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/resumeData.json')
      .then(res => res.json())
      .then(data => !cancelled && setData(data))
      .catch(err => !cancelled && setError(err))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  return {data, loading, error};
}
```

### Error Handling

- Use `ErrorBoundary` component for React error boundaries
- Use `ErrorDisplay` component for user-facing error messages
- Always handle loading/error states in components using data hooks
- Include cleanup flags in async effects to prevent state updates after unmount

## Type Definitions

Types are in `src/types/resume.types.ts`. Use type-only imports:

```typescript
import type {MainData, Portfolio} from '@/types/resume.types';
```

## Performance Guidelines

From `.github/agent/config.yml`:

| Metric | Target |
|--------|--------|
| Bundle size | < 220KB |
| Lighthouse Performance | > 90 |
| Lighthouse Accessibility | > 95 |
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |

Use lazy loading for heavy components:

```typescript
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
```

## Commit Conventions

Use conventional commits:

```
feat(components): add dark mode toggle
fix(analytics): correct GA4 tracking initialization
chore(deps): update React to 18.3.1
perf(bundle): lazy load portfolio images
docs(readme): update installation instructions
```

## CI/CD

On push/PR to `master`:
1. `pnpm test -- --run` - Tests must pass
2. `pnpm exec tsc --noEmit` - Type check must pass
3. `pnpm run build` - Build must succeed
4. Lighthouse audit (PR only) - Performance thresholds checked

## Quick Reference

```bash
# Before committing
pnpm exec tsc --noEmit && pnpm test -- --run && pnpm build

# Full local verification
pnpm dev                 # Test in browser
pnpm build && pnpm preview  # Test production build
```
