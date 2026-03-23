import {motion} from 'framer-motion';
import {cn} from '@/lib/utils';
import {useReactions, EMOJIS} from '@/hooks/useReactions';
import {Skeleton} from '@/components/ui/skeleton';

interface EmojiReactionsProps {
  targetId: string;
  targetType: 'project' | 'achievement';
  className?: string;
}

/**
 * Reusable emoji reaction buttons component.
 * Shows emoji counts and allows toggling reactions per visitor.
 * Gracefully degrades when Firebase is not configured.
 */
export function EmojiReactions({targetId, targetType, className}: EmojiReactionsProps) {
  const {reactions, userReactions, toggleReaction, isLoading} = useReactions(
    targetId,
    targetType,
  );

  if (isLoading) {
    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        {EMOJIS.map((emoji) => (
          <Skeleton key={emoji} className="h-8 w-14 rounded-full" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {EMOJIS.map((emoji) => {
        const count = reactions[emoji] ?? 0;
        const hasReacted = userReactions.has(emoji);

        return (
          <motion.button
            key={emoji}
            type="button"
            onClick={() => toggleReaction(emoji)}
            whileTap={{scale: 0.9}}
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm transition-all',
              'border hover:shadow-sm',
              hasReacted
                ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-slate-500',
            )}
            aria-label={`React with ${emoji}`}
            aria-pressed={hasReacted}
          >
            <span className="text-base leading-none">{emoji}</span>
            <span className="text-xs font-medium tabular-nums">{count}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
