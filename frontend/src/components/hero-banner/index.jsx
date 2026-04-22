import { useRef, useEffect, useState } from 'react';
import { SLIDES } from './slides.config';

function getActiveOverlay(time, overlays) {
  return overlays.find((o) => time >= o.range[0] && time < o.range[1]) ?? null;
}

export default function HeroBanner({ ctaText = 'Explore Products', ctaHref = '/products/flat-products' }) {
  const videoRefs  = [useRef(null), useRef(null), useRef(null)];
  const [current, setCurrent] = useState(0);
  const [overlay, setOverlay] = useState(null);
  const [visible, setVisible] = useState(false);

  /* Play current, pause others */
  useEffect(() => {
    SLIDES.forEach((_, i) => {
      const v = videoRefs[i].current;
      if (!v) return;
      if (i === current) { v.currentTime = 0; v.play().catch(() => {}); }
      else               { v.pause(); v.currentTime = 0; }
    });
    setOverlay(null);
    setVisible(false);
  }, [current]); // eslint-disable-line

  /* timeupdate — native event, no rAF loop needed */
  function handleTimeUpdate(i) {
    if (i !== current) return;
    const v = videoRefs[i].current;
    if (!v) return;
    const active = getActiveOverlay(v.currentTime, SLIDES[i].overlays);
    setOverlay(active ?? null);
    if (!visible && v.currentTime > 0) setVisible(true);
  }

  const handleEnded = () => setCurrent((c) => (c + 1) % SLIDES.length);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#0a0a0a]">

      {/* Videos */}
      {SLIDES.map((slide, i) => (
        <video
          key={slide.src}
          ref={videoRefs[i]}
          src={slide.src}
          preload={i === 0 ? 'metadata' : 'none'}
          poster="/hero-poster.webp"
          muted
          playsInline
          onTimeUpdate={() => handleTimeUpdate(i)}
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
      <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none" style={{
        background: 'linear-gradient(to top, #0a0a0a 0%, transparent 100%)',
      }} />
      <div className="absolute top-0 left-0 right-0 h-28 pointer-events-none" style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%)',
      }} />

      {/* Text overlays — CSS transitions, no framer-motion */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{ opacity: overlay ? 1 : 0, transition: 'opacity 0.6s ease' }}
      >
        {overlay && (overlay.cta ? (
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
                className="pointer-events-auto mt-2"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '12px 28px', borderRadius: 5, background: 'rgba(201,162,39,0.15)',
                  border: '1px solid rgba(201,162,39,0.5)',
                  fontSize: 13, fontWeight: 700, letterSpacing: '0.05em',
                  color: '#fff', textDecoration: 'none',
                }}
              >
                {ctaText}
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M2.5 6.5H10.5M10.5 6.5L7 3M10.5 6.5L7 10" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        ) : overlay.dir === 'right' ? (
          <div className="absolute bottom-28 left-0 right-0">
            <div className="max-w-[1400px] mx-auto flex justify-end" style={{ paddingLeft: '6rem', paddingRight: '6rem' }}>
              <div className="max-w-lg text-right">
                <p className="text-[#C9A227] text-[11px] font-bold tracking-[0.28em] uppercase mb-3">{SLIDES[current].brand}</p>
                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-tight mb-4">{overlay.text}</h2>
                {overlay.sub && <p className="text-white/55 text-base leading-relaxed">{overlay.sub}</p>}
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute bottom-28 left-0 right-0">
            <div className="max-w-[1400px] mx-auto" style={{ paddingLeft: '6rem', paddingRight: '6rem' }}>
              <div className="max-w-lg text-left">
                <p className="text-[#C9A227] text-[11px] font-bold tracking-[0.28em] uppercase mb-3">{SLIDES[current].brand}</p>
                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-tight mb-4">{overlay.text}</h2>
                {overlay.sub && <p className="text-white/55 text-base leading-relaxed max-w-md">{overlay.sub}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20 pointer-events-none">
        {SLIDES.map((_, i) => (
          <div key={i} className="rounded-full transition-all duration-500" style={{
            width: i === current ? 28 : 8, height: 6,
            background: i === current ? '#C9A227' : 'rgba(255,255,255,0.25)',
          }} />
        ))}
      </div>

    </section>
  );
}
