/**
 * Project Metrics Visualization Component
 * Display portfolio project performance metrics with interactive charts
 */

import { useMemo } from 'react';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Code, Award } from 'lucide-react';

export interface ProjectMetric {
  name: string;
  category: string;
  technologies: string[];
  impact?: {
    users?: number;
    performance?: number; // Lighthouse score
    businessValue?: number; // 1-10 scale
    codeQuality?: number; // 1-10 scale
  };
  metrics?: {
    linesOfCode?: number;
    commits?: number;
    duration?: string; // e.g., "6 months"
    teamSize?: number;
  };
}

interface ProjectMetricsProps {
  projects: ProjectMetric[];
  className?: string;
}

const COLORS = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

export function ProjectMetrics({ projects, className = '' }: ProjectMetricsProps) {
  // Aggregate metrics
  const aggregatedData = useMemo(() => {
    const techCount: Record<string, number> = {};
    const categoryCount: Record<string, number> = {};
    let totalUsers = 0;
    let avgPerformance = 0;
    let projectsWithMetrics = 0;

    projects.forEach((project) => {
      // Count technologies
      project.technologies.forEach((tech) => {
        techCount[tech] = (techCount[tech] || 0) + 1;
      });

      // Count categories
      categoryCount[project.category] = (categoryCount[project.category] || 0) + 1;

      // Aggregate impact metrics
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

  // Prepare data for charts
  const technologyData = useMemo(() => {
    return Object.entries(aggregatedData.techCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));
  }, [aggregatedData]);

  const categoryData = useMemo(() => {
    return Object.entries(aggregatedData.categoryCount).map(([name, value]) => ({ name, value }));
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

  // Stats cards
  const stats = [
    {
      icon: Code,
      label: 'Total Projects',
      value: aggregatedData.totalProjects,
      color: 'text-sky-600 dark:text-sky-400',
      bgColor: 'bg-sky-100 dark:bg-sky-900/20',
    },
    {
      icon: Users,
      label: 'Total Users Reached',
      value: aggregatedData.totalUsers.toLocaleString(),
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      icon: TrendingUp,
      label: 'Avg Performance Score',
      value: `${Math.round(aggregatedData.avgPerformance)}/100`,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      icon: Award,
      label: 'Technologies Used',
      value: Object.keys(aggregatedData.techCount).length,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
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
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="businessValue"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="codeQuality"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ r: 4 }}
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
      </div>
    </div>
  );
}

export default ProjectMetrics;
