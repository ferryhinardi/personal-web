import {Helmet} from 'react-helmet-async';

const SITE_URL = 'https://ferryhinardi.com';
const SITE_NAME = 'Ferry Hinardi';

interface SEOHeadProps {
  /** Page title (used in og:title, twitter:title) */
  title: string;
  /** Page description */
  description: string;
  /** Page path, e.g. '/dashboard' */
  path: string;
  /** Custom OG image URL. Falls back to the dynamic OG API. */
  image?: string;
  /** og:type — defaults to 'website' */
  type?: string;
}

/**
 * Reusable SEO head component for per-page Open Graph and Twitter meta tags.
 * Uses react-helmet-async to inject meta tags into <head>.
 *
 * Note: The <title> and basic <meta name="description"> are set by PageLayout.
 * This component adds OG, Twitter, and canonical tags on top.
 */
export default function SEOHead({
  title,
  description,
  path,
  image,
  type = 'website',
}: SEOHeadProps) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonicalUrl = `${SITE_URL}${path}`;
  const ogImage =
    image ||
    `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&path=${encodeURIComponent(path)}`;

  return (
    <Helmet>
      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
