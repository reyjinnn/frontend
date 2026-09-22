import api from '../../../lib/axios';
import type { Order, TrackingInfo } from '../types';
import { PointsApi } from '../../points/api/pointsApi';

let mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'TVB-20260901-001',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'unpaid',
    items: [
      {
        id: 'i1',
        productId: 'p1',
        productName: 'MacBook Pro M3 Max 16-inch 36GB/1TB',
        quantity: 1,
        price: 54999000,
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=200&h=200'
      }
    ],
    subtotal: 54999000,
    shippingFee: 150000,
    protectionFee: 45000,
    promoDiscount: 500000,
    grandTotal: 54694000,
    paymentMethod: 'Bank Transfer (BCA Virtual Account)',
    courier: 'JNE Express (YES)',
    estimatedArrival: '2-3 Hari Kerja',
    shippingAddress: 'Budi Santoso\nJl. Sudirman No. 123, Lt 4\nJakarta Pusat, 10220\n081234567890',
    hasTlater: false
  },
  {
    id: '2',
    orderNumber: 'TVB-20260910-002',
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: 'shipping',
    items: [
      {
        id: 'i2',
        productId: 'p2',
        productName: 'iPhone 15 Pro Max 256GB - Natural Titanium',
        quantity: 1,
        price: 24999000,
        imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=200&h=200'
      }
    ],
    subtotal: 24999000,
    shippingFee: 50000,
    protectionFee: 45000,
    promoDiscount: 0,
    grandTotal: 25094000,
    paymentMethod: 'TechVibe PayLater (Cicilan 3x)',
    courier: 'SiCepat (REG)',
    estimatedArrival: 'Besok',
    shippingAddress: 'Budi Santoso\nJl. Sudirman No. 123, Lt 4\nJakarta Pusat, 10220\n081234567890',
    hasTlater: true
  },
  {
    id: '3',
    orderNumber: 'TVB-20260912-003',
    date: new Date(Date.now() - 86400000 * 7).toISOString(),
    status: 'shipped',
    items: [
      {
        id: 'i3',
        productId: 'p3',
        productName: 'AirPods Pro (2nd Generation)',
        quantity: 1,
        price: 3999000,
        imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=200&h=200'
      }
    ],
    subtotal: 3999000,
    shippingFee: 0,
    protectionFee: 15000,
    promoDiscount: 0,
    grandTotal: 4014000,
    paymentMethod: 'Gopay',
    courier: 'GoSend (Instant)',
    estimatedArrival: 'Hari ini',
    shippingAddress: 'Budi Santoso\nJl. Sudirman No. 123, Lt 4\nJakarta Pusat, 10220\n081234567890',
    hasTlater: false
  },
  {
    id: '4',
    orderNumber: 'TVB-20260815-004',
    date: new Date(Date.now() - 86400000 * 30).toISOString(),
    status: 'completed',
    items: [
      {
        id: 'i4',
        productId: 'p4',
        productName: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
        quantity: 1,
        price: 5599000,
        imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=200&h=200'
      }
    ],
    subtotal: 5599000,
    shippingFee: 20000,
    protectionFee: 0,
    promoDiscount: 100000,
    grandTotal: 5519000,
    paymentMethod: 'Credit Card (Visa)',
    courier: 'JNT (Regular)',
    estimatedArrival: 'Tiba pada 17 Agustus 2026',
    shippingAddress: 'Budi Santoso\nJl. Sudirman No. 123, Lt 4\nJakarta Pusat, 10220\n081234567890',
    hasTlater: false
  }
];

export const OrdersApi = {
  getOrders: async (): Promise<Order[]> => {
    try {
      const res = await api.get('/api/v1/orders');
      return res.data;
    } catch (e) {
      // Simulate network delay
      return new Promise(resolve => setTimeout(() => resolve([...mockOrders]), 600));
    }
  },

  getOrder: async (orderNumber: string): Promise<Order> => {
    try {
      const res = await api.get(`/api/v1/orders/${orderNumber}`);
      return res.data;
    } catch (e) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const order = mockOrders.find(o => o.orderNumber === orderNumber);
          if (order) resolve({ ...order });
          else reject(new Error('Order not found'));
        }, 300);
      });
    }
  },

  cancelOrder: async (orderNumber: string): Promise<void> => {
    try {
      await api.post(`/api/v1/orders/${orderNumber}/cancel`);
    } catch (e) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const idx = mockOrders.findIndex(o => o.orderNumber === orderNumber);
          if (idx !== -1 && mockOrders[idx].status === 'unpaid') {
            mockOrders[idx].status = 'cancelled';
            resolve();
          } else {
            reject(new Error('Cannot cancel this order'));
          }
        }, 500);
      });
    }
  },

  completeOrder: async (orderNumber: string): Promise<void> => {
    try {
      await api.patch(`/api/v1/orders/${orderNumber}/complete`);
    } catch (e) {
      return new Promise((resolve, reject) => {
        setTimeout(async () => {
          const idx = mockOrders.findIndex(o => o.orderNumber === orderNumber);
          if (idx !== -1 && mockOrders[idx].status === 'shipped') {
            mockOrders[idx].status = 'completed';

            const cashback = Math.floor(mockOrders[idx].grandTotal * 0.01);
            await PointsApi.creditPoints(
              cashback,
              `Cashback 1% Pesanan ${orderNumber}`,
              orderNumber
            );

            resolve();
          } else {
            reject(new Error('Cannot complete this order'));
          }
        }, 600);
      });
    }
  },

  getTrackingInfo: async (orderId: string): Promise<TrackingInfo> => {
    try {
      const res = await api.get(`/api/v1/orders/${orderId}/tracking`);
      return res.data;
    } catch (e) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const order = mockOrders.find(o => o.id === orderId || o.orderNumber === orderId);
          resolve({
            orderId: order?.id || orderId,
            courierName: order?.courier || 'Kurir Standard',
            service: 'Regular',
            receiptNumber: `RESI-${Math.floor(Math.random() * 100000000)}`,
            currentStatus: order?.status === 'completed' ? 'Delivered' : 
                          order?.status === 'shipped' ? 'On Delivery' : 
                          order?.status === 'shipping' ? 'Packed' : 'Pending',
            timeline: [
              {
                id: 't1',
                status: 'Pesanan Selesai Dikemas',
                description: 'Paket telah selesai dikemas di Gudang TechVibe Official Store.',
                timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
                completed: true,
                active: false
              },
              {
                id: 't2',
                status: 'Diserahkan ke Agen Kurir',
                description: 'Paket telah diserahkan ke Hub Logistik kurir.',
                timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(),
                completed: order?.status === 'shipped' || order?.status === 'completed',
                active: order?.status === 'shipping'
              },
              {
                id: 't3',
                status: 'Dalam Perjalanan',
                description: 'Paket sedang dalam perjalanan menuju kota tujuan.',
                timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
                completed: order?.status === 'completed',
                active: order?.status === 'shipped'
              },
              {
                id: 't4',
                status: 'Kurir Menuju Alamat',
                description: 'Kurir sedang mengantar paket ke alamat penerima.',
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                completed: order?.status === 'completed',
                active: order?.status === 'shipped' && false 
              }
            ]
          });
        }, 500);
      });
    }
  }
};
