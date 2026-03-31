import {lazy, Suspense} from 'react';
import {motion} from 'framer-motion';
import {Card, CardContent} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Skeleton} from '@/components/ui/skeleton';
import {useWakaTime} from '@/hooks/useWakaTime';
import {staggerItem} from '@/utils/animations';

const RechartsCharts = lazy(() => import('./CodingStatsCharts'));

export default function CodingStats() {
  const {stats, dailyCoding, loading, isSampleData} = useWakaTime();

  if (loading) {
    return (
      <motion.div variants={staggerItem} className="space-y-4">
        <h2 className="text-xl font-semibold">Coding Stats</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </motion.div>
    );
  }

  if (!stats) return null;

  const languageData = stats.languages.map((lang) => ({
    name: lang.name,
    percent: lang.percent,
    fill: lang.color,
  }));

  return (
    <motion.div variants={staggerItem} className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">Coding Stats</h2>
        {isSampleData && (
          <Badge variant="outline" className="text-xs">
            Sample Data
          </Badge>
        )}
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total (7 days)</p>
              <p className="text-xl font-bold mt-1">{stats.totalCodingTime}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Daily Average</p>
              <p className="text-xl font-bold mt-1">{stats.dailyAverage.text}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Best Day</p>
              <p className="text-xl font-bold mt-1">
                {stats.bestDay?.text || 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts - Lazy loaded */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
        }
      >
        <RechartsCharts languageData={languageData} dailyCoding={dailyCoding} />
      </Suspense>
    </motion.div>
  );
}
