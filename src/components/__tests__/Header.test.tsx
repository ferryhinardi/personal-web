import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from '../Header';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    header: ({ children, ...props }: any) => <header {...props}>{children}</header>,
    nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock react-type-animation
vi.mock('react-type-animation', () => ({
  TypeAnimation: ({ sequence }: any) => <span>{sequence[0]}</span>,
}));

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
    { name: 'linkedin', url: 'https://linkedin.com/test', className: 'fa fa-linkedin' },
    { name: 'github', url: 'https://github.com/test', className: 'fa fa-github' },
  ],
};

describe.skip('Header Component', () => {
  it('renders without crashing', () => {
    render(<Header data={mockData} />);
    expect(screen.getByText('Ferry Hinardi')).toBeInTheDocument();
  });

  it('displays the occupation', () => {
    render(<Header data={mockData} />);
    expect(screen.getByText(/Software Engineer/)).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Header data={mockData} />);
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Resume')).toBeInTheDocument();
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('renders social links', () => {
    render(<Header data={mockData} />);
    const socialLinks = screen.getAllByRole('link');
    const hasSocialLinks = socialLinks.some(link => 
      link.getAttribute('href')?.includes('linkedin') || 
      link.getAttribute('href')?.includes('github')
    );
    expect(hasSocialLinks).toBe(true);
  });

  it('renders without data gracefully', () => {
    render(<Header />);
    // Should not crash, might render with default/empty state
    expect(document.querySelector('header')).toBeInTheDocument();
  });
});
