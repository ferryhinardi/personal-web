import {useState, useEffect, useCallback, useMemo, useContext, useRef} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {motion, AnimatePresence} from 'framer-motion';
import {
  Command,
  Moon,
  Sun,
  Download,
  Github,
  Linkedin,
  Twitter,
  Search,
  ArrowUp,
  ArrowDown,
  CornerDownLeft,
} from 'lucide-react';
import {cn} from '@/lib/utils';
import {useDarkMode} from '@/hooks/useDarkMode';
import {scrollToSection} from '@/utils/navigation';
import {mainSections, pageLinks} from '@/config/navigation';
import {ThemeContext} from '@/contexts/ThemeContext';
import {themes} from '@/types/theme.types';
import {Palette} from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  category: 'navigation' | 'pages' | 'action' | 'social' | 'theme';
  keywords?: string[];
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const {isDark, toggleDarkMode} = useDarkMode();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Access ThemeContext directly (safe even outside provider)
  const themeContext = useContext(ThemeContext);

  const handleSectionClick = useCallback(
    (href: string) => {
      if (isHomePage) {
        const targetId = href.replace('#', '');
        scrollToSection(targetId);
      } else {
        // Navigate to home page with hash
        window.location.href = '/' + href;
      }
      setIsOpen(false);
    },
    [isHomePage],
  );

  const handlePageClick = useCallback(
    (href: string) => {
      navigate(href);
      setIsOpen(false);
    },
    [navigate],
  );

  const commands: CommandItem[] = useMemo(
    () => [
      // Section navigation
      ...mainSections.map((item) => {
        const IconComponent = item.icon;
        return {
          id: item.href.replace('#', ''),
          label: item.label,
          icon: <IconComponent className="h-4 w-4" />,
          action: () => handleSectionClick(item.href),
          category: 'navigation' as const,
          keywords: item.keywords,
        };
      }),

      // Page navigation
      ...pageLinks.map((item) => {
        const IconComponent = item.icon;
        return {
          id: `page-${item.href.replace('/', '')}`,
          label: item.label,
          icon: <IconComponent className="h-4 w-4" />,
          action: item.isStatic
            ? () => { window.location.href = item.href; setIsOpen(false); }
            : () => handlePageClick(item.href),
          category: 'pages' as const,
          keywords: item.keywords,
        };
      }),

      // Actions
      {
        id: 'dark-mode',
        label: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
        icon: isDark ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        ),
        action: () => {
          toggleDarkMode();
          setIsOpen(false);
        },
        category: 'action',
        keywords: ['theme', 'toggle', 'light', 'dark', 'mode'],
      },

      // Theme switching commands
      ...(themeContext
        ? themes.map((t) => ({
            id: `theme-${t.id}`,
            label: `Theme: ${t.label}`,
            icon: <Palette className="h-4 w-4" style={{color: t.preview}} />,
            action: () => {
              themeContext.setTheme(t.id);
              setIsOpen(false);
            },
            category: 'theme' as const,
            keywords: ['color', 'palette', t.label.toLowerCase()],
          }))
        : []),

      {
        id: 'download-resume',
        label: 'Download Resume',
        icon: <Download className="h-4 w-4" />,
        action: () => {
          window.open('/Ferry-Hinardi-Resume-2026.pdf', '_blank');
          setIsOpen(false);
        },
        category: 'action',
        keywords: ['cv', 'pdf', 'save'],
      },
      // Social Links
      {
        id: 'github',
        label: 'Open GitHub',
        icon: <Github className="h-4 w-4" />,
        action: () => {
          window.open('https://github.com/ferryhinardi', '_blank');
          setIsOpen(false);
        },
        category: 'social',
        keywords: ['code', 'repository', 'repos'],
      },
      {
        id: 'linkedin',
        label: 'Open LinkedIn',
        icon: <Linkedin className="h-4 w-4" />,
        action: () => {
          window.open('https://www.linkedin.com/in/ferryhinardi', '_blank');
          setIsOpen(false);
        },
        category: 'social',
        keywords: ['professional', 'network', 'job'],
      },
      {
        id: 'twitter',
        label: 'Open Twitter',
        icon: <Twitter className="h-4 w-4" />,
        action: () => {
          window.open('https://twitter.com/FerryHinardi', '_blank');
          setIsOpen(false);
        },
        category: 'social',
        keywords: ['x', 'social', 'tweets'],
      },
    ],
    [isDark, toggleDarkMode, handleSectionClick, handlePageClick, themeContext],
  );

  // Fuzzy search filter
  const filteredCommands = useMemo(() => {
    if (!searchQuery.trim()) return commands;

    const query = searchQuery.toLowerCase();
    return commands.filter((cmd) => {
      const labelMatch = cmd.label.toLowerCase().includes(query);
      const keywordMatch = cmd.keywords?.some((kw) =>
        kw.toLowerCase().includes(query),
      );
      return labelMatch || keywordMatch;
    });
  }, [commands, searchQuery]);

  // Group commands by category
  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {
      navigation: [],
      pages: [],
      action: [],
      theme: [],
      social: [],
    };

    filteredCommands.forEach((cmd) => {
      groups[cmd.category].push(cmd);
    });

    return groups;
  }, [filteredCommands]);

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Keyboard shortcut to open palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setSearchQuery('');
        setSelectedIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Keyboard navigation within palette
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredCommands.length - 1 ? prev + 1 : 0,
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredCommands.length - 1,
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands]);

  const handleDialogKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (e.key === 'Tab') {
        const dialog = e.currentTarget;
        const focusable = Array.from(
          dialog.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((el) => !el.hasAttribute('disabled'));

        if (focusable.length === 0) return;

        const firstEl = focusable[0];
        const lastEl = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    },
    [],
  );

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'navigation':
        return 'Sections';
      case 'pages':
        return 'Pages';
      case 'action':
        return 'Actions';
      case 'theme':
        return 'Themes';
      case 'social':
        return 'Social Links';
      default:
        return category;
    }
  };

  // Calculate flat index for selected state
  const getFlatIndex = (category: string, indexInCategory: number) => {
    let flatIndex = 0;
    const categories = ['navigation', 'pages', 'action', 'theme', 'social'];

    for (const cat of categories) {
      if (cat === category) {
        return flatIndex + indexInCategory;
      }
      flatIndex += groupedCommands[cat].length;
    }
    return flatIndex;
  };

  return (
    <>
      {/* Keyboard hint badge */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-4 right-4 z-40',
          'flex items-center gap-2 px-3 py-2 rounded-lg',
          'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm',
          'border border-gray-200 dark:border-gray-700',
          'text-sm text-gray-600 dark:text-gray-400',
          'hover:bg-white dark:hover:bg-gray-800',
          'transition-colors duration-200',
          'shadow-lg',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2',
        )}
        aria-label="Open command palette"
      >
        <Command className="h-4 w-4" />
        <span className="font-medium">K</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              transition={{duration: 0.15}}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
              data-testid="command-palette-backdrop"
            />

            {/* Command Palette Modal */}
            <motion.div
              ref={dialogRef}
              initial={{opacity: 0, scale: 0.95, y: -20}}
              animate={{opacity: 1, scale: 1, y: 0}}
              exit={{opacity: 0, scale: 0.95, y: -20}}
              transition={{duration: 0.15, ease: 'easeOut'}}
              className={cn(
                'fixed left-1/2 top-[20%] z-50 -translate-x-1/2',
                'w-full max-w-lg',
                'bg-white dark:bg-gray-900',
                'rounded-xl shadow-2xl',
                'border border-gray-200 dark:border-gray-700',
                'overflow-hidden',
              )}
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              onKeyDown={handleDialogKeyDown}
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type a command or search..."
                  className={cn(
                    'flex-1 bg-transparent',
                    'text-gray-900 dark:text-white',
                    'placeholder:text-gray-400',
                    'focus:outline-none',
                    'text-base',
                  )}
                  autoFocus
                  aria-label="Search commands"
                />
                <kbd
                  className={cn(
                    'hidden sm:inline-flex items-center gap-1',
                    'px-2 py-1 rounded',
                    'bg-gray-100 dark:bg-gray-800',
                    'text-xs text-gray-500 dark:text-gray-400',
                    'border border-gray-200 dark:border-gray-700',
                  )}
                >
                  ESC
                </kbd>
              </div>

              {/* Command List */}
              <div className="max-h-[300px] overflow-y-auto py-2">
                {filteredCommands.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No commands found for &quot;{searchQuery}&quot;
                  </div>
                ) : (
                  Object.entries(groupedCommands).map(
                    ([category, items]) =>
                      items.length > 0 && (
                        <div key={category} className="mb-2">
                          <div className="px-4 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {getCategoryLabel(category)}
                          </div>
                          {items.map((cmd, indexInCategory) => {
                            const flatIndex = getFlatIndex(
                              category,
                              indexInCategory,
                            );
                            const isSelected = flatIndex === selectedIndex;

                            return (
                              <motion.button
                                key={cmd.id}
                                onClick={cmd.action}
                                onMouseEnter={() => setSelectedIndex(flatIndex)}
                                className={cn(
                                  'w-full flex items-center gap-3 px-4 py-2.5',
                                  'text-left transition-colors duration-100',
                                  isSelected
                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800',
                                )}
                                role="option"
                                aria-selected={isSelected}
                              >
                                <span
                                  className={cn(
                                    'flex-shrink-0',
                                    isSelected
                                      ? 'text-blue-600 dark:text-blue-400'
                                      : 'text-gray-400',
                                  )}
                                >
                                  {cmd.icon}
                                </span>
                                <span className="flex-1 font-medium">
                                  {cmd.label}
                                </span>
                                {isSelected && (
                                  <motion.span
                                    initial={{opacity: 0, x: -10}}
                                    animate={{opacity: 1, x: 0}}
                                    className="text-xs text-gray-400"
                                  >
                                    <CornerDownLeft className="h-3 w-3" />
                                  </motion.span>
                                )}
                              </motion.button>
                            );
                          })}
                        </div>
                      ),
                  )
                )}
              </div>

              {/* Footer with keyboard hints */}
              <div
                className={cn(
                  'flex items-center justify-between px-4 py-2',
                  'border-t border-gray-200 dark:border-gray-700',
                  'bg-gray-50 dark:bg-gray-800/50',
                  'text-xs text-gray-500 dark:text-gray-400',
                )}
              >
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <ArrowUp className="h-3 w-3" />
                    <ArrowDown className="h-3 w-3" />
                    <span>Navigate</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <CornerDownLeft className="h-3 w-3" />
                    <span>Select</span>
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 font-mono">
                    ESC
                  </kbd>
                  <span>Close</span>
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
