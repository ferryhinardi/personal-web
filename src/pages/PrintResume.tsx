import { useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useResumeData } from '@/hooks/useResumeData';
import Loading from '@components/ui/loading';
import ErrorDisplay from '@components/ui/error';
import type { Social, Project } from '@/types/resume.types';
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

  const { main, resume, portfolio } = resumeData;

  // Professional summary: prefer the structured resume summary, fall back to description
  const professionalSummary = resume.summary || main.description;

  // Clean contact links for display
  const stripProtocol = (url?: string) =>
    url ? url.replace('https://', '').replace('http://', '').replace('www.', '').replace(/\/$/, '') : '';

  const linkedinUrl = main.social?.find((s: Social) => s.name === 'linkedin')?.url;
  const githubUrl = main.social?.find((s: Social) => s.name === 'github')?.url;
  const location = [main.address?.city, main.address?.state]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="print-resume">
      {/* Header — name, title, contact line */}
      <header className="print-header">
        <div className="print-header-text">
          <h1 className="print-name">{main.name}</h1>
          <p className="print-title">{main.occupation}</p>
          <div className="print-contact-line">
            {main.phone && <span>{main.phone}</span>}
            {main.email && (
              <>
                <span className="dot">·</span>
                <span>{main.email}</span>
              </>
            )}
            {linkedinUrl && (
              <>
                <span className="dot">·</span>
                <span>{stripProtocol(linkedinUrl)}</span>
              </>
            )}
            {githubUrl && (
              <>
                <span className="dot">·</span>
                <span>{stripProtocol(githubUrl)}</span>
              </>
            )}
            {location && (
              <>
                <span className="dot">·</span>
                <span>{location}</span>
              </>
            )}
          </div>
        </div>
        <div className="print-qr-code no-print-mobile">
          <QRCodeSVG value={main.website} size={72} level="M" includeMargin={false} />
          <p className="print-qr-label">Portfolio</p>
        </div>
      </header>

      {/* Summary */}
      <section className="print-section">
        <h2 className="print-section-title">Summary</h2>
        <p className="print-summary">{professionalSummary}</p>
      </section>

      {/* Experience */}
      <section className="print-section">
        <h2 className="print-section-title">Experience</h2>
        {resume.work?.map((job, index) => (
          <div key={index} className="print-entry">
            <h3 className="print-entry-title">{job.title}</h3>
            <p className="print-entry-meta">
              {job.company}
              {job.location ? ` · ${job.location}` : ''} · {job.years}
            </p>
            {job.highlights && job.highlights.length > 0 ? (
              <ul className="print-bullets">
                {job.highlights.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            ) : (
              <p className="print-description">{job.description}</p>
            )}
          </div>
        ))}
      </section>

      {/* Skills */}
      <section className="print-section">
        <h2 className="print-section-title">Skills</h2>
        <ul className="print-skills-grid">
          {resume.skills?.map((skill, index) => (
            <li key={index} className="print-skill">
              {skill.name}
            </li>
          ))}
        </ul>
      </section>

      {/* Education */}
      <section className="print-section">
        <h2 className="print-section-title">Education</h2>
        {resume.education?.map((edu, index) => (
          <div key={index} className="print-entry">
            <h3 className="print-entry-title">{edu.degree}</h3>
            <p className="print-entry-meta">
              {edu.school} · {edu.graduated}
            </p>
          </div>
        ))}
      </section>

      {/* Projects */}
      {portfolio?.projects && portfolio.projects.length > 0 && (
        <section className="print-section">
          <h2 className="print-section-title">Projects</h2>
          <ul className="print-bullets">
            {portfolio.projects.map((project: Project, index: number) => (
              <li key={index}>
                <strong>{project.title}</strong>
                {project.description ? ` – ${project.description}` : ''}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Languages */}
      {resume.languages && resume.languages.length > 0 && (
        <section className="print-section">
          <h2 className="print-section-title">Languages</h2>
          {resume.languages.map((lang, index) => (
            <p key={index} className="print-language">
              {lang.name} ({lang.level})
            </p>
          ))}
        </section>
      )}

      {/* No-print controls */}
      <div className="no-print print-controls">
        <button onClick={() => window.print()} className="print-btn">
          Print / Save PDF
        </button>
        <button onClick={() => (window.location.href = '/')} className="home-btn">
          Back to Homepage
        </button>
        <button onClick={() => window.close()} className="close-btn">
          Close
        </button>
      </div>
    </div>
  );
}
