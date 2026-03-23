import {
  createContext,
  useContext,
  useMemo,
} from 'react';
import {db, isFirebaseConfigured} from '@/lib/firebase';
import type {Firestore} from 'firebase/firestore';

interface FirebaseContextValue {
  /** Firestore database instance (null if not configured) */
  db: Firestore | null;
  /** Whether Firebase is properly configured */
  isConfigured: boolean;
}

const FirebaseContext = createContext<FirebaseContextValue>({
  db: null,
  isConfigured: false,
});

/**
 * Provider that makes Firebase services available throughout the app.
 * Gracefully handles missing configuration (all features degrade to no-ops).
 */
export function FirebaseProvider({children}: {children: React.ReactNode}) {
  const value = useMemo<FirebaseContextValue>(
    () => ({
      db,
      isConfigured: isFirebaseConfigured,
    }),
    [],
  );

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

/**
 * Hook to access Firebase context.
 */
export function useFirebaseContext() {
  return useContext(FirebaseContext);
}
