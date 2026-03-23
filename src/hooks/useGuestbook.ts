import {useState, useEffect, useCallback, useRef} from 'react';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import {useFirebase} from '@/hooks/useFirebase';
import {getVisitorId} from '@/utils/visitorId';
import type {GuestbookEntry} from '@/types/firebase.types';

const RATE_LIMIT_MS = 60_000; // 1 message per 60 seconds
const RATE_LIMIT_KEY = 'guestbook_last_sent';

interface UseGuestbookReturn {
  messages: GuestbookEntry[];
  addMessage: (name: string, message: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  isRateLimited: boolean;
  rateLimitRemaining: number;
}

/**
 * Hook for guestbook functionality with real-time Firestore updates.
 * Gracefully handles Firebase not being configured.
 */
export function useGuestbook(): UseGuestbookReturn {
  const {db, isConfigured} = useFirebase();
  const [messages, setMessages] = useState<GuestbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitRemaining, setRateLimitRemaining] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Check and update rate limit status
  const checkRateLimit = useCallback(() => {
    const lastSent = localStorage.getItem(RATE_LIMIT_KEY);
    if (!lastSent) {
      setIsRateLimited(false);
      setRateLimitRemaining(0);
      return false;
    }
    const elapsed = Date.now() - parseInt(lastSent, 10);
    if (elapsed < RATE_LIMIT_MS) {
      setIsRateLimited(true);
      setRateLimitRemaining(Math.ceil((RATE_LIMIT_MS - elapsed) / 1000));
      return true;
    }
    setIsRateLimited(false);
    setRateLimitRemaining(0);
    return false;
  }, []);

  // Set up rate limit timer
  useEffect(() => {
    checkRateLimit();
    timerRef.current = setInterval(checkRateLimit, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [checkRateLimit]);

  // Subscribe to guestbook collection
  useEffect(() => {
    if (!isConfigured || !db) {
      setIsLoading(false);
      return;
    }

    const q = query(
      collection(db, 'guestbook'),
      orderBy('createdAt', 'desc'),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const entries: GuestbookEntry[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            message: data.message,
            avatar: data.avatar,
            createdAt: data.createdAt?.toDate?.() ?? new Date(),
            replyTo: data.replyTo,
            visitorId: data.visitorId,
          };
        });
        setMessages(entries);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Guestbook subscription error:', err);
        setError('Failed to load messages. Please try again later.');
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, [db, isConfigured]);

  const addMessage = useCallback(
    async (name: string, message: string) => {
      if (!db || !isConfigured) {
        setError('Guestbook is not available.');
        return;
      }

      if (checkRateLimit()) {
        setError('Please wait before sending another message.');
        return;
      }

      const trimmedName = name.trim();
      const trimmedMessage = message.trim();

      if (!trimmedName || !trimmedMessage) {
        setError('Name and message are required.');
        return;
      }

      try {
        setError(null);
        const visitorId = getVisitorId();

        await addDoc(collection(db, 'guestbook'), {
          name: trimmedName,
          message: trimmedMessage,
          visitorId,
          createdAt: serverTimestamp(),
        });

        localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
        checkRateLimit();
      } catch (err) {
        console.error('Failed to add guestbook message:', err);
        setError('Failed to send message. Please try again.');
      }
    },
    [db, isConfigured, checkRateLimit],
  );

  return {messages, addMessage, isLoading, error, isRateLimited, rateLimitRemaining};
}
