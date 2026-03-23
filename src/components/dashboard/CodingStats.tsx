import {motion} from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Skeleton} from '@/components/ui/skeleton';
import {useWakaTime} from '@/hooks/useWakaTime';
import {staggerItem} from '@/utils/animations';

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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Languages Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Languages (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={languageData}
                  layout="vertical"
                  margin={{top: 0, right: 20, left: 0, bottom: 0}}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="rgba(156,163,175,0.2)"
                  />
                  <XAxis type="number" domain={[0, 100]} unit="%" tick={{fontSize: 12}} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={80}
                    tick={{fontSize: 12}}
                  />
                  <Tooltip
                    formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Usage']}
                    contentStyle={{
                      backgroundColor: 'rgba(15,23,42,0.95)',
                      border: '1px solid rgba(56,189,248,0.3)',
                      borderRadius: '8px',
                      color: '#e2e8f0',
                    }}
                  />
                  <Bar dataKey="percent" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Daily Coding Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Daily Coding Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dailyCoding}
                  margin={{top: 5, right: 20, left: 0, bottom: 0}}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(156,163,175,0.2)"
                  />
                  <XAxis dataKey="date" tick={{fontSize: 12}} />
                  <YAxis unit="h" tick={{fontSize: 12}} />
                  <Tooltip
                    formatter={(value) => [`${Number(value).toFixed(1)} hrs`, 'Coding Time']}
                    contentStyle={{
                      backgroundColor: 'rgba(15,23,42,0.95)',
                      border: '1px solid rgba(56,189,248,0.3)',
                      borderRadius: '8px',
                      color: '#e2e8f0',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke="#3178c6"
                    strokeWidth={2}
                    dot={{fill: '#3178c6', r: 4}}
                    activeDot={{r: 6}}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
