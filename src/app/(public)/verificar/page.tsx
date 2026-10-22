import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FileSearch, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';
import { VerificationSearchBar } from '@/components/public/verification-search-bar';

export const metadata: Metadata = {
  title: 'Consultar Certificado | F&N Gemology',
  description:
    'Valide la autenticidad de su certificado gemológico y pericial emitido por F&N Gemology con su número de referencia único.',
};

const DEMO_REFERENCES = [
  { ref: 'FYN-26-000001', name: 'Anillo Diamante Solitario 0.35ct' },
  { ref: 'FYN-26-000003', name: 'Pulsera Esmeralda Colombiana 1.2ct' },
  { ref: 'FYN-26-000004', name: 'Aretes Zafiro Azul 0.8ct' },
];

export default function VerificarPage() {
  return (
    <div className="flex-1 bg-ivory py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        {/* Header Block */}
        <div className="text-center space-y-4 mb-10 lg:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E9E8E3] shadow-elevation-sm mx-auto mb-2">
            <div className="relative w-5 h-5 shrink-0">
              <Image
                src="/uploads/fyn_logo.png"
                alt="F&N Gemology"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gold font-sans">
              Validación Soberana de Certificaciones
            </span>
          </div>

          <h1 className="font-serif font-medium text-[30px] leading-[38px] lg:text-[46px] lg:leading-[54px] tracking-title-desktop text-content-titleDesktop text-balance">
            Verificación Oficial de Certificado
          </h1>

          <p className="text-[14px] lg:text-[16px] text-content-body font-sans max-w-xl mx-auto leading-relaxed">
            Ingrese el número de referencia asignado a su joya o gema para consultar su dictamen
            gemológico inmutable y descargar el certificado pericial oficial.
          </p>
        </div>

        {/* Card Buscador */}
        <div className="bg-white rounded-2xl border border-[#E9E8E3] p-6 lg:p-10 shadow-elevation-md space-y-8">
          <VerificationSearchBar showBadges={true} />

          {/* Referencias Rápidas de Demostración */}
          <div className="pt-6 border-t border-[#E9E8E3] space-y-3">
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-content-muted font-sans">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Referencias de demostración para consulta:</span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {DEMO_REFERENCES.map((item) => (
                <Link
                  key={item.ref}
                  href={`/verificar/${item.ref}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-alt hover:bg-surface-sec border border-[#E9E8E3] text-[12px] font-mono text-content-titleDesktop hover:border-gold/40 transition-all font-medium"
                >
                  <span className="text-gold font-semibold">{item.ref}</span>
                  <span className="text-content-muted font-sans text-[11px] hidden sm:inline">
                    — {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Ayuda y Soporte */}
          <div className="bg-ivory rounded-xl p-4 border border-[#E9E8E3] flex items-start gap-3 text-[12px] text-content-body font-sans leading-relaxed">
            <HelpCircle className="w-4 h-4 text-gold shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-content-titleDesktop">
                ¿Dónde encontrar su número de referencia?
              </p>
              <p className="text-content-muted text-[11px] mt-0.5">
                Revise la esquina superior derecha de su tarjeta física o dictamen emitido por F&N
                Gemology. El formato estándar corresponde a{' '}
                <span className="font-mono text-content-titleDesktop">FYN-YY-NNNNNN</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
