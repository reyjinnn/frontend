import type { ReactNode } from 'react';
import { Button } from '../../../components/ui/Button';
import { field, type useAdminData } from './adminState';

export function Feedback({ error, message }: { error: string; message: string }) {
  return <>{error && <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-sm dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300">{error}</div>}{message && <div role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300">{message}</div>}</>;
}

export function Page({ title, description, actions, children, state }: { title: string; description?: string; actions?: ReactNode; children: ReactNode; state: ReturnType<typeof useAdminData> }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h2>
          {description && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
        </div>
        <div className="flex items-center gap-3">
          {actions}
          <Button variant="outline" onClick={state.refresh} disabled={state.busy}>Muat Ulang</Button>
        </div>
      </div>
      <Feedback error={state.error} message={state.message} />
      {state.db ? children : !state.error && <p className="text-sm text-slate-500">Memuat data...</p>}
    </div>
  );
}

export function InputField({ label, name, value, type = 'text', required = true, min, step }: { label: string; name: string; value?: string | number; type?: string; required?: boolean; min?: number; step?: string | number }) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      <input className={field} name={name} defaultValue={value} type={type} required={required} min={min} step={step ?? (type === 'number' ? 1 : undefined)} />
    </label>
  );
}
