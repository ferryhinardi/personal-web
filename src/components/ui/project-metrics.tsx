/**
 * Project Metrics Visualization Component
 * Display portfolio project performance metrics with interactive charts
 */

import {lazy, Suspense} from 'react';
import {useMemo} from 'react';
import {Card, CardContent} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {TrendingUp, Users, Code, Award} from 'lucide-react';

const ProjectMetricsCharts = lazy(() => import('./ProjectMetricsCharts.tsx'));

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

export function ProjectMetrics({ projects, className = '' }: ProjectMetricsProps) {
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

      {/* Charts Grid - Lazy loaded */}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProjectMetricsCharts projects={projects} />
        </div>
      </Suspense>
    </div>
  );
}

export default ProjectMetrics;
