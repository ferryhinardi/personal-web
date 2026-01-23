import {useEffect, useState, useRef, useCallback} from 'react';
import {useReducedMotion} from 'framer-motion';

export interface UseInViewOptions {
  /** Threshold of visibility (0-1) to trigger */
  threshold?: number;
  /** Root margin for intersection observer */
  rootMargin?: string;
  /** Only trigger once */
  triggerOnce?: boolean;
  /** Delay before triggering (ms) */
  delay?: number;
  /** Skip if user prefers reduced motion */
  respectReducedMotion?: boolean;
}

export interface UseInViewResult {
  /** Ref to attach to the element */
  ref: React.RefObject<HTMLElement | null>;
  /** Whether element is in view */
  inView: boolean;
  /** Whether animation has been triggered (for triggerOnce) */
  hasTriggered: boolean;
  /** Reset the trigger state */
  reset: () => void;
}

/**
 * Custom hook for detecting when an element enters the viewport.
 * Useful for triggering animations on scroll.
 *
 * @example
 * ```tsx
 * const {ref, inView} = useInView({threshold: 0.2, triggerOnce: true});
 *
 * return (
 *   <motion.div
 *     ref={ref}
 *     initial="hidden"
 *     animate={inView ? "visible" : "hidden"}
 *     variants={fadeInUp}
 *   >
 *     Content
 *   </motion.div>
 * );
 * ```
 */
export function useInView(options: UseInViewOptions = {}): UseInViewResult {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
    delay = 0,
    respectReducedMotion = true,
  } = options;

  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const reset = useCallback(() => {
    setInView(false);
    setHasTriggered(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    // If reduced motion is preferred and we respect it, trigger immediately
    if (respectReducedMotion && shouldReduceMotion) {
      setInView(true);
      setHasTriggered(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    // If already triggered and triggerOnce is true, don't observe
    if (triggerOnce && hasTriggered) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isIntersecting = entry.isIntersecting;

          if (isIntersecting) {
            if (delay > 0) {
              timeoutRef.current = setTimeout(() => {
                setInView(true);
                setHasTriggered(true);
              }, delay);
            } else {
              setInView(true);
              setHasTriggered(true);
            }

            // Unobserve if triggerOnce
            if (triggerOnce) {
              observer.unobserve(element);
            }
          } else if (!triggerOnce) {
            // Clear pending timeout
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
            setInView(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    threshold,
    rootMargin,
    triggerOnce,
    delay,
    hasTriggered,
    respectReducedMotion,
    shouldReduceMotion,
  ]);

  return {ref, inView, hasTriggered, reset};
}

/**
 * Hook for creating staggered reveal animations on scroll.
 * Returns refs and inView states for multiple elements.
 *
 * @example
 * ```tsx
 * const {containerRef, itemsInView} = useStaggeredInView(5, {staggerDelay: 100});
 *
 * return (
 *   <div ref={containerRef}>
 *     {items.map((item, index) => (
 *       <motion.div
 *         key={item.id}
 *         initial="hidden"
 *         animate={itemsInView[index] ? "visible" : "hidden"}
 *         variants={fadeInUp}
 *       >
 *         {item.content}
 *       </motion.div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useStaggeredInView(
  itemCount: number,
  options: UseInViewOptions & {staggerDelay?: number} = {},
) {
  const {staggerDelay = 100, ...inViewOptions} = options;
  const containerRef = useRef<HTMLElement | null>(null);
  const [itemsInView, setItemsInView] = useState<boolean[]>(
    Array(itemCount).fill(false),
  );
  const hasTriggeredRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // If reduced motion is preferred, show all immediately
    if (options.respectReducedMotion !== false && shouldReduceMotion) {
      setItemsInView(Array(itemCount).fill(true));
      return;
    }

    const container = containerRef.current;
    if (!container || hasTriggeredRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggeredRef.current) {
            hasTriggeredRef.current = true;

            // Stagger the reveal of each item
            for (let i = 0; i < itemCount; i++) {
              setTimeout(() => {
                setItemsInView((prev) => {
                  const next = [...prev];
                  next[i] = true;
                  return next;
                });
              }, i * staggerDelay);
            }

            observer.unobserve(container);
          }
        });
      },
      {
        threshold: inViewOptions.threshold ?? 0.1,
        rootMargin: inViewOptions.rootMargin ?? '0px',
      },
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [itemCount, staggerDelay, inViewOptions, shouldReduceMotion, options.respectReducedMotion]);

  const reset = useCallback(() => {
    setItemsInView(Array(itemCount).fill(false));
    hasTriggeredRef.current = false;
  }, [itemCount]);

  return {containerRef, itemsInView, reset};
}

/**
 * Hook for lazy loading components when they come into view.
 *
 * @example
 * ```tsx
 * const {ref, shouldLoad} = useLazyLoad({rootMargin: '200px'});
 *
 * return (
 *   <div ref={ref}>
 *     {shouldLoad ? <HeavyComponent /> : <Skeleton />}
 *   </div>
 * );
 * ```
 */
export function useLazyLoad(options: {
  rootMargin?: string;
  threshold?: number;
} = {}) {
  const {rootMargin = '100px', threshold = 0} = options;
  const ref = useRef<HTMLElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || shouldLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      {rootMargin, threshold},
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin, threshold, shouldLoad]);

  return {ref, shouldLoad};
}

/**
 * Viewport options presets for common use cases
 */
export const inViewPresets = {
  /** Default - triggers when 10% visible */
  default: {
    threshold: 0.1,
    rootMargin: '0px',
    triggerOnce: true,
  },
  /** Eager - triggers as soon as any part is visible */
  eager: {
    threshold: 0,
    rootMargin: '50px',
    triggerOnce: true,
  },
  /** Conservative - triggers when 30% visible */
  conservative: {
    threshold: 0.3,
    rootMargin: '-50px',
    triggerOnce: true,
  },
  /** Continuous - keeps tracking visibility */
  continuous: {
    threshold: 0.1,
    rootMargin: '0px',
    triggerOnce: false,
  },
  /** Preload - triggers early for lazy loading */
  preload: {
    threshold: 0,
    rootMargin: '200px',
    triggerOnce: true,
  },
} as const;
