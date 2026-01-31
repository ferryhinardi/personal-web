import {describe, it, expect, vi} from 'vitest';
import {render, screen, fireEvent} from '@testing-library/react';
import {InteractiveBadge} from '../ui/interactive-badge';
import type {MainData} from '@/types/resume.types';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({children, ...props}: any) => {
      // Filter out framer-motion specific props
      const {
        variants,
        initial,
        animate,
        whileHover,
        whileTap,
        transition,
        style,
        ...domProps
      } = props;
      return (
        <div {...domProps} style={style}>
          {children}
        </div>
      );
    },
  },
  useReducedMotion: () => false,
  AnimatePresence: ({children}: any) => children,
}));

// Mock useMousePosition hooks
vi.mock('@/hooks/useMousePosition', () => ({
  useTiltEffect: () => ({
    rotateX: 0,
    rotateY: 0,
    isHovering: false,
  }),
  useMagneticEffect: () => ({
    x: 0,
    y: 0,
  }),
}));

const mockData: MainData = {
  name: 'Ferry Hinardi',
  occupation: 'Software Engineer',
  description: 'Test description',
  image: 'test.jpg',
  bio: 'Test bio',
  contactmessage: 'Get in touch',
  email: 'ferry@example.com',
  phone: '123-456-7890',
  address: {
    street: '123 Test St',
    city: 'Jakarta',
    state: 'Indonesia',
    zip: '12345',
  },
  website: 'https://example.com',
  resumedownload: 'resume.pdf',
  social: [
    {name: 'linkedin', url: 'https://linkedin.com/in/test', className: 'fa fa-linkedin'},
    {name: 'github', url: 'https://github.com/test', className: 'fa fa-github'},
    {name: 'twitter', url: 'https://twitter.com/test', className: 'fa fa-twitter'},
  ],
};

