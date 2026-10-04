import { useEffect, useState, useMemo } from 'react';
import { CatalogService } from '../../../services/catalog.service';
import type { Product } from '../../../services/catalog.service';
import { SidebarFilter } from '../components/SidebarFilter';
import { ProductCard } from '../components/ProductCard';
import { useSearchParams } from 'react-router-dom';

export function CatalogView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [params, setParams] = useSearchParams();
  const sortBy = params.get('sort') || 'recommendation';
  const filters = useMemo(() => ({ categoryId: Number(params.get('category')) || undefined, maxPrice: Number(params.get('maxPrice')) || undefined, tlaterOnly: params.get('tlater') === 'true' }), [params]);
  const setSortBy = (sort: string) => { const next = new URLSearchParams(params); next.set('sort', sort); setParams(next); };
  const setFilters = (value: { categoryId?: number; maxPrice?: number; tlaterOnly?: boolean }) => {
    const next = new URLSearchParams(params);
    for (const [key, v] of Object.entries({ category: value.categoryId, maxPrice: value.maxPrice, tlater: value.tlaterOnly })) {
      if (v) next.set(key, String(v)); else next.delete(key);
    }
    setParams(next);
  };
  const query = params.get('q') || '';

  useEffect(() => {
    
    CatalogService.getProducts({ maxPrice: filters.maxPrice, categoryId: filters.categoryId }).then(res => {
      let filtered = res.items.filter((p: Product) => p.name.toLowerCase().includes(query.toLowerCase()));
      if (filters.tlaterOnly) {
        filtered = filtered.filter((p: Product) => p.tlaterMonthly);
      }

      if (sortBy === 'price_asc') {
        filtered = filtered.sort((a: Product, b: Product) => a.price - b.price);
      } else if (sortBy === 'price_desc') {
        filtered = filtered.sort((a: Product, b: Product) => b.price - a.price);
      }

      setProducts(filtered);
    });
  }, [filters.categoryId, filters.maxPrice, filters.tlaterOnly, query, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        <div className="w-full md:w-64 flex-shrink-0">
          <SidebarFilter onFilterChange={setFilters} initialFilters={filters} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-xl md:text-2xl font-bold">Katalog Produk</h2>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500 dark:text-slate-400">Urutkan:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-slate-700 text-sm rounded-lg py-2 pl-3 pr-8 focus:ring-2 focus:ring-pumpkin focus:outline-none appearance-none cursor-pointer"
              >
                <option value="recommendation">Rekomendasi</option>
                <option value="price_asc">Harga Terendah</option>
                <option value="price_desc">Harga Tertinggi</option>
              </select>
            </div>
          </div>
          
          {products.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <p className="text-slate-500">Tidak ada produk yang cocok dengan filter Anda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
