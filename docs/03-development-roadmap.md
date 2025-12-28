# Development Roadmap

## Project Overview
Complete modernization of personal portfolio website from legacy Create React App to modern Vite + React 18 + Tailwind CSS + Shadcn/ui stack.

## Goals
1. **Performance**: Reduce build time from ~30s to <5s
2. **Bundle Size**: Reduce from ~500KB to <200KB
3. **Developer Experience**: Modern tooling with hot module replacement
4. **UI/UX**: Contemporary design with smooth animations
5. **Accessibility**: WCAG 2.1 AA compliance
6. **Maintainability**: TypeScript, modern React patterns

## Implementation Approach

### Strategy: Parallel Development (Recommended)
Create new Vite project alongside existing CRA project, migrate incrementally, then switch.

**Advantages:**
- No downtime for live site
- Can test thoroughly before switching
- Easy rollback if issues arise
- Compare old vs new side-by-side

**Timeline:** 2-3 weeks (part-time), 1 week (full-time)

## Phase Breakdown

### Week 1: Foundation & Migration

#### Day 1-2: Vite Setup & Core Migration
- [ ] Initialize Vite project with React + TypeScript template
- [ ] Configure vite.config.ts with aliases and build settings
- [ ] Set up project structure (components, hooks, types, utils)
- [ ] Create TypeScript types for resume data
- [ ] Install core dependencies (React 18, react-ga4)
- [ ] Migrate App component to functional component with hooks
- [ ] Create useResumeData custom hook
- [ ] Test data fetching works

**Deliverable:** Working Vite app that loads resume data

#### Day 3-4: Component Migration
- [ ] Convert Header component to TypeScript functional component
- [ ] Convert About component to TypeScript functional component
- [ ] Convert Resume component to TypeScript functional component
- [ ] Convert Portfolio component to TypeScript functional component
- [ ] Convert Testimonials component to TypeScript functional component
- [ ] Convert Contact component to TypeScript functional component
- [ ] Convert Footer component to TypeScript functional component
- [ ] Test all components render correctly

**Deliverable:** All components migrated and rendering

#### Day 5: Asset Migration & jQuery Replacement
- [ ] Move images to src/assets
- [ ] Update index.html for Vite
- [ ] Import CSS files in main.tsx
- [ ] Install react-scroll for smooth scrolling
- [ ] Install swiper for testimonials carousel
- [ ] Install @headlessui/react for modals
- [ ] Remove all jQuery dependencies
- [ ] Test navigation and interactions work

**Deliverable:** Fully functional site without jQuery

### Week 2: UI/UX Modernization

#### Day 1-2: Tailwind CSS Setup
- [ ] Install Tailwind CSS, PostCSS, Autoprefixer
- [ ] Configure tailwind.config.js with custom theme
- [ ] Install Tailwind plugins (@tailwindcss/forms, @tailwindcss/typography)
- [ ] Extract color scheme from existing CSS
- [ ] Set up custom fonts (Inter, Poppins)
- [ ] Create base styles in index.css
- [ ] Replace legacy CSS classes with Tailwind utilities (incrementally)

**Deliverable:** Tailwind configured and replacing old CSS

#### Day 3-4: Component Library Integration
- [ ] Install and configure Shadcn/ui
- [ ] Add Button component
- [ ] Add Card component
- [ ] Add Badge component
- [ ] Add Dialog component
- [ ] Add Sheet component (mobile menu)
- [ ] Add Avatar component
- [ ] Add Progress component
- [ ] Add Form components (Input, Textarea, Label)
- [ ] Add Toast component for notifications

**Deliverable:** Modern UI components in place

#### Day 5: Animation Implementation
- [ ] Install Framer Motion
- [ ] Create animation utilities (fadeIn, slideIn, stagger)
- [ ] Add scroll animations to sections
- [ ] Implement sticky header with hide/show on scroll
- [ ] Add hover effects to portfolio items
- [ ] Animate skill bars on scroll-in
- [ ] Add page load animations
- [ ] Install react-type-animation for hero typing effect

**Deliverable:** Smooth, modern animations throughout

### Week 3: Polish & Launch

#### Day 1-2: Component Redesign
- [ ] Redesign Header with sticky blur backdrop
- [ ] Redesign Hero with gradient background and typing animation
- [ ] Redesign About with two-column layout and contact cards
- [ ] Redesign Resume with timeline and card layout
- [ ] Redesign Portfolio with grid and modal
- [ ] Redesign Testimonials with Swiper carousel
- [ ] Redesign Contact form with validation
- [ ] Redesign Footer

**Deliverable:** All sections modernized

#### Day 3: Dark Mode & Accessibility
- [ ] Implement dark mode toggle
- [ ] Add dark mode styles to all components
- [ ] Add ARIA labels to interactive elements
- [ ] Ensure keyboard navigation works
- [ ] Test with screen reader
- [ ] Add focus indicators
- [ ] Check color contrast ratios
- [ ] Add alt text to all images

**Deliverable:** Accessible, dark mode ready

#### Day 4: Testing & Optimization
- [ ] Run Lighthouse audit (aim for >90 on all metrics)
- [ ] Test on mobile devices (iOS, Android)
- [ ] Test on different browsers (Chrome, Firefox, Safari, Edge)
- [ ] Optimize images (WebP format, lazy loading)
- [ ] Code split with React.lazy
- [ ] Minify CSS and JS
- [ ] Test loading states and error handling
- [ ] Fix any console warnings/errors

**Deliverable:** Optimized, tested application

#### Day 5: Deployment & Launch
- [ ] Update vercel.json for Vite
- [ ] Deploy to Vercel staging environment
- [ ] Test production build
- [ ] Update DNS if needed
- [ ] Deploy to production
- [ ] Monitor for errors
- [ ] Update README with new tech stack
- [ ] Archive old CRA codebase in git branch

