import { useEffect, useState } from 'react';
import { TlaterApi } from '../api/tlaterApi';
import type { TlaterLoan, TlaterInstallment } from '../api/tlaterApi';
import { Button } from '../../../components/ui/Button';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface InstallmentTableProps {
  loanCode: string;
  onRepay: (installmentId: number, amount: number) => void;
}

export function InstallmentTable({ loanCode, onRepay }: InstallmentTableProps) {
  const [loan, setLoan] = useState<TlaterLoan | null>(null);
  const [installments, setInstallments] = useState<TlaterInstallment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    TlaterApi.getLoanDetails(loanCode).then(res => {
      setLoan(res.loan);
      setInstallments(res.installments);
      setIsLoading(false);
    });
  }, [loanCode]);

  if (isLoading) return <div className="text-center p-8">Memuat jadwal angsuran...</div>;
  if (!loan) return null;

  const hasAdjusted = installments.some(i => i.isAdjusted);

  return (
    <div className="bg-white dark:bg-[#1A1A1A] border border-slate-100 dark:border-slate-800 rounded-3xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-lg">Jadwal Angsuran</h3>
          <p className="text-sm text-slate-500 font-mono">{loanCode}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Total Pokok Pinjaman</p>
          <p className="font-mono font-bold">Rp {loan.principalAmount.toLocaleString('id-ID')}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 bg-slate-50 dark:bg-[#141414] uppercase border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="px-4 py-3 font-semibold rounded-tl-xl">Bulan</th>
              <th className="px-4 py-3 font-semibold">Pokok</th>
              <th className="px-4 py-3 font-semibold">Bunga</th>
              <th className="px-4 py-3 font-semibold">Total Tagihan</th>
              <th className="px-4 py-3 font-semibold">Jatuh Tempo</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold text-right rounded-tr-xl">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {installments.map((inst) => (
              <tr key={inst.id} className="border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-[#141414]/50 transition-colors">
                <td className="px-4 py-4 font-mono">{inst.installmentNumber}/{loan.tenorMonths}</td>
                <td className="px-4 py-4 font-mono">
                  Rp {inst.principalDue.toLocaleString('id-ID')}
                  {inst.isAdjusted && <span className="text-pumpkin ml-1">*</span>}
                </td>
                <td className="px-4 py-4 font-mono">Rp {inst.interestDue.toLocaleString('id-ID')}</td>
                <td className="px-4 py-4 font-mono font-bold">Rp {inst.totalDue.toLocaleString('id-ID')}</td>
                <td className="px-4 py-4">
                  {new Date(inst.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-4 py-4">
                  {inst.status === 'paid' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Lunas
                    </span>
                  ) : inst.status === 'overdue' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                      <AlertCircle className="w-3.5 h-3.5" /> Terlambat
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
                      <Clock className="w-3.5 h-3.5" /> Mendatang
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 text-right">
                  {inst.status !== 'paid' ? (
                    <Button 
                      variant="primary" 
                      className="px-4 py-1.5 text-xs h-auto"
                      onClick={() => onRepay(inst.id, inst.totalDue)}
                    >
                      Bayar
                    </Button>
                  ) : (
                    <span className="text-slate-400 text-xs">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasAdjusted && (
        <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 rounded-xl">
          <p className="text-xs text-orange-800 dark:text-orange-300">
            <span className="font-bold">* Penny-Balancing:</span> Penyesuaian selisih pembulatan sen ke angsuran terakhir agar total cicilan berimbang sempurna dengan nilai pokok pinjaman.
          </p>
        </div>
      )}
    </div>
  );
}
