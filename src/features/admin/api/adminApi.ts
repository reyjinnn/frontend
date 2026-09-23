import api from '../../../lib/axios';

// Interfaces
export interface KycApplication {
  userId: number;
  nik: string;
  name: string;
  dateOfBirth: string;
  address: string;
  ktpImageUrl: string;
  selfieImageUrl: string;
  status: 'pending' | 'verified' | 'rejected';
  submittedAt: string;
}

export interface PromoData {
  id?: number;
  code: string;
  title: string;
  promoType: string;
  discountType: string;
  discountValue: number;
  minPurchase: number;
  maxDiscount: number;
  quotaTotal: number;
  quotaRemaining?: number;
  startDate: string;
  endDate: string;
  isActive?: boolean;
}

// Mock Data
let mockKycApplications: KycApplication[] = [
  {
    userId: 202,
    nik: '3201234567890001',
    name: 'Siti Aminah',
    dateOfBirth: '1995-08-20',
    address: 'Jl. Melati No. 12, Bandung',
    ktpImageUrl: 'https://images.unsplash.com/photo-1621508688407-1605a96860db?w=400',
    selfieImageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    status: 'pending',
    submittedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

let mockPromos: PromoData[] = [
  {
    id: 1,
    code: "NEWVIBE50",
    title: "Diskon Pelanggan Baru",
    promoType: "voucher",
    discountType: "fixed",
    discountValue: 50000,
    minPurchase: 500000,
    maxDiscount: 50000,
    quotaTotal: 1000,
    quotaRemaining: 850,
    startDate: new Date(Date.now() - 86400000 * 30).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 30).toISOString(),
    isActive: true
  }
];

export const AdminApi = {
  // KYC Risk
  getKycApplications: async (): Promise<KycApplication[]> => {
    try {
      const res = await api.get('localhost:3000/api/v1/kyc/admin/applications');
      return res.data;
    } catch (e) {
      return new Promise(resolve => setTimeout(() => resolve([...mockKycApplications]), 500));
    }
  },
  
  verifyKyc: async (userId: number, approved: boolean, reason?: string): Promise<void> => {
    try {
      await api.patch(`localhost:3000/api/v1/kyc/admin/verify/${userId}`, { approved, reason });
    } catch (e) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const idx = mockKycApplications.findIndex(k => k.userId === userId);
          if (idx !== -1) {
            mockKycApplications[idx].status = approved ? 'verified' : 'rejected';
          }
          resolve();
        }, 500);
      });
    }
  },

  // Promos
  getPromos: async (): Promise<PromoData[]> => {
    try {
      const res = await api.get('localhost:3000/api/v1/admin/promos');
      return res.data;
    } catch (e) {
      return new Promise(resolve => setTimeout(() => resolve([...mockPromos]), 500));
    }
  },

  createPromo: async (payload: PromoData): Promise<PromoData> => {
    try {
      const res = await api.post('localhost:3000/api/v1/admin/promos', payload);
      return res.data;
    } catch (e) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newPromo: PromoData = {
            ...payload,
            id: Date.now(),
            quotaRemaining: payload.quotaTotal,
            isActive: true
          };
          mockPromos.unshift(newPromo);
          resolve(newPromo);
        }, 600);
      });
    }
  },

  // Products
  addProduct: async (payload: any): Promise<any> => {
    try {
      const res = await api.post('localhost:3000/api/v1/catalog/products', payload);
      return res.data;
    } catch (e) {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ id: Date.now(), ...payload }), 800);
      });
    }
  }
};
