import type { ResumeSection } from '@/types/resume.types';

interface ResumeProps {
  data?: ResumeSection;
}

export default function Resume({ data }: ResumeProps) {
  if (!data) return null;

  const { skillmessage, education, work, skills } = data;

  return (
    <section id="resume">
      <div className="row education">
        <div className="three columns header-col">
          <h1>
            <span>Education</span>
          </h1>
        </div>

        <div className="nine columns main-col">
          <div className="row item">
            <div className="twelve columns">
              {education.map((edu) => (
                <div key={edu.school}>
                  <h3>{edu.school}</h3>
                  <p className="info">
                    {edu.degree} <span>&bull;</span>
                    <em className="date">{edu.graduated}</em>
                  </p>
                  <p>{edu.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="row work">
        <div className="three columns header-col">
          <h1>
            <span>Work</span>
          </h1>
        </div>

        <div className="nine columns main-col">
          {work.map((job) => (
            <div key={job.company}>
              <h3>{job.company}</h3>
              <p className="info">
                {job.title}
                <span>&bull;</span> <em className="date">{job.years}</em>
              </p>
              <p>{job.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="row skill">
        <div className="three columns header-col">
          <h1>
            <span>Skills</span>
          </h1>
        </div>

        <div className="nine columns main-col">
          <p>{skillmessage}</p>

          <div className="bars">
            <ul className="skills">
              {skills.map((skill) => {
                const className = `bar-expand ${skill.name.toLowerCase()}`;
                return (
                  <li key={skill.name}>
                    <span style={{width: skill.level}} className={className}></span>
                    <em>{skill.name}</em>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
