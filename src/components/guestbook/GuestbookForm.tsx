import {useState, useEffect, useCallback} from 'react';
import {Send, Clock, AlertCircle, CheckCircle2} from 'lucide-react';
import {motion, AnimatePresence} from 'framer-motion';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Label} from '@/components/ui/label';

const SAVED_NAME_KEY = 'guestbook_name';

interface GuestbookFormProps {
  onSubmit: (name: string, message: string) => Promise<void>;
  isRateLimited: boolean;
  rateLimitRemaining: number;
  error: string | null;
}

/**
 * Guestbook form with name input, message textarea, submit button,
 * and rate limit feedback. Remembers the visitor's name via localStorage.
 */
export default function GuestbookForm({
  onSubmit,
  isRateLimited,
  rateLimitRemaining,
  error,
}: GuestbookFormProps) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Restore saved name on mount
  useEffect(() => {
    const savedName = localStorage.getItem(SAVED_NAME_KEY);
    if (savedName) setName(savedName);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isSubmitting || isRateLimited) return;

      const trimmedName = name.trim();
      const trimmedMessage = message.trim();
      if (!trimmedName || !trimmedMessage) return;

      setIsSubmitting(true);
      setShowSuccess(false);
      try {
        await onSubmit(trimmedName, trimmedMessage);
        localStorage.setItem(SAVED_NAME_KEY, trimmedName);
        setMessage('');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 4000);
      } finally {
        setIsSubmitting(false);
      }
    },
    [name, message, isSubmitting, isRateLimited, onSubmit],
  );

  const canSubmit = name.trim().length > 0 && message.trim().length > 0 && !isRateLimited && !isSubmitting;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="guestbook-name" className="text-gray-700 dark:text-gray-300">
          Name
        </Label>
        <Input
          id="guestbook-name"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
          disabled={isSubmitting}
          autoComplete="name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="guestbook-message" className="text-gray-700 dark:text-gray-300">
          Message
        </Label>
        <Textarea
          id="guestbook-message"
          placeholder="Write a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={500}
          rows={3}
          disabled={isSubmitting}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {message.length}/500
          </span>
        </div>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{opacity: 0, height: 0}}
            animate={{opacity: 1, height: 'auto'}}
            exit={{opacity: 0, height: 0}}
            className="flex items-center gap-2 text-sm text-red-500 dark:text-red-400"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{opacity: 0, height: 0}}
            animate={{opacity: 1, height: 'auto'}}
            exit={{opacity: 0, height: 0}}
            className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400"
          >
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            <span>Message sent successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rate limit notice */}
      <AnimatePresence>
        {isRateLimited && (
          <motion.div
            initial={{opacity: 0, height: 0}}
            animate={{opacity: 1, height: 'auto'}}
            exit={{opacity: 0, height: 0}}
            className="flex items-center gap-2 text-sm text-amber-500 dark:text-amber-400"
          >
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span>Wait {rateLimitRemaining}s before sending another message</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        type="submit"
        disabled={!canSubmit}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Message
          </>
        )}
      </Button>
    </form>
  );
}
