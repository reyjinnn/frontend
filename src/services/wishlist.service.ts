import api from '../lib/axios';

export const WishlistService = {
  async getWishlist() {
    try {
      const res = await api.get('localhost:3000/api/v1/catalog/wishlist');
      return res.data;
    } catch (e) {
      console.warn("API wishlist unavailable, using mock");
      return []; 
    }
  },
  async toggleWishlist(productId: number) {
    try {
      const res = await api.post(`localhost:3000/api/v1/catalog/products/${productId}/wishlist`);
      return res.data;
    } catch (e) {
      console.warn("API wishlist toggle unavailable, using mock");
      return { success: true };
    }
  }
}
