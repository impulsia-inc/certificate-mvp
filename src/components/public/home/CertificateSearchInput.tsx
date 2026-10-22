'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export function CertificateSearchInput() {
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = reference.trim().toUpperCase();

    if (!trimmed) {
      setError('Ingresa un número de referencia.');
      return;
    }

    // Basic format validation: FYN-XX-XXXXXX
    const refPattern = /^FYN-\d{2}-\d{6}$/;
    if (!refPattern.test(trimmed)) {
      setError('Formato inválido. Ejemplo: FYN-26-000001');
      return;
    }

    setError('');
    router.push(`/verificar/${trimmed}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="relative flex items-center">
        <div className="absolute left-3.5 pointer-events-none">
          <Search className="w-4 h-4 text-content-placeholder" />
        </div>
        <input
          type="text"
          value={reference}
          onChange={(e) => {
            setReference(e.target.value);
            if (error) setError('');
          }}
          placeholder="Ej. FYN-26-000001"
          className="w-full h-11 pl-10 pr-4 text-[14px] font-sans text-content-titleDesktop bg-white border border-[#E9E8E3] rounded-md focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold placeholder:text-content-placeholder transition-all"
          aria-label="Número de referencia del certificado"
        />
      </div>
      {error && (
        <p className="mt-2 text-[12px] text-red-600 font-sans">{error}</p>
      )}
    </form>
  );
}
