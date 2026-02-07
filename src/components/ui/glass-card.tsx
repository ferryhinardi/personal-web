import {memo, type ReactNode} from 'react';
import {motion, useReducedMotion, type Variants} from 'framer-motion';
import {cn} from '@/lib/utils';

interface GlassCardProps {
  /** Card content */
  children: ReactNode;
  /** Additional CSS class */
  className?: string;
  /** Enable gradient border animation */
  gradientBorder?: boolean;
  /** Enable hover glow effect */
  hoverGlow?: boolean;
  /** Blur intensity (default: 12) */
  blur?: number;
  /** Background opacity (0-100, default: 10) */
  backgroundOpacity?: number;
  /** Enable noise texture overlay */
  noise?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** As HTML element */
  as?: 'div' | 'article' | 'section';
}

const cardVariants: Variants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.02,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
};

/**
 * Glassmorphism card component with gradient border animation,
 * backdrop blur, and optional noise texture.
 *
 * @example
 * ```tsx
 * <GlassCard gradientBorder hoverGlow>
 *   <h3>Glass Effect</h3>
 *   <p>Beautiful glassmorphism design</p>
 * </GlassCard>
 * ```
 */
function GlassCardComponent({
  children,
  className = '',
  gradientBorder = false,
  hoverGlow = false,
  blur = 12,
  backgroundOpacity = 10,
  noise = false,
  onClick,
  as: Component = 'div',
}: GlassCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const MotionComponent = motion[Component];

  // Calculate background opacity as CSS value
  const bgOpacity = backgroundOpacity / 100;

  return (
    <MotionComponent
      className={cn(
        'relative overflow-hidden rounded-2xl',
        onClick &&
          'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
        className,
      )}
      variants={shouldReduceMotion ? undefined : cardVariants}
      initial="rest"
      whileHover={onClick || hoverGlow ? 'hover' : undefined}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {/* Gradient border (animated) */}
      {gradientBorder && (
        <div className="absolute inset-0 rounded-2xl p-[1px] overflow-hidden">
          <motion.div
            className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent,cyan,blue,purple,pink,transparent)]"
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    rotate: 360,
                  }
            }
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>
      )}

      {/* Glass background */}
      <div
        className={cn(
          'relative h-full rounded-2xl border border-white/20 dark:border-white/10',
          gradientBorder && 'border-0',
        )}
        style={{
          backgroundColor: `rgba(255, 255, 255, ${bgOpacity})`,
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
        }}
      >
        {/* Dark mode background adjustment */}
        <div
          className="absolute inset-0 rounded-2xl dark:block hidden"
          style={{
            backgroundColor: `rgba(15, 23, 42, ${bgOpacity * 0.8})`,
          }}
        />

        {/* Noise texture overlay */}
        {noise && (
          <div
            className="absolute inset-0 rounded-2xl opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        )}

        {/* Hover glow effect */}
        {hoverGlow && (
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(6, 182, 212, 0.15), transparent 40%)',
            }}
            whileHover={{opacity: 1}}
            transition={{duration: 0.3}}
          />
        )}

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    </MotionComponent>
  );
}

export const GlassCard = memo(GlassCardComponent);
export type {GlassCardProps};
