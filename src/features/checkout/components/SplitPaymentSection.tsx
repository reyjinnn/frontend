import { Coins, CreditCard, Info } from 'lucide-react';

interface SplitPaymentProps {
  grandTotal: number;
  // Points
  pointsBalance: number;
  usePoints: boolean;
  pointsAmount: number;
  setUsePoints: (use: boolean) => void;
  setPointsAmount: (amount: number) => void;
  
  // TLater
  tlaterLimit: number;
  useTlater: boolean;
  tlaterTenor: number;
  setUseTlater: (use: boolean) => void;
  setTlaterTenor: (tenor: number) => void;
}

export function SplitPaymentSection({
  grandTotal,
  pointsBalance,
  usePoints,
  pointsAmount,
  setUsePoints,
  setPointsAmount,
  tlaterLimit,
  useTlater,
  tlaterTenor,
  setUseTlater,
  setTlaterTenor
}: SplitPaymentProps) {
  
  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPointsAmount(Number(e.target.value));
  };

  const handlePointsToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsePoints(e.target.checked);
    if (!e.target.checked) setPointsAmount(0);
    else setPointsAmount(Math.min(pointsBalance, grandTotal));
  };

  // Logic calculation for display purposes
  const pointsDeduction = usePoints ? pointsAmount : 0;
  const remainingAfterPoints = grandTotal - pointsDeduction;
  
  // Auto-capped Split Check
  const isTlaterCapped = useTlater && (remainingAfterPoints > tlaterLimit);
  const tlaterPrincipal = useTlater ? Math.min(remainingAfterPoints, tlaterLimit) : 0;
  const gatewayCashRequired = useTlater ? Math.max(0, remainingAfterPoints - tlaterLimit) : remainingAfterPoints;

  return (
    <div className="space-y-6">
      
      {/* Vibe Points */}
      <div className="bg-white dark:bg-[#1A1A1A] border border-slate-100 dark:border-slate-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold">Pakai Vibe Poin</h3>
              <p className="text-xs text-slate-500">Saldo: {pointsBalance.toLocaleString('id-ID')} Poin</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={usePoints} onChange={handlePointsToggle} />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pumpkin"></div>
          </label>
        </div>

        {usePoints && (
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span>Jumlah Poin</span>
              <span className="text-pumpkin font-mono">- Rp {pointsAmount.toLocaleString('id-ID')}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max={Math.min(pointsBalance, grandTotal)} 
              step="1"
              value={pointsAmount}
              onChange={handlePointsChange}
              className="w-full accent-pumpkin h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* TLater BNPL */}
      <div className="bg-white dark:bg-[#1A1A1A] border border-slate-100 dark:border-slate-800 rounded-3xl p-6 overflow-hidden relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-tlater/10 text-tlater rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold">TLater PayLater</h3>
              <p className="text-xs text-slate-500">Limit: Rp {tlaterLimit.toLocaleString('id-ID')}</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={useTlater} onChange={(e) => setUseTlater(e.target.checked)} />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-tlater"></div>
          </label>
        </div>

        {useTlater && (
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-2">
            
            {isTlaterCapped && (
              <div className="mb-6 bg-sky-50 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-800 rounded-xl p-4 flex gap-3">
                <Info className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-sky-800 dark:text-sky-300 leading-relaxed">
                  Saldo TLater tidak mencukupi untuk bayar penuh. Sisa tagihan sebesar <strong className="font-mono">Rp {gatewayCashRequired.toLocaleString('id-ID')}</strong> dialihkan ke pembayaran tunai (Virtual Account / Kartu Kredit).
                </p>
              </div>
            )}

            <h4 className="text-sm font-semibold mb-3">Pilih Tenor Cicilan (dari Rp {tlaterPrincipal.toLocaleString('id-ID')})</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { months: 1, label: '1 Bulan', sub: 'Bunga 0%, Adm 1%' },
                { months: 3, label: '3 Bulan', sub: 'Bunga 2.5%/bln' },
                { months: 6, label: '6 Bulan', sub: 'Bunga 2.5%/bln' },
              ].map(t => (
                <button
                  key={t.months}
                  onClick={() => setTlaterTenor(t.months)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    tlaterTenor === t.months 
                      ? 'border-tlater bg-tlater/5 ring-1 ring-tlater' 
                      : 'border-slate-200 dark:border-slate-700 hover:border-tlater/50'
                  }`}
                >
                  <div className="font-bold text-sm">{t.label}</div>
                  <div className="text-[10px] text-slate-500 mt-1">{t.sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
