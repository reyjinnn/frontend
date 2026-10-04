import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useUIStore } from '../../stores/useUIStore';

export function CustomerRoute({ children }: { children: ReactNode }) {
  const user = useAuthStore(s => s.user);
  const location = useLocation();
  const openLogin = useUIStore(s => s.openLogin);
  useEffect(() => {
    if (!user) {
      useAuthStore.getState().setIntendedAction(location.pathname + location.search);
      openLogin();
    }
  }, [user, location.pathname, location.search, openLogin]);
  if (!user) return <div className="p-8 text-center"><button onClick={openLogin}>Masuk untuk melanjutkan</button></div>;
  if (user.role !== 'customer') return <Navigate to="/admin" replace />;
  return children;
}
