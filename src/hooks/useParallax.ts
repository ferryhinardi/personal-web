import {useRef, useMemo} from 'react';
import {
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  MotionValue,
} from 'framer-motion';

export interface ParallaxConfig {
  /** Scroll offset range [start, end] - default ['start end', 'end start'] */
  offset?: [string, string];
  /** Output range for Y transform - default [0, 0] */
  yRange?: [number, number];
  /** Output range for X transform - default [0, 0] */
  xRange?: [number, number];
  /** Output range for scale transform - default [1, 1] */
  scaleRange?: [number, number];
  /** Output range for opacity - default [1, 1] */
  opacityRange?: [number, number];
  /** Output range for rotation (degrees) - default [0, 0] */
  rotateRange?: [number, number];
  /** Spring configuration for smooth animations */
  springConfig?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
  /** Disable spring smoothing */
  disableSpring?: boolean;
}

export interface ParallaxResult {
  /** Ref to attach to the container element */
  ref: React.RefObject<HTMLDivElement | null>;
  /** Scroll progress value (0 to 1) */
  scrollProgress: MotionValue<number>;
  /** Transformed Y value */
  y: MotionValue<number>;
  /** Transformed X value */
  x: MotionValue<number>;
  /** Transformed scale value */
  scale: MotionValue<number>;
  /** Transformed opacity value */
  opacity: MotionValue<number>;
  /** Transformed rotation value */
  rotate: MotionValue<number>;
  /** Whether reduced motion is preferred */
  shouldReduceMotion: boolean;
}

const DEFAULT_SPRING_CONFIG = {
  stiffness: 100,
  damping: 30,
  mass: 1,
};

/**
 * Custom hook for creating parallax scroll effects using Framer Motion.
 * Respects user's reduced motion preferences.
 *
 * @example
 * ```tsx
 * const {ref, y, opacity} = useParallax({
 *   yRange: [-100, 100],
 *   opacityRange: [1, 0],
 * });
 *
 * return (
 *   <motion.div ref={ref} style={{y, opacity}}>
 *     Content
 *   </motion.div>
 * );
 * ```
 */
export function useParallax(config: ParallaxConfig = {}): ParallaxResult {
  const {
    offset = ['start end', 'end start'],
    yRange = [0, 0],
    xRange = [0, 0],
    scaleRange = [1, 1],
    opacityRange = [1, 1],
    rotateRange = [0, 0],
    springConfig = DEFAULT_SPRING_CONFIG,
    disableSpring = false,
  } = config;

  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;

  // Get scroll progress for the element
  const {scrollYProgress} = useScroll({
    target: ref,
    offset: offset as ['start end', 'end start'],
  });

  // Create transforms
  const yTransform = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : yRange,
  );
  const xTransform = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : xRange,
  );
  const scaleTransform = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [1, 1] : scaleRange,
  );
  const opacityTransform = useTransform(scrollYProgress, [0, 1], opacityRange);
  const rotateTransform = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : rotateRange,
  );

  // Apply spring smoothing (unless disabled or reduced motion preferred)
  const applySpring = !disableSpring && !shouldReduceMotion;

  const y = useSpring(
    yTransform,
    applySpring ? springConfig : {stiffness: 1000, damping: 1000},
  );
  const x = useSpring(
    xTransform,
    applySpring ? springConfig : {stiffness: 1000, damping: 1000},
  );
  const scale = useSpring(
    scaleTransform,
    applySpring ? springConfig : {stiffness: 1000, damping: 1000},
  );
  const opacity = useSpring(
    opacityTransform,
    applySpring ? springConfig : {stiffness: 1000, damping: 1000},
  );
  const rotate = useSpring(
    rotateTransform,
    applySpring ? springConfig : {stiffness: 1000, damping: 1000},
  );

  return {
    ref,
    scrollProgress: scrollYProgress,
    y,
    x,
    scale,
    opacity,
    rotate,
    shouldReduceMotion,
  };
}

/**
 * Simplified parallax hook for basic Y-axis parallax effects.
 *
 * @param speed - Parallax speed multiplier (negative = opposite direction)
 * @example
 * ```tsx
 * const {ref, y} = useSimpleParallax(0.5);
 * return <motion.div ref={ref} style={{y}}>Slower scroll</motion.div>;
 * ```
 */
export function useSimpleParallax(speed: number = 0.5) {
  const baseOffset = 100 * speed;
  return useParallax({
    yRange: [-baseOffset, baseOffset],
  });
}

/**
 * Hook for creating a parallax background effect that moves slower than content.
 */
export function useBackgroundParallax(intensity: number = 0.3) {
  return useParallax({
    yRange: [intensity * -100, intensity * 100],
    springConfig: {
      stiffness: 50,
      damping: 20,
      mass: 1,
    },
  });
}

/**
 * Hook for creating a fade-out-on-scroll effect (like hero sections).
 */
export function useFadeOnScroll() {
  return useParallax({
    opacityRange: [1, 0],
    yRange: [0, -50],
    offset: ['start start', 'end start'],
  });
}

/**
 * Hook for creating scale-up-on-scroll effect.
 */
export function useScaleOnScroll(
  scaleStart: number = 0.8,
  scaleEnd: number = 1,
) {
  return useParallax({
    scaleRange: [scaleStart, scaleEnd],
    opacityRange: [0.5, 1],
  });
}

/**
 * Preset configurations for common parallax effects.
 */
export const parallaxPresets = {
  /** Slow-moving background layer */
  backgroundSlow: {
    yRange: [-30, 30] as [number, number],
    springConfig: {stiffness: 50, damping: 20},
  },
  /** Medium-speed parallax */
  backgroundMedium: {
    yRange: [-50, 50] as [number, number],
    springConfig: {stiffness: 80, damping: 25},
  },
  /** Fast-moving foreground elements */
  foregroundFast: {
    yRange: [-100, 100] as [number, number],
    springConfig: {stiffness: 100, damping: 30},
  },
  /** Hero section fade out */
  heroFade: {
    opacityRange: [1, 0] as [number, number],
    yRange: [0, -100] as [number, number],
    offset: ['start start', 'center start'] as [string, string],
  },
  /** Card reveal effect */
  cardReveal: {
    scaleRange: [0.9, 1] as [number, number],
    opacityRange: [0, 1] as [number, number],
    yRange: [50, 0] as [number, number],
  },
  /** Subtle float effect */
  float: {
    yRange: [-20, 20] as [number, number],
    springConfig: {stiffness: 30, damping: 15},
  },
} as const;

export type ParallaxPreset = keyof typeof parallaxPresets;

/**
 * Hook that uses a preset configuration.
 */
export function useParallaxPreset(preset: ParallaxPreset) {
  const config = useMemo(() => parallaxPresets[preset], [preset]);
  return useParallax(config);
}
