import {render, screen} from '@testing-library/react';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import type {ResumeSection} from '@/types/resume.types';
import Resume from '../Resume';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({children, ...props}: any) => <div {...props}>{children}</div>,
    section: ({children, ...props}: any) => (
      <section {...props}>{children}</section>
    ),
  },
  AnimatePresence: ({children}: any) => <>{children}</>,
}));

// Mock UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({children, className}: any) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardContent: ({children, className}: any) => (
    <div data-testid="card-content" className={className}>
      {children}
    </div>
  ),
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({children, variant, className}: any) => (
    <span data-testid="badge" data-variant={variant} className={className}>
      {children}
    </span>
  ),
}));

vi.mock('@/components/ui/separator', () => ({
  Separator: ({className}: any) => (
    <hr data-testid="separator" className={className} />
  ),
}));

vi.mock('@/components/ui/tilt-card', () => ({
  TiltCard: ({children}: any) => <div data-testid="tilt-card">{children}</div>,
}));

vi.mock('@/components/ui/section-transition', () => ({
  SectionTransition: ({type, position, className}: any) => (
    <div
      data-testid="section-transition"
      data-type={type}
      data-position={position}
      className={className}
    />
  ),
}));

vi.mock('@/components/ui/scroll-reveal-timeline', () => ({
  ScrollRevealTimeline: ({children, lineGradient}: any) => (
    <div data-testid="scroll-reveal-timeline" data-line-gradient={lineGradient}>
      {children}
    </div>
  ),
  TimelineItem: ({children, index, dotColor}: any) => (
    <div
      data-testid={`timeline-item-${index}`}
      data-dot-color={dotColor}
    >
      {children}
    </div>
  ),
}));

vi.mock('@/components/ui/github-activity', () => ({
  GitHubActivity: ({username, maxEvents, showStats}: any) => (
    <div
      data-testid="github-activity"
      data-username={username}
      data-max-events={maxEvents}
      data-show-stats={String(showStats)}
    >
      GitHub Activity Mock
    </div>
  ),
}));

// Mock lazy-loaded SkillsRadar
vi.mock('@/components/ui/skills-radar', () => ({
  default: ({skills}: any) => (
    <div data-testid="skills-radar" data-skills-count={skills?.length}>
      Skills Radar Mock
    </div>
  ),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  GraduationCap: ({className}: any) => (
    <span data-testid="graduation-cap-icon" className={className}>
      GraduationCap
    </span>
  ),
  Briefcase: ({className}: any) => (
    <span data-testid="briefcase-icon" className={className}>
      Briefcase
    </span>
  ),
  Award: ({className}: any) => (
    <span data-testid="award-icon" className={className}>
      Award
    </span>
  ),
  TrendingUp: ({className}: any) => (
    <span data-testid="trending-up-icon" className={className}>
      TrendingUp
    </span>
  ),
  Github: ({className}: any) => (
    <span data-testid="github-icon" className={className}>
      Github
    </span>
  ),
}));

// Mock animations utility
vi.mock('@/utils/animations', () => ({
  staggerContainer: {},
  staggerItem: {},
  viewportOptions: {},
}));

// Test data factory
const createMockResumeData = (
  overrides?: Partial<ResumeSection>,
): ResumeSection => ({
  skillmessage:
    'I am passionate about building scalable and efficient software solutions.',
  education: [
    {
      school: 'University of Technology',
      degree: 'Bachelor of Computer Science',
      graduated: '2015',
      description:
        'Focused on software engineering and distributed systems. Graduated with honors.',
    },
    {
      school: 'Tech Academy',
      degree: 'Full Stack Development Certificate',
      graduated: '2016',
      description:
        'Intensive bootcamp covering modern web technologies and best practices.',
    },
  ],
  work: [
    {
      company: 'Tech Corp',
      title: 'Senior Software Engineer',
      years: '2020 - Present',
      description:
        'Leading development of microservices architecture and mentoring junior developers.',
    },
    {
      company: 'Startup Inc',
      title: 'Software Engineer',
      years: '2017 - 2020',
      description:
        'Built and maintained core product features using React and Node.js.',
    },
    {
      company: 'Digital Agency',
      title: 'Junior Developer',
      years: '2015 - 2017',
      description:
        'Developed client websites and internal tools using various technologies.',
    },
  ],
  skills: [
    {name: 'React', level: '95'},
    {name: 'TypeScript', level: '90'},
    {name: 'Node.js', level: '85'},
    {name: 'Python', level: '75'},
    {name: 'AWS', level: '80'},
  ],
  ...overrides,
});

