import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Package, Ticket, Tag, CreditCard, Check, CheckCircle2 } from 'lucide-react';
import { NotificationsApi } from '../../features/notifications/api/notificationsApi';
import type { AppNotification } from '../../features/notifications/types';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadCountChange: (count: number) => void;
}

export function NotificationDropdown({ isOpen, onClose, onUnreadCountChange }: NotificationDropdownProps) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    setIsLoading(true);
    const data = await NotificationsApi.getNotifications();
    setNotifications(data);
    onUnreadCountChange(data.filter(n => !n.isRead).length);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
    
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {

      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        
        setTimeout(onClose, 10);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleMarkAsRead = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await NotificationsApi.markAsRead(id);
    fetchNotifications();
  };

  const handleMarkAllAsRead = async () => {
    await NotificationsApi.markAllAsRead();
    fetchNotifications();
  };

  const handleNotificationClick = async (notification: AppNotification) => {
    if (!notification.isRead) {
      await NotificationsApi.markAsRead(notification.id);
      fetchNotifications();
    }

    onClose();
    switch (notification.type) {
      case 'order':
        navigate('/orders');
        break;
      case 'ticket':
        navigate('/care');
        break;
      case 'tlater':
        navigate('/tlater');
        break;
      case 'promo':
        navigate('/catalog');
        break;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center"><Package className="w-4 h-4" /></div>;
      case 'ticket': return <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 flex items-center justify-center"><Ticket className="w-4 h-4" /></div>;
      case 'promo': return <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 flex items-center justify-center"><Tag className="w-4 h-4" /></div>;
      case 'tlater': return <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 flex items-center justify-center"><CreditCard className="w-4 h-4" /></div>;
      default: return <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 flex items-center justify-center"><Bell className="w-4 h-4" /></div>;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {}
      <div className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      {}
      <div 
        ref={dropdownRef}
        className="fixed md:absolute z-50 md:z-auto bottom-0 md:bottom-auto md:top-[calc(100%+0.5rem)] left-0 md:left-auto md:right-0 w-full md:w-[400px] bg-white dark:bg-[#1A1A1A] md:rounded-2xl rounded-t-2xl md:rounded-t-2xl shadow-2xl md:shadow-xl border-t md:border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] md:max-h-[600px] animate-fade-in-up md:origin-top-right md:animate-in md:fade-in md:zoom-in-95"
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#141414]/50">
          <h3 className="font-bold text-lg">Notifikasi</h3>
          {notifications.some(n => !n.isRead) && (
            <button 
              onClick={handleMarkAllAsRead}
              className="text-xs font-semibold text-pumpkin hover:underline flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Tandai semua dibaca
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {isLoading && notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">Memuat notifikasi...</div>
          ) : notifications.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <Bell className="w-12 h-12 text-slate-200 dark:text-slate-700 mb-3" />
              <p className="text-slate-500 text-sm">Belum ada notifikasi baru.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {notifications.map(notification => (
                <div 
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 flex gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-[#141414] transition-colors relative
                    ${!notification.isRead ? 'bg-orange-50/30 dark:bg-orange-900/5' : ''}`}
                >
                  {!notification.isRead && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-pumpkin rounded-r-full"></div>
                  )}
                  
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm mb-1 ${!notification.isRead ? 'font-bold text-slate-900 dark:text-white' : 'font-semibold text-slate-700 dark:text-slate-300'}`}>
                      {notification.title}
                    </h4>
                    <p className={`text-xs line-clamp-2 leading-relaxed ${!notification.isRead ? 'text-slate-600 dark:text-slate-400' : 'text-slate-500'}`}>
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-2">
                      {new Date(notification.createdAt).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  
                  {!notification.isRead && (
                    <button 
                      onClick={(e) => handleMarkAsRead(e, notification.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-all self-center text-slate-400 hover:text-pumpkin absolute right-4"
                      title="Tandai dibaca"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
