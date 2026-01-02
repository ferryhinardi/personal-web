# Quick Reference - Personal Portfolio Website

**Project:** Ferry Hinardi's Portfolio  
**URL:** https://ferryhinardi.com  
**Status:** ✅ Live in Production

---

## 🚀 Quick Stats (As of Jan 2, 2026)

| Metric | Value | Status |
|--------|-------|--------|
| **Main Bundle** | 153 KB gzipped | ✅ Optimized (-45%) |
| **Build Time** | 11.23s | ✅ Fast (-38%) |
| **Packages** | 1,081 | ✅ Clean (-95) |
| **SEO Score** | 100 | ✅ Optimized |
| **Performance** | Expected 92-96 | ⏳ Validate manually |

---

## 📁 Project Structure

```
/Users/ferryhinardi/Project/personal-web/
├── src/
│   ├── components/           # React components
│   │   ├── Portfolio/        # Portfolio with modal
│   │   └── ui/               # Shadcn UI components
│   ├── pages/                # Route pages
│   │   ├── AdminDashboard.tsx (lazy loaded)
│   │   └── PrintResume.tsx
│   ├── hooks/                # Custom hooks
│   ├── utils/                # Utilities
│   └── main.tsx              # Entry point
├── public/                   # Static assets
├── docs/                     # Documentation
└── build/                    # Production build output
```

---

## 🎯 Key Technologies

- **React 18.3+** - UI library
- **TypeScript 5.x** - Type safety
- **Vite 6.4.1** - Build tool
- **Tailwind CSS v4** - Styling
- **Vercel** - Hosting (auto-deploys from master)
- **pnpm** - Package manager (NOT npm/yarn)

---

## ⚡ Common Commands

### Development
```bash
pnpm run dev         # Start dev server (localhost:3000)
pnpm run build       # Production build
pnpm run preview     # Preview production (localhost:4173)
pnpm run test        # Run tests
```

### Deployment
```bash
git add -A
git commit -m "message"
git push origin master   # Auto-deploys to Vercel
```

### Package Management (Use pnpm!)
```bash
pnpm install              # Install dependencies
pnpm add <package>        # Add dependency
pnpm remove <package>     # Remove dependency
npx depcheck              # Find unused packages
```

---

## 📊 Bundle Analysis

### Always Loaded (153 KB gzipped)
- index.js (45.24 KB) - Core app
- react-vendor.js (45.00 KB) - React libs
- ui-vendor.js (47.68 KB) - UI components
- radix-vendor.js (11.51 KB) - Radix UI
- analytics.js (3.89 KB) - Analytics

### Lazy Loaded (On Scroll)
- About.js (12.87 KB)
- Resume.js (1.69 KB)
- Portfolio.js (195.47 KB) ⚠️ Largest
- Contact.js (9.24 KB)

### On-Demand (On Click/Route)
- ProjectModal.js (2.56 KB) - "View Details" click
- AdminDashboard.js (7.45 KB) - /admin route
- charts.js (112.10 KB) - /admin route (recharts)

---

## 📝 Recent Changes

### Session 5 (Performance - Jan 2, 2026) ✅
- Reduced main bundle by 45% (280 KB → 153 KB)
- Removed 95 unused dependencies
- Lazy loaded AdminDashboard (charts isolated)
- Split Portfolio modal component
- Validated and deployed

### Session 4 (SEO - Dec 2025) ✅
- Added 4 structured data schema types
- Optimized Open Graph images
- Updated sitemap
- Comprehensive meta tags

---

## 🧪 Testing Checklist

### After Any Deployment:

**1. Build Verification**
```bash
pnpm run build
# Check bundle sizes in output
# Verify no TypeScript errors
```

**2. Local Preview**
```bash
pnpm run preview
# Test all routes: /, /print, /admin
# Check console for errors
```

**3. Production Check**
```
Visit: https://ferryhinardi.com
Check:
- Page loads quickly (<2.5s)
- All sections render
- Portfolio modal works
- /admin route accessible
```

**4. Lighthouse Audit** (Chrome DevTools)
```
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Run audit (Desktop/Mobile)
4. Target: Performance 95+, others 100
```

---

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Build config, manual chunks |
| `tsconfig.json` | TypeScript config |
| `tailwind.config.ts` | Tailwind CSS v4 config |
| `postcss.config.js` | PostCSS (Tailwind only) |
| `package.json` | Dependencies (1,081 packages) |
| `vercel.json` | Vercel deployment settings |
| `lighthouserc.json` | Lighthouse CI config |

---

## 🐛 Known Non-Critical Issues

Safe to ignore (low priority):
- PrintResume.tsx:79 - `includeMargin` deprecated
- Header/Footer - Lucide React icon imports deprecated
- Vite CJS API deprecation warning

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [SESSION_5_VALIDATION.md](./SESSION_5_VALIDATION.md) | Comprehensive validation report |
| [SESSION_5_SUMMARY.md](./SESSION_5_SUMMARY.md) | Performance optimization details |
| [SESSION_4_SUMMARY.md](./SESSION_4_SUMMARY.md) | SEO enhancement details |
| [SEO_ENHANCEMENTS_COMPLETE.md](./SEO_ENHANCEMENTS_COMPLETE.md) | SEO implementation guide |
| [PERFORMANCE_OPTIMIZATION_PLAN.md](./PERFORMANCE_OPTIMIZATION_PLAN.md) | Performance strategy |
| [FEATURES_ROADMAP.md](./FEATURES_ROADMAP.md) | Future feature plans |

---

## 🚨 Emergency Rollback

If something breaks after deployment:

```bash
# View recent commits
git log --oneline | head -5

# Rollback to last stable (Session 4)
git reset --hard 1e72ee1
git push origin master --force  # ⚠️ Use carefully

# Current stable commit: 3cfcf19 (Session 5 validated)
```

---

## 📈 Monitoring

### Vercel Analytics
- URL: https://vercel.com/dashboard
- Monitor: Page loads, bandwidth, errors

### Google Search Console
- URL: https://search.google.com/search-console
- Monitor: Core Web Vitals, SEO, indexing

### Manual Checks (Weekly)
- [ ] Site loads correctly
- [ ] No console errors
- [ ] All sections functional
- [ ] Mobile responsive

---

## 💡 Quick Tips

1. **Always use pnpm** (not npm/yarn)
2. **Test locally** before pushing to master
3. **Check bundle sizes** after adding dependencies
4. **Monitor Core Web Vitals** in Search Console
5. **Document changes** in session summaries

---

## 🎯 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Main Bundle | <200 KB | ✅ 153 KB |
| LCP | <2.5s | ⏳ Validate |
| FID/INP | <100ms | ⏳ Validate |
| CLS | <0.1 | ⏳ Validate |
| Lighthouse | 95+ | ⏳ Validate |

---

## 🔗 Quick Links

- **Live Site:** https://ferryhinardi.com
- **Repository:** GitHub (auto-deploys)
- **Vercel:** Dashboard (deployment logs)
- **Search Console:** Core Web Vitals
- **Local Dev:** http://localhost:3000
- **Local Preview:** http://localhost:4173

---

## 📞 Support

If you encounter issues:

1. Check build output for errors
2. Review recent git commits
3. Check Vercel deployment logs
4. Test locally with `pnpm run preview`
5. Review session documentation

---

**Last Updated:** January 2, 2026  
**Version:** Session 5 Complete  
**Status:** ✅ Validated and Live
