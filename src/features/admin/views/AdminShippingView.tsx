import { useState } from 'react';
import { 
  Truck, 
  Map, 
  Settings2, 
  Search, 
  MapPin, 
  Package, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';

// Mock data
const couriers = [
  { id: 'c1', name: 'TechVibe Express', type: 'Instant', baseRate: 15000, active: true, color: 'bg-primary' },
  { id: 'c2', name: 'JNE Reguler', type: 'Standard', baseRate: 10000, active: true, color: 'bg-blue-600' },
  { id: 'c3', name: 'J&T Express', type: 'Standard', baseRate: 12000, active: true, color: 'bg-red-600' },
  { id: 'c4', name: 'GoSend Same Day', type: 'Same Day', baseRate: 20000, active: false, color: 'bg-green-500' },
];

const activeShipments = [
  { id: 'SHP-9921', orderId: 'ORD-8439', courier: 'TechVibe Express', status: 'In Transit', location: 'Jakarta Selatan Hub', time: '10 mins ago' },
  { id: 'SHP-9922', orderId: 'ORD-8440', courier: 'JNE Reguler', status: 'Out for Delivery', location: 'Kebon Jeruk, Jakbar', time: '1 hour ago' },
  { id: 'SHP-9923', orderId: 'ORD-8441', courier: 'J&T Express', status: 'Exception', location: 'Sortation Center, Bekasi', time: '2 hours ago' },
];

export function AdminShippingView() {
  const [activeTab, setActiveTab] = useState('tracking'); // 'tracking' | 'couriers' | 'rules'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-space flex items-center gap-2">
          Shipping Management
        </h2>
        <p className="text-slate-500 text-sm mt-1">Pantau pengiriman aktif dan atur armada kurir toko.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('tracking')}
          className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'tracking' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Map className="w-4 h-4" /> Live Tracking
        </button>
        <button
          onClick={() => setActiveTab('couriers')}
          className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'couriers' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Truck className="w-4 h-4" /> Manajemen Kurir
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'rules' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Settings2 className="w-4 h-4" /> Aturan Pengiriman
        </button>
      </div>

      {activeTab === 'tracking' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Simulated Map Area */}
          <div className="lg:col-span-2 bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141414] flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" /> Peta Pengiriman Live
              </h3>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 text-xs font-bold rounded-lg">42 Active</span>
                <span className="px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 text-xs font-bold rounded-lg">3 Delayed</span>
              </div>
            </div>
            
            <div className="relative flex-1 min-h-[400px] bg-slate-100 dark:bg-slate-900 overflow-hidden">
              {/* Simulated Map Background */}
              <div className="absolute inset-0 opacity-20 dark:opacity-10" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              
              {/* Simulated Map Markers */}
              <div className="absolute top-1/4 left-1/4">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-12 h-12 bg-primary/20 rounded-full animate-ping"></div>
                  <div className="w-4 h-4 bg-primary rounded-full shadow-lg border-2 border-white dark:border-black z-10"></div>
                </div>
              </div>
              <div className="absolute top-2/4 left-2/3">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-8 h-8 bg-blue-500/20 rounded-full animate-ping"></div>
                  <div className="w-4 h-4 bg-blue-500 rounded-full shadow-lg border-2 border-white dark:border-black z-10"></div>
                </div>
              </div>
              <div className="absolute bottom-1/3 left-1/2">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-10 h-10 bg-red-500/20 rounded-full animate-ping"></div>
                  <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg border-2 border-white dark:border-black z-10"></div>
                </div>
              </div>
              
              <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-black/90 backdrop-blur p-3 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 text-xs font-medium space-y-2">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-primary rounded-full"></div> TechVibe Express</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> JNE</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div> J&T</div>
              </div>
            </div>
          </div>

          {/* Active Shipments List */}
          <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Cari resi / order..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeShipments.map(ship => (
                <div key={ship.id} className="p-3 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-primary/50 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-sm font-bold group-hover:text-primary transition-colors">{ship.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                      ship.status === 'Exception' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {ship.status}
                    </span>
                  </div>
                  <div className="text-sm font-medium mb-2 flex items-center gap-1">
                    <Package className="w-3 h-3 text-slate-400" /> {ship.orderId}
                  </div>
                  <div className="text-xs text-slate-500 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {ship.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> {ship.courier}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {ship.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'couriers' && (
        <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="space-y-4">
              {couriers.map(courier => (
                <div key={courier.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-[#141414]">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl ${courier.color}`}>
                      {courier.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold">{courier.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                        <span className="bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-xs">{courier.type}</span>
                        <span>Base: Rp {new Intl.NumberFormat('id-ID').format(courier.baseRate)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-medium ${courier.active ? 'text-green-600' : 'text-slate-400'}`}>
                      {courier.active ? 'Aktif' : 'Nonaktif'}
                    </span>
                    <button 
                      className={`relative w-12 h-6 rounded-full transition-colors ${courier.active ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${courier.active ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="max-w-2xl bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm p-6">
          <h3 className="text-lg font-bold font-space flex items-center gap-2 mb-6">
            <Settings2 className="w-5 h-5 text-primary" /> Aturan Promosi Ongkir
          </h3>
          
          <div className="space-y-6">
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="font-bold text-primary">Gratis Ongkir</h4>
                  <p className="text-xs text-slate-500 mt-1">Aktifkan subsidi ongkir untuk minimum belanja tertentu.</p>
                </div>
                <button className="relative w-12 h-6 rounded-full bg-primary transition-colors">
                  <span className="absolute top-1 left-7 w-4 h-4 rounded-full bg-white transition-all" />
                </button>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-primary/10">
                <div>
                  <label className="block text-sm font-medium mb-1">Minimum Belanja (Rp)</label>
                  <input type="number" defaultValue="250000" className="w-full px-4 py-2 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Maksimal Subsidi Ongkir (Rp)</label>
                  <input type="number" defaultValue="20000" className="w-full px-4 py-2 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary" />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-start gap-4">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-slate-600 dark:text-slate-400">
                <strong className="text-slate-900 dark:text-slate-100 block mb-1">Peringatan Subsidi</strong>
                Biaya subsidi gratis ongkir akan dibebankan ke anggaran promosi toko (Store Promo Budget). Pastikan margin keuntungan produk mencukupi sebelum mengubah nilai maksimum subsidi.
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button>Simpan Aturan</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
