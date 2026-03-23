import {useEffect} from 'react';
import {motion} from 'framer-motion';
import {ExternalLink} from 'lucide-react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {useGitHubActivity} from '@/hooks/useGitHubActivity';
import type {GitHubStats} from '@/hooks/useGitHubActivity';
import {staggerItem} from '@/utils/animations';

interface GitHubActivitySectionProps {
  username: string;
  onStatsLoaded?: (stats: GitHubStats) => void;
}

export default function GitHubActivitySection({
  username,
  onStatsLoaded,
}: GitHubActivitySectionProps) {
  const {events, stats, loading, error, getEventDescription, getEventIcon, getRelativeTime} =
    useGitHubActivity(username);

  // Notify parent when stats arrive
  useEffect(() => {
    if (stats && onStatsLoaded) {
      onStatsLoaded(stats);
    }
  }, [stats, onStatsLoaded]);

  if (loading) {
    return (
      <motion.div variants={staggerItem} className="space-y-4">
        <h2 className="text-xl font-semibold">GitHub Activity</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <Skeleton className="h-6 w-6 mx-auto" />
                  <Skeleton className="h-8 w-16 mx-auto" />
                  <Skeleton className="h-4 w-20 mx-auto" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="pt-6 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div variants={staggerItem}>
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-red-500">
              Failed to load GitHub activity: {error}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div variants={staggerItem} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">GitHub Activity</h2>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
        >
          View Profile
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Profile Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.publicRepos}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Repositories</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.followers}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Followers</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.following}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Following</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalStars}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Stars</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.slice(0, 10).map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-slate-600 last:border-b-0 last:pb-0"
              >
                <div className="text-xl flex-shrink-0 mt-0.5">
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {getEventDescription(event)}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {getRelativeTime(event.created_at)}
                  </p>
                </div>
              </div>
            ))}

            {events.length === 0 && (
              <p className="text-center text-gray-500 py-4">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
