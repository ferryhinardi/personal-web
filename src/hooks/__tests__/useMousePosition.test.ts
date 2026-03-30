import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {renderHook, act} from '@testing-library/react';
import {useMousePosition} from '../useMousePosition';

vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal<typeof import('framer-motion')>();
  return {
    ...actual,
    useReducedMotion: vi.fn(() => false),
  };
});

import {useReducedMotion} from 'framer-motion';

describe('useMousePosition', () => {
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>;
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    vi.mocked(useReducedMotion).mockReturnValue(false);
    Object.defineProperty(window, 'innerWidth', {value: 1000, writable: true});
    Object.defineProperty(window, 'innerHeight', {value: 800, writable: true});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns default position (all zeros) on initial render', () => {
    const {result, unmount} = renderHook(() => useMousePosition());

    expect(result.current.x).toBe(0);
    expect(result.current.y).toBe(0);
    expect(result.current.normalizedX).toBe(0);
    expect(result.current.normalizedY).toBe(0);
    expect(result.current.isHovering).toBe(false);
    unmount();
  });

  it('registers mousemove listener on window when enabled', () => {
    const {unmount} = renderHook(() => useMousePosition({enabled: true}));

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'mousemove',
      expect.any(Function),
      {passive: true},
    );
    unmount();
  });

  it('does not register mousemove listener when disabled', () => {
    const {unmount} = renderHook(() => useMousePosition({enabled: false}));

    const mousemoveCalls = addEventListenerSpy.mock.calls.filter(
      (call: unknown[]) => call[0] === 'mousemove',
    );
    expect(mousemoveCalls).toHaveLength(0);
    unmount();
  });

  it('removes mousemove listener from window on unmount', () => {
    const {unmount} = renderHook(() => useMousePosition());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'mousemove',
      expect.any(Function),
    );
  });

  it('updates position when mousemove event fires', () => {
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });

    const {result, unmount} = renderHook(() => useMousePosition());

    act(() => {
      const event = new MouseEvent('mousemove', {clientX: 500, clientY: 400});
      window.dispatchEvent(event);
    });

    expect(result.current.x).toBe(500);
    expect(result.current.y).toBe(400);
    expect(result.current.normalizedX).toBe(0);
    expect(result.current.normalizedY).toBe(0);
    unmount();
    vi.unstubAllGlobals();
  });

  it('returns default position and skips event listener when reduced motion is preferred', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);

    const {result, unmount} = renderHook(() => useMousePosition());

    const mousemoveCalls = addEventListenerSpy.mock.calls.filter(
      (call: unknown[]) => call[0] === 'mousemove',
    );
    expect(mousemoveCalls).toHaveLength(0);
    expect(result.current.x).toBe(0);
    expect(result.current.y).toBe(0);
    unmount();
  });

  it('cleans up animation frame on unmount to prevent stale callbacks', () => {
    const cancelAnimationFrameSpy = vi.spyOn(window, 'cancelAnimationFrame');

    let storedCb: FrameRequestCallback | null = null;
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      storedCb = cb;
      return 42;
    });

    const {unmount} = renderHook(() => useMousePosition());

    act(() => {
      const event = new MouseEvent('mousemove', {clientX: 100, clientY: 100});
      window.dispatchEvent(event);
    });

    expect(storedCb).not.toBeNull();

    unmount();

    expect(cancelAnimationFrameSpy).toHaveBeenCalledWith(42);
    vi.unstubAllGlobals();
  });

  it('adds mouseenter and mouseleave listeners to targetRef element', () => {
    const fakeElement = document.createElement('div');
    const elementAddSpy = vi.spyOn(fakeElement, 'addEventListener');
    const elementRemoveSpy = vi.spyOn(fakeElement, 'removeEventListener');

    const targetRef = {current: fakeElement};

    const {unmount} = renderHook(() =>
      useMousePosition({targetRef}),
    );

    expect(elementAddSpy).toHaveBeenCalledWith(
      'mouseenter',
      expect.any(Function),
    );
    expect(elementAddSpy).toHaveBeenCalledWith(
      'mouseleave',
      expect.any(Function),
    );

    unmount();

    expect(elementRemoveSpy).toHaveBeenCalledWith(
      'mouseenter',
      expect.any(Function),
    );
    expect(elementRemoveSpy).toHaveBeenCalledWith(
      'mouseleave',
      expect.any(Function),
    );
  });
});
