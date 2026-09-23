import { Link, useLocation } from 'react-router-dom';

export function SubNavbar() {
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isCatalog = location.pathname === '/catalog';

  return (
    <div className="bg-transparent border-b border-slate-200/50 dark:border-slate-800/50 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
        <div className="flex items-center space-x-1 py-1.5">
          <Link 
            to="/" 
            className={`px-3.5 py-1.5 rounded-lg transition ${isHome ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-[#1A1A1A] font-bold' : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1A1A1A]'}`}
          >
            Beranda
          </Link>
          <Link 
            to="/catalog" 
            className={`px-3.5 py-1.5 rounded-lg transition ${isCatalog ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-[#1A1A1A] font-bold' : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1A1A1A]'}`}
          >
            Katalog Hardware
          </Link>
          <button className="px-3.5 py-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1A1A1A] transition">
            Laptop & MacBook
          </button>
          <button className="px-3.5 py-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1A1A1A] transition">
            Komponen PC & Gaming
          </button>
          <button className="px-3.5 py-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1A1A1A] transition">
            iPhone & Smartphone
          </button>
          <button className="px-3.5 py-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1A1A1A] transition">
            Aksesori & Audio
          </button>
        </div>

        {/* Location Badge */}
        <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-500">
          <svg className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <span>Dikirim ke: <strong className="text-slate-700 dark:text-slate-300">Jakarta Selatan</strong></span>
        </div>
      </div>
    </div>
  );
}
