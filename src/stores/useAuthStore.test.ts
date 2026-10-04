import { beforeEach, expect, it } from 'vitest';
import { demoRepository } from '../lib/demoRepository';
import { AuthService } from '../services/auth.service';
import { useAuthStore } from './useAuthStore';

const values = new Map<string, string>();
const storage = {
  getItem: (key: string) => values.get(key) ?? null,
  setItem: (key: string, value: string) => { values.set(key, value); },
  removeItem: (key: string) => { values.delete(key); },
};
Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true });
Object.defineProperty(globalThis, 'sessionStorage', { value: storage, configurable: true });

beforeEach(() => {
  values.clear();
  demoRepository.init([], [], [], [], []);
  useAuthStore.getState().logout();
});

it('ignores legacy tokens and fabricated login data', () => {
  localStorage.setItem('accessToken', 'legacy');
  useAuthStore.getState().login({ id: 'fake', name: 'Fake', email: 'fake@example.com', role: 'admin' });
  expect(useAuthStore.getState().isAuthenticated).toBe(false);
});

it('restores only explicit AuthService session and clears it on logout', async () => {
  await expect(AuthService.login('budi@example.com', 'wrong')).rejects.toThrow();
  await AuthService.login('budi@example.com', 'Demo123!');
  useAuthStore.getState().syncSession();
  expect(useAuthStore.getState().user?.role).toBe('customer');
  expect(useAuthStore.getState().user).not.toHaveProperty('password');
  useAuthStore.getState().logout();
  useAuthStore.getState().syncSession();
  expect(useAuthStore.getState().user).toBeNull();
});

it('rejects unsafe intended destinations', () => {
  for (const dest of ['//example.com', 'https://example.com', '/\\example.com']) {
    useAuthStore.getState().setIntendedAction(dest);
    expect(useAuthStore.getState().intendedAction).toBeNull();
  }
  useAuthStore.getState().setIntendedAction('/checkout');
  expect(useAuthStore.getState().intendedAction).toBe('/checkout');
});
