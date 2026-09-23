import { useNavigate } from 'react-router-dom';

export function CategoryTiles() {
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    navigate(`/catalog?category=${category}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-1 mb-5">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Jelajahi Produk Berdasarkan Kategori</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Koleksi perangkat keras resmi terlengkap dengan dukungan cicilan TLater</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Cat 1 */}
        <div 
          onClick={() => handleCategoryClick('Laptops')} 
          className="p-4 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-slate-200/90 dark:border-slate-800 hover:border-pumpkin dark:hover:border-pumpkin cursor-pointer transition shadow-card flex flex-col items-center text-center space-y-2 group"
        >
          <div className="w-20 h-20 flex items-center justify-center">
            <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&auto=format&fit=crop&q=80" alt="Laptops" className="h-16 object-contain group-hover:scale-105 transition" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100">Laptop & MacBook</h3>
            <p className="text-[10px] text-slate-500">Mulai dari Rp 14.500.000</p>
          </div>
        </div>

        {/* Cat 2 */}
        <div 
          onClick={() => handleCategoryClick('Smartphones')} 
          className="p-4 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-slate-200/90 dark:border-slate-800 hover:border-pumpkin dark:hover:border-pumpkin cursor-pointer transition shadow-card flex flex-col items-center text-center space-y-2 group"
        >
          <div className="w-20 h-20 flex items-center justify-center">
            <img src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200&auto=format&fit=crop&q=80" alt="Smartphones" className="h-16 object-contain group-hover:scale-105 transition" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100">iPhone & Flagship</h3>
            <p className="text-[10px] text-slate-500">Mulai dari Rp 18.499.000</p>
          </div>
        </div>

        {/* Cat 3 */}
        <div 
          onClick={() => handleCategoryClick('PC Components')} 
          className="p-4 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-slate-200/90 dark:border-slate-800 hover:border-pumpkin dark:hover:border-pumpkin cursor-pointer transition shadow-card flex flex-col items-center text-center space-y-2 group"
        >
          <div className="w-20 h-20 flex items-center justify-center">
            <img src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=200&auto=format&fit=crop&q=80" alt="PC Components" className="h-16 object-contain group-hover:scale-105 transition" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100">Komponen PC Gaming</h3>
            <p className="text-[10px] text-slate-500">Mulai dari Rp 4.750.000</p>
          </div>
        </div>

        {/* Cat 4 */}
        <div 
          onClick={() => handleCategoryClick('Gaming Peripherals')} 
          className="p-4 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-slate-200/90 dark:border-slate-800 hover:border-pumpkin dark:hover:border-pumpkin cursor-pointer transition shadow-card flex flex-col items-center text-center space-y-2 group"
        >
          <div className="w-20 h-20 flex items-center justify-center">
            <img src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&auto=format&fit=crop&q=80" alt="Gaming Gear" className="h-16 object-contain group-hover:scale-105 transition" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100">Aksesoris & Audio</h3>
            <p className="text-[10px] text-slate-500">Mulai dari Rp 2.299.000</p>
          </div>
        </div>

      </div>
    </div>
  );
}
