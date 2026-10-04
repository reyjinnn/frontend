import type { Order } from '../types';
import { readDemoDB, requireDemoUser } from '../../../lib/demoRepository';

export function printInvoice(order: Order) {
  const user = requireDemoUser('customer');
  const db = readDemoDB();
  const stored = db.orders.find(o => o.orderNumber === order.orderNumber && o.userId === user.id);
  if (!stored) throw new Error('Order not found');
  const loan = db.loans.find(l => l.loan.id === stored.loanId)?.loan;
  const frame = document.createElement('iframe');
  frame.title = 'Invoice TechVibe';
  frame.style.position = 'fixed';
  frame.style.width = '0';
  frame.style.height = '0';
  document.body.append(frame);
  const doc = frame.contentDocument;
  if (!doc || !frame.contentWindow) { frame.remove(); throw new Error('Cetak tidak tersedia'); }
  const heading = doc.createElement('h1');
  heading.textContent = `TechVibe — Invoice ${stored.orderNumber}`;
  doc.body.append(heading);
  const add = (label: string, value: string | number) => {
    const row = doc.createElement('p');
    row.style.whiteSpace = 'pre-wrap';
    row.textContent = `${label}: ${value}`;
    doc.body.append(row);
  };
  const money = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;
  add('Mode', 'Demo — pembayaran dan pengiriman simulasi');
  add('ID', stored.id);
  add('Tanggal', new Date(stored.date).toLocaleString('id-ID'));
  add('Status', stored.status);
  add('Alamat penerima', stored.shippingAddress);
  add('Kurir', stored.courier);
  add('Estimasi tiba', stored.estimatedArrival);
  add('Resi', stored.tracking?.receiptNumber ?? 'Belum tersedia');
  for (const item of stored.items) {
    add(`Produk ${item.productId}`, `${item.productName} — ${item.quantity} × ${money(item.price)} = ${money(item.quantity * item.price)}`);
    const note = (item as typeof item & { note?: string }).note;
    if (note) add('Catatan', note);
  }
  add('Subtotal', money(stored.subtotal));
  add('Ongkir', money(stored.shippingFee));
  add('Proteksi', money(stored.protectionFee));
  add('Diskon', money(stored.promoDiscount));
  add('Total belanja', money(stored.grandTotal));
  add('Potongan poin', money(stored.pointsUsed));
  add('Pokok TLater', money(loan?.principalAmount ?? 0));
  add('Gateway tunai', money(stored.payment?.cashAmount ?? stored.grandTotal));
  add('Metode pembayaran', stored.paymentMethod);
  add('Status pembayaran', stored.payment?.status ?? 'Tidak tersedia');
  add('Nomor pembayaran simulasi', stored.payment?.virtualAccountNumber ?? 'Tidak tersedia');
  add('Batas pembayaran', stored.payment?.expiresAt ?? 'Tidak tersedia');
  if (loan) {
    add('Pinjaman', loan.loanCode);
    add('Tenor', `${loan.tenorMonths} bulan`);
    add('Bunga', money(loan.totalInterest));
    add('Biaya layanan', money(loan.adminFee));
    add('Total kewajiban TLater', money(loan.totalLoanAmount));
  }
  frame.contentWindow.focus();
  frame.contentWindow.print();
  window.setTimeout(() => frame.remove(), 60000);
}
