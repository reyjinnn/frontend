import api from '../lib/axios';

export interface Product {
  id: number;
  categoryId: number;
  sku: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  weightGrams: number;
  status: string;
  stock: number;
  rating?: number;
  soldCount?: number;
  images: { id: number; imageUrl: string; isPrimary: boolean }[];
  tlaterMonthly?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  parentId: number | null;
}

export interface Review {
  id: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const mockCategories: Category[] = [
  { id: 1, name: "Smartphone & Gadgets", slug: "smartphone-gadgets", description: "", parentId: null },
  { id: 2, name: "Laptop & MacBook", slug: "laptop-macbook", description: "", parentId: null },
  { id: 3, name: "Komponen PC Gaming", slug: "komponen-pc", description: "", parentId: null },
  { id: 4, name: "Aksesoris & Audio", slug: "aksesoris", description: "", parentId: null },
];

const mockProducts: Product[] = [
  {
    id: 201, categoryId: 1, sku: "APL-IP16P-256", name: "iPhone 16 Pro 256GB - Titanium Black", slug: "iphone-16-pro-256gb", description: "Apple A18 Pro chip, 48MP Fusion camera.", price: 20999000,
    originalPrice: 22999000, discountPercentage: 8, weightGrams: 500, status: "active", stock: 15, rating: 4.9, soldCount: 1250,
    images: [{ id: 501, imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600", isPrimary: true }],
    tlaterMonthly: 1795000
  },
  {
    id: 202, categoryId: 2, sku: "APL-MBP-M3", name: "MacBook Pro 14 M3 Pro 18GB/512GB", slug: "macbook-pro-14-m3", description: "Space Black. Unbelievable power.", price: 35999000,
    weightGrams: 1600, status: "active", stock: 8, rating: 5.0, soldCount: 340,
    images: [{ id: 502, imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600", isPrimary: true }],
    tlaterMonthly: 3000000
  },
  {
    id: 203, categoryId: 3, sku: "NVD-RTX4090", name: "NVIDIA GeForce RTX 4090 Founders Edition", slug: "rtx-4090-fe", description: "Beyond fast.", price: 34500000,
    originalPrice: 35500000, discountPercentage: 3, weightGrams: 2000, status: "active", stock: 3, rating: 4.8, soldCount: 120,
    images: [{ id: 503, imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=600", isPrimary: true }],
    tlaterMonthly: 2850000
  },
  {
    id: 204, categoryId: 4, sku: "SNY-XM5", name: "Sony WH-1000XM5 Wireless Noise Cancelling", slug: "sony-wh-1000xm5", description: "Industry leading noise cancellation.", price: 5499000,
    weightGrams: 250, status: "active", stock: 25, rating: 4.9, soldCount: 890,
    images: [{ id: 504, imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=600", isPrimary: true }],
    tlaterMonthly: 450000
  }
];

export const CatalogService = {
  async getCategories() {
    try {
      const res = await api.get('/api/v1/catalog/categories');
      return res.data;
    } catch (e) {
      console.warn("API categories unavailable, using mock");
      return mockCategories;
    }
  },
  async getProducts(params?: any) {
    try {
      const res = await api.get('/api/v1/catalog/products', { params });
      return res.data;
    } catch (e) {
      console.warn("API products unavailable, using mock");
      let filtered = [...mockProducts];
      if (params?.maxPrice) {
        filtered = filtered.filter(p => p.price <= params.maxPrice);
      }
      return { items: filtered, total: filtered.length, page: 1, limit: 20 };
    }
  },
  async getProductBySlug(slug: string) {
    try {
      const res = await api.get(`/api/v1/catalog/products/${slug}`);
      return res.data;
    } catch (e) {
      console.warn("API product detail unavailable, using mock");
      const product = mockProducts.find(p => p.slug === slug);
      if (!product) throw new Error("Not Found");
      return product;
    }
  },
  async getProductReviews(id: number) {
    try {
      const res = await api.get(`/api/v1/catalog/products/${id}/reviews`);
      return res.data;
    } catch (e) {
      console.warn("API reviews unavailable, using mock");
      return [
        { id: 1, userId: 101, userName: "Budi Santoso", rating: 5, comment: "Barang bagus, pengiriman cepat. Garansi resmi iBox.", createdAt: "2026-09-15" },
        { id: 2, userId: 102, userName: "Agus S.", rating: 4, comment: "Mantap, dapet cicilan TLater.", createdAt: "2026-09-16" }
      ];
    }
  }
};
