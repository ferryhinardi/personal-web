import {memo, useEffect, useState, useCallback} from 'react';
import {motion, useMotionValue, useSpring, useReducedMotion} from 'framer-motion';

interface CustomCursorProps {
  /** Enable cursor trail effect */
  enableTrail?: boolean;
  /** Default cursor size in pixels */
  defaultSize?: number;
  /** Hover cursor size in pixels */
  hoverSize?: number;
  /** Click cursor size in pixels */
  clickSize?: number;
  /** Enable blend mode for visual interest */
  enableBlendMode?: boolean;
}

type CursorState = 'default' | 'hover' | 'click' | 'text' | 'hidden';

/**
 * Custom cursor component with magnetic pull and state changes.
 * Desktop-only, disabled on touch devices.
 * Respects reduced motion preferences.
 *
 * @example
 * ```tsx
 * // In App.tsx
 * <CustomCursor enableTrail enableBlendMode />
 * ```
 */
function CustomCursorComponent({
  enableTrail = false,
  defaultSize = 20,
  hoverSize = 50,
  clickSize = 16,
  enableBlendMode = true,
}: CustomCursorProps) {
  const shouldReduceMotion = useReducedMotion();
  const [cursorState, setCursorState] = useState<CursorState>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Motion values for smooth cursor movement
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring animation for smooth following
  const springConfig = {stiffness: 500, damping: 28, mass: 0.5};
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Trail cursor (follows with more delay)
  const trailConfig = {stiffness: 150, damping: 20, mass: 1};
  const trailXSpring = useSpring(cursorX, trailConfig);
  const trailYSpring = useSpring(cursorY, trailConfig);

  // Detect touch device
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
          navigator.maxTouchPoints > 0 ||
          window.matchMedia('(pointer: coarse)').matches,
      );
    };

    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);
    return () => window.removeEventListener('resize', checkTouchDevice);
  }, []);

  // Handle mouse movement
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      if (!isVisible) {
        setIsVisible(true);
      }
    },
    [cursorX, cursorY, isVisible],
  );

  // Handle mouse enter/leave viewport
  const handleMouseEnter = useCallback(() => setIsVisible(true), []);
  const handleMouseLeave = useCallback(() => setIsVisible(false), []);

  // Handle mouse down/up
  const handleMouseDown = useCallback(() => setCursorState('click'), []);
  const handleMouseUp = useCallback(() => setCursorState('default'), []);

  // Set up event listeners
  useEffect(() => {
    if (isTouchDevice || shouldReduceMotion) return;

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Set up hover detection for interactive elements
    const handleElementHover = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, [role="button"], input, textarea, select, [data-cursor="pointer"]',
      );

      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => setCursorState('hover'));
        el.addEventListener('mouseleave', () => setCursorState('default'));
      });

      // Text elements
      const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, label');
      textElements.forEach((el) => {
        el.addEventListener('mouseenter', () => setCursorState('text'));
        el.addEventListener('mouseleave', () => setCursorState('default'));
      });
    };

    // Initial setup
    handleElementHover();

    // Use MutationObserver to handle dynamically added elements
    const observer = new MutationObserver(() => {
      handleElementHover();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      observer.disconnect();
    };
  }, [
    isTouchDevice,
    shouldReduceMotion,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseDown,
    handleMouseUp,
  ]);

  // Don't render on touch devices or when reduced motion is preferred
  if (isTouchDevice || shouldReduceMotion) {
    return null;
  }

  // Get cursor size based on state
  const getCursorSize = () => {
    switch (cursorState) {
      case 'hover':
        return hoverSize;
      case 'click':
        return clickSize;
      case 'text':
        return 4;
      case 'hidden':
        return 0;
      default:
        return defaultSize;
    }
  };

  const size = getCursorSize();
  const offset = size / 2;

  return (
    <>
      {/* Hide default cursor */}
      <style>{`
        * {
          cursor: none !important;
        }
      `}</style>

      {/* Trail cursor (renders behind main cursor) */}
      {enableTrail && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9998]"
          style={{
            x: trailXSpring,
            y: trailYSpring,
            width: size * 1.5,
            height: size * 1.5,
            marginLeft: -(size * 1.5) / 2,
            marginTop: -(size * 1.5) / 2,
          }}
          animate={{
            opacity: isVisible ? 0.3 : 0,
          }}
          transition={{duration: 0.15}}
        >
          <div
            className="w-full h-full rounded-full bg-gradient-to-br from-cyan-400 to-blue-500"
            style={{
              mixBlendMode: enableBlendMode ? 'difference' : 'normal',
            }}
          />
        </motion.div>
      )}

      {/* Main cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        animate={{
          width: size,
          height: size,
          marginLeft: -offset,
          marginTop: -offset,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          width: {type: 'spring', stiffness: 300, damping: 20},
          height: {type: 'spring', stiffness: 300, damping: 20},
          opacity: {duration: 0.15},
        }}
      >
        <motion.div
          className="w-full h-full rounded-full border-2 border-cyan-500 dark:border-cyan-400"
          style={{
            mixBlendMode: enableBlendMode ? 'difference' : 'normal',
          }}
          animate={{
            backgroundColor:
              cursorState === 'hover'
                ? 'rgba(6, 182, 212, 0.2)'
                : cursorState === 'click'
                  ? 'rgba(6, 182, 212, 0.5)'
                  : 'transparent',
            scale: cursorState === 'click' ? 0.8 : 1,
          }}
          transition={{
            backgroundColor: {duration: 0.15},
            scale: {type: 'spring', stiffness: 500, damping: 20},
          }}
        />

        {/* Center dot */}
        {cursorState === 'default' && (
          <motion.div
            className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-cyan-500 dark:bg-cyan-400"
            style={{
              x: '-50%',
              y: '-50%',
              mixBlendMode: enableBlendMode ? 'difference' : 'normal',
            }}
            initial={{scale: 0}}
            animate={{scale: 1}}
            exit={{scale: 0}}
          />
        )}

        {/* Text cursor indicator */}
        {cursorState === 'text' && (
          <motion.div
            className="absolute top-1/2 left-1/2 w-0.5 h-5 bg-cyan-500 dark:bg-cyan-400"
            style={{
              x: '-50%',
              y: '-50%',
            }}
            initial={{scaleY: 0}}
            animate={{scaleY: 1}}
            exit={{scaleY: 0}}
          />
        )}
      </motion.div>
    </>
  );
}

export const CustomCursor = memo(CustomCursorComponent);
export type {CustomCursorProps, CursorState};
