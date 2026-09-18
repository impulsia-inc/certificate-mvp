import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CertificateDetails } from "@/components/certificates/certificate-details";
import { ErrorState } from "@/components/shared/error-state";
import { lookupCertificate } from "@/features/certificates/actions/certificate.actions";

export const metadata: Metadata = {
  title: "Resultado de Verificación",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function VerificarResultPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const decodedRef = decodeURIComponent(reference).trim().toUpperCase();

  const result = await lookupCertificate(decodedRef);

  return (
    <div className="min-h-[80vh] py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="mb-8">
          <Button asChild variant="ghost" className="text-stone-500 hover:text-stone-900 pl-0">
            <Link href="/verificar">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a buscar
            </Link>
          </Button>
        </div>

        {!result.success || !result.data ? (
          <div className="bg-white rounded-xl border border-stone-200 p-8 shadow-sm animate-fade-in">
            <ErrorState
              title="Certificado no encontrado"
              description={`No se encontró ningún certificado con la referencia "${decodedRef}". Verifica que hayas ingresado el número correctamente.`}
              action={
                <Button asChild className="bg-stone-900 hover:bg-stone-800 text-white">
                  <Link href="/verificar">Intentar nuevamente</Link>
                </Button>
              }
            />
          </div>
        ) : result.data.status === "revoked" ? (
          <div className="bg-white rounded-xl border border-rose-200 p-12 shadow-sm flex flex-col items-center text-center animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mb-6">
              <AlertTriangle className="w-10 h-10 text-rose-500" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-rose-600 tracking-editorial mb-4">
              CERTIFICACIÓN NO VÁLIDA
            </h2>
            <p className="text-stone-600 text-lg max-w-md mb-8">
              Esta certificación se encuentra actualmente anulada.
            </p>
            <div className="text-sm text-stone-500 bg-stone-50 p-4 rounded-lg border border-stone-200">
              <p className="mb-1">
                <span className="font-medium text-stone-700">Referencia:</span>{" "}
                <span className="font-mono">{decodedRef}</span>
              </p>
              <p>
                Por razones de seguridad, los detalles de la pieza no están disponibles.
              </p>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide-caps text-emerald-600 font-medium">
                  Certificado verificado
                </p>
                <p className="text-stone-500 text-sm">
                  La siguiente certificación se encuentra activa y vigente.
                </p>
              </div>
            </div>
            <CertificateDetails certificate={result.data} />
          </div>
        )}
      </div>
    </div>
  );
}
