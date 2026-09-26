import {useEffect} from 'react';
import {Helmet} from 'react-helmet-async';
import {useResumeData} from '@/hooks/useResumeData';
import {initGA, logPageView} from '@/utils/analytics';
import HomePage from '@/pages/HomePage';
import type {MainData, ResumeData, Social} from '@/types/resume.types';

const homeFallback: MainData = {
  name: 'Ferry Hinardi',
  occupation: 'Senior Software Engineer',
  description: '',
  image: 'profilepic.jpg',
  bio: '',
  contactmessage: '',
  email: 'hinardi93@gmail.com',
  phone: '',
  address: {street: '', city: 'Tangerang', state: 'Banten', zip: ''},
  website: 'https://ferryhinardi.com',
  resumedownload: '/Ferry-Hinardi-Resume-2026.pdf',
  social: [
    {name: 'github', url: 'https://github.com/ferryhinardi', className: ''},
    {
      name: 'linkedin',
      url: 'https://www.linkedin.com/in/ferryhinardi',
      className: '',
    },
  ],
};

function App() {
  const {data: resumeData, error} = useResumeData();

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

  return (
    <>
      {resumeData && !error ? <PersonJsonLd resumeData={resumeData} /> : null}
      <HomePage data={resumeData?.main ?? homeFallback} />
    </>
  );
}

function PersonJsonLd({resumeData}: {resumeData: ResumeData}) {
  return (
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
  );
}

export default App;
