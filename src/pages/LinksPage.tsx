import {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import {
  Globe,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Mail,
  ExternalLink,
} from 'lucide-react';
import PageLayout from '@/layouts/PageLayout';
import SEOHead from '@/components/SEOHead';
import {Skeleton} from '@/components/ui/skeleton';
import {ErrorDisplay} from '@/components/ui/error';
import {useResumeData} from '@/hooks/useResumeData';
import {staggerContainer, staggerItem} from '@/utils/animations';

interface LinkItem {
  title: string;
  url: string;
  icon?: string;
  description?: string;
}

interface LinksData {
  links: LinkItem[];
}

const iconMap: Record<string, React.ReactNode> = {
  globe: <Globe className="h-5 w-5" />,
  github: <Github className="h-5 w-5" />,
  linkedin: <Linkedin className="h-5 w-5" />,
  twitter: <Twitter className="h-5 w-5" />,
  instagram: <Instagram className="h-5 w-5" />,
  mail: <Mail className="h-5 w-5" />,
};

function LinkCard({link}: {link: LinkItem}) {
  return (
    <motion.a
      variants={staggerItem}
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 p-4 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200"
      whileHover={{y: -2}}
      whileTap={{scale: 0.98}}
    >
      <span className="flex items-center justify-center h-10 w-10 rounded-lg bg-gray-100 dark:bg-slate-600 text-gray-600 dark:text-gray-300 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {iconMap[link.icon ?? ''] ?? <ExternalLink className="h-5 w-5" />}
      </span>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {link.title}
        </h3>
        {link.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {link.description}
          </p>
        )}
      </div>
      <ExternalLink className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors flex-shrink-0" />
    </motion.a>
  );
}

function LinksLoadingSkeleton() {
  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-24 w-24 rounded-full" />
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-5 w-64" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-[72px] rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function LinksPage() {
  const [data, setData] = useState<LinksData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const {data: resumeData} = useResumeData();

  useEffect(() => {
    fetch('/data/links.json')
      .then((res) => res.json())
      .then(setData)
      .catch((err) => {
        setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => setLoading(false));
  }, []);

  const mainData = resumeData?.main;

  return (
    <PageLayout
      title="Links"
      description="All my social profiles and important links in one place."
    >
      <SEOHead
        title="Links"
        description="All my social profiles and important links in one place."
        path="/links"
      />
      {loading ? (
        <LinksLoadingSkeleton />
      ) : error ? (
        <ErrorDisplay
          error={error}
          title="Failed to load links"
          message="Could not fetch your links. Please try again later."
        />
      ) : data ? (
        <div className="max-w-lg mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
            className="flex flex-col items-center text-center mb-8"
          >
            {mainData?.image && (
              <img
                src={`/images/${mainData.image}`}
                alt={mainData.name}
                className="h-24 w-24 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-lg mb-4"
              />
            )}
            {mainData && (
              <>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {mainData.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
                  {mainData.occupation}
                </p>
              </>
            )}

            {/* Social Icons Row */}
            {mainData?.social && (
              <div className="flex items-center gap-3 mt-4">
                {mainData.social.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    aria-label={social.name}
                  >
                    {iconMap[social.name] ?? (
                      <Globe className="h-4 w-4" />
                    )}
                  </a>
                ))}
              </div>
            )}
          </motion.div>

          {/* Links List */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {data.links.map((link) => (
              <LinkCard key={link.title} link={link} />
            ))}
          </motion.div>
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 py-20">
          Failed to load data. Please try again later.
        </p>
      )}
    </PageLayout>
  );
}
