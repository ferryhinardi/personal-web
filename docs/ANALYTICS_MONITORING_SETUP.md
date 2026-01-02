# Analytics & Monitoring Setup

**Step 8 of 8** - Analytics, Error Tracking & Performance Monitoring  
**Status:** 📋 Documented  
**Last Updated:** January 2, 2026

---

## Overview

This document outlines a comprehensive analytics and monitoring strategy for Ferry Hinardi's portfolio website. The goal is to track user behavior, monitor performance, catch errors proactively, and make data-driven decisions for continuous improvement.

---

## Table of Contents

1. [Current Setup](#current-setup)
2. [Google Analytics 4 Enhancement](#google-analytics-4-enhancement)
3. [Error Tracking with Sentry](#error-tracking-with-sentry)
4. [Performance Monitoring](#performance-monitoring)
5. [User Behavior Analytics](#user-behavior-analytics)
6. [Conversion Tracking](#conversion-tracking)
7. [Real User Monitoring (RUM)](#real-user-monitoring-rum)
8. [Logging & Debugging](#logging--debugging)
9. [Alerting & Notifications](#alerting--notifications)
10. [Analytics Dashboard](#analytics-dashboard)
11. [Privacy & Compliance](#privacy--compliance)
12. [Implementation Roadmap](#implementation-roadmap)

---

## Current Setup

### ✅ Already Implemented

**Google Analytics 4:**
- Location: `src/utils/analytics.ts`
- Features:
  - Basic pageview tracking
  - Core Web Vitals tracking
  - Error tracking (basic)
  - Custom event tracking capability

**Web Vitals:**
- Location: `src/utils/webVitals.ts`
- Metrics tracked:
  - LCP (Largest Contentful Paint)
  - FID (First Input Delay)
  - CLS (Cumulative Layout Shift)
  - FCP (First Contentful Paint)
  - TTFB (Time to First Byte)

**Error Boundary:**
- Location: `src/components/ErrorBoundary.tsx`
- Basic error catching for React components

### ⚠️ What's Missing

1. **Error Tracking Service** (no Sentry or similar)
2. **Real User Monitoring** (beyond basic Web Vitals)
3. **Session Recording** (for UX insights)
4. **Conversion Funnels** (detailed tracking)
5. **A/B Testing** (for optimization)
6. **Uptime Monitoring** (server health)
7. **Security Monitoring** (attacks, bots)
8. **Advanced Analytics Dashboard**

---

## Google Analytics 4 Enhancement

### Current Implementation Review

**File:** `src/utils/analytics.ts`

Current capabilities:
```typescript
// ✅ Already implemented
- initGA(measurementId)
- trackPageView(url, title)
- trackEvent(eventName, parameters)
- trackWebVitals(metric)
- trackError(error, errorInfo)
```

### Enhancements Needed

#### 1. Enhanced Event Tracking

**Add these custom events:**

```typescript
// src/utils/analytics.ts - Enhanced version

export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

// Portfolio Events
export const trackPortfolioView = (projectName: string) => {
  trackEvent('portfolio_project_view', {
    project_name: projectName,
    event_category: 'portfolio',
    event_label: projectName,
  });
};

export const trackPortfolioFilter = (filterType: string, filterValue: string) => {
  trackEvent('portfolio_filter', {
    filter_type: filterType,
    filter_value: filterValue,
    event_category: 'portfolio',
  });
};

export const trackLiveDemoClick = (projectName: string) => {
  trackEvent('live_demo_click', {
    project_name: projectName,
    event_category: 'engagement',
    event_label: projectName,
  });
};

// Resume Events
export const trackResumeDownload = (format: string = 'pdf') => {
  trackEvent('resume_download', {
    format,
    event_category: 'resume',
    event_label: `download_${format}`,
  });
};

export const trackResumePrint = () => {
  trackEvent('resume_print', {
    event_category: 'resume',
    event_label: 'print',
  });
};

// Contact Events
export const trackContactFormStart = () => {
  trackEvent('contact_form_start', {
    event_category: 'contact',
    event_label: 'form_start',
  });
};

export const trackContactFormStep = (step: number) => {
  trackEvent('contact_form_step', {
    step_number: step,
    event_category: 'contact',
    event_label: `step_${step}`,
  });
};

export const trackContactFormSubmit = (data: {
  projectType?: string;
  budget?: string;
  timeline?: string;
}) => {
  trackEvent('contact_form_submit', {
    ...data,
    event_category: 'contact',
    event_label: 'form_submit',
  });
};

export const trackContactFormError = (errorField: string, errorMessage: string) => {
  trackEvent('contact_form_error', {
    error_field: errorField,
    error_message: errorMessage,
    event_category: 'contact',
    event_label: 'form_error',
  });
};

// Blog Events (for future blog)
export const trackBlogPostView = (postTitle: string, postSlug: string) => {
  trackEvent('blog_post_view', {
    post_title: postTitle,
    post_slug: postSlug,
    event_category: 'blog',
    event_label: postTitle,
  });
};

export const trackBlogPostRead = (postSlug: string, readPercentage: number) => {
  trackEvent('blog_post_read', {
    post_slug: postSlug,
    read_percentage: readPercentage,
    event_category: 'blog',
    event_label: `read_${readPercentage}%`,
  });
};

export const trackBlogShare = (postTitle: string, platform: string) => {
  trackEvent('blog_share', {
    post_title: postTitle,
    platform,
    event_category: 'blog',
    event_label: platform,
  });
};

// Navigation Events
export const trackNavigation = (section: string) => {
  trackEvent('navigation', {
    section,
    event_category: 'navigation',
    event_label: section,
  });
};

export const trackSmoothScroll = (targetSection: string) => {
  trackEvent('smooth_scroll', {
    target_section: targetSection,
    event_category: 'navigation',
    event_label: targetSection,
  });
};

// External Link Tracking
export const trackExternalLink = (
  destination: string,
  linkText: string,
  position: string
) => {
  trackEvent('external_link_click', {
    destination,
    link_text: linkText,
    position,
    event_category: 'external_links',
    event_label: destination,
  });
};

// GitHub Activity Tracking
export const trackGitHubActivityView = () => {
  trackEvent('github_activity_view', {
    event_category: 'engagement',
    event_label: 'github_widget',
  });
};

export const trackGitHubRepoClick = (repoName: string) => {
  trackEvent('github_repo_click', {
    repo_name: repoName,
    event_category: 'external_links',
    event_label: repoName,
  });
};

// Dark Mode Tracking
export const trackThemeToggle = (newTheme: string) => {
  trackEvent('theme_toggle', {
    new_theme: newTheme,
    event_category: 'settings',
    event_label: newTheme,
  });
};

// Performance Events
export const trackPerformanceTiming = (metric: string, value: number) => {
  trackEvent('performance_timing', {
    metric_name: metric,
    metric_value: value,
    event_category: 'performance',
    event_label: metric,
    value: Math.round(value),
  });
};

// Search Events (for blog search)
export const trackSearch = (query: string, resultsCount: number) => {
  trackEvent('search', {
    search_term: query,
    results_count: resultsCount,
    event_category: 'search',
    event_label: query,
  });
};

// Scroll Depth Tracking
export const trackScrollDepth = (depth: number) => {
  trackEvent('scroll_depth', {
    depth_percentage: depth,
    event_category: 'engagement',
    event_label: `${depth}%`,
    value: depth,
  });
};

// Time on Page Tracking
export const trackTimeOnPage = (seconds: number, pageName: string) => {
  trackEvent('time_on_page', {
    duration_seconds: seconds,
    page_name: pageName,
    event_category: 'engagement',
    event_label: pageName,
    value: seconds,
  });
};

// User Engagement Score
export const trackEngagementScore = (score: number, factors: string[]) => {
  trackEvent('engagement_score', {
    score,
    factors: factors.join(','),
    event_category: 'engagement',
    value: score,
  });
};
```

#### 2. Scroll Depth Tracking Implementation

```typescript
// src/hooks/useScrollDepth.ts
import { useEffect, useRef } from 'react';
import { trackScrollDepth } from '../utils/analytics';

export const useScrollDepth = () => {
  const depths = useRef(new Set<number>());
  const thresholds = [25, 50, 75, 90, 100];

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      thresholds.forEach(threshold => {
        if (scrollPercent >= threshold && !depths.current.has(threshold)) {
          depths.current.add(threshold);
          trackScrollDepth(threshold);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
};
```

#### 3. Time on Page Tracking

```typescript
// src/hooks/useTimeOnPage.ts
import { useEffect, useRef } from 'react';
import { trackTimeOnPage } from '../utils/analytics';

export const useTimeOnPage = (pageName: string) => {
  const startTime = useRef(Date.now());
  const reported = useRef(false);

  useEffect(() => {
    const reportTime = () => {
      if (!reported.current) {
        const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
        trackTimeOnPage(timeSpent, pageName);
        reported.current = true;
      }
    };

    // Report on page unload
    window.addEventListener('beforeunload', reportTime);

    // Also report after 30 seconds
    const timer = setTimeout(() => {
      reportTime();
    }, 30000);

    return () => {
      window.removeEventListener('beforeunload', reportTime);
      clearTimeout(timer);
      reportTime();
    };
  }, [pageName]);
};
```

#### 4. User Engagement Tracking

```typescript
// src/utils/engagementTracking.ts
interface EngagementFactors {
  pageViews: number;
  timeOnSite: number;
  scrollDepth: number;
  interactions: number;
  formStarted: boolean;
  formCompleted: boolean;
  resumeDownloaded: boolean;
  externalLinksClicked: number;
}

export class EngagementTracker {
  private factors: EngagementFactors = {
    pageViews: 0,
    timeOnSite: 0,
    scrollDepth: 0,
    interactions: 0,
    formStarted: false,
    formCompleted: false,
    resumeDownloaded: false,
    externalLinksClicked: 0,
  };

  private startTime = Date.now();

  incrementPageViews() {
    this.factors.pageViews++;
    this.calculateScore();
  }

  updateScrollDepth(depth: number) {
    this.factors.scrollDepth = Math.max(this.factors.scrollDepth, depth);
    this.calculateScore();
  }

  incrementInteractions() {
    this.factors.interactions++;
    this.calculateScore();
  }

  markFormStarted() {
    this.factors.formStarted = true;
    this.calculateScore();
  }

  markFormCompleted() {
    this.factors.formCompleted = true;
    this.calculateScore();
  }

  markResumeDownloaded() {
    this.factors.resumeDownloaded = true;
    this.calculateScore();
  }

  incrementExternalLinks() {
    this.factors.externalLinksClicked++;
    this.calculateScore();
  }

  private calculateScore() {
    const timeOnSite = Math.round((Date.now() - this.startTime) / 1000);
    this.factors.timeOnSite = timeOnSite;

    let score = 0;

    // Page views (max 20 points)
    score += Math.min(this.factors.pageViews * 5, 20);

    // Time on site (max 20 points)
    score += Math.min(timeOnSite / 30, 20);

    // Scroll depth (max 15 points)
    score += (this.factors.scrollDepth / 100) * 15;

    // Interactions (max 15 points)
    score += Math.min(this.factors.interactions * 3, 15);

    // Form started (10 points)
    if (this.factors.formStarted) score += 10;

    // Form completed (20 points - highly valuable)
    if (this.factors.formCompleted) score += 20;

    // Resume downloaded (15 points)
    if (this.factors.resumeDownloaded) score += 15;

    // External links (max 10 points)
    score += Math.min(this.factors.externalLinksClicked * 2, 10);

    const engagementFactors = Object.entries(this.factors)
      .filter(([_, value]) => value > 0 || value === true)
      .map(([key]) => key);

    // Track if significant engagement (score > 50)
    if (score > 50) {
      trackEngagementScore(Math.round(score), engagementFactors);
    }

    return score;
  }

  getScore() {
    return this.calculateScore();
  }
}

// Singleton instance
export const engagementTracker = new EngagementTracker();
```

#### 5. Google Analytics 4 Ecommerce (for future paid services)

```typescript
// src/utils/ecommerce.ts
export const trackPurchase = (data: {
  transactionId: string;
  value: number;
  currency: string;
  items: Array<{
    itemId: string;
    itemName: string;
    price: number;
    quantity: number;
  }>;
}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'purchase', {
      transaction_id: data.transactionId,
      value: data.value,
      currency: data.currency,
      items: data.items,
    });
  }
};

export const trackBeginCheckout = (items: any[]) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'begin_checkout', {
      items,
    });
  }
};

export const trackAddToCart = (item: any) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'add_to_cart', {
      items: [item],
    });
  }
};
```

---

## Error Tracking with Sentry

### Why Sentry?

**Benefits:**
- Automatic error capturing
- Source map support
- Release tracking
- User context
- Breadcrumbs (action trail)
- Performance monitoring
- Email/Slack alerts
- Free tier: 5,000 errors/month

### Implementation

**Installation:**

```bash
pnpm add @sentry/react @sentry/vite-plugin
```

**Configuration:**

```typescript
// src/utils/sentry.ts
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export const initSentry = () => {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      
      // Performance Monitoring
      integrations: [
        new BrowserTracing({
          tracePropagationTargets: ['localhost', 'ferryhinardi.com'],
        }),
      ],

      // Set tracesSampleRate to 1.0 to capture 100% of transactions
      // In production, reduce this to save quota
      tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.2,

      // Session Replay (optional, requires additional quota)
      replaysSessionSampleRate: 0.1, // 10% of sessions
      replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

      // Environment
      environment: import.meta.env.MODE,

      // Release tracking
      release: import.meta.env.VITE_APP_VERSION,

      // Ignore known errors
      ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'Non-Error promise rejection captured',
        // Add more patterns as needed
      ],

      // Before sending, add custom context
      beforeSend(event, hint) {
        // Add user info if available
        const user = getUserInfo(); // Implement this
        if (user) {
          event.user = {
            id: user.id,
            email: user.email,
          };
        }

        // Filter sensitive data
        if (event.request) {
          delete event.request.cookies;
          delete event.request.headers;
        }

        return event;
      },
    });
  }
};

// Helper to capture exceptions
export const captureException = (error: Error, context?: Record<string, any>) => {
  if (context) {
    Sentry.setContext('additional', context);
  }
  Sentry.captureException(error);
};

// Helper to capture messages
export const captureMessage = (
  message: string,
  level: Sentry.SeverityLevel = 'info',
  context?: Record<string, any>
) => {
  if (context) {
    Sentry.setContext('additional', context);
  }
  Sentry.captureMessage(message, level);
};

// Add breadcrumb for debugging
export const addBreadcrumb = (
  category: string,
  message: string,
  data?: Record<string, any>
) => {
  Sentry.addBreadcrumb({
    category,
    message,
    data,
    level: 'info',
  });
};
```

**Integrate with React:**

```tsx
// src/main.tsx
import { initSentry } from './utils/sentry';
import * as Sentry from '@sentry/react';

// Initialize Sentry first
initSentry();

// Wrap root component with Sentry profiler
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container!);

root.render(
  <React.StrictMode>
    <Sentry.ErrorBoundary 
      fallback={<ErrorFallback />}
      showDialog
    >
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);
```

**Enhanced Error Boundary:**

```tsx
// src/components/ErrorBoundary.tsx - Enhanced version
import React, { Component, ErrorInfo } from 'react';
import * as Sentry from '@sentry/react';
import { captureException } from '../utils/sentry';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to Sentry
    captureException(error, {
      errorInfo: errorInfo.componentStack,
      errorBoundary: 'AppErrorBoundary',
    });

    // Also log to Google Analytics
    trackError(error, errorInfo);

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Oops! Something went wrong
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  We're sorry for the inconvenience. The error has been reported and
                  we'll look into it.
                </p>
                {import.meta.env.DEV && this.state.error && (
                  <pre className="mt-4 text-xs text-left text-red-600 bg-red-50 p-4 rounded overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                )}
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={this.handleReset}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Try Again
                </button>
                <button
                  onClick={() => (window.location.href = '/')}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Go Home
                </button>
              </div>
              <div className="mt-4 text-center">
                <button
                  onClick={() => Sentry.showReportDialog()}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Send feedback about this error
                </button>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

**Source Maps Configuration:**

```typescript
// vite.config.ts - Add Sentry plugin
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sentryVitePlugin } from '@sentry/vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    
    // Upload source maps to Sentry (production only)
    process.env.NODE_ENV === 'production' && sentryVitePlugin({
      org: 'ferry-hinardi',
      project: 'portfolio',
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ].filter(Boolean),

  build: {
    sourcemap: true, // Generate source maps for Sentry
  },
});
```

**Environment Variables:**

```bash
# .env.production
VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id
VITE_APP_VERSION=1.0.0
SENTRY_AUTH_TOKEN=your-auth-token
```

---

## Performance Monitoring

### Real User Monitoring (RUM)

**Already tracking:**
- Core Web Vitals (LCP, FID, CLS)
- Custom performance metrics

**Enhancements needed:**

```typescript
// src/utils/performanceMonitoring.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB, Metric } from 'web-vitals';
import { trackPerformanceTiming } from './analytics';
import * as Sentry from '@sentry/react';

export const initPerformanceMonitoring = () => {
  // Core Web Vitals
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);

  // Custom metrics
  trackResourceTimings();
  trackLongTasks();
  trackNavigationTiming();
};

function sendToAnalytics(metric: Metric) {
  const { name, value, rating } = metric;

  // Send to Google Analytics
  trackPerformanceTiming(name, value);

  // Send to Sentry
  Sentry.addBreadcrumb({
    category: 'performance',
    message: `${name}: ${value}ms`,
    data: { rating },
    level: rating === 'good' ? 'info' : 'warning',
  });

  // Log poor performance
  if (rating === 'needs-improvement' || rating === 'poor') {
    Sentry.captureMessage(`Poor ${name}: ${value}ms`, 'warning');
  }
}

function trackResourceTimings() {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const resource = entry as PerformanceResourceTiming;
      
      // Track slow resources (> 1s)
      if (resource.duration > 1000) {
        trackPerformanceTiming(`resource_${resource.initiatorType}`, resource.duration);
        
        Sentry.addBreadcrumb({
          category: 'performance',
          message: `Slow resource: ${resource.name}`,
          data: {
            duration: resource.duration,
            type: resource.initiatorType,
          },
          level: 'warning',
        });
      }
    }
  });

  observer.observe({ entryTypes: ['resource'] });
}

function trackLongTasks() {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Long tasks are > 50ms
        trackPerformanceTiming('long_task', entry.duration);
        
        Sentry.addBreadcrumb({
          category: 'performance',
          message: `Long task detected: ${entry.duration}ms`,
          data: {
            startTime: entry.startTime,
            duration: entry.duration,
          },
          level: 'warning',
        });
      }
    });

    observer.observe({ entryTypes: ['longtask'] });
  }
}

function trackNavigationTiming() {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (perfData) {
        const metrics = {
          dns: perfData.domainLookupEnd - perfData.domainLookupStart,
          tcp: perfData.connectEnd - perfData.connectStart,
          ttfb: perfData.responseStart - perfData.requestStart,
          download: perfData.responseEnd - perfData.responseStart,
          domInteractive: perfData.domInteractive - perfData.fetchStart,
          domComplete: perfData.domComplete - perfData.fetchStart,
          loadComplete: perfData.loadEventEnd - perfData.fetchStart,
        };

        Object.entries(metrics).forEach(([name, value]) => {
          trackPerformanceTiming(name, value);
        });

        // Log to Sentry
        Sentry.setContext('navigation_timing', metrics);
      }
    }, 0);
  });
}

