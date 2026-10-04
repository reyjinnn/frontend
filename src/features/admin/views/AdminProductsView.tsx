import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Archive, PackagePlus, Search } from 'lucide-react';
import { Page, InputField } from './adminShared';
import { useAdminData, panel, field, money, formValues } from './adminState';
import { Button } from '../../../components/ui/Button';
import { AdminApi } from '../api/adminApi';

export function AdminProductsView() {
  const state = useAdminData();
  const location = useLocation();
  const [filter, setFilter] = useState(() => new URLSearchParams(location.search).get('search') ?? '');
  const [status, setStatus] = useState('all');
  const [editingId, setEditingId] = useState<number | 'new' | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const products = (state.db?.products ?? []).filter(p => (status === 'all' || p.status === status) && (!filter || p.name.toLowerCase().includes(filter.toLowerCase()) || p.sku.toLowerCase().includes(filter.toLowerCase())));
  const target = editingId === 'new' ? null : state.db?.products.find(p => p.id === editingId);
  const toggleSelect = (id: number) => setSelectedIds(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]);
  return <Page title="Inventaris Produk" state={state}>
    <div className={`${panel} flex flex-wrap items-center gap-3`}>
      <label className="relative min-w-0 flex-1 sm:min-w-56"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input aria-label="Cari produk" placeholder="Cari SKU atau nama produk" value={filter} onChange={e => setFilter(e.target.value)} className={`${field} pl-9`} /></label>
      <select aria-label="Filter status produk" className={`${field} w-auto min-w-36`} value={status} onChange={e => setStatus(e.target.value)}><option value="all">Semua status</option><option value="active">Aktif</option><option value="draft">Draf</option><option value="archived">Arsip</option></select>
      {selectedIds.length > 0 && <Button size="sm" variant="outline" disabled={state.busy} onClick={() => void state.run(() => AdminApi.archiveProducts(selectedIds), 'Diarsipkan').then(ok => { if (ok) setSelectedIds([]); })}><Archive size={16} className="mr-2 inline" />Arsipkan ({selectedIds.length})</Button>}
      <Button size="sm" onClick={() => setEditingId('new')}><PackagePlus size={16} className="mr-2 inline" />Tambah Produk</Button>
    </div>
    <div className={`grid gap-5 ${editingId !== null ? 'xl:grid-cols-[minmax(0,1fr)_360px]' : ''}`}>
      <section className={`${panel} min-w-0`}><div className="flex items-center justify-between"><h3 className="font-semibold">Daftar produk</h3><span className="text-xs text-slate-500 dark:text-slate-400">{products.length} produk</span></div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">{products.map(p => <div key={p.id} className="flex flex-wrap items-center gap-3 py-4 first:pt-0 last:pb-0">
          <input aria-label={`Pilih ${p.name}`} type="checkbox" checked={selectedIds.includes(p.id)} onChange={() => toggleSelect(p.id)} className="accent-orange-500" />
          <img src={p.images[0]?.imageUrl} alt="" className="h-14 w-14 rounded-xl bg-slate-100 object-cover dark:bg-slate-800" />
          <div className="min-w-0 flex-1"><p className="truncate font-semibold">{p.name}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">SKU {p.sku} · Stok {p.stock}</p></div>
          <div className="text-right"><p className="font-semibold tabular-nums">{money(p.price)}</p><span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${p.status === 'active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>{p.status}</span></div>
          <div className="flex w-full gap-2 sm:w-auto"><Button size="sm" variant="outline" onClick={() => setEditingId(p.id)}>Edit</Button><Button size="sm" variant="outline" disabled={state.busy} onClick={() => void state.run(() => AdminApi.deleteProduct(p.id), 'Dihapus')}>Hapus</Button></div>
        </div>)}{!products.length && <div className="py-12 text-center"><PackagePlus className="mx-auto mb-3 text-orange-400" /><p className="font-medium">{filter || status !== 'all' ? 'Tidak ada produk yang cocok' : 'Belum ada produk'}</p><p className="mt-1 text-sm text-slate-500">{filter || status !== 'all' ? 'Coba ubah pencarian atau filter status.' : 'Tambahkan produk untuk mulai mengelola inventaris.'}</p></div>}</div>
      </section>
      {editingId !== null && <aside className={`${panel} h-fit`}><div className="flex items-center justify-between gap-3"><div><h3 className="font-semibold">{editingId === 'new' ? 'Produk baru' : 'Edit produk'}</h3><p className="text-xs text-slate-500">Lengkapi informasi produk di bawah.</p></div><Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Tutup</Button></div>
        <form key={editingId} className="space-y-4" onSubmit={e => {
          const data = formValues(e);
          const payload = {
            id: editingId === 'new' ? undefined : editingId,
            name: String(data.get('name')),
            sku: String(data.get('sku')),
            slug: String(data.get('slug')),
            description: String(data.get('description')),
            price: Number(data.get('price')),
            stock: Number(data.get('stock')),
            weightGrams: Number(data.get('weightGrams')),
            categoryId: Number(data.get('categoryId')),
            status: String(data.get('status')),
            images: [{ id: Date.now(), imageUrl: String(data.get('imageUrl')), isPrimary: true }]
          };
          void state.run(() => AdminApi.saveProduct(payload), 'Produk tersimpan').then(ok => { if (ok) setEditingId(null); });
        }}>
          <div className="space-y-3"><h4 className="border-b pb-2 text-xs font-semibold uppercase tracking-wider text-orange-600 dark:border-slate-800 dark:text-orange-400">Identitas</h4><InputField label="Nama Produk" name="name" value={target?.name} /><InputField label="SKU" name="sku" value={target?.sku} /><InputField label="Slug URL" name="slug" value={target?.slug} /><InputField label="Deskripsi" name="description" value={target?.description} /></div>
          <div className="space-y-3"><h4 className="border-b pb-2 text-xs font-semibold uppercase tracking-wider text-orange-600 dark:border-slate-800 dark:text-orange-400">Harga & stok</h4><div className="grid grid-cols-2 gap-3"><InputField label="Harga (Rp)" name="price" type="number" min={0} value={target?.price} /><InputField label="Stok Gudang" name="stock" type="number" min={0} value={target?.stock} /><InputField label="Berat (gram)" name="weightGrams" type="number" min={1} value={target?.weightGrams ?? 500} /><InputField label="ID Kategori" name="categoryId" type="number" min={1} value={target?.categoryId ?? 1} /></div></div>
          <div className="space-y-3"><h4 className="border-b pb-2 text-xs font-semibold uppercase tracking-wider text-orange-600 dark:border-slate-800 dark:text-orange-400">Tampilan</h4><label className="block space-y-1 text-sm"><span>Status</span><select aria-label="Status produk" className={field} name="status" defaultValue={target?.status ?? 'active'}><option value="active">Aktif</option><option value="draft">Draf</option><option value="archived">Arsip</option></select></label><InputField label="URL Gambar Produk" name="imageUrl" value={target?.images[0]?.imageUrl ?? '/images/products/iphone-15.jpg'} /></div>
          <Button disabled={state.busy}>Simpan produk</Button>
        </form>
      </aside>}
    </div>
  </Page>;
}
