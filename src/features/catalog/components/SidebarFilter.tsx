import { useEffect, useState } from 'react';
import { CatalogService } from '../../../services/catalog.service';
import type { Category } from '../../../services/catalog.service';

interface FilterProps {
  onFilterChange: (filters: { categoryId?: number; maxPrice?: number; tlaterOnly?: boolean }) => void;
  initialFilters?: { categoryId?: number; maxPrice?: number; tlaterOnly?: boolean };
}

export function SidebarFilter({ onFilterChange, initialFilters }: FilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const selectedCat = initialFilters?.categoryId;
  const maxPrice = initialFilters?.maxPrice ?? 60000000;
  const tlaterOnly = initialFilters?.tlaterOnly ?? false;
  const setSelectedCat = (categoryId: number) => onFilterChange({ ...initialFilters, categoryId });
  const setMaxPrice = (value: number) => onFilterChange({ ...initialFilters, maxPrice: value });
  const setTlaterOnly = (value: boolean) => onFilterChange({ ...initialFilters, tlaterOnly: value });

  useEffect(() => {
    CatalogService.getCategories().then(setCategories);
  }, []);

  const handleReset = () => onFilterChange({});

  return (
    <div className="bg-white dark:bg-[#1A1A1A] border border-slate-100 dark:border-slate-800/60 rounded-2xl p-6 h-fit sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg">Filter</h3>
        <button onClick={handleReset} className="text-xs text-pumpkin hover:underline font-medium">Reset</button>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold mb-3 text-sm">Kategori</h4>
        <div className="space-y-2">
          {categories.map(cat => (
            <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="radio" 
                  name="category" 
                  checked={selectedCat === cat.id}
                  onChange={() => setSelectedCat(cat.id)}
                  className="peer appearance-none w-4 h-4 border border-slate-300 dark:border-slate-600 rounded-full checked:border-pumpkin transition-colors"
                />
                <div className="absolute w-2 h-2 bg-pumpkin rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold mb-3 text-sm flex justify-between">
          <span>Harga Maksimum</span>
          <span className="text-pumpkin font-mono">Rp {(maxPrice / 1000000).toFixed(1)} Jt</span>
        </h4>
        <input 
          type="range" 
          min="1000000" 
          max="60000000" 
          step="1000000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-pumpkin h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-2">
          <span>Rp 1 Jt</span>
          <span>Rp 60 Jt</span>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center justify-center">
            <input 
              type="checkbox" 
              checked={tlaterOnly}
              onChange={(e) => setTlaterOnly(e.target.checked)}
              className="peer appearance-none w-4 h-4 border border-slate-300 dark:border-slate-600 rounded checked:bg-tlater checked:border-tlater transition-colors"
            />
            <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">Dapat dicicil dengan TLater</span>
        </label>
      </div>
    </div>
  );
}
