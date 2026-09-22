import axios from 'axios';


const api = axios.create({
  baseURL: '/api/v1',
});

// Since wishlist is user specific and might need optimistic UI, 
// the service layer just talks to backend.

export const WishlistService = {
  async getWishlist() {
    try {
      const res = await api.get('/catalog/wishlist');
      return res.data;
    } catch (e) {
      console.warn("API wishlist unavailable, using mock");
      return []; // Return empty by default in mock mode
    }
  },
  async toggleWishlist(productId: number) {
    try {
      const res = await api.post(`/catalog/products/${productId}/wishlist`);
      return res.data;
    } catch (e) {
      console.warn("API wishlist toggle unavailable, using mock");
      return { success: true };
    }
  }
}
