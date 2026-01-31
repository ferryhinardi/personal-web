import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {render, screen, fireEvent} from '@testing-library/react';
import ErrorBoundary, {withErrorBoundary} from '../ErrorBoundary';

// Mock UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({children, onClick, ...props}: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
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

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  AlertTriangle: () => <span data-testid="alert-icon">AlertTriangle</span>,
  RefreshCw: () => <span data-testid="refresh-icon">RefreshCw</span>,
  Home: () => <span data-testid="home-icon">Home</span>,
}));

// Component that throws an error for testing
function ThrowError({shouldThrow = true}: {shouldThrow?: boolean}) {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>No error</div>;
}

// Working component for testing
function WorkingComponent() {
  return <div>Working component content</div>;
}

describe('ErrorBoundary Component', () => {
  const originalConsoleError = console.error;
  const originalLocation = window.location;

  beforeEach(() => {
    // Suppress console.error during tests to avoid noise
    console.error = vi.fn();

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        reload: vi.fn(),
        href: '/',
      },
      writable: true,
    });

    // Mock window.gtag
    window.gtag = vi.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
    vi.clearAllMocks();
  });

  describe('Normal rendering', () => {
    it('renders children when there is no error', () => {
      render(
        <ErrorBoundary>
          <WorkingComponent />
        </ErrorBoundary>,
      );

      expect(screen.getByText('Working component content')).toBeInTheDocument();
    });

    it('renders multiple children correctly', () => {
      render(
        <ErrorBoundary>
          <div>Child 1</div>
          <div>Child 2</div>
        </ErrorBoundary>,
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });
  });

  describe('Error handling', () => {
    it('renders default error UI when an error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
      expect(
        screen.getByText(
          "We encountered an unexpected error. Don't worry, it's not your fault!",
        ),
      ).toBeInTheDocument();
    });

    it('renders custom fallback when provided', () => {
      const customFallback = <div>Custom error fallback</div>;

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(screen.getByText('Custom error fallback')).toBeInTheDocument();
      expect(
        screen.queryByText('Oops! Something went wrong'),
      ).not.toBeInTheDocument();
    });

    it('calls onError callback when error occurs', () => {
      const onError = vi.fn();

      render(
        <ErrorBoundary onError={onError}>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({componentStack: expect.any(String)}),
      );
    });

    it('logs error to console', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(console.error).toHaveBeenCalled();
    });

    it('logs error to gtag analytics', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(window.gtag).toHaveBeenCalledWith('event', 'exception', {
        description: 'Test error message',
        fatal: true,
      });
    });
  });

  describe('Error UI elements', () => {
    it('renders alert icon', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
    });

    it('renders Try Again button', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('renders Reload Page button', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(screen.getByText('Reload Page')).toBeInTheDocument();
    });

    it('renders Go Home button', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(screen.getByText('Go Home')).toBeInTheDocument();
    });

    it('renders contact email link', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      const emailLink = screen.getByRole('link', {name: 'contact me'});
      expect(emailLink).toHaveAttribute('href', 'mailto:hinardi93@gmail.com');
    });
  });

  describe('Button actions', () => {
    it('Try Again button resets error state and re-renders children', () => {
      // Create a component that can be controlled to throw or not
      let shouldThrow = true;

      function ConditionalThrow() {
        if (shouldThrow) {
          throw new Error('Test error');
        }
        return <div>Recovered successfully</div>;
      }

      render(
        <ErrorBoundary>
          <ConditionalThrow />
        </ErrorBoundary>,
      );

      // Error UI should be displayed
      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();

      // Now set shouldThrow to false before clicking Try Again
      shouldThrow = false;

      // Click Try Again - this resets the error state and re-renders children
      fireEvent.click(screen.getByText('Try Again'));

      // After reset, the recovered component should be displayed
      expect(screen.getByText('Recovered successfully')).toBeInTheDocument();
      expect(screen.queryByText('Oops! Something went wrong')).not.toBeInTheDocument();
    });

    it('Reload Page button calls window.location.reload', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      fireEvent.click(screen.getByText('Reload Page'));

      expect(window.location.reload).toHaveBeenCalledTimes(1);
    });

    it('Go Home button navigates to home page', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      fireEvent.click(screen.getByText('Go Home'));

      expect(window.location.href).toBe('/');
    });
  });

  describe('withErrorBoundary HOC', () => {
    it('wraps component with error boundary', () => {
      const WrappedComponent = withErrorBoundary(WorkingComponent);

      render(<WrappedComponent />);

      expect(screen.getByText('Working component content')).toBeInTheDocument();
    });

    it('catches errors in wrapped component', () => {
      const WrappedComponent = withErrorBoundary(ThrowError);

      render(<WrappedComponent />);

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    });

    it('passes custom props to error boundary', () => {
      const customFallback = <div>HOC custom fallback</div>;
      const WrappedComponent = withErrorBoundary(ThrowError, {
        fallback: customFallback,
      });

      render(<WrappedComponent />);

      expect(screen.getByText('HOC custom fallback')).toBeInTheDocument();
    });

    it('passes onError callback to error boundary', () => {
      const onError = vi.fn();
      const WrappedComponent = withErrorBoundary(ThrowError, {onError});

      render(<WrappedComponent />);

      expect(onError).toHaveBeenCalledTimes(1);
    });

    it('passes props to wrapped component', () => {
      interface TestProps {
        message: string;
      }

      function TestComponent({message}: TestProps) {
        return <div>{message}</div>;
      }

      const WrappedComponent = withErrorBoundary(TestComponent);

      render(<WrappedComponent message="Hello from props" />);

      expect(screen.getByText('Hello from props')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('handles error without gtag available', () => {
      // Remove gtag
      const originalGtag = window.gtag;
      delete (window as any).gtag;

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      // Should still render error UI without crashing
      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();

      // Restore gtag
      window.gtag = originalGtag;
    });

    it('handles error without onError callback', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      // Should render error UI without crashing
      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    });
  });
});
