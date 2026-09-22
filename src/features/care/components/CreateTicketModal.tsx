import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { TicketCategory, TicketPriority, CreateTicketPayload } from '../types';
import { Button } from '../../../components/ui/Button';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateTicketPayload) => Promise<void>;
  initialCategory?: string;
}

export function CreateTicketModal({ isOpen, onClose, onSubmit, initialCategory }: CreateTicketModalProps) {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<TicketCategory>('Lainnya');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory as TicketCategory);
      if (initialCategory === 'Pengiriman') {
        setSubject('Kendala Pengiriman Pesanan');
      } else if (initialCategory === 'Garansi') {
        setSubject('Klaim Garansi Produk');
      }
    }
  }, [initialCategory]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    
    setIsSubmitting(true);
    await onSubmit({ subject, category, priority, message });
    setIsSubmitting(false);

    setSubject('');
    setMessage('');
    setCategory('Lainnya');
    setPriority('medium');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in-up flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold">Buat Tiket Bantuan</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Subjek</label>
            <input 
              type="text" 
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Contoh: Barang tidak sesuai pesanan"
              className="w-full bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-pumpkin focus:border-transparent outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Kategori</label>
              <select 
                value={category}
                onChange={e => setCategory(e.target.value as TicketCategory)}
                className="w-full bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-pumpkin focus:border-transparent outline-none"
              >
                <option value="Pesanan">Pesanan</option>
                <option value="Pengiriman">Pengiriman</option>
                <option value="Garansi">Klaim Garansi</option>
                <option value="TLater">TechVibe Later</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Prioritas</label>
              <select 
                value={priority}
                onChange={e => setPriority(e.target.value as TicketPriority)}
                className="w-full bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-pumpkin focus:border-transparent outline-none"
              >
                <option value="low">Rendah</option>
                <option value="medium">Menengah</option>
                <option value="high">Tinggi (Mendesak)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Pesan / Rincian Masalah</label>
            <textarea 
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Jelaskan kendala Anda secara detail..."
              rows={5}
              className="w-full bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-pumpkin focus:border-transparent outline-none resize-none"
              required
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Mengirim...' : 'Kirim Tiket'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
