import React from 'react';
import { MapPin, Microscope, ShieldCheck, FlaskConical } from 'lucide-react';

const capabilities = [
  'Espectroscopía Raman y FTIR avanzada',
  'Microscopía 60x con iluminación UV',
  'Fluorescencia y catodoluminiscencia',
  'Certificaciones bajo norma ISO 17025',
];

const locations = [
  { city: 'Cali, Colombia', label: 'Sede principal' },
  { city: 'Valle del Cauca', label: 'Cobertura regional' },
];

export function LaboratorioSection() {
  return (
    <section id="laboratorio" className="w-full bg-surface-panel py-16 lg:py-24 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* ─── Left Column: Text ─── */}
          <div className="space-y-6 lg:space-y-8">
            <h2 className="font-serif font-medium text-white text-[24px] leading-[32px] lg:text-[40px] lg:leading-[48px] tracking-hero-mobile lg:tracking-hero-desktop text-balance">
              La ciencia de lo eterno al servicio de la alta tasación.
            </h2>

            <p className="text-[14px] lg:text-[15px] text-content-onDarkSec font-sans leading-relaxed max-w-lg">
              Fundada bajo la excelencia gemológica y la independencia del mercado asegurador, F&N es y será como un puente entre la ciencia y el arte. Somos la confianza en la evaluación de piezas para instituciones.
            </p>

            <p className="text-[13px] lg:text-[14px] text-content-onDarkSec/80 font-sans leading-relaxed max-w-lg">
              Nuestro laboratorio en Cali opera con equipos de última generación para espectroscopía, microscopía avanzada y documentación fotográfica forense, garantizando informes irrefutables de trazabilidad total para instituciones.
            </p>

            {/* Capability tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {capabilities.map((cap) => (
                <span
                  key={cap}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-md text-[10px] lg:text-[11px] tracking-[0.08em] text-white/70 font-sans"
                >
                  <FlaskConical className="w-3 h-3 text-gold" />
                  {cap}
                </span>
              ))}
            </div>

            {/* Locations */}
            <div className="flex flex-wrap gap-6 pt-4">
              {locations.map((loc) => (
                <div key={loc.city} className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold" />
                  <div>
                    <p className="text-[13px] font-semibold text-white font-sans">{loc.city}</p>
                    <p className="text-[10px] tracking-[0.1em] uppercase text-content-onDarkSec font-sans">{loc.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Right Column: Visual ─── */}
          <div className="relative">
            {/* Equipment card */}
            <div className="relative bg-surface-overlay rounded-xl overflow-hidden border border-white/10 shadow-elevation-xl">
              {/* Header badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gold/20 backdrop-blur-sm rounded-md text-[9px] lg:text-[10px] font-semibold tracking-[0.12em] uppercase text-gold font-sans">
                  <Microscope className="w-3 h-3" />
                  Examen Analítico – 60x
                </span>
              </div>

              {/* Visual placeholder / abstract lab visualization */}
              <div className="aspect-[4/3] lg:aspect-[16/11] bg-gradient-to-br from-surface-overlay via-surface-panel to-surface-overlay flex items-center justify-center relative">
                {/* Abstract grid pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(175,144,82,0.3) 1px, transparent 0)',
                    backgroundSize: '20px 20px',
                  }} />
                </div>

                {/* Center icon */}
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <ShieldCheck className="w-10 h-10 lg:w-12 lg:h-12 text-gold/60" />
                  </div>
                  <p className="text-[11px] tracking-[0.15em] uppercase text-content-onDarkSec font-sans">
                    Inspección en detalle microsistema
                  </p>
                </div>
              </div>

              {/* Bottom label */}
              <div className="px-6 py-4 border-t border-white/10">
                <p className="text-[10px] tracking-[0.12em] uppercase text-content-onDarkSec font-sans">
                  Protocolo de examen analítico bajo estándares F&N
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
