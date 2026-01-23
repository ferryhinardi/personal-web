import {useState, useEffect, useRef} from 'react';
import {
  motion,
  useReducedMotion,
  type Variants,
  type Transition,
  type TargetAndTransition,
} from 'framer-motion';
import {cn} from '@/lib/utils';

type RevealDirection = 'left' | 'right' | 'top' | 'bottom' | 'center';
type KenBurnsDirection = 'zoom-in' | 'zoom-out' | 'pan-left' | 'pan-right' | 'pan-up' | 'pan-down';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  onLoad?: () => void;
  /** Enable responsive images (mobile/tablet/desktop) */
  responsive?: boolean;
  /** Use WebP format with fallback */
  useWebP?: boolean;
  /** Enable Ken Burns effect (slow pan/zoom) */
  kenBurns?: boolean;
  /** Ken Burns effect direction */
  kenBurnsDirection?: KenBurnsDirection;
  /** Ken Burns animation duration in seconds */
  kenBurnsDuration?: number;
  /** Enable clip-path reveal animation on load */
  reveal?: boolean;
  /** Reveal animation direction */
  revealDirection?: RevealDirection;
  /** Reveal animation duration in seconds */
  revealDuration?: number;
  /** Enable parallax zoom on scroll */
  parallaxZoom?: boolean;
  /** Parallax zoom intensity (0-1) */
  parallaxIntensity?: number;
}

// Reveal animation variants using clip-path
const getRevealVariants = (direction: RevealDirection): Variants => {
  const clipPaths: Record<RevealDirection, {hidden: string; visible: string}> = {
    left: {
      hidden: 'inset(0 100% 0 0)',
      visible: 'inset(0 0% 0 0)',
    },
    right: {
      hidden: 'inset(0 0 0 100%)',
      visible: 'inset(0 0 0 0%)',
    },
    top: {
      hidden: 'inset(0 0 100% 0)',
      visible: 'inset(0 0 0% 0)',
    },
    bottom: {
      hidden: 'inset(100% 0 0 0)',
      visible: 'inset(0% 0 0 0)',
    },
    center: {
      hidden: 'inset(50% 50% 50% 50%)',
      visible: 'inset(0% 0% 0% 0%)',
    },
  };

  return {
    hidden: {
      clipPath: clipPaths[direction].hidden,
      opacity: 0,
    },
    visible: {
      clipPath: clipPaths[direction].visible,
      opacity: 1,
    },
  };
};

// Ken Burns animation keyframes
const getKenBurnsAnimation = (
  direction: KenBurnsDirection,
  duration: number,
): {animate: TargetAndTransition; transition: Transition} => {
  const animations: Record<KenBurnsDirection, TargetAndTransition> = {
    'zoom-in': {
      scale: [1, 1.15],
    },
    'zoom-out': {
      scale: [1.15, 1],
    },
    'pan-left': {
      x: ['0%', '-5%'],
      scale: [1, 1.1],
    },
    'pan-right': {
      x: ['0%', '5%'],
      scale: [1, 1.1],
    },
    'pan-up': {
      y: ['0%', '-5%'],
      scale: [1, 1.1],
    },
    'pan-down': {
      y: ['0%', '5%'],
      scale: [1, 1.1],
    },
  };

  return {
    animate: animations[direction],
    transition: {
      duration,
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'reverse',
    },
  };
};

