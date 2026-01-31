import {useState, useEffect, useCallback, useMemo} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {
  Command,
  Home,
  User,
  FileText,
  Briefcase,
  Mail,
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

interface CommandItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  category: 'navigation' | 'action' | 'social';
  keywords?: string[];
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const {isDark, toggleDarkMode} = useDarkMode();

  const handleNavClick = useCallback((href: string) => {
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({top: offsetPosition, behavior: 'smooth'});
    }
    setIsOpen(false);
  }, []);

  const commands: CommandItem[] = useMemo(
    () => [
      // Navigation
      {
        id: 'home',
        label: 'Home',
        icon: <Home className="h-4 w-4" />,
        action: () => handleNavClick('#home'),
        category: 'navigation',
        keywords: ['top', 'start', 'beginning'],
      },
      {
        id: 'about',
        label: 'About',
        icon: <User className="h-4 w-4" />,
        action: () => handleNavClick('#about'),
        category: 'navigation',
        keywords: ['bio', 'me', 'profile', 'introduction'],
      },
      {
        id: 'resume',
        label: 'Resume',
        icon: <FileText className="h-4 w-4" />,
        action: () => handleNavClick('#resume'),
        category: 'navigation',
        keywords: ['cv', 'experience', 'work history', 'skills', 'education'],
      },
      {
        id: 'works',
        label: 'Works',
        icon: <Briefcase className="h-4 w-4" />,
        action: () => handleNavClick('#portfolio'),
        category: 'navigation',
        keywords: ['portfolio', 'projects', 'showcase'],
      },
      {
        id: 'contact',
        label: 'Contact',
        icon: <Mail className="h-4 w-4" />,
        action: () => handleNavClick('#contact'),
        category: 'navigation',
        keywords: ['email', 'message', 'reach out', 'hire'],
      },
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
      {
        id: 'download-resume',
        label: 'Download Resume',
        icon: <Download className="h-4 w-4" />,
        action: () => {
          window.open('/Ferry-Hinardi-Resume-2025.pdf', '_blank');
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
    [isDark, toggleDarkMode, handleNavClick],
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
      action: [],
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

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'navigation':
        return 'Navigation';
      case 'action':
        return 'Actions';
      case 'social':
        return 'Social Links';
      default:
        return category;
    }
  };

  // Calculate flat index for selected state
  const getFlatIndex = (category: string, indexInCategory: number) => {
    let flatIndex = 0;
    const categories = ['navigation', 'action', 'social'];

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
                    No commands found for "{searchQuery}"
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
