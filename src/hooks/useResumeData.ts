import { useState, useEffect } from 'react';
import type { ResumeData } from '@/types/resume.types';

export function useResumeData() {
  const [data, setData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch('/resumeData.json')
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch resume data: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        if (!cancelled) {
          setData(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
