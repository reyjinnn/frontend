import { z } from 'zod';
import type { Product, Review } from '../services/catalog.service';
import type { Order, TrackingInfo } from '../features/orders/types';
import type { CartItem } from '../features/checkout/api/checkoutApi';
import type { Address } from '../services/addressService';
import type { Ticket } from '../features/care/types';
import type { AppNotification } from '../features/notifications/types';
import type { PromoData, KycApplication } from '../features/admin/api/adminApi';
import type { TlaterLoan, TlaterInstallment } from '../features/tlater/api/tlaterApi';
import type { LedgerEntry } from '../features/points/api/pointsApi';
import { calculateAmortization } from './financial';

export const DB_KEY = 'techvibe.demo.db.v1';
export const SESSION_KEY = 'techvibe.session';
export const DB_EVENT = 'techvibe:db-changed';
export const DEFAULT_SETTINGS = { pointValue: 1, creditLimit: 10000000, shippingFee: 25000, storeName: 'TechVibe', contactEmail: 'support@techvibe.example', contactPhone: '0800000000', pointEarningPercent: 1, interest1: 0, interest3: 2.5, interest6: 2.5, adminFeePercent: 1, adminFeeFixed: 0 };
export type DemoSettings = { pointValue: number; creditLimit: number; shippingFee: number } & Partial<typeof DEFAULT_SETTINGS>;

type Customer = { id: string; name: string; email: string; phone?: string; password?: string; role: 'customer' | 'admin'; kycStatus: 'unverified' | 'pending' | 'verified' | 'rejected' };
export type QuoteRequest = { items: { productId: number; quantity: number }[]; usePoints?: number; useTlater?: boolean; tlaterTenor?: number; promoCode?: string; shippingFee?: number; protectionFee?: number; courier?: string; notes?: string };
type StoredOrder = Order & { userId: string; notes?: string; pointsUsed: number; loanId?: number; payment?: { status: 'pending' | 'paid' | 'failed' | 'expired'; expiresAt: string; virtualAccountNumber: string; cashAmount: number }; tracking?: TrackingInfo; refunded?: boolean };
type LoanRecord = { userId: string; loan: TlaterLoan; installments: TlaterInstallment[] };

export type DemoDB = { 
  version: 1; sequence: number; seeded?: string[]; 
  customers: Customer[]; 
  products: Product[]; 
  orders: StoredOrder[]; 
  carts: Record<string, CartItem[]>; 
  wishlists: Record<string, number[]>; 
  addresses: Record<string, Address[]>; 
  kyc: KycApplication[]; 
  loans: LoanRecord[]; 
  points: Record<string, number>; 
  ledger: (LedgerEntry & { userId: string })[]; 
  tickets: (Ticket & { userId: string })[]; 
  notifications: (AppNotification & { userId: string })[]; 
  promos: PromoData[]; 
  reviews: (Review & { productId: number })[];
  refunds: { id: number; orderNumber: string; userId: string; reason: string; status: 'pending' | 'approved' | 'rejected'; cashAmount: number }[];
  shipping: { id: string; name: string; fee: number; isActive: boolean }[];
  settings: DemoSettings 
};

