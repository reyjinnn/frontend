import { useEffect, useState } from 'react';
import { CatalogService } from '../../../services/catalog.service';
import type { Category } from '../../../services/catalog.service';

export function CategoryTiles() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    CatalogService.getCategories().then(setCategories);
  }, []);

  // iBox-style category cards
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <h3 className="text-2xl font-bold mb-8">Kategori Pilihan</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {categories.slice(0, 4).map((cat) => (
          <div key={cat.id} className="group relative bg-slate-100 dark:bg-[#1A1A1A] rounded-2xl overflow-hidden aspect-square cursor-pointer transition-transform hover:-translate-y-1">
            {/* Minimalist image placeholder (iBox style uses product cutouts on gray background) */}
            <div className="absolute inset-0 flex items-center justify-center p-8 transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-slate-200 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                <span className="text-slate-400 dark:text-slate-600 font-medium">{cat.name}</span>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 bg-gradient-to-t from-black/60 to-transparent">
              <h4 className="text-white font-semibold text-lg md:text-xl">{cat.name}</h4>
              <p className="text-white/80 text-sm mt-1">Mulai dari Rp1.999.000</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
