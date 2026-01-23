import {memo} from 'react';
import {motion, useReducedMotion} from 'framer-motion';
import {useSimpleParallax} from '@/hooks/useParallax';

interface LayerConfig {
  id: string;
  speed: number;
  content: React.ReactNode;
  className?: string;
  zIndex?: number;
}

interface ParallaxBackgroundProps {
  /** Additional CSS class */
  className?: string;
  /** Override default layers */
  layers?: LayerConfig[];
}

/**
 * Gradient mesh background layer.
 * Creates an animated gradient effect.
 */
function GradientMeshLayer() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Primary gradient */}
      <div
        className="absolute inset-0 opacity-30 dark:opacity-40"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 40%, rgba(34, 211, 238, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 60%, rgba(59, 130, 246, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse 50% 30% at 50% 80%, rgba(147, 197, 253, 0.1) 0%, transparent 50%)
          `,
        }}
      />
      {/* Noise texture overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

/**
 * Large blurred circle shapes layer.
 */
function BlurredCirclesLayer() {
  return (
    <div className="absolute inset-0">
      {/* Cyan circle - top left */}
      <div
        className="absolute rounded-full"
        style={{
          width: '400px',
          height: '400px',
          left: '5%',
          top: '10%',
          background: 'rgba(34, 211, 238, 0.06)',
          filter: 'blur(80px)',
        }}
      />
      {/* Blue circle - bottom right */}
      <div
        className="absolute rounded-full"
        style={{
          width: '350px',
          height: '350px',
          right: '10%',
          bottom: '20%',
          background: 'rgba(59, 130, 246, 0.06)',
          filter: 'blur(70px)',
        }}
      />
      {/* Light blue circle - center */}
      <div
        className="absolute rounded-full"
        style={{
          width: '300px',
          height: '300px',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(147, 197, 253, 0.04)',
          filter: 'blur(60px)',
        }}
      />
    </div>
  );
}

/**
 * Geometric shapes layer (rings and triangles).
 */
function GeometricShapesLayer() {
  return (
    <div className="absolute inset-0">
      {/* Large ring - top right */}
      <div
        className="absolute rounded-full"
        style={{
          width: '150px',
          height: '150px',
          right: '15%',
          top: '20%',
          border: '1px solid rgba(34, 211, 238, 0.1)',
        }}
      />
      {/* Medium ring - bottom left */}
      <div
        className="absolute rounded-full"
        style={{
          width: '100px',
          height: '100px',
          left: '10%',
          bottom: '25%',
          border: '1px solid rgba(147, 197, 253, 0.08)',
        }}
      />
      {/* Small ring - center right */}
      <div
        className="absolute rounded-full"
        style={{
          width: '60px',
          height: '60px',
          right: '25%',
          top: '60%',
          border: '1px solid rgba(59, 130, 246, 0.12)',
        }}
      />
      {/* Triangle - bottom center */}
      <div
        className="absolute"
        style={{
          left: '40%',
          bottom: '15%',
          width: 0,
          height: 0,
          borderLeft: '25px solid transparent',
          borderRight: '25px solid transparent',
          borderBottom: '45px solid rgba(34, 211, 238, 0.08)',
        }}
      />
    </div>
  );
}

/**
 * Particle dots layer.
 */
function ParticleDotsLayer() {
  const dots = [
    {x: '20%', y: '15%', size: 4, opacity: 0.3},
    {x: '75%', y: '25%', size: 6, opacity: 0.25},
    {x: '85%', y: '70%', size: 5, opacity: 0.35},
    {x: '30%', y: '80%', size: 4, opacity: 0.3},
    {x: '60%', y: '45%', size: 3, opacity: 0.4},
    {x: '10%', y: '55%', size: 5, opacity: 0.25},
    {x: '45%', y: '20%', size: 4, opacity: 0.35},
    {x: '90%', y: '40%', size: 3, opacity: 0.3},
  ];

  return (
    <div className="absolute inset-0">
      {dots.map((dot, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-cyan-400/30 dark:bg-cyan-300/30"
          style={{
            width: dot.size,
            height: dot.size,
            left: dot.x,
            top: dot.y,
            opacity: dot.opacity,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Individual parallax layer wrapper.
 */
function ParallaxLayer({
  speed,
  children,
  className = '',
  zIndex = 0,
}: {
  speed: number;
  children: React.ReactNode;
  className?: string;
  zIndex?: number;
}) {
  const {ref, y} = useSimpleParallax(speed);

  return (
    <motion.div
      ref={ref}
      className={`absolute inset-0 will-change-transform ${className}`}
      style={{y, zIndex}}
    >
      {children}
    </motion.div>
  );
}

/**
 * Static layer wrapper (no parallax).
 */
function StaticLayer({
  children,
  className = '',
  zIndex = 0,
}: {
  children: React.ReactNode;
  className?: string;
  zIndex?: number;
}) {
  return (
    <div className={`absolute inset-0 ${className}`} style={{zIndex}}>
      {children}
    </div>
  );
}

/**
 * 4-layer parallax background system for the hero section.
 * - Layer 1 (speed 0.15): Gradient mesh background
 * - Layer 2 (speed 0.3): Large blurred circles
 * - Layer 3 (speed 0.5): Geometric rings and triangles
 * - Layer 4 (speed 0.7): Small particle dots
 *
 * Respects reduced motion preferences.
 */
function ParallaxBackgroundComponent({className = ''}: ParallaxBackgroundProps) {
  const shouldReduceMotion = useReducedMotion();

  // Use static layers when reduced motion is preferred
  const Layer = shouldReduceMotion ? StaticLayer : ParallaxLayer;

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* Layer 1: Gradient mesh (slowest) */}
      <Layer speed={0.15} zIndex={1}>
        <GradientMeshLayer />
      </Layer>

      {/* Layer 2: Blurred circles */}
      <Layer speed={0.3} zIndex={2}>
        <BlurredCirclesLayer />
      </Layer>

      {/* Layer 3: Geometric shapes */}
      <Layer speed={0.5} zIndex={3}>
        <GeometricShapesLayer />
      </Layer>

      {/* Layer 4: Particle dots (fastest) */}
      <Layer speed={0.7} zIndex={4}>
        <ParticleDotsLayer />
      </Layer>
    </div>
  );
}

export const ParallaxBackground = memo(ParallaxBackgroundComponent);
export type {ParallaxBackgroundProps, LayerConfig};
