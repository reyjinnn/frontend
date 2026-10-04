import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { AdminApi } from '../api/adminApi';
import type { DemoDB } from '../../../lib/demoRepository';

export const panel = 'bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4';
export const field = 'w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] px-3 py-2';
export const money = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;
function initialData() {
  try { return { db: AdminApi.snapshot(), error: '' }; }
  catch (e) { return { db: null, error: e instanceof Error ? e.message : 'Gagal memuat data' }; }
}
export function useAdminData() {
  const [data, setData] = useState<{ db: DemoDB | null; error: string }>(initialData);
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const [message, setMessage] = useState('');
  const refresh = useCallback(() => { setData(initialData()); }, []);
  useEffect(() => {
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    window.addEventListener('admin-data', refresh);
    return () => { window.removeEventListener('storage', refresh); window.removeEventListener('focus', refresh); window.removeEventListener('admin-data', refresh); };
  }, [refresh]);
  const run = async (operation: () => Promise<unknown>, success = 'Tersimpan') => {
    if (pending.current) return false;
    pending.current = true;
    setBusy(true); setData(previous => ({ ...previous, error: '' })); setMessage('');
    try {
      await operation(); window.dispatchEvent(new Event('admin-data')); setMessage(success); return true;
    } catch (e) { setData(previous => ({ ...previous, error: e instanceof Error ? e.message : 'Operasi gagal' })); return false; }
    finally { pending.current = false; setBusy(false); }
  };
  return { ...data, busy, message, run, refresh };
}
export function formValues(e: FormEvent<HTMLFormElement>) { e.preventDefault(); return new FormData(e.currentTarget); }
export function localDateTime(value: string | number) {
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}
export function csv(name: string, rows: (string | number | boolean | undefined)[][]) {
  const value = rows.map(row => row.map(cell => {
    const raw = String(cell ?? '');
    return `"${(/^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw).replace(/"/g, '""')}"`;
  }).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob(['\uFEFF', value], { type: 'text/csv;charset=utf-8' }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
