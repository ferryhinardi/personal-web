import { motion, useScroll, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Scroll progress indicator - shows how far down the page user has scrolled
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if page is scrollable
    const checkScrollable = () => {
      const scrollable = document.documentElement.scrollHeight > window.innerHeight;
      setIsVisible(scrollable);
    };
    
    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    
    return () => window.removeEventListener('resize', checkScrollable);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 origin-left z-[9999] pointer-events-none"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}

export default ScrollProgress;
