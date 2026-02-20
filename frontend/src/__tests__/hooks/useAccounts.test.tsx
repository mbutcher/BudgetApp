import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import React from 'react';
import {
  useAccounts,
  useAccount,
  useCreateAccount,
  useArchiveAccount,
} from '@features/core/hooks/useAccounts';

// Mock the API module
vi.mock('@features/core/api/accountApi', () => ({
  accountApi: {
    list: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    archive: vi.fn(),
  },
}));

// Import after mock so we get the mocked version
import { accountApi } from '@features/core/api/accountApi';
const mockApi = accountApi as {
  list: ReturnType<typeof vi.fn>;
  get: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  archive: ReturnType<typeof vi.fn>;
};

const mockAccount = {
  id: 'acc-1',
  userId: 'user-1',
  name: 'Checking',
  type: 'checking' as const,
  isAsset: true,
  startingBalance: 1000,
  currentBalance: 1500,
  currency: 'USD',
  color: '#3b82f6',
  institution: 'Chase',
  isActive: true,
  createdAt: '2026-02-18T00:00:00.000Z',
  updatedAt: '2026-02-18T00:00:00.000Z',
};

function makeWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
  };
}

describe('useAccounts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns accounts from the API', async () => {
    mockApi.list.mockResolvedValue({ data: { data: { accounts: [mockAccount] } } });

    const { result } = renderHook(() => useAccounts(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([mockAccount]);
    expect(mockApi.list).toHaveBeenCalledTimes(1);
  });

  it('enters error state when API fails', async () => {
    mockApi.list.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useAccounts(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});

describe('useAccount', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns a single account by id', async () => {
    mockApi.get.mockResolvedValue({ data: { data: { account: mockAccount } } });

    const { result } = renderHook(() => useAccount('acc-1'), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockAccount);
    expect(mockApi.get).toHaveBeenCalledWith('acc-1');
  });

  it('does not fetch when id is empty', () => {
    const { result } = renderHook(() => useAccount(''), { wrapper: makeWrapper() });
    // query is disabled — fetchStatus should be idle
    expect(result.current.fetchStatus).toBe('idle');
    expect(mockApi.get).not.toHaveBeenCalled();
  });
});

describe('useCreateAccount', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls accountApi.create with provided data', async () => {
    mockApi.create.mockResolvedValue({ data: { data: { account: mockAccount } } });
    mockApi.list.mockResolvedValue({ data: { data: { accounts: [mockAccount] } } });

    const { result } = renderHook(() => useCreateAccount(), { wrapper: makeWrapper() });

    const input = {
      name: 'Savings',
      type: 'savings' as const,
      isAsset: true,
      startingBalance: 5000,
      currency: 'USD',
    };
    result.current.mutate(input);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockApi.create).toHaveBeenCalledWith(input);
  });
});

describe('useArchiveAccount', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls accountApi.archive with the account id', async () => {
    mockApi.archive.mockResolvedValue({ data: { data: null } });
    mockApi.list.mockResolvedValue({ data: { data: { accounts: [] } } });

    const { result } = renderHook(() => useArchiveAccount(), { wrapper: makeWrapper() });

    result.current.mutate('acc-1');

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockApi.archive).toHaveBeenCalledWith('acc-1');
  });
});
