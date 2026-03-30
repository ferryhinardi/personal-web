import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import LinksPage from '../LinksPage';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({children, ...props}: any) => <div {...props}>{children}</div>,
    a: ({children, ...props}: any) => <a {...props}>{children}</a>,
    main: ({children, ...props}: any) => <main {...props}>{children}</main>,
  },
  AnimatePresence: ({children}: any) => <>{children}</>,
}));

// Mock react-router-dom Link (keep MemoryRouter for full render)
vi.mock('@/components/SEOHead', () => ({
  default: () => null,
}));

// Mock PageLayout to avoid nested router/hook complexity
vi.mock('@/layouts/PageLayout', () => ({
  default: ({children}: any) => <div data-testid="page-layout">{children}</div>,
}));

// Mock useResumeData hook — LinksPage uses it for profile header
vi.mock('@/hooks/useResumeData', () => ({
  useResumeData: () => ({
    data: {
      main: {
        name: 'Ferry Hinardi',
        occupation: 'Software Engineer',
        image: 'profilepic.jpg',
        social: [],
      },
    },
    loading: false,
    error: null,
  }),
}));

// Mock Skeleton component
vi.mock('@/components/ui/skeleton', () => ({
  Skeleton: ({className}: any) => <div data-testid="skeleton" className={className} />,
}));

// Mock ErrorDisplay component
vi.mock('@/components/ui/error', () => ({
  ErrorDisplay: ({title, message}: any) => (
    <div data-testid="error-display">
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  ),
}));

// Mock animation utilities
vi.mock('@/utils/animations', () => ({
  staggerContainer: {},
  staggerItem: {},
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Globe: () => <svg data-testid="icon-globe" />,
  Github: () => <svg data-testid="icon-github" />,
  Linkedin: () => <svg data-testid="icon-linkedin" />,
  Twitter: () => <svg data-testid="icon-twitter" />,
  Instagram: () => <svg data-testid="icon-instagram" />,
  Mail: () => <svg data-testid="icon-mail" />,
  ExternalLink: () => <svg data-testid="icon-external-link" />,
}));

const mockLinksData = {
  links: [
    {
      title: 'My GitHub',
      url: 'https://github.com/ferryhinardi',
      icon: 'github',
      description: 'Check out my open source projects',
    },
    {
      title: 'LinkedIn Profile',
      url: 'https://linkedin.com/in/ferryhinardi',
      icon: 'linkedin',
      description: 'Connect with me professionally',
    },
    {
      title: 'Personal Website',
      url: 'https://ferryhinardi.com',
      icon: 'globe',
    },
  ],
};

function renderWithRouter() {
  return render(
    <MemoryRouter>
      <LinksPage />
    </MemoryRouter>,
  );
}

describe('LinksPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Loading state', () => {
    it('renders loading skeletons while fetch is pending', () => {
      // Return a never-resolving promise to keep loading state
      vi.spyOn(global, 'fetch').mockReturnValue(new Promise(() => {}));

      renderWithRouter();

      const skeletons = screen.getAllByTestId('skeleton');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('Success state', () => {
    it('renders link titles after fetch succeeds', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => mockLinksData,
      } as Response);

      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText('My GitHub')).toBeInTheDocument();
      });

      expect(screen.getByText('LinkedIn Profile')).toBeInTheDocument();
      expect(screen.getByText('Personal Website')).toBeInTheDocument();
    });

    it('renders link href attributes with correct URLs', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => mockLinksData,
      } as Response);

      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText('My GitHub')).toBeInTheDocument();
      });

      const githubLink = screen.getByRole('link', {name: /my github/i});
      expect(githubLink).toHaveAttribute('href', 'https://github.com/ferryhinardi');
    });

    it('renders link descriptions when provided', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => mockLinksData,
      } as Response);

      renderWithRouter();

      await waitFor(() => {
        expect(
          screen.getByText('Check out my open source projects'),
        ).toBeInTheDocument();
      });

      expect(
        screen.getByText('Connect with me professionally'),
      ).toBeInTheDocument();
    });
  });

  describe('Error state', () => {
    it('renders error display when fetch fails', async () => {
      vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));

      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByTestId('error-display')).toBeInTheDocument();
      });

      expect(screen.getByText('Failed to load links')).toBeInTheDocument();
    });

    it('shows error message when fetch rejects', async () => {
      vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));

      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByTestId('error-display')).toBeInTheDocument();
      });

      expect(
        screen.getByText('Could not fetch your links. Please try again later.'),
      ).toBeInTheDocument();
    });
  });

  describe('Page structure', () => {
    it('wraps content in PageLayout', () => {
      vi.spyOn(global, 'fetch').mockReturnValue(new Promise(() => {}));

      renderWithRouter();

      expect(screen.getByTestId('page-layout')).toBeInTheDocument();
    });
  });
});
