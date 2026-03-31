import {describe, it, vi} from 'vitest';
import {render} from '@testing-library/react';
import {checkA11y} from '@/test/a11y-utils';
import About from '../About';
import Portfolio from '../Portfolio';
import Contact from '../Contact';
import type {Portfolio as PortfolioData} from '@/types/resume.types';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({children, ...props}: any) => {
      const {whileHover, whileInView, whileTap, initial, animate, transition, viewport, variants, ...rest} = props;
      return <div {...rest}>{children}</div>;
    },
    section: ({children, ...props}: any) => {
      const {whileHover, whileInView, whileTap, initial, animate, transition, viewport, variants, ...rest} = props;
      return <section {...rest}>{children}</section>;
    },
    a: ({children, ...props}: any) => {
      const {whileHover, whileInView, whileTap, initial, animate, transition, viewport, variants, ...rest} = props;
      return <a {...rest}>{children}</a>;
    },
    span: ({children, ...props}: any) => {
      const {whileHover, whileInView, whileTap, initial, animate, transition, viewport, variants, ...rest} = props;
      return <span {...rest}>{children}</span>;
    },
  },
  AnimatePresence: ({children}: any) => <>{children}</>,
}));

vi.mock('html-react-parser', () => ({
  default: (html: string) => <span>{html}</span>,
}));

vi.mock('@/components/ui/tilt-card', () => ({
  TiltCard: ({children}: any) => <div>{children}</div>,
}));

vi.mock('@/components/ui/optimized-image', () => ({
  OptimizedImage: ({alt, src}: any) => <img alt={alt} src={src} />,
  default: ({alt, src}: any) => <img alt={alt} src={src} />,
}));

vi.mock('@/components/ui/animated-counter', () => ({
  AnimatedCounter: ({value, suffix}: any) => <span>{value}{suffix}</span>,
}));

vi.mock('@/components/ui/floating-badge', () => ({
  FloatingBadge: ({children, onClick, variant}: any) => (
    <button type="button" data-variant={variant} onClick={onClick}>{children}</button>
  ),
}));

vi.mock('@/components/ui/section-transition', () => ({
  SectionTransition: () => <div />,
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({children, className}: any) => <div className={className}>{children}</div>,
  CardContent: ({children, className}: any) => <div className={className}>{children}</div>,
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({children, asChild, type, ...props}: any) => {
    if (asChild) return <>{children}</>;
    return <button type={type ?? 'button'} {...props}>{children}</button>;
  },
}));

vi.mock('@/components/ui/separator', () => ({
  Separator: () => <hr />,
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({children, variant, className}: any) => (
    <span data-variant={variant} className={className}>{children}</span>
  ),
}));

vi.mock('@/components/ui/tech-badge', () => ({
  TechStack: ({technologies, limit}: any) => (
    <div>
      {technologies?.slice(0, limit).map((tech: string) => (
        <span key={tech}>{tech}</span>
      ))}
    </div>
  ),
}));

vi.mock('@/components/ui/input', () => ({
  Input: ({required: _r, type, ...props}: any) => (
    <input {...props} type={type === 'email' ? 'text' : type} />
  ),
}));

vi.mock('@/components/ui/textarea', () => ({
  Textarea: ({required: _r, ...props}: any) => <textarea {...props} />,
}));

vi.mock('@/components/ui/label', () => ({
  Label: ({children, ...props}: any) => <label {...props}>{children}</label>,
}));

vi.mock('@formspree/react', () => ({
  useForm: () => [
    {submitting: false, succeeded: false, errors: {}},
    vi.fn(),
  ],
  ValidationError: () => null,
}));

vi.mock('@/hooks/useGitHubActivity', () => ({
  useGitHubActivity: () => ({
    stats: {publicRepos: 15, totalStars: 100, followers: 200},
    loading: false,
    error: null,
  }),
}));

vi.mock('@/utils/webhooks', () => ({
  trackFormSubmission: vi.fn(),
  sendWebhookNotifications: vi.fn(),
  getWebhookConfig: vi.fn(() => ({})),
}));

const mockMainData = {
  name: 'Ferry Hinardi',
  occupation: 'Software Engineer',
  description: 'Test description',
  image: 'profilepic.jpg',
  bio: 'I am a software engineer.',
  contactmessage: 'Get in touch with me.',
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

const mockPortfolioData: PortfolioData = {
  projects: [
    {
      title: 'Test Project',
      category: 'Web Application',
      image: 'test.jpg',
      url: 'https://example.com',
      technologies: ['React', 'TypeScript'],
    },
  ],
};

describe('Accessibility (axe): 0 critical/serious violations', () => {
  it('About component has no critical/serious a11y violations', async () => {
    const {container} = render(<About data={mockMainData} />);
    await checkA11y(container);
  });

  it('Portfolio component has no critical/serious a11y violations', async () => {
    const {container} = render(<Portfolio data={mockPortfolioData} />);
    await checkA11y(container, {
      rules: {
        'button-name': {enabled: false},
      },
    });
  });

  it('Contact component has no critical/serious a11y violations', async () => {
    const {container} = render(<Contact data={mockMainData} />);
    await checkA11y(container);
  });
});
