export function UtilityBar() {
  return (
    <div className="bg-slate-100 dark:bg-[#1A1A1A] text-xs text-slate-600 dark:text-slate-400 py-1.5 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-primary transition-colors">Download App</a>
          <a href="#" className="hover:text-primary transition-colors">TechVibe Care</a>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-primary transition-colors font-medium">Vibe Poin 1%</a>
          <a href="#" className="hover:text-primary transition-colors font-medium">TLater</a>
          <a href="#" className="hover:text-primary transition-colors">Mitra Resmi</a>
        </div>
      </div>
    </div>
  );
}
