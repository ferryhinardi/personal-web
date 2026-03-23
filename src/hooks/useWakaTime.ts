import {useState, useEffect} from 'react';

export interface WakaTimeLanguage {
  name: string;
  percent: number;
  hours: number;
  minutes: number;
  color: string;
}

export interface WakaTimeDailyAverage {
  hours: number;
  minutes: number;
  text: string;
}

export interface WakaTimeStats {
  languages: WakaTimeLanguage[];
  dailyAverage: WakaTimeDailyAverage;
  totalCodingTime: string;
  bestDay: {date: string; text: string} | null;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  JSON: '#292929',
  Markdown: '#083fa1',
  YAML: '#cb171e',
  Bash: '#89e051',
  SQL: '#e38c00',
  GraphQL: '#e10098',
  Dart: '#00B4AB',
  Vue: '#41b883',
  Svelte: '#ff3e00',
};

const SAMPLE_DATA: WakaTimeStats = {
  languages: [
    {name: 'TypeScript', percent: 45.2, hours: 12, minutes: 30, color: '#3178c6'},
    {name: 'JavaScript', percent: 18.7, hours: 5, minutes: 10, color: '#f7df1e'},
    {name: 'CSS', percent: 12.3, hours: 3, minutes: 24, color: '#563d7c'},
    {name: 'HTML', percent: 8.5, hours: 2, minutes: 21, color: '#e34c26'},
    {name: 'JSON', percent: 6.1, hours: 1, minutes: 41, color: '#292929'},
    {name: 'Python', percent: 5.2, hours: 1, minutes: 26, color: '#3572A5'},
    {name: 'Markdown', percent: 4.0, hours: 1, minutes: 6, color: '#083fa1'},
  ],
  dailyAverage: {hours: 3, minutes: 57, text: '3 hrs 57 mins'},
  totalCodingTime: '27 hrs 38 mins',
  bestDay: {date: '2024-01-15', text: '6 hrs 12 mins'},
};

const SAMPLE_DAILY_CODING: DailyCoding[] = [
  {date: 'Mon', hours: 4.2},
  {date: 'Tue', hours: 3.8},
  {date: 'Wed', hours: 5.1},
  {date: 'Thu', hours: 2.9},
  {date: 'Fri', hours: 4.5},
  {date: 'Sat', hours: 1.2},
  {date: 'Sun', hours: 2.1},
];

export interface DailyCoding {
  date: string;
  hours: number;
}

/**
 * Hook to fetch WakaTime coding statistics.
 * Falls back to sample data if VITE_WAKATIME_USERNAME is not configured.
 */
export function useWakaTime() {
  const [stats, setStats] = useState<WakaTimeStats | null>(null);
  const [dailyCoding, setDailyCoding] = useState<DailyCoding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSampleData, setIsSampleData] = useState(false);

  useEffect(() => {
    const username = import.meta.env.VITE_WAKATIME_USERNAME;

    if (!username) {
      // No WakaTime username configured - use sample data
      setStats(SAMPLE_DATA);
      setDailyCoding(SAMPLE_DAILY_CODING);
      setIsSampleData(true);
      setLoading(false);
      return;
    }

    const fetchWakaTimeData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://wakatime.com/api/v1/users/${username}/stats/last_7_days`,
        );

        if (!response.ok) {
          throw new Error('Failed to fetch WakaTime stats');
        }

        const json = await response.json();
        const data = json.data;

        const languages: WakaTimeLanguage[] = (data.languages || [])
          .slice(0, 7)
          .map((lang: {name: string; percent: number; hours: number; minutes: number}) => ({
            name: lang.name,
            percent: lang.percent,
            hours: lang.hours,
            minutes: lang.minutes,
            color: LANGUAGE_COLORS[lang.name] || '#6b7280',
          }));

        const dailyAverage: WakaTimeDailyAverage = {
          hours: data.daily_average_including_other_language?.hours || 0,
          minutes: data.daily_average_including_other_language?.minutes || 0,
          text: data.human_readable_daily_average_including_other_language || '0 hrs',
        };

        setStats({
          languages,
          dailyAverage,
          totalCodingTime:
            data.human_readable_total_including_other_language || '0 hrs',
          bestDay: data.best_day
            ? {date: data.best_day.date, text: data.best_day.text}
            : null,
        });

        // Generate daily coding from range data or fallback
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const avgHours = dailyAverage.hours + dailyAverage.minutes / 60;
        const dailyData = days.map((day) => ({
          date: day,
          hours: Math.round(avgHours * 10) / 10,
        }));
        setDailyCoding(dailyData);

        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch WakaTime data',
        );
        // Fall back to sample data on error
        setStats(SAMPLE_DATA);
        setDailyCoding(SAMPLE_DAILY_CODING);
        setIsSampleData(true);
        setLoading(false);
      }
    };

    fetchWakaTimeData();
  }, []);

  return {stats, dailyCoding, loading, error, isSampleData};
}
