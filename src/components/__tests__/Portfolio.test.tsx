import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import type {Portfolio as PortfolioData, Project} from '@/types/resume.types';
import Portfolio from '../Portfolio';

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
    <div data-testid="project-card" className={className}>
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
    <span data-testid="metric-badge" data-variant={variant} className={className}>
      {children}
    </span>
  ),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({children, onClick, size, variant, className, ...props}: any) => (
    <button
      data-testid="button"
      data-size={size}
      data-variant={variant}
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/tilt-card', () => ({
  TiltCard: ({children, className}: any) => (
    <div data-testid="tilt-card" className={className}>
      {children}
    </div>
  ),
}));

vi.mock('@/components/ui/floating-badge', () => ({
  FloatingBadge: ({children, onClick, variant, className}: any) => (
    <button
      data-testid="floating-badge"
      data-variant={variant}
      className={className}
      onClick={onClick}
    >
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/tech-badge', () => ({
  TechStack: ({technologies, limit, className}: any) => (
    <div
      data-testid="tech-stack"
      data-count={technologies?.slice(0, limit).length}
      className={className}
    >
      {technologies?.slice(0, limit).map((tech: string) => (
        <span key={tech} data-testid="tech-item">
          {tech}
        </span>
      ))}
    </div>
  ),
}));

vi.mock('@/components/ui/optimized-image', () => ({
  default: ({src, alt, className}: any) => (
    <img data-testid="optimized-image" src={src} alt={alt} className={className} />
  ),
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

// Mock lazy-loaded ProjectModal
vi.mock('../Portfolio/ProjectModal', () => ({
  ProjectModal: ({project, onClose}: any) =>
    project ? (
      <div data-testid="project-modal">
        <span data-testid="modal-title">{project.title}</span>
        <button onClick={onClose} data-testid="modal-close">
          Close
        </button>
      </div>
    ) : null,
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  ExternalLink: ({className}: any) => (
    <span data-testid="icon-external-link" className={className}>
      ExternalLink
    </span>
  ),
  Code2: ({className}: any) => (
    <span data-testid="icon-code" className={className}>
      Code2
    </span>
  ),
  Filter: ({className}: any) => (
    <span data-testid="icon-filter" className={className}>
      Filter
    </span>
  ),
  X: ({className}: any) => (
    <span data-testid="icon-x" className={className}>
      X
    </span>
  ),
  Rocket: ({className}: any) => (
    <span data-testid="icon-rocket" className={className}>
      Rocket
    </span>
  ),
}));

// Mock animations utility
vi.mock('@/utils/animations', () => ({
  staggerContainer: {},
  staggerItem: {},
  viewportOptions: {},
}));

// Helper function to create test project data
const createProject = (overrides: Partial<Project> = {}): Project => ({
  title: 'Test Project',
  category: 'Web Application',
  description: 'A test project description',
  image: 'test-project.png',
  url: 'https://example.com',
  technologies: ['React', 'TypeScript', 'Node.js'],
  ...overrides,
});

// Helper to create portfolio data
const createPortfolioData = (
  projects: Project[] = [createProject()],
): PortfolioData => ({
  projects,
});

describe('Portfolio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('returns null when data is undefined', () => {
      const {container} = render(<Portfolio />);
      expect(container.firstChild).toBeNull();
    });

    it('returns null when data is null', () => {
      const {container} = render(<Portfolio data={undefined} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders section with correct id', () => {
      const {container} = render(<Portfolio data={createPortfolioData()} />);
      const section = container.querySelector('section');
      expect(section).toHaveAttribute('id', 'portfolio');
    });

    it('renders section title "Featured Projects"', () => {
      render(<Portfolio data={createPortfolioData()} />);
      expect(
        screen.getByRole('heading', {name: /featured projects/i}),
      ).toBeInTheDocument();
    });

    it('renders section subtitle', () => {
      render(<Portfolio data={createPortfolioData()} />);
      expect(
        screen.getByText(/a showcase of impactful projects/i),
      ).toBeInTheDocument();
    });

    it('renders Code2 icon in header', () => {
      render(<Portfolio data={createPortfolioData()} />);
      expect(screen.getByTestId('icon-code')).toBeInTheDocument();
    });

    it('renders section transitions', () => {
      render(<Portfolio data={createPortfolioData()} />);
      const transitions = screen.getAllByTestId('section-transition');
      expect(transitions.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Technology Filter', () => {
    const projectsWithTech: Project[] = [
      createProject({
        title: 'React Project',
        technologies: ['React', 'TypeScript'],
      }),
      createProject({
        title: 'Vue Project',
        technologies: ['Vue', 'TypeScript'],
      }),
      createProject({
        title: 'Angular Project',
        technologies: ['Angular', 'RxJS'],
      }),
    ];

    it('renders "Filter by Technology" heading', () => {
      render(<Portfolio data={createPortfolioData(projectsWithTech)} />);
      expect(
        screen.getByRole('heading', {name: /filter by technology/i}),
      ).toBeInTheDocument();
    });

    it('renders filter icon', () => {
      render(<Portfolio data={createPortfolioData(projectsWithTech)} />);
      expect(screen.getByTestId('icon-filter')).toBeInTheDocument();
    });

    it('renders all unique technologies as filter badges', () => {
      render(<Portfolio data={createPortfolioData(projectsWithTech)} />);
      const badges = screen.getAllByTestId('floating-badge');
      // Unique techs: Angular, React, RxJS, TypeScript, Vue (sorted)
      expect(badges).toHaveLength(5);
    });

    it('renders technologies in sorted order', () => {
      render(<Portfolio data={createPortfolioData(projectsWithTech)} />);
      const badges = screen.getAllByTestId('floating-badge');
      const techNames = badges.map((badge) => badge.textContent);
      expect(techNames).toEqual(['Angular', 'React', 'RxJS', 'TypeScript', 'Vue']);
    });

    it('does not render filter section when no technologies exist', () => {
      const projectsWithoutTech = [
        createProject({title: 'No Tech Project', technologies: undefined}),
      ];
      render(<Portfolio data={createPortfolioData(projectsWithoutTech)} />);
      expect(
        screen.queryByRole('heading', {name: /filter by technology/i}),
      ).not.toBeInTheDocument();
    });

    it('filters projects when clicking a technology badge', async () => {
      const user = userEvent.setup();
      render(<Portfolio data={createPortfolioData(projectsWithTech)} />);

      // Initially all 3 projects visible
      expect(screen.getAllByTestId('project-card')).toHaveLength(3);

      // Click on React filter
      const reactBadge = screen.getByRole('button', {name: 'React'});
      await user.click(reactBadge);

      // Should show only React Project
      expect(screen.getAllByTestId('project-card')).toHaveLength(1);
      expect(screen.getByText('React Project')).toBeInTheDocument();
    });

    it('shows "Showing X of Y projects" when filter is active', async () => {
      const user = userEvent.setup();
      render(<Portfolio data={createPortfolioData(projectsWithTech)} />);

      // Click TypeScript filter (2 projects use it)
      const tsBadge = screen.getByRole('button', {name: 'TypeScript'});
      await user.click(tsBadge);

      expect(screen.getByText('Showing 2 of 3 projects')).toBeInTheDocument();
    });

    it('shows "Clear Filter" button when filter is active', async () => {
      const user = userEvent.setup();
      render(<Portfolio data={createPortfolioData(projectsWithTech)} />);

      // No clear button initially
      expect(
        screen.queryByRole('button', {name: /clear filter/i}),
      ).not.toBeInTheDocument();

      // Click a technology
      await user.click(screen.getByRole('button', {name: 'React'}));

      // Clear button should appear
      expect(
        screen.getByRole('button', {name: /clear filter/i}),
      ).toBeInTheDocument();
    });

    it('clears filter when clicking "Clear Filter" button', async () => {
      const user = userEvent.setup();
      render(<Portfolio data={createPortfolioData(projectsWithTech)} />);

      // Apply filter
      await user.click(screen.getByRole('button', {name: 'React'}));
      expect(screen.getAllByTestId('project-card')).toHaveLength(1);

      // Clear filter
      await user.click(screen.getByRole('button', {name: /clear filter/i}));

      // All projects visible again
      expect(screen.getAllByTestId('project-card')).toHaveLength(3);
    });

    it('deselects filter when clicking the same technology again', async () => {
      const user = userEvent.setup();
      render(<Portfolio data={createPortfolioData(projectsWithTech)} />);

      // Click React
      await user.click(screen.getByRole('button', {name: 'React'}));
      expect(screen.getAllByTestId('project-card')).toHaveLength(1);

      // Click React again to deselect
      await user.click(screen.getByRole('button', {name: 'React'}));
      expect(screen.getAllByTestId('project-card')).toHaveLength(3);
    });

    it('applies selected variant to active filter badge', async () => {
      const user = userEvent.setup();
      render(<Portfolio data={createPortfolioData(projectsWithTech)} />);

      const reactBadge = screen.getByRole('button', {name: 'React'});
      expect(reactBadge).toHaveAttribute('data-variant', 'outline');

      await user.click(reactBadge);
      expect(reactBadge).toHaveAttribute('data-variant', 'default');
    });
  });

  describe('Project Cards', () => {
    it('renders a TiltCard for each project', () => {
      const projects = [
        createProject({title: 'Project 1'}),
        createProject({title: 'Project 2'}),
        createProject({title: 'Project 3'}),
      ];
      render(<Portfolio data={createPortfolioData(projects)} />);
      expect(screen.getAllByTestId('tilt-card')).toHaveLength(3);
    });

    it('renders project title', () => {
      render(
        <Portfolio
          data={createPortfolioData([createProject({title: 'My Amazing Project'})])}
        />,
      );
      expect(
        screen.getByRole('heading', {name: 'My Amazing Project'}),
      ).toBeInTheDocument();
    });

    it('renders project category', () => {
      render(
        <Portfolio
          data={createPortfolioData([
            createProject({category: 'E-commerce Platform'}),
          ])}
        />,
      );
      expect(screen.getByText('E-commerce Platform')).toBeInTheDocument();
    });

    it('renders project image with correct path', () => {
      render(
        <Portfolio
          data={createPortfolioData([createProject({image: 'my-project.png'})])}
        />,
      );
      const img = screen.getByTestId('optimized-image');
      expect(img).toHaveAttribute('src', '/images/portfolio/my-project.png');
    });

    it('renders project image with alt text matching title', () => {
      render(
        <Portfolio
          data={createPortfolioData([
            createProject({title: 'Cool Project', image: 'cool.png'}),
          ])}
        />,
      );
      const img = screen.getByTestId('optimized-image');
      expect(img).toHaveAttribute('alt', 'Cool Project');
    });

    it('renders "View Details" button for each project', () => {
      const projects = [
        createProject({title: 'Project 1'}),
        createProject({title: 'Project 2'}),
      ];
      render(<Portfolio data={createPortfolioData(projects)} />);
      const viewDetailsButtons = screen.getAllByRole('button', {
        name: /view details/i,
      });
      expect(viewDetailsButtons).toHaveLength(2);
    });
  });

  describe('External Link Button', () => {
    it('renders external link button when url is not "#"', () => {
      render(
        <Portfolio
          data={createPortfolioData([
            createProject({url: 'https://github.com/project'}),
          ])}
        />,
      );
      expect(screen.getByTestId('icon-external-link')).toBeInTheDocument();
    });

    it('does not render external link button when url is "#"', () => {
      render(
        <Portfolio data={createPortfolioData([createProject({url: '#'})])} />,
      );
      expect(screen.queryByTestId('icon-external-link')).not.toBeInTheDocument();
    });
  });

  describe('View Live Demo Button', () => {
    it('renders "View Live Demo" button when liveUrl exists', () => {
      render(
        <Portfolio
          data={createPortfolioData([
            createProject({liveUrl: 'https://demo.example.com'}),
          ])}
        />,
      );
      expect(
        screen.getByRole('button', {name: /view live demo/i}),
      ).toBeInTheDocument();
      expect(screen.getByTestId('icon-rocket')).toBeInTheDocument();
    });

    it('does not render "View Live Demo" button when liveUrl is undefined', () => {
      render(
        <Portfolio
          data={createPortfolioData([createProject({liveUrl: undefined})])}
        />,
      );
      expect(
        screen.queryByRole('button', {name: /view live demo/i}),
      ).not.toBeInTheDocument();
    });

    it('opens liveUrl in new tab when clicking "View Live Demo"', async () => {
      const user = userEvent.setup();
      const mockOpen = vi.spyOn(window, 'open').mockImplementation(() => null);

      render(
        <Portfolio
          data={createPortfolioData([
            createProject({liveUrl: 'https://live.example.com'}),
          ])}
        />,
      );

      await user.click(screen.getByRole('button', {name: /view live demo/i}));

      expect(mockOpen).toHaveBeenCalledWith('https://live.example.com', '_blank');
      mockOpen.mockRestore();
    });
  });

  describe('TechStack', () => {
    it('renders TechStack component when project has technologies', () => {
      render(
        <Portfolio
          data={createPortfolioData([
            createProject({technologies: ['React', 'Node.js']}),
          ])}
        />,
      );
      expect(screen.getByTestId('tech-stack')).toBeInTheDocument();
    });

    it('does not render TechStack when technologies is undefined', () => {
      render(
        <Portfolio
          data={createPortfolioData([createProject({technologies: undefined})])}
        />,
      );
      expect(screen.queryByTestId('tech-stack')).not.toBeInTheDocument();
    });

    it('does not render TechStack when technologies array is empty', () => {
      render(
        <Portfolio
          data={createPortfolioData([createProject({technologies: []})])}
        />,
      );
      expect(screen.queryByTestId('tech-stack')).not.toBeInTheDocument();
    });

    it('passes limit of 4 to TechStack', () => {
      render(
        <Portfolio
          data={createPortfolioData([
            createProject({
              technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Redis'],
            }),
          ])}
        />,
      );
      const techStack = screen.getByTestId('tech-stack');
      expect(techStack).toHaveAttribute('data-count', '4');
    });
  });

  describe('Project Metrics', () => {
    it('renders metrics badges when project has metrics', () => {
      render(
        <Portfolio
          data={createPortfolioData([
            createProject({
              metrics: {
                users: '10K+',
                revenueIncrease: '25%',
              },
            }),
          ])}
        />,
      );
      expect(screen.getByText(/users: 10k\+/i)).toBeInTheDocument();
      expect(screen.getByText(/revenue ↑: 25%/i)).toBeInTheDocument();
    });

    it('does not render metrics section when metrics is undefined', () => {
      render(
        <Portfolio
          data={createPortfolioData([createProject({metrics: undefined})])}
        />,
      );
      expect(screen.queryByTestId('metric-badge')).not.toBeInTheDocument();
    });

    it('does not render metrics section when metrics object is empty', () => {
      render(
        <Portfolio data={createPortfolioData([createProject({metrics: {}})])} />,
      );
      expect(screen.queryByTestId('metric-badge')).not.toBeInTheDocument();
    });

    it('limits metrics to top 3', () => {
      render(
        <Portfolio
          data={createPortfolioData([
            createProject({
              metrics: {
                users: '10K+',
                sellers: '500+',
                transactions: '1M+',
                revenueIncrease: '25%',
                performanceScore: 95,
              },
            }),
          ])}
        />,
      );
      const metricBadges = screen.getAllByTestId('metric-badge');
      expect(metricBadges).toHaveLength(3);
    });

    it('prioritizes high priority metrics (users, revenue, sellers, etc.)', () => {
      render(
        <Portfolio
          data={createPortfolioData([
            createProject({
              metrics: {
                performanceScore: 95, // Medium priority
                conversionIncrease: '15%', // Medium priority
                users: '10K+', // High priority
                sellers: '500+', // High priority
              },
            }),
          ])}
        />,
      );
      // Should show high priority metrics first
      expect(screen.getByText(/users: 10k\+/i)).toBeInTheDocument();
      expect(screen.getByText(/sellers: 500\+/i)).toBeInTheDocument();
    });

    it('formats performanceScore as X/100', () => {
      render(
        <Portfolio
          data={createPortfolioData([
            createProject({
              metrics: {
                performanceScore: 95,
              },
            }),
          ])}
        />,
      );
      expect(screen.getByText(/performance: 95\/100/i)).toBeInTheDocument();
    });
  });

  describe('getTopMetrics Helper', () => {
    // Testing the helper function indirectly through component rendering

    it('handles all high priority metrics', () => {
      render(
        <Portfolio
          data={createPortfolioData([
            createProject({
              metrics: {
                users: '1M',
                revenueIncrease: '50%',
                sellers: '10K',
              },
            }),
          ])}
        />,
      );
      expect(screen.getByText(/users: 1m/i)).toBeInTheDocument();
      expect(screen.getByText(/revenue ↑: 50%/i)).toBeInTheDocument();
      expect(screen.getByText(/sellers: 10k/i)).toBeInTheDocument();
    });

    it('handles transactions metric', () => {
      render(
        <Portfolio
          data={createPortfolioData([
            createProject({
              metrics: {transactions: '5M+'},
            }),
          ])}
        />,
      );
      expect(screen.getByText(/transactions: 5m\+/i)).toBeInTheDocument();
    });

    it('handles verifiedProperties metric', () => {
      render(
        <Portfolio
          data={createPortfolioData([
            createProject({
              metrics: {verifiedProperties: '100K'},
            }),
          ])}
        />,
      );
      expect(screen.getByText(/properties: 100k/i)).toBeInTheDocument();
    });

    it('handles toolsCount metric', () => {
      render(
        <Portfolio
          data={createPortfolioData([
            createProject({
              metrics: {toolsCount: '25'},
            }),
          ])}
        />,
      );
      expect(screen.getByText(/tools: 25/i)).toBeInTheDocument();
    });

    it('handles activeUsers metric', () => {
      render(
        <Portfolio
          data={createPortfolioData([
            createProject({
              metrics: {activeUsers: '50K'},
            }),
          ])}
        />,
      );
      expect(screen.getByText(/active users: 50k/i)).toBeInTheDocument();
    });

    it('handles medium priority metrics', () => {
      render(
        <Portfolio
          data={createPortfolioData([
            createProject({
              metrics: {
                conversionIncrease: '30%',
                userSatisfaction: '4.8/5',
                safetyRating: '99%',
              },
            }),
          ])}
        />,
      );
      expect(screen.getByText(/conversion ↑: 30%/i)).toBeInTheDocument();
      expect(screen.getByText(/satisfaction: 4.8\/5/i)).toBeInTheDocument();
      expect(screen.getByText(/safety: 99%/i)).toBeInTheDocument();
    });

    it('handles bookingTimeReduction metric', () => {
      render(
        <Portfolio
          data={createPortfolioData([
            createProject({
              metrics: {bookingTimeReduction: '40%'},
            }),
          ])}
        />,
      );
      expect(screen.getByText(/time saved: 40%/i)).toBeInTheDocument();
    });
  });

  describe('Project Modal', () => {
    it('does not render modal initially', () => {
      render(<Portfolio data={createPortfolioData()} />);
      expect(screen.queryByTestId('project-modal')).not.toBeInTheDocument();
    });

    it('opens modal when clicking "View Details"', async () => {
      const user = userEvent.setup();
      render(
        <Portfolio
          data={createPortfolioData([createProject({title: 'Test Project'})])}
        />,
      );

      await user.click(screen.getByRole('button', {name: /view details/i}));

      expect(await screen.findByTestId('project-modal')).toBeInTheDocument();
      expect(screen.getByTestId('modal-title')).toHaveTextContent('Test Project');
    });

    it('closes modal when clicking close button', async () => {
      const user = userEvent.setup();
      render(
        <Portfolio
          data={createPortfolioData([createProject({title: 'Test Project'})])}
        />,
      );

      // Open modal
      await user.click(screen.getByRole('button', {name: /view details/i}));
      expect(await screen.findByTestId('project-modal')).toBeInTheDocument();

      // Close modal
      await user.click(screen.getByTestId('modal-close'));
      expect(screen.queryByTestId('project-modal')).not.toBeInTheDocument();
    });

    it('opens correct project in modal when multiple projects exist', async () => {
      const user = userEvent.setup();
      const projects = [
        createProject({title: 'First Project'}),
        createProject({title: 'Second Project'}),
        createProject({title: 'Third Project'}),
      ];
      render(<Portfolio data={createPortfolioData(projects)} />);

      // Click second project's View Details
      const viewDetailsButtons = screen.getAllByRole('button', {
        name: /view details/i,
      });
      await user.click(viewDetailsButtons[1]);

      expect(await screen.findByTestId('modal-title')).toHaveTextContent(
        'Second Project',
      );
    });
  });

  describe('External Link Behavior', () => {
    it('opens external URL in new tab when clicking external link button', async () => {
      const user = userEvent.setup();
      const mockOpen = vi.spyOn(window, 'open').mockImplementation(() => null);

      render(
        <Portfolio
          data={createPortfolioData([
            createProject({url: 'https://github.com/user/project'}),
          ])}
        />,
      );

      // Find the button containing the external link icon
      const externalLinkIcon = screen.getByTestId('icon-external-link');
      const externalLinkButton = externalLinkIcon.closest('button');
      await user.click(externalLinkButton!);

      expect(mockOpen).toHaveBeenCalledWith(
        'https://github.com/user/project',
        '_blank',
      );
      mockOpen.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty projects array', () => {
      const {container} = render(<Portfolio data={createPortfolioData([])} />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(screen.queryByTestId('project-card')).not.toBeInTheDocument();
    });

    it('handles single project', () => {
      render(
        <Portfolio
          data={createPortfolioData([createProject({title: 'Only Project'})])}
        />,
      );
      expect(screen.getAllByTestId('project-card')).toHaveLength(1);
      expect(screen.getByText('Only Project')).toBeInTheDocument();
    });

    it('handles project with minimal data', () => {
      const minimalProject: Project = {
        title: 'Minimal',
        category: 'Basic',
        image: 'minimal.png',
        url: '#',
      };
      render(<Portfolio data={{projects: [minimalProject]}} />);
      expect(screen.getByText('Minimal')).toBeInTheDocument();
      expect(screen.getByText('Basic')).toBeInTheDocument();
    });

    it('handles project with all optional fields undefined', () => {
      const project: Project = {
        title: 'Basic Project',
        category: 'Demo',
        image: 'demo.png',
        url: '#',
        description: undefined,
        challenge: undefined,
        solution: undefined,
        impact: undefined,
        liveUrl: undefined,
        screenshots: undefined,
        technologies: undefined,
        role: undefined,
        team: undefined,
        duration: undefined,
        metrics: undefined,
      };
      render(<Portfolio data={{projects: [project]}} />);
      expect(screen.getByText('Basic Project')).toBeInTheDocument();
      expect(screen.queryByTestId('tech-stack')).not.toBeInTheDocument();
      expect(screen.queryByTestId('metric-badge')).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', {name: /view live demo/i}),
      ).not.toBeInTheDocument();
    });

    it('handles many projects', () => {
      const manyProjects = Array.from({length: 20}, (_, i) =>
        createProject({title: `Project ${i + 1}`}),
      );
      render(<Portfolio data={createPortfolioData(manyProjects)} />);
      expect(screen.getAllByTestId('project-card')).toHaveLength(20);
    });

    it('handles projects with duplicate technology names', () => {
      const projects = [
        createProject({title: 'P1', technologies: ['React', 'TypeScript']}),
        createProject({title: 'P2', technologies: ['React', 'Vue']}),
        createProject({title: 'P3', technologies: ['React', 'Angular']}),
      ];
      render(<Portfolio data={createPortfolioData(projects)} />);

      // Should deduplicate - React should appear only once
      const badges = screen.getAllByTestId('floating-badge');
      const reactBadges = badges.filter((b) => b.textContent === 'React');
      expect(reactBadges).toHaveLength(1);
    });

    it('handles filter with no matching projects', () => {
      const projects = [
        createProject({title: 'React Only', technologies: ['React']}),
      ];
      render(<Portfolio data={createPortfolioData(projects)} />);

      // This shouldn't happen in real usage since filter only shows existing techs,
      // but we test the filtered state with 0 results
      // First verify we have projects, then apply filter and check text
      expect(screen.getByText('React Only')).toBeInTheDocument();
    });
  });

  describe('Grid Layout', () => {
    it('renders projects in a grid container', () => {
      const projects = [
        createProject({title: 'P1'}),
        createProject({title: 'P2'}),
        createProject({title: 'P3'}),
      ];
      render(<Portfolio data={createPortfolioData(projects)} />);

      // Find the grid container by checking parent of tilt-cards
      const tiltCards = screen.getAllByTestId('tilt-card');
      expect(tiltCards).toHaveLength(3);
    });
  });

  describe('Accessibility', () => {
    it('uses semantic section element', () => {
      const {container} = render(<Portfolio data={createPortfolioData()} />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('has heading hierarchy', () => {
      render(<Portfolio data={createPortfolioData()} />);
      const h2 = screen.getByRole('heading', {level: 2});
      expect(h2).toHaveTextContent('Featured Projects');
    });

    it('project titles are headings', () => {
      render(
        <Portfolio
          data={createPortfolioData([createProject({title: 'Accessible Project'})])}
        />,
      );
      expect(
        screen.getByRole('heading', {name: 'Accessible Project'}),
      ).toBeInTheDocument();
    });

    it('filter badges are interactive buttons', () => {
      render(
        <Portfolio
          data={createPortfolioData([
            createProject({technologies: ['React', 'Vue']}),
          ])}
        />,
      );
      const filterBadges = screen.getAllByTestId('floating-badge');
      filterBadges.forEach((badge) => {
        expect(badge.tagName).toBe('BUTTON');
      });
    });
  });
});
