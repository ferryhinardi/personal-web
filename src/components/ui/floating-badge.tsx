import {memo} from 'react';
import {motion, useReducedMotion, type Variants} from 'framer-motion';

type BadgeVariant = 'default' | 'outline';

interface FloatingBadgeProps {
  /** Badge text */
  children: string;
  /** Floating animation delay (for staggering) */
  delay?: number;
  /** Additional CSS class */
  className?: string;
  /** Disable floating animation */
  static?: boolean;
  /** Badge variant */
  variant?: BadgeVariant;
  /** Click handler */
  onClick?: () => void;
}

const floatVariants: Variants = {
  initial: {y: 0},
  float: (delay: number) => ({
    y: [-2, 2, -2],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
      delay,
    },
  }),
};

const hoverVariants: Variants = {
  rest: {
    scale: 1,
    y: 0,
  },
  hover: {
    scale: 1.1,
    y: -4,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 15,
    },
  },
};

const variantStyles: Record<BadgeVariant, string> = {
  default:
    'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800 hover:bg-cyan-100 dark:hover:bg-cyan-900/40',
  outline:
    'bg-transparent border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-cyan-500 dark:hover:border-cyan-500 hover:bg-cyan-500/10',
};

/**
 * Floating badge component for tech stack and skill tags.
 * Features subtle floating animation and hover effects.
 * Respects reduced motion preferences.
 *
 * @example
 * ```tsx
 * <div className="flex flex-wrap gap-2">
 *   {['React', 'TypeScript', 'Node.js'].map((tech, i) => (
 *     <FloatingBadge key={tech} delay={i * 0.2}>
 *       {tech}
 *     </FloatingBadge>
 *   ))}
 * </div>
 * ```
 */
function FloatingBadgeComponent({
  children,
  delay = 0,
  className = '',
  static: isStatic = false,
  variant = 'default',
  onClick,
}: FloatingBadgeProps) {
  const shouldReduceMotion = useReducedMotion();
  const disableFloat = isStatic || shouldReduceMotion;

  return (
    <motion.span
      className={`inline-block px-4 py-2 rounded-full text-sm font-medium border cursor-default transition-colors ${variantStyles[variant]} ${onClick ? 'cursor-pointer' : ''} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 ${className}`}
      variants={disableFloat ? hoverVariants : floatVariants}
      initial={disableFloat ? 'rest' : 'initial'}
      animate={disableFloat ? undefined : 'float'}
      whileHover={disableFloat ? 'hover' : {scale: 1.1, y: -4}}
      custom={delay}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {children}
    </motion.span>
  );
}

export const FloatingBadge = memo(FloatingBadgeComponent);
export type {FloatingBadgeProps, BadgeVariant};
