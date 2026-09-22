import { useState, useEffect, useRef } from 'react';
import { CatalogService, type Product, type Category } from '../../../services/catalog.service';
import { AdminApi } from '../api/adminApi';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { 
  Search, 
  Filter, 
  Plus, 
  UploadCloud, 
  X,
  Edit2,
  Trash2,
  AlertCircle
} from 'lucide-react';

export function AdminProductsView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [prodData, catData] = await Promise.all([
        CatalogService.getProducts(),
        CatalogService.getCategories()
      ]);
      setProducts(prodData.items);
      setCategories(catData);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProductAdded = () => {
    fetchData();
    setIsAddModalOpen(false);
  };

  const getStockBadge = (stock: number) => {
    if (stock <= 0) return <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-md text-[10px] font-bold uppercase">Habis</span>;
    if (stock <= 5) return <span className="px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-md text-[10px] font-bold uppercase">Menipis</span>;
    return <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-md text-[10px] font-bold uppercase">Aman ({stock})</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-space">Inventaris Produk</h2>
          <p className="text-slate-500 text-sm mt-1">Kelola katalog produk, harga, dan ketersediaan stok fisik.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Tambah Produk
        </Button>
      </div>

      <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        
        {/* Filters */}
        <div className="p-4 bg-slate-50 dark:bg-[#141414] flex flex-col sm:flex-row gap-4 border-b border-slate-200 dark:border-slate-800">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari nama produk atau SKU..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <select className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary">
            <option value="">Semua Kategori</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary">
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="empty">Stok Habis</option>
            <option value="draft">Draf</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 text-slate-500">Memuat katalog...</div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white dark:bg-[#111] text-slate-500 font-medium border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 w-12"><input type="checkbox" className="rounded border-slate-300" /></th>
                  <th className="px-6 py-4">Produk & SKU</th>
                  <th className="px-6 py-4">Harga Jual</th>
                  <th className="px-6 py-4">Stok Gudang</th>
                  <th className="px-6 py-4">Wishlist</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-[#141414] transition-colors">
                    <td className="px-6 py-4"><input type="checkbox" className="rounded border-slate-300" /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.images[0]?.imageUrl} 
                          alt="" 
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800" 
                        />
                        <div>
                          <p className="font-semibold truncate max-w-[200px]">{product.name}</p>
                          <p className="font-mono text-xs text-slate-500">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-mono font-bold">Rp {product.price.toLocaleString('id-ID')}</p>
                      {product.originalPrice && (
                        <p className="font-mono text-xs text-slate-500 line-through">Rp {product.originalPrice.toLocaleString('id-ID')}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStockBadge(product.stock)}
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-500">
                      {Math.floor(Math.random() * 50) + 10}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        product.status === 'active' 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {product.status === 'active' ? 'Aktif' : 'Draf'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isAddModalOpen && (
        <AddProductModal 
          categories={categories}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={handleProductAdded}
        />
      )}
    </div>
  );
}

function AddProductModal({ categories, onClose, onSuccess }: { categories: Category[], onClose: () => void, onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    categoryId: '',
    description: '',
    price: '',
    originalPrice: '',
    stock: '',
    weightGrams: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await AdminApi.addProduct({
        ...formData,
        categoryId: parseInt(formData.categoryId),
        price: parseInt(formData.price),
        originalPrice: formData.originalPrice ? parseInt(formData.originalPrice) : undefined,
        stock: parseInt(formData.stock),
        weightGrams: parseInt(formData.weightGrams),
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        images: [{ id: Date.now(), imageUrl: 'https://images.unsplash.com/photo-1621508688407-1605a96860db?w=600', isPrimary: true }]
      });
      onSuccess();
    } catch (e) {
      alert('Gagal menambah produk');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#111] rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-scale-up">
        
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold font-space">Tambah Produk Baru</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form id="addProductForm" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Informasi Dasar */}
            <div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                1. Informasi Dasar
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Nama Produk" 
                  placeholder="Contoh: MacBook Pro 16 M3 Max" 
                  required 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
                <Input 
                  label="SKU Induk" 
                  placeholder="Contoh: APL-MBP16-M3M" 
                  required 
                  value={formData.sku}
                  onChange={e => setFormData({ ...formData, sku: e.target.value })}
                />
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">Kategori Etalase</label>
                  <select 
                    required
                    value={formData.categoryId}
                    onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">Deskripsi Produk</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Tuliskan spesifikasi lengkap, fitur, dan info garansi..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Media */}
            <div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                2. Media Produk
              </h3>
              <div 
                className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <input type="file" className="hidden" ref={fileInputRef} multiple accept="image/*" />
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <h4 className="font-bold mb-1">Tarik & Lepas foto ke sini</h4>
                <p className="text-sm text-slate-500 mb-4">Mendukung format JPG, PNG (Maks. 5MB per file)</p>
                <Button variant="outline" type="button" size="sm">Pilih File</Button>
              </div>
            </div>

            {/* Harga & Inventaris */}
            <div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                3. Harga & Inventaris
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Input 
                    label="Harga Jual Normal (Rp)" 
                    type="number"
                    required 
                    min="0"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <Input 
                  label="Harga Coret / Asli (Opsional)" 
                  type="number"
                  min="0"
                  value={formData.originalPrice}
                  onChange={e => setFormData({ ...formData, originalPrice: e.target.value })}
                />
                <Input 
                  label="Stok Gudang Awal" 
                  type="number"
                  required 
                  min="0"
                  value={formData.stock}
                  onChange={e => setFormData({ ...formData, stock: e.target.value })}
                />
                <Input 
                  label="Berat Paket (Gram)" 
                  type="number"
                  required 
                  min="1"
                  value={formData.weightGrams}
                  onChange={e => setFormData({ ...formData, weightGrams: e.target.value })}
                />
              </div>
              <div className="mt-4 bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl flex gap-3 text-amber-700 dark:text-amber-400 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>Harga jual normal akan ditampilkan sebagai harga akhir. Isi harga coret hanya jika Anda ingin menampilkan efek diskon pada halaman etalase.</p>
              </div>
            </div>

          </form>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#141414] shrink-0 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} type="button">Batal</Button>
          <Button type="submit" form="addProductForm" isLoading={isLoading}>
            Simpan Produk
          </Button>
        </div>
      </div>
    </div>
  );
}
