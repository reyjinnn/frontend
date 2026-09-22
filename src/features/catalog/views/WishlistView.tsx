import { useEffect, useState } from 'react';
import { CatalogService } from '../../../services/catalog.service';
import type { Product } from '../../../services/catalog.service';
import { useWishlistStore } from '../../../stores/useWishlistStore';
import { ProductCard } from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export function WishlistView() {
  const { items } = useWishlistStore();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    setIsLoading(true);
    CatalogService.getProducts()
      .then(res => {
        const filtered = res.items.filter((p: Product) => items.has(p.id));
        setWishlistProducts(filtered);
      })
      .finally(() => setIsLoading(false));
  }, [items]);

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Loading wishlist...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-[60vh]">
      <h2 className="text-2xl font-bold mb-8">Wishlist Anda</h2>

      {wishlistProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#1A1A1A] border border-slate-100 dark:border-slate-800/60 rounded-3xl text-center shadow-sm">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Wishlist Masih Kosong</h3>
          <p className="text-slate-500 mb-6">Anda belum menambahkan produk apa pun ke dalam wishlist.</p>
          <Link to="/catalog">
            <Button variant="primary">Mulai Belanja</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {wishlistProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
