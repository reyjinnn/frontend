import api from '../../../lib/axios';
import type { AppNotification } from '../types';
import { readDemoDB, requireDemoUser, transactDemoDB } from '../../../lib/demoRepository';
import { DEMO_MODE } from '../../../lib/demoMode';

export const NotificationsApi = {
  async getNotifications(): Promise<AppNotification[]> {
    if (!DEMO_MODE) return (await api.get('/api/v1/notifications')).data;
    const u = requireDemoUser(); return readDemoDB().notifications.filter(n => n.userId === u.id);
  },
  async markAsRead(id: string): Promise<void> {
    if (!DEMO_MODE) { await api.patch(`/api/v1/notifications/${id}/read`); return; }
    const u = requireDemoUser(); await transactDemoDB(db => { const n = db.notifications.find(n => n.id === id && n.userId === u.id); if (!n) throw new Error('Notification not found'); n.isRead = true; });
  },
  async markAllAsRead(): Promise<void> {
    if (!DEMO_MODE) { await api.patch('/api/v1/notifications/read-all'); return; }
    const u = requireDemoUser(); await transactDemoDB(db => { db.notifications.filter(n => n.userId === u.id).forEach(n => { n.isRead = true; }); });
  }
};
