import { Download, Camera, Calendar, ShieldCheck, Tag, Gem, Scale, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/certificates/status-badge";
import { cn } from "@/lib/utils";
import type { CertificateDetail } from "@/types";

interface CertificateDetailsProps {
  certificate: CertificateDetail;
  className?: string;
  showAdminActions?: boolean;
}

export function CertificateDetails({ certificate, className, showAdminActions }: CertificateDetailsProps) {
  const { jewelry, files } = certificate;
  const pdfFile = files.find((f) => f.type === "certificate_pdf");
  const imageFile = files.find((f) => f.type === "jewelry_image");
  const imageUrl = imageFile ? imageFile.storageKey : null;

  return (
    <div className={cn("bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm", className)}>
      {/* Header with image and core info */}
      <div className="flex flex-col md:flex-row">
        {/* Image Column */}
        <div className="md:w-2/5 bg-stone-50 p-6 md:p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-stone-100">
          {imageUrl ? (
            <div className="w-full max-w-sm aspect-square rounded-lg overflow-hidden bg-white shadow-sm ring-1 ring-stone-900/5">
              <img
                src={imageUrl}
                alt={jewelry.name}
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className="w-full max-w-sm aspect-square rounded-lg bg-stone-100 flex flex-col items-center justify-center text-stone-400 ring-1 ring-stone-900/5">
              <Camera className="w-12 h-12 mb-2 opacity-40" strokeWidth={1.5} />
              <span className="text-sm">Sin imagen disponible</span>
            </div>
          )}
        </div>

        {/* Info Column */}
        <div className="md:w-3/5 p-6 md:p-8 flex flex-col">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-stone-900 mb-1">
                {jewelry.name}
              </h2>
              <p className="text-stone-500 font-mono text-sm">
                Ref: {certificate.reference}
              </p>
            </div>
            <StatusBadge status={certificate.status} />
          </div>

          {/* Certificate Info Grid */}
          <div className="grid grid-cols-2 gap-5 mb-6">
            <DetailItem
              icon={<Calendar className="w-4 h-4 text-brand" />}
              label="Fecha de emisión"
              value={new Date(certificate.issuedAt).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
            <DetailItem
              icon={<ShieldCheck className="w-4 h-4 text-brand" />}
              label="Nº Certificado"
              value={certificate.certificateNumber || certificate.reference}
            />
          </div>

          {jewelry.description && (
            <p className="text-stone-600 text-sm leading-relaxed mb-6">
              {jewelry.description}
            </p>
          )}

          {/* Download Button */}
          <div className="mt-auto pt-6 border-t border-stone-100">
            {pdfFile ? (
              <Button
                asChild
                className="w-full sm:w-auto bg-stone-900 hover:bg-stone-800 text-white"
              >
                <a href={pdfFile.storageKey} download={pdfFile.originalName}>
                  <Download className="w-4 h-4 mr-2" />
                  Descargar certificado
                </a>
              </Button>
            ) : (
              <p className="text-sm text-stone-400">Documento no disponible</p>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Jewelry Details Grid */}
      <div className="p-6 md:p-8">
        <h3 className="text-base font-semibold text-stone-900 mb-6 flex items-center gap-2">
          <Gem className="w-5 h-5 text-brand" />
          Características de la Joya
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-5">
          {jewelry.category && (
            <DetailItem label="Tipo de pieza" value={jewelry.category} />
          )}
          {jewelry.material && (
            <DetailItem label="Material" value={jewelry.material} />
          )}
          {jewelry.metalType && (
            <DetailItem label="Tipo de metal" value={jewelry.metalType} />
          )}
          {jewelry.purity && (
            <DetailItem label="Pureza" value={jewelry.purity} />
          )}
          {jewelry.weight && (
            <DetailItem
              icon={<Scale className="w-3.5 h-3.5 text-stone-400" />}
              label="Peso"
              value={`${jewelry.weight} ${jewelry.weightUnit || "g"}`}
            />
          )}
          {jewelry.serialNumber && (
            <DetailItem label="Nº Serie" value={jewelry.serialNumber} />
          )}
          {jewelry.brand && (
            <DetailItem label="Marca" value={jewelry.brand} />
          )}
          {jewelry.model && (
            <DetailItem label="Modelo" value={jewelry.model} />
          )}
        </div>

        {/* Stone Details */}
        {jewelry.stoneType && (
          <>
            <Separator className="my-6" />
            <h3 className="text-base font-semibold text-stone-900 mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand" />
              Piedra Preciosa
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-5">
              <DetailItem label="Tipo" value={jewelry.stoneType} />
              {jewelry.stoneWeight && (
                <DetailItem label="Peso" value={`${jewelry.stoneWeight} ct`} />
              )}
              {jewelry.stoneColor && (
                <DetailItem label="Color" value={jewelry.stoneColor} />
              )}
              {jewelry.stoneClarity && (
                <DetailItem label="Claridad" value={jewelry.stoneClarity} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DetailLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] uppercase tracking-wider font-medium text-stone-400 block mb-1">
      {children}
    </span>
  );
}

function DetailItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <DetailLabel>{label}</DetailLabel>
      <div className="text-stone-800 font-medium text-[15px] flex items-center gap-1.5">
        {icon}
        {value}
      </div>
    </div>
  );
}
