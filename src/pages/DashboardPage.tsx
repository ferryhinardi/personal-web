import {useState, useCallback, useMemo} from 'react';
import {motion} from 'framer-motion';
import {GitBranch, Users, Star, Code} from 'lucide-react';
import PageLayout from '@/layouts/PageLayout';
import SEOHead from '@/components/SEOHead';
import {useResumeData} from '@/hooks/useResumeData';
import type {GitHubStats} from '@/hooks/useGitHubActivity';
import StatCard from '@/components/dashboard/StatCard';
import GitHubActivitySection from '@/components/dashboard/GitHubActivity';
import CodingStats from '@/components/dashboard/CodingStats';
import {staggerContainer, staggerItem} from '@/utils/animations';

/**
 * Extracts GitHub username from social links in resume data.
 */
function getGitHubUsername(social: Array<{name: string; url: string}>): string {
  const github = social.find((s) => s.name === 'github');
  if (!github) return 'ferryhinardi';
  const parts = github.url.replace(/\/+$/, '').split('/');
  return parts[parts.length - 1] || 'ferryhinardi';
}

/**
 * Dashboard page - GitHub activity, WakaTime stats, and developer analytics.
 */
export default function DashboardPage() {
  const {data: resumeData} = useResumeData();
  const [ghStats, setGhStats] = useState<GitHubStats | null>(null);

  const username = useMemo(
    () => (resumeData?.main?.social ? getGitHubUsername(resumeData.main.social) : 'ferryhinardi'),
    [resumeData],
  );

  const handleStatsLoaded = useCallback((stats: GitHubStats) => {
    setGhStats((prev) => {
      // Avoid unnecessary re-renders if stats haven't changed
      if (
        prev &&
        prev.publicRepos === stats.publicRepos &&
        prev.followers === stats.followers &&
        prev.totalStars === stats.totalStars
      ) {
        return prev;
      }
      return stats;
    });
  }, []);

  // Determine top language placeholder (GitHub API doesn't directly give this)
  const topLanguage = 'TypeScript';

  return (
    <PageLayout
      title="Dashboard"
      description="Personal developer dashboard with GitHub activity, coding stats, and more."
    >
      <SEOHead
        title="Dashboard"
        description="Personal developer dashboard with GitHub activity, coding stats, and more."
        path="/dashboard"
      />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Overview Stat Cards */}
        <motion.div
          variants={staggerItem}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard
            title="Repositories"
            value={ghStats?.publicRepos ?? '--'}
            icon={GitBranch}
            iconColor="text-blue-500"
          />
          <StatCard
            title="Followers"
            value={ghStats?.followers ?? '--'}
            icon={Users}
            iconColor="text-green-500"
          />
          <StatCard
            title="Total Stars"
            value={ghStats?.totalStars ?? '--'}
            icon={Star}
            iconColor="text-yellow-500"
            description="Across all repos"
          />
          <StatCard
            title="Top Language"
            value={topLanguage}
            icon={Code}
            iconColor="text-purple-500"
          />
        </motion.div>

        {/* GitHub Activity Section */}
        <GitHubActivitySection
          username={username}
          onStatsLoaded={handleStatsLoaded}
        />

        {/* Coding Stats Section */}
        <CodingStats />
      </motion.div>
    </PageLayout>
  );
}
