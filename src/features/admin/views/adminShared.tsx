import type { ReactNode } from 'react';
import { Button } from '../../../components/ui/Button';
import { field, type useAdminData } from './adminState';

export function Feedback({ error, message }: { error: string; message: string }) {
  return <>{error && <p role="alert" className="rounded-xl bg-red-50 text-red-700 p-3">{error}</p>}{message && <p role="status" className="text-green-700 p-2">{message}</p>}</>;
}
export function Page({ title, children, state }: { title: string; children: ReactNode; state: ReturnType<typeof useAdminData> }) {
  return <div className="space-y-5"><div className="flex justify-between gap-3"><h2 className="font-space text-2xl font-bold">{title}</h2><Button variant="outline" onClick={state.refresh} disabled={state.busy}>Perbarui</Button></div><Feedback error={state.error} message={state.message} />{state.db ? children : !state.error && <p>Memuat...</p>}</div>;
}
export function InputField({ label, name, value, type = 'text', required = true, min, step }: { label: string; name: string; value?: string | number; type?: string; required?: boolean; min?: number; step?: string | number }) {
  return <label className="block text-sm space-y-1"><span>{label}</span><input className={field} name={name} defaultValue={value} type={type} required={required} min={min} step={step ?? (type === 'number' ? 1 : undefined)} /></label>;
}
