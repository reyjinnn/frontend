import api from '../../../lib/axios';
import type { AppNotification } from '../types';

let mockNotifications: AppNotification[] = [
  {
    id: 'n1',
    type: 'order',
    title: 'Pesanan Telah Dikirim',
    message: 'Hore! Pesanan iPhone 15 Pro Max Anda sedang dalam perjalanan dengan kurir SiCepat.',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    referenceId: 'TVB-20260910-002'
  },
  {
    id: 'n2',
    type: 'promo',
    title: 'Flash Sale: Diskon 50%!',
    message: 'Jangan lewatkan Flash Sale aksesoris Apple diskon hingga 50%. Berlaku hari ini saja.',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'n3',
    type: 'ticket',
    title: 'Balasan Tiket #TVC-20260901-001',
    message: 'Tim Customer Success telah membalas tiket Anda mengenai klaim garansi.',
    isRead: false,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    referenceId: 'TVC-20260901-001'
  },
  {
    id: 'n4',
    type: 'tlater',
    title: 'Tagihan TLater Bulan Ini',
    message: 'Tagihan TechVibe Later Anda sebesar Rp 1.500.000 akan jatuh tempo dalam 3 hari. Bayar sekarang untuk menghindari denda.',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

export const NotificationsApi = {
  getNotifications: async (): Promise<AppNotification[]> => {
    try {
      const res = await api.get('/api/v1/notifications');
      return res.data;
    } catch (e) {
      return new Promise(resolve => setTimeout(() => resolve([...mockNotifications]), 400));
    }
  },

  markAsRead: async (id: string): Promise<void> => {
    try {
      await api.patch(`/api/v1/notifications/${id}/read`);
    } catch (e) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const idx = mockNotifications.findIndex(n => n.id === id);
          if (idx !== -1) {
            mockNotifications[idx].isRead = true;
          }
          resolve();
        }, 200);
      });
    }
  },

  markAllAsRead: async (): Promise<void> => {
    try {
      await api.patch('/api/v1/notifications/read-all');
    } catch (e) {
      return new Promise((resolve) => {
        setTimeout(() => {
          mockNotifications = mockNotifications.map(n => ({ ...n, isRead: true }));
          resolve();
        }, 300);
      });
    }
  }
};
