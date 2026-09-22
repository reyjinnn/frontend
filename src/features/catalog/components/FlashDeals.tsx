import { useEffect, useState } from 'react';
import { CatalogService } from '../../../services/catalog.service';
import type { Product } from '../../../services/catalog.service';
import { ProductCard } from './ProductCard'; // We will create this

export function FlashDeals() {
  const [products, setProducts] = useState<Product[]>([]);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 45, s: 30 });

  useEffect(() => {
    CatalogService.getProducts().then(res => setProducts(res.items.slice(0, 4)));

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        if (s > 0) s--;
        else {
          s = 59;
          if (m > 0) m--;
          else {
            m = 59;
            if (h > 0) h--;
          }
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (val: number) => val.toString().padStart(2, '0');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            ⚡ Flash Deals
          </h3>
          <div className="flex items-center gap-1.5 font-mono text-sm font-bold">
            <span className="bg-red-500 text-white px-2 py-1 rounded">{formatTime(timeLeft.h)}</span>:
            <span className="bg-red-500 text-white px-2 py-1 rounded">{formatTime(timeLeft.m)}</span>:
            <span className="bg-red-500 text-white px-2 py-1 rounded">{formatTime(timeLeft.s)}</span>
          </div>
        </div>
        <a href="/catalog" className="text-pumpkin font-medium text-sm hover:underline">Lihat Semua</a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
