import { useState } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronDown
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export function AdminDashboardView() {
  const [dateRange, setDateRange] = useState('Bulan Ini');

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-space">Ringkasan Eksekutif</h2>
          <p className="text-slate-500 text-sm mt-1">Performa bisnis TechVibe secara keseluruhan.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white dark:bg-[#111]">
            Unduh Laporan
          </Button>
          <div className="relative">
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 text-sm rounded-xl pl-4 pr-10 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary font-medium"
            >
              <option>Hari Ini</option>
              <option>7 Hari Terakhir</option>
              <option>Bulan Ini</option>
              <option>Tahun Ini</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3" />
              12.5%
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Total Pendapatan</p>
          <h3 className="text-2xl font-bold font-space">Rp 45.280.500</h3>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3" />
              8.2%
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Pesanan Baru</p>
          <h3 className="text-2xl font-bold font-space">124</h3>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-500">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
              <ArrowDownRight className="w-3 h-3" />
              2.4%
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Pelanggan Baru</p>
          <h3 className="text-2xl font-bold font-space">45</h3>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-sky-500/10 rounded-full flex items-center justify-center text-sky-500">
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3" />
              15.3%
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Penyaluran TLater</p>
          <h3 className="text-2xl font-bold font-space">Rp 128.5M</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Line Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold">Grafik Pendapatan</h3>
              <p className="text-xs text-slate-500 mt-1">7 Hari Terakhir</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold font-space text-primary">Rp 45.2M</p>
            </div>
          </div>
          
          <div className="w-full h-64 relative group">
            <svg viewBox="0 0 800 300" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f8ef7" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#4f8ef7" stopOpacity="0" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              
              {/* Grid */}
              <g stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="1" strokeDasharray="4 4">
                <line x1="0" y1="50" x2="800" y2="50" />
                <line x1="0" y1="125" x2="800" y2="125" />
                <line x1="0" y1="200" x2="800" y2="200" />
                <line x1="0" y1="275" x2="800" y2="275" />
              </g>

              {/* Area & Line */}
              <path 
                d="M 0 200 C 100 200, 100 150, 200 150 C 300 150, 300 220, 400 220 C 500 220, 500 80, 600 80 C 700 80, 700 120, 800 120 L 800 275 L 0 275 Z" 
                fill="url(#lineGrad)" 
              />
              <path 
                d="M 0 200 C 100 200, 100 150, 200 150 C 300 150, 300 220, 400 220 C 500 220, 500 80, 600 80 C 700 80, 700 120, 800 120" 
                fill="none" 
                stroke="#4f8ef7" 
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#glow)"
              />

              {/* Points */}
              {[
                { x: 0, y: 200, val: "2.1M" },
                { x: 200, y: 150, val: "4.5M" },
                { x: 400, y: 220, val: "3.2M" },
                { x: 600, y: 80, val: "8.9M" },
                { x: 800, y: 120, val: "7.1M" }
              ].map((p, i) => (
                <g key={i} className="cursor-pointer">
                  <circle cx={p.x} cy={p.y} r="6" fill="#fff" stroke="#4f8ef7" strokeWidth="3" className="transition-all hover:r-[8]" />
                  <text 
                    x={p.x} 
                    y={p.y - 15} 
                    textAnchor={i === 0 ? "start" : i === 4 ? "end" : "middle"} 
                    className="text-[12px] fill-slate-600 dark:fill-slate-300 font-mono opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    {p.val}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          
          <div className="flex justify-between text-xs text-slate-400 font-mono px-2">
            <span>Senin</span>
            <span>Selasa</span>
            <span>Rabu</span>
            <span>Kamis</span>
            <span>Jumat</span>
            <span>Sabtu</span>
            <span>Minggu</span>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold">Produk Terlaris</h3>
            <button className="text-xs text-primary font-medium">Lihat Semua</button>
          </div>
          
          <div className="flex-1 space-y-4">
            {[
              { name: "MacBook Air M3 13\"", price: "18.9M", sales: 42, img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop" },
              { name: "iPhone 16 Pro 256GB", price: "20.9M", sales: 38, img: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100&h=100&fit=crop" },
              { name: "Apple Watch Ultra 2", price: "15.4M", sales: 25, img: "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=100&h=100&fit=crop" },
              { name: "Sony WH-1000XM5", price: "5.4M", sales: 20, img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=100&h=100&fit=crop" }
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center font-bold text-sm text-slate-400">
                  #{i + 1}
                </div>
                <img src={p.img} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.sales} terjual</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold font-mono">{p.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-bold">Pesanan Terbaru</h3>
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin/orders'}>Lihat Semua</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-[#141414] text-slate-500 font-medium border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Pelanggan</th>
                <th className="px-6 py-3">Tanggal</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {[
                { id: "TVB-20260920-001", customer: "Budi Santoso", date: "Hari ini, 14:30", total: "Rp 24.500.000", status: "Perlu Dikirim", statusColor: "text-orange-600 bg-orange-50 dark:bg-orange-900/20" },
                { id: "TVB-20260920-002", customer: "Siti Aminah", date: "Hari ini, 12:15", total: "Rp 5.499.000", status: "Menunggu Pembayaran", statusColor: "text-slate-600 bg-slate-100 dark:bg-slate-800" },
                { id: "TVB-20260919-089", customer: "Agus Pratama", date: "Kemarin, 18:45", total: "Rp 12.000.000", status: "Dikirim", statusColor: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
                { id: "TVB-20260918-045", customer: "Diana Putri", date: "18 Sep 2026", total: "Rp 3.500.000", status: "Selesai", statusColor: "text-green-600 bg-green-50 dark:bg-green-900/20" },
              ].map((order, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-[#141414] transition-colors cursor-pointer">
                  <td className="px-6 py-4 font-mono font-medium text-primary">{order.id}</td>
                  <td className="px-6 py-4 font-medium">{order.customer}</td>
                  <td className="px-6 py-4 text-slate-500">{order.date}</td>
                  <td className="px-6 py-4 font-mono font-bold">{order.total}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
