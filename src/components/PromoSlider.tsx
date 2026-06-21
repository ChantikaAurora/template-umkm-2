'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Promo {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  link?: string | null;
}

interface PromoSliderProps {
  promos: Promo[];
}

export default function PromoSlider({ promos }: PromoSliderProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const prev = useCallback(() => setCurrent(c => (c - 1 + promos.length) % promos.length), [promos.length]);
  const next = useCallback(() => setCurrent(c => (c + 1) % promos.length), [promos.length]);

  useEffect(() => {
    if (paused || promos.length <= 1) return;
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [next, paused, promos.length]);

  if (!promos.length) return null;

  const promo = promos[current];
  const Wrapper = promo.link ? Link : 'div';
  const wrapperProps = promo.link ? { href: promo.link } : {};

  return (
    <section className="bg-slate-100 py-3 px-4">
      <div className="max-w-6xl mx-auto relative">
        <div
          className="overflow-hidden rounded-2xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* @ts-ignore */}
          <Wrapper {...wrapperProps} className="block">
            <div className="relative h-40 sm:h-52 md:h-64 bg-gradient-to-r from-violet-600 to-violet-800 rounded-2xl overflow-hidden group cursor-pointer">
              {/* Background image */}
              {promo.image && (
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-300"
                />
              )}
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-900/80 to-transparent" />
              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-12">
                <p className="text-violet-300 text-xs font-semibold uppercase tracking-widest mb-2">Promo Spesial</p>
                <h3 className="text-white text-xl md:text-3xl font-extrabold leading-tight max-w-lg mb-2">
                  {promo.title}
                </h3>
                {promo.description && (
                  <p className="text-violet-100 text-sm md:text-base max-w-sm line-clamp-2">
                    {promo.description}
                  </p>
                )}
                {promo.link && (
                  <span className="mt-3 inline-flex items-center text-sm font-semibold text-white/80 hover:text-white transition-colors">
                    Lihat Detail →
                  </span>
                )}
              </div>
              {/* Decorative circle */}
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-violet-500/20 rounded-full" />
              <div className="absolute -right-6 top-8 w-32 h-32 bg-violet-400/15 rounded-full" />
            </div>
          </Wrapper>
        </div>

        {/* Arrows */}
        {promos.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors z-10"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors z-10"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>

            {/* Dots */}
            <div className="flex justify-center gap-1.5 mt-3">
              {promos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current ? 'w-5 bg-violet-600' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
