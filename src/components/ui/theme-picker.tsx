import {useState, useRef, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Check, Palette} from 'lucide-react';
import {cn} from '@/lib/utils';
import {useTheme} from '@/hooks/useTheme';
import {Button} from '@/components/ui/button';

/**
 * Theme picker component with color swatches.
 * Shows a dropdown with available themes when clicked.
 */
export function ThemePicker() {
  const {theme, setTheme, availableThemes, isDark, toggleDarkMode} = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen]);

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-600 hover:text-gray-900 dark:text-white/70 dark:hover:text-white"
        aria-label="Change theme"
        aria-expanded={isOpen}
      >
        <Palette className="h-5 w-5" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{opacity: 0, y: -8, scale: 0.95}}
            animate={{opacity: 1, y: 0, scale: 1}}
            exit={{opacity: 0, y: -8, scale: 0.95}}
            transition={{duration: 0.15}}
            className={cn(
              'absolute right-0 top-full mt-2 z-50',
              'w-56 p-3 rounded-xl',
              'bg-white dark:bg-gray-900',
              'border border-gray-200 dark:border-gray-700',
              'shadow-lg',
            )}
          >
            <div className="space-y-3">
              {/* Theme Colors */}
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Color Theme
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableThemes.map((t) => (
                    <motion.button
                      key={t.id}
                      whileHover={{scale: 1.1}}
                      whileTap={{scale: 0.95}}
                      onClick={() => {
                        setTheme(t.id);
                      }}
                      className={cn(
                        'w-8 h-8 rounded-full relative',
                        'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 transition-all',
                        theme.id === t.id
                          ? 'ring-gray-400 dark:ring-gray-500'
                          : 'ring-transparent hover:ring-gray-200 dark:hover:ring-gray-600',
                      )}
                      style={{backgroundColor: t.preview}}
                      aria-label={`${t.label} theme`}
                      title={t.label}
                    >
                      {theme.id === t.id && (
                        <motion.div
                          initial={{scale: 0}}
                          animate={{scale: 1}}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <Check className="h-4 w-4 text-white drop-shadow-sm" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Light/Dark toggle */}
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Appearance
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleDarkMode}
                  className="w-full justify-start gap-2"
                >
                  {isDark ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                      Switch to Light
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                      Switch to Dark
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