/**
 * Optimized image component with lazy loading, blur-up effect, WebP support,
 * Ken Burns effect, and reveal animations.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <OptimizedImage src="/hero.jpg" alt="Hero" />
 *
 * // With Ken Burns effect
 * <OptimizedImage
 *   src="/hero.jpg"
 *   alt="Hero"
 *   kenBurns
 *   kenBurnsDirection="zoom-in"
 *   kenBurnsDuration={20}
 * />
 *
 * // With reveal animation
 * <OptimizedImage
 *   src="/hero.jpg"
 *   alt="Hero"
 *   reveal
 *   revealDirection="left"
 *   revealDuration={0.8}
 * />
 * ```
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  imgClassName,
  onLoad,
  responsive = true,
  useWebP = true,
  kenBurns = false,
  kenBurnsDirection = 'zoom-in',
  kenBurnsDuration = 20,
  reveal = false,
  revealDirection = 'left',
  revealDuration = 0.8,
  parallaxZoom = false,
  parallaxIntensity = 0.1,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Intersection observer for lazy loading
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
      },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Parallax zoom scroll handler
  useEffect(() => {
    if (!parallaxZoom || shouldReduceMotion || !containerRef.current) return;

    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate how far through the viewport the element is
      const progress = 1 - (rect.top + rect.height) / (windowHeight + rect.height);
      setScrollProgress(Math.max(0, Math.min(1, progress)));
    };

    window.addEventListener('scroll', handleScroll, {passive: true});
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, [parallaxZoom, shouldReduceMotion]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Generate WebP and responsive image paths
  const getImagePaths = () => {
    const basePath = src.substring(0, src.lastIndexOf('.'));

    return {
      webp: `${basePath}.webp`,
      webpMobile: `${basePath}-mobile.webp`,
      webpTablet: `${basePath}-tablet.webp`,
      original: src,
    };
  };

  const paths = getImagePaths();

  // Calculate parallax zoom scale
  const parallaxScale = parallaxZoom ? 1 + scrollProgress * parallaxIntensity : 1;

  // Ken Burns animation props
  const kenBurnsProps =
    kenBurns && isLoaded && !shouldReduceMotion
      ? getKenBurnsAnimation(kenBurnsDirection, kenBurnsDuration)
      : null;

  // Reveal animation variants
  const revealVariants = reveal ? getRevealVariants(revealDirection) : undefined;

  // Determine if we should use motion.img
  const useMotion = (kenBurns || reveal || parallaxZoom) && !shouldReduceMotion;

  const imageStyles = {
    ...(parallaxZoom && !shouldReduceMotion ? {scale: parallaxScale} : {}),
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden bg-slate-200 dark:bg-slate-700',
        className,
      )}
      style={{aspectRatio: width && height ? `${width}/${height}` : undefined}}
    >
      {isInView && (
        <picture>
          {useWebP && responsive && (
            <>
              {/* Mobile WebP */}
              <source
                srcSet={paths.webpMobile}
                media="(max-width: 640px)"
                type="image/webp"
              />
              {/* Tablet WebP */}
              <source
                srcSet={paths.webpTablet}
                media="(max-width: 1024px)"
                type="image/webp"
              />
              {/* Desktop WebP */}
              <source srcSet={paths.webp} type="image/webp" />
            </>
          )}
          {useWebP && !responsive && (
            <source srcSet={paths.webp} type="image/webp" />
          )}
          {/* Fallback to original format */}
          {useMotion ? (
            <motion.img
              src={paths.original}
              alt={alt}
              width={width}
              height={height}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              onLoad={handleLoad}
              className={cn(
                'w-full h-full object-cover',
                !reveal && 'transition-opacity duration-300',
                !reveal && (isLoaded ? 'opacity-100' : 'opacity-0'),
                imgClassName,
              )}
              style={imageStyles}
              variants={revealVariants}
              initial={reveal ? 'hidden' : undefined}
              animate={
                reveal && isLoaded
                  ? 'visible'
                  : kenBurnsProps
                    ? kenBurnsProps.animate
                    : undefined
              }
              transition={
                reveal
                  ? {
                      duration: revealDuration,
                      ease: [0.4, 0, 0.2, 1],
                    }
                  : kenBurnsProps?.transition
              }
            />
          ) : (
            <img
              src={paths.original}
              alt={alt}
              width={width}
              height={height}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              onLoad={handleLoad}
              className={cn(
                'w-full h-full object-cover transition-opacity duration-300',
                isLoaded ? 'opacity-100' : 'opacity-0',
                imgClassName,
              )}
            />
          )}
        </picture>
      )}

      {/* Shimmer loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800" />
          <div
            className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{
              animationDuration: '1.5s',
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
            }}
          />
        </div>
      )}
    </div>
  );
}

export default OptimizedImage;
