import {useEffect, lazy, Suspense} from 'react';
import {Helmet} from 'react-helmet-async';
import './App.css';
import Header from '@components/Header';
import Footer from '@components/Footer';
import {useResumeData} from '@/hooks/useResumeData';
import {initGA, logPageView} from '@/utils/analytics';
import Loading from '@components/ui/loading';
import ErrorDisplay from '@components/ui/error';
import ScrollProgress from '@components/ui/scroll-progress';
import BackToTop from '@components/ui/back-to-top';
import SkipLinks from '@components/ui/skip-links';
import {PrintButton} from '@components/ui/print-button';
import {SectionDots} from '@components/ui/section-dots';
import {CustomCursor} from '@components/ui/custom-cursor';
import {usePerformanceConfig} from '@/contexts/PerformanceContext';
import type {ResumeData, Social} from '@/types/resume.types';
import {
  AboutSkeleton,
  ResumeSkeleton,
  PortfolioSkeleton,
  ContactSkeleton,
} from '@components/ui/skeleton';

// Lazy load components that are not immediately visible
const About = lazy(() => import('@components/About'));
const Resume = lazy(() => import('@components/Resume'));
const Portfolio = lazy(() => import('@components/Portfolio'));
const Contact = lazy(() => import('@components/Contact'));

function App() {
  const { data: resumeData, loading, error } = useResumeData();

   useEffect(() => {
     // Defer Google Analytics initialization to improve initial load performance
     // Wait for page to be fully loaded before initializing GA
     const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
     
     if (measurementId) {
       // Defer GA loading after page load completes
       if (document.readyState === 'complete') {
         // Page already loaded, defer by 2 seconds
         setTimeout(async () => {
           await initGA(measurementId);
           await logPageView();
         }, 2000);
       } else {
         // Wait for page to load, then defer by 2 seconds
         window.addEventListener('load', () => {
           setTimeout(async () => {
             await initGA(measurementId);
             await logPageView();
           }, 2000);
         });
       }
     }
   }, []);

  if (loading) {
    return <Loading fullScreen message="Loading your portfolio..." />;
  }

  if (error) {
    return (
      <ErrorDisplay 
        error={error} 
        fullScreen 
        onRetry={() => window.location.reload()} 
        showDetails={true} 
      />
    );
  }

  if (!resumeData) {
    return null;
  }

  return <AppContent resumeData={resumeData} />;
}

// Separate component to use performance context
function AppContent({ resumeData }: { resumeData: ResumeData }) {
  const { enableCustomCursor } = usePerformanceConfig();

  return (
    <div className="App">
      <SkipLinks />
      {enableCustomCursor && <CustomCursor enableBlendMode />}
      <ScrollProgress showPercentage />
      <SectionDots position="right" />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Ferry Hinardi',
            url: 'https://ferryhinardi.com',
            image: 'https://ferryhinardi.com/images/profilepic.jpg',
            jobTitle: 'Software Engineer',
            worksFor: {
              '@type': 'Organization',
              name: 'Traveloka',
            },
            alumniOf: {
              '@type': 'EducationalOrganization',
              name: 'Bina Nusantara University',
            },
            knowsAbout: [
              'React.js',
              'TypeScript',
              'JavaScript',
              'Next.js',
              'React Native',
              'GraphQL',
              'AWS',
              'GitHub Actions',
            ],
            sameAs: [
              resumeData.main?.social?.find((s: Social) => s.name === 'linkedin')?.url,
              resumeData.main?.social?.find((s: Social) => s.name === 'github')?.url,
            ].filter(Boolean),
            email: resumeData.main?.email,
            address: {
              '@type': 'PostalAddress',
              addressLocality: resumeData.main?.address?.city,
              addressRegion: resumeData.main?.address?.state,
              addressCountry: 'ID',
            },
          })}
        </script>
      </Helmet>
      <Header data={resumeData.main} />
      <Suspense fallback={<AboutSkeleton />}>
        <About data={resumeData.main} />
      </Suspense>
      <Suspense fallback={<ResumeSkeleton />}>
        <Resume data={resumeData.resume} />
      </Suspense>
      <Suspense fallback={<PortfolioSkeleton />}>
        <Portfolio data={resumeData.portfolio} />
      </Suspense>
      <Suspense fallback={<ContactSkeleton />}>
        <Contact data={resumeData.main} />
      </Suspense>
      <Footer data={resumeData.main} />
      <BackToTop />
      <PrintButton />
    </div>
  );
}

export default App;
