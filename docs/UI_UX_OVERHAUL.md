# UI/UX Overhaul Documentation

Comprehensive UI/UX overhaul implementing modern design patterns including parallax scrolling, micro-interactions, enhanced visual hierarchy, and performance optimizations.

## Table of Contents

- [Overview](#overview)
- [Phase 1: Core Infrastructure](#phase-1-core-infrastructure)
- [Phase 2: Hero Section Overhaul](#phase-2-hero-section-overhaul)
- [Phase 3: Section Enhancements](#phase-3-section-enhancements)
- [Phase 4: Global UI Enhancements](#phase-4-global-ui-enhancements)
- [Phase 5: Micro-Interactions & Polish](#phase-5-micro-interactions--polish)
- [Phase 6: Performance Optimizations](#phase-6-performance-optimizations)
- [Component API Reference](#component-api-reference)
- [CSS Utilities](#css-utilities)
- [File Changes Summary](#file-changes-summary)

---

## Overview

This overhaul adds modern UI/UX patterns to the portfolio website:

- **Parallax Effects**: Multi-layer depth system with scroll-based animations
- **3D Interactions**: Tilt cards with glare and shadow effects
- **Micro-animations**: Ripple buttons, floating badges, animated counters
- **Custom Cursor**: Spring-based following with blend mode (desktop only)
- **Section Navigation**: Floating dots with progress tracking
- **Text Animations**: Typewriter, split-chars/words/lines, highlight effects
- **Performance**: Device-adaptive animations, optimized bundle splitting

### Tech Stack

- React 18.3 + TypeScript 5.9
- Framer Motion for animations
- Tailwind CSS 4.x for styling
- Vite 6.4 for bundling

---

## Phase 1: Core Infrastructure

### Custom Hooks

#### useParallax (`src/hooks/useParallax.ts`)

Parallax scroll effects with multiple preset options.

```tsx
import { useParallax, useSimpleParallax, useFadeOnScroll, parallaxPresets } from '@/hooks/useParallax';

// Basic parallax
const { ref, y } = useParallax(0.5); // speed: 0.5

// Simple parallax with preset
const transform = useSimpleParallax('slow'); // 'slow' | 'medium' | 'fast'

// Fade on scroll
const { ref, opacity, y } = useFadeOnScroll(300); // fadeDistance in px

// Available presets
parallaxPresets.hero;      // speed: 0.3
parallaxPresets.background; // speed: 0.1
parallaxPresets.foreground; // speed: 0.5
```

#### useMousePosition (`src/hooks/useMousePosition.ts`)

Mouse tracking with magnetic and tilt effects.

```tsx
import { useMousePosition, useMagneticEffect, useTiltEffect } from '@/hooks/useMousePosition';

// Basic mouse position
const { x, y, isInViewport } = useMousePosition();

// Magnetic effect for buttons
const { ref, x, y } = useMagneticEffect(0.3); // strength: 0.3

// Tilt effect for cards
const { ref, rotateX, rotateY } = useTiltEffect(15); // maxTilt: 15 degrees
```

#### useInView (`src/hooks/useInView.ts`)

Intersection Observer for scroll-triggered animations.

```tsx
import { useInView, useStaggeredInView, useLazyLoad, inViewPresets } from '@/hooks/useInView';

// Basic in-view detection
const { ref, isInView } = useInView({ threshold: 0.2, once: true });

// Staggered animations for lists
const { ref, visibleItems } = useStaggeredInView(items.length, 0.1);

// Lazy loading
const { ref, shouldLoad } = useLazyLoad();

// Presets
inViewPresets.fadeIn;   // threshold: 0.1, once: true
inViewPresets.slideUp;  // threshold: 0.2, once: true
```

### Animation Variants (`src/utils/animations.ts`)

Extended with ~980 lines of animation variants:

```tsx
import {
  scrollReveal,
  heroTextReveal,
  floatingShape1,
  magneticHover,
  springConfigs,
  staggerContainer,
  staggerItem,
} from '@/utils/animations';

// Scroll reveal
<motion.div variants={scrollReveal} initial="hidden" whileInView="visible" />

// Spring configurations
springConfigs.gentle;  // stiffness: 120, damping: 14
springConfigs.bouncy;  // stiffness: 300, damping: 10
springConfigs.stiff;   // stiffness: 400, damping: 30
```

---

## Phase 2: Hero Section Overhaul

### FloatingShapes (`src/components/hero/FloatingShapes.tsx`)

Animated floating geometric shapes with continuous motion.

```tsx
import { FloatingShapes } from '@/components/hero';

<FloatingShapes />
```

Features:
- Circles, rings, triangles, and dots
- Random positioning and sizes
- Continuous floating animation
- Reduced on mobile for performance

### ParallaxBackground (`src/components/hero/ParallaxBackground.tsx`)

4-layer parallax system for immersive hero backgrounds.

```tsx
import { ParallaxBackground } from '@/components/hero';

<ParallaxBackground />
```

Layers:
1. Gradient mesh background
2. Blurred circles with parallax
3. Geometric shapes
4. Particle dots

### AnimatedText (`src/components/hero/AnimatedText.tsx`)

Character/word/line reveal animations.

```tsx
import { AnimatedText } from '@/components/hero';

// Character by character
<AnimatedText text="Hello World" type="chars" stagger={0.03} />

// Word by word
<AnimatedText text="Hello World" type="words" stagger={0.1} />

// Line by line
<AnimatedText text="Line 1\nLine 2" type="lines" stagger={0.2} />
```

### MagneticButton (`src/components/ui/MagneticButton.tsx`)

Button with magnetic cursor attraction effect.

```tsx
import { MagneticButton } from '@/components/ui/MagneticButton';

<MagneticButton strength={0.3} className="...">
  <Button>Click me</Button>
</MagneticButton>
```

---

## Phase 3: Section Enhancements

### SectionTransition (`src/components/ui/section-transition.tsx`)

Wave/curve SVG dividers between sections.

```tsx
import { SectionTransition } from '@/components/ui/section-transition';

<SectionTransition
  type="wave"           // 'wave' | 'curve' | 'tilt' | 'zigzag'
  position="top"        // 'top' | 'bottom'
  fillColor="rgb(249, 250, 251)"
  backgroundColor="rgb(255, 255, 255)"
  height={80}
  parallax              // optional parallax effect
/>
```

### AnimatedCounter (`src/components/ui/animated-counter.tsx`)

Animated number counter with spring physics.

```tsx
import { AnimatedCounter } from '@/components/ui/animated-counter';

<AnimatedCounter
  value={100}
  suffix="+"
  prefix="$"
  duration={2}
  delay={0.2}
/>
```

### TiltCard (`src/components/ui/tilt-card.tsx`)

3D tilt card effect on hover.

```tsx
import { TiltCard } from '@/components/ui/tilt-card';

<TiltCard
  maxTilt={10}          // max tilt angle in degrees
  glare                 // enable glare effect
  shadow                // enable dynamic shadow
  className="..."
>
  {children}
</TiltCard>
```

### ScrollRevealTimeline (`src/components/ui/scroll-reveal-timeline.tsx`)

Timeline with scroll-triggered reveal animations.

```tsx
import { ScrollRevealTimeline, TimelineItem } from '@/components/ui/scroll-reveal-timeline';

<ScrollRevealTimeline lineGradient="from-cyan-500 via-blue-500 to-purple-500">
  <TimelineItem index={0} dotColor="from-cyan-500 to-blue-600">
    <h3>Event Title</h3>
    <p>Event description</p>
  </TimelineItem>
  <TimelineItem index={1} dotColor="from-blue-500 to-purple-600">
    <h3>Another Event</h3>
  </TimelineItem>
</ScrollRevealTimeline>
```

### FloatingBadge (`src/components/ui/floating-badge.tsx`)

Floating badges with subtle animation.

```tsx
import { FloatingBadge } from '@/components/ui/floating-badge';

<FloatingBadge
  delay={0.1}
  variant="default"     // 'default' | 'outline'
  onClick={() => {}}
>
  React.js
</FloatingBadge>
```

---

## Phase 4: Global UI Enhancements

### CustomCursor (`src/components/ui/custom-cursor.tsx`)

Custom cursor with spring animation and blend mode.

```tsx
import { CustomCursor } from '@/components/ui/custom-cursor';

<CustomCursor
  enableTrail           // enable cursor trail
  enableBlendMode       // enable mix-blend-mode
  defaultSize={20}
  hoverSize={50}
/>
```

Features:
- Spring-based following animation
- State changes for hover/click/text
- Auto-disabled on touch devices
- Respects reduced motion preferences

### SectionDots (`src/components/ui/section-dots.tsx`)

Floating navigation dots with section tracking.

```tsx
import { SectionDots } from '@/components/ui/section-dots';

<SectionDots
  position="right"      // 'left' | 'right'
  sections={[
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'portfolio', label: 'Portfolio' },
  ]}
/>
```

Features:
- Automatic section tracking via Intersection Observer
- Click to navigate with smooth scroll
- Active section indicator with pulse animation
- Tooltip labels on hover
- Hidden on mobile (lg+ only)

### GlassCard (`src/components/ui/glass-card.tsx`)

Glassmorphism card with gradient border.

```tsx
import { GlassCard } from '@/components/ui/glass-card';

<GlassCard
  gradientBorder        // animated gradient border
  hoverGlow             // glow effect on hover
  blur={12}             // backdrop blur amount
  backgroundOpacity={10}
  noise                 // noise texture overlay
>
  {children}
</GlassCard>
```

### ScrollProgress (`src/components/ui/scroll-progress.tsx`)

Enhanced scroll progress bar.

```tsx
import ScrollProgress from '@/components/ui/scroll-progress';

<ScrollProgress
  showPercentage        // show percentage indicator
  height={4}
/>
```

Features:
- Section-aware gradient coloring
- Active section glow effect
- Smoother spring animation
- Respects reduced motion preferences

---

## Phase 5: Micro-Interactions & Polish

### RippleButton (`src/components/ui/ripple-button.tsx`)

Material-design ripple effect wrapper.

```tsx
import { RippleButton } from '@/components/ui/ripple-button';

<RippleButton
  rippleColor="rgba(255,255,255,0.4)"
  duration={0.6}
  onClick={handleClick}
>
  <Button>Click me</Button>
</RippleButton>
```

### AnimatedText (`src/components/ui/animated-text.tsx`)

Text animation component with multiple modes.

```tsx
import { AnimatedText } from '@/components/ui/animated-text';

// Typewriter effect
<AnimatedText type="typewriter" showCursor duration={0.05}>
  Hello World
</AnimatedText>

// Split characters
<AnimatedText type="split-chars" stagger={0.03}>
  Animated Text
</AnimatedText>

// Split words with 3D rotation
<AnimatedText type="split-words" as="h1" stagger={0.1}>
  Welcome Home
</AnimatedText>

// Split lines with skew
<AnimatedText type="split-lines" stagger={0.15}>
  Line One
  Line Two
</AnimatedText>

// Highlight effect
<AnimatedText type="highlight" highlightColor="bg-yellow-300">
  Important Text
</AnimatedText>

// Fade up
<AnimatedText type="fade-up">Simple Fade</AnimatedText>
```

### OptimizedImage (`src/components/ui/optimized-image.tsx`)

Enhanced image component with effects.

```tsx
import OptimizedImage from '@/components/ui/optimized-image';

// Ken Burns effect
<OptimizedImage
  src="/hero.jpg"
  alt="Hero"
  kenBurns
  kenBurnsDirection="zoom-in"  // 'zoom-in' | 'zoom-out' | 'pan-left' | 'pan-right'
  kenBurnsDuration={20}
/>

// Reveal animation
<OptimizedImage
  src="/hero.jpg"
  alt="Hero"
  reveal
  revealDirection="left"  // 'left' | 'right' | 'top' | 'bottom' | 'center'
  revealDuration={0.8}
/>

// Parallax zoom
<OptimizedImage
  src="/hero.jpg"
  alt="Hero"
  parallaxZoom
  parallaxIntensity={0.1}
/>
```

### Skeleton (`src/components/ui/skeleton.tsx`)

Enhanced skeleton loading with shimmer.

```tsx
import { Skeleton, ImageSkeleton, TextSkeleton, AvatarSkeleton } from '@/components/ui/skeleton';

// Basic skeleton with shimmer
<Skeleton className="h-6 w-full" />

// Pulse animation fallback
<Skeleton animation="pulse" className="h-6 w-full" />

// Utility skeletons
<ImageSkeleton aspectRatio="16/9" />
<TextSkeleton lines={3} />
<AvatarSkeleton size="lg" />  // 'sm' | 'md' | 'lg'
```

---

## Phase 6: Performance Optimizations

### PerformanceContext (`src/contexts/PerformanceContext.tsx`)

Device capability detection and adaptive settings.

```tsx
import { PerformanceProvider, usePerformanceConfig, useAnimationSettings } from '@/contexts/PerformanceContext';

// Wrap app
<PerformanceProvider>
  <App />
</PerformanceProvider>

// Use in components
function MyComponent() {
  const {
    enableAnimations,
    enableParallax,
    enable3D,
    enableCustomCursor,
    deviceCapability,  // 'low' | 'medium' | 'high'
  } = usePerformanceConfig();

  const { duration, stagger } = useAnimationSettings();

  if (!enableAnimations) return <StaticContent />;
  return <AnimatedContent />;
}
```

### usePerformance Hooks (`src/hooks/usePerformance.ts`)

```tsx
import {
  useDeviceCapability,
  useAnimationConfig,
  useFrameRate,
  useScrollOptimized,
  useWillChange,
  useThrottle,
} from '@/hooks/usePerformance';

// Device capability detection
const capability = useDeviceCapability(); // 'low' | 'medium' | 'high'

// Animation config based on device
const config = useAnimationConfig();

// FPS monitoring (debug)
const fps = useFrameRate(true);

// Optimized scroll handler
useScrollOptimized((scrollY) => {
  // handle scroll
}, 16); // throttle ms

// Strategic will-change
const ref = useWillChange<HTMLDivElement>('transform', 200);

// Throttle function
const throttledFn = useThrottle(myFunction, 100);
```

### LazyAnimation (`src/components/ui/lazy-animation.tsx`)

Scroll-triggered animations with performance optimization.

```tsx
import { LazyAnimation, StaggerContainer, StaggerItem } from '@/components/ui/lazy-animation';

// Single element
<LazyAnimation variant="fadeUp" delay={0.2} once threshold={0.2}>
  <Card>Content</Card>
</LazyAnimation>

// Staggered children
<StaggerContainer stagger={0.1} delay={0}>
  <StaggerItem variant="fadeUp">Item 1</StaggerItem>
  <StaggerItem variant="fadeUp">Item 2</StaggerItem>
  <StaggerItem variant="fadeUp">Item 3</StaggerItem>
</StaggerContainer>
```

### Bundle Optimization

**Results:**

| Chunk | Size | Gzip |
|-------|------|------|
| react-vendor | 140KB | 45KB |
| framer-motion | 123KB | 40KB |
| index (main) | 164KB | 51KB |
| charts (recharts) | 398KB | 112KB |
| radix-vendor | 34KB | 11KB |
| Portfolio | 8KB | 3KB |
| About | 39KB | 13KB |
| Contact | 27KB | 10KB |
| Resume | 9KB | 3KB |

**Key optimizations:**
1. Portfolio chunk reduced from 583KB to 8KB (98.6% reduction)
2. Heavy components removed from barrel exports
3. Device capability detection for adaptive performance
4. CSS containment utilities for better paint performance

---

## Component API Reference

### Quick Reference

```tsx
// Parallax
<ParallaxBackground />
<FloatingShapes />

// Text
<AnimatedText text="..." type="chars|words|lines" />
<AnimatedText type="typewriter|split-chars|split-words|highlight">...</AnimatedText>

// Cards
<TiltCard maxTilt={10} glare shadow>{children}</TiltCard>
<GlassCard gradientBorder hoverGlow>{children}</GlassCard>

// Buttons
<MagneticButton strength={0.3}>{children}</MagneticButton>
<RippleButton rippleColor="...">{children}</RippleButton>

// Navigation
<SectionDots position="right" sections={[...]} />
<ScrollProgress showPercentage height={4} />

// Layout
<SectionTransition type="wave" position="top" />
<ScrollRevealTimeline>{children}</ScrollRevealTimeline>

// Animation
<LazyAnimation variant="fadeUp">{children}</LazyAnimation>
<StaggerContainer><StaggerItem>...</StaggerItem></StaggerContainer>

// Counters & Badges
<AnimatedCounter value={100} suffix="+" />
<FloatingBadge delay={0.1}>Badge</FloatingBadge>

// Images
<OptimizedImage kenBurns reveal parallaxZoom />

// Loading
<Skeleton />
<ImageSkeleton />
<TextSkeleton lines={3} />
```

---

## CSS Utilities

### Performance Classes (`src/index.css`)

```css
/* GPU acceleration */
.gpu-accelerate {
  transform: translateZ(0);
  backface-visibility: hidden;
}

/* Will-change optimization */
.will-animate {
  will-change: transform, opacity;
}

/* CSS containment */
.contain-layout { contain: layout; }
.contain-paint { contain: paint; }
.contain-strict { contain: strict; }
.contain-content { contain: content; }

/* Lazy rendering */
.lazy-render {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px;
}
.lazy-render-sm { contain-intrinsic-size: 0 200px; }
.lazy-render-lg { contain-intrinsic-size: 0 800px; }

/* Animation control */
.force-gpu { transform: translate3d(0, 0, 0); }
.animation-paused { animation-play-state: paused; }
```

### Hero Utilities

```css
.gradient-mesh { /* animated gradient background */ }
.clip-reveal { /* clip-path reveal animation */ }
.glass-badge { /* glassmorphism badge */ }
.gradient-text { /* gradient text effect */ }
.animate-scroll-bounce { /* scroll indicator bounce */ }
.hero-glow { /* hero section glow */ }
.animate-float { /* floating animation */ }
.parallax-layer { /* parallax layer base */ }
```

### Animations

```css
@keyframes shimmer { /* skeleton shimmer */ }
@keyframes float { /* floating effect */ }
@keyframes scroll-bounce { /* scroll indicator */ }
```

---

## File Changes Summary

### New Files Created (21)

| File | Description |
|------|-------------|
| `src/hooks/useParallax.ts` | Parallax scroll effects |
| `src/hooks/useMousePosition.ts` | Mouse tracking with magnetic/tilt |
| `src/hooks/useInView.ts` | Intersection Observer hooks |
| `src/hooks/usePerformance.ts` | Performance optimization hooks |
| `src/contexts/PerformanceContext.tsx` | Performance context provider |
| `src/components/hero/FloatingShapes.tsx` | Animated floating shapes |
| `src/components/hero/ParallaxBackground.tsx` | 4-layer parallax |
| `src/components/hero/AnimatedText.tsx` | Text reveal animations |
| `src/components/hero/index.ts` | Barrel export |
| `src/components/ui/MagneticButton.tsx` | Magnetic button effect |
| `src/components/ui/section-transition.tsx` | Wave/curve dividers |
| `src/components/ui/animated-counter.tsx` | Number counter animation |
| `src/components/ui/tilt-card.tsx` | 3D tilt card effect |
| `src/components/ui/scroll-reveal-timeline.tsx` | Timeline with scroll reveal |
| `src/components/ui/floating-badge.tsx` | Floating badges |
| `src/components/ui/custom-cursor.tsx` | Custom cursor |
| `src/components/ui/section-dots.tsx` | Navigation dots |
| `src/components/ui/glass-card.tsx` | Glassmorphism card |
| `src/components/ui/ripple-button.tsx` | Ripple effect wrapper |
| `src/components/ui/animated-text.tsx` | Text animations |
| `src/components/ui/lazy-animation.tsx` | Lazy loading animations |

### Updated Files (13)

| File | Changes |
|------|---------|
| `src/utils/animations.ts` | ~980 lines of animation variants |
| `src/components/Header.tsx` | Parallax hero with animations |
| `src/components/About.tsx` | 3D cards, counters, floating badges |
| `src/components/Resume.tsx` | Timeline animations |
| `src/components/Portfolio.tsx` | TiltCard, FloatingBadge, optimized imports |
| `src/components/Contact.tsx` | Enhanced form animations |
| `src/components/ui/optimized-image.tsx` | Ken Burns, reveal, parallax zoom |
| `src/components/ui/scroll-progress.tsx` | Section-aware progress |
| `src/components/ui/skeleton.tsx` | Shimmer animation |
| `src/components/ui/index.ts` | Optimized barrel exports |
| `src/index.css` | Performance utilities, animations |
| `src/App.tsx` | PerformanceProvider integration |
| `vite.config.ts` | Optimized chunking, visualizer |

---

## Accessibility

All animations respect user preferences:

- `prefers-reduced-motion: reduce` disables or minimizes animations
- Custom cursor auto-disabled on touch devices
- Focus states maintained on all interactive elements
- Semantic HTML throughout
- Screen reader compatible

---

## Commands Reference

```bash
pnpm dev              # Start dev server (localhost:3000)
pnpm build            # Production build
pnpm exec tsc --noEmit # TypeScript type check
pnpm test -- --run    # Run tests once
```
