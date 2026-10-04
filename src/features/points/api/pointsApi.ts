import api from '../../../lib/axios';
import { readDemoDB, requireDemoUser, transactDemoDB, nextDemoId } from '../../../lib/demoRepository';
import { DEMO_MODE } from '../../../lib/demoMode';

export interface PointsWallet { userId: number; balance: number; lockedBalance: number; availableBalance: number; updatedAt: string }
export interface LedgerEntry { id: number; idempotencyKey: string; type: 'credit' | 'debit'; amount: number; balanceAfter: number; referenceType: string; referenceId: string; description: string; createdAt: string }

export const PointsApi = {
  async getWallet(): Promise<PointsWallet> {
    if (!DEMO_MODE) return (await api.get('/api/v1/points/wallet')).data;
    const user = requireDemoUser('customer'); const db = readDemoDB();
    const balance = db.points[user.id] ?? 0;
    return { userId: Number(user.id), balance, lockedBalance: 0, availableBalance: balance, updatedAt: new Date().toISOString() };
  },
  async getHistory(): Promise<{ items: LedgerEntry[], total: number }> {
    if (!DEMO_MODE) return (await api.get('/api/v1/points/history')).data;
    const user = requireDemoUser('customer'); const db = readDemoDB();
    const items = db.ledger.filter(l => l.userId === user.id).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    return { items, total: items.length };
  },
  async creditPoints(amount: number, description: string, referenceId: string, customerId = '101'): Promise<void> {
    if (!DEMO_MODE) return (await api.post('/api/v1/points/credit', { amount, description, referenceId, customerId })).data;
    requireDemoUser('admin');
    if (!Number.isSafeInteger(amount) || amount <= 0) throw new Error('Invalid points amount');
    await transactDemoDB(db => {
      if (db.ledger.some(l => l.idempotencyKey === `pt-reward-${referenceId}`)) return;
      const balance = (db.points[customerId] ?? 0) + amount;
      db.points[customerId] = balance;
      db.ledger.push({ id: nextDemoId(db), userId: customerId, idempotencyKey: `pt-reward-${referenceId}`, type: 'credit', amount, balanceAfter: balance, referenceType: 'order_reward', referenceId, description, createdAt: new Date().toISOString() });
    });
  }
};
