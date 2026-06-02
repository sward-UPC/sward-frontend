import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { X, MessageSquare, TrendingUp, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { DomainRadar } from "../xai/DomainRadar";
import { AttentionHeatmap } from "../xai/AttentionHeatmap";

interface StudentData {
  id: number;
  name: string;
  email: string;
  riskLevel: string;
  avgMastery: number;
  conceptsAtRisk: number;
  lastActivity: string;
  engagement: number;
}

interface StudentDetailViewProps {
  student: StudentData;
  onClose: () => void;
  onSendFeedback: () => void;
}

const mockProgressData = [
  { week: "S1", mastery: 45 },
  { week: "S2", mastery: 48 },
  { week: "S3", mastery: 42 },
  { week: "S4", mastery: 50 },
  { week: "S5", mastery: 52 },
];

const mockConceptMastery = [
  { concept: "Intro IA", mastery: 75 },
  { concept: "Redes N.", mastery: 35 },
  { concept: "Deep L.", mastery: 40 },
  { concept: "KT", mastery: 60 },
  { concept: "Python", mastery: 55 },
];

const mockInteractions = [
  {
    id: 1,
    date: "15/05/26 10:30",
    resource: "Video: Fundamentos de Redes Neuronales",
    concept: "Redes Neuronales",
    result: "Completado",
    time: "15 min",
  },
  {
    id: 2,
    date: "14/05/26 16:45",
    resource: "Ejercicio: Deep Learning Básico",
    concept: "Deep Learning",
    result: "Incorrecto",
    time: "25 min",
  },
  {
    id: 3,
    date: "14/05/26 14:20",
    resource: "Lectura: Introducción a Knowledge Tracing",
    concept: "Knowledge Tracing",
    result: "Completado",
    time: "18 min",
  },
  {
    id: 4,
    date: "13/05/26 11:00",
    resource: "Ejercicio: Perceptrón Simple",
    concept: "Redes Neuronales",
    result: "Incorrecto",
    time: "30 min",
  },
];

const mockAttentionInteractions = [
  { id: 1, concept: "Intro a IA", timestamp: "15/05/26 10:30", isCorrect: true, attention: 75 },
  { id: 2, concept: "Deep Learning", timestamp: "14/05/26 16:45", isCorrect: false, attention: 40 },
  { id: 3, concept: "Redes Neuronales", timestamp: "14/05/26 14:20", isCorrect: false, attention: 35 },
  { id: 4, concept: "Knowledge Tracing", timestamp: "13/05/26 11:00", isCorrect: true, attention: 60 },
];

const mockDomainData = [
  { subject: "Intro IA", value: 75, fullMark: 100 },
  { subject: "Deep Learning", value: 40, fullMark: 100 },
  { subject: "Redes Neur.", value: 35, fullMark: 100 },
  { subject: "Python", value: 55, fullMark: 100 },
  { subject: "Know. Tracing", value: 60, fullMark: 100 },
];

export function StudentDetailView({ student, onClose, onSendFeedback }: StudentDetailViewProps) {
  const getRiskBadge = (level: string) => {
    switch (level) {
      case "high":
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="w-3 h-3" />
            Riesgo Alto
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="warning" className="gap-1">
            Riesgo Medio
          </Badge>
        );
      case "low":
        return (
          <Badge variant="success" className="gap-1">
            <TrendingUp className="w-3 h-3" />
            Bajo Riesgo
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="border-primary">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle>{student.name}</CardTitle>
              {getRiskBadge(student.riskLevel)}
            </div>
            <CardDescription>{student.email}</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Cerrar detalle">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Dominio Promedio</p>
                <p className="text-2xl font-bold text-destructive">{student.avgMastery}%</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Engagement</p>
                <p className="text-2xl font-bold">{student.engagement}%</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Conceptos en Riesgo</p>
                <p className="text-2xl font-bold text-destructive">{student.conceptsAtRisk}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Última Actividad</p>
                <p className="text-sm font-medium">{student.lastActivity}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Progreso */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Evolución del Dominio</CardTitle>
            <CardDescription>Progreso semanal del estudiante</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockProgressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="week" stroke="#6B7280" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E5E7EB",
                      borderRadius: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mastery"
                    stroke="#DC2626"
                    strokeWidth={2}
                    name="Dominio %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 p-3 bg-destructive/5 border border-destructive/20 rounded-[12px]">
              <p className="text-sm text-destructive">
                <strong>Tendencia negativa:</strong> El dominio promedio ha disminuido en las últimas
                2 semanas. Se recomienda intervención.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Vista Rápida de Dominio - Radar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DomainRadar data={mockDomainData} title="Vista Rápida de Dominio" />
          <AttentionHeatmap
            interactions={mockAttentionInteractions}
            currentPrediction={`Probabilidad de éxito en próximo ejercicio de Redes Neuronales: 38%. Se recomienda intervención docente.`}
          />
        </div>

        {/* Dominio por Concepto */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dominio por Concepto</CardTitle>
            <CardDescription>Estado actual de cada concepto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockConceptMastery}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="concept" stroke="#6B7280" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E5E7EB",
                      borderRadius: "12px",
                    }}
                  />
                  <Bar dataKey="mastery" fill="#4F46E5" name="Dominio %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Historial de Interacciones */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Historial de Interacciones Recientes</CardTitle>
            <CardDescription>Últimas 10 actividades del estudiante</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockInteractions.map((interaction) => (
                <div
                  key={interaction.id}
                  className="flex items-start gap-3 p-3 border rounded-[12px] hover:bg-muted/50 transition-colors"
                >
                  <div className="mt-1">
                    {interaction.result === "Completado" ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{interaction.resource}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {interaction.concept}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {interaction.time}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0">{interaction.date}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recomendaciones para el Docente */}
        <Card className="bg-warning/5 border-warning/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Recomendaciones de Intervención
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-background rounded-[12px]">
              <p className="text-sm font-medium mb-1">1. Reforzar Redes Neuronales</p>
              <p className="text-xs text-muted-foreground">
                Dominio crítico (35%). Se detectaron 3 intentos incorrectos consecutivos. Sugerir
                tutoría personalizada o recursos adicionales.
              </p>
            </div>
            <div className="p-3 bg-background rounded-[12px]">
              <p className="text-sm font-medium mb-1">2. Monitorear Deep Learning</p>
              <p className="text-xs text-muted-foreground">
                Dominio bajo (40%). El estudiante muestra dificultades con conceptos intermedios.
                Considerar sesión de retroalimentación.
              </p>
            </div>
            <div className="p-3 bg-background rounded-[12px]">
              <p className="text-sm font-medium mb-1">3. Aumentar Engagement</p>
              <p className="text-xs text-muted-foreground">
                Engagement bajo (35%). Última actividad hace 2 días. Enviar recordatorio o mensaje
                de motivación.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Acciones */}
        <div className="flex gap-2 pt-4 border-t">
          <Button className="flex-1" onClick={onSendFeedback}>
            <MessageSquare className="w-4 h-4 mr-2" />
            Enviar Retroalimentación
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
