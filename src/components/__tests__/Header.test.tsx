import {describe, it, expect, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import {ThemeProvider} from '@/contexts/ThemeContext';
import Header from '../Header';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    header: ({children, ...props}: any) => <header {...props}>{children}</header>,
    nav: ({children, ...props}: any) => <nav {...props}>{children}</nav>,
    div: ({children, ref, ...props}: any) => <div {...props}>{children}</div>,
    h1: ({children, ...props}: any) => <h1 {...props}>{children}</h1>,
    h2: ({children, ...props}: any) => <h2 {...props}>{children}</h2>,
    h3: ({children, ...props}: any) => <h3 {...props}>{children}</h3>,
    p: ({children, ...props}: any) => <p {...props}>{children}</p>,
    a: ({children, ...props}: any) => <a {...props}>{children}</a>,
    span: ({children, ...props}: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({children}: any) => children,
}));

// Mock react-type-animation
vi.mock('react-type-animation', () => ({
  TypeAnimation: ({sequence}: any) => <span>{sequence[0]}</span>,
}));

// Mock hero components
vi.mock('@/components/hero', () => ({
  ParallaxBackground: () => <div data-testid="parallax-background" />,
  FloatingShapes: () => <div data-testid="floating-shapes" />,
  AnimatedText: ({text, className}: any) => <span className={className}>{text}</span>,
}));

// Mock UI components
vi.mock('@/components/ui/sheet', () => ({
  Sheet: ({children}: any) => <div>{children}</div>,
  SheetContent: ({children}: any) => <div>{children}</div>,
  SheetTrigger: ({children}: any) => <div>{children}</div>,
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({children, ...props}: any) => <button {...props}>{children}</button>,
}));

vi.mock('@/components/ui/interactive-badge', () => ({
  InteractiveBadge: ({data}: any) => (
    <div data-testid="interactive-badge">{data?.name}</div>
  ),
}));

vi.mock('@/components/ui/MagneticButton', () => ({
  MagneticButton: ({children, onClick, className}: any) => (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  ),
}));

// Mock hooks
vi.mock('@/hooks/useDarkMode', () => ({
  useDarkMode: () => ({isDark: false, toggleDarkMode: vi.fn()}),
}));

vi.mock('@/hooks/useParallax', () => ({
  useFadeOnScroll: () => ({ref: {current: null}, y: 0, opacity: 1}),
}));

// Helper to render with Router context
const renderWithRouter = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{ui}</ThemeProvider>
    </BrowserRouter>,
  );
};

const mockData = {
  name: 'Ferry Hinardi',
  occupation: 'Software Engineer',
  description: 'Test description',
  image: 'test.jpg',
  bio: 'Test bio',
  contactmessage: 'Get in touch',
  email: 'test@example.com',
  phone: '123-456-7890',
  address: {
    street: '123 Test St',
    city: 'Test City',
    state: 'Test State',
    zip: '12345',
  },
  website: 'https://example.com',
  resumedownload: 'resume.pdf',
  social: [
    {name: 'linkedin', url: 'https://linkedin.com/test', className: 'fa fa-linkedin'},
    {name: 'github', url: 'https://github.com/test', className: 'fa fa-github'},
  ],
};

describe('Header Component', () => {
  it('renders without crashing', () => {
    renderWithRouter(<Header data={mockData} />);
    expect(screen.getAllByText('Ferry Hinardi').length).toBeGreaterThan(0);
  });

  it('displays the typing animation text', () => {
    renderWithRouter(<Header data={mockData} />);
    // TypeAnimation mock renders the first sequence item
    expect(screen.getByText('Crafting Digital Experiences')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderWithRouter(<Header data={mockData} />);
    // The nav has: Home, About, Resume, Works, Contact
    expect(screen.getAllByText('Home').length).toBeGreaterThan(0);
    expect(screen.getAllByText('About').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Resume').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Works').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Contact').length).toBeGreaterThan(0);
  });

  it('renders social links', () => {
    renderWithRouter(<Header data={mockData} />);
    const socialLinks = screen.getAllByRole('link');
    const hasSocialLinks = socialLinks.some(
      (link) =>
        link.getAttribute('href')?.includes('linkedin') ||
        link.getAttribute('href')?.includes('github'),
    );
    expect(hasSocialLinks).toBe(true);
  });

  it('renders nothing when data is undefined', () => {
    const {container} = renderWithRouter(<Header />);
    // Component returns null when no data
    expect(container.querySelector('header')).not.toBeInTheDocument();
  });
});
