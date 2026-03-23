import {useFirebaseContext} from '@/contexts/FirebaseContext';

/**
 * Hook to access Firebase services.
 * Returns Firestore database instance and configuration status.
 *
 * Usage:
 * ```ts
 * const { db, isConfigured } = useFirebase();
 * if (!isConfigured) return <p>Firebase not available</p>;
 * ```
 */
export function useFirebase() {
  const {db, isConfigured} = useFirebaseContext();
  return {db, isConfigured};
}
