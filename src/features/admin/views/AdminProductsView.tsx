import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Page, InputField } from './adminShared';
import { useAdminData, panel, money, formValues } from './adminState';
import { Button } from '../../../components/ui/Button';
import { AdminApi } from '../api/adminApi';

export function AdminProductsView() {
  const state = useAdminData();
  const location = useLocation();
  const [filter, setFilter] = useState(() => new URLSearchParams(location.search).get('search') ?? '');
  const [editingId, setEditingId] = useState<number | 'new' | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const products = (state.db?.products ?? []).filter(p => !filter || p.name.toLowerCase().includes(filter.toLowerCase()) || p.sku.toLowerCase().includes(filter.toLowerCase()));
  const target = editingId === 'new' ? null : state.db?.products.find(p => p.id === editingId);
  const toggleSelect = (id: number) => setSelectedIds(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]);
  return <Page title="Inventaris Produk" state={state}>
    <div className="flex flex-wrap justify-between gap-2"><div className="flex gap-2"><input aria-label="Cari produk" placeholder="Cari SKU atau nama..." value={filter} onChange={e => setFilter(e.target.value)} className="rounded-xl border p-2 text-sm dark:bg-[#111]" />{selectedIds.length > 0 && <Button size="sm" variant="outline" disabled={state.busy} onClick={() => void state.run(() => AdminApi.archiveProducts(selectedIds), 'Diarsipkan').then(ok => { if (ok) setSelectedIds([]); })}>Arsipkan Terpilih ({selectedIds.length})</Button>}</div><Button size="sm" onClick={() => setEditingId('new')}>Tambah Produk</Button></div>
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-3">{products.map(p => <div key={p.id} className={`${panel} flex items-center justify-between`}><div className="flex items-center gap-3"><input aria-label={`Pilih ${p.name}`} type="checkbox" checked={selectedIds.includes(p.id)} onChange={() => toggleSelect(p.id)} /><img src={p.images[0]?.imageUrl} alt="" className="w-12 h-12 rounded object-cover" /><div><p className="font-bold text-sm">{p.name}</p><p className="text-xs text-slate-500 font-mono">{p.sku} · Stok: {p.stock} · {money(p.price)} · {p.status}</p></div></div><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => setEditingId(p.id)}>Edit</Button><Button size="sm" variant="outline" disabled={state.busy} onClick={() => void state.run(() => AdminApi.deleteProduct(p.id), 'Dihapus')}>Hapus</Button></div></div>)}{!products.length && <p className="text-slate-500">Tidak ada produk.</p>}</div>
      {editingId !== null && <div className={panel}><div className="flex justify-between items-center"><h3 className="font-bold font-space">{editingId === 'new' ? 'Produk Baru' : 'Edit Produk'}</h3><Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Tutup</Button></div>
        <form key={editingId} className="space-y-3" onSubmit={e => {
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
          <InputField label="Nama Produk" name="name" value={target?.name} />
          <InputField label="SKU" name="sku" value={target?.sku} />
          <InputField label="Slug URL" name="slug" value={target?.slug} />
          <InputField label="Deskripsi" name="description" value={target?.description} />
          <InputField label="Harga (Rp)" name="price" type="number" min={0} value={target?.price} />
          <InputField label="Stok Gudang" name="stock" type="number" min={0} value={target?.stock} />
          <InputField label="Berat (gram)" name="weightGrams" type="number" min={1} value={target?.weightGrams ?? 500} />
          <InputField label="ID Kategori" name="categoryId" type="number" min={1} value={target?.categoryId ?? 1} />
          <label className="block text-sm space-y-1"><span>Status</span><select aria-label="Status produk" className="w-full rounded-xl border p-2 dark:bg-[#111]" name="status" defaultValue={target?.status ?? 'active'}><option value="active">Active</option><option value="draft">Draft</option><option value="archived">Archived</option></select></label>
          <InputField label="URL Gambar Produk" name="imageUrl" value={target?.images[0]?.imageUrl ?? '/images/products/iphone-15.jpg'} />
          <Button disabled={state.busy}>Simpan</Button>
        </form>
      </div>}
    </div>
  </Page>;
}
