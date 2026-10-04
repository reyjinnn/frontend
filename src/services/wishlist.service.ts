import { readDemoDB, requireDemoUser, transactDemoDB } from '../lib/demoRepository';

export const WishlistService = {
  async getWishlist() {
    const user = requireDemoUser('customer');
    const ids = readDemoDB().wishlists[user.id] ?? [];
    return readDemoDB().products.filter(p => ids.includes(p.id));
  },
  async toggleWishlist(productId: number) {
    const user = requireDemoUser('customer');
    return transactDemoDB(db => {
      const list = db.wishlists[user.id] ??= [];
      const index = list.indexOf(productId);
      const isSaved = index < 0;
      if (isSaved) list.push(productId);
      else list.splice(index, 1);
      return { success: true, isSaved };
    });
  }
};
