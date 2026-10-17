import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, SearchX, HelpCircle } from 'lucide-react';
import { CertificateDetails } from '@/components/certificates/certificate-details';
import { VerificationSearchBar } from '@/components/public/verification-search-bar';
import { lookupCertificate } from '@/features/certificates/actions/certificate.actions';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ reference: string }>;
}): Promise<Metadata> {
  const { reference } = await params;
  const decodedRef = decodeURIComponent(reference || '').trim().toUpperCase();
  return {
    title: `Verificación ${decodedRef} | F&N Gemology`,
    description: `Consulta oficial y validación pericial de la certificación ${decodedRef} emitida por F&N Gemology.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function VerificarResultPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const decodedRef = decodeURIComponent(reference || '').trim().toUpperCase();

  const result = await lookupCertificate(decodedRef);

  return (
    <div className="w-full bg-ivory min-h-screen py-10 lg:py-16">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/verificar"
            className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-wide uppercase text-content-muted hover:text-content-titleDesktop transition-colors font-sans"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la búsqueda general</span>
          </Link>
        </div>

        {/* ─── 1. BUSCADOR SUPERIOR DE VERIFICACIÓN ─── */}
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-14 space-y-4">
          <span className="text-[10px] lg:text-[11px] font-semibold tracking-[0.2em] uppercase text-gold font-sans block">
            Laboratorio & Verificación Pericial
          </span>
          <h1 className="font-serif font-medium text-[26px] leading-[34px] lg:text-[38px] lg:leading-[46px] tracking-title-desktop text-content-titleDesktop text-balance">
            Verificación Oficial de Certificado Gemológico
          </h1>
          <p className="text-[13px] lg:text-[15px] text-content-body font-sans max-w-xl mx-auto leading-relaxed">
            Consulte y valide la autenticidad pericial de dictámenes de gemología y alta joyería emitidos por nuestro laboratorio.
          </p>

          <div className="pt-2">
            <VerificationSearchBar initialValue={decodedRef} showBadges={true} />
          </div>
        </div>

        {/* ─── 2. RESULTADO DE VERIFICACIÓN ─── */}
        {!result.success || !result.data ? (
          /* Estado No Encontrado */
          <div className="bg-white rounded-xl border border-[#E9E8E3] p-8 lg:p-12 shadow-elevation-sm max-w-2xl mx-auto text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200/80 flex items-center justify-center mx-auto text-amber-700">
              <SearchX className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif font-medium text-[22px] lg:text-[26px] text-content-titleDesktop">
                Certificado No Encontrado
              </h2>
              <p className="text-[14px] text-content-body font-sans leading-relaxed max-w-md mx-auto">
                No se encontró ningún registro oficial con la referencia{' '}
                <span className="font-mono font-semibold text-content-titleDesktop bg-surface-alt px-2 py-0.5 rounded border border-[#E9E8E3]">
                  {decodedRef}
                </span>
                .
              </p>
            </div>

            <div className="bg-surface-alt/70 p-4 rounded-lg border border-[#E9E8E3] text-left text-[12px] text-content-body font-sans space-y-2">
              <div className="flex items-center gap-2 font-semibold text-content-titleDesktop uppercase tracking-wider text-[11px]">
                <HelpCircle className="w-4 h-4 text-gold shrink-0" />
                <span>Recomendaciones de búsqueda:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-content-muted pl-1">
                <li>Verifique la referencia en la esquina superior del certificado físico (Ej. FYN-26-000001).</li>
                <li>Asegúrese de incluir los guiones y el año correspondiente.</li>
                <li>Si adquirió su pieza recientemente, el registro puede tardar hasta 24 horas en indexarse.</li>
              </ul>
            </div>

            <div className="pt-2">
              <Link
                href="/verificar"
                className="inline-flex items-center justify-center h-11 px-6 bg-brandBlue-action hover:bg-brandBlue-action/90 text-white text-[12px] font-semibold tracking-[0.1em] uppercase font-sans rounded-lg transition-all"
              >
                Nueva Consulta
              </Link>
            </div>
          </div>
        ) : (
          /* Certificado Encontrado (Activo o Revocado) */
          <CertificateDetails certificate={result.data} />
        )}
      </div>
    </div>
  );
}
