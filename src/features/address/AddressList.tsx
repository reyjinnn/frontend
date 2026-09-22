import { useState, useEffect } from 'react';
import { addressService, type Address } from '../../services/addressService';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { MapPin, Plus, Check, Loader2 } from 'lucide-react';
import { useToast } from '../../stores/useToastStore';

export const AddressList = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const data = await addressService.getAddresses();
      setAddresses(data);
    } catch (error) {
      toast({ title: 'Gagal memuat alamat', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSetPrimary = async (id: string) => {
    setActionLoading(id);
    try {
      await addressService.setPrimary(id);
<<<<<<< HEAD

=======
      
      // Update local state for mock
>>>>>>> 80b7fdfac7784469269245387969793b7eabd139
      setAddresses((prev) => 
        prev.map(addr => ({ ...addr, isPrimary: addr.id === id }))
      );
      
      toast({ title: 'Alamat utama diubah', type: 'success' });
    } catch (error) {
      toast({ title: 'Gagal mengubah alamat utama', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-pumpkin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Alamat Pengiriman</h3>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Tambah Alamat
        </Button>
      </div>

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
                <div className="text-pumpkin flex items-center text-sm font-medium">
                  <Check className="h-4 w-4 mr-1" /> Terpilih
                </div>
              )}
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
