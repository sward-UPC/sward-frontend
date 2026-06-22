import { apiClient } from '@core/api/client';
import { ENDPOINTS } from '@core/api/endpoints';

/** Notificación tal como la devuelve ms-usuarios. */
interface ApiNotificacion {
  id: string;
  tipo: string; // feedback | alerta | logro | sistema | general
  titulo: string;
  mensaje: string;
  payload: Record<string, unknown> | null;
  leida: boolean;
  created_at: string;
}

interface ApiNotificacionesResponse {
  items: ApiNotificacion[];
  no_leidas: number;
}

/** Tipo semántico para el ícono/acento del popup (ya existente en el UI). */
export type AppNotificationType = 'warning' | 'info' | 'success';

/** Notificación normalizada para el UI (conserva el UUID real y el tipo del dominio). */
export interface AppNotification {
  id: string;
  tipo: string;
  type: AppNotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  payload: Record<string, unknown> | null;
}

/** Mapea el tipo de dominio al acento visual del popup. */
function tipoToVisual(tipo: string): AppNotificationType {
  switch (tipo) {
    case 'alerta':
      return 'warning';
    case 'logro':
      return 'success';
    default:
      return 'info'; // feedback, sistema, general
  }
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('es-PE', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function toApp(n: ApiNotificacion): AppNotification {
  return {
    id: n.id,
    tipo: n.tipo,
    type: tipoToVisual(n.tipo),
    title: n.titulo,
    message: n.mensaje,
    time: formatTime(n.created_at),
    read: n.leida,
    payload: n.payload,
  };
}

export async function getNotifications(): Promise<{ items: AppNotification[]; unread: number }> {
  const { data } = await apiClient.get<ApiNotificacionesResponse>(ENDPOINTS.notifications.list);
  return { items: (data.items ?? []).map(toApp), unread: data.no_leidas ?? 0 };
}

export async function markNotificationRead(id: string): Promise<void> {
  await apiClient.post(ENDPOINTS.notifications.read(id));
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiClient.post(ENDPOINTS.notifications.readAll);
}

export async function deleteNotification(id: string): Promise<void> {
  await apiClient.delete(ENDPOINTS.notifications.remove(id));
}
