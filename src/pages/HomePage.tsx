import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import type {MainData} from '@/types/resume.types';
import './HomePage.css';

interface HomePageProps {
  data: MainData;
}

interface Project {
  eyebrow: string;
  title: string;
  description: string;
  result: string;
  resultLabel: string;
  role: string;
  stack: string;
  image: string;
  href: string;
  tone: 'blue' | 'violet' | 'green';
}

const projects: Project[] = [
  {
    eyebrow: 'Traveloka · Flight',
    title: 'A faster path from search to takeoff.',
    description:
      'Led the flight booking redesign and simplified a complex, multi-market journey used by millions of travelers across Southeast Asia.',
    result: '+10.16%',
    resultLabel: 'net revenue',
    role: 'Frontend Lead',
    stack: 'React · TypeScript · GraphQL',
    image: '/images/portfolio/traveloka-owl-icon.png',
    href: 'https://www.traveloka.com/en-id/flight',
    tone: 'blue',
  },
  {
    eyebrow: 'Supertool.id',
    title: 'Fifty developer tools. One focused workspace.',
    description:
      'Designed and built a privacy-first toolkit for everyday developer tasks, from data formatting to image optimization.',
    result: '50+',
    resultLabel: 'tools shipped',
    role: 'Solo creator',
    stack: 'Next.js · TypeScript · Vercel',
    image: '/images/portfolio/supertool.png',
    href: 'https://supertool.id/',
    tone: 'violet',
  },
  {
    eyebrow: 'Maideasy',
    title: 'Booking home care in under three minutes.',
    description:
      'Built a mobile-first service experience that made finding, scheduling, and paying for trusted cleaners feel effortless.',
    result: '<3 min',
    resultLabel: 'booking flow',
    role: 'Mobile engineer',
    stack: 'React Native · Firebase · GraphQL',
    image: '/images/portfolio/maideasy.png',
    href: 'https://www.maideasy.my',
    tone: 'green',
  },
];

const experience = [
  {
    period: '2026 to now',
    company: 'PayMongo',
    role: 'Senior Software Engineer',
    summary:
      'Building payment infrastructure, invoicing products, and developer-facing APIs for merchants across Southeast Asia.',
  },
  {
    period: '2020 to 2026',
    company: 'Traveloka',
    role: 'Software Engineer',
    summary:
      'Led high-impact work across flights and metasearch, improving revenue, performance, and engineering operations.',
  },
  {
    period: '2013 to 2020',
    company: 'Sorabel, Traveloka Visa, and earlier teams',
    role: 'Frontend and mobile engineer',
    summary:
      'Warehouse systems at Sorabel, Traveloka’s Visa product for Japan, Australia, China, and India, plus education and commerce apps.',
  },
];

const principles = [
  {
    title: 'Clarity over cleverness',
    body: 'Simple systems are easier to use, maintain, and trust.',
  },
  {
    title: 'Impact over output',
    body: 'The work is only complete when it creates a meaningful result.',
  },
  {
    title: 'Craft at every layer',
    body: 'Details in code, interaction, and communication all shape the product.',
  },
];

const technologies = [
  'React',
  'TypeScript',
  'Next.js',
  'Golang',
  'GraphQL',
  'AWS',
  'AI systems',
];

const labLinks = [
  {href: '/dashboard', label: 'Dashboard'},
  {href: '/guestbook', label: 'Guestbook'},
  {href: '/achievements', label: 'Achievements'},
  {href: '/uses', label: 'Uses'},
  {href: '/changelog', label: 'Changelog'},
  {href: '/links', label: 'Links'},
];

const highlights = [
  {value: '9+', label: 'Years shipping products'},
  {value: '10.16%', label: 'Revenue lift at Traveloka'},
  {value: '30%', label: 'Faster issue resolution'},
  {value: '4 markets', label: 'Visa product: JP, AU, CN, IN'},
];

function Arrow() {
  return (
    <span className="arrow" aria-hidden="true">
      ↗
    </span>
  );
}

