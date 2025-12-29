import { useEffect } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';
import './App.css';
import Header from '@components/Header';
import Footer from '@components/Footer';
import About from '@components/About';
import Resume from '@components/Resume';
import Contact from '@components/Contact';
import Testimonials from '@components/Testimonials';
import Portfolio from '@components/Portfolio';
import { useResumeData } from '@/hooks/useResumeData';
import { initGA, logPageView } from '@/utils/analytics';
import Loading from '@components/ui/loading';
import ErrorDisplay from '@components/ui/error';

function App() {
  const { data: resumeData, loading, error } = useResumeData();

  useEffect(() => {
    // Initialize Google Analytics 4
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    
    if (measurementId) {
      initGA(measurementId);
      logPageView();
      console.log('Google Analytics initialized with ID:', measurementId);
    } else {
      console.warn('Google Analytics not initialized. Set VITE_GA_MEASUREMENT_ID in .env.local');
    }
  }, []);

  if (loading) {
    return <Loading fullScreen message="Loading your portfolio..." />;
  }

  if (error) {
    console.error('Failed to load resume data:', error);
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

  return (
    <HelmetProvider>
      <div className="App">
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Ferry Hinardi',
              url: 'https://ferryhinardi.vercel.app',
              image: 'https://ferryhinardi.vercel.app/images/profilepic.jpg',
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
                resumeData.main?.social?.find((s: any) => s.name === 'linkedin')?.url,
                resumeData.main?.social?.find((s: any) => s.name === 'github')?.url,
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
        <About data={resumeData.main} />
        <Resume data={resumeData.resume} />
        <Portfolio data={resumeData.portfolio} />
        <Testimonials data={resumeData.testimonials} />
        <Contact data={resumeData.main} />
        <Footer data={resumeData.main} />
        <Analytics />
      </div>
    </HelmetProvider>
  );
}

export default App;
