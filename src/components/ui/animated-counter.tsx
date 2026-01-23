import {memo, useEffect, useState, useRef} from 'react';
import {
  motion,
  useSpring,
  useTransform,
  useInView,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';

interface AnimatedCounterProps {
  /** Target value to count to */
  value: number;
  /** Duration of the animation in seconds */
  duration?: number;
  /** Delay before starting animation in seconds */
  delay?: number;
  /** Number of decimal places */
  decimals?: number;
  /** Prefix (e.g., "$", "+") */
  prefix?: string;
  /** Suffix (e.g., "%", "K", "+") */
  suffix?: string;
  /** Format with thousand separators */
  formatThousands?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Start counting when element is in view */
  startOnView?: boolean;
  /** Spring configuration */
  springConfig?: {
    stiffness?: number;
    damping?: number;
  };
}

/**
 * Format number with thousand separators
 */
function formatNumber(value: number, decimals: number, formatThousands: boolean): string {
  const fixed = value.toFixed(decimals);
  if (!formatThousands) return fixed;

  const parts = fixed.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

/**
 * Animated number display component
 */
function AnimatedNumber({
  value,
  decimals,
  formatThousands,
}: {
  value: MotionValue<number>;
  decimals: number;
  formatThousands: boolean;
}) {
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    const unsubscribe = value.on('change', (latest) => {
      setDisplay(formatNumber(latest, decimals, formatThousands));
    });
    return unsubscribe;
  }, [value, decimals, formatThousands]);

  return <>{display}</>;
}

/**
 * Animated counter component that counts up to a target value.
 * Uses spring physics for natural-feeling animation.
 * Respects reduced motion preferences.
 *
 * @example
 * ```tsx
 * <AnimatedCounter
 *   value={1500}
 *   suffix="+"
 *   duration={2}
 *   className="text-4xl font-bold"
 * />
 * ```
 */
function AnimatedCounterComponent({
  value,
  duration = 2,
  delay = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
  formatThousands = true,
  className = '',
  startOnView = true,
  springConfig = {stiffness: 50, damping: 20},
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, {once: true, amount: 0.5});
  const shouldReduceMotion = useReducedMotion();
  const [hasStarted, setHasStarted] = useState(!startOnView);

  // Start animation when in view (if startOnView is true)
  useEffect(() => {
    if (startOnView && isInView && !hasStarted) {
      const timeout = setTimeout(() => setHasStarted(true), delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [isInView, startOnView, hasStarted, delay]);

  // Calculate spring stiffness based on duration
  // Higher stiffness = faster animation
  const calculatedStiffness = springConfig.stiffness ?? Math.max(30, 100 / duration);

  const springValue = useSpring(0, {
    stiffness: calculatedStiffness,
    damping: springConfig.damping ?? 20,
  });

  const displayValue = useTransform(springValue, (latest) =>
    Math.min(latest, value),
  );

  // Animate to target value when started
  useEffect(() => {
    if (hasStarted) {
      springValue.set(value);
    }
  }, [hasStarted, value, springValue]);

  // Reduced motion: show final value immediately
  if (shouldReduceMotion) {
    return (
      <span ref={ref} className={className}>
        {prefix}
        {formatNumber(value, decimals, formatThousands)}
        {suffix}
      </span>
    );
  }

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{opacity: 0, y: 10}}
      animate={hasStarted ? {opacity: 1, y: 0} : {}}
      transition={{duration: 0.3}}
    >
      {prefix}
      <AnimatedNumber
        value={displayValue}
        decimals={decimals}
        formatThousands={formatThousands}
      />
      {suffix}
    </motion.span>
  );
}

export const AnimatedCounter = memo(AnimatedCounterComponent);
export type {AnimatedCounterProps};
