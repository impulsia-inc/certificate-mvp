'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShieldCheck, Lock, CheckCircle2, QrCode } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerificationSearchBarProps {
  initialValue?: string;
  className?: string;
  showBadges?: boolean;
}

export function VerificationSearchBar({
  initialValue = '',
  className,
  showBadges = true,
}: VerificationSearchBarProps) {
  const [reference, setReference] = useState(initialValue);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = reference.trim().toUpperCase();

    if (!trimmed) {
      setError('Por favor, ingresa el número de referencia del certificado.');
      return;
    }

    // Format validation: FYN-XX-XXXXXX
    const pattern = /^FYN-\d{2}-\d{6}$/;
    if (!pattern.test(trimmed)) {
      setError('Formato inválido. Ejemplo de referencia: FYN-26-000001');
      return;
    }

    setError('');
    router.push(`/verificar/${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className={cn('w-full max-w-2xl mx-auto space-y-4', className)}>
      <form onSubmit={handleSearch} className="relative flex flex-col sm:flex-row items-stretch gap-2.5">
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-content-placeholder">
            <Search className="w-5 h-5 text-gold" />
          </div>
          <input
            type="text"
            value={reference}
            onChange={(e) => {
              setReference(e.target.value);
              if (error) setError('');
            }}
            placeholder="Ej. FYN-26-000001"
            className="w-full h-13 pl-12 pr-12 text-base font-mono uppercase bg-white border border-[#E9E8E3] rounded-lg shadow-elevation-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold placeholder:text-content-placeholder text-content-titleDesktop tracking-wider transition-all"
            aria-label="Número de Referencia del Certificado"
            autoComplete="off"
            spellCheck={false}
          />
          {reference && (
            <button
              type="button"
              onClick={() => setReference('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-content-muted hover:text-content-titleDesktop px-1 py-0.5 rounded transition-colors"
            >
              Borrar
            </button>
          )}
        </div>

        <button
          type="submit"
          className="h-13 px-7 inline-flex items-center justify-center gap-2 bg-brandBlue-action hover:bg-brandBlue-action/90 active:scale-[0.99] text-white text-[13px] font-semibold tracking-[0.1em] uppercase font-sans rounded-lg shadow-btn-login transition-all shrink-0 cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-gold-champagne" />
          <span>Buscar</span>
        </button>
      </form>

      {error && (
        <p className="text-[13px] text-red-600 font-sans pl-1 animate-fade-in flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
          {error}
        </p>
      )}

      {showBadges && (
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-[11px] text-content-muted font-sans">
          <div className="inline-flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-gold" />
            <span>Certificación SSL 256-Bit</span>
          </div>
          <span className="text-stone-300 hidden sm:inline">•</span>
          <div className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-gold" />
            <span>Firma Inmutable</span>
          </div>
          <span className="text-stone-300 hidden sm:inline">•</span>
          <div className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700 font-medium">Registro Central Activo</span>
          </div>
        </div>
      )}
    </div>
  );
}