// Track component render times
export const measureComponentRender = (componentName: string) => {
  const startMark = `${componentName}-start`;
  const endMark = `${componentName}-end`;
  const measureName = `${componentName}-render`;

  performance.mark(startMark);

  return () => {
    performance.mark(endMark);
    performance.measure(measureName, startMark, endMark);

    const measure = performance.getEntriesByName(measureName)[0];
    if (measure) {
      trackPerformanceTiming(`component_${componentName}`, measure.duration);

      // Alert if component is slow (> 100ms)
      if (measure.duration > 100) {
        Sentry.captureMessage(
          `Slow component render: ${componentName} (${measure.duration}ms)`,
          'warning'
        );
      }
    }

    // Clean up
    performance.clearMarks(startMark);
    performance.clearMarks(endMark);
    performance.clearMeasures(measureName);
  };
};

// Usage in components
// const endMeasure = measureComponentRender('Portfolio');
// // ... component logic
// endMeasure();
```

### Bundle Size Monitoring

```typescript
// scripts/bundle-analyzer.ts
import { readFileSync } from 'fs';
import { join } from 'path';

const BUNDLE_SIZE_LIMIT = {
  total: 500 * 1024, // 500 KB
  js: 400 * 1024, // 400 KB
  css: 50 * 1024, // 50 KB
};

