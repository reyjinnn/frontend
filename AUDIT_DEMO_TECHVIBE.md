# Audit kesiapan demo TechVibe

Tanggal audit: 4 Oktober 2026. Target presentasi: 5 Oktober 2026.

**Kesimpulan: proyek belum siap untuk demo menyeluruh user–admin.** Banyak layar sudah tersedia, tetapi sejumlah tombol belum memiliki aksi dan transaksi belum menggunakan sumber data yang sama. Build yang berhasil belum membuktikan alur bisnis berjalan.

Dokumen ini merupakan hasil audit dan pendamping `PROMPT_REVISI_TECHVIBE.md`. Kode aplikasi belum direvisi dalam pekerjaan penyusunan prompt ini. Perubahan kode dan gambar yang sudah ada di working tree dipertahankan.

## Verifikasi yang dilakukan

- Membaca router, autentikasi, layout/tema, service mock, dan komponen utama katalog, checkout, pesanan, alamat, wishlist, KYC, TLater, poin, tiket, notifikasi, serta semua modul admin yang terdaftar.
- `npm run build`: **berhasil**, dengan peringatan bundle JavaScript sekitar 827,85 kB sebelum gzip.
- `npm run lint`: **gagal**, termasuk pelanggaran Rules of Hooks pada `CheckoutView.tsx`, serta warning dependency effect, state dalam effect, dan nilai acak saat render.
- Browser lokal `http://127.0.0.1:5173/`: sesi yang diuji menampilkan tombol **Masuk**, sehingga pada sesi tersebut pengguna belum login.
- Browser: membuka **Lacak pesanan** sebagai tamu menampilkan empat pesanan mock. Ini membuktikan akses data pribadi belum dijaga.
- Browser: menekan **Bayar Sekarang** pada pesanan belum dibayar tidak mengubah tampilan; kode tombol juga tidak mempunyai handler.
- Browser: membuka `/checkout` sebagai tamu mengarahkan ke beranda/modal login, tetapi log mencatat `Cannot update a component while rendering a different component` dan `Maximum update depth exceeded` dari `openLogin()` di render checkout.
- Belum dilakukan uji end-to-end lengkap semua fitur, seluruh viewport, maupun seluruh aksi admin. Temuan selain pengujian di atas berasal dari inspeksi kode; jangan menafsirkannya sebagai seluruh skenario sudah diuji di browser.
- Tidak ditemukan file pengujian aplikasi atau script test pada `package.json` saat audit.

## Prioritas temuan

P0 = memutus alur demo atau merusak konsistensi transaksi. P1 = fitur yang terlihat belum lengkap/terhubung. P2 = penyempurnaan presentasi dan pemeliharaan.

