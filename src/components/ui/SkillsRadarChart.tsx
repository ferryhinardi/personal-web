import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface SkillsRadarChartProps {
  skills: Array<{name: string; level: string}>;
}

const CustomTooltip = ({active, payload}: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-xl border border-cyan-500/30">
        <p className="font-semibold text-cyan-400">{payload[0].payload.name}</p>
        <p className="text-sm text-gray-300">Level: {payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function SkillsRadarChart({skills}: SkillsRadarChartProps) {
  const chartData = skills.map((skill) => ({
    name: skill.name,
    value: parseInt(skill.level.replace('%', '')),
    fullMark: 100,
  }));

  return (
    <div>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={chartData}>
          <PolarGrid
            stroke="#22d3ee"
            strokeOpacity={0.2}
            strokeWidth={1}
          />
          <PolarAngleAxis
            dataKey="name"
            tick={{
              fill: '#94a3b8',
              fontSize: 12,
              fontWeight: 500,
            }}
            tickLine={false}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{fill: '#64748b', fontSize: 10}}
            tickCount={6}
          />
          <Radar
            name="Skill Level"
            dataKey="value"
            stroke="#22d3ee"
            fill="url(#radarGradient)"
            fillOpacity={0.6}
            strokeWidth={2}
            animationDuration={1000}
            animationEasing="ease-out"
          />
          <Tooltip content={<CustomTooltip />} />
          <defs>
            <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.8} />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.4} />
            </linearGradient>
          </defs>
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
