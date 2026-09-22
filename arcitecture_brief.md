# Architecture Brief: Tech Vibe Frontend (React SPA)

## 1\. Executive Summary & Project Context

Dokumen ini mendefinisikan arsitektur frontend untuk platform Tech Vibe—ekosistem e-commerce teknologi premium dan integrasi FinTech (TLater Buy Now Pay Later & Vibe Points Loyalty). Frontend ini dibangun menggunakan React 18/19 (TypeScript) dengan arsitektur modular yang mengonsumsi 6 microservices backend berbasis Fastify 5 Monorepo melalui API Gateway terpadu.

Setup utama melibatkan penggunaan Vite untuk rendering cepat dan optimalisasi tree-shaking dengan TypeScript 5.x guna memastikan type-safety mutlak pada transaksi finansial.

## 2\. State Management Strategy

Server State (TanStack Query v5): Digunakan untuk caching otomatis, background revalidation, dan mutasi optimistik pada data katalog serta transaksi.

Client State (Zustand): Digunakan untuk mengelola state global yang ringan seperti sesi pengguna, keranjang belanja (Cart drawer), dan tema aplikasi.

## 3\. Implementasi lib/axios.ts (Interceptors & Security)

Konfigurasi lib/axios.ts mencakup:

1. Bearer Token Injection: Otomatis menyuntikkan header Authorization.  
2. Silent Refresh Queue (401): Saat menerima 401 Unauthorized, request dimasukkan ke antrean sementara client menembak refresh token. Jika berhasil, request diulang secara transparan.  
3. Idempotency-Key: Menyertakan UUIDv4 pada mutasi checkout dan pembayaran untuk mencegah duplikasi transaksi.

## 4\. Algoritma FinTech di lib/financial.ts

Modul lib/financial.ts menangani logika kompleks:

1. Split-Payment Engine: Kalkulasi pemotongan berjenjang mulai dari Vibe Points, kemudian TLater BNPL (berdasarkan limit tersedia), dan sisanya ke Cash Gateway.  
2. Penny-Balancing: Memastikan akurasi pembulatan nilai terkecil pada perhitungan bunga flat dan tenor angsuran.

## 5\. Routing & Access Control

Implementasi React Router DOM menggunakan pola deklaratif:

- ProtectedRoute: Membatasi akses pelanggan ke area profil, keranjang, dan TLater Hub.  
- AdminRoute: Proteksi khusus namespace /admin/\* yang memerlukan guard RequireAdmin.

## 

&nbsp;