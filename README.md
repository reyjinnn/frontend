# TechVibe

Frontend React 19 + TypeScript + Vite + Tailwind + Zustand untuk demo e-commerce sintetis. Tidak ada backend produksi atau gateway pembayaran nyata. Mock mode dipilih melalui `src/lib/demoMode.ts`; data bisnis disimpan di `localStorage` key `techvibe.demo.db.v1`, sedangkan login per tab di `sessionStorage` key `techvibe.session`. Data hanya berbagi antar tab pada origin dan profil browser yang sama; tidak sinkron lintas browser/perangkat. Data demo bukan penyimpanan aman untuk data pribadi nyata. Jika storage rusak, pembacaan kembali ke data kosong dan write menolak data rusak; backup tidak otomatis dibuat.

## Menjalankan

Gunakan Node.js versi yang didukung Vite 8 (minimal 20.19 atau 22.12) dan npm. Jalankan `npm ci`, lalu `npm run dev`; buka URL yang ditampilkan Vite. `npm run build` menjalankan `tsc -b && vite build`, `npm run lint` menjalankan `oxlint`, `npm test` menjalankan Vitest (bukan browser), dan `npx playwright test` menjalankan Chromium E2E dengan server Vite otomatis. Jika browser belum terpasang: `npx playwright install chromium`. Playwright memakai `http://localhost:5173`; hentikan proses yang menggunakan port itu sebelum menjalankan E2E bila bukan server repo ini.

## Akun seed

Akun berikut berasal dari `src/lib/demoRepository.ts:138-142` dan login divalidasi di `src/services/auth.service.ts:15-20`:

| Peran | Email | Password | KYC |
|---|---|---|---|
| Customer | budi@example.com | Demo123! | unverified |
| Customer | siti@example.com | Demo123! | pending |
| Customer | agus@example.com | Demo123! | verified |
| Customer | rina@example.com | Demo123! | rejected |
| Admin | admin@techvibe.id | Admin123! | verified |

Akun seed hanya ditambahkan saat database pertama kali diinisialisasi. Browser dengan database yang sudah diubah mungkin mempunyai kredensial berbeda. Jangan memasukkan identitas atau pembayaran sungguhan. Untuk demo dua tab, **buat tab baru dari address bar**, bukan Duplicate Tab; sejumlah browser menyalin `sessionStorage` saat menduplikasi tab. Logout menghapus sesi tab, bukan database. Reset namespace demo harus dilakukan lewat kontrol UI bila tersedia; jangan gunakan `localStorage.clear()` karena menghapus storage milik aplikasi lain pada origin yang sama. Jika butuh mengulang dari seed dan kontrol reset tidak tersedia, hapus hanya key `techvibe.demo.db.v1` dari DevTools dan reload, lalu hapus sesi tab `techvibe.session` di setiap tab.

## Cakupan verifikasi

`QA_DEMO_CHECKLIST.md` memisahkan hasil Chromium yang diamati dari skenario yang belum diuji. Tes E2E adalah smoke saja, **bukan** bukti bahwa checkout, pembayaran, KYC, dan semua 22 kriteria penerimaan lulus. Ada overflow horizontal katalog pada viewport 390px. Lihat `DEMO_GUIDE.md` untuk urutan presentasi dan pemulihan.