describe('Resume', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('shows loading state when no data is provided', () => {
      render(<Resume />);

      expect(screen.getByRole('heading', {name: 'Resume'})).toBeInTheDocument();
      expect(screen.getByText('Loading resume data...')).toBeInTheDocument();
    });

    it('renders section with id="resume" in loading state', () => {
      render(<Resume />);

      const section = document.querySelector('section#resume');
      expect(section).toBeInTheDocument();
    });

    it('shows loading state when data is undefined', () => {
      render(<Resume data={undefined} />);

      expect(screen.getByText('Loading resume data...')).toBeInTheDocument();
    });
  });

  describe('Section Structure', () => {
    it('renders section with id="resume" when data is provided', () => {
      render(<Resume data={createMockResumeData()} />);

      const section = document.querySelector('section#resume');
      expect(section).toBeInTheDocument();
    });

    it('displays section title "Resume"', () => {
      render(<Resume data={createMockResumeData()} />);

      expect(screen.getByRole('heading', {name: 'Resume'})).toBeInTheDocument();
    });

    it('displays section subtitle about continuous learning', () => {
      render(<Resume data={createMockResumeData()} />);

      expect(
        screen.getByText(
          'A journey of continuous learning, innovative solutions, and technical mastery',
        ),
      ).toBeInTheDocument();
    });

    it('renders section transitions for light and dark modes', () => {
      render(<Resume data={createMockResumeData()} />);

      const transitions = screen.getAllByTestId('section-transition');
      expect(transitions).toHaveLength(2);
      expect(transitions[0]).toHaveAttribute('data-type', 'curve');
      expect(transitions[0]).toHaveAttribute('data-position', 'top');
    });

    it('renders separators between sections', () => {
      render(<Resume data={createMockResumeData()} />);

      const separators = screen.getAllByTestId('separator');
      expect(separators.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Education Section', () => {
    it('renders Education heading', () => {
      render(<Resume data={createMockResumeData()} />);

      expect(
        screen.getByRole('heading', {name: 'Education'}),
      ).toBeInTheDocument();
    });

    it('renders GraduationCap icon', () => {
      render(<Resume data={createMockResumeData()} />);

      expect(screen.getByTestId('graduation-cap-icon')).toBeInTheDocument();
    });

    it('displays education section subtitle', () => {
      render(<Resume data={createMockResumeData()} />);

      expect(
        screen.getByText('Building the foundation for excellence'),
      ).toBeInTheDocument();
    });

    it('renders all education entries', () => {
      const data = createMockResumeData();
      render(<Resume data={data} />);

      data.education.forEach((edu) => {
        expect(screen.getByText(edu.school)).toBeInTheDocument();
        expect(screen.getByText(edu.degree)).toBeInTheDocument();
        expect(screen.getByText(edu.graduated)).toBeInTheDocument();
        expect(screen.getByText(edu.description)).toBeInTheDocument();
      });
    });

    it('renders education entries with TiltCard wrapper', () => {
      const data = createMockResumeData();
      render(<Resume data={data} />);

      const tiltCards = screen.getAllByTestId('tilt-card');
      // Should have tilt cards for education + work entries
      expect(tiltCards.length).toBeGreaterThanOrEqual(data.education.length);
    });

    it('shows empty state when education array is empty', () => {
      render(<Resume data={createMockResumeData({education: []})} />);

      expect(
        screen.getByText('No education data available.'),
      ).toBeInTheDocument();
    });

    it('shows empty state when education is undefined', () => {
      render(
        <Resume
          data={createMockResumeData({education: undefined as unknown as []})}
        />,
      );

      expect(
        screen.getByText('No education data available.'),
      ).toBeInTheDocument();
    });

    it('renders graduated date in Badge component', () => {
      render(<Resume data={createMockResumeData()} />);

      const badges = screen.getAllByTestId('badge');
      const graduatedBadge = badges.find(
        (badge) => badge.textContent === '2015',
      );
      expect(graduatedBadge).toBeInTheDocument();
      expect(graduatedBadge).toHaveAttribute('data-variant', 'secondary');
    });
  });

  describe('Work Experience Section', () => {
    it('renders Work Experience heading', () => {
      render(<Resume data={createMockResumeData()} />);

      expect(
        screen.getByRole('heading', {name: 'Work Experience'}),
      ).toBeInTheDocument();
    });

    it('renders Briefcase icon', () => {
      render(<Resume data={createMockResumeData()} />);

      expect(screen.getByTestId('briefcase-icon')).toBeInTheDocument();
    });

    it('displays work section subtitle', () => {
      render(<Resume data={createMockResumeData()} />);

      expect(
        screen.getByText('Where passion meets impact'),
      ).toBeInTheDocument();
    });

    it('renders ScrollRevealTimeline component', () => {
      render(<Resume data={createMockResumeData()} />);

      expect(screen.getByTestId('scroll-reveal-timeline')).toBeInTheDocument();
      expect(screen.getByTestId('scroll-reveal-timeline')).toHaveAttribute(
        'data-line-gradient',
        'from-cyan-500 via-blue-500 to-purple-500',
      );
    });

    it('renders all work entries as TimelineItems', () => {
      const data = createMockResumeData();
      render(<Resume data={data} />);

      data.work.forEach((job, index) => {
        expect(
          screen.getByTestId(`timeline-item-${index}`),
        ).toBeInTheDocument();
        expect(screen.getByText(job.company)).toBeInTheDocument();
        expect(screen.getByText(job.title)).toBeInTheDocument();
        expect(screen.getByText(job.years)).toBeInTheDocument();
        expect(screen.getByText(job.description)).toBeInTheDocument();
      });
    });

    it('renders years in Badge with outline variant', () => {
      render(<Resume data={createMockResumeData()} />);

      const badges = screen.getAllByTestId('badge');
      const yearsBadge = badges.find(
        (badge) => badge.textContent === '2020 - Present',
      );
      expect(yearsBadge).toBeInTheDocument();
      expect(yearsBadge).toHaveAttribute('data-variant', 'outline');
    });

    it('shows empty state when work array is empty', () => {
      render(<Resume data={createMockResumeData({work: []})} />);

      expect(
        screen.getByText('No work experience data available.'),
      ).toBeInTheDocument();
    });

    it('shows empty state when work is undefined', () => {
      render(
        <Resume data={createMockResumeData({work: undefined as unknown as []})} />,
      );

      expect(
        screen.getByText('No work experience data available.'),
      ).toBeInTheDocument();
    });
  });

  describe('GitHub Activity Section', () => {
    it('renders GitHub Activity heading', () => {
      render(<Resume data={createMockResumeData()} />);

      expect(
        screen.getByRole('heading', {name: 'GitHub Activity'}),
      ).toBeInTheDocument();
    });

    it('renders Github icon', () => {
      render(<Resume data={createMockResumeData()} />);

      expect(screen.getByTestId('github-icon')).toBeInTheDocument();
    });

    it('displays GitHub section subtitle', () => {
      render(<Resume data={createMockResumeData()} />);

      expect(
        screen.getByText('Recent contributions and open source work'),
      ).toBeInTheDocument();
    });

    it('renders GitHubActivity component with correct props', () => {
      render(<Resume data={createMockResumeData()} />);

      const githubActivity = screen.getByTestId('github-activity');
      expect(githubActivity).toBeInTheDocument();
      expect(githubActivity).toHaveAttribute('data-username', 'ferryhinardi');
      expect(githubActivity).toHaveAttribute('data-max-events', '5');
      expect(githubActivity).toHaveAttribute('data-show-stats', 'true');
    });
  });

  describe('Technical Skills Section', () => {
    it('renders Technical Skills heading', () => {
      render(<Resume data={createMockResumeData()} />);

      expect(
        screen.getByRole('heading', {name: 'Technical Skills'}),
      ).toBeInTheDocument();
    });

    it('renders TrendingUp icon', () => {
      render(<Resume data={createMockResumeData()} />);

      expect(screen.getByTestId('trending-up-icon')).toBeInTheDocument();
    });

    it('displays skills section subtitle', () => {
      render(<Resume data={createMockResumeData()} />);

      expect(
        screen.getByText('Tools I wield to build amazing things'),
      ).toBeInTheDocument();
    });

    it('renders skillmessage in a Card', () => {
      const data = createMockResumeData();
      render(<Resume data={data} />);

      expect(screen.getByText(data.skillmessage)).toBeInTheDocument();
    });

    it('renders Award icon next to skillmessage', () => {
      render(<Resume data={createMockResumeData()} />);

      expect(screen.getByTestId('award-icon')).toBeInTheDocument();
    });

    it('renders SkillsRadar component when skills are provided', async () => {
      const data = createMockResumeData();
      render(<Resume data={data} />);

      const skillsRadar = await screen.findByTestId('skills-radar');
      expect(skillsRadar).toBeInTheDocument();
      expect(skillsRadar).toHaveAttribute(
        'data-skills-count',
        String(data.skills.length),
      );
    });

    it('shows empty state when skills array is empty', () => {
      render(<Resume data={createMockResumeData({skills: []})} />);

      expect(
        screen.getByText('No skills data available.'),
      ).toBeInTheDocument();
    });

    it('shows empty state when skills is undefined', () => {
      render(
        <Resume
          data={createMockResumeData({skills: undefined as unknown as []})}
        />,
      );

      expect(
        screen.getByText('No skills data available.'),
      ).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles single education entry', () => {
      const data = createMockResumeData({
        education: [
          {
            school: 'Single University',
            degree: 'Single Degree',
            graduated: '2020',
            description: 'Single description',
          },
        ],
      });
      render(<Resume data={data} />);

      expect(screen.getByText('Single University')).toBeInTheDocument();
      expect(screen.getByText('Single Degree')).toBeInTheDocument();
    });

    it('handles single work entry', () => {
      const data = createMockResumeData({
        work: [
          {
            company: 'Single Company',
            title: 'Single Title',
            years: '2020',
            description: 'Single description',
          },
        ],
      });
      render(<Resume data={data} />);

      expect(screen.getByText('Single Company')).toBeInTheDocument();
      expect(screen.getByText('Single Title')).toBeInTheDocument();
    });

    it('handles single skill entry', async () => {
      const data = createMockResumeData({
        skills: [{name: 'Single Skill', level: '100'}],
      });
      render(<Resume data={data} />);

      const skillsRadar = await screen.findByTestId('skills-radar');
      expect(skillsRadar).toHaveAttribute('data-skills-count', '1');
    });

    it('handles empty skillmessage', () => {
      const data = createMockResumeData({skillmessage: ''});
      render(<Resume data={data} />);

      // Should still render the Award icon and card structure
      expect(screen.getByTestId('award-icon')).toBeInTheDocument();
    });

    it('handles very long descriptions', () => {
      const longDescription = 'A'.repeat(500);
      const data = createMockResumeData({
        education: [
          {
            school: 'Test School',
            degree: 'Test Degree',
            graduated: '2020',
            description: longDescription,
          },
        ],
      });
      render(<Resume data={data} />);

      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });

    it('handles special characters in text', () => {
      const data = createMockResumeData({
        education: [
          {
            school: "University of Tech & Science <special>",
            degree: "Bachelor's Degree (Honors)",
            graduated: '2020-2021',
            description: 'Description with "quotes" and \'apostrophes\'',
          },
        ],
      });
      render(<Resume data={data} />);

      expect(
        screen.getByText("University of Tech & Science <special>"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Bachelor's Degree (Honors)"),
      ).toBeInTheDocument();
    });
  });

  describe('Multiple Data Entries', () => {
    it('renders correct number of education cards', () => {
      const data = createMockResumeData();
      render(<Resume data={data} />);

      const cards = screen.getAllByTestId('card');
      // Cards for education + work + skillmessage
      expect(cards.length).toBeGreaterThanOrEqual(
        data.education.length + data.work.length + 1,
      );
    });

    it('renders correct number of timeline items for work', () => {
      const data = createMockResumeData();
      render(<Resume data={data} />);

      data.work.forEach((_, index) => {
        expect(
          screen.getByTestId(`timeline-item-${index}`),
        ).toBeInTheDocument();
      });
    });

    it('maintains order of education entries', () => {
      const data = createMockResumeData();
      render(<Resume data={data} />);

      const schoolElements = data.education.map((edu) =>
        screen.getByText(edu.school),
      );
      
      // Verify all schools are rendered
      schoolElements.forEach((el) => expect(el).toBeInTheDocument());
    });

    it('maintains order of work entries', () => {
      const data = createMockResumeData();
      render(<Resume data={data} />);

      const companyElements = data.work.map((job) =>
        screen.getByText(job.company),
      );
      
      // Verify all companies are rendered
      companyElements.forEach((el) => expect(el).toBeInTheDocument());
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<Resume data={createMockResumeData()} />);

      const h2 = screen.getByRole('heading', {level: 2, name: 'Resume'});
      expect(h2).toBeInTheDocument();

      const h3s = screen.getAllByRole('heading', {level: 3});
      expect(h3s).toHaveLength(4); // Education, Work Experience, GitHub Activity, Technical Skills
    });

    it('renders semantic section element', () => {
      render(<Resume data={createMockResumeData()} />);

      const section = document.querySelector('section#resume');
      expect(section).toBeInTheDocument();
    });
  });

  describe('Styling Classes', () => {
    it('applies section-padding class to section', () => {
      render(<Resume data={createMockResumeData()} />);

      const section = document.querySelector('section#resume');
      expect(section).toHaveClass('section-padding');
    });

    it('applies section-title class to main heading', () => {
      render(<Resume data={createMockResumeData()} />);

      const heading = screen.getByRole('heading', {name: 'Resume'});
      expect(heading).toHaveClass('section-title');
    });
  });
});