const money = z.number().int().nonnegative();
const productSchema = z.object({ id: z.number().int(), categoryId: z.number().int(), sku: z.string(), name: z.string(), slug: z.string(), description: z.string(), price: money, weightGrams: money, status: z.string(), stock: money, images: z.array(z.object({ id: z.number(), imageUrl: z.string(), isPrimary: z.boolean() })) }).passthrough();
const customerSchema = z.object({ id: z.string(), name: z.string(), email: z.string(), password: z.string().optional(), role: z.enum(['customer', 'admin']), kycStatus: z.enum(['unverified', 'pending', 'verified', 'rejected']) }).passthrough();
const orderSchema = z.object({ id: z.string(), orderNumber: z.string(), userId: z.string(), status: z.enum(['unpaid', 'shipping', 'shipped', 'completed', 'cancelled']), grandTotal: money, subtotal: money, shippingFee: money, protectionFee: money, promoDiscount: money, pointsUsed: money, date: z.string(), paymentMethod: z.string(), courier: z.string(), estimatedArrival: z.string(), shippingAddress: z.string(), hasTlater: z.boolean(), items: z.array(z.object({ id: z.string(), productId: z.string(), productName: z.string(), imageUrl: z.string(), quantity: z.number().int().positive(), price: money }).passthrough()) }).passthrough();
const schema = z.object({ 
  version: z.literal(1), sequence: z.number().int().nonnegative(), seeded: z.array(z.string()).optional(), 
  customers: z.array(customerSchema), products: z.array(productSchema), orders: z.array(orderSchema), 
  carts: z.record(z.string(), z.array(z.any())), wishlists: z.record(z.string(), z.array(z.number())), 
  addresses: z.record(z.string(), z.array(z.any())), kyc: z.array(z.any()), loans: z.array(z.any()), 
  points: z.record(z.string(), z.number()), ledger: z.array(z.any()), tickets: z.array(z.any()), 
  notifications: z.array(z.any()), promos: z.array(z.any()), reviews: z.array(z.any()), refunds: z.array(z.any()).default([]), shipping: z.array(z.any()).default([]), 
  settings: z.object({ pointValue: z.number().int().positive(), creditLimit: money, shippingFee: money, storeName: z.string().min(1).optional(), contactEmail: z.string().email().optional(), contactPhone: z.string().min(1).optional(), pointEarningPercent: z.number().min(0).max(100).optional(), interest1: z.number().min(0).optional(), interest3: z.number().min(0).optional(), interest6: z.number().min(0).optional(), adminFeePercent: z.number().min(0).optional(), adminFeeFixed: money.optional() }).passthrough() 
});

const empty = (): DemoDB => ({ 
  version: 1, sequence: 1000, seeded: [], customers: [], products: [], orders: [], carts: {}, wishlists: {}, addresses: {}, 
  kyc: [], loans: [], points: {}, ledger: [], tickets: [], notifications: [], promos: [], reviews: [], refunds: [], shipping: [], 
  settings: { ...DEFAULT_SETTINGS } 
});

const memory = { value: '' };
const storage = () => typeof localStorage === 'undefined' ? null : localStorage;

export function readDemoDB(): DemoDB {
  const raw = storage() ? storage()!.getItem(DB_KEY) : memory.value;
  if (!raw) return empty();
  try {
    const parsed = schema.parse(JSON.parse(raw));
    return { ...parsed, settings: { ...DEFAULT_SETTINGS, ...parsed.settings } } as unknown as DemoDB;
  } catch {
    return empty();
  }
}

function save(db: DemoDB) { 
  const raw = JSON.stringify(db); 
  if (storage()) { storage()!.setItem(DB_KEY, raw); if (typeof window !== 'undefined') window.dispatchEvent(new Event(DB_EVENT)); }
  else memory.value = raw; 
}

export function mutateDemoDB<T>(fn: (db: DemoDB) => T): T {
  const raw = storage() ? storage()!.getItem(DB_KEY) : memory.value;
  if (raw) {
    try { schema.parse(JSON.parse(raw)); } catch { throw new Error('Invalid demo database; data preserved'); }
  }
  const db = readDemoDB(); const result = fn(db); schema.parse(db); save(db); return result; 
}

let lockQueue: Promise<unknown> = Promise.resolve();
export async function transactDemoDB<T>(fn: (db: DemoDB) => T): Promise<T> {
  const locks = typeof navigator !== 'undefined' ? navigator.locks : undefined;
  if (locks) {
    return new Promise<T>((resolve, reject) => {
      locks.request(DB_KEY, async () => {
        try {
          resolve(mutateDemoDB(fn));
        } catch (err) {
          reject(err);
        }
      }).catch(reject);
    });
  }
  const next = lockQueue.then(() => mutateDemoDB(fn));
  lockQueue = next.catch(() => {});
  return next;
}

export function nextDemoId(db: DemoDB) { return ++db.sequence; }

