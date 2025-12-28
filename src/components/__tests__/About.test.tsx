import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import About from '../About';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
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

describe.skip('About Component', () => {
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
    expect(screen.getByText('123-456-7890')).toBeInTheDocument();
  });

  it('displays location', () => {
    render(<About data={mockData} />);
    expect(screen.getByText(/Jakarta, Indonesia/)).toBeInTheDocument();
  });

  it('renders download resume button', () => {
    render(<About data={mockData} />);
    const downloadButton = screen.getByRole('link', { name: /download resume/i });
    expect(downloadButton).toBeInTheDocument();
    expect(downloadButton).toHaveAttribute('href', 'resume.pdf');
  });

  it('renders without data gracefully', () => {
    render(<About />);
    expect(document.querySelector('section')).toBeInTheDocument();
  });
});
