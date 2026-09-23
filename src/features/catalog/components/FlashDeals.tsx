import { Link } from 'react-router-dom';
import { CatalogService } from '../../../services/catalog.service';
import type { Product } from '../../../services/catalog.service';
import { ProductCard } from './ProductCard';
import { useEffect, useState } from 'react';

export function FlashDeals() {
  const [flashProducts, setFlashProducts] = useState<Product[]>([]);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 18 });

  useEffect(() => {
    CatalogService.getProducts({}).then(res => {
      const filtered = res.items.filter((p: Product) => p.discountPercentage && p.discountPercentage > 0).slice(0, 4);
      setFlashProducts(filtered);
    });

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (flashProducts.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white dark:bg-[#111] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-card">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800 gap-4">
          <div className="flex items-center gap-4">
            <div className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-black text-xs tracking-widest uppercase shadow-md flex items-center gap-1.5">
              <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              FLASH DEALS
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
              <span>Berakhir dalam:</span>
              <div className="flex items-center gap-1.5 font-mono text-white">
                <span className="px-2 py-1 rounded-lg bg-slate-800 dark:bg-slate-950 shadow-inner">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-slate-400 dark:text-slate-600">:</span>
                <span className="px-2 py-1 rounded-lg bg-slate-800 dark:bg-slate-950 shadow-inner">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-slate-400 dark:text-slate-600">:</span>
                <span className="px-2 py-1 rounded-lg bg-slate-800 dark:bg-slate-950 shadow-inner">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
          <Link to="/catalog" className="text-xs font-bold text-pumpkin hover:text-orange-600 transition flex items-center gap-1">
            Lihat Semua Promo
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-5">
          {flashProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
