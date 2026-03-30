import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {renderHook, act, waitFor} from '@testing-library/react';
import {useFetch} from '../useFetch';

describe('useFetch', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns data and sets loading to false on success', async () => {
    const mockData = {id: 1, name: 'Ferry'};
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response);

    const {result} = renderHook(() => useFetch<typeof mockData>('/api/test'));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('sets error and loading false when fetch rejects with network error', async () => {
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network failure'));

    const {result} = renderHook(() => useFetch('/api/test'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Network failure');
  });

  it('sets error when response is not ok', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () => Promise.resolve({}),
    } as Response);

    const {result} = renderHook(() => useFetch('/api/missing'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('HTTP error! status: 404');
  });

  it('does not update state after unmount (cleanup prevents stale setState)', async () => {
    let resolvePromise!: (value: Response) => void;
    const pendingPromise = new Promise<Response>(resolve => {
      resolvePromise = resolve;
    });

    vi.mocked(global.fetch).mockReturnValueOnce(pendingPromise);

    const {result, unmount} = renderHook(() => useFetch<{id: number}>('/api/slow'));

    expect(result.current.loading).toBe(true);

    unmount();

    await act(async () => {
      resolvePromise({
        ok: true,
        json: () => Promise.resolve({id: 42}),
      } as Response);
      await new Promise(r => setTimeout(r, 0));
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
  });
});
