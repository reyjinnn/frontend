import api from '../../../lib/axios';

export interface PointsWallet {
  userId: number;
  balance: number;
  lockedBalance: number;
  availableBalance: number;
  updatedAt: string;
}

export interface LedgerEntry {
  id: number;
  idempotencyKey: string;
  type: 'credit' | 'debit';
  amount: number;
  balanceAfter: number;
  referenceType: string;
  referenceId: string;
  description: string;
  createdAt: string;
}

export let mockWallet: PointsWallet = {
  userId: 101,
  balance: 50000,
  lockedBalance: 0,
  availableBalance: 50000,
  updatedAt: new Date().toISOString()
};

export const mockLedger: LedgerEntry[] = [
  {
    id: 901,
    idempotencyKey: "pt-reward-TV-801A",
    type: "credit",
    amount: 50000,
    balanceAfter: 50000,
    referenceType: "order_reward",
    referenceId: "TV-20260920-801A",
    description: "Reward Registrasi Akun Perdana",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export const PointsApi = {
  getWallet: async (): Promise<PointsWallet> => {
    try {
      const res = await api.get('/api/v1/points/wallet');
      return res.data;
    } catch (e) {
      return mockWallet;
    }
  },

  getHistory: async (): Promise<{ items: LedgerEntry[], total: number }> => {
    try {
      const res = await api.get('/api/v1/points/history');
      return res.data;
    } catch (e) {
      return { items: mockLedger, total: mockLedger.length };
    }
  },

  creditPoints: async (amount: number, description: string, referenceId: string): Promise<void> => {
    
    return new Promise((resolve) => {
      setTimeout(() => {
        mockWallet.balance += amount;
        mockWallet.availableBalance += amount;
        mockWallet.updatedAt = new Date().toISOString();
        
        mockLedger.unshift({
          id: Date.now(),
          idempotencyKey: `pt-reward-${referenceId}-${Date.now()}`,
          type: 'credit',
          amount,
          balanceAfter: mockWallet.availableBalance,
          referenceType: 'order_reward',
          referenceId,
          description,
          createdAt: new Date().toISOString()
        });
        resolve();
      }, 500);
    });
  }
};
