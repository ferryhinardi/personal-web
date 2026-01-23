import {memo, type ReactNode} from 'react';
import {motion, useReducedMotion, type Variants} from 'framer-motion';
import {useInView} from '@/hooks/useInView';

interface TimelineItemProps {
  /** Content to display */
  children: ReactNode;
  /** Index for stagger animation */
  index?: number;
  /** Additional CSS class */
  className?: string;
  /** Show on left or right side (for desktop) */
  side?: 'left' | 'right' | 'auto';
  /** Dot color */
  dotColor?: string;
  /** Show connecting line */
  showLine?: boolean;
}

interface ScrollRevealTimelineProps {
  /** Timeline items */
  children: ReactNode;
  /** Additional CSS class */
  className?: string;
  /** Line color */
  lineColor?: string;
  /** Line gradient */
  lineGradient?: string;
}

/**
 * Individual timeline item with scroll-triggered reveal animation.
 */
function TimelineItemComponent({
  children,
  index = 0,
  className = '',
  dotColor = 'from-cyan-500 to-blue-600',
}: TimelineItemProps) {
  const {ref, inView} = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });
  const shouldReduceMotion = useReducedMotion();

  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: -30,
      y: 20,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 20,
        delay: shouldReduceMotion ? 0 : index * 0.1,
      },
    },
  };

  const dotVariants: Variants = {
    hidden: {scale: 0, opacity: 0},
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 200,
        damping: 15,
        delay: shouldReduceMotion ? 0 : index * 0.1,
      },
    },
  };

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={`relative ${className}`}>
      {/* Timeline dot */}
      <motion.div
        variants={dotVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className={`hidden md:block absolute left-[26px] top-6 w-4 h-4 rounded-full bg-gradient-to-br ${dotColor} border-4 border-white dark:border-slate-900 shadow-lg z-10`}
      />

      {/* Content card */}
      <motion.div
        variants={shouldReduceMotion ? undefined : variants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="md:ml-20"
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Timeline container with animated connecting line.
 */
function ScrollRevealTimelineComponent({
  children,
  className = '',
  lineGradient = 'from-cyan-500 via-blue-500 to-purple-500',
}: ScrollRevealTimelineProps) {
  const {ref, inView} = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const shouldReduceMotion = useReducedMotion();

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={`relative ${className}`}>
      {/* Animated timeline line */}
      <motion.div
        className={`hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b ${lineGradient}`}
        initial={{scaleY: 0, originY: 0}}
        animate={inView ? {scaleY: 1} : {scaleY: 0}}
        transition={{
          duration: shouldReduceMotion ? 0 : 1.5,
          ease: 'easeOut',
        }}
      />

      {/* Timeline items */}
      <div className="space-y-8">{children}</div>
    </div>
  );
}

export const ScrollRevealTimeline = memo(ScrollRevealTimelineComponent);
export const TimelineItem = memo(TimelineItemComponent);
export type {ScrollRevealTimelineProps, TimelineItemProps};
