import api from '../../../lib/axios';
import { readDemoDB, requireDemoUser, transactDemoDB, nextDemoId, DEFAULT_SETTINGS, type DemoDB } from '../../../lib/demoRepository';
import { DEMO_MODE } from '../../../lib/demoMode';
import type { Product } from '../../../services/catalog.service';

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
  reason?: string;
  reviewedAt?: string;
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

function integer(value: number, min = 0) {
  if (!Number.isSafeInteger(value) || value < min) throw new Error('Nilai harus bilangan bulat valid');
}
function text(value: string) {
  if (!value?.trim()) throw new Error('Kolom wajib diisi');
}
function write<T>(fn: (db: DemoDB) => T) {
  requireDemoUser('admin');
  if (!DEMO_MODE) throw new Error('Operasi ini hanya tersedia dalam demo; API backend belum tersedia');
  return transactDemoDB(db => { requireDemoUser('admin'); return fn(db); });
}
function notify(db: DemoDB, userId: string, type: 'order' | 'ticket' | 'tlater', title: string, message: string, referenceId: string) {
  db.notifications.unshift({ id: String(nextDemoId(db)), userId, type, title, message, referenceId, isRead: false, createdAt: new Date().toISOString() });
}
function reverseOrder(db: DemoDB, order: DemoDB['orders'][number], refund: boolean) {
  for (const item of order.items) {
    const product = db.products.find(p => String(p.id) === item.productId);
    if (product) product.stock += item.quantity;
  }
  const debits = db.ledger.filter(e => e.userId === order.userId && e.referenceId === order.orderNumber && e.type === 'debit' && e.referenceType === 'order');
  const restored = debits.length ? debits.reduce((sum, e) => sum + e.amount, 0) : order.pointsUsed / db.settings.pointValue;
  const reward = refund ? db.ledger.find(e => e.idempotencyKey === `reward-${order.orderNumber}`)?.amount ?? 0 : 0;
  const balance = (db.points[order.userId] ?? 0) + restored - reward;
  if (balance < 0 || !Number.isSafeInteger(balance)) throw new Error('Saldo poin tidak cukup untuk reversal; tinjau ledger dahulu');
  db.points[order.userId] = balance;
  for (const [type, amount, key] of [['credit', restored, 'reverse'], ['debit', reward, 'reward-reverse']] as const) {
    if (amount) db.ledger.push({ id: nextDemoId(db), userId: order.userId, idempotencyKey: `${key}-${order.orderNumber}`, type, amount, balanceAfter: type === 'credit' ? balance + reward : balance, referenceType: 'order_reversal', referenceId: order.orderNumber, description: refund ? 'Refund admin' : 'Pembatalan admin', createdAt: new Date().toISOString() });
  }
  const loan = db.loans.find(l => l.loan.id === order.loanId);
  if (loan?.installments.some(i => i.totalPaid > 0)) throw new Error('Pinjaman telah dibayar sebagian; rekonsiliasi manual diperlukan');
  if (loan) db.loans.splice(db.loans.indexOf(loan), 1);
  order.status = 'cancelled';
}

