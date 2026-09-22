# MVP Scope & Implementation Roadmap: Tech Vibe Frontend

## 1\. MoSCoW Prioritization Matrix

&nbsp;

| MUST HAVE (Sprint 1-4 Core) | SHOULD HAVE |
| :---- | :---- |
| Registrasi & Login JWT \+ Refresh Multi-Address Management Katalog, Kategori & Filter Harga Detail Produk & Status Stok Keranjang Belanja (Cart Drawer) Simulasi & Eksekusi Split-Payment Idempotency-Key pada Checkout KYC Form (NIK \+ Upload e-KTP) TLater Hub & Pelunasan Cicilan Vibe Poin Wallet & Ledger Mutasi Admin: Order & Stock Management | Live Resi Tracking Timeline Modal Wishlist Toggle & Halaman Wishlist Auto-Capped Alert saat Limit Kurang Banner Flash Sale Countdown Tiket Pengaduan TechVibe Care Admin Dashboard Metrik & Chart Dark Mode Toggle |
| COULD HAVE | WON'T HAVE (Phase 1\) |
| Promo Builder Kompleks di Admin Ekspor Laporan CSV Transaksi Filter Multi-Variasi Hardware User Sync Control Bridge Interaktif Multi-bahasa (ID/EN) | Aplikasi Mobile Native Integrasi Payment Gateway Riil OJK OCR Otomatis untuk e-KTP Chat Realtime via WebSocket |

## 2\. Actionable Tasklist 4 Sprint (8 Minggu)

### Sprint 1: Foundation, Auth & Multi-Address (Minggu 1-2)

- Setup Vite \+ TypeScript \+ Tailwind CSS.  
- Definisi Tailwind Tokens: Pumpkin (\#FD802E), Charcoal (\#1E293B), TLater (\#0284C7).  
- Shared UI Primitives: Button, Input, Modal, Badge, Toast, Drawer.  
- Axios Client dengan Interceptor Bearer Token & 401 Silent Refresh.  
- Auth Flow: Login, Register, & Zustand authStore persistence.  
- Multi-Address: CRUD buku alamat & primary address toggle.

### Sprint 2: Catalog, PDP & Cart (Minggu 3-4)

- Header Liquid Glass & Storefront Homepage (Hero carousel, category tiles).  
- Catalog Page: Sidebar filter, price slider (up to 25jt), & TLater sorting.  
- PDP: Galeri hardware, spesifikasi, & verified reviews.  
- Cart Drawer: Slide-over UI, instant subtotal calculation, & quantity sync.  
- Wishlist: Heart toggle icon & optimistic update flow.

### Sprint 3: Split Checkout & Order Center (Minggu 5-6)

- Split-Payment Checkout Engine: Slider Poin (1:1), VA/CC selection.  
- Simulasi & Eksekusi Checkout dengan Idempotency-Key.  
- Voucher Promo Modal & Biaya Proteksi Pengiriman (25rb).  
- Order Center: Status tabs, detail pesanan, & live resi tracking timeline.  
- Points Wallet: Saldo card & Double-entry ledger history table.

### Sprint 4: KYC, TLater BNPL & Admin (Minggu 7-8)

- KYC Verification Modal: Input NIK 16 digit & e-KTP file upload (\<5MB).  
- TLater Hub: Available limit, repayment schedules, & amortization table.  
- Repayment Modal: Pelunasan tagihan & instant limit restoration.  
- Admin Backoffice: Analytics dashboard (revenue, credit disbursement).  
- Admin Ops: Order shipment PATCH resi, Product inventory modal, KYC review.  
- TechVibe Care: Tiket pengaduan & User-sync bridge control.

## 3\. Definition of Done (DoD) & QA Matrix

### Definition of Done (DoD)

1. 100% API Contract compliance (63 endpoints).  
2. Responsive pada Mobile/Desktop browser.  
3. State management tersinkronisasi (Zustand).  
4. Lulus QA Skenario Ekstrem.

&nbsp;

| QA Skenario Ekstrem | Ekspektasi Mitigasi Frontend |
| :---- | :---- |
| Token Expired di Tengah Checkout | Seamless silent refresh via Axios Interceptor & preservation of checkout form state di Zustand. |
| Auto-Capped Split | Sistem membatasi limit TLater otomatis ke sisa saldo & mengalihkan overflow ke VA secara real-time. |
| Idempotency Double Click | Disable button checkout & kirim UUIDv4 Idempotency-Key untuk mencegah double order. |
| Penny-Balancing Rounding | Gunakan financial.ts utility; selisih pembulatan dibebankan/dikoreksi pada bulan terakhir angsuran. |
| Concurrency Stock Lock | Refresh stok via POST /checkout/simulate sebelum submit; handle 409 Conflict dengan UI error dialog. |

&nbsp;