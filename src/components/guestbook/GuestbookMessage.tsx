import {motion} from 'framer-motion';
import {User} from 'lucide-react';
import {Avatar, AvatarImage, AvatarFallback} from '@/components/ui/avatar';
import type {GuestbookEntry} from '@/types/firebase.types';

interface GuestbookMessageProps {
  entry: GuestbookEntry;
  index: number;
}

/**
 * Formats a date as a relative time string (e.g., "2 hours ago").
 */
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffWeek < 5) return `${diffWeek}w ago`;
  if (diffMonth < 12) return `${diffMonth}mo ago`;
  return date.toLocaleDateString();
}

/**
 * Gets initials from a name string.
 */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/**
 * Generates a deterministic color class based on a string.
 */
function getAvatarColor(name: string): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-teal-500',
    'bg-indigo-500',
    'bg-rose-500',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

const messageVariants = {
  hidden: {opacity: 0, y: 20, scale: 0.95},
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
};

/**
 * Renders a single guestbook message with avatar, name, message, and timestamp.
 * Animates in with a stagger effect based on index.
 */
export default function GuestbookMessage({entry, index}: GuestbookMessageProps) {
  const initials = getInitials(entry.name);
  const colorClass = getAvatarColor(entry.name);

  return (
    <motion.div
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      layout
      className="group flex gap-3 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 p-4 transition-colors hover:border-gray-300 dark:hover:border-slate-500"
    >
      {/* Avatar */}
      <Avatar className="h-10 w-10 flex-shrink-0">
        {entry.avatar ? (
          <AvatarImage src={entry.avatar} alt={entry.name} />
        ) : null}
        <AvatarFallback className={`${colorClass} text-white text-sm font-medium`}>
          {initials || <User className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-sm text-gray-900 dark:text-white truncate">
            {entry.name}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
            {formatRelativeTime(entry.createdAt)}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap break-words">
          {entry.message}
        </p>
      </div>
    </motion.div>
  );
}
