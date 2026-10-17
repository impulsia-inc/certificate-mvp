import React from 'react';
import Image from 'next/image';
import { CertificateSearchInput } from '@/components/public/home/CertificateSearchInput';

export function HeroSection() {
  return (
    <section className="relative w-full bg-ivory overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center py-12 lg:py-20">
          {/* ─── Left Column: Text + Search ─── */}
          <div className="order-2 lg:order-1 space-y-6 lg:space-y-8 animate-fade-in-up">
            {/* Main heading */}
            <h1 className="font-serif font-medium text-content-titleMobile lg:text-content-titleDesktop text-[28px] leading-[36px] tracking-hero-mobile lg:text-[56px] lg:leading-[64px] lg:tracking-hero-desktop text-balance">
              Certificamos el valor que perdura.
            </h1>

            {/* Description */}
            <p className="text-[14px] lg:text-[16px] leading-relaxed text-content-body font-mobile lg:font-sans max-w-lg">
              Laboratorio de precisión y certificación soberana para diamantes, gemas de color y alta joyería. Dictámenes colegiados inmutables con rigor microscópico y reconocimiento internacional.
            </p>

            {/* Search input */}
            <div className="pt-2">
              <CertificateSearchInput />
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-6 lg:gap-10 pt-4">
              <div className="space-y-0.5">
                <p className="text-[22px] lg:text-[26px] font-semibold font-sans text-content-titleDesktop tracking-tight">
                  99.98%
                </p>
                <p className="text-[10px] lg:text-[11px] font-semibold tracking-[0.12em] uppercase text-content-muted font-sans">
                  Precisión Gemológica
                </p>
              </div>

              <div className="w-px h-8 bg-[#E9E8E3] hidden sm:block" />

              <div className="space-y-0.5">
                <p className="text-[22px] lg:text-[26px] font-semibold font-sans text-content-titleDesktop tracking-tight">
                  50.000+
                </p>
                <p className="text-[10px] lg:text-[11px] font-semibold tracking-[0.12em] uppercase text-content-muted font-sans">
                  Gemas Certificadas
                </p>
              </div>

              <div className="w-px h-8 bg-[#E9E8E3] hidden sm:block" />

              <div className="space-y-0.5 flex items-center gap-3">
                <p className="text-[14px] lg:text-[16px] font-semibold font-sans text-content-titleDesktop tracking-tight">
                  ISO 17025
                </p>
                <p className="text-[10px] lg:text-[11px] font-semibold tracking-[0.12em] uppercase text-content-muted font-sans">
                  Certificaciones
                </p>
              </div>
            </div>
          </div>

          {/* ─── Right Column: Images ─── */}
          <div className="order-1 lg:order-2 relative animate-fade-in">
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              {/* Main large image - diamond */}
              <div className="col-span-2 relative aspect-[16/10] rounded-xl overflow-hidden shadow-elevation-lg">
                <Image
                  src="/demo/jewelry/jewel-001.jpg"
                  alt="Diamante certificado por F&N Gemology"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>

              {/* Bottom left - certificate preview card */}
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-elevation-md bg-surface-panel">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <p className="text-[9px] lg:text-[10px] tracking-[0.15em] uppercase text-content-onDarkSec font-sans mb-1">
                    Certificación Verificada
                  </p>
                  <p className="text-[11px] lg:text-[13px] font-semibold text-white font-sans">
                    REF: FYN-26-000001
                  </p>
                  <div className="mt-2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gold/20 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#AF9052" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Bottom right - necklace */}
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-elevation-md">
                <Image
                  src="/demo/jewelry/jewel-003.jpg"
                  alt="Joya certificada - Collar de diamantes"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <p className="text-[9px] lg:text-[10px] tracking-[0.1em] uppercase text-white/80 font-sans">
                    Diamantes y Gemas C/E: 8.45ctw
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
