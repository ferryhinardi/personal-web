import {useState, useEffect, useMemo, useCallback} from 'react';
import {motion} from 'framer-motion';
import {
  Award,
  BadgeCheck,
  Trophy,
  ExternalLink,
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import PageLayout from '@/layouts/PageLayout';
import SEOHead from '@/components/SEOHead';
import {Card, CardContent} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Skeleton} from '@/components/ui/skeleton';
import {ErrorDisplay} from '@/components/ui/error';
import {useFetch} from '@/hooks/useFetch';
import {staggerContainer, staggerItem} from '@/utils/animations';

interface Achievement {
  id: string;
  title: string;
  description: string;
  type: 'certificate' | 'badge' | 'award';
  category: string;
  issuer: string;
  date: string;
  url?: string;
  image?: string;
}

interface AchievementsData {
  achievements: Achievement[];
}

type FilterType = 'all' | 'certificate' | 'badge' | 'award';

const ITEMS_PER_PAGE = 12;

const typeConfig: Record<
  Achievement['type'],
  {icon: React.ReactNode; color: string; label: string}
> = {
  certificate: {
    icon: <Award className="h-5 w-5" />,
    color:
      'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    label: 'Certificate',
  },
  badge: {
    icon: <BadgeCheck className="h-5 w-5" />,
    color:
      'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    label: 'Badge',
  },
  award: {
    icon: <Trophy className="h-5 w-5" />,
    color:
      'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    label: 'Award',
  },
};

const filterOptions: {value: FilterType; label: string}[] = [
  {value: 'all', label: 'All'},
  {value: 'certificate', label: 'Certificates'},
  {value: 'badge', label: 'Badges'},
  {value: 'award', label: 'Awards'},
];

function formatDate(dateStr: string): string {
  const [year, month] = dateStr.split('-');
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString('en-US', {year: 'numeric', month: 'long'});
}

function AchievementCard({achievement}: {achievement: Achievement}) {
  const config = typeConfig[achievement.type];

  return (
    <motion.div variants={staggerItem}>
      <Card className="h-full hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6 flex flex-col h-full">
          {/* Type Badge & Date */}
          <div className="flex items-center justify-between mb-4">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${config.color}`}
            >
              {config.icon}
              {config.label}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="h-3 w-3" />
              {formatDate(achievement.date)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            {achievement.title}
          </h3>

          {/* Issuer */}
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3">
            {achievement.issuer}
          </p>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1">
            {achievement.description}
          </p>

          {/* Category & Link */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-slate-600/50">
            <Badge variant="secondary" className="text-xs">
              {achievement.category}
            </Badge>
            {achievement.url && achievement.url !== '' && (
              <a
                href={achievement.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                View credential
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function AchievementsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-full max-w-sm rounded-lg" />
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-64 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  // Build page numbers to show: always show first, last, current, and neighbors
  const pages: (number | 'ellipsis')[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== 'ellipsis') {
      pages.push('ellipsis');
    }
  }

  return (
    <nav
      aria-label="Achievements pagination"
      className="flex items-center justify-center gap-1"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex items-center justify-center h-9 w-9 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((page, idx) =>
        page === 'ellipsis' ? (
          <span
            key={`ellipsis-${idx}`}
            className="h-9 w-9 inline-flex items-center justify-center text-gray-400 text-sm"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
              page === currentPage
                ? 'bg-blue-600 text-white shadow-sm'
                : 'hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300'
            }`}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex items-center justify-center h-9 w-9 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

export default function AchievementsPage() {
  const {data, loading, error} = useFetch<AchievementsData>('/data/achievements.json');
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [filter, search]);

  const filtered = useMemo(() => {
    if (!data) return [];
    let results = data.achievements;

    // Type filter
    if (filter !== 'all') {
      results = results.filter((a) => a.type === filter);
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      results = results.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.issuer.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q),
      );
    }

    return results;
  }, [data, filter, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = useMemo(
    () =>
      filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    [filtered, page],
  );

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    // Scroll to top of content area
    window.scrollTo({top: 0, behavior: 'smooth'});
  }, []);

  return (
    <PageLayout
      title="Achievements"
      description="Certificates, badges, and professional achievements."
    >
      <SEOHead
        title="Achievements"
        description="Certificates, badges, and professional achievements earned throughout my career."
        path="/achievements"
      />
      {loading ? (
        <AchievementsLoadingSkeleton />
      ) : error ? (
        <ErrorDisplay
          error={error}
          title="Failed to load achievements"
          message="Could not fetch your achievements. Please try again later."
        />
      ) : data ? (
        <div className="space-y-8">
          {/* Search Input */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search achievements..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 py-2 pl-10 pr-4 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {filterOptions.map((option) => {
              const count =
                option.value === 'all'
                  ? data.achievements.length
                  : data.achievements.filter(
                      (a) => a.type === option.value,
                    ).length;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFilter(option.value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    filter === option.value
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {option.label}
                  <span className="ml-1.5 text-xs opacity-75">{count}</span>
                </button>
              );
            })}

            {/* Results count */}
            <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              {search.trim() && ' found'}
            </span>
          </div>

          {/* Cards Grid */}
          {paged.length > 0 ? (
            <motion.div
              key={`${filter}-${search}-${page}`}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {paged.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                />
              ))}
            </motion.div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-12">
              {search.trim()
                ? `No achievements matching "${search}".`
                : 'No achievements found for this filter.'}
            </p>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 py-20">
          Failed to load data. Please try again later.
        </p>
      )}
    </PageLayout>
  );
}