export const AdminApi = {
  resetDemo() {
    return write(db => {
      Object.assign(db, {
        version: 1, sequence: 1000, seeded: ['customers', 'products', 'orders', 'promos', 'tickets', 'kyc'], customers: [], products: [], orders: [], carts: {},
        wishlists: {}, addresses: {}, kyc: [], loans: [], points: {}, ledger: [],
        tickets: [], notifications: [], promos: [], reviews: [], refunds: [], shipping: [],
        settings: { ...DEFAULT_SETTINGS }
      });
    });
  },
  snapshot(): DemoDB {
    requireDemoUser('admin');
    if (!DEMO_MODE) throw new Error('Dashboard repository hanya tersedia dalam demo');
    const db = readDemoDB();
    db.customers = db.customers.map(({ password, ...customer }) => { void password; return customer; });
    return db;
  },
  async getKycApplications(): Promise<KycApplication[]> {
    requireDemoUser('admin');
    if (!DEMO_MODE) return (await api.get('/api/v1/kyc/admin/applications')).data;
    return readDemoDB().kyc;
  },
  async verifyKyc(userId: number, approved: boolean, reason?: string): Promise<void> {
    requireDemoUser('admin');
    if (!approved) text(reason ?? '');
    if (!DEMO_MODE) { await api.patch(`/api/v1/kyc/admin/verify/${userId}`, { approved, reason }); return; }
    await write(db => {
      const customer = db.customers.find(c => c.id === String(userId) && c.role === 'customer');
      const application = db.kyc.find(k => k.userId === userId && k.status === 'pending');
      if (!customer || !application) throw new Error('KYC tidak dalam antrean');
      customer.kycStatus = application.status = approved ? 'verified' : 'rejected';
      application.reason = reason?.trim();
      application.reviewedAt = new Date().toISOString();
      notify(db, customer.id, 'tlater', approved ? 'KYC disetujui' : 'KYC ditolak', approved ? 'TLater sudah tersedia.' : reason!.trim(), String(userId));
    });
  },
  async getPromos(): Promise<PromoData[]> {
    requireDemoUser('admin');
    if (!DEMO_MODE) return (await api.get('/api/v1/admin/promos')).data;
    return readDemoDB().promos;
  },
  async createPromo(payload: PromoData): Promise<PromoData> { return this.savePromo(payload); },
  async savePromo(payload: PromoData): Promise<PromoData> {
    text(payload.code); text(payload.title);
    if (!['fixed', 'percentage'].includes(payload.discountType) || payload.promoType !== 'voucher') throw new Error('Hanya voucher fixed/percentage didukung checkout');
    [payload.discountValue, payload.minPurchase, payload.maxDiscount, payload.quotaTotal].forEach(v => integer(v));
    if (payload.discountType === 'percentage' && payload.discountValue > 100) throw new Error('Persentase maksimal 100');
    if (!Number.isFinite(Date.parse(payload.startDate)) || !Number.isFinite(Date.parse(payload.endDate)) || Date.parse(payload.startDate) > Date.parse(payload.endDate)) throw new Error('Tanggal promo tidak valid');
    return write(db => {
      const code = payload.code.trim().toUpperCase();
      if (db.promos.some(p => p.code === code && p.id !== payload.id)) throw new Error('Kode promo sudah dipakai');
      const old = payload.id === undefined ? undefined : db.promos.find(p => p.id === payload.id);
      if (payload.id !== undefined && !old) throw new Error('Promo tidak ditemukan');
      const used = old ? old.quotaTotal - (old.quotaRemaining ?? 0) : 0;
      if (payload.quotaTotal < used) throw new Error('Kuota lebih kecil dari penggunaan');
      const promo = { ...payload, code, id: old?.id ?? nextDemoId(db), quotaRemaining: payload.quotaTotal - used, isActive: payload.isActive ?? true };
      if (old) Object.assign(old, promo); else db.promos.unshift(promo);
      return promo;
    });
  },
  deletePromo(code: string) {
    return write(db => {
      const promo = db.promos.find(p => p.code === code);
      if (!promo) throw new Error('Promo tidak ditemukan');
      if ((promo.quotaRemaining ?? 0) < promo.quotaTotal) throw new Error('Promo terpakai; nonaktifkan, jangan hapus');
      db.promos.splice(db.promos.indexOf(promo), 1);
    });
  },
  togglePromo(code: string) { return write(db => { const p = db.promos.find(p => p.code === code); if (!p) throw new Error('Promo tidak ditemukan'); p.isActive = !p.isActive; }); },
  async addProduct(payload: Omit<Product, 'id'>): Promise<Product> { return this.saveProduct(payload); },
  saveProduct(payload: Omit<Product, 'id'> & { id?: number }): Promise<Product> {
    [payload.name, payload.sku, payload.slug, payload.description].forEach(text);
    [payload.price, payload.stock, payload.weightGrams].forEach(v => integer(v)); integer(payload.categoryId, 1);
    if (payload.originalPrice !== undefined) integer(payload.originalPrice);
    if (!['active', 'draft', 'archived'].includes(payload.status)) throw new Error('Status produk tidak valid');
    if (!payload.images.length || payload.images.some(i => !/^(\/[^/]|https?:\/\/|data:image\/(png|jpeg|webp);base64,)/.test(i.imageUrl))) throw new Error('Gambar harus path lokal, HTTP(S), atau data gambar');
    return write(db => {
      if (db.products.some(p => p.id !== payload.id && (p.sku === payload.sku || p.slug === payload.slug))) throw new Error('SKU atau slug sudah ada');
      const old = db.products.find(p => p.id === payload.id);
      if (payload.id !== undefined && !old) throw new Error('Produk tidak ditemukan');
      const product = { ...payload, id: old?.id ?? nextDemoId(db) };
      if (old) Object.assign(old, product); else db.products.push(product);
      return product;
    });
  },
  archiveProducts(ids: number[]) { return write(db => { if (!ids.length || ids.some(id => !db.products.some(p => p.id === id))) throw new Error('Pilih produk valid'); db.products.filter(p => ids.includes(p.id)).forEach(p => { p.status = 'archived'; }); }); },
  deleteProduct(id: number) { return write(db => {
    const p = db.products.find(p => p.id === id); if (!p) throw new Error('Produk tidak ditemukan');
    if (db.orders.some(o => o.items.some(i => i.productId === String(id)))) throw new Error('Produk memiliki riwayat pesanan; arsipkan');
    db.products.splice(db.products.indexOf(p), 1);
    Object.values(db.carts).forEach(items => { for (let i = items.length - 1; i >= 0; i--) if (items[i].productId === id) items.splice(i, 1); });
    Object.keys(db.wishlists).forEach(key => { db.wishlists[key] = db.wishlists[key].filter(value => value !== id); });
  }); },
  orderAction(orderNumber: string, action: 'paid' | 'failed' | 'expired' | 'cancel' | 'ship' | 'track', value = '') {
    return write(db => {
      const order = db.orders.find(o => o.orderNumber === orderNumber); if (!order) throw new Error('Pesanan tidak ditemukan');
      if (action === 'paid' || action === 'failed' || action === 'expired') {
        if (order.status !== 'unpaid' || !order.payment) throw new Error('Pembayaran tidak tersedia');
        if (action === 'paid' && Date.parse(order.payment.expiresAt) <= Date.now()) throw new Error('Pembayaran kedaluwarsa; pilih Expire');
        order.payment.status = action;
        if (action === 'paid') order.status = 'shipping';
        if (action === 'expired') reverseOrder(db, order, false);
      } else if (action === 'cancel') {
        if (order.status !== 'unpaid') throw new Error('Hanya pesanan belum dibayar dapat dibatalkan');
        reverseOrder(db, order, false);
      } else if (action === 'ship') {
        text(value);
        if (order.status !== 'shipping') throw new Error('Pesanan belum siap dikirim');
        if (db.orders.some(o => o.tracking?.receiptNumber === value.trim())) throw new Error('Resi sudah dipakai');
        order.status = 'shipped';
        order.tracking = { orderId: order.id, courierName: order.courier, service: 'Regular', receiptNumber: value.trim(), currentStatus: 'Dikirim', timeline: [] };
      } else if (order.status !== 'shipped' || !order.tracking) throw new Error('Tracking belum tersedia');
      if (action === 'ship' || action === 'track') {
        text(value);
        order.tracking!.timeline.forEach(p => { p.active = false; });
        order.tracking!.currentStatus = action === 'ship' ? 'Dikirim' : value.trim();
        order.tracking!.timeline.unshift({ id: String(nextDemoId(db)), status: order.tracking!.currentStatus, description: action === 'ship' ? `Diserahkan ke ${order.courier}` : value.trim(), timestamp: new Date().toISOString(), completed: true, active: true });
      }
      notify(db, order.userId, 'order', `Pesanan ${order.orderNumber}`, `Status: ${order.status}${order.tracking ? ` · ${order.tracking.receiptNumber} · ${order.tracking.currentStatus}` : ''}`, order.orderNumber);
    });
  },
  decideRefund(id: number, approved: boolean) { return write(db => {
    const refund = db.refunds.find(r => r.id === id && r.status === 'pending'); if (!refund) throw new Error('Refund tidak pending');
    const order = db.orders.find(o => o.orderNumber === refund.orderNumber); if (!order || !['shipped', 'completed'].includes(order.status)) throw new Error('Pesanan tidak dapat direfund');
    if (approved) { reverseOrder(db, order, true); refund.cashAmount = order.payment?.cashAmount ?? order.grandTotal; }
    else order.refunded = false;
    refund.status = approved ? 'approved' : 'rejected';
    notify(db, refund.userId, 'order', approved ? 'Refund disetujui' : 'Refund ditolak', `${refund.orderNumber}: ${refund.reason}`, refund.orderNumber);
  }); },
  saveSettings(settings: DemoDB['settings']) {
    integer(settings.pointValue, 1); integer(settings.creditLimit); integer(settings.shippingFee);
    return write(db => {
      if (settings.pointValue !== db.settings.pointValue && db.orders.some(o => o.pointsUsed > 0 && o.status !== 'cancelled')) throw new Error('Nilai poin terkunci selama ada pesanan yang memakai poin; reversal user memakai rasio saat ini');
      const used = db.customers.map(c => db.loans.filter(l => l.userId === c.id).reduce((s, l) => s + l.installments.filter(i => i.status !== 'paid').reduce((a, i) => a + i.principalDue, 0), 0));
      if (used.some(v => v > settings.creditLimit)) throw new Error('Limit kurang dari pokok terutang');
      db.settings = { ...settings };
    });
  },
  adjustPoints(userId: string, amount: number, reason: string, key: string) {
    integer(Math.abs(amount), 1); text(reason); text(key);
    return write(db => {
      if (!db.customers.some(c => c.id === userId && c.role === 'customer')) throw new Error('Pelanggan tidak ditemukan');
      if (db.ledger.some(e => e.idempotencyKey === key)) return;
      const balance = (db.points[userId] ?? 0) + amount; integer(balance);
      db.points[userId] = balance;
      db.ledger.push({ id: nextDemoId(db), userId, idempotencyKey: key, type: amount > 0 ? 'credit' : 'debit', amount: Math.abs(amount), balanceAfter: balance, referenceType: 'admin_adjustment', referenceId: requireDemoUser('admin').id, description: reason.trim(), createdAt: new Date().toISOString() });
    });
  },
  saveCourier(courier: DemoDB['shipping'][number]) {
    text(courier.name); integer(courier.fee);
    return write(db => { const old = db.shipping.find(c => c.id === courier.id); if (old) Object.assign(old, courier); else db.shipping.push({ ...courier, id: String(nextDemoId(db)) }); });
  },
  replyTicket(id: string, message: string) {
    text(message);
    return write(db => {
      const ticket = db.tickets.find(t => t.id === id); if (!ticket || ticket.status === 'closed') throw new Error('Tiket tidak dapat dibalas');
      const admin = db.customers.find(c => c.id === requireDemoUser('admin').id)!;
      ticket.messages.push({ id: String(nextDemoId(db)), senderId: admin.id, senderName: admin.name, isAdmin: true, message: message.trim(), timestamp: new Date().toISOString() });
      ticket.updatedAt = new Date().toISOString(); ticket.status = 'in_progress';
      notify(db, ticket.userId, 'ticket', 'Balasan TechVibe Care', message.trim(), ticket.id);
    });
  },
  setTicketStatus(id: string, status: 'closed' | 'open') { return write(db => { const ticket = db.tickets.find(t => t.id === id); if (!ticket) throw new Error('Tiket tidak ditemukan'); ticket.status = status; ticket.updatedAt = new Date().toISOString(); notify(db, ticket.userId, 'ticket', 'Status tiket', `${ticket.ticketNumber}: ${status}`, ticket.id); }); },
  readNotifications() { return write(db => { const user = requireDemoUser('admin'); db.notifications.filter(n => n.userId === user.id).forEach(n => { n.isRead = true; }); }); }
};
