import React from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative w-full bg-stone-50 pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-stone-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#C9A96E]/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-600 text-xs font-medium tracking-wide uppercase mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="w-2 h-2 rounded-full bg-[#C9A96E]"></span>
            Plataforma Oficial
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-stone-900 tracking-tight text-balance leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Certificación y verificación <span className="text-stone-400 italic">de joyas</span>
          </h1>
          
          <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 text-balance">
            Consulta la información asociada a tu certificado utilizando su número de referencia para garantizar su autenticidad.
          </p>
          
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Button asChild size="lg" className="w-full sm:w-auto h-14 px-8 bg-stone-900 hover:bg-stone-800 text-white rounded-full font-medium text-base group">
              <Link href="/verificar">
                Consultar certificado
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
