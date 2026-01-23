import {memo, useState, useEffect, useMemo, useRef} from 'react';
import {motion, useReducedMotion, useInView, type Variants} from 'framer-motion';
import {cn} from '@/lib/utils';

type AnimationType = 'typewriter' | 'split-chars' | 'split-words' | 'split-lines' | 'fade-up' | 'highlight';

interface AnimatedTextProps {
  /** Text content */
  children: string;
  /** Animation type */
  type?: AnimationType;
  /** Additional CSS class */
  className?: string;
  /** Animation delay in seconds */
  delay?: number;
  /** Duration per character/word (typewriter) or total duration */
  duration?: number;
  /** Stagger delay between characters/words */
  stagger?: number;
  /** Trigger animation only once */
  once?: boolean;
  /** Show cursor for typewriter */
  showCursor?: boolean;
  /** Cursor character */
  cursor?: string;
  /** Highlight color for highlight animation */
  highlightColor?: string;
  /** HTML tag to render */
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';
}

const charVariants: Variants = {
  hidden: {opacity: 0, y: 20},
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.4,
      ease: [0.2, 0.65, 0.3, 0.9],
    },
  }),
};

const wordVariants: Variants = {
  hidden: {opacity: 0, y: 20, rotateX: -90},
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.2, 0.65, 0.3, 0.9],
    },
  }),
};

const lineVariants: Variants = {
  hidden: {opacity: 0, y: 40, skewY: 3},
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    skewY: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.2, 0.65, 0.3, 0.9],
    },
  }),
};

const fadeUpVariants: Variants = {
  hidden: {opacity: 0, y: 30},
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.2, 0.65, 0.3, 0.9],
    },
  },
};

/**
 * Animated text component with multiple animation types.
 * Supports typewriter, split text, and highlight animations.
 *
 * @example
 * ```tsx
 * <AnimatedText type="typewriter" showCursor>
 *   Hello, World!
 * </AnimatedText>
 *
 * <AnimatedText type="split-words" as="h1">
 *   Welcome to my portfolio
 * </AnimatedText>
 *
 * <AnimatedText type="highlight" highlightColor="bg-yellow-300">
 *   Important text here
 * </AnimatedText>
 * ```
 */
function AnimatedTextComponent({
  children,
  type = 'fade-up',
  className = '',
  delay = 0,
  duration = 0.05,
  stagger = 0.03,
  once = true,
  showCursor = false,
  cursor = '|',
  highlightColor = 'bg-cyan-500/20',
  as: Tag = 'span',
}: AnimatedTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, {once, amount: 0.3});
  const [displayedText, setDisplayedText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);

  // Split text into characters, words, or lines
  const splitText = useMemo(() => {
    if (type === 'split-chars') {
      return children.split('');
    }
    if (type === 'split-words') {
      return children.split(' ');
    }
    if (type === 'split-lines') {
      return children.split('\n');
    }
    return [children];
  }, [children, type]);

  // Typewriter effect
  useEffect(() => {
    if (type !== 'typewriter' || !inView || shouldReduceMotion) {
      if (shouldReduceMotion && type === 'typewriter') {
        setDisplayedText(children);
      }
      return;
    }

    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex <= children.length) {
        setDisplayedText(children.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, duration * 1000);

    return () => clearInterval(intervalId);
  }, [type, inView, children, duration, shouldReduceMotion]);

  // Cursor blink effect
  useEffect(() => {
    if (!showCursor || type !== 'typewriter') return;

    const intervalId = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);

    return () => clearInterval(intervalId);
  }, [showCursor, type]);

  // Reduced motion fallback
  if (shouldReduceMotion) {
    return (
      <span ref={ref as React.RefObject<HTMLSpanElement>} className={className}>
        <Tag>{children}</Tag>
      </span>
    );
  }

  // Typewriter animation
  if (type === 'typewriter') {
    return (
      <span ref={ref as React.RefObject<HTMLSpanElement>} className={cn('inline', className)}>
        <Tag className="inline">
          {displayedText}
          {showCursor && (
            <span
              className={cn(
                'inline-block ml-0.5 font-normal transition-opacity duration-100',
                cursorVisible ? 'opacity-100' : 'opacity-0',
              )}
            >
              {cursor}
            </span>
          )}
        </Tag>
      </span>
    );
  }

  // Split characters animation
  if (type === 'split-chars') {
    return (
      <span ref={ref as React.RefObject<HTMLSpanElement>} className={cn('inline-block', className)}>
        <Tag className="inline-block">
          {splitText.map((char, i) => (
            <motion.span
              key={i}
              className="inline-block"
              style={{whiteSpace: char === ' ' ? 'pre' : 'normal'}}
              custom={i + delay / stagger}
              variants={charVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </Tag>
      </span>
    );
  }

  // Split words animation
  if (type === 'split-words') {
    return (
      <span
        ref={ref as React.RefObject<HTMLSpanElement>}
        className={cn('inline-block', className)}
        style={{perspective: '1000px'}}
      >
        <Tag className="inline-block">
          {splitText.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-[0.25em] origin-bottom"
              custom={i + delay / (stagger * 3)}
              variants={wordVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
            >
              {word}
            </motion.span>
          ))}
        </Tag>
      </span>
    );
  }

  // Split lines animation
  if (type === 'split-lines') {
    return (
      <div ref={ref as React.RefObject<HTMLDivElement>} className={cn('block', className)}>
        <Tag>
          {splitText.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                className="block"
                custom={i + delay / (stagger * 5)}
                variants={lineVariants}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </Tag>
      </div>
    );
  }

  // Highlight animation
  if (type === 'highlight') {
    return (
      <span ref={ref as React.RefObject<HTMLSpanElement>} className={cn('relative inline', className)}>
        <Tag className="relative inline">
          <span className="relative z-10">{children}</span>
          <motion.span
            className={cn('absolute inset-0 -z-0', highlightColor)}
            initial={{scaleX: 0, originX: 0}}
            animate={inView ? {scaleX: 1} : {scaleX: 0}}
            transition={{duration: 0.6, delay, ease: [0.2, 0.65, 0.3, 0.9]}}
          />
        </Tag>
      </span>
    );
  }

  // Default fade-up animation
  return (
    <motion.span
      ref={ref as React.RefObject<HTMLSpanElement>}
      className={cn('inline-block', className)}
      variants={fadeUpVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{delay}}
    >
      <Tag className="inline-block">{children}</Tag>
    </motion.span>
  );
}

export const AnimatedText = memo(AnimatedTextComponent);
export type {AnimatedTextProps, AnimationType};
