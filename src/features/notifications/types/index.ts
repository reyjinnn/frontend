export type NotificationType = 'order' | 'promo' | 'tlater' | 'ticket';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  referenceId?: string; 
}
