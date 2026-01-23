import {memo, useRef, type ReactNode, type CSSProperties} from 'react';
import {motion, useReducedMotion, useInView, type Variants, type Transition} from 'framer-motion';
import {useAnimationConfig} from '@/hooks/usePerformance';
import {cn} from '@/lib/utils';

interface LazyAnimationProps {
  children: ReactNode;
  /** Animation variant to use */
  variant?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scale' | 'none';
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** Animation duration (seconds) */
  duration?: number;
  /** Trigger animation only once */
  once?: boolean;
  /** Intersection threshold (0-1) */
  threshold?: number;
  /** Additional class name */
  className?: string;
  /** Custom styles */
  style?: CSSProperties;
  /** Skip animation entirely */
  disabled?: boolean;
}

const variants: Record<string, Variants> = {
  fadeUp: {
    hidden: {opacity: 0, y: 30},
    visible: {opacity: 1, y: 0},
  },
  fadeIn: {
    hidden: {opacity: 0},
    visible: {opacity: 1},
  },
  slideLeft: {
    hidden: {opacity: 0, x: -50},
    visible: {opacity: 1, x: 0},
  },
  slideRight: {
    hidden: {opacity: 0, x: 50},
    visible: {opacity: 1, x: 0},
  },
  scale: {
    hidden: {opacity: 0, scale: 0.9},
    visible: {opacity: 1, scale: 1},
  },
  none: {
    hidden: {},
    visible: {},
  },
};

/**
 * Wrapper component that adds scroll-triggered animations with performance optimizations.
 * Respects reduced motion preferences and device capabilities.
 *
 * @example
 * ```tsx
 * <LazyAnimation variant="fadeUp" delay={0.2}>
 *   <Card>Content</Card>
 * </LazyAnimation>
 * ```
 */
function LazyAnimationComponent({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration = 0.5,
  once = true,
  threshold = 0.2,
  className,
  style,
  disabled = false,
}: LazyAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const {enableAnimations, durationMultiplier} = useAnimationConfig();
  const inView = useInView(ref, {once, amount: threshold});

  // Skip animation if disabled or reduced motion is preferred
  if (disabled || shouldReduceMotion || !enableAnimations) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  const selectedVariant = variants[variant] || variants.fadeUp;
  const adjustedDuration = duration * durationMultiplier;

  const transition: Transition = {
    duration: adjustedDuration,
    delay,
    ease: [0.25, 0.1, 0.25, 1],
  };

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      style={{
        ...style,
        willChange: inView ? 'auto' : 'transform, opacity',
      }}
      variants={selectedVariant}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}

export const LazyAnimation = memo(LazyAnimationComponent);

/**
 * Staggered children animation container
 */
interface StaggerContainerProps {
  children: ReactNode;
  /** Stagger delay between children (seconds) */
  stagger?: number;
  /** Delay before first child animates (seconds) */
  delay?: number;
  /** Additional class name */
  className?: string;
}

function StaggerContainerComponent({
  children,
  stagger = 0.1,
  delay = 0,
  className,
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const {enableAnimations, staggerMultiplier} = useAnimationConfig();
  const inView = useInView(ref, {once: true, amount: 0.1});

  if (shouldReduceMotion || !enableAnimations) {
    return <div className={className}>{children}</div>;
  }

  const adjustedStagger = stagger * staggerMultiplier;

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: adjustedStagger,
            delayChildren: delay,
          },
        },
      }}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      {children}
    </motion.div>
  );
}

export const StaggerContainer = memo(StaggerContainerComponent);

/**
 * Stagger item to be used inside StaggerContainer
 */
interface StaggerItemProps {
  children: ReactNode;
  /** Animation variant */
  variant?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scale';
  /** Additional class name */
  className?: string;
}

function StaggerItemComponent({
  children,
  variant = 'fadeUp',
  className,
}: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();
  const {enableAnimations, durationMultiplier} = useAnimationConfig();

  if (shouldReduceMotion || !enableAnimations) {
    return <div className={className}>{children}</div>;
  }

  const selectedVariant = variants[variant] || variants.fadeUp;

  return (
    <motion.div
      className={className}
      variants={selectedVariant}
      transition={{
        duration: 0.4 * durationMultiplier,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export const StaggerItem = memo(StaggerItemComponent);