const distPath = join(process.cwd(), 'dist', 'assets');

const files = readdirSync(distPath);
let totalSize = 0;
let jsSize = 0;
let cssSize = 0;

files.forEach(file => {
  const filePath = join(distPath, file);
  const stats = statSync(filePath);
  const size = stats.size;

  totalSize += size;

  if (file.endsWith('.js')) {
    jsSize += size;
  } else if (file.endsWith('.css')) {
    cssSize += size;
  }
});

console.log('Bundle Size Report:');
console.log(`Total: ${(totalSize / 1024).toFixed(2)} KB`);
console.log(`JS: ${(jsSize / 1024).toFixed(2)} KB`);
console.log(`CSS: ${(cssSize / 1024).toFixed(2)} KB`);

// Check against limits
if (totalSize > BUNDLE_SIZE_LIMIT.total) {
  console.error(`❌ Total bundle size exceeds limit!`);
  process.exit(1);
}

if (jsSize > BUNDLE_SIZE_LIMIT.js) {
  console.error(`❌ JS bundle size exceeds limit!`);
  process.exit(1);
}

if (cssSize > BUNDLE_SIZE_LIMIT.css) {
  console.error(`❌ CSS bundle size exceeds limit!`);
  process.exit(1);
}

console.log('✅ Bundle size within limits');
```

---

## User Behavior Analytics

### Session Recording (Optional)

**Tools to consider:**
- **Hotjar** (free tier: 35 sessions/day)
- **Microsoft Clarity** (free, unlimited)
- **LogRocket** (paid, powerful)
- **FullStory** (paid, enterprise)

**Recommendation: Microsoft Clarity (Free & Unlimited)**

```html
<!-- index.html - Add Clarity -->
<script type="text/javascript">
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "YOUR_CLARITY_ID");
</script>
```

**What you get:**
- Session recordings
- Heatmaps (click, scroll, move)
- Rage clicks detection
- Dead clicks detection
- Quick backs tracking
- JavaScript errors

### Heatmap Analysis

With Microsoft Clarity or Hotjar, you can see:
- Where users click most
- How far users scroll
- Mouse movement patterns
- Rage clicks (user frustration)

**Action items from heatmap data:**
- Redesign confusing sections
- Improve CTA placement
- Remove unused features
- Optimize navigation

---

## Conversion Tracking

### Define Conversions

**Primary Conversions:**
1. Contact form submission
2. Resume download
3. Live demo click
4. Email link click

**Secondary Conversions:**
1. Portfolio project view
2. Time on site > 2 minutes
3. Scroll depth > 75%
4. Multiple page visits
5. Social media link click

### Conversion Funnels

**Contact Form Funnel:**

```
Visitors → Form View → Form Start → Step 2 → Step 3 → Submit → Success
  100%       60%          40%         30%       25%      20%      18%
