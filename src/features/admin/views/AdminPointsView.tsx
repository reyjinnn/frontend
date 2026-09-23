import { useState } from 'react';
import { 
  Award, 
  Settings2, 
  History, 
  Gift, 
  TrendingUp, 
  UserPlus, 
  Search,
  PlusCircle,
  MinusCircle
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';

// Mock data
const recentTransactions = [
  { id: 'TX-P01', user: 'Budi Santoso', type: 'Earn', amount: '+500', source: 'Purchase ORD-8439', date: 'Hari ini, 14:30' },
  { id: 'TX-P02', user: 'Siti Aminah', type: 'Redeem', amount: '-1200', source: 'Discount on ORD-8440', date: 'Hari ini, 12:15' },
  { id: 'TX-P03', user: 'Ahmad Fauzi', type: 'Earn', amount: '+250', source: 'Review PRD-102', date: 'Kemarin, 09:00' },
  { id: 'TX-P04', user: 'Admin (System)', type: 'Manual Adjustment', amount: '+1000', source: 'Apology for late delivery', date: 'Kemarin, 16:45' },
];

export function AdminPointsView() {
  const [activeTab, setActiveTab] = useState('config'); // 'config' | 'transactions' | 'manual'
  
  const [earningRate, setEarningRate] = useState(1000);
  const [redemptionValue, setRedemptionValue] = useState(10);
  const [isMultiplierActive, setIsMultiplierActive] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-space flex items-center gap-2">
          Vibe Points Management
        </h2>
        <p className="text-slate-500 text-sm mt-1">Konfigurasi program loyalitas, nilai tukar, dan riwayat poin pelanggan.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4">
            <Award className="w-5 h-5" />
          </div>
          <p className="text-sm text-slate-500 font-medium">Total Poin Beredar</p>
          <h3 className="text-2xl font-bold font-mono mt-1">2.450.000</h3>
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +15% bulan ini</p>
        </div>
        <div className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
            <Gift className="w-5 h-5" />
          </div>
          <p className="text-sm text-slate-500 font-medium">Total Poin Ditukar</p>
          <h3 className="text-2xl font-bold font-mono mt-1">850.000</h3>
          <p className="text-xs text-slate-400 mt-2">Setara Rp 8.500.000</p>
        </div>
        <div className="bg-gradient-to-br from-primary to-orange-400 p-6 rounded-3xl shadow-sm text-white">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-4">
            <Settings2 className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium opacity-90">Rasio Saat Ini</p>
          <h3 className="text-lg font-bold mt-1">1 Poin = Rp {redemptionValue}</h3>
          <p className="text-xs opacity-80 mt-2">Belanja Rp {new Intl.NumberFormat('id-ID').format(earningRate)} = 1 Poin</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('config')}
          className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'config' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Settings2 className="w-4 h-4" /> Global Settings
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'transactions' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <History className="w-4 h-4" /> Transaksi Poin
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'manual' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <UserPlus className="w-4 h-4" /> Manual Adjustment
        </button>
      </div>

      {activeTab === 'config' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
            <h3 className="text-lg font-bold font-space mb-6">Nilai Tukar Poin</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-semibold">Dapat 1 Poin setiap pembelanjaan (Rp)</label>
                  <span className="font-mono text-primary font-bold">{new Intl.NumberFormat('id-ID').format(earningRate)}</span>
                </div>
                <input type="range" min="100" max="10000" step="100" value={earningRate} onChange={(e) => setEarningRate(Number(e.target.value))} className="w-full accent-primary" />
              </div>
              
              <hr className="border-slate-200 dark:border-slate-800" />
              
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-semibold">Nilai 1 Poin saat ditukar (Rp)</label>
                  <span className="font-mono text-green-600 font-bold">{redemptionValue}</span>
                </div>
                <input type="range" min="1" max="100" step="1" value={redemptionValue} onChange={(e) => setRedemptionValue(Number(e.target.value))} className="w-full accent-green-600" />
              </div>

              <div className="pt-4 flex justify-end">
                <Button>Simpan Nilai Tukar</Button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold font-space">Campaign Multiplier</h3>
                <p className="text-sm text-slate-500 mt-1">Beri poin berlipat pada event tertentu.</p>
              </div>
              <button 
                onClick={() => setIsMultiplierActive(!isMultiplierActive)}
                className={`relative w-12 h-6 rounded-full transition-colors ${isMultiplierActive ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isMultiplierActive ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            
            <div className={`space-y-4 transition-opacity ${!isMultiplierActive ? 'opacity-50 pointer-events-none' : ''}`}>
              <div>
                <label className="block text-sm font-medium mb-1">Pengali (Multiplier)</label>
                <select className="w-full px-4 py-2 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary">
                  <option value="2">2x Poin</option>
                  <option value="3">3x Poin</option>
                  <option value="5">5x Poin</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Berlaku Dari</label>
                  <input type="date" className="w-full px-4 py-2 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sampai</label>
                  <input type="date" className="w-full px-4 py-2 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div className="pt-2">
                <Button variant="outline" className="w-full border-dashed">
                  Update Campaign
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-[#141414]">
            <div className="relative w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari user atau ID transaksi..."
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <Button variant="outline" className="bg-white dark:bg-black">Export CSV</Button>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white dark:bg-[#111] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-semibold">ID Transaksi</th>
                  <th className="px-6 py-4 font-semibold">Pelanggan</th>
                  <th className="px-6 py-4 font-semibold">Jenis</th>
                  <th className="px-6 py-4 font-semibold">Sumber</th>
                  <th className="px-6 py-4 font-semibold text-right">Jumlah Poin</th>
                  <th className="px-6 py-4 font-semibold text-right">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-[#111]">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-500">{tx.id}</td>
                    <td className="px-6 py-4 font-medium">{tx.user}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        tx.type === 'Earn' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        tx.type === 'Redeem' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' :
                        'bg-primary/10 text-primary'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{tx.source}</td>
                    <td className={`px-6 py-4 text-right font-mono font-bold ${
                      tx.amount.startsWith('+') ? 'text-green-600' : 'text-slate-900 dark:text-white'
                    }`}>
                      {tx.amount}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-500">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'manual' && (
        <div className="max-w-2xl bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm p-6">
          <h3 className="text-lg font-bold font-space flex items-center gap-2 mb-6">
            <UserPlus className="w-5 h-5 text-primary" /> Adjustment Manual
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Email / ID Pelanggan</label>
              <input type="text" placeholder="user@example.com" className="w-full px-4 py-2 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-3">Tindakan</label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center justify-center gap-2 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors">
                  <input type="radio" name="action" value="add" className="sr-only" />
                  <PlusCircle className="w-5 h-5 text-green-500" />
                  <span className="font-semibold text-green-700 dark:text-green-500">Tambah Poin</span>
                </label>
                <label className="flex items-center justify-center gap-2 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                  <input type="radio" name="action" value="deduct" className="sr-only" />
                  <MinusCircle className="w-5 h-5 text-red-500" />
                  <span className="font-semibold text-red-700 dark:text-red-500">Kurangi Poin</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Jumlah Poin</label>
              <input type="number" placeholder="Contoh: 1000" className="w-full px-4 py-2 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Alasan (opsional)</label>
              <textarea placeholder="Contoh: Kompensasi keterlambatan pengiriman..." className="w-full px-4 py-2 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary min-h-[100px]"></textarea>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <Button variant="outline">Batal</Button>
              <Button>Proses Adjustment</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
