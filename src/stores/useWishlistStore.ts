import { create } from 'zustand';
import { WishlistService } from '../services/wishlist.service';

interface WishlistState {
  items: Set<number>;
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  toggleWishlist: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: new Set<number>(),
  isLoading: false,
  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const data = await WishlistService.getWishlist();
      const ids = new Set<number>(data.map((i: any) => i.productId));
      set({ items: ids, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
    }
  },
  toggleWishlist: async (productId: number) => {
    // Optimistic UI update
    const current = new Set(get().items);
    const wasInWishlist = current.has(productId);
    
    if (wasInWishlist) {
      current.delete(productId);
    } else {
      current.add(productId);
    }
    set({ items: current });

    try {
      // Actually sync with server
      await WishlistService.toggleWishlist(productId);
    } catch (e) {
      // Revert if failed
      const reverted = new Set(get().items);
      if (wasInWishlist) {
        reverted.add(productId);
      } else {
        reverted.delete(productId);
      }
      set({ items: reverted });
    }
  },
  isInWishlist: (productId: number) => {
    return get().items.has(productId);
  }
}));
