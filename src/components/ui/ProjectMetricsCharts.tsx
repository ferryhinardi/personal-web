import {useMemo} from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';

import type {ProjectMetric} from './project-metrics';

interface ProjectMetricsChartsProps {
  projects: ProjectMetric[];
}

const COLORS = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

export default function ProjectMetricsCharts({projects}: ProjectMetricsChartsProps) {
  const aggregatedData = useMemo(() => {
    const techCount: Record<string, number> = {};
    const categoryCount: Record<string, number> = {};
    let totalUsers = 0;
    let avgPerformance = 0;
    let projectsWithMetrics = 0;

    projects.forEach((project) => {
      project.technologies.forEach((tech) => {
        techCount[tech] = (techCount[tech] || 0) + 1;
      });

      categoryCount[project.category] = (categoryCount[project.category] || 0) + 1;

      if (project.impact) {
        if (project.impact.users) totalUsers += project.impact.users;
        if (project.impact.performance) {
          avgPerformance += project.impact.performance;
          projectsWithMetrics++;
        }
      }
    });

    return {
      techCount,
      categoryCount,
      totalUsers,
      avgPerformance: projectsWithMetrics > 0 ? avgPerformance / projectsWithMetrics : 0,
      totalProjects: projects.length,
    };
  }, [projects]);
  const technologyData = useMemo(() => {
    return Object.entries(aggregatedData.techCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({name, value}));
  }, [aggregatedData]);

  const categoryData = useMemo(() => {
    return Object.entries(aggregatedData.categoryCount).map(([name, value]) => ({name, value}));
  }, [aggregatedData]);

  const projectImpactData = useMemo(() => {
    return projects
      .filter((p) => p.impact)
      .map((p) => ({
        name: p.name.substring(0, 20),
        performance: p.impact?.performance || 0,
        businessValue: p.impact?.businessValue || 0,
        codeQuality: p.impact?.codeQuality || 0,
      }))
      .slice(0, 6);
  }, [projects]);

  const skillsRadarData = useMemo(() => {
    const topTechs = Object.entries(aggregatedData.techCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    return topTechs.map(([tech, count]) => ({
      subject: tech,
      value: Math.min((count / projects.length) * 100, 100),
      fullMark: 100,
    }));
  }, [aggregatedData, projects]);

  return (
    <>
      {/* Technology Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Technology Stack</CardTitle>
          <CardDescription>Most used technologies across projects</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={technologyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="value" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Project Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Project Categories</CardTitle>
          <CardDescription>Distribution of projects by category</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props: any) =>
                  `${props.name || ''} ${((props.percent || 0) * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Project Impact Comparison */}
      {projectImpactData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Project Impact Analysis</CardTitle>
            <CardDescription>Performance, business value, and code quality</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={projectImpactData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="performance"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{r: 4}}
                />
                <Line
                  type="monotone"
                  dataKey="businessValue"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{r: 4}}
                />
                <Line
                  type="monotone"
                  dataKey="codeQuality"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{r: 4}}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Skills Radar */}
      {skillsRadarData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Skills Proficiency</CardTitle>
            <CardDescription>Technology usage frequency</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={skillsRadarData}>
                <PolarGrid className="stroke-muted" />
                <PolarAngleAxis dataKey="subject" className="text-xs" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar
                  name="Skills"
                  dataKey="value"
                  stroke="#0ea5e9"
                  fill="#0ea5e9"
                  fillOpacity={0.6}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </>
  );
}
