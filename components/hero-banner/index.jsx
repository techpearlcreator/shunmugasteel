'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SLIDES } from './slides.config';

/* ── Animation variants ──────────────────────────────────── */
function getVariants(dir) {
  const x = dir === 'left' ? -60 : dir === 'right' ? 60 : 0;
  const y = dir === 'center' ? 28 : 0;
  return {
    hidden:  { opacity: 0, x, y, filter: 'blur(8px)' },
    visible: {
      opacity: 1, x: 0, y: 0, filter: 'blur(0px)',
      transition: { duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    exit: {
      opacity: 0, x: x * -0.4, y: y * -0.4, filter: 'blur(5px)',
      transition: { duration: 0.45, ease: 'easeIn' },
    },
  };
}

function getActiveOverlay(time, overlays) {
  return overlays.find((o) => time >= o.range[0] && time < o.range[1]) ?? null;
}

/* ── Component ───────────────────────────────────────────── */
export default function HeroBanner({ ctaText = 'Pre-Order Today', ctaHref = '#contact' }) {
  const videoRefs  = [useRef(null), useRef(null), useRef(null)];
  const rafRef     = useRef(null);
  const lastKeyRef = useRef('none');

  const [current, setCurrent] = useState(0);
  const [loaded,  setLoaded]  = useState([false, false, false]);
  const [overlay, setOverlay] = useState(null);

  const markLoaded = (i) =>
    setLoaded((prev) => { const n = [...prev]; n[i] = true; return n; });

  /* Play current slide video, reset others */
  useEffect(() => {
    SLIDES.forEach((_, i) => {
      const v = videoRefs[i].current;
      if (!v) return;
      if (i === current) {
        v.currentTime = 0;
        v.play().catch(() => {});
      } else {
        v.pause();
        v.currentTime = 0;
      }
    });
    setOverlay(null);
    lastKeyRef.current = 'none';
  }, [current]); // eslint-disable-line

  /* rAF loop — checks currentTime and updates overlay */
  const tick = useCallback(() => {
    const video = videoRefs[current].current;
    if (video) {
      const active = getActiveOverlay(video.currentTime, SLIDES[current].overlays);
      const key    = active ? `${current}-${active.text}` : 'none';
      if (key !== lastKeyRef.current) {
        lastKeyRef.current = key;
        setOverlay(active);
      }
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [current]); // eslint-disable-line

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [tick]);

  /* Advance to next slide when video ends */
  const handleEnded = () => setCurrent((c) => (c + 1) % SLIDES.length);

  const isReady    = loaded[0];
  const overlayKey = overlay ? `${current}-${overlay.text}` : `${current}-none`;

  return (
    <>
      {/* Loading */}
      <AnimatePresence>
        {!isReady && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col items-center justify-center"
          >
            <div className="w-16 h-16 bg-[#C9A227] flex items-center justify-center rounded-sm font-black text-[#0a0a0a] text-2xl mb-8 animate-pulse">
              SS
            </div>
            <p className="text-white/30 text-xs tracking-[0.3em] uppercase">Loading…</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="relative w-full h-screen overflow-hidden bg-[#0a0a0a]">

        {/* Videos */}
        {SLIDES.map((slide, i) => (
          <video
            key={slide.src}
            ref={videoRefs[i]}
            src={slide.src}
            preload={i === 0 ? 'auto' : 'metadata'}
            muted
            playsInline
            onCanPlay={() => markLoaded(i)}
            onEnded={i === current ? handleEnded : undefined}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity:    i === current ? 1 : 0,
              transition: 'opacity 0.7s ease',
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(10,10,10,0.80) 100%)',
        }} />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none" style={{
          background: 'linear-gradient(to top, #0a0a0a 0%, transparent 100%)',
        }} />
        {/* Top fade */}
        <div className="absolute top-0 left-0 right-0 h-28 pointer-events-none" style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%)',
        }} />

        {/* Text overlays */}
        <AnimatePresence mode="wait">
          {isReady && overlay && (
            <motion.div
              key={overlayKey}
              variants={getVariants(overlay.dir)}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute inset-0 pointer-events-none z-10"
            >
              {overlay.cta ? (
                /* ── CTA: dead-center ── */
                <div className="absolute inset-0 flex items-center justify-center px-10 lg:px-16">
                  <div className="flex flex-col items-center text-center gap-5">
                    <p className="text-[#C9A227] text-[11px] font-bold tracking-[0.28em] uppercase">
                      {SLIDES[current].brand}
                    </p>
                    <h2 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white tracking-tighter leading-none">
                      {overlay.text}
                    </h2>
                    <div className="flex items-center gap-3 max-w-sm">
                      <div style={{ width: 32, height: 1, background: '#C9A227', flexShrink: 0 }} />
                      <p className="text-white/65 text-sm tracking-wide leading-relaxed">
                        50 years of quality. A legacy forged in steel.
                      </p>
                    </div>
                    <a
                      href={ctaHref}
                      className="glass-btn-gold pointer-events-auto mt-2"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 10,
                        padding: '12px 28px', borderRadius: 5,
                        fontSize: 13, fontWeight: 700, letterSpacing: '0.05em',
                        color: '#fff', textDecoration: 'none',
                      }}
                    >
                      <span style={{ position: 'relative', zIndex: 1 }}>{ctaText}</span>
                      <svg style={{ position: 'relative', zIndex: 1 }} width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M2.5 6.5H10.5M10.5 6.5L7 3M10.5 6.5L7 10" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  </div>
                </div>

              ) : overlay.dir === 'right' ? (
                /* ── Right: bottom-right ── */
                <div className="absolute bottom-28 left-0 right-0">
                  <div className="max-w-[1400px] mx-auto flex justify-end" style={{ paddingLeft: '6rem', paddingRight: '6rem' }}>
                    <div className="max-w-lg text-right">
                      <p className="text-[#C9A227] text-[11px] font-bold tracking-[0.28em] uppercase mb-3">
                        {SLIDES[current].brand}
                      </p>
                      <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-tight mb-4">
                        {overlay.text}
                      </h2>
                      {overlay.sub && (
                        <p className="text-white/55 text-base leading-relaxed">{overlay.sub}</p>
                      )}
                    </div>
                  </div>
                </div>

              ) : (
                /* ── Left: bottom-left ── */
                <div className="absolute bottom-28 left-0 right-0">
                  <div className="max-w-[1400px] mx-auto" style={{ paddingLeft: '6rem', paddingRight: '6rem' }}>
                    <div className="max-w-lg text-left">
                      <p className="text-[#C9A227] text-[11px] font-bold tracking-[0.28em] uppercase mb-3">
                        {SLIDES[current].brand}
                      </p>
                      <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-tight mb-4">
                        {overlay.text}
                      </h2>
                      {overlay.sub && (
                        <p className="text-white/55 text-base leading-relaxed max-w-md">{overlay.sub}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Slide progress dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20 pointer-events-none">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-500"
              style={{
                width:      i === current ? 28 : 8,
                height:     6,
                background: i === current ? '#C9A227' : 'rgba(255,255,255,0.25)',
              }}
            />
          ))}
        </div>

      </section>
    </>
  );
}
