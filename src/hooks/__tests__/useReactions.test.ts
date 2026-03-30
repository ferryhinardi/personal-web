import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {renderHook, act} from '@testing-library/react';
import {useReactions} from '../useReactions';
import {useFirebase} from '@/hooks/useFirebase';

type SnapshotCallback = (snap: unknown) => void;
type ErrorCallback = (err: Error) => void;

let capturedOnNext: SnapshotCallback | null = null;
let capturedOnError: ErrorCallback | null = null;
const mockUnsubscribe = vi.fn();
const mockSetDoc = vi.fn();
const mockDeleteDoc = vi.fn();
const mockGetDoc = vi.fn();
const mockOnSnapshot = vi.fn(
  (_ref: unknown, onNext: SnapshotCallback, onError?: ErrorCallback) => {
    capturedOnNext = onNext;
    capturedOnError = onError ?? null;
    return mockUnsubscribe;
  },
);

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => ({_isFakeRef: true})),
  getDoc: (ref: unknown) => mockGetDoc(ref),
  setDoc: (ref: unknown, data: unknown, options?: unknown) =>
    mockSetDoc(ref, data, options),
  deleteDoc: (ref: unknown) => mockDeleteDoc(ref),
  onSnapshot: (
    ref: unknown,
    onNext: unknown,
    onError?: unknown,
  ) =>
    mockOnSnapshot(
      ref,
      onNext as SnapshotCallback,
      onError as ErrorCallback | undefined,
    ),
  increment: vi.fn((n: number) => ({_increment: n})),
}));

const FAKE_DB = {
  _isFakeDb: true,
} as unknown as import('firebase/firestore').Firestore;

vi.mock('@/hooks/useFirebase', () => ({
  useFirebase: vi.fn(() => ({db: FAKE_DB, isConfigured: true})),
}));

vi.mock('@/utils/visitorId', () => ({
  getVisitorId: vi.fn(() => 'test-visitor-id-123'),
}));

function makeReactionSnapshot(
  reactions: Record<string, number>,
  exists = true,
) {
  return {
    exists: () => exists,
    data: () =>
      exists
        ? {reactions, targetId: 'project-1', targetType: 'project'}
        : undefined,
  };
}

function makeUserReactionSnapshot(
  emojis: string[],
  exists = true,
) {
  return {
    exists: () => exists,
    data: () => (exists ? {emojis, visitorId: 'test-visitor-id-123'} : undefined),
  };
}

