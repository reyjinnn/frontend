import { Link } from 'react-router-dom';
import type { Product } from '../../../services/catalog.service';
import { Heart, Star } from 'lucide-react';
import { useWishlistStore } from '../../../stores/useWishlistStore';
import { useCartStore } from '../../cart/useCartStore';

export function ProductCard({ product }: { product: Product }) {
  const { items, toggleWishlist } = useWishlistStore();
  const isWishlisted = items.has(product.id);
  const { addToCart } = useCartStore();

  const primaryImage = product.images.find(img => img.isPrimary)?.imageUrl || product.images[0]?.imageUrl;

  return (
    <div className="group bg-white dark:bg-[#1A1A1A] border border-slate-100 dark:border-slate-800/60 rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 hover:-translate-y-1 flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-[#141414] p-4 md:p-6">
        <Link to={`/product/${product.slug}`}>
          <img 
            src={primaryImage} 
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </Link>
        <button 
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-md text-slate-400 hover:text-red-500 transition-colors z-10"
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      <div className="p-4 md:p-5 flex flex-col flex-1">
        <Link to={`/product/${product.slug}`} className="flex-1">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm md:text-base leading-snug mb-2 line-clamp-2 group-hover:text-pumpkin transition-colors">
            {product.name}
          </h3>
        </Link>
        
        {product.originalPrice && (
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-[10px] font-bold px-1.5 py-0.5 rounded">
              {product.discountPercentage}%
            </span>
            <span className="text-slate-400 line-through text-xs md:text-sm font-mono">
              Rp {product.originalPrice.toLocaleString('id-ID')}
            </span>
          </div>
        )}
        <div className="text-lg md:text-xl font-bold font-mono text-slate-900 dark:text-white mb-3">
          Rp {product.price.toLocaleString('id-ID')}
        </div>

        {product.tlaterMonthly && (
          <div className="text-xs text-tlater dark:text-tlater-light font-medium bg-tlater-light dark:bg-tlater/20 px-2 py-1 rounded-md mb-4 inline-block w-fit">
            TLater: Rp {(product.tlaterMonthly).toLocaleString('id-ID')}/bln
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Star className="w-3.5 h-3.5 fill-vibe-points text-vibe-points" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">{product.rating || '0'}</span>
            <span>| {product.soldCount || 0} terjual</span>
          </div>
          <button 
            onClick={() => addToCart(product)}
            className="text-xs font-semibold text-pumpkin hover:underline"
          >
            + Keranjang
          </button>
        </div>
      </div>
    </div>
  );
}
