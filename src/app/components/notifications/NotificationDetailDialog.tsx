import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { MiniMarkdown } from '../student/MiniMarkdown';
import {
  MessageSquare, AlertTriangle, Trophy, UserPlus, Bell, ExternalLink, Clock,
} from 'lucide-react';
import type { AppNotification } from '@features/notifications/notifications.service';

/** Ícono + acento por tipo de dominio de la notificación. */
function meta(tipo: string) {
  switch (tipo) {
    case 'feedback':
      return { Icon: MessageSquare, color: 'text-primary', bg: 'bg-primary/10', label: 'Retroalimentación' };
    case 'alerta':
      return { Icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', label: 'Alerta' };
    case 'logro':
      return { Icon: Trophy, color: 'text-success', bg: 'bg-success/10', label: 'Logro' };
    case 'sistema':
      return { Icon: UserPlus, color: 'text-primary', bg: 'bg-primary/10', label: 'Sistema' };
    default:
      return { Icon: Bell, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Notificación' };
  }
}

/** Recursos opcionales que la notificación puede traer en su payload. */
function recursosDe(payload: Record<string, unknown> | null): { nombre: string; url: string }[] {
  const raw = payload?.recursos;
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((r): r is { nombre: string; url: string } =>
      !!r && typeof r === 'object' && typeof (r as { url?: unknown }).url === 'string')
    .map((r) => ({ nombre: r.nombre || r.url, url: r.url }));
}

export function NotificationDetailDialog({
  notification,
  open,
  onClose,
}: {
  notification: AppNotification | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!notification) return null;
  const { Icon, color, bg, label } = meta(notification.tipo);
  const recursos = recursosDe(notification.payload);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-[12px] ${bg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className="min-w-0 flex-1">
              <Badge variant="outline" className="text-[10px] mb-1">{label}</Badge>
              <DialogTitle className="text-base leading-snug">{notification.title}</DialogTitle>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {notification.time}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Mensaje completo (markdown: negrita, listas, enlaces, etc.) */}
        <div className="text-sm text-foreground/90 leading-relaxed">
          <MiniMarkdown text={notification.message} />
        </div>

        {/* Recursos adjuntos (si el payload los trae) */}
        {recursos.length > 0 && (
          <div className="mt-2 space-y-1.5 border-t pt-3">
            <p className="text-xs font-medium text-muted-foreground">Recursos</p>
            {recursos.map((r) => (
              <a
                key={r.url}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{r.nombre}</span>
              </a>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
