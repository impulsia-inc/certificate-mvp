import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-footer text-white">
      {/* Upper section */}
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-16">
          {/* Logo block */}
          <div className="shrink-0">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white/10 shrink-0">
                <Image
                  src="/uploads/fyn_logo.png"
                  alt="F&N Gemology Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-semibold tracking-[0.12em] text-white font-sans leading-tight">
                  F&N GEMOLOGY
                </span>
                <span className="text-[9px] tracking-[0.18em] text-content-onDarkSec font-sans uppercase leading-tight">
                  Laboratorio & Certificación
                </span>
              </div>
            </Link>
          </div>

          {/* Location & contact blocks */}
          <div className="flex flex-col sm:flex-row gap-8 lg:gap-16">
            {/* Sede Cali */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-semibold tracking-[0.18em] uppercase text-content-onDarkSec font-sans">
                Sede Principal: Cali
              </h4>
              <div className="space-y-2">
                <p className="flex items-start gap-2 text-[13px] text-gray-300 font-sans leading-relaxed">
                  <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  Calle 25 Norte # 5N - 43<br />Cali, Colombia
                </p>
                <p className="flex items-center gap-2 text-[13px] text-gray-300 font-sans">
                  <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                  (602) 661-0964
                </p>
                <p className="flex items-center gap-2 text-[13px] text-gray-300 font-sans">
                  <Mail className="w-3.5 h-3.5 text-gold shrink-0" />
                  ventas@dennisjoyeros.com
                </p>
              </div>
            </div>

            {/* Enlaces y Acceso */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-semibold tracking-[0.18em] uppercase text-content-onDarkSec font-sans">
                Servicios & Consultas
              </h4>
              <ul className="space-y-2 text-[13px] font-sans">
                <li>
                  <Link
                    href="/verificar"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Verificar Certificado
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#servicios"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Dictamen Gemológico
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="text-content-onDarkSec hover:text-white transition-colors text-[12px]"
                  >
                    Acceso Pericial / Admin
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 lg:px-8 py-5 flex flex-col lg:flex-row justify-between items-center gap-4 text-[11px] text-content-onDarkSec font-sans">
          <p>
            © {currentYear} F&N Gemology. Todos los derechos reservados.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-center">
            <Link
              href="#"
              className="hover:text-white transition-colors tracking-wide uppercase"
            >
              Protección & Secretismo Pericial
            </Link>
            <Link
              href="#"
              className="hover:text-white transition-colors tracking-wide uppercase"
            >
              Términos de Certificación
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
