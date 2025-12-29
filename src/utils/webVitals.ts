import type { Metric } from 'web-vitals';

/**
 * Reports Core Web Vitals metrics to analytics
 */
export function reportWebVitals(metric: Metric) {
  // Log to console in development
  if (import.meta.env.DEV) {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
    });
  }

  // Send to Google Analytics
  if (window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }

  // Send to Vercel Analytics
  if (window.va) {
    window.va('event', {
      name: metric.name,
      data: {
        value: metric.value,
        rating: metric.rating,
      },
    });
  }
}

/**
 * Initialize Web Vitals monitoring
 */
export async function initWebVitals() {
  try {
    const { onCLS, onFCP, onLCP, onTTFB, onINP } = await import('web-vitals');
    
    // Report all Core Web Vitals
    onCLS(reportWebVitals);
    onFCP(reportWebVitals);
    onLCP(reportWebVitals);
    onTTFB(reportWebVitals);
    onINP(reportWebVitals);
  } catch (error) {
    console.error('Failed to initialize Web Vitals:', error);
  }
}

// TypeScript declarations for global objects
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
