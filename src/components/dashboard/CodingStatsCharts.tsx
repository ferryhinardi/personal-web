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

interface CodingStatsChartsProps {
  languageData: Array<{name: string; percent: number; fill: string}>;
  dailyCoding: Array<{date: string; hours: number}>;
}

export default function CodingStatsCharts({
  languageData,
  dailyCoding,
}: CodingStatsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  formatter={(value: number | undefined) => value !== undefined ? [`${Number(value).toFixed(1)}%`, 'Usage'] : []}
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
                  formatter={(value: number | undefined) => value !== undefined ? [`${Number(value).toFixed(1)} hrs`, 'Coding Time'] : []}
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
  );
}
