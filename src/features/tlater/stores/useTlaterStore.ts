import { create } from 'zustand';
import { TlaterApi } from '../api/tlaterApi';
import type { TlaterAccount, TlaterLoan } from '../api/tlaterApi';

interface TlaterState {
  account: TlaterAccount | null;
  loans: TlaterLoan[];
  isLoading: boolean;
  fetchData: () => Promise<void>;
}

export const useTlaterStore = create<TlaterState>((set) => ({
  account: null,
  loans: [],
  isLoading: false,
  fetchData: async () => {
    set({ isLoading: true });
    try {
      const [accountRes, loansRes] = await Promise.all([
        TlaterApi.getAccount(),
        TlaterApi.getLoans()
      ]);
      set({ account: accountRes, loans: loansRes.items, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
    }
  }
}));
