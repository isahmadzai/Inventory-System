import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, Trash2, X } from 'lucide-react';
import api from '@/services/api';
import type { Notification, PaginatedData, ApiResponse } from '@/types';

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await api.get<ApiResponse<{ count: number }>>('/notifications/unread-count');
      setUnreadCount(res.data.data.count);
    } catch {
      // silently fail
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<ApiResponse<PaginatedData<Notification>>>('/notifications', {
        params: { per_page: 10 },
      });
      setNotifications(res.data.data.data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open, fetchNotifications]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {
      // silently fail
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {
      // silently fail
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (!notifications.find(n => n.id === id)?.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch {
      // silently fail
    }
  };

  const getActionColor = (action: string | null) => {
    switch (action) {
      case 'create': return 'text-emerald-600';
      case 'update': return 'text-blue-600';
      case 'delete': return 'text-red-600';
      case 'login': return 'text-purple-600';
      case 'logout': return 'text-gray-600';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" className="relative" onClick={() => setOpen(!open)}>
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg border border-border shadow-lg z-50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="font-semibold text-sm">Notifications</h3>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" className="text-xs h-7" onClick={handleMarkAllAsRead}>
                    <Check className="w-3 h-3 mr-1" /> Mark all read
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="max-h-80">
              {loading ? (
                <div className="p-6 text-center text-sm text-muted-foreground">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">No notifications yet.</div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-gray-50 transition-colors ${!notification.is_read ? 'bg-blue-50/50' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {!notification.is_read && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />}
                            <p className="text-sm font-medium truncate">{notification.title}</p>
                          </div>
                          {notification.message && (
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notification.message}</p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            {notification.module && (
                              <Badge variant="secondary" className="text-[10px] px-1 py-0">{notification.module}</Badge>
                            )}
                            {notification.action && (
                              <span className={`text-[10px] font-medium uppercase ${getActionColor(notification.action)}`}>
                                {notification.action}
                              </span>
                            )}
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(notification.created_at).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5 shrink-0">
                          {!notification.is_read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleMarkAsRead(notification.id)}
                              title="Mark as read"
                            >
                              <Check className="w-3 h-3 text-emerald-600" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleDelete(notification.id)}
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3 text-muted-foreground hover:text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </>
      )}
    </div>
  );
}