```

**Track drop-off at each step:**

```typescript
// In contact form component
useEffect(() => {
  trackContactFormView();
}, []);

const handleFormStart = () => {
  trackContactFormStart();
};

const handleStepChange = (step: number) => {
  trackContactFormStep(step);
};

const handleSubmit = () => {
  trackContactFormSubmit(formData);
};
```

**Analyze in Google Analytics 4:**
- Go to Explorations → Funnel Exploration
- Define steps
- See drop-off rates
- Identify friction points

---

## Real User Monitoring (RUM)

### Custom Performance Metrics

```typescript
// src/utils/customMetrics.ts

// Time to Interactive (custom)
export const measureTimeToInteractive = () => {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-input') {
          const tti = entry.startTime;
          trackPerformanceTiming('time_to_interactive', tti);
        }
      }
    });

    observer.observe({ entryTypes: ['first-input'] });
  }
};

// First Meaningful Paint (custom approximation)
export const measureFirstMeaningfulPaint = () => {
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const fmp = perfData.domContentLoadedEventEnd - perfData.fetchStart;
    trackPerformanceTiming('first_meaningful_paint', fmp);
  });
};

// JavaScript Error Rate
export const trackErrorRate = () => {
  let errorCount = 0;
  let totalPageViews = 0;

  window.addEventListener('error', () => {
    errorCount++;
    const errorRate = (errorCount / totalPageViews) * 100;
    trackPerformanceTiming('javascript_error_rate', errorRate);
  });

  // Increment page views
  totalPageViews++;
};
```

### Device & Browser Analytics

Track specific metrics for different devices/browsers:

```typescript
// src/utils/deviceTracking.ts
export const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  
  const device = {
    type: /mobile/i.test(ua) ? 'mobile' : /tablet/i.test(ua) ? 'tablet' : 'desktop',
    os: /windows/i.test(ua) ? 'Windows' : /mac/i.test(ua) ? 'macOS' : /linux/i.test(ua) ? 'Linux' : /android/i.test(ua) ? 'Android' : /ios/i.test(ua) ? 'iOS' : 'Unknown',
    browser: /chrome/i.test(ua) ? 'Chrome' : /firefox/i.test(ua) ? 'Firefox' : /safari/i.test(ua) ? 'Safari' : /edge/i.test(ua) ? 'Edge' : 'Other',
  };

  return device;
};

