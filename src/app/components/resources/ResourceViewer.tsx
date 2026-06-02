import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Progress } from "../ui/Progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/Dialog";
import { CheckCircle2, Play, BookOpen, Video, FileText, Clock, X } from "lucide-react";

interface Resource {
  id: number;
  title: string;
  type: "video" | "exercise" | "reading";
  duration: string;
  reason: string;
  content: string;
  concept: string;
}

interface ResourceViewerProps {
  resource: Resource;
  onComplete: () => void;
  onClose: () => void;
}

export function ResourceViewer({ resource, onComplete, onClose }: ResourceViewerProps) {
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const getIcon = () => {
    switch (resource.type) {
      case "video":
        return <Video className="w-6 h-6" />;
      case "exercise":
        return <BookOpen className="w-6 h-6" />;
      case "reading":
        return <FileText className="w-6 h-6" />;
    }
  };

  const simulateProgress = () => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCompleted(true);
          return 100;
        }
        return prev + 10;
      });
    }, 1000);
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                {getIcon()}
              </div>
              <div>
                <DialogTitle>{resource.title}</DialogTitle>
                <DialogDescription className="mt-1">
                  {resource.concept} • {resource.duration}
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Razón de la recomendación */}
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-[12px]">
            <h4 className="text-sm font-medium text-primary mb-2">¿Por qué este recurso?</h4>
            <p className="text-sm text-muted-foreground">{resource.reason}</p>
          </div>

          {/* Contenido del recurso */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contenido</CardTitle>
            </CardHeader>
            <CardContent>
              {resource.type === "video" && (
                <div className="space-y-4">
                  <div className="aspect-video bg-muted rounded-[12px] flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <Play className="w-16 h-16 mx-auto text-primary" />
                      <p className="text-sm text-muted-foreground">
                        Video: {resource.title}
                      </p>
                      <Button onClick={simulateProgress}>
                        <Play className="w-4 h-4 mr-2" />
                        Reproducir Video
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {resource.type === "reading" && (
                <div className="prose prose-sm max-w-none">
                  <div className="p-4 bg-muted rounded-[12px] space-y-3">
                    <p className="text-sm leading-relaxed whitespace-pre-line">
                      {resource.content}
                    </p>
                    {!isCompleted && (
                      <Button onClick={simulateProgress} className="w-full">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Leer Contenido Completo
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {resource.type === "exercise" && (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-[12px]">
                    <p className="text-sm leading-relaxed mb-4">{resource.content}</p>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg hover:bg-accent cursor-pointer">
                        A) Opción de respuesta 1
                      </div>
                      <div className="p-3 border rounded-lg hover:bg-accent cursor-pointer">
                        B) Opción de respuesta 2
                      </div>
                      <div className="p-3 border rounded-lg hover:bg-accent cursor-pointer">
                        C) Opción de respuesta 3
                      </div>
                      <div className="p-3 border rounded-lg hover:bg-accent cursor-pointer">
                        D) Opción de respuesta 4
                      </div>
                    </div>
                  </div>
                  {!isCompleted && (
                    <Button onClick={simulateProgress} className="w-full">
                      Enviar Respuesta
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Barra de progreso */}
          {progress > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progreso del recurso</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          {/* Mensaje de completado */}
          {isCompleted && (
            <div className="p-4 bg-success/10 border border-success/20 rounded-[12px]">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-success mb-1">
                    ¡Recurso Completado!
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Has completado este recurso. Tu estado de conocimiento se actualizará
                    automáticamente.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Acciones */}
          <div className="flex gap-2 pt-4 border-t">
            {isCompleted ? (
              <Button onClick={handleComplete} className="flex-1">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Confirmar y Continuar
              </Button>
            ) : (
              <Button variant="outline" onClick={onClose} className="flex-1">
                <X className="w-4 h-4 mr-2" />
                Cerrar
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
