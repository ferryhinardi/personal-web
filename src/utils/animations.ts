import { Variants } from 'framer-motion';

// Fade in animation
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

// Fade in up animation
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

// Fade in down animation
export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

// Slide in from left
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

// Slide in from right
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

// Scale in animation
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

// Stagger container for child animations
export const staggerContainer: Variants = {
  hidden: { opacity: 1 }, // Changed from 0 to 1 to ensure content is visible even if animation doesn't trigger
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Stagger item for use with staggerContainer
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

// Hover scale animation
export const hoverScale = {
  scale: 1.05,
  transition: {
    duration: 0.3,
    ease: 'easeInOut',
  },
};

// Hover lift animation
export const hoverLift = {
  y: -8,
  transition: {
    duration: 0.3,
    ease: 'easeInOut',
  },
};

// Page transition
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.4,
      ease: 'easeIn',
    },
  },
};

// Viewport options for scroll-triggered animations
export const viewportOptions = {
  once: true, // Animation triggers only once
  margin: '0px 0px -50px 0px', // Trigger animation 50px before element enters viewport (mobile-friendly)
  amount: 0.1, // Trigger when only 10% of element is visible (better for mobile)
};

// Enhanced viewport options (more aggressive triggering)
export const viewportOptionsEager = {
  once: true,
  margin: '0px',
  amount: 0.05, // Trigger when only 5% is visible (very aggressive for long sections)
};

// Bounce animation
export const bounceIn: Variants = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      bounce: 0.5,
      duration: 0.8,
    },
  },
};

// Rotate in animation
export const rotateIn: Variants = {
  hidden: { opacity: 0, rotate: -180 },
  visible: {
    opacity: 1,
    rotate: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

// Flip animation
export const flipIn: Variants = {
  hidden: { opacity: 0, rotateY: 90 },
  visible: {
    opacity: 1,
    rotateY: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

// Blur in animation
export const blurIn: Variants = {
  hidden: { opacity: 0, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

// Slide and fade from corners
export const slideInTopLeft: Variants = {
  hidden: { opacity: 0, x: -50, y: -50 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export const slideInTopRight: Variants = {
  hidden: { opacity: 0, x: 50, y: -50 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export const slideInBottomLeft: Variants = {
  hidden: { opacity: 0, x: -50, y: 50 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export const slideInBottomRight: Variants = {
  hidden: { opacity: 0, x: 50, y: 50 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

// Pulse animation (for attention)
export const pulse = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

// Wiggle animation
export const wiggle = {
  rotate: [0, -10, 10, -10, 10, 0],
  transition: {
    duration: 0.5,
    ease: 'easeInOut',
  },
};

// Hover animations
export const hoverRotate = {
  rotate: 5,
  transition: {
    duration: 0.3,
    ease: 'easeInOut',
  },
};

export const hoverGlow = {
  boxShadow: '0 0 20px rgba(34, 211, 238, 0.5)',
  transition: {
    duration: 0.3,
    ease: 'easeInOut',
  },
};

export const hoverBounce = {
  y: [0, -10, 0],
  transition: {
    duration: 0.5,
    ease: 'easeInOut',
  },
};

// Tap animations (for mobile)
export const tapScale = {
  scale: 0.95,
};

export const tapShrink = {
  scale: 0.9,
  transition: {
    duration: 0.1,
  },
};

// Loading animations
export const spinClockwise = {
  rotate: 360,
  transition: {
    duration: 1,
    repeat: Infinity,
    ease: 'linear',
  },
};

export const spinCounterClockwise = {
  rotate: -360,
  transition: {
    duration: 1,
    repeat: Infinity,
    ease: 'linear',
  },
};

// Advanced stagger patterns
export const staggerFast: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const staggerSlow: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

export const staggerReverse: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1, // Reverse order
    },
  },
};

// Complex animations
export const slideAndScale: Variants = {
  hidden: { opacity: 0, x: -50, scale: 0.8 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export const rotateAndScale: Variants = {
  hidden: { opacity: 0, rotate: -90, scale: 0.5 },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

// Spring animations (bouncy)
export const springBounce: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
};

export const springGentle: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

// Card flip animation (3D effect)
export const cardFlip: Variants = {
  hidden: {
    opacity: 0,
    rotateY: 180,
    transformPerspective: 1000,
  },
  visible: {
    opacity: 1,
    rotateY: 0,
    transformPerspective: 1000,
    transition: {
      duration: 0.8,
      ease: 'easeInOut',
    },
  },
};

// Curtain reveal (from center)
export const curtainReveal: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
};

// Elastic bounce
export const elasticBounce: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10,
    },
  },
};

// Typewriter cursor effect helper
export const cursorBlink = {
  opacity: [0, 1, 0],
  transition: {
    duration: 0.8,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

// Draw line animation (for SVG paths)
export const drawLine = {
  pathLength: [0, 1],
  transition: {
    duration: 1.5,
    ease: 'easeInOut',
  },
};

// Preset animation configs for common use cases
export const animationPresets = {
  // Subtle entrance
  subtle: {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  },
  // Dramatic entrance
  dramatic: {
    hidden: { opacity: 0, scale: 0.5, rotate: -45 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  },
  // Smooth entrance
  smooth: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
    },
  },
};
