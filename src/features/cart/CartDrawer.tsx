import { useCartStore } from './useCartStore';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { useUIStore } from '../../stores/useUIStore';

export function CartDrawer() {
  const { isCartOpen, closeCart, items, totalItemAmount, updateQuantity, removeItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { openLogin } = useUIStore();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    closeCart();
    if (!isAuthenticated) {
      openLogin();
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={closeCart}
      />
      
      {}
      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white dark:bg-[#1A1A1A] shadow-2xl flex flex-col translate-x-0 transition-transform duration-300 ease-in-out border-l border-slate-100 dark:border-slate-800">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold">Keranjang Belanja</h2>
          <button onClick={closeCart} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-4">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <span className="text-2xl"></span>
              </div>
              <p>Keranjang masih kosong.</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.productId} className="flex gap-4 pb-6 border-b border-slate-100 dark:border-slate-800/60 last:border-0 last:pb-0">
                <div className="w-20 h-20 bg-slate-50 dark:bg-[#141414] rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col">
                  <h4 className="font-semibold text-sm line-clamp-2 mb-1">{item.name}</h4>
                  <div className="text-pumpkin font-mono font-bold text-sm mb-3">
                    Rp {item.price.toLocaleString('id-ID')}
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg">
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-1 text-slate-500 hover:text-pumpkin transition-colors disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-1 text-slate-500 hover:text-pumpkin transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.productId)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-slate-100 dark:border-slate-800 p-6 bg-slate-50 dark:bg-[#141414]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-600 dark:text-slate-400">Total Belanja</span>
              <span className="text-xl font-mono font-bold">Rp {totalItemAmount.toLocaleString('id-ID')}</span>
            </div>
            <Button variant="primary" className="w-full h-12 text-base font-semibold" onClick={handleCheckout}>
              Lanjut ke Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
