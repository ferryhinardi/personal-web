import {useState, useEffect, useCallback, useRef} from 'react';
import {useReducedMotion} from 'framer-motion';

export interface MousePosition {
  /** Absolute X position in viewport */
  x: number;
  /** Absolute Y position in viewport */
  y: number;
  /** Normalized X position (-1 to 1, 0 = center) */
  normalizedX: number;
  /** Normalized Y position (-1 to 1, 0 = center) */
  normalizedY: number;
  /** X position relative to element (if ref provided) */
  elementX: number;
  /** Y position relative to element (if ref provided) */
  elementY: number;
  /** Normalized X relative to element (-1 to 1) */
  elementNormalizedX: number;
  /** Normalized Y relative to element (-1 to 1) */
  elementNormalizedY: number;
  /** Whether mouse is currently over the element */
  isHovering: boolean;
}

export interface UseMousePositionOptions {
  /** Target element ref for relative positioning */
  targetRef?: React.RefObject<HTMLElement | null>;
  /** Smoothing factor (0-1, higher = smoother but more lag) */
  smoothing?: number;
  /** Whether to track mouse movement (can be disabled for performance) */
  enabled?: boolean;
  /** Only track when hovering over target element */
  onlyWhenHovering?: boolean;
}

const DEFAULT_POSITION: MousePosition = {
  x: 0,
  y: 0,
  normalizedX: 0,
  normalizedY: 0,
  elementX: 0,
  elementY: 0,
  elementNormalizedX: 0,
  elementNormalizedY: 0,
  isHovering: false,
};

/**
 * Custom hook for tracking mouse position with various coordinate systems.
 * Useful for interactive effects like magnetic buttons, cursor followers, etc.
 * Respects user's reduced motion preferences.
 *
 * @example
 * ```tsx
 * // Basic usage - track globally
 * const {normalizedX, normalizedY} = useMousePosition();
 *
 * // Track relative to an element
 * const ref = useRef<HTMLDivElement>(null);
 * const {elementNormalizedX, elementNormalizedY, isHovering} = useMousePosition({
 *   targetRef: ref,
 * });
 * ```
 */
