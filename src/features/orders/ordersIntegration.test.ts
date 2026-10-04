import { beforeEach, expect, it } from 'vitest';
import { demoRepository, mutateDemoDB, readDemoDB, SESSION_KEY } from '../../lib/demoRepository';
import { OrdersApi } from './api/ordersApi';
import { CheckoutApi } from '../checkout/api/checkoutApi';

const values = new Map<string, string>();
const storage = {
  getItem: (key: string) => values.get(key) ?? null,
  setItem: (key: string, value: string) => { values.set(key, value); },
  removeItem: (key: string) => { values.delete(key); },
  clear: () => values.clear(),
};
Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true });
Object.defineProperty(globalThis, 'sessionStorage', { value: storage, configurable: true });

beforeEach(() => {
  sessionStorage.clear();
  localStorage.clear();
  demoRepository.init(
    [
      { id: 201, categoryId: 1, sku: 'SKU-1', name: 'Item 1', slug: 'item-1', description: 'Desc', price: 100000, weightGrams: 500, status: 'active', stock: 5, images: [{ id: 1, imageUrl: '/img.jpg', isPrimary: true }] }
    ],
    [],
    [],
    [],
    []
  );
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id: '101' }));
});

it('prevents guests from retrieving customer orders directly', async () => {
  sessionStorage.clear();
  await expect(OrdersApi.getOrders()).rejects.toThrow('Unauthorized');
});

it('supports failed payment retry and expiration with inventory restored', async () => {
  const res = await CheckoutApi.checkout({ items: [{ productId: 201, quantity: 1 }], shippingCity: 'Jakarta' }, 'expire-check');
  const orderNumber = res.order.orderNumber;
  expect((await OrdersApi.simulatePayment(orderNumber, false)).payment?.status).toBe('failed');
  expect(readDemoDB().orders.find(o => o.orderNumber === orderNumber)?.status).toBe('unpaid');
  await OrdersApi.expirePayment(orderNumber);
  expect(readDemoDB().orders.find(o => o.orderNumber === orderNumber)?.payment?.status).toBe('expired');
  expect(readDemoDB().orders.find(o => o.orderNumber === orderNumber)?.status).toBe('cancelled');
  expect(readDemoDB().products[0].stock).toBe(5);
});

it('completes order lifecycle from simulate payment to completion reward', async () => {
  const quote = await CheckoutApi.simulateCheckout({
    items: [{ productId: 201, quantity: 2 }],
    shippingCity: 'Jakarta'
  });
  expect(quote.totalItemAmount).toBe(200000);
  expect(quote.grandTotal).toBe(225000);

  const res = await CheckoutApi.checkout({
    items: [{ productId: 201, quantity: 2 }],
    shippingCity: 'Jakarta'
  }, 'order-idempotent-key-1');

  expect(res.order.status).toBe('unpaid');
  expect(readDemoDB().products[0].stock).toBe(3);

  const paidOrder = await OrdersApi.simulatePayment(res.order.orderNumber, true);
  expect(paidOrder.status).toBe('shipping');

  mutateDemoDB(db => {
    const o = db.orders.find(x => x.orderNumber === res.order.orderNumber);
    if (o) o.status = 'shipped';
  });

  const prevPoints = readDemoDB().points['101'];
  await OrdersApi.completeOrder(res.order.orderNumber);
  expect(readDemoDB().orders.find(x => x.orderNumber === res.order.orderNumber)?.status).toBe('completed');
  expect(readDemoDB().points['101']).toBeGreaterThan(prevPoints);
});
