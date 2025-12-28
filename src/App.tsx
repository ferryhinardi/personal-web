import { useEffect } from 'react';
import './App.css';
import Header from '@components/Header';
import Footer from '@components/Footer';
import About from '@components/About';
import Resume from '@components/Resume';
import Contact from '@components/Contact';
import Testimonials from '@components/Testimonials';
import Portfolio from '@components/Portfolio';
import { useResumeData } from '@/hooks/useResumeData';
// import { initGA, logPageView } from '@/utils/analytics';

function App() {
  const { data: resumeData, loading, error } = useResumeData();

  useEffect(() => {
    // Google Analytics disabled until GA4 is configured
    // TODO: Replace with GA4 measurement ID (format: G-XXXXXXXXXX)
    // The current UA-* ID is for legacy Universal Analytics (deprecated July 2023)
    // Get your GA4 measurement ID from: https://analytics.google.com/analytics/web/ > Admin > Data Streams
    // Then uncomment the lines below:
    // import { initGA, logPageView } from '@/utils/analytics';
    // initGA('G-XXXXXXXXXX');
    // logPageView();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error('Failed to load resume data:', error);
    return <div>Error loading resume data. Please try again later.</div>;
  }

  if (!resumeData) {
    return null;
  }

  return (
    <div className="App">
      <Header data={resumeData.main} />
      <About data={resumeData.main} />
      <Resume data={resumeData.resume} />
      <Portfolio data={resumeData.portfolio} />
      <Testimonials data={resumeData.testimonials} />
      <Contact data={resumeData.main} />
      <Footer data={resumeData.main} />
    </div>
  );
}

export default App;
