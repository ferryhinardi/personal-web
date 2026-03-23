import {useState, useEffect, useCallback} from 'react';
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  increment,
} from 'firebase/firestore';
import {useFirebase} from '@/hooks/useFirebase';
import {getVisitorId} from '@/utils/visitorId';

const EMOJIS = ['🔥', '❤️', '👍', '🎉', '🚀', '👀'] as const;
type Emoji = (typeof EMOJIS)[number];

interface UseReactionsReturn {
  reactions: Record<string, number>;
  userReactions: Set<string>;
  toggleReaction: (emoji: string) => Promise<void>;
  isLoading: boolean;
}

/**
 * Hook for emoji reactions on projects/achievements.
 * Uses optimistic updates and Firestore for persistence.
 */
export function useReactions(
  targetId: string,
  targetType: 'project' | 'achievement',
): UseReactionsReturn {
  const {db, isConfigured} = useFirebase();
  const [reactions, setReactions] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const emoji of EMOJIS) {
      initial[emoji] = 0;
    }
    return initial;
  });
  const [userReactions, setUserReactions] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe to reaction counts
  useEffect(() => {
    if (!isConfigured || !db || !targetId) {
      setIsLoading(false);
      return;
    }

    const reactionDocRef = doc(db, 'reactions', targetId);

    const unsubscribe = onSnapshot(
      reactionDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const counts: Record<string, number> = {};
          for (const emoji of EMOJIS) {
            counts[emoji] = data.reactions?.[emoji] ?? 0;
          }
          setReactions(counts);
        }
        setIsLoading(false);
      },
      (err) => {
        console.error('Reactions subscription error:', err);
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, [db, isConfigured, targetId]);

  // Load user's reactions
  useEffect(() => {
    if (!isConfigured || !db || !targetId) return;

    const visitorId = getVisitorId();
    const userReactionRef = doc(
      db,
      'reactions',
      targetId,
      'userReactions',
      visitorId,
    );

    getDoc(userReactionRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setUserReactions(new Set(data.emojis ?? []));
        }
      })
      .catch((err) => {
        console.error('Failed to load user reactions:', err);
      });
  }, [db, isConfigured, targetId]);

  const toggleReaction = useCallback(
    async (emoji: string) => {
      if (!db || !isConfigured || !targetId) return;

      const visitorId = getVisitorId();
      const reactionDocRef = doc(db, 'reactions', targetId);
      const userReactionRef = doc(
        db,
        'reactions',
        targetId,
        'userReactions',
        visitorId,
      );

      const hasReacted = userReactions.has(emoji);

      // Optimistic update
      setUserReactions((prev) => {
        const next = new Set(prev);
        if (hasReacted) {
          next.delete(emoji);
        } else {
          next.add(emoji);
        }
        return next;
      });

      setReactions((prev) => ({
        ...prev,
        [emoji]: Math.max(0, (prev[emoji] ?? 0) + (hasReacted ? -1 : 1)),
      }));

      try {
        // Update reaction count
        await setDoc(
          reactionDocRef,
          {
            reactions: {[emoji]: increment(hasReacted ? -1 : 1)},
            targetId,
            targetType,
          },
          {merge: true},
        );

        // Update user's reactions
        if (hasReacted) {
          const newEmojis = [...userReactions].filter((e) => e !== emoji);
          if (newEmojis.length === 0) {
            await deleteDoc(userReactionRef);
          } else {
            await setDoc(userReactionRef, {
              visitorId,
              emojis: newEmojis,
              updatedAt: new Date(),
            });
          }
        } else {
          await setDoc(userReactionRef, {
            visitorId,
            emojis: [...userReactions, emoji],
            updatedAt: new Date(),
          });
        }
      } catch (err) {
        // Revert optimistic update
        console.error('Failed to toggle reaction:', err);
        setUserReactions((prev) => {
          const next = new Set(prev);
          if (hasReacted) {
            next.add(emoji);
          } else {
            next.delete(emoji);
          }
          return next;
        });
        setReactions((prev) => ({
          ...prev,
          [emoji]: Math.max(0, (prev[emoji] ?? 0) + (hasReacted ? 1 : -1)),
        }));
      }
    },
    [db, isConfigured, targetId, targetType, userReactions],
  );

  return {reactions, userReactions, toggleReaction, isLoading};
}

export {EMOJIS};
export type {Emoji};
