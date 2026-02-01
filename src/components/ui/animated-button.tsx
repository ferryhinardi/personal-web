import * as React from 'react';
import {motion, type HTMLMotionProps} from 'framer-motion';
import {Slot} from '@radix-ui/react-slot';
import {cva, type VariantProps} from 'class-variance-authority';

import {cn} from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary-600 text-white shadow hover:bg-primary-700',
        destructive: 'bg-red-600 text-white shadow-sm hover:bg-red-700',
        outline:
          'border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 shadow-sm hover:bg-gray-50 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-gray-100',
        secondary:
          'bg-gray-100 dark:bg-dark-800 text-gray-900 dark:text-gray-100 shadow-sm hover:bg-gray-200 dark:hover:bg-dark-700',
        ghost:
          'hover:bg-gray-100 dark:hover:bg-dark-800 hover:text-gray-900 dark:hover:text-gray-100',
        link: 'text-primary-600 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        xl: 'h-12 rounded-md px-10 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

// Animation presets for different interaction styles
const animationPresets = {
  // Subtle scale effect - good for most buttons
  subtle: {
    whileHover: {scale: 1.02},
    whileTap: {scale: 0.98},
    transition: {type: 'spring' as const, stiffness: 400, damping: 17},
  },
  // More pronounced bounce effect
  bounce: {
    whileHover: {scale: 1.05, y: -2},
    whileTap: {scale: 0.95},
    transition: {type: 'spring' as const, stiffness: 400, damping: 10},
  },
  // Lift effect with shadow illusion
  lift: {
    whileHover: {y: -3, scale: 1.02},
    whileTap: {y: 0, scale: 0.98},
    transition: {type: 'spring' as const, stiffness: 300, damping: 15},
  },
  // Pulse effect for CTAs
  pulse: {
    whileHover: {scale: 1.03},
    whileTap: {scale: 0.97},
    transition: {type: 'spring' as const, stiffness: 500, damping: 15},
  },
  // No animation
  none: {
    whileHover: {},
    whileTap: {},
    transition: {},
  },
};

type AnimationPreset = keyof typeof animationPresets;

export interface AnimatedButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'ref'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  animation?: AnimationPreset;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      animation = 'subtle',
      ...props
    },
    ref,
  ) => {
    const preset = animationPresets[animation];

    if (asChild) {
      // When asChild is true, we need to use Slot but can't animate it directly
      // So we wrap with motion.div for the animation
      return (
        <motion.div
          whileHover={preset.whileHover}
          whileTap={preset.whileTap}
          transition={preset.transition}
          className="inline-block">
          <Slot
            className={cn(buttonVariants({variant, size, className}))}
            ref={ref as React.Ref<HTMLElement>}
            {...(props as React.HTMLAttributes<HTMLElement>)}
          />
        </motion.div>
      );
    }

    return (
      <motion.button
        className={cn(buttonVariants({variant, size, className}))}
        ref={ref}
        whileHover={preset.whileHover}
        whileTap={preset.whileTap}
        transition={preset.transition}
        {...props}
      />
    );
  },
);
AnimatedButton.displayName = 'AnimatedButton';

// Animated link component for navigation links
export interface AnimatedLinkProps
  extends Omit<HTMLMotionProps<'a'>, 'ref'> {
  animation?: AnimationPreset;
  underlineOnHover?: boolean;
}

const AnimatedLink = React.forwardRef<HTMLAnchorElement, AnimatedLinkProps>(
  (
    {
      className,
      animation = 'subtle',
      underlineOnHover = false,
      children,
      ...props
    },
    ref,
  ) => {
    const preset = animationPresets[animation];

    return (
      <motion.a
        ref={ref}
        className={cn(
          'relative inline-flex items-center gap-1 transition-colors',
          underlineOnHover && 'hover:underline underline-offset-4',
          className,
        )}
        whileHover={preset.whileHover}
        whileTap={preset.whileTap}
        transition={preset.transition}
        {...props}>
        {children}
      </motion.a>
    );
  },
);
AnimatedLink.displayName = 'AnimatedLink';

// Icon button with rotation/scale on hover
export interface AnimatedIconButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  rotateOnHover?: boolean;
}

const AnimatedIconButton = React.forwardRef<
  HTMLButtonElement,
  AnimatedIconButtonProps
>(({className, rotateOnHover = false, children, ...props}, ref) => {
  return (
    <motion.button
      ref={ref}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors',
        'hover:bg-gray-100 dark:hover:bg-dark-800',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500',
        'disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      whileHover={{
        scale: 1.1,
        rotate: rotateOnHover ? 15 : 0,
      }}
      whileTap={{scale: 0.9}}
      transition={{type: 'spring', stiffness: 400, damping: 17}}
      {...props}>
      {children}
    </motion.button>
  );
});
AnimatedIconButton.displayName = 'AnimatedIconButton';

export {AnimatedButton, AnimatedLink, AnimatedIconButton, buttonVariants};
