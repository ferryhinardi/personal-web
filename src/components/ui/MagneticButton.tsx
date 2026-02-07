import {memo, useRef, type ReactNode} from 'react';
import {motion, useReducedMotion} from 'framer-motion';
import {useMagneticEffect} from '@/hooks/useMousePosition';

interface MagneticButtonProps {
  /** Content to render inside the button */
  children: ReactNode;
  /** Additional CSS class */
  className?: string;
  /** Magnetic effect strength (0-1, default 0.35) */
  strength?: number;
  /** Maximum displacement in pixels (default 12) */
  maxDistance?: number;
  /** Radius around element that triggers effect (default 150) */
  triggerRadius?: number;
  /** Click handler */
  onClick?: () => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Button type attribute */
  type?: 'button' | 'submit' | 'reset';
  /** Accessible label */
  'aria-label'?: string;
  /** External link href - renders as anchor */
  href?: string;
  /** Open link in new tab */
  external?: boolean;
  /** HTML tag to use (default: button or anchor based on href) */
  as?: 'button' | 'a' | 'div';
}

/**
 * Button wrapper with magnetic hover effect.
 * The button follows the cursor with a subtle pull effect when hovered.
 * Respects reduced motion preferences.
 *
 * @example
 * ```tsx
 * <MagneticButton
 *   onClick={() => console.log('clicked')}
 *   className="px-6 py-3 bg-cyan-500 text-white rounded-full"
 * >
 *   Hover me
 * </MagneticButton>
 * ```
 */
function MagneticButtonComponent({
  children,
  className = '',
  strength = 0.35,
  maxDistance = 12,
  triggerRadius = 150,
  onClick,
  disabled = false,
  type = 'button',
  'aria-label': ariaLabel,
  href,
  external = false,
  as,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const {x, y, isActive} = useMagneticEffect(ref, {
    strength,
    maxDistance,
    triggerRadius,
  });

  // Determine which element to render
  const Tag = as ?? (href ? 'a' : 'button');
  const isLink = Tag === 'a';
  const isButton = Tag === 'button';

  // Common props
  const commonProps = {
    className: `inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 ${className}`,
    'aria-label': ariaLabel,
    ...(isButton && {type, disabled}),
    ...(isLink && href && {
      href,
      ...(external && {target: '_blank', rel: 'noopener noreferrer'}),
    }),
    ...(!isLink && onClick && !disabled && {onClick}),
  };

  // Reduced motion: render without magnetic effect
  if (shouldReduceMotion) {
    if (isLink) {
      return (
        <a {...commonProps} ref={ref as React.RefObject<HTMLAnchorElement>}>
          {children}
        </a>
      );
    }
    if (isButton) {
      return (
        <button {...commonProps} ref={ref as React.RefObject<HTMLButtonElement>}>
          {children}
        </button>
      );
    }
    return (
      <div {...commonProps} ref={ref as React.RefObject<HTMLDivElement>}>
        {children}
      </div>
    );
  }

  // Create motion component with magnetic effect
  const MotionComponent = motion[Tag as keyof typeof motion] as typeof motion.button;

  return (
    <MotionComponent
      ref={ref as React.RefObject<HTMLButtonElement>}
      {...commonProps}
      animate={{
        x,
        y,
        scale: isActive ? 1.02 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 350,
        damping: 25,
        mass: 0.5,
      }}
      whileTap={{scale: 0.98}}
    >
      {children}
    </MotionComponent>
  );
}

export const MagneticButton = memo(MagneticButtonComponent);
export type {MagneticButtonProps};
