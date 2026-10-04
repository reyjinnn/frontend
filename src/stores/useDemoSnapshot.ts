import { useMemo, useSyncExternalStore } from 'react';
import { DB_KEY, readDemoDB } from '../lib/demoRepository';

function parseSnapshot(raw: string) {
  void raw;
  return readDemoDB();
}

function subscribe(update: () => void) {
  window.addEventListener('storage', update);
  window.addEventListener('focus', update);
  window.addEventListener('techvibe:changed', update);
  const timer = window.setInterval(update, 1000);
  return () => {
    window.removeEventListener('storage', update);
    window.removeEventListener('focus', update);
    window.removeEventListener('techvibe:changed', update);
    window.clearInterval(timer);
  };
}

export function useDemoSnapshot() {
  const raw = useSyncExternalStore(subscribe, () => localStorage.getItem(DB_KEY) ?? '', () => '');
  return useMemo(() => parseSnapshot(raw), [raw]);
}
