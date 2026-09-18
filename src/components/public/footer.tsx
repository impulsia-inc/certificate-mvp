import React from "react";
import Link from "next/link";
import { ShieldCheck, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-950 text-stone-300 py-16 border-t border-stone-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="space-y-4">
            <Link href="/" className="inline-block relative">
              <span className="text-3xl font-light tracking-[0.2em] text-white font-serif">FYN</span>
              <span className="absolute -bottom-1 left-0 w-8 h-px bg-[#C9A96E]"></span>
            </Link>
            <p className="text-stone-400 mt-4 max-w-xs text-sm leading-relaxed">
              Certificación y Verificación de Joyas.
              Garantizando la autenticidad y calidad de piezas exclusivas con estándares internacionales.
            </p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6 uppercase tracking-wider text-sm">Enlaces Rápidos</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/verificar" className="hover:text-white transition-colors flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C9A96E]" />
                  Verificar Certificado
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Acceso Administrativo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6 uppercase tracking-wider text-sm">Aviso Legal</h4>
            <div className="bg-stone-900/50 p-4 rounded-lg border border-stone-800 text-sm text-stone-400">
              <p>
                <strong>Nota:</strong> Esta plataforma es una demostración. Los certificados mostrados son ficticios y no tienen validez legal.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-500">
          <p>© {currentYear} FYN Jewelry. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Términos y Condiciones</Link>
            <Link href="#" className="hover:text-white transition-colors">Política de Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