describe('useReactions', () => {
  beforeEach(() => {
    capturedOnNext = null;
    capturedOnError = null;
    mockUnsubscribe.mockReset();
    mockSetDoc.mockReset();
    mockDeleteDoc.mockReset();
    mockGetDoc.mockReset();
    mockOnSnapshot.mockClear();
    mockGetDoc.mockResolvedValue(makeUserReactionSnapshot([], false));
    mockSetDoc.mockResolvedValue(undefined);
    mockDeleteDoc.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('starts with isLoading=true and all reaction counts at 0', () => {
    const {result, unmount} = renderHook(() =>
      useReactions('project-1', 'project'),
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.userReactions.size).toBe(0);
    expect(result.current.reactions['🔥']).toBe(0);
    expect(result.current.reactions['❤️']).toBe(0);
    unmount();
  });

  it('loads reaction counts from Firestore when snapshot arrives', () => {
    const {result, unmount} = renderHook(() =>
      useReactions('project-1', 'project'),
    );

    expect(result.current.isLoading).toBe(true);

    act(() => {
      capturedOnNext!(
        makeReactionSnapshot({'🔥': 5, '❤️': 3, '👍': 0, '🎉': 0, '🚀': 0, '👀': 0}),
      );
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.reactions['🔥']).toBe(5);
    expect(result.current.reactions['❤️']).toBe(3);
    unmount();
  });

  it('sets isLoading=false on empty/non-existent reaction document', () => {
    const {result, unmount} = renderHook(() =>
      useReactions('project-1', 'project'),
    );

    act(() => {
      capturedOnNext!(makeReactionSnapshot({}, false));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.reactions['🔥']).toBe(0);
    unmount();
  });

  it('sets isLoading=false and does not update state when Firestore subscription errors', () => {
    const {result, unmount} = renderHook(() =>
      useReactions('project-1', 'project'),
    );

    expect(result.current.isLoading).toBe(true);

    act(() => {
      capturedOnError!(new Error('Permission denied'));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.reactions['🔥']).toBe(0);
    unmount();
  });

  it('performs optimistic add reaction and calls setDoc', async () => {
    const {result, unmount} = renderHook(() =>
      useReactions('project-1', 'project'),
    );

    act(() => {
      capturedOnNext!(
        makeReactionSnapshot({'🔥': 2, '❤️': 0, '👍': 0, '🎉': 0, '🚀': 0, '👀': 0}),
      );
    });

    expect(result.current.reactions['🔥']).toBe(2);

    await act(async () => {
      await result.current.toggleReaction('🔥');
    });

    expect(result.current.reactions['🔥']).toBe(3);
    expect(result.current.userReactions.has('🔥')).toBe(true);
    expect(mockSetDoc).toHaveBeenCalled();
    unmount();
  });

  it('reverts optimistic update when setDoc fails', async () => {
    mockSetDoc.mockRejectedValueOnce(new Error('Quota exceeded'));

    const {result, unmount} = renderHook(() =>
      useReactions('project-1', 'project'),
    );

    act(() => {
      capturedOnNext!(
        makeReactionSnapshot({'🔥': 2, '❤️': 0, '👍': 0, '🎉': 0, '🚀': 0, '👀': 0}),
      );
    });

    expect(result.current.reactions['🔥']).toBe(2);

    await act(async () => {
      await result.current.toggleReaction('🔥');
    });

    expect(result.current.reactions['🔥']).toBe(2);
    expect(result.current.userReactions.has('🔥')).toBe(false);
    unmount();
  });

  it('removes reaction when toggling an already-reacted emoji', async () => {
    mockGetDoc.mockResolvedValueOnce(makeUserReactionSnapshot(['🔥'], true));

    const {result, unmount} = renderHook(() =>
      useReactions('project-1', 'project'),
    );

    act(() => {
      capturedOnNext!(
        makeReactionSnapshot({'🔥': 5, '❤️': 0, '👍': 0, '🎉': 0, '🚀': 0, '👀': 0}),
      );
    });

    // Wait for user reactions to load
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.userReactions.has('🔥')).toBe(true);

    await act(async () => {
      await result.current.toggleReaction('🔥');
    });

    expect(result.current.reactions['🔥']).toBe(4);
    expect(result.current.userReactions.has('🔥')).toBe(false);
    expect(mockDeleteDoc).toHaveBeenCalled();
    unmount();
  });

  it('skips Firestore subscription when Firebase is not configured', () => {
    vi.mocked(useFirebase).mockReturnValue({db: null, isConfigured: false});

    const {result, unmount} = renderHook(() =>
      useReactions('project-1', 'project'),
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.reactions['🔥']).toBe(0);
    expect(mockOnSnapshot).not.toHaveBeenCalled();
    unmount();

    vi.mocked(useFirebase).mockReturnValue({db: FAKE_DB, isConfigured: true});
  });

  it('toggleReaction is a no-op when Firebase is not configured', async () => {
    vi.mocked(useFirebase).mockReturnValue({db: null, isConfigured: false});

    const {result, unmount} = renderHook(() =>
      useReactions('project-1', 'project'),
    );

    await act(async () => {
      await result.current.toggleReaction('🔥');
    });

    expect(mockSetDoc).not.toHaveBeenCalled();
    expect(result.current.reactions['🔥']).toBe(0);
    unmount();

    vi.mocked(useFirebase).mockReturnValue({db: FAKE_DB, isConfigured: true});
  });

  it('calls the Firestore unsubscribe function when the hook unmounts', () => {
    const {unmount} = renderHook(() =>
      useReactions('project-1', 'project'),
    );

    act(() => {
      capturedOnNext!(makeReactionSnapshot({}));
    });

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });
});
