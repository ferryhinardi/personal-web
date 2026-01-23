import {motion, useScroll, useSpring, useTransform, useReducedMotion} from 'framer-motion';
import {useEffect, useState, useMemo} from 'react';

interface Section {
  id: string;
  color: string;
}

interface ScrollProgressProps {
  /** Show percentage indicator */
  showPercentage?: boolean;
  /** Section colors for gradient effect */
  sections?: Section[];
  /** Height of the progress bar */
  height?: number;
}

const defaultSections: Section[] = [
  {id: 'home', color: 'from-cyan-500'},
  {id: 'about', color: 'via-blue-500'},
  {id: 'resume', color: 'via-purple-500'},
  {id: 'portfolio', color: 'via-pink-500'},
  {id: 'contact', color: 'to-red-500'},
];

/**
 * Enhanced scroll progress indicator with section-aware coloring
 * and optional percentage display.
 *
 * @example
 * ```tsx
 * <ScrollProgress showPercentage />
 * ```
 */
export function ScrollProgress({
  showPercentage = false,
  sections = defaultSections,
  height = 4,
}: ScrollProgressProps) {
  const shouldReduceMotion = useReducedMotion();
  const {scrollYProgress} = useScroll();

  // Smoother spring animation
  const scaleX = useSpring(scrollYProgress, {
    stiffness: shouldReduceMotion ? 300 : 100,
    damping: shouldReduceMotion ? 50 : 30,
    restDelta: 0.001,
  });

  // Transform scroll progress to percentage
  const percentage = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const roundedPercentage = useTransform(percentage, (value) => Math.round(value));

  const [isVisible, setIsVisible] = useState(false);
  const [currentPercentage, setCurrentPercentage] = useState(0);
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');

  // Build gradient string from sections
  const gradientColors = useMemo(() => {
    return sections.map((s) => s.color).join(' ');
  }, [sections]);

  // Track scroll percentage for display
  useEffect(() => {
    const unsubscribe = roundedPercentage.on('change', (value) => {
      setCurrentPercentage(value);
    });
    return () => unsubscribe();
  }, [roundedPercentage]);

  // Check if page is scrollable
  useEffect(() => {
    const checkScrollable = () => {
      const scrollable = document.documentElement.scrollHeight > window.innerHeight;
      setIsVisible(scrollable);
    };

    checkScrollable();
    window.addEventListener('resize', checkScrollable);

    return () => window.removeEventListener('resize', checkScrollable);
  }, []);

  // Track active section
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
              setActiveSection(section.id);
            }
          });
        },
        {threshold: 0.3},
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [sections]);

  if (!isVisible) return null;

  // Get active section color for glow effect
  const activeSectionIndex = sections.findIndex((s) => s.id === activeSection);
  const glowColors = [
    'shadow-cyan-500/50',
    'shadow-blue-500/50',
    'shadow-purple-500/50',
    'shadow-pink-500/50',
    'shadow-red-500/50',
  ];
  const glowColor = glowColors[activeSectionIndex] || glowColors[0];

  return (
    <>
      {/* Progress bar */}
      <motion.div
        className={`fixed top-0 left-0 right-0 origin-left z-[9999] pointer-events-none bg-gradient-to-r ${gradientColors} shadow-lg ${glowColor}`}
        style={{
          scaleX,
          height,
        }}
        aria-hidden="true"
      />

      {/* Percentage indicator */}
      {showPercentage && (
        <motion.div
          className="fixed top-3 right-4 z-[9999] pointer-events-none"
          initial={{opacity: 0, y: -20}}
          animate={{
            opacity: currentPercentage > 2 ? 1 : 0,
            y: currentPercentage > 2 ? 0 : -20,
          }}
          transition={{duration: 0.3}}
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg border border-slate-200 dark:border-slate-700">
            {/* Mini progress circle */}
            <svg className="w-5 h-5 -rotate-90" viewBox="0 0 24 24">
              <circle
                className="text-slate-200 dark:text-slate-700"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                r="10"
                cx="12"
                cy="12"
              />
              <motion.circle
                className="text-cyan-500 dark:text-cyan-400"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                r="10"
                cx="12"
                cy="12"
                strokeLinecap="round"
                style={{
                  pathLength: scrollYProgress,
                }}
                initial={{pathLength: 0}}
              />
            </svg>

            {/* Percentage text */}
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 tabular-nums min-w-[2.5ch] text-right">
              {currentPercentage}%
            </span>
          </div>
        </motion.div>
      )}
    </>
  );
}

export default ScrollProgress;
