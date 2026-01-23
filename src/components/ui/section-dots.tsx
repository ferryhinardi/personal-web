import {memo, useEffect, useState, useCallback} from 'react';
import {motion, useReducedMotion, type Variants} from 'framer-motion';

interface Section {
  id: string;
  label: string;
}

interface SectionDotsProps {
  /** Sections to display */
  sections?: Section[];
  /** Position on screen */
  position?: 'left' | 'right';
  /** Additional CSS class */
  className?: string;
}

const defaultSections: Section[] = [
  {id: 'home', label: 'Home'},
  {id: 'about', label: 'About'},
  {id: 'resume', label: 'Resume'},
  {id: 'portfolio', label: 'Portfolio'},
  {id: 'contact', label: 'Contact'},
];

const containerVariants: Variants = {
  hidden: {opacity: 0, x: 20},
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const dotVariants: Variants = {
  hidden: {opacity: 0, scale: 0},
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
};

/**
 * Floating section dots navigation.
 * Shows current section and allows click to navigate.
 * Hidden on mobile devices.
 *
 * @example
 * ```tsx
 * <SectionDots position="right" />
 * ```
 */
function SectionDotsComponent({
  sections = defaultSections,
  position = 'right',
  className = '',
}: SectionDotsProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');
  const [isVisible, setIsVisible] = useState(false);

  // Track which section is in view
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
        {
          threshold: [0.3, 0.5, 0.7],
          rootMargin: '-10% 0px -10% 0px',
        },
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [sections]);

  // Show dots after scrolling past hero
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight * 0.5;
      setIsVisible(scrollY > heroHeight);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  }, []);

  const positionClasses = position === 'left' ? 'left-4 sm:left-6' : 'right-4 sm:right-6';

  return (
    <motion.nav
      className={`fixed top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4 ${positionClasses} ${className}`}
      variants={shouldReduceMotion ? undefined : containerVariants}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      aria-label="Section navigation"
    >
      {sections.map((section) => {
        const isActive = activeSection === section.id;

        return (
          <motion.button
            key={section.id}
            variants={shouldReduceMotion ? undefined : dotVariants}
            className="group relative flex items-center"
            onClick={() => scrollToSection(section.id)}
            aria-label={`Navigate to ${section.label}`}
            aria-current={isActive ? 'true' : undefined}
          >
            {/* Label tooltip */}
            <motion.span
              className={`absolute ${position === 'left' ? 'left-6' : 'right-6'} px-3 py-1.5 rounded-full bg-slate-900/90 dark:bg-white/90 text-white dark:text-slate-900 text-xs font-medium whitespace-nowrap pointer-events-none`}
              initial={{opacity: 0, scale: 0.8, x: position === 'left' ? -10 : 10}}
              whileHover={{opacity: 1, scale: 1, x: 0}}
              transition={{duration: 0.2}}
            >
              {section.label}
            </motion.span>

            {/* Dot */}
            <motion.span
              className={`relative w-3 h-3 rounded-full border-2 transition-colors duration-300 ${
                isActive
                  ? 'bg-cyan-500 border-cyan-500 dark:bg-cyan-400 dark:border-cyan-400'
                  : 'bg-transparent border-slate-400 dark:border-slate-500 group-hover:border-cyan-500 dark:group-hover:border-cyan-400'
              }`}
              whileHover={{scale: 1.3}}
              whileTap={{scale: 0.9}}
              transition={{type: 'spring', stiffness: 400, damping: 20}}
            >
              {/* Active ring effect */}
              {isActive && (
                <motion.span
                  className="absolute inset-0 rounded-full bg-cyan-500/30 dark:bg-cyan-400/30"
                  initial={{scale: 1, opacity: 1}}
                  animate={{scale: 2, opacity: 0}}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                />
              )}
            </motion.span>

            {/* Connecting line to next dot */}
            {sections.indexOf(section) < sections.length - 1 && (
              <span
                className={`absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-4 mt-0.5 transition-colors duration-300 ${
                  sections.findIndex((s) => s.id === activeSection) >
                  sections.indexOf(section)
                    ? 'bg-cyan-500/50 dark:bg-cyan-400/50'
                    : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
            )}
          </motion.button>
        );
      })}
    </motion.nav>
  );
}

export const SectionDots = memo(SectionDotsComponent);
export type {SectionDotsProps, Section};
