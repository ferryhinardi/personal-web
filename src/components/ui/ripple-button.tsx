import {memo, useState, useCallback, type ReactNode, type MouseEvent as ReactMouseEvent} from 'react';
import {motion, AnimatePresence, useReducedMotion} from 'framer-motion';
import {cn} from '@/lib/utils';

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface RippleButtonProps {
  /** Button content */
  children: ReactNode;
  /** Additional CSS class */
  className?: string;
  /** Ripple color */
  rippleColor?: string;
  /** Ripple duration in seconds */
  duration?: number;
  /** Disable ripple effect */
  disabled?: boolean;
  /** Click handler */
  onClick?: (e: ReactMouseEvent<HTMLElement>) => void;
}

/**
 * Wrapper component that adds a material-design ripple effect to any element.
 * Respects reduced motion preferences.
 *
 * @example
 * ```tsx
 * <RippleButton onClick={handleClick}>
 *   <Button>Click me</Button>
 * </RippleButton>
 * ```
 */
function RippleButtonComponent({
  children,
  className = '',
  rippleColor = 'rgba(255, 255, 255, 0.4)',
  duration = 0.6,
  disabled = false,
  onClick,
}: RippleButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const addRipple = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      if (disabled || shouldReduceMotion) {
        onClick?.(e);
        return;
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate ripple size to cover entire button
      const size = Math.max(rect.width, rect.height) * 2;

      const newRipple: Ripple = {
        id: Date.now(),
        x,
        y,
        size,
      };

      setRipples((prev) => [...prev, newRipple]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, duration * 1000);

      onClick?.(e);
    },
    [disabled, shouldReduceMotion, duration, onClick],
  );

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
        className,
      )}
      onClick={addRipple}
      role="button"
      tabIndex={0}
    >
      {children}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x - ripple.size / 2,
              top: ripple.y - ripple.size / 2,
              width: ripple.size,
              height: ripple.size,
              backgroundColor: rippleColor,
            }}
            initial={{scale: 0, opacity: 0.5}}
            animate={{scale: 1, opacity: 0}}
            exit={{opacity: 0}}
            transition={{duration, ease: 'easeOut'}}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export const RippleButton = memo(RippleButtonComponent);
export type {RippleButtonProps};
