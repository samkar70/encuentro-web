'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Play, Pause } from 'lucide-react';
import { DailyVerse } from '@/components/DailyVerse';
import { PsalmsMastery } from '@/components/PsalmsMastery';
import { DiscipleshipJourney } from '@/components/DiscipleshipJourney';
import { MoodBible } from '@/components/MoodBible';
import { PhotoSegment } from '@/components/PhotoSegment';
import { RadioPlayer } from '@/components/RadioPlayer';

interface PhotoData {
  url_foto: string;
  seccion: string;
  titulo?: string;
}

export default function Home() {
  const [heroMedia, setHeroMedia] = useState<string | null>(null);
  const [photos, setPhotos] = useState<PhotoData[]>([]);

  // --- AUDIO: fuente única de verdad ---
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [streamTitle, setStreamTitle] = useState<string>('');

  // --- Mini-player: visible cuando el hero sale de pantalla ---
  const heroRef = useRef<HTMLElement | null>(null);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);

  // Carga de fotos (un solo fetch para todo)
  useEffect(() => {
    fetch('/api/photos')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPhotos(data);
          const hero = data.find((f: PhotoData) => f.seccion.toLowerCase() === 'hero');
          if (hero) setHeroMedia(hero.url_foto);
        }
      })
      .catch(err => console.error("Error al cargar fotos:", err));
  }, []);

  // Escuchar señal pause-radio (emitida por DailyVerse / MoodBible)
  useEffect(() => {
    const handlePauseRadio = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };
    window.addEventListener('pause-radio', handlePauseRadio);
    return () => window.removeEventListener('pause-radio', handlePauseRadio);
  }, []);

  // Metadata del streaming (Zeno.fm SSE)
  useEffect(() => {
    const mount = "akg9jodmss3uv";
    const eventSource = new EventSource(`https://api.zeno.fm/mounts/metadata/subscribe/${mount}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Zeno.fm suele enviar 'streamTitle' o 'title'
        const newTitle = data.streamTitle || data.title;
        if (newTitle) {
          setStreamTitle(newTitle);
        }
      } catch (err) {
        console.error("Error SSE metadata:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  // IntersectionObserver: mostrar mini-player cuando el hero sale de la vista
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowMiniPlayer(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.error("Error Radio:", err));
    }
    setIsPlaying(prev => !prev);
  };

  const getPhoto = (sectionName: string): PhotoData | null =>
    photos.find(p => p.seccion.toLowerCase() === sectionName.toLowerCase()) ?? null;

  const isHeroVideo = heroMedia ? /\.(mp4|webm|mov|ogg)($|\?)/i.test(heroMedia) : false;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col items-center relative overflow-x-hidden">

      {/* Elemento de audio — una sola instancia para todo el sitio */}
      <audio
        ref={audioRef}
        src="https://stream.zeno.fm/akg9jodmss3uv"
        preload="auto"
      />

      {/* ============================================================
          HERO — RADIO FIRST
          El primer impacto es el botón de Play de la radio.
          Todo el viewport está dedicado a invitar al usuario a escuchar.
      ============================================================ */}
      <header
        ref={heroRef}
        className="w-full relative h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Fondo: imagen o video dinámico desde la DB */}
        {heroMedia && (
          <>
            {isHeroVideo ? (
              <video
                src={heroMedia}
                autoPlay loop muted playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-25"
              />
            ) : (
              <Image
                src={heroMedia}
                alt="Encuentro Hero"
                fill
                priority
                className="object-cover opacity-25"
                sizes="100vw"
              />
            )}
          </>
        )}

        {/* Degradados cinemáticos */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/30 via-[#020617]/20 to-[#020617]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.05)_0%,_transparent_70%)]" />

        {/* Contenido central */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 gap-10">

          {/* Nombre del sitio */}
          <div>
            <h1 className="text-6xl md:text-[9rem] font-serif italic text-white tracking-tighter drop-shadow-2xl leading-none mb-3">
              Encuentro
            </h1>
            <p className="text-amber-500/70 text-[9px] md:text-[11px] font-black uppercase tracking-[0.5em] md:tracking-[0.7em]">
              Karla Perdomo • Palabra y Vida
            </p>
          </div>

          {/* Separador sutil */}
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

          {/* === BOTÓN PRINCIPAL DE RADIO === */}
          <div className="flex flex-col items-center gap-5">
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pausar radio' : 'Escuchar radio en vivo'}
              className={`group relative w-28 h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center transition-all duration-500 ${
                isPlaying
                  ? 'bg-amber-500 scale-95 shadow-[0_0_60px_rgba(245,158,11,0.5)]'
                  : 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:bg-amber-500 hover:scale-110 hover:shadow-[0_0_60px_rgba(245,158,11,0.4)] hover:border-transparent'
              }`}
            >
              {/* Ondas de pulso cuando está en vivo */}
              {isPlaying && (
                <>
                  <span className="absolute inset-0 rounded-full bg-amber-500/40 animate-ping" />
                  <span className="absolute -inset-4 rounded-full border border-amber-500/20 animate-pulse" />
                  <span className="absolute -inset-8 rounded-full border border-amber-500/10 animate-pulse delay-150" />
                </>
              )}

              {isPlaying
                ? <Pause size={44} fill="currentColor" className="text-black relative z-10" />
                : <Play  size={44} fill="currentColor" className="text-white group-hover:text-black transition-colors relative z-10 ml-2" />
              }
            </button>

            {/* Texto de estado */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-2.5">
                <span className={`h-2 w-2 rounded-full flex-shrink-0 ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-white/25'}`} />
                <span className="text-sm md:text-base font-black uppercase tracking-widest text-white/80">
                  {isPlaying ? (streamTitle || 'Transmitiendo En Vivo') : 'Escuchar En Vivo'}
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.35em] text-amber-500/55 font-bold">
                Radio · {streamTitle ? 'En Directo' : 'Palabra y Vida'}
              </span>
            </div>
          </div>
        </div>

        {/* Indicador de scroll hacia abajo */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-25 pointer-events-none">
          <span className="text-[9px] uppercase tracking-[0.4em] text-white">Descubrir más</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-white/60 to-transparent" style={{ animation: 'pulse 2s infinite' }} />
        </div>
      </header>

      {/* ============================================================
          CONTENIDO PRINCIPAL — debajo del fold
      ============================================================ */}
      <main className="w-full relative z-10 flex flex-col gap-8 md:gap-16 pb-20">
        <DailyVerse />

        <PhotoSegment sectionName="psalms" media={getPhoto('psalms')} />
        <PsalmsMastery />

        <PhotoSegment sectionName="discipleship" media={getPhoto('discipleship')} />
        <DiscipleshipJourney />

        <MoodBible />

        <PhotoSegment sectionName="moods" media={getPhoto('moods')} />
      </main>

      {/* Mini-player flotante: aparece solo cuando el hero sale de pantalla */}
      <RadioPlayer
        isPlaying={isPlaying}
        onToggle={togglePlay}
        visible={showMiniPlayer}
        streamTitle={streamTitle}
      />
    </div>
  );
}