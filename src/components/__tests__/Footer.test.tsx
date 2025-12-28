import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

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

describe('Footer Component', () => {
  it('renders without crashing', () => {
    render(<Footer data={mockData} />);
    const footer = document.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });

  it('displays the copyright year', () => {
    render(<Footer data={mockData} />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
  });

  it('displays author name in copyright', () => {
    render(<Footer data={mockData} />);
    expect(screen.getByText(/Ferry Hinardi/)).toBeInTheDocument();
  });

  it('renders back to top button', () => {
    render(<Footer data={mockData} />);
    const backToTop = screen.getByRole('button', { name: /back to top/i });
    expect(backToTop).toBeInTheDocument();
  });
});