export function useMousePosition(
  options: UseMousePositionOptions = {},
): MousePosition {
  const {
    targetRef,
    smoothing = 0,
    enabled = true,
    onlyWhenHovering = false,
  } = options;

  const [position, setPosition] = useState<MousePosition>(DEFAULT_POSITION);
  const smoothedPosition = useRef<MousePosition>(DEFAULT_POSITION);
  const animationFrameId = useRef<number | null>(null);
  const isHoveringRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  // Interpolate between current and target values
  const lerp = useCallback(
    (current: number, target: number, factor: number) => {
      return current + (target - current) * factor;
    },
    [],
  );

  // Apply smoothing to position updates
  const updateSmoothedPosition = useCallback(
    (newPosition: MousePosition) => {
      if (smoothing === 0) {
        smoothedPosition.current = newPosition;
        setPosition(newPosition);
        return;
      }

      const factor = 1 - smoothing;
      const current = smoothedPosition.current;

      smoothedPosition.current = {
        ...newPosition,
        x: lerp(current.x, newPosition.x, factor),
        y: lerp(current.y, newPosition.y, factor),
        normalizedX: lerp(current.normalizedX, newPosition.normalizedX, factor),
        normalizedY: lerp(current.normalizedY, newPosition.normalizedY, factor),
        elementX: lerp(current.elementX, newPosition.elementX, factor),
        elementY: lerp(current.elementY, newPosition.elementY, factor),
        elementNormalizedX: lerp(
          current.elementNormalizedX,
          newPosition.elementNormalizedX,
          factor,
        ),
        elementNormalizedY: lerp(
          current.elementNormalizedY,
          newPosition.elementNormalizedY,
          factor,
        ),
      };

      setPosition(smoothedPosition.current);
    },
    [smoothing, lerp],
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!enabled || shouldReduceMotion) return;

      // Cancel any pending animation frame
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }

      animationFrameId.current = requestAnimationFrame(() => {
        const {clientX, clientY} = event;
        const {innerWidth, innerHeight} = window;

        // Calculate normalized viewport coordinates (-1 to 1)
        const normalizedX = (clientX / innerWidth) * 2 - 1;
        const normalizedY = (clientY / innerHeight) * 2 - 1;

        let elementX = 0;
        let elementY = 0;
        let elementNormalizedX = 0;
        let elementNormalizedY = 0;
        let isHovering = isHoveringRef.current;

        // Calculate element-relative coordinates if target provided
        if (targetRef?.current) {
          const rect = targetRef.current.getBoundingClientRect();
          elementX = clientX - rect.left;
          elementY = clientY - rect.top;

          // Calculate normalized element coordinates (-1 to 1, 0 = center)
          elementNormalizedX = (elementX / rect.width) * 2 - 1;
          elementNormalizedY = (elementY / rect.height) * 2 - 1;

          // Check if mouse is within element bounds
          isHovering =
            clientX >= rect.left &&
            clientX <= rect.right &&
            clientY >= rect.top &&
            clientY <= rect.bottom;
        }

        // If onlyWhenHovering is true and not hovering, don't update
        if (onlyWhenHovering && !isHovering) {
          return;
        }

        const newPosition: MousePosition = {
          x: clientX,
          y: clientY,
          normalizedX,
          normalizedY,
          elementX,
          elementY,
          elementNormalizedX,
          elementNormalizedY,
          isHovering,
        };

        updateSmoothedPosition(newPosition);
      });
    },
    [
      enabled,
      shouldReduceMotion,
      targetRef,
      onlyWhenHovering,
      updateSmoothedPosition,
    ],
  );

  const handleMouseEnter = useCallback(() => {
    isHoveringRef.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isHoveringRef.current = false;
    setPosition((prev) => ({...prev, isHovering: false}));
  }, []);

  useEffect(() => {
    if (!enabled || shouldReduceMotion) {
      return;
    }

    window.addEventListener('mousemove', handleMouseMove, {passive: true});

    // Add hover listeners to target element
    const target = targetRef?.current;
    if (target) {
      target.addEventListener('mouseenter', handleMouseEnter);
      target.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (target) {
        target.removeEventListener('mouseenter', handleMouseEnter);
        target.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [
    enabled,
    shouldReduceMotion,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    targetRef,
  ]);

  // Return default position if reduced motion is preferred
  if (shouldReduceMotion) {
    return DEFAULT_POSITION;
  }

  return position;
}

/**
 * Hook for creating magnetic button/element effects.
 * Returns style transform values based on mouse proximity.
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLButtonElement>(null);
 * const {x, y, isActive} = useMagneticEffect(ref, {strength: 0.5});
 *
 * return (
 *   <motion.button
 *     ref={ref}
 *     style={{x, y}}
 *   >
 *     Hover me
 *   </motion.button>
 * );
 * ```
 */
export function useMagneticEffect(
  ref: React.RefObject<HTMLElement | null>,
  options: {
    /** Strength of the magnetic pull (0-1) */
    strength?: number;
    /** Maximum displacement in pixels */
    maxDistance?: number;
    /** Radius around element that triggers effect */
    triggerRadius?: number;
  } = {},
) {
  const {strength = 0.3, maxDistance = 20, triggerRadius = 100} = options;

  const mousePosition = useMousePosition({targetRef: ref});
  const [transform, setTransform] = useState({x: 0, y: 0, isActive: false});

  useEffect(() => {
    if (!ref.current || !mousePosition.isHovering) {
      // Animate back to center when not hovering
      setTransform({x: 0, y: 0, isActive: false});
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = mousePosition.x - centerX;
    const distanceY = mousePosition.y - centerY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < triggerRadius) {
      // Calculate magnetic pull based on distance
      const pullStrength = (1 - distance / triggerRadius) * strength;
      const x = Math.max(
        -maxDistance,
        Math.min(maxDistance, distanceX * pullStrength),
      );
      const y = Math.max(
        -maxDistance,
        Math.min(maxDistance, distanceY * pullStrength),
      );

      setTransform({x, y, isActive: true});
    } else {
      setTransform({x: 0, y: 0, isActive: false});
    }
  }, [mousePosition, ref, strength, maxDistance, triggerRadius]);

  return transform;
}

/**
 * Hook for creating 3D tilt effect on hover.
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * const {rotateX, rotateY, isHovering} = useTiltEffect(ref, {maxTilt: 15});
 *
 * return (
 *   <motion.div
 *     ref={ref}
 *     style={{rotateX, rotateY, transformPerspective: 1000}}
 *   >
 *     3D Card
 *   </motion.div>
 * );
 * ```
 */
export function useTiltEffect(
  ref: React.RefObject<HTMLElement | null>,
  options: {
    /** Maximum tilt angle in degrees */
    maxTilt?: number;
    /** Invert the tilt direction */
    reverse?: boolean;
    /** Smoothing factor */
    smoothing?: number;
  } = {},
) {
  const {maxTilt = 15, reverse = false, smoothing = 0.2} = options;

  const mousePosition = useMousePosition({
    targetRef: ref,
    smoothing,
    onlyWhenHovering: true,
  });

  const multiplier = reverse ? -1 : 1;

  if (!mousePosition.isHovering) {
    return {
      rotateX: 0,
      rotateY: 0,
      isHovering: false,
    };
  }

  // Calculate tilt angles based on normalized element coordinates
  // rotateX is based on Y position (tilts up/down)
  // rotateY is based on X position (tilts left/right)
  const rotateX = -mousePosition.elementNormalizedY * maxTilt * multiplier;
  const rotateY = mousePosition.elementNormalizedX * maxTilt * multiplier;

  return {
    rotateX,
    rotateY,
    isHovering: mousePosition.isHovering,
  };
}
