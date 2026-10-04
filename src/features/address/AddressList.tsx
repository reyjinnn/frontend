import { useState } from 'react';
import { useDemoSnapshot } from '../../stores/useDemoSnapshot';
import { useAuthStore } from '../../stores/useAuthStore';
import { addressService, type Address } from '../../services/addressService';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { MapPin, Plus, Check, Trash2 } from 'lucide-react';
import { useToast } from '../../stores/useToastStore';
import { requireDemoUser, transactDemoDB } from '../../lib/demoRepository';

export const AddressList = () => {
  const db = useDemoSnapshot();
  const user = useAuthStore(s => s.user);
  const addresses = user ? db.addresses[user.id] ?? [] : [];
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [label, setLabel] = useState('Rumah');
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const { toast } = useToast();

  const handleSetPrimary = async (id: string) => {
    setActionLoading(id);
    try {
      await addressService.setPrimary(id);
      toast({ title: 'Alamat utama diubah', type: 'success' });
    } catch {
      toast({ title: 'Gagal mengubah alamat utama', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(id);
    try {
      await addressService.deleteAddress(id);
      toast({ title: 'Alamat dihapus', type: 'success' });
    } catch {
      toast({ title: 'Gagal menghapus alamat', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (a: Address) => {
    setEditingId(a.id);
    setIsAdding(true);
    setLabel(a.label);
    setRecipientName(a.recipientName);
    setPhone(a.phone);
    setFullAddress(a.fullAddress);
    setCity(a.city);
    setPostalCode(a.postalCode);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !recipientName.trim() || !/^\+?\d{10,15}$/.test(phone.trim()) || !fullAddress.trim() || !city.trim() || !/^\d{5}$/.test(postalCode.trim())) {
      toast({ title: 'Semua kolom alamat wajib diisi', type: 'error' });
      return;
    }
    setActionLoading('create');
    try {
      if (editingId) {
        const u = requireDemoUser('customer');
        await transactDemoDB(db => {
          const list = db.addresses[u.id] ?? [];
          const existing = list.find(a => a.id === editingId);
          if (!existing) throw new Error('Alamat tidak ditemukan');
          existing.label = label.trim();
          existing.recipientName = recipientName.trim();
          existing.phone = phone.trim();
          existing.fullAddress = fullAddress.trim();
          existing.city = city.trim();
          existing.postalCode = postalCode.trim();
        });
        toast({ title: 'Alamat berhasil diperbarui', type: 'success' });
      } else {
        await addressService.addAddress({
          label: label.trim(),
          recipientName: recipientName.trim(),
          phone: phone.trim(),
          fullAddress: fullAddress.trim(),
          city: city.trim(),
          postalCode: postalCode.trim()
        });
        toast({ title: 'Alamat berhasil ditambahkan', type: 'success' });
      }
      setIsAdding(false);
      setEditingId(null);
      setRecipientName('');
      setPhone('');
      setFullAddress('');
      setCity('');
      setPostalCode('');
    } catch (err: any) {
      toast({ title: 'Gagal menambah alamat', message: err.message, type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Alamat Pengiriman</h3>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => { setIsAdding(!isAdding); setEditingId(null); setLabel(''); setRecipientName(''); setPhone(''); setFullAddress(''); setCity(''); setPostalCode(''); }}>
          <Plus className="h-4 w-4" /> {isAdding && !editingId ? 'Batal' : 'Tambah Alamat'}
        </Button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreate} className="p-4 border rounded-2xl border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50 dark:bg-[#141414]">
          <h4 className="font-bold text-sm">{editingId ? 'Edit Alamat' : 'Tambah Alamat Baru'}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold">Label Alamat</label>
              <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Rumah / Kantor" className="w-full text-sm border p-2 rounded bg-transparent" />
            </div>
            <div>
              <label className="text-xs font-semibold">Nama Penerima</label>
              <input value={recipientName} onChange={e => setRecipientName(e.target.value)} placeholder="Nama lengkap" className="w-full text-sm border p-2 rounded bg-transparent" />
            </div>
            <div>
              <label className="text-xs font-semibold">Nomor Telepon</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="0812xxxx" className="w-full text-sm border p-2 rounded bg-transparent" />
            </div>
            <div>
              <label className="text-xs font-semibold">Kota</label>
              <input value={city} onChange={e => setCity(e.target.value)} placeholder="Kota" className="w-full text-sm border p-2 rounded bg-transparent" />
            </div>
            <div>
              <label className="text-xs font-semibold">Kode Pos</label>
              <input value={postalCode} onChange={e => setPostalCode(e.target.value)} placeholder="12345" className="w-full text-sm border p-2 rounded bg-transparent" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold">Alamat Lengkap</label>
              <textarea value={fullAddress} onChange={e => setFullAddress(e.target.value)} placeholder="Nama jalan, nomor rumah, RT/RW..." className="w-full text-sm border p-2 rounded bg-transparent" rows={2} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsAdding(false)}>Batal</Button>
            <Button size="sm" type="submit" isLoading={actionLoading === 'create'}>Simpan Alamat</Button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {addresses.map((address) => (
          <div 
            key={address.id} 
            className={`p-4 rounded-2xl border transition-all ${
              address.isPrimary 
                ? 'border-pumpkin bg-pumpkin-light/20 dark:bg-pumpkin/10' 
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141414]'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <div className="mt-1">
                  <MapPin className={`h-5 w-5 ${address.isPrimary ? 'text-pumpkin' : 'text-slate-400'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{address.label}</span>
                    {address.isPrimary && <Badge variant="warning">Utama</Badge>}
                  </div>
                  <p className="font-medium text-sm text-slate-800 dark:text-slate-200 mb-1">{address.recipientName} • {address.phone}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {address.fullAddress}<br />
                    {address.city}, {address.postalCode}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <Button size="sm" variant="ghost" onClick={() => handleEdit(address)}>Edit</Button>
                {!address.isPrimary && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleSetPrimary(address.id)}
                    isLoading={actionLoading === address.id}
                  >
                    Jadikan Utama
                  </Button>
                )}
                {address.isPrimary && (
                  <div className="text-pumpkin flex items-center text-sm font-medium mr-2">
                    <Check className="h-4 w-4 mr-1" /> Terpilih
                  </div>
                )}
                <button
                  aria-label="Hapus alamat"
                  onClick={() => handleDelete(address.id)}
                  disabled={actionLoading === address.id}
                  className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {addresses.length === 0 && (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            Belum ada alamat tersimpan
          </div>
        )}
      </div>
    </div>
  );
};