**Deliverable:** Live production site

## Detailed Task Checklist

### Technical Migration Tasks

#### Vite Configuration
```bash
# Initialize
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install
npm install -D @types/node
```

#### Package Updates
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-ga4": "^2.1.0",
    "html-react-parser": "^5.1.1",
    "framer-motion": "^11.0.0",
    "swiper": "^11.0.0",
    "react-scroll": "^1.9.0",
    "@headlessui/react": "^2.0.0",
    "react-type-animation": "^3.2.0",
    "lucide-react": "^0.344.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.1.0",
    "typescript": "^5.3.3",
    "tailwindcss": "^3.4.1",
    "postcss": "^8.4.35",
    "autoprefixer": "^10.4.17",
    "@tailwindcss/forms": "^0.5.7",
    "@tailwindcss/typography": "^0.5.10"
  }
}
```

### UI/UX Tasks

#### Design System Tokens
- [ ] Define primary color palette (blue/cyan)
- [ ] Define dark mode colors
- [ ] Set typography scale (font sizes, weights)
- [ ] Define spacing scale
- [ ] Set border radius values
- [ ] Define shadow system
- [ ] Set transition timing functions

#### Component Redesign Priorities
1. **High Priority** (User-facing, high impact)
   - Header/Navigation
   - Hero Section
   - Portfolio Grid
   - Contact Form

2. **Medium Priority** (Important but less visited)
   - About Section
   - Resume/Experience
   - Testimonials

3. **Low Priority** (Nice to have)
   - Footer
   - Loading states
   - Error pages

### Content Tasks
- [ ] Update resume PDF
- [ ] Add new project screenshots
- [ ] Update social media links
- [ ] Update bio content
- [ ] Add company logos (if available)
- [ ] Optimize all images

### Documentation Tasks
- [ ] Update README.md
- [ ] Document component API
- [ ] Create contributing guide
- [ ] Add JSDoc comments to utilities
- [ ] Update WARP.md with new stack

## Risk Management

### Potential Issues & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| TypeScript errors in migration | Medium | High | Gradual migration, use `any` temporarily |
| Breaking changes in dependencies | High | Low | Lock versions, test thoroughly |
| CSS conflicts during Tailwind adoption | Medium | Medium | Use Tailwind preflight, scope old CSS |
| Animation performance issues | Medium | Low | Use CSS transforms, test on mobile |
| Build size increase | Medium | Low | Code splitting, tree shaking |
| Vercel deployment issues | High | Low | Test staging first, keep rollback ready |

### Rollback Plan
1. Keep `cra-backup` branch with working CRA version
2. Vercel allows instant rollback to previous deployment
3. DNS changes (if any) can be reverted
4. Document all breaking changes

## Success Criteria

### Performance Metrics (Lighthouse)
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 90

### Technical Metrics
- Build time: < 5 seconds
- Bundle size: < 200KB (gzipped)
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Cumulative Layout Shift: < 0.1

### Quality Metrics
- TypeScript coverage: 100%
- Console errors: 0
- Accessibility violations: 0
- Broken links: 0

### User Experience Metrics
- Mobile-friendly test: Pass
- Cross-browser compatibility: ✓
- Responsive on all breakpoints: ✓
- Smooth animations (60 FPS): ✓

## Post-Launch Tasks

### Week 1 After Launch
- [ ] Monitor analytics for traffic patterns
- [ ] Check error logs in Vercel
- [ ] Gather user feedback
- [ ] Fix any critical bugs
- [ ] Optimize based on real-world usage

### Month 1 After Launch
- [ ] Review Core Web Vitals in Search Console
- [ ] A/B test different CTAs
- [ ] Add blog section (optional)
- [ ] Integrate email newsletter (optional)
- [ ] Add contact form backend

## Long-term Roadmap (Optional Enhancements)

### Q1 2024
- [ ] Add blog with MDX support
- [ ] Implement CMS (Sanity or Contentful)
- [ ] Add project case studies
- [ ] Integrate testimonials from LinkedIn

### Q2 2024
- [ ] Add interactive code playground
- [ ] Create video introduction
- [ ] Add recommendations section
- [ ] Implement search functionality

### Q3 2024
- [ ] Multi-language support (i18n)
- [ ] Add analytics dashboard
- [ ] Create public API for resume data
- [ ] Build resume generator tool

## Resources

### Documentation
- [Vite Guide](https://vitejs.dev/guide/)
- [React 18 Docs](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Shadcn/ui Components](https://ui.shadcn.com/)
- [Framer Motion Docs](https://www.framer.com/motion/)

### Tools
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Bundle Analyzer](https://www.npmjs.com/package/rollup-plugin-visualizer)
- [Pa11y Accessibility Testing](https://pa11y.org/)
- [Vercel Analytics](https://vercel.com/analytics)

### Inspiration
- [Brittany Chiang](https://brittanychiang.com/)
- [Jack Jeznach](https://jacekjeznach.com/)
- [Lee Robinson](https://leerob.io/)
- [Josh Comeau](https://www.joshwcomeau.com/)

## Notes

### Development Environment
- Node version: >= 20.x
- Package manager: npm (Yarn or pnpm also fine)
- Editor: VS Code with extensions (ESLint, Prettier, Tailwind IntelliSense)
- Browser: Chrome with React DevTools

### Git Strategy
- Create feature branch: `git checkout -b feat/vite-migration`
- Commit frequently with descriptive messages
- Push to remote regularly
- Create PR for review before merging to main
- Tag releases: `v2.0.0` for new version

### Communication
- Update stakeholders on progress weekly
- Share staging link for feedback
- Document decisions in this file
- Keep changelog updated
