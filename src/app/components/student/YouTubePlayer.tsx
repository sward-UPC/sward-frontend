import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';
import { cn } from '../ui/utils';

/* Tipos mínimos de la YouTube IFrame API (no hay @types instalados). */
interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(s: number, allow: boolean): void;
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
  destroy(): void;
}
interface YTNamespace {
  Player: new (
    el: HTMLElement,
    opts: {
      videoId: string;
      host?: string;
      playerVars?: Record<string, number | string>;
      events?: { onReady?: () => void; onStateChange?: (e: { data: number }) => void };
    },
  ) => YTPlayer;
  PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
}
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

// Carga el script de la IFrame API una sola vez (promesa compartida).
let apiPromise: Promise<YTNamespace> | null = null;
function loadYouTubeApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      if (window.YT) resolve(window.YT);
    };
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  });
  return apiPromise;
}

function fmt(s: number): string {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

/** Reproductor de YouTube con controles propios (oculta el chrome de YouTube). */
export function YouTubePlayer({ videoId, title }: { videoId: string; title: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [listo, setListo] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [muted, setMuted] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);

  useEffect(() => {
    let cancelado = false;
    let intervalo: number | undefined;

    loadYouTubeApi().then((YT) => {
      if (cancelado || !hostRef.current) return;
      playerRef.current = new YT.Player(hostRef.current, {
        videoId,
        host: 'https://www.youtube-nocookie.com',
        playerVars: { controls: 0, modestbranding: 1, rel: 0, playsinline: 1, iv_load_policy: 3 },
        events: {
          onReady: () => {
            if (cancelado) return;
            setListo(true);
            setDur(playerRef.current?.getDuration() ?? 0);
            setMuted(!!playerRef.current?.isMuted());
            intervalo = window.setInterval(() => {
              const p = playerRef.current;
              if (!p) return;
              setCur(p.getCurrentTime());
              setDur(p.getDuration());
            }, 250);
          },
          onStateChange: (ev) => {
            const S = window.YT?.PlayerState;
            if (!S) return;
            setPlaying(ev.data === S.PLAYING);
            setEnded(ev.data === S.ENDED);
          },
        },
      });
    });

    return () => {
      cancelado = true;
      if (intervalo) window.clearInterval(intervalo);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [videoId]);

  const togglePlay = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (ended) {
      p.seekTo(0, true);
      p.playVideo();
    } else if (playing) p.pauseVideo();
    else p.playVideo();
  }, [playing, ended]);

  const toggleMute = () => {
    const p = playerRef.current;
    if (!p) return;
    if (p.isMuted()) {
      p.unMute();
      setMuted(false);
    } else {
      p.mute();
      setMuted(true);
    }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = Number(e.target.value);
    playerRef.current?.seekTo(t, true);
    setCur(t);
  };

  const fullscreen = () => wrapRef.current?.requestFullscreen?.();

  const pct = dur > 0 ? (cur / dur) * 100 : 0;

  return (
    <div
      ref={wrapRef}
      className="relative w-full overflow-hidden rounded-[12px] bg-black aspect-video group"
    >
      {/* El div que YT reemplaza por el iframe */}
      <div ref={hostRef} className="absolute inset-0 w-full h-full" />

      {/* Capa para captar clics (play/pause al tocar el video) */}
      <button
        type="button"
        aria-label={playing ? 'Pausar' : 'Reproducir'}
        onClick={togglePlay}
        className="absolute inset-0 w-full h-full"
      />

      {/* Botón central play/replay cuando está pausado o terminó */}
      {listo && (!playing || ended) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-violet-600/90 text-white flex items-center justify-center shadow-lg">
            {ended ? <RotateCcw className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
          </div>
        </div>
      )}

      {!listo && (
        <div className="absolute inset-0 flex items-center justify-center text-white/70 text-sm">
          Cargando video…
        </div>
      )}

      {/* Barra de controles propia */}
      <div
        className={cn(
          'absolute inset-x-0 bottom-0 px-3 pb-2 pt-6 bg-gradient-to-t from-black/80 to-transparent',
          'opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity',
          (!playing || ended) && 'opacity-100',
        )}
      >
        <input
          type="range"
          min={0}
          max={dur || 0}
          step={0.1}
          value={cur}
          onChange={seek}
          aria-label="Progreso"
          className="w-full h-1.5 cursor-pointer accent-violet-500"
          style={{
            background: `linear-gradient(to right, #8b5cf6 ${pct}%, rgba(255,255,255,0.3) ${pct}%)`,
          }}
        />
        <div className="flex items-center gap-3 mt-1.5 text-white">
          <button type="button" onClick={togglePlay} aria-label="Play/Pausa" className="hover:text-violet-300">
            {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button type="button" onClick={toggleMute} aria-label="Silenciar" className="hover:text-violet-300">
            {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <span className="text-xs tabular-nums">
            {fmt(cur)} / {fmt(dur)}
          </span>
          <span className="flex-1 truncate text-xs text-white/70 px-1" title={title}>
            {title}
          </span>
          <button type="button" onClick={fullscreen} aria-label="Pantalla completa" className="hover:text-violet-300">
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
