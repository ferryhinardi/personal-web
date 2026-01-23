import {memo, useRef, type ReactNode} from 'react';
import {motion, useReducedMotion} from 'framer-motion';
import {useTiltEffect} from '@/hooks/useMousePosition';

interface TiltCardProps {
  /** Card content */
  children: ReactNode;
  /** Maximum tilt angle in degrees */
  maxTilt?: number;
  /** Perspective distance in pixels */
  perspective?: number;
  /** Scale on hover */
  scale?: number;
  /** Enable/disable the tilt effect */
  enabled?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Invert the tilt direction */
  reverse?: boolean;
  /** Enable glare effect */
  glare?: boolean;
  /** Maximum glare opacity */
  glareOpacity?: number;
  /** Card border radius */
  borderRadius?: string;
  /** Enable shadow on hover */
  shadow?: boolean;
}

/**
 * Glare overlay component
 */
function GlareOverlay({
  rotateX,
  rotateY,
  opacity,
  isHovering,
}: {
  rotateX: number;
  rotateY: number;
  opacity: number;
  isHovering: boolean;
}) {
  // Calculate glare position based on tilt
  const glareX = 50 + rotateY * 2;
  const glareY = 50 - rotateX * 2;

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-inherit"
      style={{borderRadius: 'inherit'}}
      animate={{
        opacity: isHovering ? opacity : 0,
      }}
      transition={{duration: 0.3}}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
        }}
      />
    </motion.div>
  );
}

/**
 * 3D tilt card component that responds to mouse movement.
 * Creates an interactive, engaging hover effect.
 * Respects reduced motion preferences.
 *
 * @example
 * ```tsx
 * <TiltCard maxTilt={15} glare shadow>
 *   <img src="profile.jpg" alt="Profile" />
 *   <h3>John Doe</h3>
 * </TiltCard>
 * ```
 */
function TiltCardComponent({
  children,
  maxTilt = 15,
  perspective = 1000,
  scale = 1.02,
  enabled = true,
  className = '',
  reverse = false,
  glare = false,
  glareOpacity = 0.3,
  borderRadius = '0.75rem',
  shadow = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const {rotateX, rotateY, isHovering} = useTiltEffect(ref, {
    maxTilt,
    reverse,
    smoothing: 0.1,
  });

  // Disabled or reduced motion: render without effects
  if (!enabled || shouldReduceMotion) {
    return (
      <div className={className} style={{borderRadius}}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        perspective,
        borderRadius,
        transformStyle: 'preserve-3d',
      }}
      animate={{
        rotateX: isHovering ? rotateX : 0,
        rotateY: isHovering ? rotateY : 0,
        scale: isHovering ? scale : 1,
        boxShadow: shadow && isHovering
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 12px 24px -8px rgba(0, 0, 0, 0.15)'
          : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 0.5,
      }}
    >
      {/* Card content */}
      <div style={{borderRadius}} className="relative z-10 overflow-hidden">
        {children}
      </div>

      {/* Glare effect */}
      {glare && (
        <GlareOverlay
          rotateX={rotateX}
          rotateY={rotateY}
          opacity={glareOpacity}
          isHovering={isHovering}
        />
      )}
    </motion.div>
  );
}

export const TiltCard = memo(TiltCardComponent);
export type {TiltCardProps};
