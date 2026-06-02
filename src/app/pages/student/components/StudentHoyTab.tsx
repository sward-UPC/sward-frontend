import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import {
  TrendingUp, TrendingDown, CheckCircle, Target, Flame,
  Sparkles, Brain, BarChart2, Library, PlayCircle, ArrowRight,
  Clock, Minus, Video,
} from 'lucide-react';
import type { KnowledgeState, Recommendation, LearningPathStep, NavItem } from '@core/types';

interface StudentHoyTabProps {
  userName: string;
  streak: number;
  completedCount: number;
  totalResources: number;
  currentConcepts: KnowledgeState[];
  topRecommendation: Recommendation;
  learningPath: LearningPathStep[];
  onSelectResource: (id: number) => void;
  onNavChange: (nav: NavItem) => void;
}

export function StudentHoyTab({
  userName,
  streak,
  completedCount,
  totalResources,
  currentConcepts,
  topRecommendation,
  learningPath: _learningPath,
  onSelectResource,
  onNavChange,
}: StudentHoyTabProps) {
  return (
    <div className="space-y-4">
      {/* Welcome banner */}
      <div
        className="rounded-[16px] p-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
      >
        <div
          className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #a5b4fc, transparent)' }}
        />
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-indigo-200 text-sm">Lunes, 1 de junio · Semana 4</p>
              <h2 className="text-white mt-1" style={{ fontSize: '1.35rem', fontWeight: 700 }}>
                ¡Hola, {userName}! 👋
              </h2>
              <p className="text-indigo-200 text-sm mt-1">
                Llevas <strong className="text-white">{streak} días</strong> consecutivos aprendiendo. ¡Sigue así!
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
              <Flame className="w-4 h-4 text-warning" />
              <span className="text-white text-sm font-bold">{streak}</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label: 'Dominio actual', value: '68%', icon: <TrendingUp className="w-4 h-4" /> },
              { label: 'Recursos completados', value: `${completedCount}/${totalResources}`, icon: <CheckCircle className="w-4 h-4" /> },
              { label: 'Meta semanal', value: '80%', icon: <Target className="w-4 h-4" /> },
            ].map((s) => (
              <div key={s.label} className="bg-white/15 backdrop-blur-sm rounded-[12px] p-3">
                <div className="flex items-center gap-1.5 text-indigo-200 mb-1">{s.icon}<span className="text-xs">{s.label}</span></div>
                <p className="text-white font-bold">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Meta semanal */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Meta de la semana — llegar a 80% de dominio</span>
            </div>
            <span className="text-sm font-bold text-primary">68% / 80%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: '85%', background: 'linear-gradient(90deg, #6366f1, #7c3aed)' }} />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">Te faltan completar 2 recursos recomendados para alcanzar tu meta</p>
        </CardContent>
      </Card>

      {/* Next recommended resource */}
      <div>
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" /> Próximo recurso recomendado
        </h3>
        <Card
          className="border-primary/30 bg-primary/5 hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => onSelectResource(topRecommendation.id)}
        >
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-[12px] bg-blue-500/10 flex items-center justify-center shrink-0">
                <Video className="w-6 h-6 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-tight">{topRecommendation.title}</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">{topRecommendation.concept}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{topRecommendation.duration}</span>
                  <span className="text-xs px-2 py-0.5 bg-success/10 text-success rounded-full">+{topRecommendation.improvement}% dominio</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{topRecommendation.reason}</p>
              </div>
              <Button size="sm" className="shrink-0 gap-1.5">
                <PlayCircle className="w-4 h-4" /> Empezar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick concept status */}
      <div>
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" /> Estado de tus conceptos
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {currentConcepts.map((c) => (
            <div key={c.conceptName} className="flex items-center gap-3 p-3 bg-card border border-border rounded-[10px]">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium truncate">{c.conceptName}</span>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {c.trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-success" />}
                    {c.trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-destructive" />}
                    {c.trend === 'stable' && <Minus className="w-3.5 h-3.5 text-muted-foreground" />}
                    <span className={`text-sm font-bold ${c.mastery >= 75 ? 'text-success' : c.mastery >= 60 ? 'text-warning' : 'text-destructive'}`}>
                      {c.mastery}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${c.mastery >= 75 ? 'bg-success' : c.mastery >= 60 ? 'bg-warning' : 'bg-destructive'}`}
                    style={{ width: `${c.mastery}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick shortcuts */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Accesos rápidos</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: 'Ver Progreso', nav: 'progreso' as NavItem, icon: <BarChart2 className="w-4 h-4" />, color: 'text-primary' },
            { label: 'Mis Recursos', nav: 'recursos' as NavItem, icon: <Library className="w-4 h-4" />, color: 'text-success' },
            { label: 'Mapa Atención', nav: 'atencion' as NavItem, icon: <Sparkles className="w-4 h-4" />, color: 'text-warning' },
            { label: 'XAI Análisis', nav: 'aprendizaje' as NavItem, icon: <Brain className="w-4 h-4" />, color: 'text-purple-500' },
          ].map((s) => (
            <button
              key={s.label}
              onClick={() => onNavChange(s.nav)}
              className="flex items-center gap-2 p-3 bg-card border border-border rounded-[10px] hover:border-primary/40 hover:bg-muted/50 transition-all text-left group"
            >
              <span className={s.color}>{s.icon}</span>
              <span className="text-xs font-medium">{s.label}</span>
              <ArrowRight className="w-3 h-3 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
