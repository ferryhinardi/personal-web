import {describe, it, expect, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import About from '../About';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    section: ({children, ...props}: any) => <section {...props}>{children}</section>,
    div: ({children, ...props}: any) => <div {...props}>{children}</div>,
  },
}));

// Mock html-react-parser
vi.mock('html-react-parser', () => ({
  default: (html: string) => <span data-testid="parsed-html">{html}</span>,
}));

// Mock UI components
vi.mock('@/components/ui/tilt-card', () => ({
  TiltCard: ({children}: any) => <div data-testid="tilt-card">{children}</div>,
}));

vi.mock('@/components/ui/optimized-image', () => ({
  OptimizedImage: ({alt}: any) => <img alt={alt} data-testid="optimized-image" />,
}));

vi.mock('@/components/ui/animated-counter', () => ({
  AnimatedCounter: ({value, suffix}: any) => (
    <span data-testid="animated-counter">
      {value}
      {suffix}
    </span>
  ),
}));

vi.mock('@/components/ui/floating-badge', () => ({
  FloatingBadge: ({children}: any) => <span data-testid="floating-badge">{children}</span>,
}));

vi.mock('@/components/ui/section-transition', () => ({
  SectionTransition: () => <div data-testid="section-transition" />,
}));

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

vi.mock('@/components/ui/button', () => ({
  Button: ({children, asChild, ...props}: any) => {
    if (asChild) {
      return <>{children}</>;
    }
    return <button {...props}>{children}</button>;
  },
}));

vi.mock('@/components/ui/separator', () => ({
  Separator: () => <hr data-testid="separator" />,
}));

// Mock useGitHubActivity hook
vi.mock('@/hooks/useGitHubActivity', () => ({
  useGitHubActivity: () => ({
    stats: {
      publicRepos: 15,
      totalStars: 100,
      followers: 200,
    },
    loading: false,
    error: null,
  }),
}));

const mockData = {
  name: 'Ferry Hinardi',
  occupation: 'Software Engineer',
  description: 'Test description',
  image: 'profilepic.jpg',
  bio: 'I am a passionate software engineer with expertise in web development.',
  contactmessage: 'Get in touch',
  email: 'test@example.com',
  phone: '123-456-7890',
  address: {
    street: '123 Test St',
    city: 'Jakarta',
    state: 'Indonesia',
    zip: '12345',
  },
  website: 'https://example.com',
  resumedownload: 'resume.pdf',
  social: [],
};

describe('About Component', () => {
  it('renders without crashing', () => {
    render(<About data={mockData} />);
    expect(screen.getByText('About Me')).toBeInTheDocument();
  });

  it('displays the bio', () => {
    render(<About data={mockData} />);
    expect(screen.getByText(/passionate software engineer/i)).toBeInTheDocument();
  });

  it('displays contact information', () => {
    render(<About data={mockData} />);
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('displays location', () => {
    render(<About data={mockData} />);
    expect(screen.getByText(/Jakarta, Indonesia/)).toBeInTheDocument();
  });

  it('renders download resume button', () => {
    render(<About data={mockData} />);
    const downloadButton = screen.getByRole('link', {name: /get my resume/i});
    expect(downloadButton).toBeInTheDocument();
    expect(downloadButton).toHaveAttribute('href', 'resume.pdf');
  });

  it('renders without data gracefully', () => {
    const {container} = render(<About />);
    // Component returns null when no data is provided
    expect(container).toBeEmptyDOMElement();
  });
});