describe('InteractiveBadge Component', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<InteractiveBadge data={mockData} />);
      expect(screen.getByText('Ferry Hinardi')).toBeInTheDocument();
    });

    it('displays the name correctly', () => {
      render(<InteractiveBadge data={mockData} />);
      expect(screen.getByText('Ferry Hinardi')).toBeInTheDocument();
    });

    it('displays the occupation correctly', () => {
      render(<InteractiveBadge data={mockData} />);
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    });

    it('shows availability indicator by default', () => {
      render(<InteractiveBadge data={mockData} />);
      expect(screen.getByText('Available for hire')).toBeInTheDocument();
    });

    it('shows custom availability text when provided', () => {
      render(
        <InteractiveBadge
          data={mockData}
          availabilityText="Open to Opportunities"
        />,
      );
      expect(screen.getByText('Open to Opportunities')).toBeInTheDocument();
    });

    it('hides availability indicator when showAvailability is false', () => {
      render(<InteractiveBadge data={mockData} showAvailability={false} />);
      expect(screen.queryByText('Available for hire')).not.toBeInTheDocument();
    });

    it('shows flip hint on front face', () => {
      render(<InteractiveBadge data={mockData} />);
      expect(screen.getByText('Click to flip')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has button role for keyboard accessibility', () => {
      render(<InteractiveBadge data={mockData} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('has appropriate aria-label', () => {
      render(<InteractiveBadge data={mockData} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute(
        'aria-label',
        expect.stringContaining('Profile badge for Ferry Hinardi'),
      );
    });

    it('is keyboard focusable with tabIndex', () => {
      render(<InteractiveBadge data={mockData} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('tabIndex', '0');
    });

    it('has aria-pressed attribute', () => {
      render(<InteractiveBadge data={mockData} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed');
    });
  });

  describe('Flip Interaction', () => {
    it('flips when clicked', () => {
      render(<InteractiveBadge data={mockData} />);
      const button = screen.getByRole('button');

      // Initially shows front face content
      expect(screen.getByText('Click to flip')).toBeInTheDocument();

      // Click to flip
      fireEvent.click(button);

      // Back face content should now be visible
      expect(screen.getByText('Click to flip back')).toBeInTheDocument();
    });

    it('shows email on back face after flip', () => {
      render(<InteractiveBadge data={mockData} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      expect(screen.getByText('ferry@example.com')).toBeInTheDocument();
    });

    it('shows location on back face after flip', () => {
      render(<InteractiveBadge data={mockData} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      expect(screen.getByText('Jakarta, Indonesia')).toBeInTheDocument();
    });

    it('flips on Enter key press', () => {
      render(<InteractiveBadge data={mockData} />);
      const button = screen.getByRole('button');

      fireEvent.keyDown(button, {key: 'Enter'});

      expect(screen.getByText('Click to flip back')).toBeInTheDocument();
    });

    it('flips on Space key press', () => {
      render(<InteractiveBadge data={mockData} />);
      const button = screen.getByRole('button');

      fireEvent.keyDown(button, {key: ' '});

      expect(screen.getByText('Click to flip back')).toBeInTheDocument();
    });

    it('toggles back to front on second click', () => {
      render(<InteractiveBadge data={mockData} />);
      const button = screen.getByRole('button');

      // First click - flip to back
      fireEvent.click(button);
      expect(screen.getByText('Click to flip back')).toBeInTheDocument();

      // Second click - flip to front
      fireEvent.click(button);
      expect(screen.getByText('Click to flip')).toBeInTheDocument();
    });
  });

  describe('Social Links', () => {
    it('renders social links on back face', () => {
      render(<InteractiveBadge data={mockData} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      // Check for social link aria-labels
      expect(screen.getByLabelText('linkedin')).toBeInTheDocument();
      expect(screen.getByLabelText('github')).toBeInTheDocument();
      expect(screen.getByLabelText('twitter')).toBeInTheDocument();
    });

    it('social links have correct href', () => {
      render(<InteractiveBadge data={mockData} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      const linkedinLink = screen.getByLabelText('linkedin');
      expect(linkedinLink).toHaveAttribute(
        'href',
        'https://linkedin.com/in/test',
      );
    });

    it('social links open in new tab', () => {
      render(<InteractiveBadge data={mockData} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      const linkedinLink = screen.getByLabelText('linkedin');
      expect(linkedinLink).toHaveAttribute('target', '_blank');
      expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('limits social links to 3', () => {
      const dataWithManySocials: MainData = {
        ...mockData,
        social: [
          {name: 'linkedin', url: 'https://linkedin.com', className: ''},
          {name: 'github', url: 'https://github.com', className: ''},
          {name: 'twitter', url: 'https://twitter.com', className: ''},
          {name: 'facebook', url: 'https://facebook.com', className: ''},
          {name: 'instagram', url: 'https://instagram.com', className: ''},
        ],
      };

      render(<InteractiveBadge data={dataWithManySocials} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      // Should show only 3 social links
      expect(screen.getByLabelText('linkedin')).toBeInTheDocument();
      expect(screen.getByLabelText('github')).toBeInTheDocument();
      expect(screen.getByLabelText('twitter')).toBeInTheDocument();
      expect(screen.queryByLabelText('facebook')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('instagram')).not.toBeInTheDocument();
    });
  });

  describe('Email Link', () => {
    it('email link has mailto href', () => {
      render(<InteractiveBadge data={mockData} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      const emailLink = screen.getByText('ferry@example.com').closest('a');
      expect(emailLink).toHaveAttribute('href', 'mailto:ferry@example.com');
    });
  });

  describe('Custom className', () => {
    it('applies custom className', () => {
      const {container} = render(
        <InteractiveBadge data={mockData} className="custom-class" />,
      );
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('custom-class');
    });
  });

  describe('Animations disabled', () => {
    it('respects disableAnimations prop', () => {
      render(<InteractiveBadge data={mockData} disableAnimations />);
      // Component should still render correctly
      expect(screen.getByText('Ferry Hinardi')).toBeInTheDocument();
    });
  });
});
