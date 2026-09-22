import { useState, useEffect } from 'react';
import { AdminApi, type PromoData } from '../api/adminApi';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { 
  Tag, 
  Zap, 
  Ticket, 
  Percent, 
  Plus,
  Search,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  RefreshCw,
  Calendar,
  Clock
} from 'lucide-react';

export function AdminPromosView() {
  const [promos, setPromos] = useState<PromoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPromos = async () => {
    setIsLoading(true);
    try {
      const data = await AdminApi.getPromos();
      setPromos(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const tabs = [
    { id: 'all', label: 'Semua' },
    { id: 'active', label: 'Aktif' },
    { id: 'flash_sale', label: 'Flash Sale' },
    { id: 'voucher', label: 'Voucher Kode' },
    { id: 'auto', label: 'Diskon Otomatis' },
    { id: 'expired', label: 'Berakhir' }
  ];

  const filteredPromos = promos.filter(p => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return p.isActive;
    if (activeTab === 'expired') return !p.isActive;
    return p.promoType === activeTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-space">Promo & Diskon</h2>
          <p className="text-slate-500 text-sm mt-1">Kelola kampanye pemasaran, kupon, dan flash sale.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Buat Promo Baru
        </Button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Promo Aktif" value="12" icon={Tag} color="text-primary" bg="bg-primary/10" />
        <StatCard title="Total Penggunaan" value="4.2k" icon={CheckCircle2} color="text-green-500" bg="bg-green-500/10" />
        <StatCard title="Nilai Tersalurkan" value="Rp 85M" icon={Percent} color="text-purple-500" bg="bg-purple-500/10" />
        <StatCard title="Promo Akan Berakhir" value="3" icon={Clock} color="text-orange-500" bg="bg-orange-500/10" />
      </div>

      <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        
        {/* Tabs & Search */}
        <div className="border-b border-slate-200 dark:border-slate-800">
          <div className="flex overflow-x-auto hide-scrollbar px-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="p-4 bg-slate-50 dark:bg-[#141414] flex flex-col sm:flex-row gap-4 border-t border-slate-200 dark:border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari nama promo atau kode voucher..."
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Promo Grid */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-40 text-slate-500">Memuat data promo...</div>
          ) : filteredPromos.length === 0 ? (
            <div className="text-center py-12 text-slate-500">Tidak ada promo ditemukan.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPromos.map(promo => (
                <PromoCard key={promo.id} promo={promo} />
              ))}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <CreatePromoModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => { setIsModalOpen(false); fetchPromos(); }}
        />
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }: { title: string, value: string, icon: any, color: string, bg: string }) {
  return (
    <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 ${bg} ${color} rounded-full flex items-center justify-center shrink-0`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold font-space">{value}</h3>
      </div>
    </div>
  );
}

function PromoCard({ promo }: { promo: PromoData }) {
  const getRibbonColor = () => {
    switch (promo.promoType) {
      case 'flash_sale': return 'bg-rose-500';
      case 'voucher': return 'bg-orange-500';
      case 'auto': return 'bg-indigo-500';
      default: return 'bg-primary';
    }
  };

  const getIcon = () => {
    switch (promo.promoType) {
      case 'flash_sale': return <Zap className="w-4 h-4 text-rose-500" />;
      case 'voucher': return <Ticket className="w-4 h-4 text-orange-500" />;
      case 'auto': return <Percent className="w-4 h-4 text-indigo-500" />;
      default: return <Tag className="w-4 h-4 text-primary" />;
    }
  };

  const used = promo.quotaTotal - (promo.quotaRemaining || 0);
  const percentUsed = (used / promo.quotaTotal) * 100;

  return (
    <div className="relative bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 overflow-hidden flex flex-col">
      {/* Side Ribbon */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${getRibbonColor()}`}></div>
      
      <div className="flex justify-between items-start mb-4 pl-2">
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#111] px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
          {getIcon()}
          <span className="text-xs font-bold uppercase tracking-wider">{promo.promoType.replace('_', ' ')}</span>
        </div>
        <span className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider ${promo.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
          {promo.isActive ? 'Aktif' : 'Berakhir'}
        </span>
      </div>

      <div className="pl-2 mb-4">
        <h3 className="font-bold text-lg leading-tight mb-1">{promo.title}</h3>
        <p className="font-mono text-sm font-semibold text-primary">{promo.code}</p>
      </div>

      <div className="mt-auto pl-2">
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>Terpakai {percentUsed.toFixed(0)}%</span>
          <span>{used} / {promo.quotaTotal}</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className={`h-full ${getRibbonColor()}`} style={{ width: `${percentUsed}%` }}></div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            S/d {new Date(promo.endDate).toLocaleDateString('id-ID')}
          </div>
          <button className="text-primary font-medium hover:underline">Kelola</button>
        </div>
      </div>
    </div>
  );
}

// 7-Step Promo Builder Modal
function CreatePromoModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<PromoData>({
    title: '',
    code: '',
    promoType: 'voucher',
    discountType: 'fixed',
    discountValue: 0,
    minPurchase: 0,
    maxDiscount: 0,
    quotaTotal: 100,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 7));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleGenerateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'TVB-';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await AdminApi.createPromo(formData);
      onSuccess();
    } catch (e) {
      alert('Gagal membuat promo');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Pilih Jenis Promo</h3>
            <p className="text-sm text-slate-500 mb-6">Pilih jenis kampanye yang ingin Anda jalankan.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <TypeCard 
                icon={Zap} title="Flash Sale" desc="Waktu terbatas, diskon besar" color="text-rose-500" bg="bg-rose-500/10"
                selected={formData.promoType === 'flash_sale'} 
                onClick={() => setFormData({ ...formData, promoType: 'flash_sale' })} 
              />
              <TypeCard 
                icon={Ticket} title="Voucher Kode" desc="Klaim menggunakan kode unik" color="text-orange-500" bg="bg-orange-500/10"
                selected={formData.promoType === 'voucher'} 
                onClick={() => setFormData({ ...formData, promoType: 'voucher' })} 
              />
              <TypeCard 
                icon={Percent} title="Diskon Otomatis" desc="Langsung potong di keranjang" color="text-indigo-500" bg="bg-indigo-500/10"
                selected={formData.promoType === 'auto'} 
                onClick={() => setFormData({ ...formData, promoType: 'auto' })} 
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold">Informasi Dasar</h3>
            <Input 
              label="Nama Promo (Internal & Publik)" 
              placeholder="Contoh: Merdeka Sale 2026"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
            {formData.promoType === 'voucher' && (
              <div>
                <label className="block text-sm font-semibold mb-2">Kode Voucher</label>
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    value={formData.code}
                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="flex-1 bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-primary uppercase"
                    placeholder="Contoh: MERDEKA50"
                  />
                  <Button variant="outline" type="button" onClick={handleGenerateCode} className="shrink-0 gap-2">
                    <RefreshCw className="w-4 h-4" /> Auto-Generate
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold">Nilai Diskon</h3>
            <div>
              <label className="block text-sm font-semibold mb-2">Tipe Potongan</label>
              <div className="flex bg-slate-100 dark:bg-[#141414] p-1 rounded-xl">
                <button 
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${formData.discountType === 'percentage' ? 'bg-white dark:bg-[#222] shadow-sm' : 'text-slate-500'}`}
                  onClick={() => setFormData({ ...formData, discountType: 'percentage' })}
                >Persen (%)</button>
                <button 
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${formData.discountType === 'fixed' ? 'bg-white dark:bg-[#222] shadow-sm' : 'text-slate-500'}`}
                  onClick={() => setFormData({ ...formData, discountType: 'fixed' })}
                >Nominal (Rp)</button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label={formData.discountType === 'percentage' ? 'Persentase Diskon (%)' : 'Nominal Potongan (Rp)'}
                type="number"
                value={formData.discountValue || ''}
                onChange={e => setFormData({ ...formData, discountValue: parseInt(e.target.value) || 0 })}
              />
              {formData.discountType === 'percentage' && (
                <Input 
                  label="Maksimal Potongan (Rp)" 
                  type="number"
                  value={formData.maxDiscount || ''}
                  onChange={e => setFormData({ ...formData, maxDiscount: parseInt(e.target.value) || 0 })}
                  placeholder="0 untuk tanpa batas"
                />
              )}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold">Syarat & Periode</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Tanggal Mulai</label>
                <input 
                  type="date"
                  value={formData.startDate.split('T')[0]}
                  onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Tanggal Berakhir</label>
                <input 
                  type="date"
                  value={formData.endDate.split('T')[0]}
                  onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Minimal Belanja (Rp)" 
                type="number"
                value={formData.minPurchase || ''}
                onChange={e => setFormData({ ...formData, minPurchase: parseInt(e.target.value) || 0 })}
              />
              <Input 
                label="Kuota Penggunaan" 
                type="number"
                value={formData.quotaTotal || ''}
                onChange={e => setFormData({ ...formData, quotaTotal: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold">Target Produk</h3>
            <p className="text-sm text-slate-500 mb-6">Pilih produk yang berlaku untuk promo ini.</p>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border border-primary bg-primary/5 rounded-xl cursor-pointer">
                <input type="radio" name="targetProduct" defaultChecked className="w-4 h-4 text-primary" />
                <span className="font-medium">Semua Produk di Toko</span>
              </label>
              <label className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer opacity-50">
                <input type="radio" name="targetProduct" disabled className="w-4 h-4" />
                <span className="font-medium">Kategori Tertentu (Segera Hadir)</span>
              </label>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold">Target Pelanggan</h3>
            <p className="text-sm text-slate-500 mb-6">Tentukan siapa saja yang berhak menggunakan promo ini.</p>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border border-primary bg-primary/5 rounded-xl cursor-pointer">
                <input type="radio" name="targetCustomer" defaultChecked className="w-4 h-4 text-primary" />
                <span className="font-medium">Semua Pengguna</span>
              </label>
              <label className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer opacity-50">
                <input type="radio" name="targetCustomer" disabled className="w-4 h-4" />
                <span className="font-medium">Pengguna TLater Khusus (Segera Hadir)</span>
              </label>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold mb-4">Preview Voucher (Live)</h3>
            <p className="text-sm text-slate-500 mb-6">Tampilan voucher ini yang akan dilihat oleh pelanggan di halaman Checkout.</p>
            
            <div className="flex justify-center p-8 bg-slate-50 dark:bg-[#141414] rounded-3xl border border-slate-200 dark:border-slate-800">
              <div className="w-full max-w-sm bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                {formData.promoType === 'flash_sale' && <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-500"></div>}
                {formData.promoType === 'voucher' && <div className="absolute top-0 left-0 right-0 h-1.5 bg-orange-500"></div>}
                {formData.promoType === 'auto' && <div className="absolute top-0 left-0 right-0 h-1.5 bg-indigo-500"></div>}
                
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                    formData.promoType === 'flash_sale' ? 'bg-rose-100 text-rose-500' :
                    formData.promoType === 'voucher' ? 'bg-orange-100 text-orange-500' : 'bg-indigo-100 text-indigo-500'
                  }`}>
                    {formData.discountType === 'percentage' ? <Percent className="w-6 h-6" /> : <Tag className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold mb-1">{formData.title || 'Nama Promo...'}</h4>
                    <p className="text-xs text-slate-500 mb-2">
                      Min. blj Rp {(formData.minPurchase || 0).toLocaleString('id-ID')}
                      {formData.discountType === 'percentage' && formData.maxDiscount > 0 ? ` S/d Rp ${formData.maxDiscount.toLocaleString('id-ID')}` : ''}
                    </p>
                    {formData.promoType === 'voucher' && formData.code && (
                      <div className="inline-block px-2 py-1 bg-slate-100 dark:bg-[#222] border border-dashed border-slate-300 dark:border-slate-600 rounded font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                        {formData.code}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#111] rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl animate-scale-up">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold font-space">Buat Promo Baru</h2>
            <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-bold text-slate-500">
              Langkah {step} dari 7
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 shrink-0">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${(step / 7) * 100}%` }}></div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1">
          <div className="max-w-xl mx-auto">
            {renderStep()}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#141414] shrink-0 flex justify-between">
          <Button variant="outline" onClick={prevStep} disabled={step === 1} className="gap-2">
            <ChevronLeft className="w-4 h-4" /> Sebelumnya
          </Button>
          
          {step < 7 ? (
            <Button onClick={nextStep} className="gap-2">
              Selanjutnya <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} isLoading={isLoading} className="gap-2 bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="w-4 h-4" /> Terbitkan Promo
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function TypeCard({ icon: Icon, title, desc, color, bg, selected, onClick }: any) {
  return (
    <div 
      className={`border-2 rounded-2xl p-5 cursor-pointer transition-all ${
        selected ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
      onClick={onClick}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${bg} ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="font-bold mb-1">{title}</h4>
      <p className="text-xs text-slate-500">{desc}</p>
    </div>
  );
}
