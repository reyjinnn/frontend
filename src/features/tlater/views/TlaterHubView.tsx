import { useEffect, useState } from 'react';
import { useTlaterStore } from '../stores/useTlaterStore';
import { InstallmentTable } from '../components/InstallmentTable';
import { RepayModal } from '../components/RepayModal';
import { Button } from '../../../components/ui/Button';
import { CreditCard, Wallet, CalendarCheck, ShieldCheck } from 'lucide-react';

export function TlaterHubView() {
  const { account, loans, isLoading, fetchData } = useTlaterStore();
  
  const [repayId, setRepayId] = useState<number | null>(null);
  const [repayAmount, setRepayAmount] = useState<number>(0);
  const [isRepayOpen, setIsRepayOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading || !account) {
    return <div className="p-8 text-center">Memuat TLater Hub...</div>;
  }

  const handleRepayClick = (id: number, amount: number) => {
    setRepayId(id);
    setRepayAmount(amount);
    setIsRepayOpen(true);
  };

  const handleRepaySuccess = () => {
    
    fetchData();
  };

  const percentUsed = (account.usedLimit / account.creditLimit) * 100;

  const activeLoans = loans.filter(l => l.status === 'active');
  const nearestBill = activeLoans.length > 0 ? 1259166.67 : 0; 

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">TLater Hub</h1>
        <p className="text-slate-500">Kelola batas kredit, jadwal angsuran, dan pelunasan Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {}
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl p-8 text-white shadow-xl flex flex-col justify-between min-h-[220px]" 
             style={{ background: 'linear-gradient(135deg, #111 0%, #2a2a2a 100%)' }}>
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="relative z-10 flex justify-between items-start mb-8">
            <div>
              <p className="text-white/60 text-sm font-semibold mb-1 uppercase tracking-widest">Limit Tersedia</p>
              <h2 className="text-4xl md:text-5xl font-mono font-bold" id="dash-tlater-avail">
                Rp {account.availableLimit.toLocaleString('id-ID')}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-md">
              <CreditCard className="w-6 h-6 text-white/80" />
            </div>
          </div>

          <div className="relative z-10">
            <div className="flex justify-between text-xs font-mono text-white/60 mb-2">
              <span>Terpakai {percentUsed.toFixed(0)}% dari Rp {account.creditLimit.toLocaleString('id-ID')}</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-tlater to-sky-400 rounded-full transition-all duration-1000"
                style={{ width: `${percentUsed}%` }}
              ></div>
            </div>
          </div>
        </div>

        {}
        <div className="bg-white dark:bg-[#1A1A1A] border border-slate-100 dark:border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-4 text-slate-500">
              <CalendarCheck className="w-5 h-5" />
              <h3 className="font-semibold text-sm">Tagihan Terdekat</h3>
            </div>
            <p className="text-3xl font-mono font-bold text-pumpkin mb-2">
              Rp {nearestBill.toLocaleString('id-ID')}
            </p>
            {nearestBill > 0 ? (
              <span className="inline-block px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold rounded-full">
                Jatuh tempo 20 Okt 2026
              </span>
            ) : (
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold rounded-full">
                Tidak ada tagihan bulan ini
              </span>
            )}
          </div>
          
          <Button variant="outline" className="w-full mt-6" disabled={nearestBill === 0}>
            Lihat Rincian
          </Button>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-[#1A1A1A] border border-slate-100 dark:border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-50 dark:bg-[#141414] rounded-full flex items-center justify-center text-slate-400"><Wallet className="w-6 h-6"/></div>
          <div>
            <p className="text-xs text-slate-500 font-semibold mb-1">Total Limit Terpakai</p>
            <p className="text-lg font-bold font-mono">Rp {account.usedLimit.toLocaleString('id-ID')}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1A1A1A] border border-slate-100 dark:border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-50 dark:bg-[#141414] rounded-full flex items-center justify-center text-slate-400"><CalendarCheck className="w-6 h-6"/></div>
          <div>
            <p className="text-xs text-slate-500 font-semibold mb-1">Cicilan Aktif</p>
            <p className="text-lg font-bold">{activeLoans.length} Pesanan</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1A1A1A] border border-slate-100 dark:border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-500"><ShieldCheck className="w-6 h-6"/></div>
          <div>
            <p className="text-xs text-slate-500 font-semibold mb-1">Status Akun</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">Aman & Aktif</p>
          </div>
        </div>
      </div>

      {}
      <div className="space-y-6">
        <h2 className="text-xl font-bold mb-4">Rincian Angsuran Aktif</h2>
        {activeLoans.map(loan => (
          <InstallmentTable 
            key={loan.id} 
            loanCode={loan.loanCode} 
            onRepay={handleRepayClick} 
          />
        ))}
        {activeLoans.length === 0 && (
          <div className="text-center p-12 bg-white dark:bg-[#1A1A1A] border border-slate-100 dark:border-slate-800 rounded-3xl text-slate-500">
            Tidak ada cicilan aktif saat ini.
          </div>
        )}
      </div>

      <RepayModal 
        isOpen={isRepayOpen}
        installmentId={repayId}
        amount={repayAmount}
        onClose={() => setIsRepayOpen(false)}
        onSuccess={handleRepaySuccess}
      />
    </div>
  );
}