export function demoSession(): { id: string; role: 'customer' | 'admin' } | null {
  try { 
    const value = typeof sessionStorage === 'undefined' ? null : sessionStorage.getItem(SESSION_KEY); 
    const parsed = value ? JSON.parse(value) : null; 
    const db = readDemoDB(); 
    const user = db.customers.find(c => String(c.id) === String(parsed?.id ?? parsed?.user?.id)); 
    return user ? { id: String(user.id), role: user.role } : null; 
  } catch { return null; }
}

export function requireDemoUser(role?: 'customer' | 'admin') { 
  const user = demoSession(); 
  if (!user || (role && user.role !== role)) throw new Error('Unauthorized'); 
  return user; 
}

export const demoRepository = {
  read: readDemoDB, mutate: mutateDemoDB, transact: transactDemoDB, session: demoSession, requireUser: requireDemoUser,
  init(products: Product[], orders: Order[], promos: PromoData[], tickets: Ticket[], kyc: KycApplication[]) {
    return mutateDemoDB(db => {
      const seeded = db.seeded ??= [];
      if (!seeded.includes('customers')) {
        seeded.push('customers');
        db.customers.push(
          { id: '101', name: 'Raihan Ananda', email: 'raihan@example.com', password: 'Demo123!', role: 'customer', kycStatus: 'unverified' },
          { id: '102', name: 'Siti Aminah', email: 'siti@example.com', password: 'Demo123!', role: 'customer', kycStatus: 'pending' },
          { id: '103', name: 'Agus Pratama', email: 'agus@example.com', password: 'Demo123!', role: 'customer', kycStatus: 'verified' },
          { id: '104', name: 'Rina Wijaya', email: 'rina@example.com', password: 'Demo123!', role: 'customer', kycStatus: 'rejected' },
          { id: 'admin1', name: 'Customer Success TechVibe', email: 'admin@techvibe.id', password: 'Admin123!', role: 'admin', kycStatus: 'verified' }
        );
        db.points['101'] = 50000;
        db.points['102'] = 10000;
        db.points['103'] = 75000;
        db.points['104'] = 5000;
        db.kyc.push(
          { userId: 102, nik: '3201234567890001', name: 'Siti Aminah', dateOfBirth: '1995-08-20', address: 'Jl. Melati No. 12, Bandung', ktpImageUrl: '/ktp.jpg', selfieImageUrl: '/selfie.jpg', status: 'pending', submittedAt: new Date().toISOString() },
          { userId: 103, nik: '3201234567890002', name: 'Agus Pratama', dateOfBirth: '1992-05-10', address: 'Jl. Sudirman No. 50, Jakarta', ktpImageUrl: '/ktp.jpg', selfieImageUrl: '/selfie.jpg', status: 'verified', submittedAt: new Date().toISOString(), reviewedAt: new Date().toISOString() },
          { userId: 104, nik: '3201234567890003', name: 'Rina Wijaya', dateOfBirth: '1998-11-15', address: 'Jl. Mawar No. 4, Surabaya', ktpImageUrl: '/ktp.jpg', selfieImageUrl: '/selfie.jpg', status: 'rejected', submittedAt: new Date().toISOString(), reviewedAt: new Date().toISOString(), reason: 'Foto selfie tidak jelas' }
        );
        db.addresses['101'] = [
          { id: 'addr_1', label: 'Rumah', recipientName: 'Raihan Ananda', phone: '+6281234567890', fullAddress: 'Jl. Merdeka No. 45', city: 'Jakarta Selatan', postalCode: '12345', isPrimary: true }
        ];
        db.shipping = [
          { id: 'courier_jne', name: 'JNE Express (YES)', fee: 150000, isActive: true },
          { id: 'courier_sicepat', name: 'SiCepat (REG)', fee: 50000, isActive: true },
          { id: 'courier_jnt', name: 'JNT (Regular)', fee: 20000, isActive: true },
          { id: 'courier_gosend', name: 'GoSend (Instant)', fee: 25000, isActive: true }
        ];
      }
      if (!seeded.includes('products') && products.length > 0) { seeded.push('products'); db.products = structuredClone(products); }
      if (!seeded.includes('promos') && promos.length > 0) { seeded.push('promos'); db.promos = structuredClone(promos); }
      if (!seeded.includes('orders') && orders.length > 0) {
        seeded.push('orders');
        db.orders = orders.map(o => ({
          ...structuredClone(o),
          userId: '101',
          pointsUsed: 0,
          payment: o.status === 'unpaid' ? { status: 'pending', expiresAt: new Date(Date.now() + 86400000).toISOString(), virtualAccountNumber: `8808${o.orderNumber.replace(/\D/g, '')}`, cashAmount: o.grandTotal } : undefined
        }));
      }
      if (!seeded.includes('tickets') && tickets.length > 0) { seeded.push('tickets'); db.tickets = tickets.map(t => ({ ...structuredClone(t), userId: '101' })); }
      if (!seeded.includes('kyc') && kyc.length > 0) { seeded.push('kyc'); db.kyc.push(...structuredClone(kyc)); }
    });
  },
  
  quote(req: QuoteRequest) {
    const user = requireDemoUser('customer'); const db = readDemoDB(); let subtotal = 0;
    if (new Set(req.items.map(i => i.productId)).size !== req.items.length) throw new Error('Duplicate product');
    for (const item of req.items) { 
      const p = db.products.find(p => p.id === item.productId && p.status === 'active'); 
      if (!p || !Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > p.stock) throw new Error('Invalid quantity or insufficient stock'); 
      subtotal += p.price * item.quantity; 
    }
    if (!req.items.length) throw new Error('Empty cart');
    const courier = req.courier ? db.shipping.find(c => c.name === req.courier || c.id === req.courier) : undefined;
    if (req.courier && (!courier || !courier.isActive)) throw new Error('Courier unavailable');
    const shippingFee = courier?.fee ?? db.settings.shippingFee;
    if (req.shippingFee !== undefined && req.shippingFee !== shippingFee) throw new Error('Shipping fee does not match courier');
    const protectionFee = req.protectionFee ?? 0;
    const promo = db.promos.find(p => p.code === req.promoCode && p.isActive && (p.quotaRemaining ?? 0) > 0 && Date.parse(p.startDate) <= Date.now() && Date.parse(p.endDate) >= Date.now() && subtotal >= p.minPurchase);
    const promoDiscount = promo ? Math.min(subtotal, promo.maxDiscount, promo.discountType === 'fixed' ? promo.discountValue : Math.floor(subtotal * promo.discountValue / 100)) : 0;
    const grandTotal = subtotal + shippingFee + protectionFee - promoDiscount;
    if (grandTotal < 0 || !Number.isSafeInteger(grandTotal)) throw new Error('Invalid grand total');
    const pointsDeduction = req.usePoints ?? 0;
    if (![shippingFee, protectionFee].every(v => Number.isSafeInteger(v) && v >= 0)) throw new Error('Invalid fee');
    if (req.promoCode && !promo) throw new Error('Invalid promo');
    if (!Number.isSafeInteger(pointsDeduction) || pointsDeduction < 0 || pointsDeduction > (db.points[user.id] ?? 0) * db.settings.pointValue || pointsDeduction > grandTotal || pointsDeduction % db.settings.pointValue !== 0) throw new Error('Invalid points');
    if (req.useTlater && (![1, 3, 6].includes(req.tlaterTenor ?? 1) || db.customers.find(c => c.id === user.id)?.kycStatus !== 'verified')) throw new Error('TLater unavailable');
    const remaining = grandTotal - pointsDeduction;
    const used = db.loans.filter(l => l.userId === user.id).reduce((sum, l) => sum + l.installments.reduce((s, i) => s + (i.status === 'paid' ? 0 : i.principalDue), 0), 0);
    const principal = req.useTlater ? Math.min(remaining, Math.max(0, db.settings.creditLimit - used)) : 0;
    if (req.useTlater && !principal) throw new Error('TLater limit exhausted');
    const tenor = req.tlaterTenor ?? 1;
    const rate = tenor === 1 ? db.settings.interest1 ?? 0 : tenor === 3 ? db.settings.interest3 ?? 2.5 : db.settings.interest6 ?? 2.5;
    const fee = tenor === 1 ? Math.floor(principal * (db.settings.adminFeePercent ?? 1) / 100) + (db.settings.adminFeeFixed ?? 0) : 0;
    const schedule = principal ? calculateAmortization(principal, tenor, rate, fee) : null;
    return { totalItemAmount: subtotal, shippingFee, protectionFee, promoDiscount, grandTotal, pointsUsed: pointsDeduction, pointsDeduction, tlaterPrincipal: principal, tlaterInterest: schedule?.totalInterest ?? 0, tlaterAdminFee: schedule ? schedule.totalLoanAmount - principal - schedule.totalInterest : 0, tlaterMonthlyInstallment: schedule?.installments[0]?.totalDue ?? 0, gatewayCashRequired: remaining - principal };
  },

  async checkout(req: QuoteRequest & { shippingAddress?: string; paymentMethod?: string }, key: string) {
    const user = requireDemoUser('customer');
    if (!key.trim()) throw new Error('Idempotency key required');
    if (new Set(req.items.map(i => i.productId)).size !== req.items.length) throw new Error('Duplicate product');
    return transactDemoDB(db => {
      const prior = db.orders.find(o => o.userId === user.id && (o as StoredOrder & { key?: string }).key === key);
      if (prior) return orderResponse(prior, db);
      const q = demoRepository.quote(req); 
      const id = nextDemoId(db); const now = new Date(); const orderNumber = `TVB-${now.toISOString().slice(0, 10).replace(/-/g, '')}-${String(id).padStart(3, '0')}`;
      const items = req.items.map(item => { const p = db.products.find(p => p.id === item.productId)!; p.stock -= item.quantity; return { id: `i${nextDemoId(db)}`, productId: String(p.id), productName: p.name, quantity: item.quantity, price: p.price, imageUrl: p.images[0]?.imageUrl ?? '' }; });
      db.points[user.id] = (db.points[user.id] ?? 0) - q.pointsDeduction / db.settings.pointValue;
      if (q.pointsDeduction) db.ledger.push({ id: nextDemoId(db), userId: user.id, idempotencyKey: key, type: 'debit', amount: q.pointsDeduction / db.settings.pointValue, balanceAfter: db.points[user.id], referenceType: 'order', referenceId: orderNumber, description: 'Checkout', createdAt: now.toISOString() });
      const promo = db.promos.find(p => p.code === req.promoCode); if (promo) promo.quotaRemaining = (promo.quotaRemaining ?? 0) - 1;
      const order: StoredOrder & { key?: string } = { key, id: String(id), userId: user.id, notes: req.notes, orderNumber, date: now.toISOString(), status: q.gatewayCashRequired ? 'unpaid' : 'shipping', items, subtotal: q.totalItemAmount, shippingFee: q.shippingFee, protectionFee: q.protectionFee, promoDiscount: q.promoDiscount, grandTotal: q.grandTotal, pointsUsed: q.pointsDeduction, paymentMethod: req.paymentMethod ?? 'Bank Transfer', courier: req.courier ?? 'Regular', estimatedArrival: '2-3 Hari Kerja', shippingAddress: req.shippingAddress ?? '', hasTlater: !!q.tlaterPrincipal, payment: { status: q.gatewayCashRequired ? 'pending' : 'paid', expiresAt: new Date(now.getTime() + 86400000).toISOString(), virtualAccountNumber: `8808${String(id).padStart(12, '0')}`, cashAmount: q.gatewayCashRequired } };
      if (q.tlaterPrincipal) { 
        const loanId = nextDemoId(db); order.loanId = loanId; 
        const rate = (req.tlaterTenor ?? 1) === 1 ? db.settings.interest1 ?? 0 : (req.tlaterTenor ?? 1) === 3 ? db.settings.interest3 ?? 2.5 : db.settings.interest6 ?? 2.5;
        const am = calculateAmortization(q.tlaterPrincipal, req.tlaterTenor ?? 1, rate, q.tlaterAdminFee); 
        db.loans.push({ userId: user.id, loan: { id: loanId, loanCode: `LN-${loanId}`, orderId: id, principalAmount: q.tlaterPrincipal, adminFee: q.tlaterAdminFee, interestRate: rate, totalInterest: am.totalInterest, totalLoanAmount: am.totalLoanAmount, tenorMonths: req.tlaterTenor ?? 1, status: 'active', disbursedAt: now.toISOString() }, installments: am.installments.map(inst => ({ ...inst, id: nextDemoId(db), lateFee: 0, totalPaid: 0, dueDate: new Date(now.getFullYear(), now.getMonth() + inst.installmentNumber, now.getDate()).toISOString().slice(0, 10), status: 'unpaid' })) }); 
      }
      db.orders.push(order); db.carts[user.id] = []; return orderResponse(order, db);
    });
  },
  async pay(orderNumber: string, success = true) { const user = requireDemoUser('customer'); return transactDemoDB(db => { const order = db.orders.find(o => o.orderNumber === orderNumber && o.userId === user.id); if (!order?.payment) throw new Error('Order not found'); if (order.payment.status === 'paid') return order; if (order.status !== 'unpaid') throw new Error('Payment unavailable'); if (Date.now() > Date.parse(order.payment.expiresAt)) { order.payment.status = 'expired'; releaseOrder(db, order); return order; } order.payment.status = success ? 'paid' : 'failed'; if (success) { order.status = 'shipping'; } return order; }); },
  async expirePayment(orderNumber: string) {
    const user = requireDemoUser('customer');
    return transactDemoDB(db => {
      const order = db.orders.find(o => o.orderNumber === orderNumber && o.userId === user.id);
      if (!order?.payment || order.status !== 'unpaid') throw new Error('Payment unavailable');
      order.payment.status = 'expired';
      releaseOrder(db, order);
    });
  },
  async cancel(orderNumber: string) { const user = requireDemoUser('customer'); return transactDemoDB(db => { const o = db.orders.find(o => o.orderNumber === orderNumber && o.userId === user.id); if (!o) throw new Error('Order not found'); if (o.status === 'cancelled') return; if (o.status !== 'unpaid') throw new Error('Cannot cancel this order'); releaseOrder(db, o); }); },
  async complete(orderNumber: string) { const user = requireDemoUser('customer'); return transactDemoDB(db => { const o = db.orders.find(o => o.orderNumber === orderNumber && o.userId === user.id); if (!o || o.status !== 'shipped') throw new Error('Cannot complete this order'); o.status = 'completed'; const amount = Math.floor(o.grandTotal * .01 / db.settings.pointValue); db.points[user.id] = (db.points[user.id] ?? 0) + amount; db.ledger.push({ id: nextDemoId(db), userId: user.id, idempotencyKey: `reward-${orderNumber}`, type: 'credit', amount, balanceAfter: db.points[user.id], referenceType: 'order_reward', referenceId: orderNumber, description: 'Cashback', createdAt: new Date().toISOString() }); }); },
  async repay(installmentId: number, amount: number, key: string) { const user = requireDemoUser('customer'); return transactDemoDB(db => { const entry = db.loans.find(l => l.userId === user.id && l.installments.some(i => i.id === installmentId)); if (!entry) throw new Error('Installment not found'); const i = entry.installments.find(i => i.id === installmentId)!; if (i.status === 'paid' && (i as TlaterInstallment & { key?: string }).key === key) return { paymentReference: key, installmentId, status: 'paid', amountPaid: amount, newAvailableLimit: db.settings.creditLimit - db.loans.filter(l => l.userId === user.id).reduce((sum, l) => sum + l.installments.reduce((s, x) => s + (x.status === 'paid' ? 0 : x.principalDue), 0), 0) }; if (i.status === 'paid' || amount !== i.totalDue || !key) throw new Error('Invalid repayment'); i.totalPaid = amount; i.status = 'paid'; (i as TlaterInstallment & { key?: string }).key = key; if (entry.installments.every(i => i.status === 'paid')) entry.loan.status = 'paid'; return { paymentReference: key, installmentId, status: 'paid', amountPaid: amount, newAvailableLimit: db.settings.creditLimit - db.loans.filter(l => l.userId === user.id).reduce((sum, l) => sum + l.installments.reduce((s, x) => s + (x.status === 'paid' ? 0 : x.principalDue), 0), 0) }; }); }
};
function releaseOrder(db: DemoDB, o: StoredOrder) {
  o.status = 'cancelled';
  for (const item of o.items) { const p = db.products.find(p => String(p.id) === item.productId); if (p) p.stock += item.quantity; }
  db.points[o.userId] = (db.points[o.userId] ?? 0) + o.pointsUsed / db.settings.pointValue;
  if (o.pointsUsed) db.ledger.push({ id: nextDemoId(db), userId: o.userId, idempotencyKey: `reverse-${o.orderNumber}`, type: 'credit', amount: o.pointsUsed / db.settings.pointValue, balanceAfter: db.points[o.userId], referenceType: 'order_reversal', referenceId: o.orderNumber, description: 'Order cancellation', createdAt: new Date().toISOString() });
  const loan = db.loans.find(l => l.loan.id === o.loanId); if (loan) db.loans.splice(db.loans.indexOf(loan), 1);
}
function orderResponse(order: StoredOrder, db = readDemoDB()) { 
  return { 
    order: { ...order, totalItemAmount: order.subtotal, discountAmount: order.promoDiscount }, 
    splitBreakdown: { pointsDeduction: order.pointsUsed, tlaterLoanPrincipal: order.hasTlater ? db.loans.find(l => l.loan.id === order.loanId)?.loan.principalAmount ?? 0 : 0, gatewayCashAmount: order.payment?.cashAmount ?? 0 }, 
    paymentInstructions: { virtualAccountNumber: order.payment?.virtualAccountNumber, expiresAt: order.payment?.expiresAt }
  };
}
export const AfterSalesService = {
  async decideRefund(id: number, approved: boolean) {
    requireDemoUser('admin');
    return transactDemoDB(db => {
      const refund = db.refunds.find(r => r.id === id);
      if (!refund || refund.status !== 'pending') throw new Error('Refund not pending');
      const order = db.orders.find(o => o.orderNumber === refund.orderNumber)!;
      refund.status = approved ? 'approved' : 'rejected';
      if (!approved) { order.refunded = false; return refund; }
      refund.cashAmount = order.payment?.cashAmount ?? order.grandTotal;
      order.status = 'cancelled';
      db.points[order.userId] = (db.points[order.userId] ?? 0) + order.pointsUsed / db.settings.pointValue;
      const reward = db.ledger.find(l => l.idempotencyKey === `reward-${order.orderNumber}`);
      if (reward) { db.points[order.userId] = Math.max(0, (db.points[order.userId] ?? 0) - reward.amount); }
      return refund;
    });
  },
  async requestRefund(orderNumber: string, reason: string) {
    const user = requireDemoUser('customer');
    if (!reason.trim()) throw new Error('Reason required');
    return transactDemoDB(db => {
      const order = db.orders.find(o => o.orderNumber === orderNumber && o.userId === user.id);
      if (!order) throw new Error('Order not found');
      if (order.status !== 'completed' && order.status !== 'shipped') throw new Error('Refund not applicable for current order status');
      if (order.refunded) throw new Error('Refund already requested');
      order.refunded = true;
      const ref = { id: nextDemoId(db), orderNumber, userId: user.id, reason, status: 'pending' as const, cashAmount: order.grandTotal };
      db.refunds.push(ref);
      return ref;
    });
  },
  async reviewProduct(productId: number, rating: number, comment: string) {
    const user = requireDemoUser('customer');
    if (rating < 1 || rating > 5 || !comment.trim()) throw new Error('Invalid review');
    const uInfo = readDemoDB().customers.find(c => c.id === user.id)!;
    return transactDemoDB(db => {
      const rev = { id: nextDemoId(db), productId, userId: Number(user.id), userName: uInfo.name, rating, comment, createdAt: new Date().toISOString() };
      db.reviews.unshift(rev);
      return rev;
    });
  }
};
