import { useState, useEffect } from 'react';

export interface GitHubEvent {
  id: string;
  type: string;
  actor: {
    login: string;
    avatar_url: string;
  };
  repo: {
    name: string;
    url: string;
  };
  payload: {
    commits?: Array<{ message: string }>;
    action?: string;
    ref?: string;
    size?: number;
  };
  created_at: string;
}

export interface GitHubStats {
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  contributions: number;
}

/**
 * Hook to fetch GitHub activity and stats
 */
export function useGitHubActivity(username: string) {
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGitHubData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch user profile
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        if (!userResponse.ok) throw new Error('Failed to fetch GitHub profile');
        const userData = await userResponse.json();

        // Fetch recent events
        const eventsResponse = await fetch(
          `https://api.github.com/users/${username}/events/public?per_page=10`
        );
        if (!eventsResponse.ok) throw new Error('Failed to fetch GitHub events');
        const eventsData = await eventsResponse.json();

        // Fetch repositories for star count
        const reposResponse = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
        );
        const reposData = await reposResponse.json();
        const totalStars = reposData.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0);

        setStats({
          publicRepos: userData.public_repos,
          followers: userData.followers,
          following: userData.following,
          totalStars,
          contributions: 0, // GitHub doesn't expose this via API anymore
        });

        setEvents(eventsData);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch GitHub data');
        setLoading(false);
      }
    };

    if (username) {
      fetchGitHubData();
    }
  }, [username]);

  const getEventDescription = (event: GitHubEvent): string => {
    switch (event.type) {
      case 'PushEvent':
        const commitCount = event.payload.size || 1;
        return `Pushed ${commitCount} commit${commitCount > 1 ? 's' : ''} to ${event.repo.name}`;
      case 'CreateEvent':
        return `Created ${event.payload.ref || 'repository'} in ${event.repo.name}`;
      case 'PullRequestEvent':
        return `${event.payload.action} pull request in ${event.repo.name}`;
      case 'IssuesEvent':
        return `${event.payload.action} issue in ${event.repo.name}`;
      case 'WatchEvent':
        return `Starred ${event.repo.name}`;
      case 'ForkEvent':
        return `Forked ${event.repo.name}`;
      default:
        return `Activity in ${event.repo.name}`;
    }
  };

  const getEventIcon = (type: string): string => {
    switch (type) {
      case 'PushEvent':
        return '📝';
      case 'CreateEvent':
        return '✨';
      case 'PullRequestEvent':
        return '🔀';
      case 'IssuesEvent':
        return '🐛';
      case 'WatchEvent':
        return '⭐';
      case 'ForkEvent':
        return '🍴';
      default:
        return '📌';
    }
  };

  const getRelativeTime = (date: string): string => {
    const now = new Date();
    const eventDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - eventDate.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
  };

  return {
    events,
    stats,
    loading,
    error,
    getEventDescription,
    getEventIcon,
    getRelativeTime,
  };
}
