import { describe, expect, it } from 'vitest';
import { calculateAmortization } from './financial';
import { demoRepository, readDemoDB, mutateDemoDB, SESSION_KEY, DB_KEY } from './demoRepository';

const store = new Map<string, string>();
Object.defineProperty(globalThis, 'localStorage', { value: { getItem: (key: string) => store.get(key) ?? null, setItem: (key: string, value: string) => store.set(key, value), removeItem: (key: string) => store.delete(key) } });
Object.defineProperty(globalThis, 'sessionStorage', { value: { getItem: (key: string) => store.get(key) ?? null, setItem: (key: string, value: string) => store.set(key, value), removeItem: (key: string) => store.delete(key) } });

describe('demo repository', () => {
  it('rounds principal, interest and admin fee into exact loan total', () => {
    const result = calculateAmortization(1001, 3, 2.5, 17);
    expect(result.installments.reduce((n, i) => n + i.totalDue, 0)).toBe(result.totalLoanAmount);
    expect(result.installments.reduce((n, i) => n + i.principalDue, 0)).toBe(1001);
  });
  it('keeps checkout idempotent and releases reservations on cancellation', async () => {
    store.clear();
    demoRepository.init([{ id: 201, categoryId: 1, sku: 'P', name: 'Phone', slug: 'phone', description: '', price: 1000, weightGrams: 100, status: 'active', stock: 2, images: [] }], [], [], [], []);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id: '101' }));
    const request = { items: [{ productId: 201, quantity: 1 }], usePoints: 100 };
    const first = await demoRepository.checkout(request, 'key-1');
    expect((await demoRepository.checkout(request, 'key-1')).order.orderNumber).toBe(first.order.orderNumber);
    expect(readDemoDB().products[0].stock).toBe(1);
    expect(readDemoDB().points['101']).toBe(49900);
    await demoRepository.cancel(first.order.orderNumber);
    expect(readDemoDB().products[0].stock).toBe(2);
    expect(readDemoDB().points['101']).toBe(50000);
  });
  it('restores only repaid principal', async () => {
    store.clear();
    demoRepository.init([{ id: 201, categoryId: 1, sku: 'P', name: 'Phone', slug: 'phone', description: '', price: 1001, weightGrams: 100, status: 'active', stock: 2, images: [] }], [], [], [], []);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id: '101' }));
    mutateDemoDB(db => { db.customers[0].kycStatus = 'verified'; });
    await demoRepository.checkout({ items: [{ productId: 201, quantity: 1 }], useTlater: true, tlaterTenor: 3 }, 'key-2');
    const installment = readDemoDB().loans[0].installments[0];
    const result = await demoRepository.repay(installment.id, installment.totalDue, 'repayment-1');
    const limit = 10000000 - 26001 + installment.principalDue;
    expect(result.newAvailableLimit).toBe(limit);
    expect((await demoRepository.repay(installment.id, installment.totalDue, 'repayment-1')).newAvailableLimit).toBe(result.newAvailableLimit);
  });
  it('validates corrupted json fallback and notes persistence in checkout', async () => {
    store.clear();
    demoRepository.init([{ id: 201, categoryId: 1, sku: 'P', name: 'Phone', slug: 'phone', description: '', price: 1000, weightGrams: 100, status: 'active', stock: 2, images: [] }], [], [], [], []);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id: '101' }));
    const result = await demoRepository.checkout({ items: [{ productId: 201, quantity: 1 }], notes: 'Gagang pintu warna abu' }, 'key-note');
    expect(readDemoDB().orders[0].notes).toBe('Gagang pintu warna abu');
    expect(result.order.orderNumber).toBeDefined();

    store.set(DB_KEY, '{invalid-json');
    expect(readDemoDB().version).toBe(1);
    expect(() => mutateDemoDB(db => { db.version = 1; })).toThrow('Invalid demo database; data preserved');
  });
});
