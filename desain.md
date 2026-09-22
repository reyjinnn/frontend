# Panduan Sistem Desain UI/UX Frontend React: Tech Vibe

## 1\. Filosofi Desain First-Principles UI/UX

Sistem antarmuka Tech Vibe mengintegrasikan prinsip-prinsip desain fundamental untuk memastikan pengalaman pengguna yang optimal:

1. Clarity over Clutter (Kejelasan di atas Ornamen): Menghilangkan dekorasi berlebih agar setiap elemen visual memiliki fungsi fungsional yang jelas.  
2. Cognitive Ease (Hick\&apos;s Law): Mengurangi beban kognitif dengan memecah keputusan pembayaran yang kompleks menjadi tahapan logis: Poin → Kredit TLater → Sisa Tunai.  
3. Visual Hierarchy \&amp; Gestalt Law: Menggunakan prinsip kedekatan (Proximity) dan kesamaan (Similarity) untuk mengelompokkan informasi harga, diskon, dan estimasi cicilan.

## 2\. Konfigurasi tailwind.config.js Resmi

4. &nbsp;

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        &quot;pumpkin&quot;: &quot;#FD802E&quot;,
        &quot;charcoal&quot;: &quot;#1E293B&quot;,
        &quot;tlater&quot;: &quot;#0284C7&quot;,
        &quot;vibe-points&quot;: &quot;#F59E0B&quot;,
      },
      fontFamily: {
        sans: [&quot;Plus Jakarta Sans&quot;, &quot;sans-serif&quot;],
        logo: [&quot;Poppins&quot;, &quot;Outfit&quot;, &quot;sans-serif&quot;],
        mono: [&quot;JetBrains Mono&quot;, &quot;monospace&quot;],
      },
      boxShadow: {
        &quot;card&quot;: &quot;0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)&quot;,
        &quot;card-hover&quot;: &quot;0 12px 24px -6px rgba(0, 0, 0, 0.08), 0 4px 8px -4px rgba(0, 0, 0, 0.04)&quot;,
      }
    }
  }
}
```

## 3\. Spesifikasi Komponen UI \&amp; Utility Class

### 3.1. Clean Tech Product Card

- Layout: \`flex-col rounded-2xl border-slate-200 shadow-card hover:shadow-card-hover\`.  
- Features: Badge diskon merah blur di pojok kiri atas, tombol wishlist lingkaran putih di pojok kanan atas, foto produk rasio 1:1 dengan \`bg-slate-100\`, rating bintang amber, harga IDR tebal (font-mono), pill biru cicilan TLater, dan tombol \&quot;+ Keranjang\&quot; di dasar kartu.

### 3.2. Liquid Glass Header \&amp; Navigasi

- Style: \`sticky top-0 backdrop-blur-xl bg-white/75\`. Menggunakan bilah pencarian berbentuk pill yang intuitif.  
- Admin Sidebar: Struktur navigasi terperinci untuk backoffice dengan KPI Stat Cards dan SVG Revenue Line Chart untuk visualisasi data.

### 3.3. Split-Payment Checkout \&amp; FinTech Modules

- Checkout Box: Menyediakan slider Vibe Poin (1 Poin \= Rp 1), pemilih tenor TLater (1, 3, 6 bulan), dan radio button metode pembayaran sisa tagihan.  
- Auto-Capped Warning: Banner biru langit otomatis muncul jika pesanan melebihi limit kredit.  
- TLater Credit Card: Desain gradien \`slate-900\` ke \`black\` dengan pendaran cyan. Tabel amortisasi menyertakan catatan bintang (\*) untuk penny-balancing.  
- Loyalty Card: Gradien amber ke kuning. Tabel mutasi berbasis jurnal kas ganda (double-entry ledger) dengan Idempotency Key.

## 4\. Sistem Dark Mode (.dark-theme)

- Warna Latar: Kontainer utama menggunakan \`\#000000\` (Pure Black). Permukaan kartu dan modal dialog yang terangkat (elevated) menggunakan \`\#141414\` dan \`\#262626\`.  
- Kontras & Teks: Teks primer \`\#F8FAFC\`, teks sekunder \`\#94A3B8\`.  
- Aksen Pastel: Menggunakan transparansi 15% (\`rgba(..., 0.15)\`) untuk elemen dekoratif agar tetap nyaman di mata.

## 5\. Standar Aksesibilitas (WCAG 2.1 AA)

1. Kontras & Visual: Rasio kontras minimal 4.5:1 untuk teks dan 3:1 untuk heading. Navigasi keyboard harus menampilkan outline cincin fokus (\`focus:ring-2\`).  
2. State & ARIA: Implementasi ARIA roles yang tepat. Penggunaan shimmer skeleton loader (pulse) untuk mencegah layout shift (CLS). Pesan Empty State yang informatif untuk keranjang atau hasil pencarian kosong.

### 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├─► \[Opsional\] Aktifkan TLater (Pilih Tenor 1, 3, atau 6 Bulan)

&nbsp;