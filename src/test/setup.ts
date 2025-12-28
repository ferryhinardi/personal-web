import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import React from 'react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Radix UI components
vi.mock('@radix-ui/react-slot', () => ({
  Slot: ({ children, ...props }: any) => React.createElement('div', props, children),
}));

vi.mock('@radix-ui/react-dialog', () => ({
  Root: ({ children }: any) => React.createElement('div', null, children),
  Portal: ({ children }: any) => React.createElement('div', null, children),
  Overlay: ({ children, ...props }: any) => React.createElement('div', props, children),
  Content: ({ children, ...props }: any) => React.createElement('div', props, children),
  Title: ({ children, ...props }: any) => React.createElement('div', props, children),
  Description: ({ children, ...props }: any) => React.createElement('div', props, children),
  Trigger: ({ children, ...props }: any) => React.createElement('button', props, children),
  Close: ({ children, ...props }: any) => React.createElement('button', props, children),
}));

vi.mock('@radix-ui/react-avatar', () => ({
  Root: ({ children, ...props }: any) => React.createElement('div', props, children),
  Image: ({ ...props }: any) => React.createElement('img', props),
  Fallback: ({ children, ...props }: any) => React.createElement('div', props, children),
}));

// Mock Sheet component (used in Header)
vi.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children }: any) => React.createElement('div', { 'data-testid': 'sheet' }, children),
  SheetTrigger: ({ children, ...props }: any) => React.createElement('button', { 'data-testid': 'sheet-trigger', ...props }, children),
  SheetContent: ({ children, ...props }: any) => React.createElement('div', { 'data-testid': 'sheet-content', ...props }, children),
  SheetHeader: ({ children, ...props }: any) => React.createElement('div', { 'data-testid': 'sheet-header', ...props }, children),
  SheetTitle: ({ children, ...props }: any) => React.createElement('h2', { 'data-testid': 'sheet-title', ...props }, children),
  SheetDescription: ({ children, ...props }: any) => React.createElement('p', { 'data-testid': 'sheet-description', ...props }, children),
}));

// Mock Button component
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => React.createElement('button', props, children),
}));

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const { whileHover, whileInView, initial, animate, transition, viewport, ...rest } = props;
      return React.createElement('div', rest, children);
    },
    section: ({ children, ...props }: any) => {
      const { whileHover, whileInView, initial, animate, transition, viewport, ...rest } = props;
      return React.createElement('section', rest, children);
    },
    h2: ({ children, ...props }: any) => {
      const { whileHover, whileInView, initial, animate, transition, viewport, ...rest } = props;
      return React.createElement('h2', rest, children);
    },
    p: ({ children, ...props }: any) => {
      const { whileHover, whileInView, initial, animate, transition, viewport, ...rest } = props;
      return React.createElement('p', rest, children);
    },
  },
  AnimatePresence: ({ children }: any) => React.createElement(React.Fragment, null, children),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn();
