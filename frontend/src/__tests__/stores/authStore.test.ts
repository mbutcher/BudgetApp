import { useAuthStore } from '@features/auth/stores/authStore';

const mockUser = {
  id: 'user-123',
  email: 'user@example.com',
  isActive: true,
  emailVerified: false,
  totpEnabled: false,
  webauthnEnabled: false,
  createdAt: '2026-02-18T00:00:00.000Z',
  updatedAt: '2026-02-18T00:00:00.000Z',
};

// Reset store to initial state before each test
beforeEach(() => {
  useAuthStore.setState({
    user: null,
    accessToken: null,
    twoFactorState: null,
    isAuthenticated: false,
    isInitialized: false,
  });
});

describe('authStore — initial state', () => {
  it('starts unauthenticated and uninitialized', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isInitialized).toBe(false);
    expect(state.twoFactorState).toBeNull();
  });
});

describe('authStore.setAuth', () => {
  it('sets user and token, marks authenticated', () => {
    useAuthStore.getState().setAuth(mockUser, 'access-token-xyz');
    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.accessToken).toBe('access-token-xyz');
    expect(state.isAuthenticated).toBe(true);
    expect(state.twoFactorState).toBeNull();
  });

  it('clears any pending two-factor state on setAuth', () => {
    useAuthStore.getState().setTwoFactorRequired('2fa-token', ['totp']);
    useAuthStore.getState().setAuth(mockUser, 'access-token');
    expect(useAuthStore.getState().twoFactorState).toBeNull();
  });
});

describe('authStore.setAccessToken', () => {
  it('updates only the access token', () => {
    useAuthStore.getState().setAuth(mockUser, 'old-token');
    useAuthStore.getState().setAccessToken('new-token');
    const state = useAuthStore.getState();
    expect(state.accessToken).toBe('new-token');
    expect(state.user).toEqual(mockUser); // unchanged
    expect(state.isAuthenticated).toBe(true); // unchanged
  });
});

describe('authStore.setTwoFactorRequired', () => {
  it('stores two-factor state and marks not authenticated', () => {
    useAuthStore.getState().setTwoFactorRequired('2fa-pending-token', ['totp', 'webauthn']);
    const state = useAuthStore.getState();
    expect(state.twoFactorState).toEqual({
      twoFactorToken: '2fa-pending-token',
      methods: ['totp', 'webauthn'],
    });
    expect(state.isAuthenticated).toBe(false);
  });
});

describe('authStore.clearAuth', () => {
  it('resets all auth state', () => {
    useAuthStore.getState().setAuth(mockUser, 'token');
    useAuthStore.getState().clearAuth();
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.twoFactorState).toBeNull();
  });

  it('also clears two-factor state', () => {
    useAuthStore.getState().setTwoFactorRequired('2fa-token', ['totp']);
    useAuthStore.getState().clearAuth();
    expect(useAuthStore.getState().twoFactorState).toBeNull();
  });
});

describe('authStore.updateUser', () => {
  it('updates user without affecting auth status', () => {
    useAuthStore.getState().setAuth(mockUser, 'token');
    const updated = { ...mockUser, emailVerified: true };
    useAuthStore.getState().updateUser(updated);
    const state = useAuthStore.getState();
    expect(state.user?.emailVerified).toBe(true);
    expect(state.accessToken).toBe('token');
    expect(state.isAuthenticated).toBe(true);
  });
});

describe('authStore.setInitialized', () => {
  it('marks store as initialized', () => {
    expect(useAuthStore.getState().isInitialized).toBe(false);
    useAuthStore.getState().setInitialized();
    expect(useAuthStore.getState().isInitialized).toBe(true);
  });
});
