import { create } from 'zustand';
import { CheckoutApi } from '../checkout/api/checkoutApi';
import type { CartItem } from '../checkout/api/checkoutApi';
import type { Product } from '../../services/catalog.service';

interface CartState {
  items: CartItem[];
  totalItemAmount: number;
  isLoading: boolean;
  isCartOpen: boolean;
  
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  
  fetchCart: () => Promise<void>;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalItemAmount: 0,
  isLoading: false,
  isCartOpen: false,

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set({ isCartOpen: !get().isCartOpen }),

  fetchCart: async () => {
    set({ isLoading: true });
    const data = await CheckoutApi.getCart();
    set({ items: data.items, totalItemAmount: data.totalItemAmount, isLoading: false });
  },

  addToCart: async (product: Product, quantity = 1) => {
    set({ isLoading: true });
    const data = await CheckoutApi.addToCart(product, quantity);
    set({ items: data.items, totalItemAmount: data.totalItemAmount, isLoading: false, isCartOpen: true });
  },

  updateQuantity: async (productId: number, quantity: number) => {
    set({ isLoading: true });
    const data = await CheckoutApi.updateCartItem(productId, quantity);
    set({ items: data.items, totalItemAmount: data.totalItemAmount, isLoading: false });
  },

  removeItem: async (productId: number) => {
    set({ isLoading: true });
    const data = await CheckoutApi.removeCartItem(productId);
    set({ items: data.items, totalItemAmount: data.totalItemAmount, isLoading: false });
  }
}));
