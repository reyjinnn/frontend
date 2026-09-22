# PRD & BRD: Tech Vibe Omnichannel E-Commerce & FinTech Platform

---

## BAGIAN I: BUSINESS REQUIREMENTS DOCUMENT (BRD)

### 1\. Latar Belakang & Pernyataan Masalah

Pasar gadget premium memiliki AOV tinggi (Rp 5jt \- Rp 35jt). Kendala utama adalah likuiditas tunai dan rendahnya penetrasi kartu kredit.

### 2\. Visi Produk & Proposisi Nilai

Tech Vibe mengintegrasikan ritel resmi dengan ekosistem FinTech: TLater BNPL dan Vibe Poin dengan buku kas ganda.

### 3\. Target Bisnis & KPI

- GMV: Pertumbuhan volume transaksi bulanan.  
- NPL: Di bawah 1.5%.  
- Repeat Purchase Rate: Peningkatan 30% via Vibe Poin.

---

## BAGIAN II: PRODUCT REQUIREMENTS DOCUMENT (PRD)

### 1\. Spesifikasi Fungsional (11 Modul Utama)

- Auth & Multi-address: Registrasi, login JWT, silent refresh, dan manajemen buku alamat.  
- KYC e-KTP & Selfie: Pengajuan verifikasi identitas untuk aktivasi limit TLater.  
- Katalog & Faceted Search: Filter dinamis, kategori hierarkis, dan status stok real-time.  
- Keranjang Belanja Redis: Cart drawer responsif dengan operasi atomik.  
- Mesin Split Checkout Auto-Capped: Kombinasi poin, limit TLater, dan cash gateway otomatis.  
- TLater Hub & Angsuran Penny-balancing: Dasbor limit dan jadwal angsuran presisi.  
- Buku Kas Poin Double-entry: Mutasi saldo transparan dengan format akuntansi ganda.  
- Order Center & Tracking Resi: Pelacakan kurir interaktif dan manajemen status pesanan.  
- Promo Builder: Manajemen kode voucher dan flash sale countdown.  
- Bantuan TechVibe Care: Sistem tiket pengaduan dan percakapan admin-user.  
- Admin Backoffice & User-sync Bridge: Kontrol operasional dan sinkronisasi data user real-time.

### 2\. Validasi Form (Zod)

Implementasi validasi skema Zod pada form Registrasi (password & ponsel), Checkout (idempotensi), dan KYC (dokumen & selfie).

### 3\. Kebutuhan Non-Fungsional (NFR)

- Core Web Vitals: LCP \< 1.8s, FID \< 100ms, CLS \< 0.05.  
- Financial Reliability: Idempotensi mutlak dan presisi akuntansi.  
- Security: JWT rotation dan sanitasi input XSS.

### 

### 

&nbsp;