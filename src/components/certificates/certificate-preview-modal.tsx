'use client';

import React from 'react';
import Image from 'next/image';
import { 
  X, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  Camera, 
  Scale, 
  Microscope,
  CheckCircle2,
  FileCheck2
} from 'lucide-react';
import type { CertificateFormData } from '@/features/certificates/schemas';
import { TRANSLATIONS } from '@/features/certificates/constants/translations';
import { Button } from '@/components/ui/button';

interface CertificatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CertificateFormData;
  image1PreviewUrl: string | null;
  image2PreviewUrl: string | null;
}

export function CertificatePreviewModal({
  isOpen,
  onClose,
  data,
  image1PreviewUrl,
  image2PreviewUrl,
}: CertificatePreviewModalProps) {
  if (!isOpen) return null;

  const lang = data.reportLanguage || 'es';
  const t = TRANSLATIONS[lang];

  const isJewelry = data.certificateType === 'jewelry';
  const isDiamond = data.stoneKind === 'diamond';

  const titleText = isJewelry 
    ? (data.jewelry?.name || (lang === 'es' ? 'Joya de Alta Gama' : 'Fine Jewelry Piece'))
    : (isDiamond 
        ? (lang === 'es' ? 'Diamante Natural Suelto' : 'Loose Natural Diamond')
        : (data.gemDetail?.variety || (lang === 'es' ? 'Gema de Color Suelta' : 'Loose Colored Gemstone')));

  const mainWeight = isDiamond 
    ? (data.diamondDetail?.weight ? `${data.diamondDetail.weight} ct` : '—')
    : (data.gemDetail?.weight ? `${data.gemDetail.weight} ct` : '—');

  const mainColor = isDiamond 
    ? (data.diamondDetail?.color || '—')
    : (data.gemDetail?.color || '—');

  const mainClarityOrVariety = isDiamond 
    ? (data.diamondDetail?.clarityGrade || '—')
    : (data.gemDetail?.transparency || '—');

  const mainCut = isDiamond 
    ? (data.diamondDetail?.shapeAndCut || '—')
    : (data.gemDetail?.shapeAndCut || '—');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-ivory rounded-2xl border border-gold/30 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-surface-panel text-white border-b border-gold/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center text-gold-champagne">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-gold uppercase block">
                FYN CORE LAB · PREVISUALIZADOR
              </span>
              <h3 className="text-sm font-semibold tracking-wide font-serif">
                {lang === 'es' ? 'Previsualización de Dictamen Pericial' : 'Expert Report Preview'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Paper Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Certificate Header Banner */}
          <div className="bg-white rounded-xl border border-[#E9E8E3] p-6 text-center space-y-3 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-gold via-gold-champagne to-gold" />
            <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] font-semibold text-gold uppercase font-sans">
              <Award className="w-4 h-4" />
              <span>F&N GEMOLOGY · LABORATORIO & CERTIFICACIÓN</span>
            </div>
            <h1 className="font-serif font-medium text-2xl sm:text-3xl text-content-titleDesktop">
              {titleText}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-content-muted font-sans">
              <span className="font-mono bg-surface-alt px-2.5 py-1 rounded border border-[#E9E8E3] font-semibold text-content-titleDesktop">
                REF: FYN-26-PROVISIONAL
              </span>
              <span>·</span>
              <span>{lang === 'es' ? 'Emisión:' : 'Issued:'} {data.issuedAt || new Date().toISOString().split('T')[0]}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {lang === 'es' ? 'Dictamen Colegiado' : 'Certified Record'}
              </span>
            </div>
          </div>

          {/* 2-Column Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left Column: Photos & Custody */}
            <div className="md:col-span-5 space-y-4">
              {/* Primary Image */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white border border-[#E9E8E3] shadow-sm flex items-center justify-center group">
                <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-panel/90 backdrop-blur-sm rounded text-[9px] font-mono tracking-wider uppercase text-white shadow-sm">
                  <Camera className="w-3 h-3 text-gold" />
                  <span>VISTA 1: MACRO 1:1</span>
                </div>
                {image1PreviewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image1PreviewUrl}
                    alt="Vista Frontal"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-6 text-stone-400">
                    <Microscope className="w-10 h-10 mx-auto mb-2 text-gold opacity-75" />
                    <p className="text-xs font-sans font-medium text-stone-500">
                      {lang === 'es' ? 'Fotografía Frontal / Macro' : 'Frontal / Macro Photography'}
                    </p>
                    <p className="text-[10px] text-stone-400 mt-1">
                      {lang === 'es' ? 'No se cargó archivo primario' : 'No primary file uploaded'}
                    </p>
                  </div>
                )}
              </div>

              {/* Secondary Image if present */}
              {image2PreviewUrl && (
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-white border border-[#E9E8E3] shadow-sm flex items-center justify-center">
                  <div className="absolute top-2.5 left-2.5 z-10 inline-flex items-center gap-1 px-2 py-0.5 bg-surface-panel/90 rounded text-[9px] font-mono text-white">
                    <span>VISTA 2: SELLO / LATERAL</span>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image2PreviewUrl}
                    alt="Vista Lateral"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Custody Box */}
              <div className="bg-white rounded-xl border border-[#E9E8E3] p-4 text-[11px] font-sans space-y-2">
                <div className="flex items-center gap-1.5 font-semibold uppercase tracking-wider text-gold text-[10px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{lang === 'es' ? 'Protocolo de Custodia' : 'Custody Protocol'}</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-1 text-content-body">
                  <span className="text-content-muted">{lang === 'es' ? 'Estándar' : 'Standard'}</span>
                  <span className="font-medium">ISO/IEC 17025 · CIBJO</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-1 text-content-body">
                  <span className="text-content-muted">{lang === 'es' ? 'Análisis' : 'Analysis'}</span>
                  <span className="font-medium">Microscopía Confocal 60x</span>
                </div>
                <div className="flex justify-between text-content-body">
                  <span className="text-content-muted">{lang === 'es' ? 'Fe Pública' : 'Registry'}</span>
                  <span className="font-medium text-emerald-700">Custodiado FYN</span>
                </div>
              </div>
            </div>

            {/* Right Column: 4Cs & Technical Details */}
            <div className="md:col-span-7 space-y-4">
              {/* 4 Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-white p-3 rounded-lg border border-gold/30 text-center shadow-subtle">
                  <span className="text-[9px] uppercase font-semibold text-content-muted block tracking-wider">
                    {lang === 'es' ? 'PESO' : 'CARAT'}
                  </span>
                  <span className="text-base font-bold text-content-titleDesktop block mt-0.5 font-sans">
                    {mainWeight}
                  </span>
                  <span className="text-[9px] text-content-muted">Quilates</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gold/30 text-center shadow-subtle">
                  <span className="text-[9px] uppercase font-semibold text-content-muted block tracking-wider">
                    {lang === 'es' ? 'COLOR' : 'COLOR'}
                  </span>
                  <span className="text-base font-bold text-content-titleDesktop block mt-0.5 font-sans truncate">
                    {mainColor}
                  </span>
                  <span className="text-[9px] text-content-muted">{lang === 'es' ? 'Grado' : 'Grade'}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gold/30 text-center shadow-subtle">
                  <span className="text-[9px] uppercase font-semibold text-content-muted block tracking-wider">
                    {isDiamond ? (lang === 'es' ? 'PUREZA' : 'CLARITY') : (lang === 'es' ? 'TRANSP.' : 'TRANSP.')}
                  </span>
                  <span className="text-base font-bold text-content-titleDesktop block mt-0.5 font-sans truncate">
                    {mainClarityOrVariety}
                  </span>
                  <span className="text-[9px] text-content-muted">{isDiamond ? 'Clarity' : 'Optical'}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gold/30 text-center shadow-subtle">
                  <span className="text-[9px] uppercase font-semibold text-content-muted block tracking-wider">
                    {lang === 'es' ? 'CORTE' : 'CUT'}
                  </span>
                  <span className="text-xs font-bold text-content-titleDesktop block mt-1 font-sans truncate" title={mainCut}>
                    {mainCut}
                  </span>
                  <span className="text-[9px] text-content-muted">{lang === 'es' ? 'Talla' : 'Shape'}</span>
                </div>
              </div>

              {/* Detailed Specs Table */}
              <div className="bg-white rounded-xl border border-[#E9E8E3] overflow-hidden text-xs font-sans divide-y divide-[#E9E8E3] shadow-sm">
                {isJewelry && (
                  <>
                    <div className="flex justify-between p-3 bg-surface-alt/50 font-semibold text-content-titleDesktop">
                      <span>{lang === 'es' ? 'Categoría de Joya' : 'Jewelry Category'}</span>
                      <span>{data.jewelry?.category || '—'}</span>
                    </div>
                    <div className="flex justify-between p-3">
                      <span className="text-content-muted">{lang === 'es' ? 'Metal & Pureza' : 'Metal & Purity'}</span>
                      <span className="font-medium text-content-titleDesktop">
                        {data.jewelry?.metalType || data.jewelry?.material || '—'}
                        {data.jewelry?.purity ? ` (${data.jewelry.purity})` : ''}
                      </span>
                    </div>
                    <div className="flex justify-between p-3">
                      <span className="text-content-muted">{lang === 'es' ? 'Peso Bruto Joya' : 'Gross Weight'}</span>
                      <span className="font-medium text-content-titleDesktop">
                        {data.jewelry?.grossWeight ? `${data.jewelry.grossWeight} ${data.jewelry.weightUnit || 'g'}` : '—'}
                      </span>
                    </div>
                    {data.jewelry?.serialNumber && (
                      <div className="flex justify-between p-3">
                        <span className="text-content-muted">{lang === 'es' ? 'Serie / Contraste' : 'Serial / Hallmark'}</span>
                        <span className="font-mono text-content-titleDesktop">{data.jewelry.serialNumber}</span>
                      </div>
                    )}
                  </>
                )}

                {/* Stone details */}
                <div className="flex justify-between p-3 bg-surface-alt/50 font-semibold text-content-titleDesktop">
                  <span>{lang === 'es' ? 'Gema Central' : 'Central Stone'}</span>
                  <span>{isDiamond ? (data.diamondDetail?.nature || 'Diamante Natural') : (data.gemDetail?.variety || 'Gema de Color')}</span>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-content-muted">{lang === 'es' ? 'Forma & Corte' : 'Shape & Cut'}</span>
                  <span className="font-medium text-content-titleDesktop">{mainCut}</span>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-content-muted">{lang === 'es' ? 'Medidas' : 'Measurements'}</span>
                  <span className="font-medium text-content-titleDesktop">
                    {isDiamond ? (data.diamondDetail?.measurements || '—') : (data.gemDetail?.measurements || '—')}
                  </span>
                </div>

                {isDiamond && (
                  <>
                    <div className="flex justify-between p-3">
                      <span className="text-content-muted">{lang === 'es' ? 'Grado de Corte' : 'Cut Grade'}</span>
                      <span className="font-medium text-content-titleDesktop">{data.diamondDetail?.cutGrade || '—'}</span>
                    </div>
                    <div className="flex justify-between p-3">
                      <span className="text-content-muted">{lang === 'es' ? 'Fluorescencia' : 'Fluorescence'}</span>
                      <span className="font-medium text-content-titleDesktop">{data.diamondDetail?.fluorescence || '—'}</span>
                    </div>
                    <div className="flex justify-between p-3">
                      <span className="text-content-muted">{lang === 'es' ? 'Pulido & Simetría' : 'Polish & Symmetry'}</span>
                      <span className="font-medium text-content-titleDesktop">
                        {data.diamondAdditionalInfo?.polish || '—'} / {data.diamondAdditionalInfo?.symmetry || '—'}
                      </span>
                    </div>
                  </>
                )}

                {!isDiamond && (
                  <>
                    <div className="flex justify-between p-3">
                      <span className="text-content-muted">{lang === 'es' ? 'Tratamiento' : 'Treatment'}</span>
                      <span className="font-medium text-content-titleDesktop">{data.gemDetail?.treatment || 'Sin indicios'}</span>
                    </div>
                  </>
                )}

                {/* Additional Stones */}
                {data.hasAdditionalDiamonds && data.additionalDiamonds && (
                  <div className="p-3 bg-amber-50/50 space-y-1">
                    <span className="font-semibold text-content-titleDesktop block">
                      {lang === 'es' ? 'Diamantes Adicionales:' : 'Additional Diamonds:'}
                    </span>
                    <p className="text-content-muted">
                      {data.additionalDiamonds.totalStones || '—'} piedras · {data.additionalDiamonds.estimatedWeight || '—'} ct · {data.additionalDiamonds.estimatedColor || '—'} / {data.additionalDiamonds.estimatedClarity || '—'}
                    </p>
                  </div>
                )}

                {data.hasAdditionalGems && data.additionalGems && (
                  <div className="p-3 bg-amber-50/50 space-y-1">
                    <span className="font-semibold text-content-titleDesktop block">
                      {lang === 'es' ? 'Gemas Secundarias:' : 'Secondary Gemstones:'}
                    </span>
                    <p className="text-content-muted">
                      {data.additionalGems.totalStones || '—'} piedras · {data.additionalGems.variety || '—'} · {data.additionalGems.estimatedWeight || '—'} ct
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-white border-t border-[#E9E8E3] flex items-center justify-between shrink-0">
          <span className="text-xs text-content-muted font-sans hidden sm:inline">
            {lang === 'es' ? 'Previsualización generada en memoria de cliente.' : 'Client-side generated preview.'}
          </span>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-stone-300 font-sans text-xs ml-auto"
          >
            {lang === 'es' ? 'Cerrar Previsualización' : 'Close Preview'}
          </Button>
        </div>
      </div>
    </div>
  );
}
