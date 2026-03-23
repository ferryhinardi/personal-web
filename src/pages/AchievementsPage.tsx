import {useState, useEffect, useMemo} from 'react';
import {motion} from 'framer-motion';
import {Award, BadgeCheck, Trophy, ExternalLink, Calendar} from 'lucide-react';
import PageLayout from '@/layouts/PageLayout';
import SEOHead from '@/components/SEOHead';
import {Card, CardContent} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Skeleton} from '@/components/ui/skeleton';
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
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-64 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function AchievementsPage() {
  const [data, setData] = useState<AchievementsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    fetch('/data/achievements.json')
      .then((res) => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!data) return [];
    if (filter === 'all') return data.achievements;
    return data.achievements.filter((a) => a.type === filter);
  }, [data, filter]);

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
      ) : data ? (
        <div className="space-y-8">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
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
                {option.value !== 'all' && (
                  <span className="ml-1.5 text-xs opacity-75">
                    {data.achievements.filter(
                      (a) => a.type === option.value,
                    ).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <motion.div
            key={filter}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
              />
            ))}
          </motion.div>

          {filtered.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-12">
              No achievements found for this filter.
            </p>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 py-20">
          Failed to load data. Please try again later.
        </p>
      )}
    </PageLayout>
  );
}
