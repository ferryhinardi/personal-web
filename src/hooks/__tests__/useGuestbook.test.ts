import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {renderHook, act} from '@testing-library/react';
import {useGuestbook} from '../useGuestbook';
import {useFirebase} from '@/hooks/useFirebase';

type SnapshotCallback = (snap: unknown) => void;
type ErrorCallback = (err: Error) => void;

let capturedOnNext: SnapshotCallback | null = null;
let capturedOnError: ErrorCallback | null = null;
const mockUnsubscribe = vi.fn();
const mockAddDoc = vi.fn();
const mockOnSnapshot = vi.fn(
  (_q: unknown, onNext: SnapshotCallback, onError?: ErrorCallback) => {
    capturedOnNext = onNext;
    capturedOnError = onError ?? null;
    return mockUnsubscribe;
  },
);

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => ({})),
  addDoc: (ref: unknown, data: unknown) => mockAddDoc(ref, data),
  onSnapshot: (q: unknown, onNext: unknown, onError?: unknown) =>
    mockOnSnapshot(q, onNext as SnapshotCallback, onError as ErrorCallback | undefined),
  query: vi.fn(() => ({})),
  orderBy: vi.fn(() => ({})),
  where: vi.fn(() => ({})),
  serverTimestamp: vi.fn(() => ({_type: 'serverTimestamp'})),
}));

const FAKE_DB = {_isFakeDb: true} as unknown as import('firebase/firestore').Firestore;

vi.mock('@/hooks/useFirebase', () => ({
  useFirebase: vi.fn(() => ({db: FAKE_DB, isConfigured: true})),
}));

vi.mock('@/utils/visitorId', () => ({
  getVisitorId: vi.fn(() => 'test-visitor-id-123'),
}));

function makeSnapshot(
  docs: Array<{id: string; name: string; message: string; createdAt?: Date}>,
) {
  return {
    docs: docs.map((d) => ({
      id: d.id,
      data: () => ({
        name: d.name,
        message: d.message,
        approved: true,
        createdAt: {
          toDate: () => d.createdAt ?? new Date('2026-01-01T00:00:00Z'),
        },
        visitorId: 'visitor-1',
      }),
    })),
  };
}

describe('useGuestbook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    capturedOnNext = null;
    capturedOnError = null;
    mockUnsubscribe.mockReset();
    mockAddDoc.mockReset();
    mockAddDoc.mockResolvedValue({id: 'new-doc-id'});
    mockOnSnapshot.mockClear();
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    localStorage.clear();
  });

  it('loads messages from Firestore when snapshot arrives', () => {
    const {result, unmount} = renderHook(() => useGuestbook());

    expect(result.current.isLoading).toBe(true);

    act(() => {
      capturedOnNext!(
        makeSnapshot([
          {id: 'msg-1', name: 'Alice', message: 'Hello world'},
          {id: 'msg-2', name: 'Bob', message: 'Nice site!'},
        ]),
      );
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[0].name).toBe('Alice');
    expect(result.current.messages[1].name).toBe('Bob');
    expect(result.current.error).toBeNull();
    unmount();
  });

  it('sets error message when Firestore subscription fails', () => {
    const {result, unmount} = renderHook(() => useGuestbook());

    expect(result.current.isLoading).toBe(true);

    act(() => {
      capturedOnError!(new Error('Permission denied'));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(
      'Failed to load messages. Please try again later.',
    );
    expect(result.current.messages).toHaveLength(0);
    unmount();
  });

  it('adds a message via addDoc with correct fields on success', async () => {
    const {result, unmount} = renderHook(() => useGuestbook());

    act(() => {
      capturedOnNext!(makeSnapshot([]));
    });

    expect(result.current.isLoading).toBe(false);

    await act(async () => {
      await result.current.addMessage('Charlie', 'Great portfolio!');
    });

    expect(mockAddDoc).toHaveBeenCalledTimes(1);
    const addDocArgs = mockAddDoc.mock.calls[0][1] as Record<string, unknown>;
    expect(addDocArgs.name).toBe('Charlie');
    expect(addDocArgs.message).toBe('Great portfolio!');
    expect(addDocArgs.visitorId).toBe('test-visitor-id-123');
    expect(addDocArgs.approved).toBe(true);
    expect(result.current.error).toBeNull();
    unmount();
  });

  it('starts with isLoading=true before Firestore snapshot arrives', () => {
    const {result, unmount} = renderHook(() => useGuestbook());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.messages).toHaveLength(0);

    act(() => {
      capturedOnNext!(makeSnapshot([]));
    });

    expect(result.current.isLoading).toBe(false);
    unmount();
  });

  it('sets error when addDoc throws a Firebase network error', async () => {
    mockAddDoc.mockRejectedValueOnce(new Error('Quota exceeded'));

    const {result, unmount} = renderHook(() => useGuestbook());

    act(() => {
      capturedOnNext!(makeSnapshot([]));
    });

    expect(result.current.isLoading).toBe(false);

    await act(async () => {
      await result.current.addMessage('Dave', 'Test message');
    });

    expect(result.current.error).toBe(
      'Failed to send message. Please try again.',
    );
    unmount();
  });

  it('skips Firestore subscription when Firebase is not configured', () => {
    vi.mocked(useFirebase).mockReturnValue({db: null, isConfigured: false});

    const {result, unmount} = renderHook(() => useGuestbook());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.messages).toHaveLength(0);
    expect(result.current.error).toBeNull();
    expect(mockOnSnapshot).not.toHaveBeenCalled();
    unmount();

    vi.mocked(useFirebase).mockReturnValue(
      {db: FAKE_DB, isConfigured: true},
    );
  });

  it('blocks addMessage and sets rate-limit error within the 60-second window', async () => {
    localStorage.setItem('guestbook_last_sent', (Date.now() - 10_000).toString());

    const {result, unmount} = renderHook(() => useGuestbook());

    act(() => {
      capturedOnNext!(makeSnapshot([]));
    });

    expect(result.current.isLoading).toBe(false);

    await act(async () => {
      await result.current.addMessage('Eve', 'Rate limited message');
    });

    expect(mockAddDoc).not.toHaveBeenCalled();
    expect(result.current.error).toBe(
      'Please wait before sending another message.',
    );
    unmount();
  });

  it('calls the Firestore unsubscribe function when the hook unmounts', () => {
    const {unmount} = renderHook(() => useGuestbook());

    act(() => {
      capturedOnNext!(makeSnapshot([]));
    });

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });
});
