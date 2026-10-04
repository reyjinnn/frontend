import api from '../../../lib/axios';
import type { Product } from '../../../services/catalog.service';
import { demoRepository, readDemoDB, requireDemoUser, transactDemoDB } from '../../../lib/demoRepository';
import { DEMO_MODE } from '../../../lib/demoMode';
import { PointsApi } from '../../points/api/pointsApi';
import { TlaterApi } from '../../tlater/api/tlaterApi';

export interface CartItem { productId: number; name: string; price: number; quantity: number; subtotal: number; imageUrl: string }
export interface SplitCheckoutRequest { items: { productId: number; quantity: number }[]; shippingCity: string; usePoints?: number; useTlater?: boolean; tlaterTenor?: number; promoCode?: string; shippingFee?: number; protectionFee?: number; shippingAddress?: string; paymentMethod?: string; courier?: string; notes?: string }
export const CheckoutApi = {
  async getCart() {
    if (!DEMO_MODE) return (await api.get('/api/v1/cart')).data;
    const id = requireDemoUser('customer').id; const items = readDemoDB().carts[id] ?? [];
    return { items, totalItemAmount: items.reduce((sum, item) => sum + item.subtotal, 0) };
  },
  async addToCart(product: Product, quantity = 1) {
    if (!DEMO_MODE) return (await api.post('/api/v1/cart/items', { productId: product.id, quantity })).data;
    const id = requireDemoUser('customer').id;
    await transactDemoDB(db => {
      const p = db.products.find(p => p.id === product.id && p.status === 'active');
      const cart = db.carts[id] ??= []; const old = cart.find(i => i.productId === product.id);
      const count = quantity + (old?.quantity ?? 0);
      if (!p || !Number.isSafeInteger(quantity) || quantity < 1 || count > p.stock) throw new Error('Insufficient stock');
      if (old) { old.quantity = count; old.price = p.price; old.subtotal = count * p.price; }
      else cart.push({ productId: p.id, name: p.name, price: p.price, quantity, subtotal: p.price * quantity, imageUrl: p.images[0]?.imageUrl ?? '' });
    });
    return this.getCart();
  },
  async updateCartItem(productId: number, quantity: number) {
    if (!DEMO_MODE) return (await api.patch(`/api/v1/cart/items/${productId}`, { quantity })).data;
    const id = requireDemoUser('customer').id;
    await transactDemoDB(db => {
      const cart = db.carts[id] ??= []; const item = cart.find(i => i.productId === productId); const p = db.products.find(p => p.id === productId);
      if (!item || !p || !Number.isSafeInteger(quantity) || quantity < 0 || quantity > p.stock) throw new Error('Invalid cart quantity');
      if (!quantity) db.carts[id] = cart.filter(i => i.productId !== productId);
      else { item.quantity = quantity; item.price = p.price; item.subtotal = quantity * p.price; }
    }); return this.getCart();
  },
  async removeCartItem(productId: number) { return this.updateCartItem(productId, 0); },
  async getPointsWallet() { return PointsApi.getWallet(); },
  async getTlaterAccount() { return TlaterApi.getAccount(); },
  async simulateCheckout(req: SplitCheckoutRequest) {
    if (!DEMO_MODE) return (await api.post('/api/v1/checkout/simulate', req)).data;
    return demoRepository.quote(req);
  },
  async checkout(req: SplitCheckoutRequest, idempotencyKey: string) {
    if (!DEMO_MODE) return (await api.post('/api/v1/checkout', req, { headers: { 'Idempotency-Key': idempotencyKey } })).data;
    return demoRepository.checkout(req, idempotencyKey);
  }
};
