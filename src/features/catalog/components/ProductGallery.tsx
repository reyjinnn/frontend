import { useState } from 'react';

export function ProductGallery({ images }: { images: { id: number, imageUrl: string, isPrimary: boolean }[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // If no images provided, render empty placeholder
  if (!images || images.length === 0) {
    return <div className="aspect-square bg-slate-100 dark:bg-[#141414] rounded-3xl animate-pulse"></div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="aspect-square bg-white dark:bg-[#141414] border border-slate-100 dark:border-slate-800/60 rounded-3xl overflow-hidden relative group cursor-zoom-in">
        <img 
          src={images[activeIndex].imageUrl} 
          alt="Product Thumbnail" 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125"
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((img, idx) => (
          <button 
            key={img.id}
            onClick={() => setActiveIndex(idx)}
            className={`w-20 h-20 flex-shrink-0 bg-white dark:bg-[#141414] border-2 rounded-xl overflow-hidden transition-all ${activeIndex === idx ? 'border-pumpkin' : 'border-transparent hover:border-slate-200 dark:hover:border-slate-700'}`}
          >
            <img src={img.imageUrl} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
