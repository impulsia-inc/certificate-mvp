"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function VerificarPage() {
  const router = useRouter();
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!reference.trim()) {
      setError("Por favor ingresa un número de referencia.");
      return;
    }

    // Basic format validation could go here, e.g., FYN-xx-xxxxxx
    // But we'll just redirect and let the server component handle exact matches

    router.push(`/verificar/${encodeURIComponent(reference.trim())}`);
  };

  return (
    <div className="flex-1 flex items-center justify-center py-24 md:py-32 px-4 bg-stone-50">
      <div className="max-w-xl w-full">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-white border border-stone-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-[#C9A96E]" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-stone-900 tracking-tight mb-4">
            Verificar Certificado
          </h1>
          <p className="text-stone-500 text-lg max-w-md mx-auto text-balance">
            Ingresa el número de referencia de tu certificado para consultar su información.
          </p>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-2xl border border-stone-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="reference" className="text-sm font-medium text-stone-700">
                Número de Referencia
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                <Input
                  id="reference"
                  type="text"
                  placeholder="Ej. FYN-26-000001"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="pl-12 h-14 text-lg border-stone-200 focus-visible:ring-[#C9A96E] bg-stone-50/50"
                  autoComplete="off"
                  autoFocus
                />
              </div>
              {error && (
                <p className="text-rose-500 text-sm mt-2 font-medium">{error}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-stone-900 hover:bg-stone-800 text-white text-base rounded-xl"
            >
              <ShieldCheck className="w-5 h-5 mr-2" />
              Verificar certificado
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-stone-100 text-center">
            <p className="text-sm text-stone-500">
              ¿No encuentras tu número de referencia? <br />
              <span className="text-stone-400">Revisa la esquina superior derecha de tu documento físico.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
