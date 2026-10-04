// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { demoRepository, SESSION_KEY } from '../../lib/demoRepository';
import { AuthService } from '../../services/auth.service';
import { CustomerRoute } from './CustomerRoute';
import { useAuthStore } from '../../stores/useAuthStore';
import { useUIStore } from '../../stores/useUIStore';
import { CheckoutView } from '../../features/checkout/views/CheckoutView';
import { LoginModal } from '../../features/auth/LoginModal';
import { useCartStore } from '../../features/cart/useCartStore';

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  demoRepository.init([], [], [], [], []);
  useAuthStore.getState().syncSession();
  useCartStore.setState({ items: [], totalItemAmount: 0 });
  useUIStore.setState({ isLoginOpen: false });
});
afterEach(() => { cleanup(); });

it('keeps customer data private for a guest and offers login', async () => {
  render(<MemoryRouter initialEntries={['/orders']}><CustomerRoute><p>Private orders</p></CustomerRoute></MemoryRouter>);
  expect(screen.queryByText('Private orders')).toBeNull();
  await waitFor(() => expect(screen.getByText('Masuk untuk melanjutkan')).toBeDefined());
  expect(useUIStore.getState().isLoginOpen).toBe(true);
  expect(useAuthStore.getState().intendedAction).toBe('/orders');
});

it('accepts real login credentials and rejects invalid ones in UI', async () => {
  render(<MemoryRouter><LoginModal isOpen onClose={() => {}} onOpenRegister={() => {}} /></MemoryRouter>);
  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'budi@example.com' } });
  fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'badpass' } });
  fireEvent.click(screen.getByText('Masuk'));
  await waitFor(() => expect(useAuthStore.getState().user).toBeNull());
  fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'Demo123!' } });
  fireEvent.click(screen.getByText('Masuk'));
  await waitFor(() => expect(useAuthStore.getState().user?.id).toBe('101'));
  expect(sessionStorage.getItem(SESSION_KEY)).not.toBeNull();
});

it('renders checkout with persisted address without a hooks error', async () => {
  await AuthService.login('budi@example.com', 'Demo123!');
  useAuthStore.getState().syncSession();
  render(<MemoryRouter><CheckoutView /></MemoryRouter>);
  await waitFor(() => expect(screen.getByText('Checkout')).toBeDefined());
  await waitFor(() => expect(screen.getByText(/Jl\. Merdeka No\. 45/)).toBeDefined());
  expect(screen.getByRole('button', { name: /Konfirmasi & Buat Pesanan/ }).hasAttribute('disabled')).toBe(true);
});
