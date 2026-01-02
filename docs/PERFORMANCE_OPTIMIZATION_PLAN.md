# Performance Optimization Plan

## Current Bundle Analysis

### Bundle Sizes (Uncompressed)
```
Portfolio component: 580 KB  ⚠️ LARGE
Charts (recharts):   390 KB  ⚠️ LARGE
Main bundle:         173 KB  ✅ OK
UI vendor:           140 KB  ✅ OK
React vendor:        136 KB  ✅ OK
About component:      37 KB  ✅ OK
Radix vendor:         35 KB  ✅ OK
Contact component:    25 KB  ✅ OK
```

### Total: ~1.5 MB uncompressed, ~280 KB gzipped

---

## Identified Issues

### 1. **Recharts Library (390 KB)** 🔴
**Impact:** HIGH
- Used in `skills-radar.tsx` and `project-metrics.tsx`
- Importing multiple chart types increases bundle size
- Already lazy loaded in Resume, but not in Portfolio

**Solution:**
- ✅ Already lazy loaded SkillsRadar in Resume component
- Consider removing project-metrics or making it optional
- Alternative: Use lightweight chart library (e.g., Chart.js mini, or CSS-only charts)

### 2. **Portfolio Component (580 KB)** 🟡
**Impact:** MEDIUM  
- Contains detailed modal with all project information
- Large inline styles and conditional rendering
- Already lazy loaded in App.tsx ✅

**Potential Optimizations:**
- Split modal into separate lazy-loaded component
- Remove unused lucide-react icons
- Optimize image loading

### 3. **Image Optimization** 🟡
**Current:**
- Using WebP format ✅
- Responsive images with srcset ✅
- Lazy loading implemented ✅

**Improvements:**
- Add blur placeholders for better perceived performance
- Implement progressive image loading

---

## Quick Wins (Implement Now)

### 1. Further Code Splitting ⚡
Split Portfolio modal into separate component:
```tsx
// Create src/components/Portfolio/ProjectModal.tsx
const ProjectModal = lazy(() => import('./ProjectModal'));
```

### 2. Remove Unused Dependencies 🗑️
Check for unused imports and dependencies:
```bash
npx depcheck
```

### 3. Optimize Framer Motion 📦
Use specific imports instead of importing everything:
```tsx
// ❌ Don't
import { motion, AnimatePresence, ... } from 'framer-motion';

// ✅ Do
import { motion } from 'framer-motion/dist/es/render/dom/motion';
import { AnimatePresence } from 'framer-motion/dist/es/components/AnimatePresence';
```

### 4. Tree Shaking Check 🌳
Ensure Vite is properly tree-shaking:
```ts
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
        'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        'charts': ['recharts']
      }
    }
  }
}
```

---

## Core Web Vitals Optimization

### Current Status (Need to Test):
- **LCP (Largest Contentful Paint):** Target < 2.5s
- **FID (First Input Delay):** Target < 100ms  
- **CLS (Cumulative Layout Shift):** Target < 0.1

### Improvements:

#### 1. Preload Critical Resources ✅ (Already Done)
```html
<link rel="preload" href="/images/profilepic-mobile.webp" as="image" />
```

#### 2. Font Display Strategy
```css
@font-face {
  font-family: 'Open Sans';
  font-display: swap; /* Prevent FOIT */
}
```

#### 3. Resource Hints ✅ (Already Done)
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="dns-prefetch" href="https://www.google-analytics.com" />
```

#### 4. Reduce Layout Shift
- Add explicit width/height to images ✅ (Already done)
- Reserve space for dynamic content
- Avoid inserting content above existing content

---

## Long-term Optimizations

### 1. Consider Chart Alternatives
**Option A:** Remove Charts Entirely
- Charts are nice-to-have, not essential
- Save 390 KB immediately
- Use CSS progress bars instead

**Option B:** Lightweight Chart Library
```bash
npm install chart.js react-chartjs-2 --save
# ~60 KB vs 390 KB for recharts
```

**Option C:** CSS-Only Charts
- Pure CSS progress bars
- Simple bar charts with divs
- No JS overhead

### 2. Image CDN
```tsx
// Use Vercel Image Optimization API
<Image
  src="/images/profilepic.jpg"
  width={400}
  height={400}
  quality={85}
  format="webp"
/>
```

### 3. Service Worker Improvements
- Implement stale-while-revalidate for images
- Cache API responses
- Offline support

### 4. HTTP/2 Server Push
- Push critical CSS and JS
- Already handled by Vercel ✅

---

## Recommended Action Plan

### Phase 1: Quick Wins (Today - 1 hour)
1. ✅ Analyze bundle sizes (Done)
2. ⏳ Remove unused dependencies
3. ⏳ Optimize Framer Motion imports
4. ⏳ Add manual chunks configuration

### Phase 2: Component Optimization (1-2 hours)
1. ⏳ Split Portfolio modal into separate component
2. ⏳ Optimize lucide-react imports (use tree-shakeable version)
3. ⏳ Add image placeholders

### Phase 3: Testing (30 minutes)
1. ⏳ Run Lighthouse audit
2. ⏳ Test Core Web Vitals
3. ⏳ Verify bundle size reduction
4. ⏳ Check loading performance on slow 3G

### Phase 4: Consider Chart Removal (Optional)
1. ⏳ Evaluate if charts add value
2. ⏳ Consider removing project-metrics component
3. ⏳ Use simpler visualizations

---

## Expected Improvements

| Metric | Before | Target | Method |
|--------|--------|--------|--------|
| **Bundle Size** | 280 KB gzipped | 200 KB | Code splitting, tree shaking |
| **LCP** | TBD | < 2.5s | Image optimization, preload |
| **FID** | TBD | < 100ms | Code splitting, less JS |
| **CLS** | TBD | < 0.1 | Fixed dimensions, placeholders |
| **Lighthouse** | ~90 | 95+ | All optimizations |

---

## Decision: Remove Charts?

### Pros of Keeping Charts:
- Visual appeal
- Shows technical capabilities
- Engaging for technical audience

### Cons of Keeping Charts:
- 390 KB additional bundle size
- Slower initial load
- Not essential to portfolio

### Recommendation:
**Make charts optional/lazy-loaded only when user navigates to "Analytics" section**

If charts are rarely viewed, the bundle size impact isn't worth it for all users.

---

**Next Steps:** 
1. Implement Phase 1 optimizations
2. Run Lighthouse audit
3. Document improvements
