import { X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useState } from 'react';
import { readDemoDB } from '../../../lib/demoRepository';

interface Promo {
  id: string;
  title: string;
  description: string;
  minPurchase: number;
  discountPercentage?: number;
  discountFixed?: number;
}

interface PromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartTotal: number;
  onSelectPromo: (promo: Promo | null) => Promise<void>;
}

const getPromos = (): Promo[] => readDemoDB().promos.filter(p => p.isActive).map(p => ({
  id: p.code, title: p.code, description: p.discountType === 'fixed' ? `Potongan Rp ${p.discountValue.toLocaleString('id-ID')}` : `Diskon ${p.discountValue}%`, minPurchase: p.minPurchase,
}));

export function PromoModal({ isOpen, onClose, cartTotal, onSelectPromo }: PromoModalProps) {
  const [inputCode, setInputCode] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [applyError, setApplyError] = useState('');

  if (!isOpen) return null;
  const mockPromos = getPromos();

  const handleApply = async () => {
    setApplyError('');
    try {
      if (selectedId) {
        const promo = mockPromos.find(p => p.id === selectedId);
        await onSelectPromo(promo || null);
      } else {
        await onSelectPromo(null);
      }
      onClose();
    } catch (e: any) {
      setApplyError(e.message || 'Promo tidak valid');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#1A1A1A] w-full max-w-md rounded-3xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Makin hemat pakai promo!</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <input 
            type="text" 
            placeholder="Masukkan kode promo"
            value={inputCode}
            onChange={e => setInputCode(e.target.value)}
            className="flex-1 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 bg-slate-50 dark:bg-[#141414]"
          />
          <Button variant="outline" onClick={async () => {
            setApplyError('');
            const code = inputCode.trim();
            const found = mockPromos.find(p => p.id.toLowerCase() === code.toLowerCase());
            try {
              await onSelectPromo(found ?? { id: code, title: code, description: '', minPurchase: 0 });
              onClose();
            } catch (e: any) { setApplyError(e.message || 'Promo tidak valid'); }
          }} className="border-2 border-pumpkin text-pumpkin hover:bg-pumpkin/10">
            Terapkan
          </Button>
        </div>

        <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
          {applyError && <p className="text-red-500 text-sm">{applyError}</p>}
          {mockPromos.map(promo => {
            const isEligible = cartTotal >= promo.minPurchase;
            return (
              <label 
                key={promo.id} 
                className={`flex gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${
                  !isEligible ? 'opacity-50 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#141414]' :
                  selectedId === promo.id ? 'border-pumpkin bg-pumpkin/5' : 'border-slate-200 dark:border-slate-700 hover:border-pumpkin'
                }`}
              >
                <div className="relative flex items-center justify-center pt-1">
                  <input 
                    type="radio" 
                    name="promo" 
                    disabled={!isEligible}
                    checked={selectedId === promo.id}
                    onChange={() => setSelectedId(promo.id)}
                    className="peer appearance-none w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded-full checked:border-pumpkin"
                  />
                  <div className="absolute w-2.5 h-2.5 bg-pumpkin rounded-full opacity-0 peer-checked:opacity-100"></div>
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1">{promo.title}</h4>
                  <p className="text-xs text-slate-500 mb-2">{promo.description}</p>
                  <p className="text-[10px] text-slate-400">Min. belanja Rp {promo.minPurchase.toLocaleString('id-ID')}</p>
                </div>
              </label>
            );
          })}
        </div>

        <Button variant="primary" className="w-full h-12" onClick={handleApply}>
          Pakai Promo
        </Button>
      </div>
    </div>
  );
}
