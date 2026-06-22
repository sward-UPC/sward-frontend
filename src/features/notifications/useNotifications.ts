import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  deleteNotification,
  type AppNotification,
} from './notifications.service';

const KEY = ['notifications'] as const;

/**
 * Notificaciones reales del usuario autenticado (ms-usuarios). Hace polling cada
 * ~45s para acercarse a "tiempo real" sin push. Expone acciones optimistas para
 * marcar leídas / descartar. Sirve a estudiante, docente y admin por igual (el
 * backend filtra por el usuario del JWT).
 */
export function useNotifications(enabled = true) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: KEY,
    queryFn: getNotifications,
    enabled,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 45,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: KEY });

  const markRead = useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: invalidate,
  });
  const markAllRead = useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onSuccess: invalidate,
  });
  const dismiss = useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onSuccess: invalidate,
  });

  const items: AppNotification[] = query.data?.items ?? [];
  const unread = query.data?.unread ?? 0;

  return {
    notifications: items,
    unreadCount: unread,
    isLoading: query.isLoading,
    markRead: (id: string) => markRead.mutate(id),
    markAllRead: () => markAllRead.mutate(),
    dismiss: (id: string) => dismiss.mutate(id),
  };
}
