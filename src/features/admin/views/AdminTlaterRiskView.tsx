import { useState, useEffect } from 'react';
import { AdminApi, type KycApplication } from '../api/adminApi';
import { Button } from '../../../components/ui/Button';
import { 
  CheckCircle, 
  XCircle, 
  Search,
  Settings2,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

export function AdminTlaterRiskView() {
  const [applications, setApplications] = useState<KycApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('kyc'); // 'kyc' | 'risk'
  
  const [maxLimit, setMaxLimit] = useState(15000000);
  const [interestRate, setInterestRate] = useState(2.5);
  const [lateFee, setLateFee] = useState(0.1);

  const fetchKyc = async () => {
    setIsLoading(true);
    try {
      const data = await AdminApi.getKycApplications();
      setApplications(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKyc();
  }, []);

  const handleVerify = async (userId: number, approved: boolean) => {
    if (confirm(`Apakah Anda yakin ingin ${approved ? 'MENYETUJUI' : 'MENOLAK'} aplikasi KYC ini?`)) {
      try {
        await AdminApi.verifyKyc(userId, approved, approved ? undefined : 'Dokumen tidak valid');
        fetchKyc();
      } catch (e) {
        alert('Gagal memproses verifikasi');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-space flex items-center gap-2">
            TLater Risk Management
          </h2>
          <p className="text-slate-500 text-sm mt-1">Verifikasi KYC (e-KTP) pelanggan dan atur parameter risiko BNPL.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('kyc')}
          className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'kyc' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <UserCheck className="w-4 h-4" /> Antrean Review KYC
          {applications.filter(a => a.status === 'pending').length > 0 && (
            <span className="ml-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
              {applications.filter(a => a.status === 'pending').length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('risk')}
          className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'risk' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Settings2 className="w-4 h-4" /> Konfigurasi Risiko
        </button>
      </div>

      {activeTab === 'kyc' && (
        <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 dark:bg-[#141414] border-b border-slate-200 dark:border-slate-800">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari NIK atau Nama..."
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="text-center text-slate-500 py-12">Memuat antrean KYC...</div>
            ) : applications.length === 0 ? (
              <div className="text-center text-slate-500 py-12">Tidak ada aplikasi KYC.</div>
            ) : (
              <div className="space-y-6">
                {applications.map(app => (
                  <div key={app.userId} className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col md:flex-row">
                    {/* Media */}
                    <div className="md:w-1/3 bg-slate-100 dark:bg-[#141414] p-4 flex gap-4 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
                      <div className="flex-1 space-y-2 text-center">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Foto KTP</p>
                        <img src={app.ktpImageUrl} alt="KTP" className="w-full h-32 object-cover rounded-xl shadow-sm cursor-zoom-in" />
                      </div>
                      <div className="flex-1 space-y-2 text-center">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Foto Swafoto</p>
                        <img src={app.selfieImageUrl} alt="Selfie" className="w-full h-32 object-cover rounded-xl shadow-sm cursor-zoom-in" />
                      </div>
                    </div>
                    
                    {/* Data */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold">{app.name}</h3>
                            <p className="font-mono text-primary font-medium">{app.nik}</p>
                          </div>
                          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                            app.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                            app.status === 'verified' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-slate-500">Tanggal Lahir</p>
                            <p className="font-medium">{new Date(app.dateOfBirth).toLocaleDateString('id-ID')}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Waktu Pengajuan</p>
                            <p className="font-medium">{new Date(app.submittedAt).toLocaleString('id-ID')}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-slate-500">Alamat KTP</p>
                            <p className="font-medium">{app.address}</p>
                          </div>
                        </div>
                      </div>

                      {app.status === 'pending' && (
                        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                          <Button variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200" onClick={() => handleVerify(app.userId, false)}>
                            <XCircle className="w-4 h-4 mr-2" /> Tolak
                          </Button>
                          <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleVerify(app.userId, true)}>
                            <CheckCircle className="w-4 h-4 mr-2" /> Setujui KYC
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'risk' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <Settings2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-space">Parameter Pinjaman Global</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-semibold">Limit Maksimal (Rp)</label>
                  <span className="font-mono text-primary font-bold">{new Intl.NumberFormat('id-ID').format(maxLimit)}</span>
                </div>
                <input type="range" min="1000000" max="30000000" step="500000" value={maxLimit} onChange={(e) => setMaxLimit(Number(e.target.value))} className="w-full accent-primary" />
                <p className="text-xs text-slate-500 mt-2">Batas pagu kredit tertinggi yang bisa didapatkan oleh nasabah berisiko rendah.</p>
              </div>
              
              <hr className="border-slate-200 dark:border-slate-800" />
              
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-semibold">Suku Bunga Bulanan (%)</label>
                  <span className="font-mono text-orange-500 font-bold">{interestRate}%</span>
                </div>
                <input type="range" min="0" max="5" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full accent-orange-500" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-semibold">Denda Keterlambatan Harian (%)</label>
                  <span className="font-mono text-red-500 font-bold">{lateFee}%</span>
                </div>
                <input type="range" min="0" max="1" step="0.05" value={lateFee} onChange={(e) => setLateFee(Number(e.target.value))} className="w-full accent-red-500" />
              </div>

              <div className="pt-4 flex justify-end">
                <Button>Simpan Parameter</Button>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 p-6 rounded-3xl">
            <div className="flex items-center gap-3 mb-4 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-lg">Peringatan Manajemen Risiko</h3>
            </div>
            <div className="space-y-4 text-amber-800 dark:text-amber-300 text-sm leading-relaxed">
              <p>
                Perubahan pada parameter risiko (Suku Bunga dan Denda) <strong>hanya berlaku untuk kontrak pinjaman baru</strong> yang disetujui setelah waktu perubahan.
              </p>
              <p>
                Persetujuan KYC yang ceroboh dapat meningkatkan rasio kredit macet (NPL). Pastikan:
              </p>
              <ul className="list-disc pl-5 space-y-1 font-medium">
                <li>Wajah pada swafoto identik dengan KTP.</li>
                <li>Data NIK terbaca jelas tanpa rekayasa digital.</li>
                <li>Dokumen tidak kedaluwarsa.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
