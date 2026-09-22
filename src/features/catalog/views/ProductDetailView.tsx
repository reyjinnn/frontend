import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CatalogService } from '../../../services/catalog.service';
import type { Product, Review } from '../../../services/catalog.service';
import { ProductGallery } from '../components/ProductGallery';
import { Button } from '../../../components/ui/Button';
import { ShieldCheck, Store, Check, Star } from 'lucide-react';
import { useCartStore } from '../../cart/useCartStore';

export function ProductDetailView() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    
    CatalogService.getProductBySlug(slug)
      .then(res => {
        setProduct(res);
        return CatalogService.getProductReviews(res.id);
      })
      .then(rev => setReviews(rev))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
      
  }, [slug]);

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Loading product...</div>;
  }
  
  if (!product) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-red-500">Product not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        
        {}
        <div className="w-full lg:w-[480px] xl:w-[540px] flex-shrink-0">
          <div className="sticky top-24">
            <ProductGallery images={product.images} />
          </div>
        </div>

        {}
        <div className="flex-1 min-w-0 pb-16">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-vibe-points text-vibe-points" />
                <span className="font-semibold text-slate-900 dark:text-white">{product.rating || '0'}</span>
                <span>({reviews.length} ulasan)</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
              <span>{product.soldCount || 0} Terjual</span>
            </div>
          </div>

          {}
          <div className="bg-slate-50 dark:bg-[#141414] border border-slate-100 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 mb-8">
            {product.originalPrice && (
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold px-2 py-1 rounded">
                  {product.discountPercentage}%
                </span>
                <span className="text-slate-400 line-through text-sm">
                  Rp {product.originalPrice.toLocaleString('id-ID')}
                </span>
              </div>
            )}
            <div className="text-3xl md:text-4xl font-mono font-bold text-slate-900 dark:text-white mb-4">
              Rp {product.price.toLocaleString('id-ID')}
            </div>

            {product.tlaterMonthly && (
              <div className="flex items-center gap-2 bg-tlater-light dark:bg-tlater/20 text-tlater text-sm px-4 py-2 rounded-xl border border-tlater-border dark:border-tlater/30 mb-6">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/></svg>
                <span className="font-semibold">Mulai dari Rp {(product.tlaterMonthly).toLocaleString('id-ID')}/bln dengan TLater</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                size="lg" 
                className="flex-1 font-semibold border-2 h-14"
                onClick={() => useCartStore.getState().addToCart(product)}
              >
                + Keranjang
              </Button>
              <Button 
                variant="primary" 
                size="lg" 
                className="flex-1 font-semibold h-14"
                onClick={() => {
                   useCartStore.getState().addToCart(product);
                   
                }}
              >
                Beli Langsung
              </Button>
            </div>
          </div>

          {}
          <div className="flex items-center gap-4 py-6 border-b border-slate-200 dark:border-slate-800 mb-8">
            <div className="w-14 h-14 bg-pumpkin text-white rounded-full flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold flex items-center gap-2">
                Tecvibe Official 
                <ShieldCheck className="w-4 h-4 text-blue-500" />
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Jakarta Selatan</p>
            </div>
          </div>

          {}
          <div className="mb-12">
            <h3 className="text-lg font-bold mb-4">Spesifikasi Utama</h3>
            <ul className="space-y-3">
              {[
                "Garansi Resmi 1 Tahun iBox",
                "Chip A18 Pro, performa monster",
                "Kamera Fusion 48MP dengan kontrol presisi",
                "Titanium tahan banting dan sangat ringan"
              ].map((spec, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>

          {}
          <div className="mb-12">
            <h3 className="text-lg font-bold mb-4">Deskripsi Produk</h3>
            <div className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-4">
              <p>{product.description}</p>
              <p>Desain kokoh dari paduan titanium grade-aerospace, dengan layar Super Retina XDR yang lebih besar dan bezel paling tipis di iPhone mana pun.</p>
            </div>
          </div>

          {}
          <div className="mb-12">
            <h3 className="text-lg font-bold mb-6">Ulasan Pembeli ({reviews.length})</h3>
            
            <div className="space-y-6">
              {reviews.map(review => (
                <div key={review.id} className="bg-slate-50 dark:bg-[#141414] p-6 rounded-2xl border border-slate-100 dark:border-slate-800/60">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-pumpkin/10 text-pumpkin rounded-full flex items-center justify-center font-bold">
                      {review.userName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{review.userName}</h4>
                      <p className="text-xs text-slate-400">{review.createdAt}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-vibe-points text-vibe-points' : 'text-slate-300 dark:text-slate-700'}`} />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