export default function HomePage({data}: HomePageProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const github =
    data.social.find((item) => item.name === 'github')?.url ??
    'https://github.com/ferryhinardi';
  const linkedin =
    data.social.find((item) => item.name === 'linkedin')?.url ??
    'https://www.linkedin.com/in/ferryhinardi';
  const portrait = `/images/${data.image.replace(/\.(jpe?g|png)$/i, '.webp')}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="home">
      <a className="skip-link" href="#work">
        Skip to selected work
      </a>
      <nav
        className={`site-nav ${scrolled ? 'is-scrolled' : ''}`}
        aria-label="Primary navigation">
        <div className="nav-inner">
          <a href="#top" className="wordmark" onClick={closeMenu}>
            FH<span>.</span>
          </a>
          <div className={`nav-menu ${menuOpen ? 'is-open' : ''}`}>
            <a href="#work" className="nav-link" onClick={closeMenu}>
              Work
            </a>
            <a href="#experience" className="nav-link" onClick={closeMenu}>
              Experience
            </a>
            <a href="#about" className="nav-link" onClick={closeMenu}>
              About
            </a>
            <a href="#contact" className="nav-cta" onClick={closeMenu}>
              Start a conversation
            </a>
          </div>
          <button
            type="button"
            className={`menu-control ${menuOpen ? 'is-open' : ''}`}
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>
            <span />
            <span />
          </button>
        </div>
      </nav>

      <header className="hero" id="top">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="status-line">
              <span className="status-dot" />
              Based in Indonesia · Working globally
            </p>
            <h1 className="hero-title">
              Engineering digital products that move businesses forward.
            </h1>
            <p className="hero-intro">
              I’m {data.name.split(' ')[0]}, a senior full-stack engineer with
              9+ years of experience turning complex systems into clear, fast,
              and dependable products.
            </p>
            <div className="impact-strip" aria-label="Career highlights">
              {highlights.map((item) => (
                <div key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
            <div className="hero-actions">
              <a href="#work" className="button button-primary">
                View selected work <span aria-hidden="true">↓</span>
              </a>
              <a
                href={data.resumedownload}
                className="button button-secondary"
                target="_blank"
                rel="noopener noreferrer">
                View résumé <Arrow />
              </a>
            </div>
          </div>

          <div className="hero-portrait">
            <div className="portrait-frame">
              <img src={portrait} alt={data.name} />
              <div className="portrait-caption">
                <span>Currently</span>
                <strong>Senior Software Engineer at PayMongo</strong>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="work-section" id="work">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Selected work</span>
            <h2 className="section-title">Products with measurable impact.</h2>
          </div>
          <p>
            A selection of work across fintech, travel, developer tools, and
            consumer services.
          </p>
        </div>

        <div className="project-grid">
          {projects.map((project, index) => (
            <article
              className={`project-card project-${project.tone} ${
                index === 0 ? 'featured' : ''
              }`}
              key={project.title}>
              <div className="project-visual">
                <span className="project-number">0{index + 1}</span>
                <img src={project.image} alt="" />
                <div className="result-badge">
                  <strong>{project.result}</strong>
                  <span>{project.resultLabel}</span>
                </div>
              </div>
              <div className="project-content">
                <span className="project-eyebrow">{project.eyebrow}</span>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-meta">
                  <span>{project.role}</span>
                  <span>{project.stack}</span>
                </div>
                <a
                  href={project.href}
                  className="text-link"
                  target="_blank"
                  rel="noopener noreferrer">
                  Explore the product <Arrow />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="experience-section" id="experience">
        <div className="experience-intro">
          <span className="section-kicker">Experience</span>
          <h2 className="section-title">
            A decade spent making hard things feel simple.
          </h2>
          <p>
            I work across product, design, and engineering to turn ambiguity
            into outcomes that users can feel and businesses can measure.
          </p>
          <a
            href={linkedin}
            className="text-link"
            target="_blank"
            rel="noopener noreferrer">
            Full history on LinkedIn <Arrow />
          </a>
        </div>
        <div className="timeline">
          {experience.map((item) => (
            <article className="timeline-item" key={item.period}>
              <span className="timeline-period">{item.period}</span>
              <div>
                <h3 className="timeline-company">{item.company}</h3>
                <strong className="timeline-role">{item.role}</strong>
                <p>{item.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="about-card">
          <div className="about-copy">
            <span className="section-kicker">Beyond the code</span>
            <h2 className="section-title">
              An engineer who stays close to the problem.
            </h2>
            <p>
              I care about the entire product, not only the implementation.
              That means asking better questions, making thoughtful trade-offs,
              helping teams move with confidence, and measuring what happens
              after launch.
            </p>
          </div>
          <div className="principles">
            {principles.map((item, index) => (
              <div key={item.title}>
                <span>0{index + 1}</span>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
        <ul className="stack-row" aria-label="Core technologies">
          {technologies.map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>
      </section>

      <footer className="contact-section" id="contact">
        <div className="contact-copy">
          <span className="section-kicker">Let’s work together</span>
          <h2 className="contact-title">
            Have a complex product problem? Let’s make it clear.
          </h2>
        </div>
        <div className="contact-actions">
          <a href={`mailto:${data.email}`} className="button button-light">
            {data.email} <Arrow />
          </a>
          <div className="social-links">
            <a href={github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href={linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
        <nav className="lab-links" aria-label="More pages">
          {labLinks.map((item) => (
            <Link key={item.href} to={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="footer-line">
          <span>{data.name} · Senior Full-Stack Engineer</span>
          <span>Indonesia · 2026</span>
        </div>
      </footer>
    </div>
  );
}
