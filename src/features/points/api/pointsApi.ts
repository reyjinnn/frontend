import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1/points',
});

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

const mockWallet: PointsWallet = {
  userId: 101,
  balance: 50000,
  lockedBalance: 0,
  availableBalance: 50000,
  updatedAt: new Date().toISOString()
};

const mockLedger: LedgerEntry[] = [
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
      const res = await api.get('/wallet');
      return res.data;
    } catch (e) {
      return mockWallet;
    }
  },

  getHistory: async (): Promise<{ items: LedgerEntry[], total: number }> => {
    try {
      const res = await api.get('/history');
      return res.data;
    } catch (e) {
      return { items: mockLedger, total: mockLedger.length };
    }
  }
};
