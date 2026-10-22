'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Download,
  Camera,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Microscope,
  Sparkles,
  Scale,
  Award,
  Layers,
  Gem,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CertificateDetail } from '@/types';

interface CertificateDetailsProps {
  certificate: CertificateDetail;
  className?: string;
}

export function CertificateDetails({ certificate, className }: CertificateDetailsProps) {
  const { jewelry, files, gemologicalDetail, additionalStones } = certificate;
  
  // PDF Document
  const pdfFile = files.find((f) => f.type === 'certificate_pdf');
  
  // Image Files sorted by displayOrder
  const imageFiles = files
    .filter((f) => f.type === 'jewelry_image')
    .sort((a, b) => (a.displayOrder ?? 1) - (b.displayOrder ?? 1));

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const currentImage = imageFiles[activeImageIdx]?.storageKey || null;

  // Format date in Spanish (e.g., "12 de marzo, 2026")
  const issuedDateFormatted = new Date(certificate.issuedAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const isActive = certificate.status === 'active';
  const isRevoked = certificate.status === 'revoked';
  const isDraft = certificate.status === 'draft';
  const isStone = certificate.certificateType === 'stone';

  // 4Cs / Gem main specs (reading directly from gemologicalDetail or jewelry)
  const gemSpecs = [
    {
      label: 'CARAT WEIGHT',
      sublabel: 'Peso en Quilates',
      value: gemologicalDetail?.weight
        ? `${gemologicalDetail.weight} ct`
        : jewelry.stoneWeight
        ? `${jewelry.stoneWeight} ct`
        : 'N/A',
      highlight: Boolean(gemologicalDetail?.weight || jewelry.stoneWeight),
    },
    {
      label: 'COLOR GRADE',
      sublabel: 'Grado de Color',
      value: gemologicalDetail?.color || jewelry.stoneColor || 'N/A',
      highlight: Boolean(gemologicalDetail?.color || jewelry.stoneColor),
    },
    {
      label: 'CLARITY GRADE',
      sublabel: 'Pureza / Claridad',
      value: gemologicalDetail?.clarityGrade || jewelry.stoneClarity || 'N/A',
      highlight: Boolean(gemologicalDetail?.clarityGrade || jewelry.stoneClarity),
    },
    {
      label: 'CUT & GEM TYPE',
      sublabel: 'Corte / Gema',
      value:
        gemologicalDetail?.cutGrade ||
        gemologicalDetail?.shapeAndCut ||
        jewelry.stoneType ||
        'N/A',
      highlight: Boolean(
        gemologicalDetail?.cutGrade || gemologicalDetail?.shapeAndCut || jewelry.stoneType
      ),
    },
  ];

  // Detailed Gemological Specs
  const detailedGemSpecs: { label: string; value: string | undefined | null }[] = [
    { label: 'Naturaleza de la Muestra', value: gemologicalDetail?.nature || 'Natural' },
    {
      label: 'Variedad Mineral',
      value:
        gemologicalDetail?.variety ||
        (gemologicalDetail?.stoneKind === 'diamond' ? 'Diamante Natural' : 'Gema de Color'),
    },
    { label: 'Forma y Estilo de Corte', value: gemologicalDetail?.shapeAndCut },
    { label: 'Medidas Milimétricas', value: gemologicalDetail?.measurements },
    { label: 'Grado de Corte (Cut Grade)', value: gemologicalDetail?.cutGrade },
    { label: 'Grado de Pulido (Polish)', value: gemologicalDetail?.polish },
    { label: 'Simetría (Symmetry)', value: gemologicalDetail?.symmetry },
    { label: 'Fluorescencia UV', value: gemologicalDetail?.fluorescence },
    { label: 'Proporciones Técnicas', value: gemologicalDetail?.proportions },
    { label: 'Transparencia', value: gemologicalDetail?.transparency },
    { label: 'Dictamen de Tratamiento', value: gemologicalDetail?.treatment },
  ].filter((item) => Boolean(item.value && item.value.trim() !== ''));

  // Download button component to reuse in desktop left col & mobile bottom
  const DownloadButton = ({ mobile = false }: { mobile?: boolean }) => {
    if (pdfFile) {
      return (
        <a
          href={pdfFile.storageKey}
          download={pdfFile.originalName || `${certificate.reference}.pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'inline-flex items-center justify-center gap-2.5 w-full h-13 px-6 bg-brandBlue-action hover:bg-brandBlue-action/90 active:scale-[0.99] text-white text-[12px] lg:text-[13px] font-semibold tracking-[0.1em] uppercase font-sans rounded-lg shadow-btn-login transition-all cursor-pointer',
            mobile ? 'lg:hidden' : 'hidden lg:inline-flex'
          )}
        >
          <Download className="w-4 h-4 text-gold-champagne shrink-0" />
          <span>Descargar Certificado Oficial (PDF)</span>
        </a>
      );
    }

    return (
      <div
        className={cn(
          'inline-flex items-center justify-center gap-2 w-full h-13 px-6 bg-stone-100 text-stone-400 text-[12px] font-semibold tracking-[0.08em] uppercase font-sans rounded-lg border border-stone-200 cursor-not-allowed text-center',
          mobile ? 'lg:hidden' : 'hidden lg:inline-flex'
        )}
      >
        <FileText className="w-4 h-4 text-stone-400 shrink-0" />
        <span>Documento PDF no disponible</span>
      </div>
    );
  };

  return (
    <div className={cn('space-y-8 animate-fade-in-up', className)}>
      {/* ─── 1. BANNER DE ESTADO ─── */}
      <div
        className={cn(
          'p-5 lg:p-6 rounded-xl border transition-all duration-300 shadow-elevation-sm',
          isActive && 'bg-[#FAFDF9] border-[#AF9052]/30 ring-1 ring-[#AF9052]/10',
          isRevoked && 'bg-red-50/70 border-red-200 ring-1 ring-red-100',
          isDraft && 'bg-amber-50/70 border-amber-200 ring-1 ring-amber-100'
        )}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                isActive && 'bg-emerald-100/80 text-emerald-700',
                isRevoked && 'bg-red-100 text-red-700',
                isDraft && 'bg-amber-100 text-amber-700'
              )}
            >
              {isActive && <ShieldCheck className="w-5 h-5 text-emerald-700" />}
              {isRevoked && <AlertTriangle className="w-5 h-5 text-red-700" />}
              {isDraft && <FileText className="w-5 h-5 text-amber-700" />}
            </div>

            <div className="space-y-1">
              <h2 className="text-[15px] lg:text-[16px] font-semibold text-content-titleDesktop font-sans flex items-center gap-2">
                {isActive && 'Certificado Válido y Activo — Emisión Oficial Registrada'}
                {isRevoked && 'Certificación No Válida — Estado Revocado'}
                {isDraft && 'Borrador Pericial — Emisión en Proceso'}
              </h2>
              <p className="text-[13px] text-content-body font-sans leading-relaxed">
                {isActive &&
                  'Dictamen pericial indexado y respaldado en los libros de registro permanente de F&N Gemology.'}
                {isRevoked &&
                  'Este dictamen pericial ha sido revocado oficialmente y carece de validez técnica o comercial.'}
                {isDraft &&
                  'Este certificado se encuentra en proceso de revisión gemológica preliminar.'}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="shrink-0 self-end sm:self-center">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.1em] uppercase font-sans',
                isActive && 'bg-emerald-100/90 text-emerald-800 border border-emerald-300',
                isRevoked && 'bg-red-100 text-red-800 border border-red-300',
                isDraft && 'bg-amber-100 text-amber-800 border border-amber-300'
              )}
            >
              <span
                className={cn(
                  'w-1.5 h-1.5 rounded-full',
                  isActive && 'bg-emerald-600',
                  isRevoked && 'bg-red-600',
                  isDraft && 'bg-amber-600'
                )}
              />
              {isActive && 'ACTIVO & VIGENTE'}
              {isRevoked && 'ANULADO'}
              {isDraft && 'BORRADOR'}
            </span>
          </div>
        </div>
      </div>

      {/* ─── 2. LAYOUT PRINCIPAL (2 Columnas Desktop / 1 Columna Mobile) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* ─── COLUMNA IZQUIERDA (5 columnas desktop) ─── */}
        <div className="lg:col-span-5 space-y-6 flex flex-col">
          {/* Marco Fotográfico Principal de la Muestra */}
          <div className="space-y-3">
            <div className="relative aspect-[4/3] sm:aspect-square lg:aspect-square w-full rounded-xl overflow-hidden bg-white border border-[#E9E8E3] shadow-elevation-md group">
              {/* Tag Flotante Macro Cam */}
              <div className="absolute top-3.5 left-3.5 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-panel/90 backdrop-blur-sm rounded text-[10px] font-mono tracking-wider uppercase text-white shadow-sm">
                <Camera className="w-3.5 h-3.5 text-gold" />
                <span>{activeImageIdx === 0 ? 'MACRO 1:1 GEM CAM' : 'MACRO DETALLE 2:1'}</span>
              </div>

              {currentImage ? (
                <Image
                  src={currentImage}
                  alt={jewelry.name || 'Fotografía de muestra peritada'}
                  fill
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-surface-alt">
                  <div className="w-16 h-16 rounded-full bg-white border border-[#E9E8E3] flex items-center justify-center mb-3 text-gold">
                    <Microscope className="w-8 h-8" />
                  </div>
                  <p className="text-[13px] font-medium text-content-body font-sans">
                    Fotografía Pericial en Archivo
                  </p>
                  <p className="text-[11px] text-content-muted mt-1">
                    Muestra documentada bajo microscopía en sede
                  </p>
                </div>
              )}
            </div>

            {/* Selector de Fotografías (si hay imagen primaria y secundaria) */}
            {imageFiles.length > 1 && (
              <div className="flex items-center gap-2 pt-1">
                {imageFiles.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={cn(
                      'relative flex items-center gap-2 p-1.5 rounded-lg border text-left transition-all cursor-pointer flex-1',
                      activeImageIdx === idx
                        ? 'border-gold bg-gold/10 ring-1 ring-gold shadow-sm'
                        : 'border-[#E9E8E3] bg-white hover:bg-surface-alt text-content-muted'
                    )}
                  >
                    <div className="relative w-10 h-10 rounded border border-[#E9E8E3] overflow-hidden shrink-0 bg-surface-alt">
                      <Image
                        src={img.storageKey}
                        alt={`Muestra ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-[10px] font-bold uppercase tracking-wider block text-content-titleDesktop">
                        {idx === 0 ? 'Foto 1 · Frontal' : 'Foto 2 · Detalle'}
                      </span>
                      <span className="text-[9px] text-content-muted truncate block">
                        {img.originalName || `Muestra ${idx + 1}`}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tarjeta de Trazabilidad y Custodia Técnica */}
          <div className="bg-white rounded-xl border border-[#E9E8E3] p-5 lg:p-6 shadow-elevation-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E9E8E3] pb-3">
              <Microscope className="w-4 h-4 text-gold" />
              <h3 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-content-titleDesktop font-sans">
                Trazabilidad & Custodia Técnica
              </h3>
            </div>

            <div className="space-y-3 text-[13px] font-sans">
              <div className="flex justify-between items-center py-1 border-b border-stone-100">
                <span className="text-content-muted text-[12px]">Identificador Único</span>
                <span className="font-mono font-semibold text-content-titleDesktop tracking-wide">
                  {certificate.reference}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-stone-100">
                <span className="text-content-muted text-[12px]">Fecha de Dictamen</span>
                <span className="text-content-body font-medium">{issuedDateFormatted}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-stone-100">
                <span className="text-content-muted text-[12px]">Tipo de Certificación</span>
                <span className="text-content-body font-medium uppercase text-[12px]">
                  {isStone ? 'Diamante / Piedra Suelta' : 'Joya Montada'}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-stone-100">
                <span className="text-content-muted text-[12px]">Protocolo Analítico</span>
                <span className="text-content-body font-medium">F&N CIBJO / ISO 17025</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-stone-100">
                <span className="text-content-muted text-[12px]">Inspección Micro</span>
                <span className="text-content-body font-medium">Microscopía Óptica 60x</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-content-muted text-[12px]">Registro de Fe Pública</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Colegiado & Custodiado
                </span>
              </div>
            </div>
          </div>

          {/* Botón Descargar (Desktop) */}
          <DownloadButton mobile={false} />
        </div>

        {/* ─── COLUMNA DERECHA (7 columnas desktop) ─── */}
        <div className="lg:col-span-7 space-y-8">
          {/* Header de la Ficha Técnica */}
          <div className="bg-white rounded-xl border border-[#E9E8E3] p-6 lg:p-8 shadow-elevation-sm space-y-6">
            <div className="border-b border-[#E9E8E3] pb-6">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-gold font-sans">
                  Pasaporte Gemológico Digital
                </span>
                <span className="font-mono text-[12px] bg-surface-alt px-2.5 py-1 rounded border border-[#E9E8E3] text-content-body">
                  REF: {certificate.reference}
                </span>
              </div>

              <h1 className="font-serif font-medium text-[24px] lg:text-[32px] tracking-title-desktop text-content-titleDesktop leading-tight">
                {jewelry.name}
              </h1>

              <p className="text-[13px] text-content-muted font-sans mt-1">
                Emisión pericial registrada el {issuedDateFormatted}
              </p>
            </div>

            {/* Grid 4 Tarjetas Destacadas de la Gema Principal */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-gold" />
                <h3 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-content-titleDesktop font-sans">
                  Gradación de la Gema Principal
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
                {gemSpecs.map((spec, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'p-4 rounded-lg border text-center transition-all bg-surface-alt/70',
                      spec.highlight ? 'border-gold/30 shadow-subtle' : 'border-[#E9E8E3]'
                    )}
                  >
                    <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-content-muted font-sans">
                      {spec.label}
                    </p>
                    <p className="text-[18px] lg:text-[20px] font-semibold font-sans text-content-titleDesktop mt-1 mb-0.5 truncate">
                      {spec.value}
                    </p>
                    <p className="text-[10px] text-content-muted font-sans truncate">
                      {spec.sublabel}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabla Detallada de Especificaciones Gemológicas Periciales */}
            {detailedGemSpecs.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-4">
                  <Gem className="w-4 h-4 text-gold" />
                  <h3 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-content-titleDesktop font-sans">
                    Dictamen Gemológico Pericial
                  </h3>
                </div>

                <div className="divide-y divide-[#E9E8E3] border border-[#E9E8E3] rounded-lg overflow-hidden bg-ivory/50">
                  {detailedGemSpecs.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 p-3.5 text-[13px] font-sans">
                      <span className="text-content-muted font-medium">{item.label}</span>
                      <span className="sm:col-span-2 text-content-titleDesktop font-medium">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Piedras Complementarias / Acentos (si existen) */}
            {additionalStones && additionalStones.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="w-4 h-4 text-gold" />
                  <h3 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-content-titleDesktop font-sans">
                    Piedras Complementarias / Pavé
                  </h3>
                </div>

                <div className="space-y-3">
                  {additionalStones.map((stone, idx) => (
                    <div
                      key={stone.id || idx}
                      className="border border-[#E9E8E3] rounded-lg p-4 bg-surface-alt/50 space-y-2 text-[13px] font-sans"
                    >
                      <div className="flex justify-between items-center border-b border-[#E9E8E3] pb-2">
                        <span className="font-semibold text-content-titleDesktop uppercase text-[11px] tracking-wider">
                          {stone.stoneKind === 'diamond' ? 'Diamantes de Acento' : (stone.variety || 'Gemas Adicionales')}
                        </span>
                        {stone.totalStones && (
                          <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-[#E9E8E3] text-content-body">
                            {stone.totalStones} piezas
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px] pt-1">
                        {stone.estimatedWeight && (
                          <div>
                            <span className="text-content-muted">Peso Estimado: </span>
                            <span className="font-medium text-content-titleDesktop">{stone.estimatedWeight} ct</span>
                          </div>
                        )}
                        {(stone.estimatedColor || stone.estimatedClarity) && (
                          <div>
                            <span className="text-content-muted">Gradación: </span>
                            <span className="font-medium text-content-titleDesktop">
                              {[
                                stone.estimatedColor ? `Color ${stone.estimatedColor}` : null,
                                stone.estimatedClarity ? `Claridad ${stone.estimatedClarity}` : null,
                              ]
                                .filter(Boolean)
                                .join(' · ')}
                            </span>
                          </div>
                        )}
                        {stone.shapeAndCut && (
                          <div>
                            <span className="text-content-muted">Talla / Corte: </span>
                            <span className="font-medium text-content-titleDesktop">{stone.shapeAndCut}</span>
                          </div>
                        )}
                        {stone.measurements && (
                          <div>
                            <span className="text-content-muted">Medidas: </span>
                            <span className="font-medium text-content-titleDesktop">{stone.measurements}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tabla / Listado de Especificaciones de Montura y Joyería */}
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-4">
                <Scale className="w-4 h-4 text-gold" />
                <h3 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-content-titleDesktop font-sans">
                  {isStone ? 'Especificaciones de la Muestra' : 'Especificaciones de Montura & Joyería'}
                </h3>
              </div>

              <div className="divide-y divide-[#E9E8E3] border border-[#E9E8E3] rounded-lg overflow-hidden bg-ivory/50">
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 text-[13px] font-sans">
                  <span className="text-content-muted font-medium">Categoría / Pieza</span>
                  <span className="sm:col-span-2 text-content-titleDesktop font-medium">
                    {isStone
                      ? 'Diamante / Piedra Suelta'
                      : jewelry.category
                      ? `${jewelry.category} — ${jewelry.name}`
                      : jewelry.name}
                  </span>
                </div>

                {!isStone && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 text-[13px] font-sans">
                      <span className="text-content-muted font-medium">Metal & Pureza</span>
                      <span className="sm:col-span-2 text-content-titleDesktop font-medium">
                        {jewelry.metalType || jewelry.material || 'N/A'}
                        {jewelry.purity ? ` (${jewelry.purity})` : ''}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 text-[13px] font-sans">
                      <span className="text-content-muted font-medium">Peso Total</span>
                      <span className="sm:col-span-2 text-content-titleDesktop font-medium">
                        {jewelry.grossWeight || jewelry.weight
                          ? `${jewelry.grossWeight || jewelry.weight} ${jewelry.weightUnit || 'g'}`
                          : 'N/A'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 text-[13px] font-sans">
                      <span className="text-content-muted font-medium">Serie / Punzón</span>
                      <span className="sm:col-span-2 font-mono text-content-titleDesktop">
                        {jewelry.serialNumber || jewelry.model || 'N/A'}
                      </span>
                    </div>
                  </>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 text-[13px] font-sans">
                  <span className="text-content-muted font-medium">Dictamen / Observaciones</span>
                  <span className="sm:col-span-2 text-content-body leading-relaxed">
                    {jewelry.description || jewelry.comments || 'Sin observaciones adicionales registradas en el dictamen pericial.'}
                  </span>
                </div>
              </div>
            </div>

            {/* Botón Descargar en Móvil (aparece justo tras la ficha técnica) */}
            <div className="pt-2 lg:hidden">
              <DownloadButton mobile={true} />
            </div>

            {/* Nota Legal y Técnica al Pie */}
            <div className="pt-4 border-t border-[#E9E8E3] flex items-start gap-3 text-[11px] lg:text-[12px] text-content-muted font-sans leading-relaxed">
              <Award className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <p>
                Este documento certifica las características gemológicas y periciales de la pieza
                descrita conforme a los más estrictos estándares de la gemología europea y CIBJO. El
                registro es inmutable, digitalmente custodiado e indexado por F&N Gemology.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
