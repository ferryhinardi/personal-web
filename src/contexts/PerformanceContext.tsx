import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import {useReducedMotion} from 'framer-motion';

interface PerformanceConfig {
  /** Whether to enable animations */
  enableAnimations: boolean;
  /** Whether to enable parallax effects */
  enableParallax: boolean;
  /** Whether to enable 3D transforms */
  enable3D: boolean;
  /** Whether to enable particle effects */
  enableParticles: boolean;
  /** Whether to enable blur effects */
  enableBlur: boolean;
  /** Whether to enable custom cursor */
  enableCustomCursor: boolean;
  /** Whether to enable Ken Burns image effects */
  enableKenBurns: boolean;
  /** Animation stagger delay multiplier */
  staggerMultiplier: number;
  /** Animation duration multiplier */
  durationMultiplier: number;
  /** Maximum floating elements to render */
  maxFloatingElements: number;
  /** Device capability level */
  deviceCapability: 'high' | 'medium' | 'low';
  /** Whether device is touch-enabled */
  isTouchDevice: boolean;
}

interface PerformanceContextValue extends PerformanceConfig {
  /** Override animation settings */
  setAnimationOverride: (enabled: boolean | null) => void;
}

const defaultConfig: PerformanceConfig = {
  enableAnimations: true,
  enableParallax: true,
  enable3D: true,
  enableParticles: true,
  enableBlur: true,
  enableCustomCursor: true,
  enableKenBurns: true,
  staggerMultiplier: 1,
  durationMultiplier: 1,
  maxFloatingElements: 10,
  deviceCapability: 'high',
  isTouchDevice: false,
};

const PerformanceContext = createContext<PerformanceContextValue>({
  ...defaultConfig,
  setAnimationOverride: () => {},
});

/**
 * Check if device is touch-enabled
 */
function checkTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Determine device capability
 */
function getDeviceCapability(): 'high' | 'medium' | 'low' {
  if (typeof window === 'undefined') return 'high';

  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as any).deviceMemory || 4;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );

  // Connection quality check
  const connection = (navigator as any).connection;
  const isSlowConnection =
    connection &&
    (connection.effectiveType === '2g' ||
      connection.effectiveType === 'slow-2g' ||
      connection.saveData);

  if (isSlowConnection || cores <= 2 || memory <= 2 || (isMobile && cores <= 4)) {
    return 'low';
  } else if (cores <= 4 || memory <= 4) {
    return 'medium';
  }
  return 'high';
}

interface PerformanceProviderProps {
  children: ReactNode;
}

export function PerformanceProvider({children}: PerformanceProviderProps) {
  const shouldReduceMotion = useReducedMotion();
  const [animationOverride, setAnimationOverride] = useState<boolean | null>(null);
  const [config, setConfig] = useState<PerformanceConfig>(defaultConfig);

  useEffect(() => {
    const isTouchDevice = checkTouchDevice();
    const deviceCapability = getDeviceCapability();

    // Determine if animations should be enabled
    const enableAnimations =
      animationOverride !== null ? animationOverride : !shouldReduceMotion;

    setConfig({
      enableAnimations,
      enableParallax: enableAnimations && deviceCapability !== 'low',
      enable3D: enableAnimations && deviceCapability !== 'low',
      enableParticles: enableAnimations && deviceCapability === 'high',
      enableBlur: deviceCapability !== 'low',
      enableCustomCursor: enableAnimations && deviceCapability !== 'low' && !isTouchDevice,
      enableKenBurns: enableAnimations && deviceCapability !== 'low',
      staggerMultiplier:
        deviceCapability === 'low' ? 0.5 : deviceCapability === 'medium' ? 0.75 : 1,
      durationMultiplier:
        deviceCapability === 'low' ? 0.5 : deviceCapability === 'medium' ? 0.75 : 1,
      maxFloatingElements:
        deviceCapability === 'low' ? 3 : deviceCapability === 'medium' ? 6 : 10,
      deviceCapability,
      isTouchDevice,
    });
  }, [shouldReduceMotion, animationOverride]);

  return (
    <PerformanceContext.Provider value={{...config, setAnimationOverride}}>
      {children}
    </PerformanceContext.Provider>
  );
}

/**
 * Hook to access performance configuration
 */
export function usePerformanceConfig(): PerformanceContextValue {
  return useContext(PerformanceContext);
}

/**
 * Hook for animation-specific settings
 */
export function useAnimationSettings() {
  const config = usePerformanceConfig();

  return {
    enabled: config.enableAnimations,
    duration: (base: number) => base * config.durationMultiplier,
    stagger: (base: number) => base * config.staggerMultiplier,
    transition: (base: object) => ({
      ...base,
      duration:
        typeof (base as any).duration === 'number'
          ? (base as any).duration * config.durationMultiplier
          : undefined,
    }),
  };
}

/**
 * Hook for parallax-specific settings
 */
export function useParallaxSettings() {
  const config = usePerformanceConfig();

  return {
    enabled: config.enableParallax,
    intensity: (base: number) =>
      config.deviceCapability === 'low'
        ? 0
        : config.deviceCapability === 'medium'
          ? base * 0.5
          : base,
  };
}
