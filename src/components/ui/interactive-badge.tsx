import {memo, useState, useRef, useCallback} from 'react';
import {motion, useReducedMotion, type Variants} from 'framer-motion';
import {
  Mail,
  MapPin,
  ExternalLink,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  InstagramIcon,
  GithubIcon,
} from 'lucide-react';
import {cn} from '@/lib/utils';
import {useTiltEffect, useMagneticEffect} from '@/hooks/useMousePosition';
import type {MainData, Social} from '@/types/resume.types';

/**
 * Map social network names to Lucide icons.
 */
const socialIcons: Record<string, React.ComponentType<{className?: string}>> = {
  facebook: FacebookIcon,
  twitter: TwitterIcon,
  linkedin: LinkedinIcon,
  instagram: InstagramIcon,
  github: GithubIcon,
};

/**
 * Props for the InteractiveBadge component.
 */
interface InteractiveBadgeProps {
  /** User data containing name, occupation, email, address, and social links */
  data: MainData;
  /** Additional CSS classes */
  className?: string;
  /** Show availability status indicator */
  showAvailability?: boolean;
  /** Availability status text */
  availabilityText?: string;
  /** Disable all animations */
  disableAnimations?: boolean;
}

/**
 * Animation variants for the floating effect.
 */
const floatVariants: Variants = {
  initial: {y: 0},
  float: {
    y: [-3, 3, -3],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Animation variants for the flip effect.
 */
const flipVariants: Variants = {
  front: {
    rotateY: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
  back: {
    rotateY: 180,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
};

/**
 * Animation variants for content fade.
 */
const contentVariants: Variants = {
  hidden: {opacity: 0},
  visible: {
    opacity: 1,
    transition: {delay: 0.15, duration: 0.2},
  },
};

/**
 * Animation variants for the pulsing availability indicator.
 */
const pulseVariants: Variants = {
  pulse: {
    scale: [1, 1.2, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Animation variants for the gradient border rotation.
 */
const gradientBorderVariants: Variants = {
  rotate: {
    rotate: 360,
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

/**
 * Props for the BadgeFront component.
 */
interface BadgeFrontProps {
  name: string;
  occupation: string;
  showAvailability: boolean;
  availabilityText: string;
  shouldReduceMotion: boolean | null;
}

/**
 * Front face of the badge showing name, title, and availability status.
 */
const BadgeFront = memo(function BadgeFront({
  name,
  occupation,
  showAvailability,
  availabilityText,
  shouldReduceMotion,
}: BadgeFrontProps) {
  return (
    <div className="p-4 sm:p-5 text-center">
      {/* Availability indicator */}
      {showAvailability && (
        <div className="flex items-center justify-center gap-2 mb-3">
          <motion.div
            variants={shouldReduceMotion ? undefined : pulseVariants}
            animate={shouldReduceMotion ? undefined : 'pulse'}
            className="w-2 h-2 rounded-full bg-green-400"
          />
          <span className="text-green-300 text-xs font-medium">
            {availabilityText}
          </span>
        </div>
      )}

      {/* Name */}
      <h3 className="text-lg sm:text-xl font-bold text-white mb-1 truncate">
        {name}
      </h3>

      {/* Occupation */}
      <p className="text-cyan-400 text-sm font-medium truncate">{occupation}</p>

      {/* Flip hint */}
      <p className="text-white/40 text-xs mt-3">Click to flip</p>
    </div>
  );
});

/**
 * Props for the BadgeBack component.
 */
interface BadgeBackProps {
  email: string;
  city: string;
  country: string;
  social: Social[];
}

/**
 * Back face of the badge showing contact info and social links.
 */
const BadgeBack = memo(function BadgeBack({
  email,
  city,
  country,
  social,
}: BadgeBackProps) {
  // Take only first 3 social links to fit the badge
  const displaySocial = social.slice(0, 3);

  return (
    <div
      className="p-4 sm:p-5 text-center"
      style={{transform: 'rotateY(180deg)'}}
    >
      {/* Email */}
      <a
        href={`mailto:${email}`}
        className="flex items-center justify-center gap-2 text-white/80 hover:text-cyan-400 transition-colors mb-3 group"
        onClick={(e) => e.stopPropagation()}
      >
        <Mail className="w-4 h-4" />
        <span className="text-sm truncate max-w-[180px]">{email}</span>
      </a>

      {/* Location */}
      <div className="flex items-center justify-center gap-2 text-white/60 mb-4">
        <MapPin className="w-4 h-4" />
        <span className="text-sm">
          {city}, {country}
        </span>
      </div>

      {/* Social links */}
      <div className="flex items-center justify-center gap-3">
        {displaySocial.map((network) => {
          const IconComponent =
            socialIcons[network.name.toLowerCase()] || ExternalLink;
          return (
            <a
              key={network.name}
              href={network.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={network.name}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/50 flex items-center justify-center text-white/70 hover:text-cyan-400 transition-all duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <IconComponent className="w-3.5 h-3.5" />
            </a>
          );
        })}
      </div>

      {/* Flip hint */}
      <p className="text-white/40 text-xs mt-3">Click to flip back</p>
    </div>
  );
});

/**
 * Interactive Animated Badge Component
 *
 * A flip card badge combining multiple interactive effects:
 * - Flip card effect (click to flip between front/back)
 * - 3D tilt effect on hover
 * - Glassmorphism styling with animated gradient border
 * - Magnetic pull effect on hover
 * - Subtle idle float animation
 * - Full accessibility support (respects reduced motion)
 *
 * @example
 * ```tsx
 * <InteractiveBadge
 *   data={resumeData.main}
 *   showAvailability
 *   availabilityText="Open to Opportunities"
 * />
 * ```
 */
function InteractiveBadgeComponent({
  data,
  className = '',
  showAvailability = true,
  availabilityText = 'Available for hire',
  disableAnimations = false,
}: InteractiveBadgeProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);

  const shouldReduceMotion = useReducedMotion();
  const disableAllAnimations = disableAnimations || shouldReduceMotion;

  // 3D tilt effect
  const {rotateX, rotateY, isHovering} = useTiltEffect(badgeRef, {
    maxTilt: disableAllAnimations ? 0 : 12,
    smoothing: 0.15,
  });

  // Magnetic effect
  const magnetic = useMagneticEffect(badgeRef, {
    strength: disableAllAnimations ? 0 : 0.25,
    maxDistance: 15,
    triggerRadius: 120,
  });

  const {name, occupation, email, address, social} = data;

  // Handle flip toggle
  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // Handle keyboard accessibility
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleFlip();
      }
    },
    [handleFlip],
  );

  return (
    <motion.div
      variants={disableAllAnimations ? undefined : floatVariants}
      initial={disableAllAnimations ? undefined : 'initial'}
      animate={disableAllAnimations ? undefined : 'float'}
      style={{
        x: magnetic.x,
        y: magnetic.y,
      }}
      className={cn('inline-block', className)}
    >
      {/* Badge container with tilt effect */}
      <motion.div
        ref={badgeRef}
        onClick={handleFlip}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`Profile badge for ${name}. ${isFlipped ? 'Showing contact info.' : 'Showing name and title.'} Press Enter to flip.`}
        aria-pressed={isFlipped}
        style={{
          rotateX: disableAllAnimations ? 0 : rotateX,
          rotateY: disableAllAnimations ? 0 : rotateY,
          transformPerspective: 1000,
          transformStyle: 'preserve-3d',
        }}
        className="relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-2xl"
      >
        {/* Animated gradient border */}
        <div className="absolute inset-0 rounded-2xl p-[1px] overflow-hidden">
          <motion.div
            variants={disableAllAnimations ? undefined : gradientBorderVariants}
            animate={disableAllAnimations ? undefined : 'rotate'}
            className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent,rgba(6,182,212,0.5),rgba(59,130,246,0.5),rgba(168,85,247,0.5),rgba(236,72,153,0.5),transparent)]"
          />
        </div>

        {/* Card with flip transform */}
        <motion.div
          variants={disableAllAnimations ? undefined : flipVariants}
          animate={isFlipped ? 'back' : 'front'}
          style={{transformStyle: 'preserve-3d'}}
          className="relative"
        >
          {/* Glass background */}
          <div
            className={cn(
              'relative w-64 sm:w-72 rounded-2xl overflow-hidden',
              'bg-slate-900/80 backdrop-blur-xl',
              'border border-white/10',
              isHovering && !disableAllAnimations && 'border-white/20',
            )}
            style={{
              transition: 'border-color 0.3s ease',
            }}
          >
            {/* Hover glow effect */}
            {!disableAllAnimations && (
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background:
                    'radial-gradient(400px circle at 50% 50%, rgba(6, 182, 212, 0.1), transparent 40%)',
                }}
                initial={{opacity: 0}}
                animate={{opacity: isHovering ? 1 : 0}}
                transition={{duration: 0.3}}
              />
            )}

            {/* Front face */}
            <motion.div
              variants={contentVariants}
              initial="visible"
              animate={isFlipped ? 'hidden' : 'visible'}
              className="relative z-10"
              style={{
                backfaceVisibility: 'hidden',
              }}
            >
              <BadgeFront
                name={name}
                occupation={occupation}
                showAvailability={showAvailability}
                availabilityText={availabilityText}
                shouldReduceMotion={shouldReduceMotion}
              />
            </motion.div>

            {/* Back face */}
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate={isFlipped ? 'visible' : 'hidden'}
              className="absolute inset-0 z-10"
              style={{
                backfaceVisibility: 'hidden',
              }}
            >
              <BadgeBack
                email={email}
                city={address.city}
                country={address.state || 'Indonesia'}
                social={social}
              />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export const InteractiveBadge = memo(InteractiveBadgeComponent);
export type {InteractiveBadgeProps};
