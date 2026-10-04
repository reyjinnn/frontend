import { beforeEach, describe, expect, it } from 'vitest';
import { AdminApi } from './adminApi';
import { demoRepository, readDemoDB, mutateDemoDB, SESSION_KEY } from '../../../lib/demoRepository';

const store = new Map<string, string>();
const storage = { getItem: (key: string) => store.get(key) ?? null, setItem: (key: string, value: string) => { store.set(key, value); }, removeItem: (key: string) => { store.delete(key); } };
Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true });
Object.defineProperty(globalThis, 'sessionStorage', { value: storage, configurable: true });
beforeEach(() => {
  store.clear();
  demoRepository.init([{ id: 201, categoryId: 1, sku: 'P', name: 'Phone', slug: 'phone', description: 'Phone', price: 1000, weightGrams: 100, status: 'active', stock: 2, images: [{id: 1, imageUrl: '/phone.jpg', isPrimary: true}] }], [], [], [], []);
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id: 'admin1' }));
});
describe('admin repository integration', () => {
  it('guards writes and resets only with an admin session', async () => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id: '101' }));
    expect(() => AdminApi.resetDemo()).toThrow('Unauthorized');
    expect(readDemoDB().customers).toHaveLength(5);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id: 'admin1' }));
    await AdminApi.resetDemo();
    expect(readDemoDB().customers).toHaveLength(0);
    expect(readDemoDB().orders).toHaveLength(0);
    expect(readDemoDB().settings.pointValue).toBe(1);
  });
  it('persists product edits and point adjustment idempotently', async () => {
    await AdminApi.saveProduct({ ...readDemoDB().products[0], stock: 8 });
    await AdminApi.adjustPoints('101', -100, 'Correction', 'adjust-1');
    await AdminApi.adjustPoints('101', -100, 'Correction', 'adjust-1');
    expect(readDemoDB().products[0].stock).toBe(8);
    expect(readDemoDB().points['101']).toBe(49900);
    expect(readDemoDB().ledger).toHaveLength(1);
    expect(AdminApi.snapshot().customers[0].password).toBeUndefined();
  });
  it('shares payment, shipment and refund with customer orders', async () => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id: '101' }));
    const result = await demoRepository.checkout({ items: [{productId: 201, quantity: 1}], usePoints: 100 }, 'checkout');
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id: 'admin1' }));
    await AdminApi.orderAction(result.order.orderNumber, 'paid');
    await AdminApi.orderAction(result.order.orderNumber, 'ship', 'TV-123');
    await AdminApi.orderAction(result.order.orderNumber, 'track', 'Jakarta Hub');
    expect(readDemoDB().orders[0].tracking?.receiptNumber).toBe('TV-123');
    expect(readDemoDB().orders[0].tracking?.timeline).toHaveLength(2);
    mutateDemoDB(db => { db.refunds.push({id: 999, orderNumber: result.order.orderNumber, userId: '101', reason: 'Return', status: 'pending', cashAmount: 0}); });
    await AdminApi.decideRefund(999, true);
    expect(readDemoDB().orders[0].status).toBe('cancelled');
    expect(readDemoDB().products[0].stock).toBe(2);
    expect(readDemoDB().points['101']).toBe(50000);
    expect(readDemoDB().refunds[0].cashAmount).toBe(25900);
    await expect(AdminApi.decideRefund(999, true)).rejects.toThrow('Refund tidak pending');
  });
  it('persists KYC decisions and correctly identifies admin replies', async () => {
    mutateDemoDB(db => {
      db.customers[0].kycStatus = 'pending';
      db.kyc.push({userId: 101, name: 'Raihan', nik: '1234567890123456', dateOfBirth: '1990-01-01', address: 'Jakarta', ktpImageUrl: '/ktp.jpg', selfieImageUrl: '/selfie.jpg', status: 'pending', submittedAt: '2026-10-01'});
      db.tickets.push({id: 't1', userId: '101', ticketNumber: 'T1', subject: 'Help', category: 'Pesanan', status: 'open', priority: 'low', createdAt: '2026-10-01', updatedAt: '2026-10-01', messages: []});
    });
    await AdminApi.verifyKyc(101, false, 'Dokumen buram');
    await AdminApi.replyTicket('t1', 'Silakan unggah ulang');
    expect(readDemoDB().customers[0].kycStatus).toBe('rejected');
    expect(readDemoDB().kyc.find(k => k.userId === 101)?.reason).toBe('Dokumen buram');
    expect(readDemoDB().tickets[0].messages[0].isAdmin).toBe(true);
    expect(readDemoDB().notifications).toHaveLength(2);
  });
});
