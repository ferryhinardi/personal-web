import {memo, useMemo} from 'react';
import {motion, useReducedMotion, type TargetAndTransition} from 'framer-motion';

// Define animation presets inline with proper typing
const floatingAnimations = {
  shape1: {
    y: [0, -30, 0],
    x: [0, 15, 0],
    rotate: [0, 10, 0],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
  shape2: {
    y: [0, 20, 0],
    x: [0, -20, 0],
    rotate: [0, -15, 0],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: 'easeInOut' as const,
      delay: 1,
    },
  },
  shape3: {
    y: [0, -25, 0],
    x: [0, 10, 0],
    scale: [1, 1.1, 1],
    transition: {
      duration: 7,
      repeat: Infinity,
      ease: 'easeInOut' as const,
      delay: 2,
    },
  },
} satisfies Record<string, TargetAndTransition>;

type AnimationKey = keyof typeof floatingAnimations;

interface ShapeConfig {
  id: string;
  type: 'circle' | 'ring' | 'triangle' | 'dot';
  size: number;
  position: {x: string; y: string};
  color: string;
  animation: AnimationKey;
  blur?: number;
  opacity?: number;
  /** Show on mobile (default false for performance) */
  showOnMobile?: boolean;
}

const defaultShapes: ShapeConfig[] = [
  // Large circles (background layer)
  {
    id: 'circle-1',
    type: 'circle',
    size: 300,
    position: {x: '10%', y: '20%'},
    color: 'rgba(34, 211, 238, 0.08)',
    animation: 'shape1',
    blur: 60,
    showOnMobile: true,
  },
  {
    id: 'circle-2',
    type: 'circle',
    size: 250,
    position: {x: '75%', y: '60%'},
    color: 'rgba(59, 130, 246, 0.08)',
    animation: 'shape2',
    blur: 50,
    showOnMobile: true,
  },
  // Rings (mid-layer)
  {
    id: 'ring-1',
    type: 'ring',
    size: 120,
    position: {x: '85%', y: '15%'},
    color: 'rgba(34, 211, 238, 0.15)',
    animation: 'shape3',
    showOnMobile: true,
  },
  {
    id: 'ring-2',
    type: 'ring',
    size: 80,
    position: {x: '5%', y: '70%'},
    color: 'rgba(147, 197, 253, 0.12)',
    animation: 'shape1',
    showOnMobile: true,
  },
  {
    id: 'ring-3',
    type: 'ring',
    size: 60,
    position: {x: '60%', y: '85%'},
    color: 'rgba(34, 211, 238, 0.1)',
    animation: 'shape2',
    showOnMobile: false,
  },
  // Triangles
  {
    id: 'triangle-1',
    type: 'triangle',
    size: 40,
    position: {x: '20%', y: '80%'},
    color: 'rgba(59, 130, 246, 0.2)',
    animation: 'shape2',
    showOnMobile: false,
  },
  {
    id: 'triangle-2',
    type: 'triangle',
    size: 30,
    position: {x: '90%', y: '45%'},
    color: 'rgba(34, 211, 238, 0.15)',
    animation: 'shape3',
    showOnMobile: false,
  },
  // Dots (foreground particles)
  {
    id: 'dot-1',
    type: 'dot',
    size: 8,
    position: {x: '30%', y: '25%'},
    color: 'rgba(34, 211, 238, 0.4)',
    animation: 'shape1',
    showOnMobile: false,
  },
  {
    id: 'dot-2',
    type: 'dot',
    size: 6,
    position: {x: '70%', y: '30%'},
    color: 'rgba(147, 197, 253, 0.5)',
    animation: 'shape3',
    showOnMobile: false,
  },
  {
    id: 'dot-3',
    type: 'dot',
    size: 10,
    position: {x: '15%', y: '50%'},
    color: 'rgba(59, 130, 246, 0.35)',
    animation: 'shape2',
    showOnMobile: false,
  },
  {
    id: 'dot-4',
    type: 'dot',
    size: 5,
    position: {x: '55%', y: '15%'},
    color: 'rgba(34, 211, 238, 0.45)',
    animation: 'shape1',
    showOnMobile: false,
  },
  {
    id: 'dot-5',
    type: 'dot',
    size: 7,
    position: {x: '80%', y: '75%'},
    color: 'rgba(147, 197, 253, 0.4)',
    animation: 'shape3',
    showOnMobile: false,
  },
];

interface FloatingShapesProps {
  /** Custom shapes configuration (overrides defaults) */
  shapes?: ShapeConfig[];
  /** Additional CSS class */
  className?: string;
}

/**
 * Renders floating geometric shapes with parallax-like animations.
 * Respects reduced motion preferences and reduces shapes on mobile.
 */
function FloatingShapesComponent({
  shapes = defaultShapes,
  className = '',
}: FloatingShapesProps) {
  const shouldReduceMotion = useReducedMotion();

  // Filter shapes for mobile
  const visibleShapes = useMemo(() => {
    if (typeof window === 'undefined') return shapes;
    const isMobile = window.innerWidth < 768;
    return isMobile ? shapes.filter((s) => s.showOnMobile) : shapes;
  }, [shapes]);

  if (shouldReduceMotion) {
    // Render static shapes without animation
    return (
      <div
        className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
        aria-hidden="true"
      >
        {visibleShapes.map((shape) => (
          <div
            key={shape.id}
            className="absolute"
            style={{
              left: shape.position.x,
              top: shape.position.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Shape config={shape} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {visibleShapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute will-change-transform"
          style={{
            left: shape.position.x,
            top: shape.position.y,
            transform: 'translate(-50%, -50%)',
          }}
          animate={floatingAnimations[shape.animation]}
        >
          <Shape config={shape} />
        </motion.div>
      ))}
    </div>
  );
}

/** Individual shape renderer */
function Shape({config}: {config: ShapeConfig}) {
  const {type, size, color, blur = 0, opacity = 1} = config;

  const baseStyle: React.CSSProperties = {
    width: size,
    height: size,
    opacity,
    filter: blur ? `blur(${blur}px)` : undefined,
  };

  switch (type) {
    case 'circle':
      return (
        <div
          className="rounded-full"
          style={{
            ...baseStyle,
            backgroundColor: color,
          }}
        />
      );

    case 'ring':
      return (
        <div
          className="rounded-full"
          style={{
            ...baseStyle,
            border: `2px solid ${color}`,
            backgroundColor: 'transparent',
          }}
        />
      );

    case 'triangle':
      return (
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: `${size / 2}px solid transparent`,
            borderRight: `${size / 2}px solid transparent`,
            borderBottom: `${size}px solid ${color}`,
            opacity,
            filter: blur ? `blur(${blur}px)` : undefined,
          }}
        />
      );

    case 'dot':
      return (
        <div
          className="rounded-full"
          style={{
            ...baseStyle,
            backgroundColor: color,
          }}
        />
      );

    default:
      return null;
  }
}

export const FloatingShapes = memo(FloatingShapesComponent);
export type {ShapeConfig, FloatingShapesProps};
