import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/Dialog";
import { Button } from "../ui/Button";
import { Label } from "../ui/Label";
import { Badge } from "../ui/Badge";
import { CheckCircle2, Send } from "lucide-react";

interface FeedbackDialogProps {
  studentName: string;
  open: boolean;
  onClose: () => void;
}

export function FeedbackDialog({ studentName, open, onClose }: FeedbackDialogProps) {
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const categories = [
    { id: "encouragement", label: "Motivación", color: "bg-success text-success-foreground" },
    { id: "concern", label: "Preocupación", color: "bg-warning text-warning-foreground" },
    { id: "resource", label: "Recurso Adicional", color: "bg-primary text-primary-foreground" },
    { id: "meeting", label: "Solicitar Reunión", color: "bg-info text-info-foreground" },
  ];

  const templates = {
    encouragement: `Hola ${studentName.split(" ")[0]},

He notado tu excelente progreso en los últimos ejercicios. ¡Sigue así! Tu dedicación es admirable.

Continúa con el buen trabajo.`,
    concern: `Hola ${studentName.split(" ")[0]},

He observado que has tenido algunas dificultades recientes en los conceptos de Redes Neuronales. ¿Te gustaría que agendemos una sesión de tutoría para revisar estos temas?

Estoy aquí para apoyarte.`,
    resource: `Hola ${studentName.split(" ")[0]},

Te comparto algunos recursos adicionales que pueden ayudarte a reforzar los conceptos en los que has mostrado dificultades:

[Enlaces a recursos]

No dudes en consultarme si tienes preguntas.`,
    meeting: `Hola ${studentName.split(" ")[0]},

Me gustaría agendar una reunión contigo para revisar tu progreso y ver cómo puedo apoyarte mejor en tu aprendizaje.

¿Cuándo tendrías disponibilidad esta semana?`,
  };

  const handleCategorySelect = (categoryId: string) => {
    setCategory(categoryId);
    setMessage(templates[categoryId as keyof typeof templates] || "");
  };

  const handleSend = () => {
    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        setMessage("");
        setCategory(null);
        onClose();
      }, 2000);
    }, 1500);
  };

  const handleClose = () => {
    setMessage("");
    setCategory(null);
    setSuccess(false);
    onClose();
  };

  if (success) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
            </div>
            <h3 className="font-medium mb-2">¡Feedback Enviado!</h3>
            <p className="text-sm text-muted-foreground">
              Tu mensaje ha sido enviado a {studentName}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enviar Retroalimentación a {studentName}</DialogTitle>
          <DialogDescription>
            Selecciona una categoría y personaliza el mensaje
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Categorías */}
          <div className="space-y-3">
            <Label>Categoría del Mensaje</Label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`p-3 rounded-[12px] border-2 transition-all text-sm font-medium ${
                    category === cat.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Área de texto */}
          <div className="space-y-2">
            <Label htmlFor="message">Mensaje</Label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              className="w-full min-h-[200px] p-4 rounded-[12px] border border-input bg-input-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              aria-required="true"
            />
            <p className="text-xs text-muted-foreground">
              {message.length} caracteres
            </p>
          </div>

          {/* Vista previa */}
          {message && (
            <div className="space-y-2">
              <Label>Vista Previa</Label>
              <div className="p-4 bg-muted rounded-[12px] border">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-foreground">
                      {studentName.split(" ")[0][0]}
                      {studentName.split(" ")[1]?.[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{studentName}</p>
                    <p className="text-xs text-muted-foreground">Estudiante</p>
                  </div>
                  {category && (
                    <Badge className="ml-auto">
                      {categories.find((c) => c.id === category)?.label}
                    </Badge>
                  )}
                </div>
                <p className="text-sm whitespace-pre-line">{message}</p>
              </div>
            </div>
          )}

          {/* Acciones */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              onClick={handleSend}
              disabled={!message.trim() || isSending}
              className="flex-1"
            >
              {isSending ? (
                "Enviando..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Retroalimentación
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleClose} disabled={isSending}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
