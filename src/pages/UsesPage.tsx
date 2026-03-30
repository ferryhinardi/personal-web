import {useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {
  ChevronDown,
  ExternalLink,
  Monitor,
  Terminal,
  Wrench,
  Code,
  AppWindow,
} from 'lucide-react';
import PageLayout from '@/layouts/PageLayout';
import SEOHead from '@/components/SEOHead';
import {Card, CardContent} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {ErrorDisplay} from '@/components/ui/error';
import {staggerContainer, staggerItem} from '@/utils/animations';

interface UsesItem {
  name: string;
  description: string;
  url?: string;
}

interface UsesCategory {
  name: string;
  icon: string;
  items: UsesItem[];
}

interface UsesData {
  categories: UsesCategory[];
}

const iconMap: Record<string, React.ReactNode> = {
  monitor: <Monitor className="h-5 w-5" />,
  terminal: <Terminal className="h-5 w-5" />,
  wrench: <Wrench className="h-5 w-5" />,
  code: <Code className="h-5 w-5" />,
  'app-window': <AppWindow className="h-5 w-5" />,
};

function CategorySection({category}: {category: UsesCategory}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <motion.div variants={staggerItem}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 py-4 px-2 text-left group"
        aria-expanded={isOpen}
      >
        <span className="flex items-center justify-center h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
          {iconMap[category.icon] ?? <Wrench className="h-5 w-5" />}
        </span>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex-1">
          {category.name}
        </h2>
        <motion.span
          animate={{rotate: isOpen ? 180 : 0}}
          transition={{duration: 0.2}}
          className="text-gray-400 dark:text-gray-500"
        >
          <ChevronDown className="h-5 w-5" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{height: 0, opacity: 0}}
            animate={{height: 'auto', opacity: 1}}
            exit={{height: 0, opacity: 0}}
            transition={{duration: 0.3, ease: 'easeInOut'}}
            className="overflow-hidden"
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pb-6">
              {category.items.map((item) => (
                <Card
                  key={item.name}
                  className="group hover:shadow-md transition-shadow duration-200"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {item.name}
                      </h3>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors flex-shrink-0"
                          aria-label={`Visit ${item.name} website`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function UsesLoadingSkeleton() {
  return (
    <div className="space-y-8">
      {[1, 2, 3].map((i) => (
        <div key={i}>
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-7 w-40" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((j) => (
              <Skeleton key={j} className="h-32 rounded-xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function UsesPage() {
  const [data, setData] = useState<UsesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch('/data/uses.json')
      .then((res) => res.json())
      .then(setData)
      .catch((err) => {
        setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout
      title="Uses"
      description="Hardware, software, tools, and development setup I use daily."
    >
      <SEOHead
        title="Uses"
        description="Hardware, software, tools, and development setup I use daily."
        path="/uses"
      />
      {loading ? (
        <UsesLoadingSkeleton />
      ) : error ? (
        <ErrorDisplay
          error={error}
          title="Failed to load uses"
          message="Could not fetch your tools and setup. Please try again later."
        />
      ) : data ? (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="divide-y divide-gray-100 dark:divide-slate-700/50"
        >
          {data.categories.map((category) => (
            <CategorySection key={category.name} category={category} />
          ))}
        </motion.div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 py-20">
          Failed to load data. Please try again later.
        </p>
      )}
    </PageLayout>
  );
}
