import { useState } from 'react';
import { useAuthStore } from '../../../stores/useAuthStore';
import { useUIStore } from '../../../stores/useUIStore';
import { AddressList } from '../../address/AddressList';
import { Button } from '../../../components/ui/Button';
import { KycModal } from '../../auth/components/KycModal';
import { Link } from 'react-router-dom';
import { ShieldAlert, CreditCard, Coins, CheckCircle2 } from 'lucide-react';
import { mutateDemoDB } from '../../../lib/demoRepository';
import { useToast } from '../../../stores/useToastStore';

export function ProfileView() {
  const { user, isAuthenticated, syncSession } = useAuthStore();
  const { openLogin } = useUIStore();
  const { toast } = useToast();
  const [isKycOpen, setIsKycOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const handleSaveProfile = () => {
    if (!name.trim() || !/^\+?[0-9]{10,15}$/.test(phone.trim())) {
      toast({ title: 'Nama dan nomor telepon valid wajib diisi', type: 'error' });
      return;
    }
    try {
      mutateDemoDB(db => {
        const c = db.customers.find(c => c.id === user?.id && c.role === 'customer');
        if (!c) throw new Error('Unauthorized');
        c.name = name.trim();
        c.phone = phone.trim();
      });
      syncSession();
      setEditing(false);
      toast({ title: 'Profil diperbarui', type: 'success' });
    } catch (e) { toast({ title: 'Profil gagal disimpan', message: String(e), type: 'error' }); }
  };

  return (
    <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl shadow-card p-6 md:p-10 border border-slate-100 dark:border-slate-800/60">
      <h2 className="text-2xl font-semibold mb-6">Dashboard Profil</h2>
      
      {isAuthenticated ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <div className="p-6 bg-slate-50 dark:bg-[#141414] rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Informasi Akun</h3>
                {!editing ? (
                  <button onClick={() => setEditing(true)} className="text-xs font-semibold text-pumpkin hover:underline">Edit</button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(false)} className="text-xs font-semibold text-slate-500 hover:underline">Batal</button>
                    <button onClick={handleSaveProfile} className="text-xs font-semibold text-pumpkin hover:underline">Simpan</button>
                  </div>
                )}
              </div>
              
              {editing ? (
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1 block">Nama</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border rounded px-2 py-1 text-sm bg-transparent" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1 block">No HP</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full border rounded px-2 py-1 text-sm bg-transparent" />
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-slate-600 dark:text-slate-400 mb-1 text-sm font-medium">Nama</p>
                  <p className="mb-3 font-semibold">{user?.name}</p>
                  <p className="text-slate-600 dark:text-slate-400 mb-1 text-sm font-medium">Email</p>
                  <p className="mb-3 font-semibold">{user?.email}</p>
                  <p className="text-slate-600 dark:text-slate-400 mb-1 text-sm font-medium">No HP</p>
                  <p className="mb-3 font-semibold">{user?.phone || '-'}</p>
                </>
              )}

              <hr className="border-slate-200 dark:border-slate-700 my-4" />
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium">Status KYC</span>
                {user?.kycStatus === 'verified' ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                ) : user?.kycStatus === 'pending' ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">
                    Pending
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                    Unverified
                  </span>
                )}
              </div>
              
              {user?.kycStatus !== 'verified' && user?.kycStatus !== 'pending' && (
                <Button variant="outline" size="sm" className="w-full text-xs py-2 h-auto flex items-center justify-center gap-2" onClick={() => setIsKycOpen(true)}>
                  <ShieldAlert className="w-4 h-4" /> Verifikasi Sekarang
                </Button>
              )}
            </div>

            {user?.kycStatus === 'rejected' && (
              <div className="bg-red-50 p-4 rounded-xl mt-4 border border-red-200">
                <p className="text-red-700 text-sm font-bold">Verifikasi KYC Ditolak</p>
                <button onClick={() => setIsKycOpen(true)} className="mt-2 text-sm text-red-600 underline">Ajukan ulang</button>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
              <Link to="/tlater" className="flex items-center gap-3 p-4 bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-pumpkin transition-colors group">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center group-hover:bg-pumpkin/10 group-hover:text-pumpkin transition-colors">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">TLater Hub</h4>
                  <p className="text-[10px] text-slate-500">Batas PayLater Anda</p>
                </div>
              </Link>

              <Link to="/points" className="flex items-center gap-3 p-4 bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-pumpkin transition-colors group">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center group-hover:bg-pumpkin/10 group-hover:text-pumpkin transition-colors">
                  <Coins className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Vibe Poin</h4>
                  <p className="text-[10px] text-slate-500">Dompet & Riwayat Poin</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <AddressList />
          </div>
          
          <KycModal isOpen={isKycOpen} onClose={() => setIsKycOpen(false)} />
        </div>

      ) : (
        <div className="text-center py-20">
          <h3 className="text-xl font-medium text-slate-600 dark:text-slate-400 mb-4">Silakan masuk untuk melihat profil dan buku alamat Anda.</h3>
          <Button onClick={openLogin}>Masuk Sekarang</Button>
        </div>
      )}
    </div>
  );
}
