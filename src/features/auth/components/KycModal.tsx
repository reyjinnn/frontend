import { useState } from 'react';
import { X, UploadCloud, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useAuthStore } from '../../../stores/useAuthStore';

interface KycModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KycModal({ isOpen, onClose }: KycModalProps) {
  const { setKycStatus } = useAuthStore();
  const [nik, setNik] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    setError('');
    // NIK 16 digit
    if (!/^\d{16}$/.test(nik)) {
      setError('NIK harus berupa 16 digit angka.');
      return false;
    }
    
    // Age >= 18
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age < 18) {
      setError('Anda harus berusia minimal 18 tahun untuk mengaktifkan TLater.');
      return false;
    }

    if (!address || address.length < 10) {
      setError('Masukkan alamat domisili lengkap.');
      return false;
    }

    if (!ktpFile || ktpFile.size > 5 * 1024 * 1024) {
      setError('Foto KTP wajib diunggah dan maksimal 5MB.');
      return false;
    }

    if (!selfieFile || selfieFile.size > 5 * 1024 * 1024) {
      setError('Swafoto wajib diunggah dan maksimal 5MB.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // Mock API delay
      await new Promise(r => setTimeout(r, 1500));
      setKycStatus('pending'); 
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError('Terjadi kesalahan pada server. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div className="bg-white dark:bg-[#1A1A1A] w-full max-w-md rounded-3xl p-8 text-center animate-in zoom-in">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Pengajuan Diterima!</h2>
          <p className="text-slate-500 text-sm">Data verifikasi identitas Anda sedang diproses. Kami akan memberitahu Anda maksimal dalam 1x24 jam.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#1A1A1A] w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Verifikasi Identitas (KYC)</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-sky-50 dark:bg-sky-900/30 p-4 rounded-xl flex gap-3 mb-6 border border-sky-100 dark:border-sky-800">
          <ShieldAlert className="w-5 h-5 text-sky-600 dark:text-sky-400 flex-shrink-0" />
          <p className="text-sm text-sky-800 dark:text-sky-300">Data Anda dilindungi enkripsi end-to-end sesuai kebijakan privasi kami dan hanya digunakan untuk verifikasi layanan TLater.</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-500 p-3 rounded-xl text-sm font-semibold mb-4 border border-red-100 dark:border-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2">Nomor Induk Kependudukan (NIK)</label>
            <input 
              type="text" 
              maxLength={16}
              value={nik}
              onChange={e => setNik(e.target.value.replace(/\D/g, ''))}
              placeholder="16 Digit NIK KTP"
              className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 bg-slate-50 dark:bg-[#141414] focus:outline-none focus:border-pumpkin focus:ring-1 focus:ring-pumpkin"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Tanggal Lahir</label>
            <input 
              type="date" 
              value={dob}
              onChange={e => setDob(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 bg-slate-50 dark:bg-[#141414] focus:outline-none focus:border-pumpkin focus:ring-1 focus:ring-pumpkin"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Alamat Domisili Lengkap</label>
            <textarea 
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Sesuai KTP atau tempat tinggal saat ini"
              rows={3}
              className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 bg-slate-50 dark:bg-[#141414] focus:outline-none focus:border-pumpkin focus:ring-1 focus:ring-pumpkin"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Foto KTP Asli</label>
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:border-pumpkin hover:bg-pumpkin/5 transition-colors text-center">
                <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs text-slate-500 font-semibold mb-1">Unggah KTP</span>
                <span className="text-[10px] text-slate-400">Maks 5MB (JPG/PNG)</span>
                <input type="file" accept="image/*" className="hidden" onChange={e => setKtpFile(e.target.files?.[0] || null)} />
                {ktpFile && <span className="text-xs text-green-500 mt-2 truncate max-w-full font-bold">{ktpFile.name}</span>}
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2">Swafoto dengan KTP</label>
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:border-pumpkin hover:bg-pumpkin/5 transition-colors text-center">
                <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs text-slate-500 font-semibold mb-1">Unggah Swafoto</span>
                <span className="text-[10px] text-slate-400">Pastikan wajah terlihat jelas</span>
                <input type="file" accept="image/*" capture="user" className="hidden" onChange={e => setSelfieFile(e.target.files?.[0] || null)} />
                {selfieFile && <span className="text-xs text-green-500 mt-2 truncate max-w-full font-bold">{selfieFile.name}</span>}
              </label>
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full h-12" disabled={isSubmitting}>
            {isSubmitting ? 'Memproses Data...' : 'Ajukan Verifikasi'}
          </Button>
        </form>
      </div>
    </div>
  );
}
