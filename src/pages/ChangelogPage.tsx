import {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import {Plus, RefreshCw, Bug, Trash2} from 'lucide-react';
import PageLayout from '@/layouts/PageLayout';
import SEOHead from '@/components/SEOHead';
import {Badge} from '@/components/ui/badge';
import {Skeleton} from '@/components/ui/skeleton';
import {staggerContainer, staggerItem} from '@/utils/animations';

type ChangeType = 'added' | 'changed' | 'fixed' | 'removed';

interface Change {
  type: ChangeType;
  description: string;
}

interface Version {
  version: string;
  title: string;
  date: string;
  changes: Change[];
}

interface ChangelogData {
  versions: Version[];
}

const changeTypeConfig: Record<
  ChangeType,
  {icon: React.ReactNode; color: string; bgColor: string; label: string}
> = {
  added: {
    icon: <Plus className="h-3.5 w-3.5" />,
    color: 'text-green-700 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-900/30',
    label: 'Added',
  },
  changed: {
    icon: <RefreshCw className="h-3.5 w-3.5" />,
    color: 'text-blue-700 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/30',
    label: 'Changed',
  },
  fixed: {
    icon: <Bug className="h-3.5 w-3.5" />,
    color: 'text-yellow-700 dark:text-yellow-400',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/30',
    label: 'Fixed',
  },
  removed: {
    icon: <Trash2 className="h-3.5 w-3.5" />,
    color: 'text-red-700 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-900/30',
    label: 'Removed',
  },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function VersionEntry({
  version,
  isLatest,
}: {
  version: Version;
  isLatest: boolean;
}) {
  return (
    <motion.div variants={staggerItem} className="relative pl-8 pb-12 last:pb-0">
      {/* Timeline line */}
      <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-gray-200 dark:bg-slate-700 last:hidden" />

      {/* Timeline dot */}
      <div
        className={`absolute left-0 top-1.5 h-6 w-6 rounded-full border-2 flex items-center justify-center ${
          isLatest
            ? 'border-blue-500 bg-blue-500'
            : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800'
        }`}
      >
        {isLatest && (
          <div className="h-2 w-2 rounded-full bg-white" />
        )}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            variant={isLatest ? 'default' : 'outline'}
            className="text-sm font-mono"
          >
            v{version.version}
          </Badge>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {version.title}
          </h3>
          {isLatest && (
            <Badge variant="success" className="text-xs">
              Latest
            </Badge>
          )}
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(version.date)}
        </p>

        {/* Changes list */}
        <div className="space-y-2">
          {version.changes.map((change, idx) => {
            const config = changeTypeConfig[change.type];
            return (
              <div
                key={idx}
                className={`flex items-start gap-3 rounded-lg px-3 py-2 ${config.bgColor}`}
              >
                <span
                  className={`flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap pt-0.5 ${config.color}`}
                >
                  {config.icon}
                  {config.label}
                </span>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {change.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function ChangelogLoadingSkeleton() {
  return (
    <div className="space-y-10">
      {[1, 2, 3].map((i) => (
        <div key={i} className="pl-8 space-y-4">
          <div className="flex gap-3">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-4 w-32" />
          <div className="space-y-2">
            {[1, 2, 3, 4].map((j) => (
              <Skeleton key={j} className="h-10 rounded-lg" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ChangelogPage() {
  const [data, setData] = useState<ChangelogData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/changelog.json')
      .then((res) => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout
      title="Changelog"
      description="Version history and updates to this portfolio website."
    >
      <SEOHead
        title="Changelog"
        description="Version history and updates to this portfolio website."
        path="/changelog"
      />
      {loading ? (
        <ChangelogLoadingSkeleton />
      ) : data ? (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          {data.versions.map((version, idx) => (
            <VersionEntry
              key={version.version}
              version={version}
              isLatest={idx === 0}
            />
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
