import { Link } from 'react-router-dom';

export function UtilityBar() {
  return (
    <div className="bg-slate-100 dark:bg-[#141414] border-b border-slate-200 dark:border-slate-800 text-slate-500 text-[11px] font-medium">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="hidden md:inline text-slate-300 dark:text-slate-700">|</span>
          <span className="hidden md:inline hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer">Download Aplikasi Tech Vibe</span>
          <span className="hidden md:inline text-slate-300 dark:text-slate-700">|</span>
          <Link to="/care" className="hidden md:inline hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer">TechVibe Care</Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/points" className="hover:text-amber-600 transition flex items-center gap-1">
            <span className="text-amber-500 font-bold"></span> Vibe Poin
          </Link>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <Link to="/tlater" className="hover:text-sky-600 transition flex items-center gap-1">
            <span className="text-sky-600 font-bold"></span> TLater
          </Link>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer">Mitra Resmi</span>
        </div>
      </div>
    </div>
  );
}
