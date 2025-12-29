import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  onLoad?: () => void;
  /** Enable responsive images (mobile/tablet/desktop) */
  responsive?: boolean;
  /** Use WebP format with fallback */
  useWebP?: boolean;
}

/**
 * Optimized image component with lazy loading, blur-up effect, and WebP support
 * Automatically uses responsive images and WebP format when available
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  onLoad,
  responsive = true,
  useWebP = true,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) return; // Skip intersection observer for priority images

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
        rootMargin: '50px', // Start loading 50px before entering viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

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

  return (
    <div
      className={cn('relative overflow-hidden bg-slate-200 dark:bg-slate-700', className)}
      style={{ aspectRatio: width && height ? `${width}/${height}` : undefined }}
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
              <source
                srcSet={paths.webp}
                type="image/webp"
              />
            </>
          )}
          {useWebP && !responsive && (
            <source srcSet={paths.webp} type="image/webp" />
          )}
          {/* Fallback to original format */}
          <img
            ref={imgRef}
            src={paths.original}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={handleLoad}
            className={cn(
              'w-full h-full object-cover transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-0'
            )}
            {...props}
          />
        </picture>
      )}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 animate-pulse" />
      )}
    </div>
  );
}

export default OptimizedImage;
