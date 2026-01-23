import {memo} from 'react';
import {motion, useReducedMotion} from 'framer-motion';
import {useSimpleParallax} from '@/hooks/useParallax';

type TransitionType = 'wave' | 'curve' | 'tilt' | 'zigzag' | 'none';
type TransitionPosition = 'top' | 'bottom';

interface SectionTransitionProps {
  /** Type of transition shape */
  type?: TransitionType;
  /** Position of the transition (top or bottom of section) */
  position?: TransitionPosition;
  /** Fill color (CSS color value) */
  fillColor?: string;
  /** Background color (CSS color value) */
  backgroundColor?: string;
  /** Height of the transition in pixels */
  height?: number;
  /** Enable parallax effect on the transition */
  parallax?: boolean;
  /** Parallax speed (0-1) */
  parallaxSpeed?: number;
  /** Additional CSS class */
  className?: string;
  /** Flip the shape horizontally */
  flip?: boolean;
}

/**
 * Wave SVG path
 */
function WavePath() {
  return (
    <path
      d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,90.7C960,96,1056,128,1152,138.7C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      fill="currentColor"
    />
  );
}

/**
 * Curve SVG path
 */
function CurvePath() {
  return (
    <path
      d="M0,160L1440,64L1440,320L0,320Z"
      fill="currentColor"
    />
  );
}

/**
 * Tilt SVG path
 */
function TiltPath() {
  return (
    <path
      d="M0,224L1440,96L1440,320L0,320Z"
      fill="currentColor"
    />
  );
}

/**
 * Zigzag SVG path
 */
function ZigzagPath() {
  return (
    <path
      d="M0,128L120,160L240,128L360,160L480,128L600,160L720,128L840,160L960,128L1080,160L1200,128L1320,160L1440,128L1440,320L0,320Z"
      fill="currentColor"
    />
  );
}

/**
 * Get the appropriate path component based on type
 */
function getPathComponent(type: TransitionType) {
  switch (type) {
    case 'wave':
      return <WavePath />;
    case 'curve':
      return <CurvePath />;
    case 'tilt':
      return <TiltPath />;
    case 'zigzag':
      return <ZigzagPath />;
    case 'none':
    default:
      return null;
  }
}

/**
 * Parallax wrapper for the SVG
 */
function ParallaxWrapper({
  children,
  speed,
  enabled,
}: {
  children: React.ReactNode;
  speed: number;
  enabled: boolean;
}) {
  const {ref, y} = useSimpleParallax(speed);
  const shouldReduceMotion = useReducedMotion();

  if (!enabled || shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div ref={ref} style={{y}} className="will-change-transform">
      {children}
    </motion.div>
  );
}

/**
 * Section transition component with wave/curve dividers.
 * Creates smooth visual transitions between sections.
 *
 * @example
 * ```tsx
 * // Between hero and about section
 * <SectionTransition
 *   type="wave"
 *   position="top"
 *   fillColor="rgb(249, 250, 251)"
 *   backgroundColor="transparent"
 * />
 * ```
 */
function SectionTransitionComponent({
  type = 'wave',
  position = 'bottom',
  fillColor = 'currentColor',
  backgroundColor = 'transparent',
  height = 80,
  parallax = false,
  parallaxSpeed = 0.2,
  className = '',
  flip = false,
}: SectionTransitionProps) {
  if (type === 'none') return null;

  const pathComponent = getPathComponent(type);
  if (!pathComponent) return null;

  // Determine rotation based on position and flip
  const isFlipped = position === 'top' ? !flip : flip;

  return (
    <div
      className={`relative overflow-hidden pointer-events-none ${className}`}
      style={{
        backgroundColor,
        height,
        marginTop: position === 'top' ? -1 : 0,
        marginBottom: position === 'bottom' ? -1 : 0,
      }}
      aria-hidden="true"
    >
      <ParallaxWrapper speed={parallaxSpeed} enabled={parallax}>
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="absolute w-full"
          style={{
            height: height * 1.5,
            color: fillColor,
            transform: isFlipped ? 'rotate(180deg)' : 'none',
            top: position === 'top' ? 0 : 'auto',
            bottom: position === 'bottom' ? 0 : 'auto',
          }}
        >
          {pathComponent}
        </svg>
      </ParallaxWrapper>
    </div>
  );
}

export const SectionTransition = memo(SectionTransitionComponent);
export type {SectionTransitionProps, TransitionType, TransitionPosition};