| Prioritas | Area | Bukti kode dan kondisi saat audit | Dampak demo / perbaikan yang diperlukan |
|---|---|---|---|
| P0 | Sesi awal | `src/stores/useAuthStore.ts:23` memuat user dan token lama dari localStorage; autentikasi didasarkan pada keberadaan token. Tidak ditemukan pemanggilan login otomatis pada bootstrap. | Keluhan langsung login konsisten dengan pemulihan sesi lama, tetapi penyebab pada browser pengguna belum diperiksa. Mulai sesi demo baru sebagai tamu; jangan memulihkan token legacy otomatis. |
| P0 | Guard user | `src/router.tsx` hanya memiliki guard admin. Orders, TLater, poin, dan tiket pribadi dapat dimuat tanpa guard customer. | Tamu melihat data akun mock. Pisahkan FAQ publik dari tiket privat; cek role dan kepemilikan data. |
| P0 | Checkout tamu | `src/features/checkout/views/CheckoutView.tsx:20` memanggil `openLogin()` ketika render lalu return sebelum Hooks berikutnya. | Error runtime terkonfirmasi dan lint gagal. Gunakan guard/deferred navigation yang tidak mengubah store saat render. |
| P0 | Akun | `LoginModal.tsx:32` menerima semua input yang lolos schema menjadi user yang sama; `RegisterModal.tsx:32` mengabaikan data. Admin login juga tidak memverifikasi kredensial input. | Register–logout–login tidak mewakili akun yang berbeda. Butuh repository akun demo, kredensial terkontrol, dan isolasi user/admin. |
| P0 | Checkout → pesanan | `checkoutApi.ts:168` membuat respons pesanan ID tetap `802`, mengosongkan array cart, tetapi tidak menyimpan ke `OrdersApi`. | Nomor pesanan sukses tidak muncul di user/admin; cart store/header dapat tertinggal. Simpan transaksi dan sinkronkan seluruh pembacanya. |
| P0 | Total checkout | Ongkir simulasi selalu Rp25.000; pilihan kurir, alamat, asuransi, promo, gateway, dan catatan tidak semuanya masuk request final. View menghitung ulang diskon/biaya sendiri. | Rincian, total sukses, dan jumlah pembayaran dapat berbeda. Gunakan satu fungsi quote yang juga dipakai saat konfirmasi transaksi. |
| P0 | Pembayaran pesanan | Tombol bayar di order center/detail tidak memiliki handler. Halaman sukses selalu menampilkan VA dan grand total; tombol status menuju `/profile`. | Tidak ada alur pesanan unpaid → dibayar → siap dikirim. Butuh simulator pembayaran lokal dan jumlah tunai tersisa yang benar. |
| P0 | Admin pengiriman | `AdminOrdersView.tsx:61` hanya mengubah state komponen, parameter nomor resi diabaikan. `OrdersApi.getTrackingInfo` mengacak resi setiap panggilan. | Status user dan admin berbeda; resi tidak stabil. Persist shipment dan event tracking per pesanan. |
| P0 | KYC | `KycModal.tsx:73` hanya mengubah status user menjadi pending; antrean admin berada di array lain pada `adminApi.ts`. | User tidak bisa menyelesaikan alur aktivasi TLater lewat persetujuan admin. Hubungkan application, keputusan, alasan, akun kredit, dan notifikasi. |
| P0 | Poin | Dompet memiliki 50.000 poin, checkout mengembalikan 150.000; admin menampilkan rasio 1 poin = Rp10 sementara checkout mengurangi rupiah 1:1. Tidak ada debit checkout yang terhubung. | Saldo dan diskon tidak bisa dipertanggungjawabkan saat demo. Satukan wallet, ledger, konfigurasi, reservasi/debit, dan reversal. |
| P0 | Cicilan TLater | `tlaterApi.ts` membuat ulang semua installment sebagai unpaid. Repayment menambah limit sebesar seluruh pembayaran, termasuk komponen nonpokok; tidak menyimpan status installment. `financial.ts` memasukkan adminFee ke total loan tetapi tidak ke total installment. | Tagihan bisa dibayar berulang, limit dapat melebihi batas, jumlah angsuran tidak sama dengan total pinjaman. Perbaiki perhitungan, persistensi, dan idempotensi. |
| P0 | Persistensi dan transport | Sebagian besar mock berupa array dalam modul. API menggunakan `localhost:3000/api/...` dengan baseURL `http://localhost:8080`; URL refresh menjadi `http://localhost:8080localhost:3000/...`. Semua kegagalan berubah menjadi sukses mock. | Refresh menghapus mutasi; demo menghasilkan warning API dan error bisnis dapat tertutupi. Pilih mock mode eksplisit dengan repository persisten. |
| P1 | Katalog | Search header belum terhubung; CategoryTiles menulis `?category=...` tetapi CatalogView tidak membacanya. Sort harga dan filter sidebar sudah memiliki logika. | Lengkapi pencarian dan state URL; jangan menganggap semua katalog belum bekerja. |
| P1 | Detail produk | Spesifikasi A18 Pro/iPhone dan paragraf titanium ditampilkan untuk semua produk. Beli Langsung hanya menambah cart. | Produk laptop/headphone memiliki detail yang tidak relevan; alur pembelian langsung belum sesuai label. |
| P1 | Produk admin | `AdminApi.addProduct` hanya mengembalikan objek; edit/hapus/search/filter belum terhubung. Gambar submit tetap; jumlah wishlist memakai Math.random saat render. | Tambah produk tidak masuk katalog, inventaris tidak bisa dikelola dengan benar. |
| P1 | Wishlist dan alamat | Wishlist GET fallback selalu kosong; toggle hanya mengembalikan success. Alamat GET selalu seed tetap, setPrimary/delete no-op; tombol tambah alamat tidak memiliki handler. | Perubahan menghilang atau hanya lokal; alamat profil tidak digunakan checkout. |
| P1 | Promo | Admin dan checkout memakai array berbeda. Input kode “Terapkan” tidak punya handler. `NEWVIBE50` di beranda Rp500.000, di admin/checkout Rp50.000. Promo POIN2X tidak memicu reward terkait. | Promo yang dibuat admin tidak dapat dipakai user; nominal dan manfaat saling bertentangan. |
| P1 | Admin belum lengkap | `/admin/customers` masih Coming Soon. Shipping rules, toggle kurir, points settings/adjustment, risk parameters, pengaturan toko, search/bell admin, beberapa export/print tidak terhubung. Dashboard memakai angka statis. | Banyak jalur presentasi berhenti di UI; butuh implementasi berdasarkan data transaksi yang sama. |
| P1 | Tiket dan notifikasi | Create/reply/resolve tiket berbagi array di runtime yang sama, tetapi `replyTicket` selalu menyimpan `isAdmin: false`, termasuk balasan admin. Notifikasi berupa seed tetap. | Bagian tiket sudah memiliki fondasi, tetapi pengirim, pembaruan lintas tab, persistensi, dan notifikasi belum benar. |
| P1 | Pascapembelian | Beri Ulasan dan invoice tidak memiliki handler; link garansi memakai `topic=warranty`, sedangkan Care membaca `action=create_ticket` dan `category`. Footer menjanjikan retur 7 hari tanpa alur permohonan dan keputusan. | Lengkapi ulasan pembeli, invoice, serta retur/garansi/refund mock yang relevan dengan pesanan. |
| P1 | Tema | `useThemeStore.ts:17` memakai body.dark-theme, sedangkan Tailwind dikonfigurasi `darkMode: 'class'` dan komponen memakai dark:. Token primary dan pumpkin sebenarnya sama-sama #FD802E; `font-space` belum didefinisikan. | Konsistensi warna dasar sudah ada, tetapi aktivasi dark mode dan tipografi admin perlu disatukan. |
| P2 | Konten dan seed | Brand Tecvibe/Tech Vibe/TechVibe bercampur; kurasi September tampil pada Oktober. Pesanan Sony: 4.299.000 + 20.000 − 100.000 = 4.219.000, tetapi total seed 5.519.000. Tanggal tiba ada yang mendahului tanggal pesanan. | Rapikan seed, angka, tanggal, copy, dan identitas brand dari satu konfigurasi. |
| P2 | Navigasi dan kualitas UI | Link footer #, beberapa CTA promo mati, label ikon minim, countdown flash sale dapat menjadi negatif. README menyebut React 18 sedangkan paket memakai React 19; klaim ledger double-entry belum didukung struktur kode. | Perbaiki seluruh kontrol yang terlihat, aksesibilitas, timer, dokumentasi, dan klaim fitur. |

## Yang sudah menjadi fondasi

Struktur React + TypeScript, komponen UI bersama, katalog dan gambar produk, filter sidebar/sort harga, cart CRUD di memori, guard admin, modal KYC dengan sebagian validasi, tab/search order user, cancel/complete order mock, tampilan tracking, wallet/history, jadwal amortisasi, FAQ/tiket, dan mark-read notifikasi sudah ada. Gunakan fondasi ini untuk menyelesaikan integrasi; tidak perlu mengganti desain storefront atau stack keseluruhan.

## Urutan pengerjaan yang disarankan

1. Repository mock persisten bersama, kontrak ID/status, session/role, dan guard checkout.
2. Perhitungan quote, checkout tersimpan, pembayaran, stok, pengiriman, pembatalan, poin, dan TLater yang saling terhubung.
3. Lengkapi seluruh kontrol user/admin, termasuk customer management, promo, alamat, tiket, ulasan, invoice, retur, dan settings.
4. Samakan tema, konten, empty/loading/error state, dan responsivitas.
5. Jalankan matriks demo pada prompt pendamping; catat lulus/gagal dan bukti. Jangan menyatakan siap hanya dari build.
