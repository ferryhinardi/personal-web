import {Link} from 'react-router-dom';
import {Helmet} from 'react-helmet-async';
import {ArrowLeft} from 'lucide-react';
import {motion} from 'framer-motion';
import Footer from '@components/Footer';
import {useResumeData} from '@/hooks/useResumeData';
import {useDarkMode} from '@/hooks/useDarkMode';
import {Button} from '@/components/ui/button';
import {staggerContainer, staggerItem} from '@/utils/animations';

interface PageLayoutProps {
  /** Page title shown in browser tab and page header */
  title: string;
  /** Optional meta description for SEO */
  description?: string;
  children: React.ReactNode;
}

/**
 * Layout for dedicated sub-pages (Dashboard, Guestbook, etc.).
 * Provides a consistent header with back navigation, page title,
 * dark mode toggle, and shared footer.
 */
export default function PageLayout({title, description, children}: PageLayoutProps) {
  const {data: resumeData} = useResumeData();
  const {isDark, toggleDarkMode} = useDarkMode();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-white transition-colors">
      <Helmet>
        <title>{title} | Ferry Hinardi</title>
        {description && <meta name="description" content={description} />}
      </Helmet>

      {/* Page Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back + Title */}
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-gray-900 dark:text-white/70 dark:hover:text-white"
                  aria-label="Back to home"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-lg font-semibold">{title}</h1>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="text-gray-600 hover:text-gray-900 dark:text-white/70 dark:hover:text-white"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <motion.main
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      >
        <motion.div variants={staggerItem}>
          {children}
        </motion.div>
      </motion.main>

      {/* Footer */}
      {resumeData?.main && <Footer data={resumeData.main} />}
    </div>
  );
}
