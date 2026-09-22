import { MapPin } from 'lucide-react';

export function SubNavbar() {
  const categories = [
    "Laptop & MacBook",
    "Komponen PC Gaming",
    "iPhone & Smartphone",
    "Aksesoris & Audio"
  ];

  return (
    <div className="bg-white dark:bg-black border-b border-slate-100 dark:border-slate-800/60 text-sm hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {categories.map((cat, idx) => (
            <a key={idx} href="#" className="text-slate-600 dark:text-slate-400 hover:text-pumpkin transition-colors">
              {cat}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <MapPin className="w-4 h-4 text-pumpkin" />
          <span>Dikirim ke: <strong>Jakarta Selatan</strong></span>
        </div>
      </div>
    </div>
  );
}
