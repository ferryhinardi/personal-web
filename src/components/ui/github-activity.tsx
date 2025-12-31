import { useGitHubActivity } from '@/hooks/useGitHubActivity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, GitBranch, Star, Users } from 'lucide-react';
import { Loading } from '@/components/ui/loading';

interface GitHubActivityProps {
  username: string;
  maxEvents?: number;
  showStats?: boolean;
}

export function GitHubActivity({ 
  username, 
  maxEvents = 5,
  showStats = true 
}: GitHubActivityProps) {
  const {
    events,
    stats,
    loading,
    error,
    getEventDescription,
    getEventIcon,
    getRelativeTime,
  } = useGitHubActivity(username);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <Loading message="Loading GitHub activity..." />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-red-500">
            Failed to load GitHub activity: {error}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {showStats && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <GitBranch className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">{stats.publicRepos}</div>
                <div className="text-sm text-gray-500">Repositories</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Star className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                <div className="text-2xl font-bold">{stats.totalStars}</div>
                <div className="text-sm text-gray-500">Stars</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="w-6 h-6 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">{stats.followers}</div>
                <div className="text-sm text-gray-500">Followers</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold">{stats.following}</div>
                <div className="text-sm text-gray-500">Following</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Activity</span>
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
            >
              View on GitHub
              <ExternalLink className="w-4 h-4" />
            </a>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.slice(0, maxEvents).map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 pb-3 border-b last:border-b-0"
              >
                <div className="text-2xl">{getEventIcon(event.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    {getEventDescription(event)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {getRelativeTime(event.created_at)}
                  </p>
                </div>
              </div>
            ))}

            {events.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No recent activity
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
