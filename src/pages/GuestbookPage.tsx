import {useTranslation} from 'react-i18next';
import {motion, AnimatePresence} from 'framer-motion';
import {MessageSquare, MessageCircle, WifiOff} from 'lucide-react';
import PageLayout from '@/layouts/PageLayout';
import SEOHead from '@/components/SEOHead';
import {useFirebase} from '@/hooks/useFirebase';
import {useGuestbook} from '@/hooks/useGuestbook';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import GuestbookMessage from '@/components/guestbook/GuestbookMessage';
import GuestbookForm from '@/components/guestbook/GuestbookForm';

/**
 * Guestbook page — real-time message board powered by Firestore.
 * Gracefully degrades when Firebase is not configured.
 */
export default function GuestbookPage() {
  const {t} = useTranslation();
  const {isConfigured} = useFirebase();
  const {messages, addMessage, isLoading, error, isRateLimited, rateLimitRemaining} =
    useGuestbook();

  return (
    <PageLayout
      title={t('pages.guestbook.title')}
      description={t('pages.guestbook.description')}
    >
      <SEOHead
        title="Guestbook"
        description="Leave a message on the guestbook. Share your thoughts, feedback, or just say hello."
        path="/guestbook"
      />
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{scale: 0}}
            animate={{scale: 1}}
            transition={{type: 'spring', stiffness: 200, damping: 15}}
            className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-4"
          >
            <MessageSquare className="h-8 w-8" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('pages.guestbook.title')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {t('pages.guestbook.description')}
          </p>
        </div>

        {/* Firebase not configured */}
        {!isConfigured ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <WifiOff className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Guestbook Unavailable
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                The guestbook is not available right now. Firebase is not configured for this environment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageCircle className="h-5 w-5" />
                  Leave a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <GuestbookForm
                  onSubmit={addMessage}
                  isRateLimited={isRateLimited}
                  rateLimitRemaining={rateLimitRemaining}
                  error={error}
                />
              </CardContent>
            </Card>

            {/* Messages */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Messages ({isLoading ? '...' : messages.length})
              </h3>

              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({length: 3}).map((_, i) => (
                    <div
                      key={i}
                      className="flex gap-3 rounded-lg border border-gray-200 dark:border-slate-600 p-4"
                    >
                      <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : messages.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <MessageSquare className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No messages yet. Be the first to leave one!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <AnimatePresence mode="popLayout">
                  <div className="space-y-3">
                    {messages.map((entry, index) => (
                      <GuestbookMessage
                        key={entry.id}
                        entry={entry}
                        index={index}
                      />
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}
