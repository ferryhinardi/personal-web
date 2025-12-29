import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface Skill {
  name: string;
  level: string;
}

interface SkillsRadarProps {
  skills: Skill[];
  className?: string;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
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

export default function SkillsRadar({ skills, className = '' }: SkillsRadarProps) {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  // Transform skills data for radar chart
  const chartData = skills.map((skill) => ({
    name: skill.name,
    value: parseInt(skill.level.replace('%', '')),
    fullMark: 100,
  }));

  // Group skills into categories for display
  const skillsByCategory = {
    frontend: skills.filter((s) =>
      ['React.js', 'TypeScript', 'Next.js', 'JavaScript', 'HTML5 & CSS'].includes(s.name)
    ),
    mobile: skills.filter((s) => ['React Native'].includes(s.name)),
    backend: skills.filter((s) => ['GraphQL', 'Node.js', 'REST APIs'].includes(s.name)),
    devops: skills.filter((s) =>
      ['GitHub Actions', 'AWS (S3, CloudFront, ECS)', 'Docker'].includes(s.name)
    ),
    design: skills.filter((s) => ['Figma'].includes(s.name)),
  };

  return (
    <div className={`${className}`}>
      {/* Radar Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
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
              tick={{ fill: '#64748b', fontSize: 10 }}
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
      </motion.div>

      {/* Skills List by Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(skillsByCategory).map(([category, categorySkills]) => {
          if (categorySkills.length === 0) return null;

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-cyan-400 mb-4 capitalize">
                {category}
              </h3>
              <div className="space-y-3">
                {categorySkills.map((skill) => {
                  const level = parseInt(skill.level.replace('%', ''));
                  const isSelected = selectedSkill === skill.name;

                  return (
                    <div
                      key={skill.name}
                      className="group cursor-pointer"
                      onMouseEnter={() => setSelectedSkill(skill.name)}
                      onMouseLeave={() => setSelectedSkill(null)}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span
                          className={`text-sm font-medium transition-colors duration-200 ${
                            isSelected ? 'text-cyan-300' : 'text-gray-300'
                          }`}
                        >
                          {skill.name}
                        </span>
                        <span className="text-xs text-gray-500">{skill.level}</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${level}%` }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 1,
                            ease: 'easeOut',
                            delay: 0.2,
                          }}
                          className={`h-full rounded-full transition-all duration-300 ${
                            isSelected
                              ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600'
                              : 'bg-gradient-to-r from-cyan-500/80 via-blue-600/80 to-purple-700/80'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
