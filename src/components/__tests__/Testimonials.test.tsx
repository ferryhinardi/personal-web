import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {render, screen, fireEvent, act} from '@testing-library/react';
import Testimonials from '../Testimonials';
import type {Testimonials as TestimonialsData} from '@/types/resume.types';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({children, ...props}: any) => <div {...props}>{children}</div>,
    section: ({children, ...props}: any) => <section {...props}>{children}</section>,
  },
  AnimatePresence: ({children}: any) => <>{children}</>,
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Quote: () => <span data-testid="quote-icon">Quote</span>,
  ChevronLeft: () => <span data-testid="chevron-left-icon">ChevronLeft</span>,
  ChevronRight: () => <span data-testid="chevron-right-icon">ChevronRight</span>,
  LinkedinIcon: () => <span data-testid="linkedin-icon">LinkedIn</span>,
  Briefcase: () => <span data-testid="briefcase-icon">Briefcase</span>,
}));

// Mock Radix UI Card
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

// Mock Button
vi.mock('@/components/ui/button', () => ({
  Button: ({children, onClick, ...props}: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

// Mock Avatar
vi.mock('@/components/ui/avatar', () => ({
  Avatar: ({children, className}: any) => (
    <div data-testid="avatar" className={className}>
      {children}
    </div>
  ),
}));

describe('Testimonials Component', () => {
  const mockTestimonials: TestimonialsData = {
    testimonials: [
      {
        text: 'Great developer and team player!',
        user: 'John Doe',
        title: 'Engineering Manager',
        company: 'Tech Corp',
        image: '/images/john.jpg',
        linkedin: 'https://linkedin.com/in/johndoe',
        relationship: 'Worked together at Tech Corp',
      },
      {
        text: 'Excellent problem-solving skills.',
        user: 'Jane Smith',
        title: 'Senior Developer',
        company: 'Startup Inc',
        image: '/images/jane.jpg',
        linkedin: 'https://linkedin.com/in/janesmith',
        relationship: 'Collaborated on multiple projects',
      },
      {
        text: 'Highly recommend for any project.',
        user: 'Bob Wilson',
        title: 'CTO',
        company: 'Innovation Labs',
      },
    ],
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('returns null when data is undefined', () => {
      const {container} = render(<Testimonials />);
      expect(container.firstChild).toBeNull();
    });

    it('returns null when data is not provided', () => {
      const {container} = render(<Testimonials data={undefined} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders without crashing with valid data', () => {
      render(<Testimonials data={mockTestimonials} />);
      expect(screen.getByText('Testimonials')).toBeInTheDocument();
    });

    it('renders section title and subtitle', () => {
      render(<Testimonials data={mockTestimonials} />);
      expect(screen.getByText('Testimonials')).toBeInTheDocument();
      expect(
        screen.getByText(
          'What colleagues and collaborators say about working with me',
        ),
      ).toBeInTheDocument();
    });

    it('renders quote icon in header', () => {
      render(<Testimonials data={mockTestimonials} />);
      const quoteIcons = screen.getAllByTestId('quote-icon');
      expect(quoteIcons.length).toBeGreaterThan(0);
    });
  });

  describe('Testimonial Display', () => {
    it('displays the first testimonial initially', () => {
      render(<Testimonials data={mockTestimonials} />);
      expect(
        screen.getByText('"Great developer and team player!"'),
      ).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('displays testimonial quote text', () => {
      render(<Testimonials data={mockTestimonials} />);
      expect(
        screen.getByText('"Great developer and team player!"'),
      ).toBeInTheDocument();
    });

    it('displays user name', () => {
      render(<Testimonials data={mockTestimonials} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('displays title and company', () => {
      render(<Testimonials data={mockTestimonials} />);
      // Text is split across elements: "Engineering Manager at <span>Tech Corp</span>"
      expect(
        screen.getByText((_content, element) => {
          return (
            element?.tagName.toLowerCase() === 'span' &&
            element?.textContent?.includes('Engineering Manager') &&
            element?.textContent?.includes('Tech Corp')
          );
        }),
      ).toBeInTheDocument();
    });

    it('displays relationship text', () => {
      render(<Testimonials data={mockTestimonials} />);
      expect(
        screen.getByText('Worked together at Tech Corp'),
      ).toBeInTheDocument();
    });

    it('displays LinkedIn link when provided', () => {
      render(<Testimonials data={mockTestimonials} />);
      const linkedinLink = screen.getByText('View LinkedIn Profile');
      expect(linkedinLink).toBeInTheDocument();
      expect(linkedinLink.closest('a')).toHaveAttribute(
        'href',
        'https://linkedin.com/in/johndoe',
      );
    });

    it('opens LinkedIn link in new tab', () => {
      render(<Testimonials data={mockTestimonials} />);
      const linkedinLink = screen.getByText('View LinkedIn Profile').closest('a');
      expect(linkedinLink).toHaveAttribute('target', '_blank');
      expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('displays profile image when provided', () => {
      render(<Testimonials data={mockTestimonials} />);
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toBeInTheDocument();
      const img = avatar.querySelector('img');
      expect(img).toHaveAttribute('src', '/images/john.jpg');
      expect(img).toHaveAttribute('alt', 'John Doe');
    });

    it('displays briefcase icon with title/company', () => {
      render(<Testimonials data={mockTestimonials} />);
      expect(screen.getByTestId('briefcase-icon')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('renders previous button with aria-label', () => {
      render(<Testimonials data={mockTestimonials} />);
      const prevButton = screen.getByRole('button', {
        name: 'Previous testimonial',
      });
      expect(prevButton).toBeInTheDocument();
    });

    it('renders next button with aria-label', () => {
      render(<Testimonials data={mockTestimonials} />);
      const nextButton = screen.getByRole('button', {
        name: 'Next testimonial',
      });
      expect(nextButton).toBeInTheDocument();
    });

    it('navigates to next testimonial on next button click', () => {
      render(<Testimonials data={mockTestimonials} />);
      const nextButton = screen.getByRole('button', {
        name: 'Next testimonial',
      });

      fireEvent.click(nextButton);

      expect(
        screen.getByText('"Excellent problem-solving skills."'),
      ).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('navigates to previous testimonial on prev button click', () => {
      render(<Testimonials data={mockTestimonials} />);
      const prevButton = screen.getByRole('button', {
        name: 'Previous testimonial',
      });

      // Go to previous (wraps to last)
      fireEvent.click(prevButton);

      expect(
        screen.getByText('"Highly recommend for any project."'),
      ).toBeInTheDocument();
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    });

    it('wraps around when navigating past the last testimonial', () => {
      render(<Testimonials data={mockTestimonials} />);
      const nextButton = screen.getByRole('button', {
        name: 'Next testimonial',
      });

      // Click 3 times to wrap around
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);

      expect(
        screen.getByText('"Great developer and team player!"'),
      ).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('wraps around when navigating before the first testimonial', () => {
      render(<Testimonials data={mockTestimonials} />);
      const prevButton = screen.getByRole('button', {
        name: 'Previous testimonial',
      });

      fireEvent.click(prevButton);

      expect(
        screen.getByText('"Highly recommend for any project."'),
      ).toBeInTheDocument();
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    });
  });

  describe('Dot Indicators', () => {
    it('renders dot indicators for each testimonial', () => {
      render(<Testimonials data={mockTestimonials} />);
      const dots = screen.getAllByRole('button', {name: /Go to testimonial/});
      expect(dots).toHaveLength(3);
    });

    it('navigates to specific testimonial when dot is clicked', () => {
      render(<Testimonials data={mockTestimonials} />);
      const dot3 = screen.getByRole('button', {name: 'Go to testimonial 3'});

      fireEvent.click(dot3);

      expect(
        screen.getByText('"Highly recommend for any project."'),
      ).toBeInTheDocument();
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    });

    it('dots have correct aria-labels', () => {
      render(<Testimonials data={mockTestimonials} />);
      expect(
        screen.getByRole('button', {name: 'Go to testimonial 1'}),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', {name: 'Go to testimonial 2'}),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', {name: 'Go to testimonial 3'}),
      ).toBeInTheDocument();
    });
  });

  describe('Auto-play', () => {
    it('auto-advances to next testimonial after 5 seconds', () => {
      render(<Testimonials data={mockTestimonials} />);

      // Initially shows first testimonial
      expect(
        screen.getByText('"Great developer and team player!"'),
      ).toBeInTheDocument();

      // Advance timer by 5 seconds
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Should now show second testimonial
      expect(
        screen.getByText('"Excellent problem-solving skills."'),
      ).toBeInTheDocument();
    });

    it('continues auto-advancing through all testimonials', () => {
      render(<Testimonials data={mockTestimonials} />);

      // Advance to second
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();

      // Advance to third
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument();

      // Advance back to first (wraps)
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('resets timer when manually navigating', () => {
      render(<Testimonials data={mockTestimonials} />);
      const nextButton = screen.getByRole('button', {
        name: 'Next testimonial',
      });

      // Advance 3 seconds
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      // Manually navigate
      fireEvent.click(nextButton);
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();

      // Advance another 3 seconds (timer should have reset)
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      // Should still be on Jane Smith (timer reset)
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();

      // Advance full 5 seconds from manual navigation
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // Now should advance to Bob Wilson
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    });
  });

  describe('Optional Fields', () => {
    it('handles testimonial without image', () => {
      const dataWithoutImage: TestimonialsData = {
        testimonials: [
          {
            text: 'No image testimonial',
            user: 'No Image Person',
          },
        ],
      };

      render(<Testimonials data={dataWithoutImage} />);
      expect(screen.getByText('"No image testimonial"')).toBeInTheDocument();
      expect(screen.queryByTestId('avatar')).not.toBeInTheDocument();
    });

    it('handles testimonial without LinkedIn', () => {
      const dataWithoutLinkedin: TestimonialsData = {
        testimonials: [
          {
            text: 'No LinkedIn testimonial',
            user: 'No LinkedIn Person',
            title: 'Developer',
          },
        ],
      };

      render(<Testimonials data={dataWithoutLinkedin} />);
      expect(screen.queryByText('View LinkedIn Profile')).not.toBeInTheDocument();
    });

    it('handles testimonial without relationship', () => {
      const dataWithoutRelationship: TestimonialsData = {
        testimonials: [
          {
            text: 'No relationship testimonial',
            user: 'Person',
            title: 'Manager',
            company: 'Company',
          },
        ],
      };

      render(<Testimonials data={dataWithoutRelationship} />);
      expect(screen.getByText('Person')).toBeInTheDocument();
      // No relationship text should be rendered
    });

    it('handles testimonial with only title (no company)', () => {
      const dataWithTitleOnly: TestimonialsData = {
        testimonials: [
          {
            text: 'Title only testimonial',
            user: 'Title Person',
            title: 'Senior Engineer',
          },
        ],
      };

      render(<Testimonials data={dataWithTitleOnly} />);
      expect(screen.getByText('Senior Engineer')).toBeInTheDocument();
    });

    it('handles testimonial with only company (no title)', () => {
      const dataWithCompanyOnly: TestimonialsData = {
        testimonials: [
          {
            text: 'Company only testimonial',
            user: 'Company Person',
            company: 'Big Corp',
          },
        ],
      };

      render(<Testimonials data={dataWithCompanyOnly} />);
      expect(screen.getByText('Big Corp')).toBeInTheDocument();
    });
  });

  describe('Single Testimonial', () => {
    it('renders correctly with single testimonial', () => {
      const singleTestimonial: TestimonialsData = {
        testimonials: [
          {
            text: 'Only one testimonial',
            user: 'Solo Person',
          },
        ],
      };

      render(<Testimonials data={singleTestimonial} />);
      expect(screen.getByText('"Only one testimonial"')).toBeInTheDocument();
      expect(screen.getByText('Solo Person')).toBeInTheDocument();
    });

    it('renders single dot indicator with one testimonial', () => {
      const singleTestimonial: TestimonialsData = {
        testimonials: [
          {
            text: 'Only one testimonial',
            user: 'Solo Person',
          },
        ],
      };

      render(<Testimonials data={singleTestimonial} />);
      const dots = screen.getAllByRole('button', {name: /Go to testimonial/});
      expect(dots).toHaveLength(1);
    });

    it('wraps to same testimonial with single item', () => {
      const singleTestimonial: TestimonialsData = {
        testimonials: [
          {
            text: 'Only one testimonial',
            user: 'Solo Person',
          },
        ],
      };

      render(<Testimonials data={singleTestimonial} />);
      const nextButton = screen.getByRole('button', {
        name: 'Next testimonial',
      });

      fireEvent.click(nextButton);

      // Should still show same testimonial
      expect(screen.getByText('"Only one testimonial"')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('uses blockquote element for testimonial text', () => {
      render(<Testimonials data={mockTestimonials} />);
      const blockquote = document.querySelector('blockquote');
      expect(blockquote).toBeInTheDocument();
      expect(blockquote?.textContent).toContain(
        'Great developer and team player!',
      );
    });

    it('uses cite element for attribution', () => {
      render(<Testimonials data={mockTestimonials} />);
      const cite = document.querySelector('cite');
      expect(cite).toBeInTheDocument();
    });

    it('has proper section id for navigation', () => {
      render(<Testimonials data={mockTestimonials} />);
      const section = document.querySelector('#testimonials');
      expect(section).toBeInTheDocument();
    });
  });
});
