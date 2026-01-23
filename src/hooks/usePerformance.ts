import {useEffect, useRef, useState, useCallback} from 'react';
import {useReducedMotion} from 'framer-motion';

/**
 * Performance monitoring and optimization hooks
 */

// Check if the device is low-end based on hardware concurrency and memory
export function useDeviceCapability() {
  const [capability, setCapability] = useState<'high' | 'medium' | 'low'>('high');

  useEffect(() => {
    const checkCapability = () => {
      // Check hardware concurrency (CPU cores)
      const cores = navigator.hardwareConcurrency || 4;

      // Check device memory (GB) - only available in some browsers
      const memory = (navigator as any).deviceMemory || 4;

      // Check if it's a mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

      // Determine capability
      if (cores <= 2 || memory <= 2 || (isMobile && cores <= 4)) {
        setCapability('low');
      } else if (cores <= 4 || memory <= 4) {
        setCapability('medium');
      } else {
        setCapability('high');
      }
    };

    checkCapability();
  }, []);

  return capability;
}

/**
 * Returns animation settings based on device capability and user preferences
 */
export function useAnimationConfig() {
  const shouldReduceMotion = useReducedMotion();
  const capability = useDeviceCapability();

  // Reduce animation complexity for low-end devices
  const config = {
    // Whether to enable animations at all
    enableAnimations: !shouldReduceMotion,

    // Whether to enable parallax effects
    enableParallax: !shouldReduceMotion && capability !== 'low',

    // Whether to enable 3D transforms
    enable3D: !shouldReduceMotion && capability !== 'low',

    // Whether to enable particle effects
    enableParticles: !shouldReduceMotion && capability === 'high',

    // Whether to enable blur effects (expensive on some devices)
    enableBlur: capability !== 'low',

    // Whether to enable custom cursor
    enableCustomCursor: !shouldReduceMotion && capability !== 'low' && !isTouchDevice(),

    // Stagger delay multiplier (faster on low-end)
    staggerMultiplier: capability === 'low' ? 0.5 : capability === 'medium' ? 0.75 : 1,

    // Duration multiplier (faster on low-end)
    durationMultiplier: capability === 'low' ? 0.5 : capability === 'medium' ? 0.75 : 1,

    // Maximum number of floating elements
    maxFloatingElements: capability === 'low' ? 3 : capability === 'medium' ? 6 : 10,
  };

  return config;
}

/**
 * Check if device is touch-enabled
 */
function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Frame rate monitor - useful for debugging animation performance
 */
export function useFrameRate(enabled = false) {
  const [fps, setFps] = useState(60);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    if (!enabled) return;

    let animationId: number;

    const measureFPS = () => {
      frameCountRef.current++;
      const now = performance.now();
      const elapsed = now - lastTimeRef.current;

      if (elapsed >= 1000) {
        setFps(Math.round((frameCountRef.current * 1000) / elapsed));
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      animationId = requestAnimationFrame(measureFPS);
    };

    animationId = requestAnimationFrame(measureFPS);

    return () => cancelAnimationFrame(animationId);
  }, [enabled]);

  return fps;
}

/**
 * Debounced scroll handler with RAF
 */
export function useScrollOptimized(callback: (scrollY: number) => void, delay = 0) {
  const rafRef = useRef<number | null>(null);
  const lastScrollRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (delay > 0) {
        timeoutRef.current = setTimeout(() => {
          rafRef.current = requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            if (scrollY !== lastScrollRef.current) {
              lastScrollRef.current = scrollY;
              callback(scrollY);
            }
          });
        }, delay);
      } else {
        rafRef.current = requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (scrollY !== lastScrollRef.current) {
            lastScrollRef.current = scrollY;
            callback(scrollY);
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll, {passive: true});

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [callback, delay]);
}

/**
 * Preload images for smoother transitions
 */
export function useImagePreloader(urls: string[]) {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (urls.length === 0) {
      setLoaded(true);
      return;
    }

    let loadedCount = 0;

    const preloadImage = (url: string) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          setProgress(Math.round((loadedCount / urls.length) * 100));
          resolve();
        };
        img.onerror = () => {
          loadedCount++;
          setProgress(Math.round((loadedCount / urls.length) * 100));
          resolve();
        };
        img.src = url;
      });
    };

    Promise.all(urls.map(preloadImage)).then(() => {
      setLoaded(true);
    });
  }, [urls]);

  return {loaded, progress};
}

/**
 * Idle callback for non-critical work
 */
export function useIdleCallback(callback: () => void, deps: React.DependencyList = []) {
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(callback, {timeout: 2000});
      return () => cancelIdleCallback(id);
    } else {
      const id = setTimeout(callback, 1);
      return () => clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Detect if element is likely to be animated soon (for will-change optimization)
 */
export function useWillChange<T extends HTMLElement = HTMLElement>(
  property: string = 'transform',
  threshold = 200, // pixels before element enters viewport
) {
  const ref = useRef<T>(null);
  const [shouldOptimize, setShouldOptimize] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Enable will-change slightly before element enters viewport
          if (entry.isIntersecting) {
            setShouldOptimize(true);
          } else {
            // Disable will-change when element leaves viewport to free resources
            setShouldOptimize(false);
          }
        });
      },
      {
        rootMargin: `${threshold}px 0px ${threshold}px 0px`,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold]);

  // Apply will-change style
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (shouldOptimize) {
      element.style.willChange = property;
    } else {
      element.style.willChange = 'auto';
    }

    return () => {
      if (element) {
        element.style.willChange = 'auto';
      }
    };
  }, [shouldOptimize, property]);

  return ref;
}

/**
 * Batch DOM reads and writes for better performance
 */
export function useBatchedUpdates() {
  const readsRef = useRef<Array<() => void>>([]);
  const writesRef = useRef<Array<() => void>>([]);
  const scheduledRef = useRef(false);

  const scheduleUpdate = useCallback(() => {
    if (scheduledRef.current) return;
    scheduledRef.current = true;

    requestAnimationFrame(() => {
      // Batch all reads first
      readsRef.current.forEach((read) => read());
      readsRef.current = [];

      // Then batch all writes
      writesRef.current.forEach((write) => write());
      writesRef.current = [];

      scheduledRef.current = false;
    });
  }, []);

  const read = useCallback(
    (fn: () => void) => {
      readsRef.current.push(fn);
      scheduleUpdate();
    },
    [scheduleUpdate],
  );

  const write = useCallback(
    (fn: () => void) => {
      writesRef.current.push(fn);
      scheduleUpdate();
    },
    [scheduleUpdate],
  );

  return {read, write};
}

/**
 * Throttle function execution
 */
export function useThrottle<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
): T {
  const lastCallRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallRef.current;

      if (timeSinceLastCall >= delay) {
        lastCallRef.current = now;
        fn(...args);
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          lastCallRef.current = Date.now();
          fn(...args);
        }, delay - timeSinceLastCall);
      }
    }) as T,
    [fn, delay],
  );
}
