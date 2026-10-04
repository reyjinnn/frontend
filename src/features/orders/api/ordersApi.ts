import api from '../../../lib/axios';
import type { Order, TrackingInfo } from '../types';
import { demoRepository, requireDemoUser, transactDemoDB, nextDemoId } from '../../../lib/demoRepository';
import { DEMO_MODE } from '../../../lib/demoMode';

export const legacyOrderSeed: Order[] = [
  { id: '1', orderNumber: 'TVB-20260901-001', date: '2026-09-01', status: 'unpaid', items: [{ id: 'i1', productId: '207', productName: 'Apple MacBook Pro 14 M3 Pro 18GB/512GB', quantity: 1, price: 35999000, imageUrl: '/images/products/macbook-pro-14.webp' }], subtotal: 35999000, shippingFee: 150000, protectionFee: 45000, promoDiscount: 500000, grandTotal: 35694000, paymentMethod: 'Bank Transfer (BCA Virtual Account)', courier: 'JNE Express (YES)', estimatedArrival: '2-3 Hari Kerja', shippingAddress: 'Budi Santoso\nJl. Sudirman No. 123, Lt 4\nJakarta Pusat, 10220\n081234567890', hasTlater: false },
  { id: '2', orderNumber: 'TVB-20260910-002', date: '2026-09-10', status: 'shipping', items: [{ id: 'i2', productId: '201', productName: 'iPhone 15 128GB - Black Titanium', quantity: 1, price: 14299000, imageUrl: '/images/products/iphone-15.jpg' }], subtotal: 14299000, shippingFee: 50000, protectionFee: 45000, promoDiscount: 0, grandTotal: 14394000, paymentMethod: 'TechVibe PayLater (Cicilan 3x)', courier: 'SiCepat (REG)', estimatedArrival: 'Besok', shippingAddress: 'Budi Santoso\nJl. Sudirman No. 123, Lt 4\nJakarta Pusat, 10220\n081234567890', hasTlater: true },
  { id: '3', orderNumber: 'TVB-20260912-003', date: '2026-09-12', status: 'shipped', items: [{ id: 'i3', productId: '223', productName: 'Apple AirPods (3rd Generation)', quantity: 1, price: 2999000, imageUrl: '/images/products/airpods-3.webp' }], subtotal: 2999000, shippingFee: 0, protectionFee: 15000, promoDiscount: 0, grandTotal: 3014000, paymentMethod: 'Gopay', courier: 'GoSend (Instant)', estimatedArrival: 'Hari ini', shippingAddress: 'Budi Santoso\nJl. Sudirman No. 123, Lt 4\nJakarta Pusat, 10220\n081234567890', hasTlater: false },
  { id: '4', orderNumber: 'TVB-20260815-004', date: '2026-08-15', status: 'completed', items: [{ id: 'i4', productId: '222', productName: 'Sony WH-1000XM4 Wireless Noise Cancelling Headphones', quantity: 1, price: 4299000, imageUrl: '/images/products/sony-wh-1000xm4.jpg' }], subtotal: 4299000, shippingFee: 20000, protectionFee: 0, promoDiscount: 100000, grandTotal: 4219000, paymentMethod: 'Credit Card (Visa)', courier: 'JNT (Regular)', estimatedArrival: 'Tiba pada 17 Agustus 2026', shippingAddress: 'Budi Santoso\nJl. Sudirman No. 123, Lt 4\nJakarta Pusat, 10220\n081234567890', hasTlater: false }
];

if (DEMO_MODE) demoRepository.init([], legacyOrderSeed, [], [], []);

export const OrdersApi = {
  async getOrders(): Promise<Order[]> {
    if (!DEMO_MODE) return (await api.get('/api/v1/orders')).data;
    const user = requireDemoUser();
    return demoRepository.read().orders.filter(o => user.role === 'admin' || o.userId === user.id);
  },
  async getOrder(orderNumber: string): Promise<Order> {
    if (!DEMO_MODE) return (await api.get(`/api/v1/orders/${orderNumber}`)).data;
    const order = (await this.getOrders()).find((o: Order) => o.orderNumber === orderNumber || o.id === orderNumber);
    if (!order) throw new Error('Order not found');
    return order;
  },
  async cancelOrder(orderNumber: string): Promise<void> {
    if (!DEMO_MODE) { await api.post(`/api/v1/orders/${orderNumber}/cancel`); return; }
    await demoRepository.cancel(orderNumber);
  },
  async completeOrder(orderNumber: string): Promise<void> {
    if (!DEMO_MODE) { await api.patch(`/api/v1/orders/${orderNumber}/complete`); return; }
    await demoRepository.complete(orderNumber);
  },
  async expirePayment(orderNumber: string): Promise<void> {
    if (!DEMO_MODE) { await api.post(`/api/v1/orders/${orderNumber}/expire`); return; }
    await demoRepository.expirePayment(orderNumber);
  },
  async simulatePayment(orderNumber: string, success = true) { return demoRepository.pay(orderNumber, success); },
  async getTrackingInfo(orderId: string): Promise<TrackingInfo> {
    if (!DEMO_MODE) return (await api.get(`/api/v1/orders/${orderId}/tracking`)).data;
    const order = await this.getOrder(orderId);
    return demoRepository.read().orders.find(o => o.id === order.id)?.tracking ?? { orderId: order.id, courierName: order.courier, service: 'Regular', receiptNumber: '', currentStatus: order.status, timeline: [] };
  },
  async shipOrder(orderNumber: string, receiptNumber: string): Promise<void> {
    requireDemoUser('admin');
    if (!receiptNumber.trim()) throw new Error('Receipt required');
    await transactDemoDB(db => {
      const order = db.orders.find(o => o.orderNumber === orderNumber || o.id === orderNumber);
      if (!order || order.status !== 'shipping') throw new Error('Order not ready for shipping');
      order.status = 'shipped';
      order.tracking = { orderId: order.id, courierName: order.courier, service: 'Regular', receiptNumber, currentStatus: 'On Delivery', timeline: [{ id: String(nextDemoId(db)), status: 'Diserahkan ke Agen Kurir', description: receiptNumber, timestamp: new Date().toISOString(), completed: true, active: true }] };
    });
  }
};
