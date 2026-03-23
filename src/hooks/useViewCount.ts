import {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {
  doc,
  getDoc,
  setDoc,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import {useFirebase} from '@/hooks/useFirebase';

/**
 * Hook that tracks and returns the view count for the current page.
 * Automatically increments the counter once per session per path.
 *
 * Returns 0 if Firebase is not configured (graceful degradation).
 */
export function useViewCount() {
  const {db, isConfigured} = useFirebase();
  const location = useLocation();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isConfigured || !db) return;

    const path = location.pathname;
    const sessionKey = `viewed:${path}`;

    // Only increment once per session per path
    const alreadyViewed = sessionStorage.getItem(sessionKey);

    const trackView = async () => {
      const docRef = doc(db, 'viewCounts', path.replace(/\//g, '_') || '_root');

      try {
        if (!alreadyViewed) {
          await setDoc(
            docRef,
            {
              path,
              count: increment(1),
              lastViewed: serverTimestamp(),
            },
            {merge: true},
          );
          sessionStorage.setItem(sessionKey, 'true');
        }

        // Always read current count
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setCount(snap.data().count ?? 0);
        }
      } catch {
        // Silently fail — view counting is non-critical
      }
    };

    trackView();
  }, [db, isConfigured, location.pathname]);

  return count;
}
