import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { XCircle, AlertTriangle, Info, Clock, Download } from "lucide-react";
import { systemLogs } from "../../../../mocks/data/admin.mock";

function logIcon(level: string) {
  switch (level) {
    case "error": return <XCircle className="w-4 h-4 text-destructive shrink-0" />;
    case "warning": return <AlertTriangle className="w-4 h-4 text-warning shrink-0" />;
    default: return <Info className="w-4 h-4 text-primary shrink-0" />;
  }
}

function logBg(level: string) {
  switch (level) {
    case "error": return "bg-destructive/5 border-destructive/20";
    case "warning": return "bg-warning/5 border-warning/20";
    default: return "bg-muted/40 border-border";
  }
}

export function LogsTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {["Todos", "Error", "Warning", "Info"].map((f) => (
            <button
              key={f}
              className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-primary/40 hover:text-primary transition-colors"
            >
              {f}
            </button>
          ))}
        </div>
        <Button size="sm" variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Exportar Logs
        </Button>
      </div>

      <Card>
        <CardContent className="pt-4 pb-4 space-y-2">
          {systemLogs.map((log) => (
            <div key={log.id} className={`flex items-start gap-3 p-3 rounded-[10px] border ${logBg(log.level)}`}>
              {logIcon(log.level)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className={`text-xs font-bold uppercase tracking-wide ${log.level === "error" ? "text-destructive" : log.level === "warning" ? "text-warning" : "text-primary"}`}>
                    {log.level}
                  </span>
                  <Badge variant="outline" className="text-xs">{log.module}</Badge>
                </div>
                <p className="text-sm">{log.message}</p>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {log.time}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
