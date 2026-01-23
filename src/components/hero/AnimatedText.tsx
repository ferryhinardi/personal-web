import {memo, useMemo} from 'react';
import {motion, useReducedMotion, type Variants} from 'framer-motion';
import {splitTextContainer, splitTextChar} from '@/utils/animations';

type AnimationStyle = 'char' | 'word' | 'line';

interface AnimatedTextProps {
  /** Text to animate */
  text: string;
  /** HTML tag to use */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  /** Animation style: character, word, or line-based */
  animationStyle?: AnimationStyle;
  /** Additional CSS class */
  className?: string;
  /** Custom container variants */
  containerVariants?: Variants;
  /** Custom child variants */
  childVariants?: Variants;
  /** Stagger delay between items (seconds) */
  staggerDelay?: number;
  /** Initial delay before animation starts (seconds) */
  initialDelay?: number;
  /** Trigger animation when in view */
  triggerOnView?: boolean;
  /** View threshold (0-1) for triggering animation */
  viewThreshold?: number;
  /** Only animate once */
  once?: boolean;
}

/**
 * Default variants for word-based animation.
 */
const wordContainerVariants: Variants = {
  hidden: {opacity: 1},
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const wordChildVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 150,
      damping: 20,
    },
  },
};

/**
 * Default variants for line-based animation.
 */
const lineContainerVariants: Variants = {
  hidden: {opacity: 1},
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const lineChildVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    clipPath: 'inset(100% 0% 0% 0%)',
  },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
    },
  },
};

/**
 * Get variants based on animation style.
 */
function getVariants(
  style: AnimationStyle,
  staggerDelay?: number,
  initialDelay?: number,
): {container: Variants; child: Variants} {
  const applyCustomTiming = (variants: Variants): Variants => {
    if (!staggerDelay && !initialDelay) return variants;

    return {
      ...variants,
      visible: {
        ...(variants.visible as object),
        transition: {
          ...((variants.visible as {transition?: object})?.transition ?? {}),
          ...(staggerDelay !== undefined && {staggerChildren: staggerDelay}),
          ...(initialDelay !== undefined && {delayChildren: initialDelay}),
        },
      },
    };
  };

  switch (style) {
    case 'char':
      return {
        container: applyCustomTiming(splitTextContainer),
        child: splitTextChar,
      };
    case 'word':
      return {
        container: applyCustomTiming(wordContainerVariants),
        child: wordChildVariants,
      };
    case 'line':
      return {
        container: applyCustomTiming(lineContainerVariants),
        child: lineChildVariants,
      };
  }
}

/**
 * Split text into units based on animation style.
 */
function splitText(text: string, style: AnimationStyle): string[] {
  switch (style) {
    case 'char':
      // Split into characters, preserving spaces
      return text.split('');
    case 'word':
      // Split into words
      return text.split(/\s+/).filter(Boolean);
    case 'line':
      // Split by newlines or treat as single line
      return text.split('\n').filter(Boolean);
  }
}

/**
 * Character-by-character or word-by-word animated text reveal.
 * Uses spring physics for natural-feeling animations.
 * Respects reduced motion preferences.
 *
 * @example
 * ```tsx
 * <AnimatedText
 *   text="Ferry Hinardi"
 *   as="h1"
 *   animationStyle="char"
 *   className="text-5xl font-bold"
 * />
 * ```
 */
function AnimatedTextComponent({
  text,
  as: Tag = 'span',
  animationStyle = 'char',
  className = '',
  containerVariants: customContainerVariants,
  childVariants: customChildVariants,
  staggerDelay,
  initialDelay,
  triggerOnView = true,
  viewThreshold = 0.3,
  once = true,
}: AnimatedTextProps) {
  const shouldReduceMotion = useReducedMotion();

  // Split text into units
  const units = useMemo(
    () => splitText(text, animationStyle),
    [text, animationStyle],
  );

  // Get appropriate variants
  const {container, child} = useMemo(
    () => getVariants(animationStyle, staggerDelay, initialDelay),
    [animationStyle, staggerDelay, initialDelay],
  );

  // Use custom variants if provided
  const containerVar = customContainerVariants ?? container;
  const childVar = customChildVariants ?? child;

  // Reduced motion: show text immediately
  if (shouldReduceMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  // Character animation needs special handling for spaces
  if (animationStyle === 'char') {
    return (
      <motion.span
        className={`inline-block ${className}`}
        variants={containerVar}
        initial="hidden"
        {...(triggerOnView
          ? {whileInView: 'visible', viewport: {once, amount: viewThreshold}}
          : {animate: 'visible'})}
        aria-label={text}
      >
        {units.map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
            variants={childVar}
            className="inline-block"
            style={{
              // Preserve whitespace
              whiteSpace: char === ' ' ? 'pre' : 'normal',
            }}
            aria-hidden="true"
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.span>
    );
  }

  // Word animation
  if (animationStyle === 'word') {
    return (
      <Tag className={className}>
        <motion.span
          className="inline-flex flex-wrap"
          variants={containerVar}
          initial="hidden"
          {...(triggerOnView
            ? {whileInView: 'visible', viewport: {once, amount: viewThreshold}}
            : {animate: 'visible'})}
        >
          {units.map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              variants={childVar}
              className="inline-block mr-[0.25em]"
            >
              {word}
            </motion.span>
          ))}
        </motion.span>
      </Tag>
    );
  }

  // Line animation
  return (
    <Tag className={className}>
      <motion.span
        className="block"
        variants={containerVar}
        initial="hidden"
        {...(triggerOnView
          ? {whileInView: 'visible', viewport: {once, amount: viewThreshold}}
          : {animate: 'visible'})}
      >
        {units.map((line, i) => (
          <motion.span
            key={`${line.slice(0, 10)}-${i}`}
            variants={childVar}
            className="block overflow-hidden"
          >
            <span className="block">{line}</span>
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}

export const AnimatedText = memo(AnimatedTextComponent);
export type {AnimatedTextProps, AnimationStyle};
