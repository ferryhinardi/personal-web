import {useEffect} from 'react';
import {Helmet} from 'react-helmet-async';
import {useResumeData} from '@/hooks/useResumeData';
import {initGA, logPageView} from '@/utils/analytics';
import Loading from '@components/ui/loading';
import ErrorDisplay from '@components/ui/error';
import HomePage from '@/pages/HomePage';
import type {ResumeData, Social} from '@/types/resume.types';

function App() {
  const {data: resumeData, loading, error} = useResumeData();

  useEffect(() => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

    if (measurementId) {
      if (document.readyState === 'complete') {
        setTimeout(async () => {
          await initGA(measurementId);
          await logPageView();
        }, 2000);
      } else {
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

function AppContent({resumeData}: {resumeData: ResumeData}) {
  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Ferry Hinardi',
            url: 'https://ferryhinardi.com',
            image: 'https://ferryhinardi.com/images/profilepic.jpg',
            jobTitle: 'Senior Fullstack Engineer',
            worksFor: {
              '@type': 'Organization',
              name: 'PayMongo',
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
              'Golang',
              'GraphQL',
              'AWS',
              'GitHub Actions',
              'AI Agents',
              'LLM',
              'Generative AI',
            ],
            sameAs: [
              resumeData.main?.social?.find((s: Social) => s.name === 'linkedin')
                ?.url,
              resumeData.main?.social?.find((s: Social) => s.name === 'github')
                ?.url,
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
      <HomePage data={resumeData.main} />
    </>
  );
}

export default App;
