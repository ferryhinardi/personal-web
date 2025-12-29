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
import { initGA, logPageView } from '@/utils/analytics';

function App() {
  const { data: resumeData, loading, error } = useResumeData();

  useEffect(() => {
    // Initialize Google Analytics 4
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    
    if (measurementId && measurementId !== 'G-XXXXXXXXXX') {
      initGA(measurementId);
      logPageView();
      console.log('Google Analytics initialized with ID:', measurementId);
    } else {
      console.warn('Google Analytics not initialized. Set VITE_GA_MEASUREMENT_ID in .env.local');
    }
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
