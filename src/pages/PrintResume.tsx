import { useEffect } from 'react';
import { useResumeData } from '@/hooks/useResumeData';
import Loading from '@components/ui/loading';
import ErrorDisplay from '@components/ui/error';
import './PrintResume.css';

export default function PrintResume() {
  const { data: resumeData, loading, error } = useResumeData();

  useEffect(() => {
    // Auto-trigger print dialog when page loads
    if (resumeData && !loading && !error) {
      window.print();
    }
  }, [resumeData, loading, error]);

  if (loading) {
    return <Loading fullScreen message="Loading resume..." />;
  }

  if (error || !resumeData) {
    return (
      <ErrorDisplay 
        error={error || new Error('No resume data available')} 
        fullScreen 
        onRetry={() => window.location.reload()} 
      />
    );
  }

  const { main, resume } = resumeData;

  // Extract professional summary from bio (first 2-3 sentences)
  const professionalSummary = "Professional software engineer with 5+ years of experience transforming complex problems into elegant solutions. Expertise in building lightning-fast, user-centric web applications using React.js, TypeScript, and Next.js. Proven track record of architecting scalable e-commerce platforms and optimizing performance that directly impacts millions of users and boosts revenue.";

  return (
    <div className="print-resume">
      {/* Header */}
      <header className="print-header">
        <h1 className="print-name">{main.name}</h1>
        <p className="print-title">{main.occupation}</p>
        <div className="print-contact">
          <span>{main.email}</span>
          <span className="separator">•</span>
          <span>{main.phone}</span>
          <span className="separator">•</span>
          <span>{main.website}</span>
        </div>
      </header>

      {/* Professional Summary */}
      <section className="print-section">
        <h2 className="print-section-title">Professional Summary</h2>
        <p className="print-summary">{professionalSummary}</p>
      </section>

      {/* Education */}
      <section className="print-section">
        <h2 className="print-section-title">Education</h2>
        {resume.education?.map((edu, index) => (
          <div key={index} className="print-entry">
            <div className="print-entry-header">
              <div>
                <h3 className="print-entry-title">{edu.school}</h3>
                <p className="print-entry-subtitle">{edu.degree}</p>
              </div>
              <span className="print-date">{edu.graduated}</span>
            </div>
            <p className="print-description">{edu.description}</p>
          </div>
        ))}
      </section>

      {/* Work Experience */}
      <section className="print-section">
        <h2 className="print-section-title">Work Experience</h2>
        {resume.work?.map((job, index) => (
          <div key={index} className="print-entry">
            <div className="print-entry-header">
              <div>
                <h3 className="print-entry-title">{job.company}</h3>
                <p className="print-entry-subtitle">{job.title}</p>
              </div>
              <span className="print-date">{job.years}</span>
            </div>
            <p className="print-description">{job.description}</p>
          </div>
        ))}
      </section>

      {/* Technical Skills */}
      <section className="print-section">
        <h2 className="print-section-title">Technical Skills</h2>
        <div className="print-skills-grid">
          {resume.skills?.map((skill, index) => (
            <div key={index} className="print-skill">
              <span className="print-skill-name">{skill.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* No-print controls */}
      <div className="no-print print-controls">
        <button onClick={() => window.print()} className="print-btn">
          Print Resume
        </button>
        <button onClick={() => window.close()} className="close-btn">
          Close
        </button>
      </div>
    </div>
  );
}
