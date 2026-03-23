import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import CommandPalette from '../CommandPalette';

// Mock useDarkMode hook
vi.mock('@/hooks/useDarkMode', () => ({
  useDarkMode: () => ({
    isDark: false,
    toggleDarkMode: vi.fn(),
  }),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({children, ...props}: any) => <div {...props}>{children}</div>,
    button: ({children, ...props}: any) => (
      <button {...props}>{children}</button>
    ),
    span: ({children, ...props}: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({children}: any) => <>{children}</>,
}));

describe('CommandPalette', () => {
  let scrollToSpy: ReturnType<typeof vi.fn>;
  let openSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Mock window.scrollTo
    scrollToSpy = vi.fn();
    window.scrollTo = scrollToSpy as unknown as typeof window.scrollTo;

    // Mock window.open
    openSpy = vi.fn();
    window.open = openSpy as unknown as typeof window.open;

    // Mock getBoundingClientRect for scroll calculations
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      top: 100,
      left: 0,
      bottom: 200,
      right: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 100,
      toJSON: () => {},
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the keyboard hint badge', () => {
      render(<BrowserRouter><CommandPalette /></BrowserRouter>);

      const badge = screen.getByRole('button', {name: /open command palette/i});
      expect(badge).toBeInTheDocument();
    });

    it('does not show dialog by default', () => {
      render(<BrowserRouter><CommandPalette /></BrowserRouter>);

      expect(
        screen.queryByRole('dialog', {name: /command palette/i}),
      ).not.toBeInTheDocument();
    });
  });

  describe('Opening and Closing', () => {
    it('opens when clicking the keyboard hint badge', async () => {
      render(<BrowserRouter><CommandPalette /></BrowserRouter>);

      const badge = screen.getByRole('button', {name: /open command palette/i});
      fireEvent.click(badge);

      await waitFor(() => {
        expect(
          screen.getByRole('dialog', {name: /command palette/i}),
        ).toBeInTheDocument();
      });
    });

    it('opens with Cmd+K keyboard shortcut', async () => {
      render(<BrowserRouter><CommandPalette /></BrowserRouter>);

      fireEvent.keyDown(window, {key: 'k', metaKey: true});

      await waitFor(() => {
        expect(
          screen.getByRole('dialog', {name: /command palette/i}),
        ).toBeInTheDocument();
      });
    });

    it('opens with Ctrl+K keyboard shortcut', async () => {
      render(<BrowserRouter><CommandPalette /></BrowserRouter>);

      fireEvent.keyDown(window, {key: 'k', ctrlKey: true});

      await waitFor(() => {
        expect(
          screen.getByRole('dialog', {name: /command palette/i}),
        ).toBeInTheDocument();
      });
    });

    it('closes with Escape key', async () => {
      render(<BrowserRouter><CommandPalette /></BrowserRouter>);

      // Open first
      fireEvent.keyDown(window, {key: 'k', metaKey: true});
      await waitFor(() => {
        expect(
          screen.getByRole('dialog', {name: /command palette/i}),
        ).toBeInTheDocument();
      });

      // Close with Escape
      fireEvent.keyDown(window, {key: 'Escape'});

      await waitFor(() => {
        expect(
          screen.queryByRole('dialog', {name: /command palette/i}),
        ).not.toBeInTheDocument();
      });
    });

    it('closes when clicking backdrop', async () => {
      render(<BrowserRouter><CommandPalette /></BrowserRouter>);

      // Open first
      const badge = screen.getByRole('button', {name: /open command palette/i});
      fireEvent.click(badge);

      await waitFor(() => {
        expect(
          screen.getByRole('dialog', {name: /command palette/i}),
        ).toBeInTheDocument();
      });

      // Click backdrop using data-testid
      const backdrop = screen.getByTestId('command-palette-backdrop');
      expect(backdrop).toBeInTheDocument();
      fireEvent.click(backdrop);

      await waitFor(() => {
        expect(
          screen.queryByRole('dialog', {name: /command palette/i}),
        ).not.toBeInTheDocument();
      });
    });

    it('toggles open/close with repeated Cmd+K', async () => {
      render(<BrowserRouter><CommandPalette /></BrowserRouter>);

      // Open
      fireEvent.keyDown(window, {key: 'k', metaKey: true});
      await waitFor(() => {
        expect(
          screen.getByRole('dialog', {name: /command palette/i}),
        ).toBeInTheDocument();
      });

      // Close
      fireEvent.keyDown(window, {key: 'k', metaKey: true});
      await waitFor(() => {
        expect(
          screen.queryByRole('dialog', {name: /command palette/i}),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Command List', () => {
    it('displays navigation commands', async () => {
      render(<BrowserRouter><CommandPalette /></BrowserRouter>);

      fireEvent.keyDown(window, {key: 'k', metaKey: true});

      await waitFor(() => {
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('About')).toBeInTheDocument();
        expect(screen.getByText('Resume')).toBeInTheDocument();
        expect(screen.getByText('Works')).toBeInTheDocument();
        expect(screen.getByText('Contact')).toBeInTheDocument();
      });
    });

    it('displays action commands', async () => {
      render(<BrowserRouter><CommandPalette /></BrowserRouter>);

      fireEvent.keyDown(window, {key: 'k', metaKey: true});

      await waitFor(() => {
        expect(screen.getByText('Switch to Dark Mode')).toBeInTheDocument();
        expect(screen.getByText('Download Resume')).toBeInTheDocument();
      });
    });

    it('displays social link commands', async () => {
      render(<BrowserRouter><CommandPalette /></BrowserRouter>);

      fireEvent.keyDown(window, {key: 'k', metaKey: true});

      await waitFor(() => {
        expect(screen.getByText('Open GitHub')).toBeInTheDocument();
        expect(screen.getByText('Open LinkedIn')).toBeInTheDocument();
        expect(screen.getByText('Open Twitter')).toBeInTheDocument();
      });
    });

    it('displays category labels', async () => {
      render(<BrowserRouter><CommandPalette /></BrowserRouter>);

      fireEvent.keyDown(window, {key: 'k', metaKey: true});

      await waitFor(() => {
        expect(screen.getByText('Sections')).toBeInTheDocument();
        expect(screen.getByText('Pages')).toBeInTheDocument();
        expect(screen.getByText('Actions')).toBeInTheDocument();
        expect(screen.getByText('Social Links')).toBeInTheDocument();
      });
    });
  });

  describe('Search Filtering', () => {
    it('filters commands based on search input', async () => {
      render(<BrowserRouter><CommandPalette /></BrowserRouter>);

      fireEvent.keyDown(window, {key: 'k', metaKey: true});

      await waitFor(() => {
        expect(
          screen.getByRole('dialog', {name: /command palette/i}),
        ).toBeInTheDocument();
      });

      const input = screen.getByRole('textbox', {name: /search commands/i});
      fireEvent.change(input, {target: {value: 'github'}});

      await waitFor(() => {
        expect(screen.getByText('Open GitHub')).toBeInTheDocument();
        expect(screen.queryByText('Home')).not.toBeInTheDocument();
        expect(screen.queryByText('About')).not.toBeInTheDocument();
      });
    });

    it('filters by keywords', async () => {
      render(<BrowserRouter><CommandPalette /></BrowserRouter>);

      fireEvent.keyDown(window, {key: 'k', metaKey: true});

      await waitFor(() => {
        expect(
          screen.getByRole('dialog', {name: /command palette/i}),
        ).toBeInTheDocument();
      });

      const input = screen.getByRole('textbox', {name: /search commands/i});
      fireEvent.change(input, {target: {value: 'portfolio'}});

      await waitFor(() => {
        expect(screen.getByText('Works')).toBeInTheDocument();
        expect(screen.queryByText('Home')).not.toBeInTheDocument();
      });
    });

    it('shows no results message when no commands match', async () => {
      render(<BrowserRouter><CommandPalette /></BrowserRouter>);

      fireEvent.keyDown(window, {key: 'k', metaKey: true});

      await waitFor(() => {
        expect(
          screen.getByRole('dialog', {name: /command palette/i}),
        ).toBeInTheDocument();
      });

      const input = screen.getByRole('textbox', {name: /search commands/i});
      fireEvent.change(input, {target: {value: 'zzzznonexistent'}});

      await waitFor(() => {
        expect(
          screen.getByText(/no commands found for "zzzznonexistent"/i),
        ).toBeInTheDocument();
      });
    });

    it('is case insensitive', async () => {
      render(<BrowserRouter><CommandPalette /></BrowserRouter>);

      fireEvent.keyDown(window, {key: 'k', metaKey: true});

      await waitFor(() => {
        expect(
          screen.getByRole('dialog', {name: /command palette/i}),
        ).toBeInTheDocument();
      });

      const input = screen.getByRole('textbox', {name: /search commands/i});
      fireEvent.change(input, {target: {value: 'GITHUB'}});

      await waitFor(() => {
        expect(screen.getByText('Open GitHub')).toBeInTheDocument();
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('navigates down with ArrowDown', async () => {
      render(<BrowserRouter><CommandPalette /></BrowserRouter>);

      fireEvent.keyDown(window, {key: 'k', metaKey: true});

      await waitFor(() => {
        expect(
          screen.getByRole('dialog', {name: /command palette/i}),
        ).toBeInTheDocument();
      });

      // First item should be selected by default
      const firstOption = screen.getAllByRole('option')[0];
      expect(firstOption).toHaveAttribute('aria-selected', 'true');

      // Navigate down
      fireEvent.keyDown(window, {key: 'ArrowDown'});

      await waitFor(() => {
        const secondOption = screen.getAllByRole('option')[1];
        expect(secondOption).toHaveAttribute('aria-selected', 'true');
      });
    });

    it('navigates up with ArrowUp', async () => {
      render(<BrowserRouter><CommandPalette /></BrowserRouter>);

      fireEvent.keyDown(window, {key: 'k', metaKey: true});

      await waitFor(() => {
        expect(
          screen.getByRole('dialog', {name: /command palette/i}),
        ).toBeInTheDocument();
      });

      // Navigate down first
      fireEvent.keyDown(window, {key: 'ArrowDown'});
      fireEvent.keyDown(window, {key: 'ArrowDown'});

      // Navigate back up
      fireEvent.keyDown(window, {key: 'ArrowUp'});

      await waitFor(() => {
        const secondOption = screen.getAllByRole('option')[1];
        expect(secondOption).toHaveAttribute('aria-selected', 'true');
      });
    });

    it('wraps around when navigating past the last item', async () => {
      render(<BrowserRouter><CommandPalette /></BrowserRouter>);

      fireEvent.keyDown(window, {key: 'k', metaKey: true});

      // Filter to fewer items
      const input = screen.getByRole('textbox', {name: /search commands/i});
      fireEvent.change(input, {target: {value: 'github'}});

      // Now we have only 1 item
      fireEvent.keyDown(window, {key: 'ArrowDown'});

      // Should wrap to first (same item since only one)
      await waitFor(() => {
        const options = screen.getAllByRole('option');
        expect(options[0]).toHaveAttribute('aria-selected', 'true');
      });
    });

    it('wraps around when navigating before the first item', async () => {
      render(<BrowserRouter><CommandPalette /></BrowserRouter>);

      fireEvent.keyDown(window, {key: 'k', metaKey: true});

      // Navigate up from first item
      fireEvent.keyDown(window, {key: 'ArrowUp'});

      await waitFor(() => {
        // Should wrap to last item
        const options = screen.getAllByRole('option');
        const lastOption = options[options.length - 1];
        expect(lastOption).toHaveAttribute('aria-selected', 'true');
      });
    });
  });

  describe('Command Execution', () => {
    it('executes navigation command on Enter', async () => {
      // Create a mock element to scroll to
      const mockElement = document.createElement('div');
      mockElement.id = 'home';
      document.body.appendChild(mockElement);

      render(<BrowserRouter><CommandPalette /></BrowserRouter>);

      fireEvent.keyDown(window, {key: 'k', metaKey: true});

      await waitFor(() => {
        expect(
          screen.getByRole('dialog', {name: /command palette/i}),
        ).toBeInTheDocument();
      });

      // Press Enter to execute first command (Home)
      fireEvent.keyDown(window, {key: 'Enter'});

      await waitFor(() => {
        expect(scrollToSpy).toHaveBeenCalled();
        expect(
          screen.queryByRole('dialog', {name: /command palette/i}),
        ).not.toBeInTheDocument();
      });

      // Cleanup
      document.body.removeChild(mockElement);
    });

    it('executes command on click', async () => {
      // Create a mock element to scroll to
      const mockElement = document.createElement('div');
      mockElement.id = 'about';
      document.body.appendChild(mockElement);

      render(<BrowserRouter><CommandPalette /></BrowserRouter>);

      fireEvent.keyDown(window, {key: 'k', metaKey: true});

      const aboutButton = screen.getByText('About').closest('button');
      if (aboutButton) {
        fireEvent.click(aboutButton);
      }

      await waitFor(() => {
        expect(scrollToSpy).toHaveBeenCalled();
        expect(
          screen.queryByRole('dialog', {name: /command palette/i}),
        ).not.toBeInTheDocument();
      });

      // Cleanup
      document.body.removeChild(mockElement);
    });

    it('opens GitHub in new tab', async () => {
      render(<BrowserRouter><CommandPalette /></BrowserRouter>);

      fireEvent.keyDown(window, {key: 'k', metaKey: true});

      const githubButton = screen.getByText('Open GitHub').closest('button');
      if (githubButton) {
        fireEvent.click(githubButton);
      }

      await waitFor(() => {
        expect(openSpy).toHaveBeenCalledWith(
          'https://github.com/ferryhinardi',
          '_blank',
        );
      });
    });

    it('opens LinkedIn in new tab', async () => {
      render(<BrowserRouter><CommandPalette /></BrowserRouter>);

      fireEvent.keyDown(window, {key: 'k', metaKey: true});

      const linkedinButton = screen
        .getByText('Open LinkedIn')
        .closest('button');
      if (linkedinButton) {
        fireEvent.click(linkedinButton);
      }

      await waitFor(() => {
        expect(openSpy).toHaveBeenCalledWith(
          'https://www.linkedin.com/in/ferryhinardi',
          '_blank',
        );
      });
    });

    it('opens Twitter in new tab', async () => {
      render(<BrowserRouter><CommandPalette /></BrowserRouter>);

      fireEvent.keyDown(window, {key: 'k', metaKey: true});

      const twitterButton = screen.getByText('Open Twitter').closest('button');
      if (twitterButton) {
        fireEvent.click(twitterButton);
      }

      await waitFor(() => {
        expect(openSpy).toHaveBeenCalledWith(
          'https://twitter.com/FerryHinardi',
          '_blank',
        );
      });
    });

    it('opens resume PDF in new tab', async () => {
      render(<BrowserRouter><CommandPalette /></BrowserRouter>);

      fireEvent.keyDown(window, {key: 'k', metaKey: true});

      const downloadButton = screen
        .getByText('Download Resume')
        .closest('button');
      if (downloadButton) {
        fireEvent.click(downloadButton);
      }

      await waitFor(() => {
        expect(openSpy).toHaveBeenCalledWith(
          '/Ferry-Hinardi-Resume-2025.pdf',
          '_blank',
        );
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes on dialog', async () => {
      render(<BrowserRouter><CommandPalette /></BrowserRouter>);

      fireEvent.keyDown(window, {key: 'k', metaKey: true});

      const dialog = screen.getByRole('dialog', {name: /command palette/i});
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    it('has proper ARIA attributes on search input', async () => {
      render(<BrowserRouter><CommandPalette /></BrowserRouter>);

      fireEvent.keyDown(window, {key: 'k', metaKey: true});

      const input = screen.getByRole('textbox', {name: /search commands/i});
      expect(input).toBeInTheDocument();
    });

    it('has proper ARIA selected state on command items', async () => {
      render(<BrowserRouter><CommandPalette /></BrowserRouter>);

      fireEvent.keyDown(window, {key: 'k', metaKey: true});

      await waitFor(() => {
        const options = screen.getAllByRole('option');
        expect(options[0]).toHaveAttribute('aria-selected', 'true');
        expect(options[1]).toHaveAttribute('aria-selected', 'false');
      });
    });

    it('focuses search input when opened', async () => {
      render(<BrowserRouter><CommandPalette /></BrowserRouter>);

      fireEvent.keyDown(window, {key: 'k', metaKey: true});

      await waitFor(() => {
        const input = screen.getByRole('textbox', {name: /search commands/i});
        expect(document.activeElement).toBe(input);
      });
    });
  });

  describe('Mouse Interaction', () => {
    it('updates selection on mouse hover', async () => {
      render(<BrowserRouter><CommandPalette /></BrowserRouter>);

      fireEvent.keyDown(window, {key: 'k', metaKey: true});

      await waitFor(() => {
        const options = screen.getAllByRole('option');
        expect(options[0]).toHaveAttribute('aria-selected', 'true');
      });

      // Hover over second option
      const options = screen.getAllByRole('option');
      fireEvent.mouseEnter(options[1]);

      await waitFor(() => {
        expect(options[1]).toHaveAttribute('aria-selected', 'true');
        expect(options[0]).toHaveAttribute('aria-selected', 'false');
      });
    });
  });

  describe('Footer Hints', () => {
    it('displays keyboard navigation hints', async () => {
      render(<BrowserRouter><CommandPalette /></BrowserRouter>);

      fireEvent.keyDown(window, {key: 'k', metaKey: true});

      await waitFor(() => {
        expect(screen.getByText('Navigate')).toBeInTheDocument();
        expect(screen.getByText('Select')).toBeInTheDocument();
        expect(screen.getByText('Close')).toBeInTheDocument();
      });
    });
  });
});
