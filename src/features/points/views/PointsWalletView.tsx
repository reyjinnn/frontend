import { useEffect, useState } from 'react';
import { PointsApi } from '../api/pointsApi';
import type { PointsWallet, LedgerEntry } from '../api/pointsApi';
import { Coins, ShieldCheck, History } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export function PointsWalletView() {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState<PointsWallet | null>(null);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      PointsApi.getWallet(),
      PointsApi.getHistory()
    ]).then(([wRes, hRes]) => {
      setWallet(wRes);
      setLedger(hRes.items);
      setIsLoading(false);
    });
  }, []);

  if (isLoading || !wallet) {
    return <div className="p-8 text-center">Memuat Dompet Poin...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Dompet Vibe Poin</h1>
        <p className="text-slate-500">Kelola dan tukarkan poin loyalitas Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {}
        <div className="lg:col-span-1 relative overflow-hidden rounded-3xl p-8 text-orange-950 shadow-xl shadow-orange-500/20" 
             style={{ background: 'linear-gradient(135deg, #FDE68A 0%, #D97706 100%)' }}>
          
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <Coins className="w-6 h-6" />
              <h3 className="font-bold">Total Poin</h3>
            </div>
            <p className="text-5xl font-mono font-bold mb-2">
              {wallet.availableBalance.toLocaleString('id-ID')}
            </p>
            <p className="text-sm font-semibold opacity-80 mb-8">
              1 Poin = Rp 1,00 potongan belanja langsung
            </p>
            
            <Button 
              variant="outline" 
              className="w-full border-orange-950/20 hover:bg-orange-950 hover:text-white transition-colors"
              onClick={() => navigate('/')}
            >
              Gunakan untuk Belanja
            </Button>
          </div>
        </div>

        {}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-3xl border border-slate-100 dark:border-slate-800 h-full flex flex-col justify-center">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              Double-Entry Immutable Ledger
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Seluruh mutasi poin (kredit dan debit) direkam dalam <em>immutable ledger</em> menggunakan sistem buku kas ganda dan <strong>Idempotency-Key</strong>. Hal ini menjamin tidak ada duplikasi transaksi dan setiap pergerakan saldo terekam secara persisten, aman, dan dapat diaudit secara matematis.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800">
                <p className="text-xs text-green-800 dark:text-green-300 font-semibold mb-1">Total Poin Masuk</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">+{ledger.filter(l => l.type === 'credit').reduce((sum, l) => sum + l.amount, 0).toLocaleString('id-ID')}</p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800">
                <p className="text-xs text-red-800 dark:text-red-300 font-semibold mb-1">Total Poin Keluar</p>
                <p className="text-xl font-bold text-red-600 dark:text-red-400">-{ledger.filter(l => l.type === 'debit').reduce((sum, l) => sum + l.amount, 0).toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1A1A1A] border border-slate-100 dark:border-slate-800 rounded-3xl p-6">
        <h3 className="font-bold text-lg flex items-center gap-2 mb-6">
          <History className="w-5 h-5 text-slate-400" /> Riwayat Mutasi (Jurnal Kas)
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50 dark:bg-[#141414] uppercase border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3 font-semibold rounded-tl-xl">Waktu (WIB)</th>
                <th className="px-4 py-3 font-semibold">Idempotency Key</th>
                <th className="px-4 py-3 font-semibold">Jenis</th>
                <th className="px-4 py-3 font-semibold">Nominal</th>
                <th className="px-4 py-3 font-semibold">Saldo Akhir</th>
                <th className="px-4 py-3 font-semibold rounded-tr-xl">Deskripsi</th>
              </tr>
            </thead>
            <tbody>
              {ledger.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-400">Belum ada riwayat transaksi.</td></tr>
              ) : ledger.map(entry => (
                <tr key={entry.id} className="border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-[#141414]/50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    {new Date(entry.createdAt).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-slate-400">{entry.idempotencyKey}</td>
                  <td className="px-4 py-4">
                    {entry.type === 'credit' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 uppercase">
                        Kredit
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 uppercase">
                        Debit
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 font-mono font-bold whitespace-nowrap">
                    <span className={entry.type === 'credit' ? 'text-green-500' : 'text-red-500'}>
                      {entry.type === 'credit' ? '+' : '-'} {entry.amount.toLocaleString('id-ID')}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-mono font-bold whitespace-nowrap">{entry.balanceAfter.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-4 min-w-[200px]">{entry.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