export const trackDevicePerformance = () => {
  const device = getDeviceInfo();
  
  getCLS((metric) => {
    trackEvent('device_performance', {
      metric: 'CLS',
      value: metric.value,
      device_type: device.type,
      os: device.os,
      browser: device.browser,
    });
  });

  // Similar for LCP, FID, etc.
};
```

---

## Logging & Debugging

### Development Logging

```typescript
// src/utils/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  context?: string;
}

class Logger {
  private isDev = import.meta.env.DEV;
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  private log(level: LogLevel, message: string, data?: any, context?: string) {
    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      context,
    };

    this.logs.push(entry);

    // Keep only last N logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output in development
    if (this.isDev) {
      const style = {
        debug: 'color: #999',
        info: 'color: #0066ff',
        warn: 'color: #ff9900',
        error: 'color: #ff0000; font-weight: bold',
      }[level];

      console.log(
        `%c[${level.toUpperCase()}] ${context ? `[${context}] ` : ''}${message}`,
        style,
        data || ''
      );
    }

    // Send errors to Sentry in production
    if (!this.isDev && level === 'error') {
      Sentry.captureMessage(message, {
        level: 'error',
        extra: { data, context },
      });
    }
  }

  debug(message: string, data?: any, context?: string) {
    this.log('debug', message, data, context);
  }

  info(message: string, data?: any, context?: string) {
    this.log('info', message, data, context);
  }

  warn(message: string, data?: any, context?: string) {
    this.log('warn', message, data, context);
  }

  error(message: string, data?: any, context?: string) {
    this.log('error', message, data, context);
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }

  exportLogs() {
    const blob = new Blob([JSON.stringify(this.logs, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().toISOString()}.json`;
    a.click();
  }
}

export const logger = new Logger();
```

**Usage:**

```typescript
// In components
import { logger } from '../utils/logger';

logger.info('Portfolio component mounted', { projectCount: projects.length }, 'Portfolio');
logger.error('Failed to load resume data', { error: err.message }, 'Resume');
logger.warn('Slow API response', { duration: 3000 }, 'API');
```

---

## Alerting & Notifications

### Setup Alerts

**Sentry Alerts:**
- New error first seen
- Error frequency spike
- Performance regression
- Release deployment issues

**Google Analytics Alerts:**
- Traffic spike/drop (> 25%)
- Conversion rate drop (> 20%)
- High bounce rate (> 70%)
- Page load time increase (> 50%)

**Custom Alerts:**

```typescript
// src/utils/alerting.ts
interface AlertConfig {
  name: string;
  condition: () => boolean;
  action: () => void;
  cooldown: number; // minutes
}

class AlertManager {
  private alerts = new Map<string, number>();

  registerAlert(config: AlertConfig) {
    const lastTriggered = this.alerts.get(config.name) || 0;
    const now = Date.now();

    if (config.condition() && now - lastTriggered > config.cooldown * 60 * 1000) {
      config.action();
      this.alerts.set(config.name, now);
    }
  }
}

export const alertManager = new AlertManager();

// Example: Alert on high error rate
alertManager.registerAlert({
  name: 'high_error_rate',
  condition: () => {
    // Check if error rate > 5% in last 100 page views
    return false; // Implement logic
  },
  action: () => {
    Sentry.captureMessage('High error rate detected!', 'critical');
  },
  cooldown: 30, // 30 minutes
});
```

### Email Notifications

**Setup with Formspree or SendGrid:**

```typescript
// src/utils/notifications.ts
export const sendAdminNotification = async (
  subject: string,
  message: string,
  data?: any
) => {
  try {
    await fetch('https://formspree.io/f/YOUR_FORM_ID', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject,
        message,
        data: JSON.stringify(data, null, 2),
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
};

// Notify on contact form submission
export const notifyContactFormSubmission = (formData: any) => {
  sendAdminNotification(
    'New Contact Form Submission',
    `New inquiry from ${formData.name}`,
    formData
  );
};

// Notify on critical errors
export const notifyCriticalError = (error: Error, context?: any) => {
  sendAdminNotification(
    'Critical Error on Portfolio Site',
    error.message,
    { error: error.stack, context }
  );
};
```

---

## Analytics Dashboard

### Custom Dashboard Setup

**Option 1: Google Data Studio (Free)**
- Connect to Google Analytics 4
- Create custom reports
- Share with stakeholders

**Option 2: Internal Dashboard**

```tsx
// src/pages/AdminDashboard.tsx - Enhanced version
import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, Tooltip } from 'recharts';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  avgSessionDuration: number;
  bounceRate: number;
  conversionRate: number;
  topPages: Array<{ page: string; views: number }>;
  trafficSources: Array<{ source: string; percentage: number }>;
  recentEvents: Array<{ event: string; timestamp: string }>;
}

export const AnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Fetch from Google Analytics API or your backend
      const response = await fetch(`/api/analytics?range=${timeRange}`);
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading analytics...</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as any)}
          className="px-4 py-2 border rounded"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Page Views"
          value={data.pageViews.toLocaleString()}
          change="+12%"
          positive
        />
        <MetricCard
          title="Unique Visitors"
          value={data.uniqueVisitors.toLocaleString()}
          change="+8%"
          positive
        />
        <MetricCard
          title="Avg Session"
          value={`${Math.round(data.avgSessionDuration / 60)}m`}
          change="-5%"
          positive={false}
        />
        <MetricCard
          title="Conversion Rate"
          value={`${data.conversionRate.toFixed(1)}%`}
          change="+15%"
          positive
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic over time */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Traffic Trend</h3>
          <LineChart width={500} height={300} data={/* traffic data */}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="views" stroke="#0066ff" />
          </LineChart>
        </div>

        {/* Top Pages */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Top Pages</h3>
          <BarChart width={500} height={300} data={data.topPages}>
            <XAxis dataKey="page" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="views" fill="#11ABB0" />
          </BarChart>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Traffic Sources</h3>
          <PieChart width={500} height={300}>
            <Pie
              data={data.trafficSources}
              dataKey="percentage"
              nameKey="source"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#0066ff"
              label
            />
            <Tooltip />
          </PieChart>
        </div>

        {/* Recent Events */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Events</h3>
          <div className="space-y-2">
            {data.recentEvents.map((event, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{event.event}</span>
                <span className="text-gray-500">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{
  title: string;
  value: string;
  change: string;
  positive: boolean;
}> = ({ title, value, change, positive }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="text-gray-600 text-sm mb-1">{title}</div>
    <div className="text-3xl font-bold mb-2">{value}</div>
    <div className={`text-sm ${positive ? 'text-green-600' : 'text-red-600'}`}>
      {change} vs last period
    </div>
  </div>
);
```

---

## Privacy & Compliance

### GDPR Compliance

**Requirements:**
1. Cookie consent banner
2. Privacy policy
3. Data processing agreement
4. Right to be forgotten
5. Data export capability

**Implementation:**

```tsx
// src/components/CookieConsent.tsx
import React, { useState, useEffect } from 'react';

export const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShowBanner(true);
    } else {
      // Initialize analytics only if consented
      if (consent === 'accepted') {
        initGA(import.meta.env.VITE_GA_MEASUREMENT_ID);
        initSentry();
      }
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setShowBanner(false);
    
    // Initialize analytics
    initGA(import.meta.env.VITE_GA_MEASUREMENT_ID);
    initSentry();
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm">
            We use cookies to analyze site traffic and improve your experience. 
            By clicking "Accept", you consent to our use of cookies.{' '}
            <a href="/privacy" className="underline">
              Learn more
            </a>
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDecline}
            className="px-4 py-2 border border-white rounded hover:bg-gray-800"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};
```

**Privacy Policy Page:**

```tsx
// src/pages/Privacy.tsx
export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Data We Collect</h2>
        <p className="mb-4">
          We collect the following types of data:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Usage data (pages visited, time spent, interactions)</li>
          <li>Device information (browser, OS, screen size)</li>
          <li>Performance metrics (page load time, errors)</li>
          <li>Contact form submissions (name, email, message)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">How We Use Your Data</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>To improve website performance and user experience</li>
          <li>To respond to contact inquiries</li>
          <li>To analyze traffic and usage patterns</li>
          <li>To fix bugs and technical issues</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
        <p className="mb-4">We use the following third-party services:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Google Analytics - for web analytics</li>
          <li>Sentry - for error tracking</li>
          <li>Formspree - for contact form submissions</li>
          <li>Microsoft Clarity - for session recording (optional)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
        <p className="mb-4">You have the right to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Access your personal data</li>
          <li>Request data deletion</li>
          <li>Opt out of analytics</li>
          <li>Export your data</li>
        </ul>
        <p className="mt-4">
          To exercise these rights, contact us at:{' '}
          <a href="mailto:privacy@ferryhinardi.com" className="text-blue-600 underline">
            privacy@ferryhinardi.com
          </a>
        </p>
      </section>
    </div>
  );
};
```

---

## Implementation Roadmap

### Phase 1: Essential Monitoring (Week 1-2)

- [ ] **Day 1-3: Sentry Setup**
  - Create Sentry account
  - Install Sentry SDK
  - Configure error tracking
  - Setup source maps
  - Test error capturing

- [ ] **Day 4-5: Enhanced GA4**
  - Implement custom events
  - Add scroll depth tracking
  - Setup conversion tracking
  - Create custom dimensions

- [ ] **Day 6-7: Performance Monitoring**
  - Enhance Web Vitals tracking
  - Add resource timing
  - Track long tasks
  - Monitor component renders

### Phase 2: User Behavior (Week 3-4)

- [ ] **Day 8-10: Session Recording**
  - Setup Microsoft Clarity
  - Configure heatmaps
  - Test session recordings
  - Analyze initial data

- [ ] **Day 11-12: Engagement Tracking**
  - Implement engagement score
  - Track time on page
  - Monitor user flows
  - Setup funnel analysis

- [ ] **Day 13-14: Cookie Consent**
  - Create consent banner
  - Add privacy policy page
  - Implement consent logic
  - GDPR compliance check

### Phase 3: Advanced Analytics (Week 5-6)

- [ ] **Day 15-18: Analytics Dashboard**
  - Build dashboard UI
  - Connect to GA4 API
  - Create visualizations
  - Add real-time data

- [ ] **Day 19-21: Alerting System**
  - Setup Sentry alerts
  - Configure GA4 alerts
  - Create custom alerts
  - Test notifications

### Phase 4: Optimization (Ongoing)

- [ ] **Weekly: Review & Iterate**
  - Analyze analytics data
  - Identify improvement areas
  - A/B test changes
  - Monitor impact

---

## Success Metrics

### Key Performance Indicators (KPIs)

**Traffic:**
- Monthly page views: Target 1,000+
- Unique visitors: Target 500+
- Avg session duration: Target > 3 minutes
- Bounce rate: Target < 40%

**Engagement:**
- Scroll depth 75%+: Target > 40% of visitors
- Time on page > 2min: Target > 30%
- Multiple page visits: Target > 25%

**Conversions:**
- Contact form submissions: Target 5+ per month
- Resume downloads: Target 10+ per month
- Live demo clicks: Target 20+ per month

**Technical:**
- Error rate: Target < 0.5%
- LCP: Target < 2.5s
- Lighthouse Performance: Target > 90

**Business:**
- Job inquiries: Track quantity & quality
- Freelance leads: Track conversion rate
- Social media growth: Track follower increase

---

## Monitoring Checklist

### Daily
- [ ] Check Sentry for new errors
- [ ] Review traffic in Google Analytics
- [ ] Monitor site uptime (Vercel)
- [ ] Check contact form submissions

### Weekly
- [ ] Review performance metrics
- [ ] Analyze user behavior patterns
- [ ] Check conversion rates
- [ ] Review heatmaps/session recordings
- [ ] Monitor bundle size

### Monthly
- [ ] Full analytics review
- [ ] Compare to previous month
- [ ] Identify trends and patterns
- [ ] Review and adjust strategy
- [ ] Create monthly report

---

## Tools & Budget

### Free Tools

- **Google Analytics 4** - Web analytics
- **Google Search Console** - SEO monitoring
- **Sentry** (free tier) - Error tracking (5K errors/month)
- **Microsoft Clarity** - Session recording (unlimited)
- **Vercel Analytics** - Basic performance monitoring
- **Lighthouse** - Performance auditing

**Total: $0/month**

### Optional Paid Tools

- **Sentry Pro** ($26/mo) - 50K errors, better features
- **LogRocket** ($99/mo) - Advanced session replay
- **Datadog RUM** ($31/mo) - Real user monitoring
- **PagerDuty** ($19/mo) - Advanced alerting

---

## Next Steps

1. **Review this plan** and prioritize features
2. **Setup Sentry** (highest priority for error tracking)
3. **Enhance GA4** with custom events
4. **Add cookie consent** (GDPR compliance)
5. **Setup Microsoft Clarity** (free session recording)
6. **Monitor & iterate** based on data

**Status:** Ready to begin implementation

**Estimated Impact:**
- Catch 100% of production errors (currently catching ~60%)
- Understand user behavior better (from minimal to comprehensive)
- Make data-driven decisions (currently guessing)
- Improve conversion rate by 15-25% (with insights)

**Most Critical:** Start with Sentry for error tracking. Everything else can be added incrementally.
