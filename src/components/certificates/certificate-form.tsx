'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  certificateFormSchema, 
  type CertificateFormData 
} from '@/features/certificates/schemas';
import { TRANSLATIONS, type FormLanguage } from '@/features/certificates/constants/translations';
import { createCertificateAction } from '@/features/certificates/actions/certificate.actions';
import { CertificatePreviewModal } from './certificate-preview-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Diamond,
  Gem,
  UploadCloud,
  Eye,
  Save,
  Send,
  Loader2,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CertificateDetail } from '@/types';

interface CertificateFormProps {
  initialData?: CertificateDetail;
  onSubmit?: (data: Record<string, unknown>) => Promise<void>;
}

export function CertificateForm({ initialData, onSubmit }: CertificateFormProps) {
  const router = useRouter();
  const [lang, setLang] = useState<FormLanguage>('es');
  const t = TRANSLATIONS[lang];

  // Images state
  const [image1File, setImage1File] = useState<File | null>(null);
  const [image2File, setImage2File] = useState<File | null>(null);
  const [image1Url, setImage1Url] = useState<string | null>(null);
  const [image2Url, setImage2Url] = useState<string | null>(null);

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const generalDropRef = useRef<HTMLInputElement>(null);

  // Preview modal & submission states
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Collapsible sections
  const [isAdditionalDiamondsOpen, setIsAdditionalDiamondsOpen] = useState(
    Boolean(initialData?.additionalStones?.some((s) => s.stoneKind === 'diamond'))
  );
  const [isAdditionalGemsOpen, setIsAdditionalGemsOpen] = useState(
    Boolean(initialData?.additionalStones?.some((s) => s.stoneKind === 'colored_gem'))
  );

  // Form setup
  const initialType = (initialData?.certificateType as 'stone' | 'jewelry') || 'stone';
  const initialStoneKind = initialType === 'stone' ? 'diamond' : 'colored_gem';

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<CertificateFormData>({
    resolver: zodResolver(certificateFormSchema),
    mode: 'onChange',
    defaultValues: {
      certificateType: initialType,
      reportLanguage: 'es',
      stoneKind: initialStoneKind,
      status: initialData?.status || 'draft',
      issuedAt: initialData?.issuedAt ? initialData.issuedAt.split('T')[0] : new Date().toISOString().split('T')[0],
      certificateNumber: initialData?.certificateNumber || '',
      jewelry: {
        name: initialData?.jewelry?.name || '',
        category: (initialData?.jewelry?.category as string) || 'Anillo',
        material: initialData?.jewelry?.material || '',
        metalType: initialData?.jewelry?.metalType || '',
        purity: initialData?.jewelry?.purity || '',
        grossWeight: initialData?.jewelry?.grossWeight || initialData?.jewelry?.weight || undefined,
        weightUnit: initialData?.jewelry?.weightUnit || 'g',
        serialNumber: initialData?.jewelry?.serialNumber || '',
        comments: initialData?.jewelry?.comments || initialData?.jewelry?.description || '',
      },
      diamondDetail: {
        nature: initialData?.gemologicalDetail?.nature || 'Natural',
        shapeAndCut: initialData?.gemologicalDetail?.shapeAndCut || 'Talla Brillante Redonda',
        measurements: initialData?.gemologicalDetail?.measurements || '',
        weight: initialData?.gemologicalDetail?.weight || initialData?.jewelry?.stoneWeight || undefined,
        color: initialData?.gemologicalDetail?.color || initialData?.jewelry?.stoneColor || 'D',
        clarityGrade: initialData?.gemologicalDetail?.clarityGrade || initialData?.jewelry?.stoneClarity || 'VVS1',
        cutGrade: initialData?.gemologicalDetail?.cutGrade || 'Excelente',
        fluorescence: initialData?.gemologicalDetail?.fluorescence || 'Nula (Inerte)',
      },
      diamondAdditionalInfo: {
        polish: initialData?.gemologicalDetail?.polish || 'Excelente',
        symmetry: initialData?.gemologicalDetail?.symmetry || 'Excelente',
        proportions: initialData?.gemologicalDetail?.proportions || '',
      },
      hasAdditionalDiamonds: Boolean(initialData?.additionalStones?.some((s) => s.stoneKind === 'diamond')),
      additionalDiamonds: {
        nature: 'Natural',
        totalStones: undefined,
        shapeAndCut: 'Talla Brillante Redonda',
        measurements: '',
        estimatedWeight: undefined,
        estimatedColor: '',
        estimatedClarity: '',
      },
      gemDetail: {
        nature: initialData?.gemologicalDetail?.nature || 'Natural',
        variety: initialData?.gemologicalDetail?.variety || 'Zafiro Natural',
        shapeAndCut: initialData?.gemologicalDetail?.shapeAndCut || 'Cushion Mixto',
        measurements: initialData?.gemologicalDetail?.measurements || '',
        weight: initialData?.gemologicalDetail?.weight || undefined,
        color: initialData?.gemologicalDetail?.color || '',
        transparency: initialData?.gemologicalDetail?.transparency || 'Transparente',
        cutGrade: initialData?.gemologicalDetail?.cutGrade || 'Excelente',
        treatment: initialData?.gemologicalDetail?.treatment || '',
      },
      hasAdditionalGems: Boolean(initialData?.additionalStones?.some((s) => s.stoneKind === 'colored_gem')),
      additionalGems: {
        nature: 'Natural',
        variety: '',
        totalStones: undefined,
        shapeAndCut: '',
        measurements: '',
        estimatedWeight: undefined,
        color: '',
      },
    },
  });

  const currentCertType = watch('certificateType');

  // Handle switching between DIAMANTE and JOYA
  const handleTypeSelect = (type: 'stone' | 'jewelry') => {
    setValue('certificateType', type, { shouldValidate: true });
    if (type === 'stone') {
      setValue('stoneKind', 'diamond', { shouldValidate: true });
      setValue('hasAdditionalDiamonds', false);
      setIsAdditionalDiamondsOpen(false);
      clearErrors(['jewelry.name', 'jewelry.category', 'gemDetail']);
    } else {
      setValue('stoneKind', 'colored_gem', { shouldValidate: true });
      setValue('hasAdditionalGems', false);
      setIsAdditionalGemsOpen(false);
      clearErrors(['diamondDetail']);
    }
  };

  // Sync language toggle with form
  const handleLanguageChange = (newLang: FormLanguage) => {
    setLang(newLang);
    setValue('reportLanguage', newLang);
  };

  // Pre-load initial files if available
  useEffect(() => {
    if (initialData?.files) {
      const f1 = initialData.files.find((f) => f.role === 'primary_image' || f.displayOrder === 1);
      const f2 = initialData.files.find((f) => f.role === 'secondary_image' || f.displayOrder === 2);
      if (f1) setImage1Url(f1.storageKey);
      if (f2) setImage2Url(f2.storageKey);
    }
  }, [initialData]);

  // Image upload helpers
  const handleFileSlot1 = (file: File) => {
    setImage1File(file);
    const url = URL.createObjectURL(file);
    setImage1Url(url);
  };

  const handleFileSlot2 = (file: File) => {
    setImage2File(file);
    const url = URL.createObjectURL(file);
    setImage2Url(url);
  };

  const removeSlot1 = () => {
    setImage1File(null);
    setImage1Url(null);
    if (fileInputRef1.current) fileInputRef1.current.value = '';
  };

  const removeSlot2 = () => {
    setImage2File(null);
    setImage2Url(null);
    if (fileInputRef2.current) fileInputRef2.current.value = '';
  };

  const handleGeneralDrop = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!image1File) {
      handleFileSlot1(files[0]);
      if (files.length > 1 && !image2File) {
        handleFileSlot2(files[1]);
      }
    } else if (!image2File) {
      handleFileSlot2(files[0]);
    }
  };

  // Helper format filesize
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Form submission handler
  const handleSaveOrPublish = async (actionStatus: 'draft' | 'active') => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const formDataValues = watch();
      formDataValues.status = actionStatus;

      // Ensure flags and kinds are consistent
      if (formDataValues.certificateType === 'stone') {
        formDataValues.stoneKind = 'diamond';
        formDataValues.hasAdditionalDiamonds = false;
        formDataValues.hasAdditionalGems = isAdditionalGemsOpen;
      } else {
        formDataValues.stoneKind = 'colored_gem';
        formDataValues.hasAdditionalDiamonds = isAdditionalDiamondsOpen;
        formDataValues.hasAdditionalGems = false;
      }

      // If legacy onSubmit prop is provided (e.g. edit mode)
      if (onSubmit) {
        await onSubmit(formDataValues as unknown as Record<string, unknown>);
        router.push('/admin/certificados');
        router.refresh();
        return;
      }

      // Build real FormData payload with binary images
      const fd = new FormData();
      fd.append('data', JSON.stringify(formDataValues));
      if (image1File) fd.append('image1', image1File);
      if (image2File) fd.append('image2', image2File);

      const res = await createCertificateAction(fd);
      if (!res.success) {
        setSubmitError(res.error);
        return;
      }

      setSubmitSuccess(
        actionStatus === 'active' 
          ? `Certificación emitida y publicada con éxito: ${res.data.reference}`
          : `Borrador guardado exitosamente: ${res.data.reference}`
      );

      setTimeout(() => {
        router.push('/admin/certificados');
        router.refresh();
      }, 1000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error inesperado al procesar la solicitud.';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-8 pb-32">
        {/* Error / Success Notifications */}
        {submitError && (
          <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-start gap-3 shadow-sm animate-fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
            <div>
              <p className="font-semibold text-sm">Error en la emisión del certificado</p>
              <p className="text-xs mt-0.5">{submitError}</p>
            </div>
          </div>
        )}

        {submitSuccess && (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-start gap-3 shadow-sm animate-fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
            <div>
              <p className="font-semibold text-sm">Operación completada con éxito</p>
              <p className="text-xs mt-0.5">{submitSuccess}</p>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            CABECERA PRINCIPAL & SELECTORES DE TIPO (DIAMANTE vs JOYA)
        ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl border border-[#E9E8E3] p-6 lg:p-8 shadow-elevation-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E9E8E3] pb-6">
            <div>
              <span className="text-[10px] lg:text-[11px] font-semibold tracking-[0.2em] uppercase text-gold font-sans block mb-1">
                {t.header.badge}
              </span>
              <h1 className="font-serif font-medium text-2xl lg:text-3xl text-content-titleDesktop tracking-title-desktop">
                {t.header.title}
              </h1>
              <p className="text-xs lg:text-[13px] text-content-body font-sans mt-1">
                {t.header.subtitle}
              </p>
            </div>

            {/* Language Selector Toggle */}
            <div className="flex items-center gap-2 self-start md:self-center bg-surface-alt p-1.5 rounded-xl border border-[#E9E8E3]">
              <span className="text-[11px] font-semibold text-content-muted uppercase tracking-wider px-2 font-sans">
                {t.header.languageLabel}:
              </span>
              <button
                type="button"
                onClick={() => handleLanguageChange('es')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all font-sans',
                  lang === 'es'
                    ? 'bg-brandBlue-action text-white shadow-sm'
                    : 'text-content-body hover:text-content-titleDesktop'
                )}
              >
                ESPAÑOL (ES)
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all font-sans',
                  lang === 'en'
                    ? 'bg-brandBlue-action text-white shadow-sm'
                    : 'text-content-body hover:text-content-titleDesktop'
                )}
              >
                ENGLISH (EN)
              </button>
            </div>
          </div>

          {/* Selector Principal Simplificado: DIAMANTE vs JOYA */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold uppercase tracking-wider text-content-muted font-sans">
              {t.header.certTypeLabel} *
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Opción 1: DIAMANTE */}
              <button
                type="button"
                onClick={() => handleTypeSelect('stone')}
                className={cn(
                  'flex items-start gap-4 p-5 rounded-xl border text-left transition-all duration-200 cursor-pointer',
                  currentCertType === 'stone'
                    ? 'border-[#AF9052] bg-white ring-2 ring-[#AF9052]/20 shadow-elevation-sm'
                    : 'border-[#E9E8E3] bg-surface-alt hover:bg-white hover:border-stone-300'
                )}
              >
                <div
                  className={cn(
                    'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5',
                    currentCertType === 'stone' ? 'bg-[#AF9052] text-white shadow-sm' : 'bg-white text-stone-600 border border-[#E9E8E3]'
                  )}
                >
                  <Diamond className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-content-titleDesktop font-sans">
                      {t.header.typeStone}
                    </span>
                    {currentCertType === 'stone' && (
                      <span className="w-2 h-2 rounded-full bg-gold" />
                    )}
                  </div>
                  <p className="text-xs text-content-body font-sans leading-relaxed">
                    {t.header.typeStoneDesc}
                  </p>
                </div>
              </button>

              {/* Opción 2: JOYA */}
              <button
                type="button"
                onClick={() => handleTypeSelect('jewelry')}
                className={cn(
                  'flex items-start gap-4 p-5 rounded-xl border text-left transition-all duration-200 cursor-pointer',
                  currentCertType === 'jewelry'
                    ? 'border-[#AF9052] bg-white ring-2 ring-[#AF9052]/20 shadow-elevation-sm'
                    : 'border-[#E9E8E3] bg-surface-alt hover:bg-white hover:border-stone-300'
                )}
              >
                <div
                  className={cn(
                    'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5',
                    currentCertType === 'jewelry' ? 'bg-[#AF9052] text-white shadow-sm' : 'bg-white text-stone-600 border border-[#E9E8E3]'
                  )}
                >
                  <Gem className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-content-titleDesktop font-sans">
                      {t.header.typeJewelry}
                    </span>
                    {currentCertType === 'jewelry' && (
                      <span className="w-2 h-2 rounded-full bg-gold" />
                    )}
                  </div>
                  <p className="text-xs text-content-body font-sans leading-relaxed">
                    {t.header.typeJewelryDesc}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            BLOQUE 1: FOTOGRAFÍA Y ARCHIVOS DE REFERENCIA (Común a ambos)
        ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl border border-[#E9E8E3] p-6 lg:p-8 shadow-elevation-sm space-y-6">
          <div className="border-b border-[#E9E8E3] pb-4">
            <h2 className="font-serif font-medium text-lg lg:text-xl text-content-titleDesktop">
              1. {t.sections.photos.title}
            </h2>
            <p className="text-xs text-content-body font-sans mt-0.5">
              {t.sections.photos.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Interactive Dropzone (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <input
                ref={generalDropRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={(e) => handleGeneralDrop(e.target.files)}
              />
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleGeneralDrop(e.dataTransfer.files);
                }}
                onClick={() => generalDropRef.current?.click()}
                className={cn(
                  'border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[220px]',
                  isDragging
                    ? 'border-gold bg-gold/5 scale-[0.99]'
                    : 'border-[#E9E8E3] bg-surface-alt hover:bg-white hover:border-[#AF9052]'
                )}
              >
                <div className="w-12 h-12 rounded-full bg-white border border-[#E9E8E3] flex items-center justify-center mb-3 text-gold shadow-sm">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-content-titleDesktop font-sans">
                  {t.sections.photos.dropTitle}
                </p>
                <p className="text-[11px] text-content-muted font-sans mt-1 max-w-xs">
                  {t.sections.photos.dropSubtitle}
                </p>
              </div>
            </div>

            {/* Exact 2 Slots Preview Cards (7 cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* SLOT 1: Frontal / Macro */}
              <div className="bg-surface-alt rounded-xl border border-[#E9E8E3] p-4 flex flex-col justify-between space-y-3 relative overflow-hidden">
                <input
                  ref={fileInputRef1}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileSlot1(e.target.files[0])}
                />
                <div className="flex items-center justify-between gap-2 border-b border-[#E9E8E3] pb-2">
                  <span className="text-[11px] font-semibold text-content-titleDesktop font-sans truncate">
                    {t.sections.photos.slot1Title}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-semibold tracking-wider uppercase bg-[#AF9052] text-white">
                    {t.sections.photos.badgePrimary}
                  </span>
                </div>

                {image1Url ? (
                  <div className="space-y-3">
                    <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-white border border-[#E9E8E3] shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image1Url}
                        alt="Slot 1"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-sans">
                      <span className="truncate max-w-[120px] text-content-body font-medium" title={image1File?.name}>
                        {image1File ? image1File.name : 'Imagen Principal en Archivo'}
                      </span>
                      <span className="text-content-muted font-mono">
                        {formatFileSize(image1File?.size)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef1.current?.click()}
                        className="h-8 text-[11px] flex-1 border-stone-300"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        {t.sections.photos.btnReplace}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeSlot1}
                        className="h-8 text-[11px] text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-stone-400">
                    <p className="text-xs text-content-muted font-sans">
                      {t.sections.photos.slotAvailable}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef1.current?.click()}
                      className="mt-3 h-8 text-[11px] border-stone-300"
                    >
                      {t.sections.photos.btnSelect}
                    </Button>
                  </div>
                )}
              </div>

              {/* SLOT 2: Lateral / Sello */}
              <div className="bg-surface-alt rounded-xl border border-[#E9E8E3] p-4 flex flex-col justify-between space-y-3 relative overflow-hidden">
                <input
                  ref={fileInputRef2}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileSlot2(e.target.files[0])}
                />
                <div className="flex items-center justify-between gap-2 border-b border-[#E9E8E3] pb-2">
                  <span className="text-[11px] font-semibold text-content-titleDesktop font-sans truncate">
                    {t.sections.photos.slot2Title}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-semibold tracking-wider uppercase bg-surface-panel text-white">
                    {t.sections.photos.badgeSecondary}
                  </span>
                </div>

                {image2Url ? (
                  <div className="space-y-3">
                    <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-white border border-[#E9E8E3] shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image2Url}
                        alt="Slot 2"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-sans">
                      <span className="truncate max-w-[120px] text-content-body font-medium" title={image2File?.name}>
                        {image2File ? image2File.name : 'Imagen Secundaria en Archivo'}
                      </span>
                      <span className="text-content-muted font-mono">
                        {formatFileSize(image2File?.size)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef2.current?.click()}
                        className="h-8 text-[11px] flex-1 border-stone-300"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        {t.sections.photos.btnReplace}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeSlot2}
                        className="h-8 text-[11px] text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-stone-400">
                    <p className="text-xs text-content-muted font-sans">
                      {t.sections.photos.slotAvailable}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef2.current?.click()}
                      className="mt-3 h-8 text-[11px] border-stone-300"
                    >
                      {t.sections.photos.btnSelect}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            CASO A: REPORTE DE DIAMANTE (certificateType === 'stone')
            Bloques estrictos:
            2. DIAMANTE DETALLES
            3. INFORMACIÓN ADICIONAL (DIAMANTE)
            4. GEMAS ADICIONALES DETALLES (Opcional)
        ═══════════════════════════════════════════════════════════════ */}
        {currentCertType === 'stone' && (
          <div className="space-y-8 animate-fade-in">
            {/* 2. DIAMANTE DETALLES */}
            <div className="bg-white rounded-2xl border border-[#E9E8E3] p-6 lg:p-8 shadow-elevation-sm space-y-6">
              <div className="border-b border-[#E9E8E3] pb-4">
                <h2 className="font-serif font-medium text-lg lg:text-xl text-content-titleDesktop">
                  2. {t.sections.diamond.title}
                </h2>
                <p className="text-xs text-content-body font-sans mt-0.5">
                  {t.sections.diamond.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Nature */}
                <div className="space-y-1.5">
                  <Label htmlFor="diamondDetail.nature" className="text-xs font-semibold text-content-titleDesktop font-sans">
                    {t.sections.diamond.nature}
                  </Label>
                  <select
                    id="diamondDetail.nature"
                    {...register('diamondDetail.nature')}
                    className="w-full h-9 rounded-md border border-[#E9E8E3] bg-surface-alt px-3 py-1 text-xs text-content-titleDesktop shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold font-sans"
                  >
                    {t.options.diamondNatures.map((n) => (
                      <option key={n.value} value={n.value}>{n.label}</option>
                    ))}
                  </select>
                </div>

                {/* Shape & Cut */}
                <div className="space-y-1.5 lg:col-span-2">
                  <Label htmlFor="diamondDetail.shapeAndCut" className="text-xs font-semibold text-content-titleDesktop font-sans">
                    {t.sections.diamond.shapeAndCut}
                  </Label>
                  <select
                    id="diamondDetail.shapeAndCut"
                    {...register('diamondDetail.shapeAndCut')}
                    className="w-full h-9 rounded-md border border-[#E9E8E3] bg-surface-alt px-3 py-1 text-xs text-content-titleDesktop shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold font-sans"
                  >
                    {t.options.diamondShapes.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                {/* Carat Weight */}
                <div className="space-y-1.5">
                  <Label htmlFor="diamondDetail.weight" className="text-xs font-semibold text-content-titleDesktop font-sans">
                    {t.sections.diamond.weight}
                  </Label>
                  <Input
                    id="diamondDetail.weight"
                    type="number"
                    step="0.01"
                    {...register('diamondDetail.weight', { 
                      setValueAs: (v) => v === '' || v === null || isNaN(Number(v)) ? undefined : Number(v) 
                    })}
                    placeholder={t.sections.diamond.weightPlaceholder}
                    className="bg-surface-alt border-[#E9E8E3] focus-visible:ring-gold text-xs"
                  />
                  {errors.diamondDetail?.weight && (
                    <p className="text-[11px] text-red-500 font-sans">{errors.diamondDetail.weight.message}</p>
                  )}
                </div>

                {/* Measurements */}
                <div className="space-y-1.5">
                  <Label htmlFor="diamondDetail.measurements" className="text-xs font-semibold text-content-titleDesktop font-sans">
                    {t.sections.diamond.measurements}
                  </Label>
                  <Input
                    id="diamondDetail.measurements"
                    {...register('diamondDetail.measurements')}
                    placeholder={t.sections.diamond.measurementsPlaceholder}
                    className="bg-surface-alt border-[#E9E8E3] focus-visible:ring-gold text-xs"
                  />
                </div>

                {/* Color Grade */}
                <div className="space-y-1.5">
                  <Label htmlFor="diamondDetail.color" className="text-xs font-semibold text-content-titleDesktop font-sans">
                    {t.sections.diamond.color}
                  </Label>
                  <select
                    id="diamondDetail.color"
                    {...register('diamondDetail.color')}
                    className="w-full h-9 rounded-md border border-[#E9E8E3] bg-surface-alt px-3 py-1 text-xs text-content-titleDesktop shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold font-sans"
                  >
                    {t.options.diamondColors.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                {/* Clarity Grade */}
                <div className="space-y-1.5">
                  <Label htmlFor="diamondDetail.clarityGrade" className="text-xs font-semibold text-content-titleDesktop font-sans">
                    {t.sections.diamond.clarity}
                  </Label>
                  <select
                    id="diamondDetail.clarityGrade"
                    {...register('diamondDetail.clarityGrade')}
                    className="w-full h-9 rounded-md border border-[#E9E8E3] bg-surface-alt px-3 py-1 text-xs text-content-titleDesktop shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold font-sans"
                  >
                    {t.options.diamondClarities.map((cl) => (
                      <option key={cl.value} value={cl.value}>{cl.label}</option>
                    ))}
                  </select>
                </div>

                {/* Cut Grade */}
                <div className="space-y-1.5">
                  <Label htmlFor="diamondDetail.cutGrade" className="text-xs font-semibold text-content-titleDesktop font-sans">
                    {t.sections.diamond.cutGrade}
                  </Label>
                  <select
                    id="diamondDetail.cutGrade"
                    {...register('diamondDetail.cutGrade')}
                    className="w-full h-9 rounded-md border border-[#E9E8E3] bg-surface-alt px-3 py-1 text-xs text-content-titleDesktop shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold font-sans"
                  >
                    {t.options.grades.map((g) => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
                </div>

                {/* Fluorescence */}
                <div className="space-y-1.5">
                  <Label htmlFor="diamondDetail.fluorescence" className="text-xs font-semibold text-content-titleDesktop font-sans">
                    {t.sections.diamond.fluorescence}
                  </Label>
                  <select
                    id="diamondDetail.fluorescence"
                    {...register('diamondDetail.fluorescence')}
                    className="w-full h-9 rounded-md border border-[#E9E8E3] bg-surface-alt px-3 py-1 text-xs text-content-titleDesktop shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold font-sans"
                  >
                    {t.options.fluorescences.map((fl) => (
                      <option key={fl.value} value={fl.value}>{fl.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 3. INFORMACIÓN ADICIONAL (DIAMANTE) */}
            <div className="bg-white rounded-2xl border border-[#E9E8E3] p-6 lg:p-8 shadow-elevation-sm space-y-6">
              <div className="border-b border-[#E9E8E3] pb-4">
                <h2 className="font-serif font-medium text-lg lg:text-xl text-content-titleDesktop">
                  3. {t.sections.diamondAdditional.title}
                </h2>
                <p className="text-xs text-content-body font-sans mt-0.5">
                  {t.sections.diamondAdditional.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Polish */}
                <div className="space-y-1.5">
                  <Label htmlFor="diamondAdditionalInfo.polish" className="text-xs font-semibold text-content-titleDesktop font-sans">
                    {t.sections.diamondAdditional.polish}
                  </Label>
                  <select
                    id="diamondAdditionalInfo.polish"
                    {...register('diamondAdditionalInfo.polish')}
                    className="w-full h-9 rounded-md border border-[#E9E8E3] bg-surface-alt px-3 py-1 text-xs text-content-titleDesktop shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold font-sans"
                  >
                    {t.options.grades.map((g) => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
                </div>

                {/* Symmetry */}
                <div className="space-y-1.5">
                  <Label htmlFor="diamondAdditionalInfo.symmetry" className="text-xs font-semibold text-content-titleDesktop font-sans">
                    {t.sections.diamondAdditional.symmetry}
                  </Label>
                  <select
                    id="diamondAdditionalInfo.symmetry"
                    {...register('diamondAdditionalInfo.symmetry')}
                    className="w-full h-9 rounded-md border border-[#E9E8E3] bg-surface-alt px-3 py-1 text-xs text-content-titleDesktop shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold font-sans"
                  >
                    {t.options.grades.map((g) => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
                </div>

                {/* Proportions */}
                <div className="space-y-1.5">
                  <Label htmlFor="diamondAdditionalInfo.proportions" className="text-xs font-semibold text-content-titleDesktop font-sans">
                    {t.sections.diamondAdditional.proportions}
                  </Label>
                  <Input
                    id="diamondAdditionalInfo.proportions"
                    {...register('diamondAdditionalInfo.proportions')}
                    placeholder={t.sections.diamondAdditional.proportionsPlaceholder}
                    className="bg-surface-alt border-[#E9E8E3] focus-visible:ring-gold text-xs"
                  />
                </div>
              </div>
            </div>

            {/* 4. GEMAS ADICIONALES DETALLES (Opcional) */}
            <div className="bg-white rounded-2xl border border-[#E9E8E3] overflow-hidden shadow-elevation-sm">
              <div 
                onClick={() => {
                  const next = !isAdditionalGemsOpen;
                  setIsAdditionalGemsOpen(next);
                  setValue('hasAdditionalGems', next);
                }}
                className="p-6 lg:p-8 flex items-center justify-between cursor-pointer hover:bg-stone-50/50 transition-colors"
              >
                <div>
                  <h2 className="font-serif font-medium text-lg lg:text-xl text-content-titleDesktop">
                    4. {t.sections.additionalGems.title}
                  </h2>
                  <p className="text-xs text-content-body font-sans mt-0.5">
                    {t.sections.additionalGems.subtitle}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase font-sans',
                    isAdditionalGemsOpen ? 'bg-gold/20 text-[#AF9052]' : 'bg-stone-100 text-stone-500'
                  )}>
                    {isAdditionalGemsOpen ? (lang === 'es' ? 'Activado' : 'Active') : (lang === 'es' ? 'Opcional' : 'Optional')}
                  </span>
                  {isAdditionalGemsOpen ? <ChevronUp className="w-5 h-5 text-stone-400" /> : <ChevronDown className="w-5 h-5 text-stone-400" />}
                </div>
              </div>

              {isAdditionalGemsOpen && (
                <div className="px-6 pb-6 lg:px-8 lg:pb-8 pt-2 border-t border-[#E9E8E3] space-y-5 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Nature */}
                    <div className="space-y-1.5">
                      <Label htmlFor="additionalGems.nature" className="text-xs font-semibold text-content-titleDesktop font-sans">
                        {t.sections.additionalGems.nature}
                      </Label>
                      <select
                        id="additionalGems.nature"
                        {...register('additionalGems.nature')}
                        className="w-full h-9 rounded-md border border-[#E9E8E3] bg-surface-alt px-3 py-1 text-xs text-content-titleDesktop shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold font-sans"
                      >
                        {t.options.gemNatures.map((n) => (
                          <option key={n.value} value={n.value}>{n.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Variety */}
                    <div className="space-y-1.5">
                      <Label htmlFor="additionalGems.variety" className="text-xs font-semibold text-content-titleDesktop font-sans">
                        {t.sections.additionalGems.variety}
                      </Label>
                      <Input
                        id="additionalGems.variety"
                        {...register('additionalGems.variety')}
                        placeholder={t.sections.additionalGems.varietyPlaceholder}
                        className="bg-surface-alt border-[#E9E8E3] focus-visible:ring-gold text-xs"
                      />
                    </div>

                    {/* Total Stones */}
                    <div className="space-y-1.5">
                      <Label htmlFor="additionalGems.totalStones" className="text-xs font-semibold text-content-titleDesktop font-sans">
                        {t.sections.additionalGems.totalStones}
                      </Label>
                      <Input
                        id="additionalGems.totalStones"
                        type="number"
                        {...register('additionalGems.totalStones', { 
                          setValueAs: (v) => v === '' || v === null || isNaN(Number(v)) ? undefined : Number(v) 
                        })}
                        placeholder={t.sections.additionalGems.totalStonesPlaceholder}
                        className="bg-surface-alt border-[#E9E8E3] focus-visible:ring-gold text-xs"
                      />
                    </div>

                    {/* Shape & Cut */}
                    <div className="space-y-1.5">
                      <Label htmlFor="additionalGems.shapeAndCut" className="text-xs font-semibold text-content-titleDesktop font-sans">
                        {t.sections.additionalGems.shapeAndCut}
                      </Label>
                      <Input
                        id="additionalGems.shapeAndCut"
                        {...register('additionalGems.shapeAndCut')}
                        placeholder={t.sections.additionalGems.shapeAndCutPlaceholder}
                        className="bg-surface-alt border-[#E9E8E3] focus-visible:ring-gold text-xs"
                      />
                    </div>

                    {/* Measurements */}
                    <div className="space-y-1.5">
                      <Label htmlFor="additionalGems.measurements" className="text-xs font-semibold text-content-titleDesktop font-sans">
                        {t.sections.additionalGems.measurements}
                      </Label>
                      <Input
                        id="additionalGems.measurements"
                        {...register('additionalGems.measurements')}
                        placeholder={t.sections.additionalGems.measurementsPlaceholder}
                        className="bg-surface-alt border-[#E9E8E3] focus-visible:ring-gold text-xs"
                      />
                    </div>

                    {/* Estimated Weight */}
                    <div className="space-y-1.5">
                      <Label htmlFor="additionalGems.estimatedWeight" className="text-xs font-semibold text-content-titleDesktop font-sans">
                        {t.sections.additionalGems.estimatedWeight}
                      </Label>
                      <Input
                        id="additionalGems.estimatedWeight"
                        type="number"
                        step="0.01"
                        {...register('additionalGems.estimatedWeight', { 
                          setValueAs: (v) => v === '' || v === null || isNaN(Number(v)) ? undefined : Number(v) 
                        })}
                        placeholder={t.sections.additionalGems.estimatedWeightPlaceholder}
                        className="bg-surface-alt border-[#E9E8E3] focus-visible:ring-gold text-xs"
                      />
                    </div>

                    {/* Color */}
                    <div className="space-y-1.5 lg:col-span-2">
                      <Label htmlFor="additionalGems.color" className="text-xs font-semibold text-content-titleDesktop font-sans">
                        {t.sections.additionalGems.color}
                      </Label>
                      <Input
                        id="additionalGems.color"
                        {...register('additionalGems.color')}
                        placeholder={t.sections.additionalGems.colorPlaceholder}
                        className="bg-surface-alt border-[#E9E8E3] focus-visible:ring-gold text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            CASO B: REPORTE DE JOYA (certificateType === 'jewelry')
            Bloques estrictos:
            2. DESCRIPCIÓN GENERAL JOYA
            3. GEMA DETALLES
            4. DIAMANTES ADICIONALES DETALLES (Opcional)
        ═══════════════════════════════════════════════════════════════ */}
        {currentCertType === 'jewelry' && (
          <div className="space-y-8 animate-fade-in">

            {/* 3. GEMA DETALLES */}
            <div className="bg-white rounded-2xl border border-[#E9E8E3] p-6 lg:p-8 shadow-elevation-sm space-y-6">
              <div className="border-b border-[#E9E8E3] pb-4">
                <h2 className="font-serif font-medium text-lg lg:text-xl text-content-titleDesktop">
                  3. {t.sections.gem.title}
                </h2>
                <p className="text-xs text-content-body font-sans mt-0.5">
                  {t.sections.gem.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Nature */}
                <div className="space-y-1.5">
                  <Label htmlFor="gemDetail.nature" className="text-xs font-semibold text-content-titleDesktop font-sans">
                    {t.sections.gem.nature}
                  </Label>
                  <select
                    id="gemDetail.nature"
                    {...register('gemDetail.nature')}
                    className="w-full h-9 rounded-md border border-[#E9E8E3] bg-surface-alt px-3 py-1 text-xs text-content-titleDesktop shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold font-sans"
                  >
                    {t.options.gemNatures.map((n) => (
                      <option key={n.value} value={n.value}>{n.label}</option>
                    ))}
                  </select>
                </div>

                {/* Variety */}
                <div className="space-y-1.5 lg:col-span-2">
                  <Label htmlFor="gemDetail.variety" className="text-xs font-semibold text-content-titleDesktop font-sans">
                    {t.sections.gem.variety}
                  </Label>
                  <select
                    id="gemDetail.variety"
                    {...register('gemDetail.variety')}
                    className="w-full h-9 rounded-md border border-[#E9E8E3] bg-surface-alt px-3 py-1 text-xs text-content-titleDesktop shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold font-sans"
                  >
                    {t.options.gemVarieties.map((v) => (
                      <option key={v.value} value={v.value}>{v.label}</option>
                    ))}
                  </select>
                </div>

                {/* Shape & Cut */}
                <div className="space-y-1.5 lg:col-span-2">
                  <Label htmlFor="gemDetail.shapeAndCut" className="text-xs font-semibold text-content-titleDesktop font-sans">
                    {t.sections.gem.shapeAndCut}
                  </Label>
                  <select
                    id="gemDetail.shapeAndCut"
                    {...register('gemDetail.shapeAndCut')}
                    className="w-full h-9 rounded-md border border-[#E9E8E3] bg-surface-alt px-3 py-1 text-xs text-content-titleDesktop shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold font-sans"
                  >
                    {t.options.gemShapes.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                {/* Carat Weight */}
                <div className="space-y-1.5">
                  <Label htmlFor="gemDetail.weight" className="text-xs font-semibold text-content-titleDesktop font-sans">
                    {t.sections.gem.weight}
                  </Label>
                  <Input
                    id="gemDetail.weight"
                    type="number"
                    step="0.01"
                    {...register('gemDetail.weight', { 
                      setValueAs: (v) => v === '' || v === null || isNaN(Number(v)) ? undefined : Number(v) 
                    })}
                    placeholder={t.sections.gem.weightPlaceholder}
                    className="bg-surface-alt border-[#E9E8E3] focus-visible:ring-gold text-xs"
                  />
                  {errors.gemDetail?.weight && (
                    <p className="text-[11px] text-red-500 font-sans">{errors.gemDetail.weight.message}</p>
                  )}
                </div>

                {/* Measurements */}
                <div className="space-y-1.5">
                  <Label htmlFor="gemDetail.measurements" className="text-xs font-semibold text-content-titleDesktop font-sans">
                    {t.sections.gem.measurements}
                  </Label>
                  <Input
                    id="gemDetail.measurements"
                    {...register('gemDetail.measurements')}
                    placeholder={t.sections.gem.measurementsPlaceholder}
                    className="bg-surface-alt border-[#E9E8E3] focus-visible:ring-gold text-xs"
                  />
                </div>

                {/* Color */}
                <div className="space-y-1.5">
                  <Label htmlFor="gemDetail.color" className="text-xs font-semibold text-content-titleDesktop font-sans">
                    {t.sections.gem.color}
                  </Label>
                  <Input
                    id="gemDetail.color"
                    {...register('gemDetail.color')}
                    placeholder={t.sections.gem.colorPlaceholder}
                    className="bg-surface-alt border-[#E9E8E3] focus-visible:ring-gold text-xs"
                  />
                </div>

                {/* Transparency */}
                <div className="space-y-1.5">
                  <Label htmlFor="gemDetail.transparency" className="text-xs font-semibold text-content-titleDesktop font-sans">
                    {t.sections.gem.transparency}
                  </Label>
                  <select
                    id="gemDetail.transparency"
                    {...register('gemDetail.transparency')}
                    className="w-full h-9 rounded-md border border-[#E9E8E3] bg-surface-alt px-3 py-1 text-xs text-content-titleDesktop shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold font-sans"
                  >
                    {t.options.transparencies.map((tr) => (
                      <option key={tr.value} value={tr.value}>{tr.label}</option>
                    ))}
                  </select>
                </div>

                {/* Cut Grade */}
                <div className="space-y-1.5">
                  <Label htmlFor="gemDetail.cutGrade" className="text-xs font-semibold text-content-titleDesktop font-sans">
                    {t.sections.gem.cutGrade}
                  </Label>
                  <select
                    id="gemDetail.cutGrade"
                    {...register('gemDetail.cutGrade')}
                    className="w-full h-9 rounded-md border border-[#E9E8E3] bg-surface-alt px-3 py-1 text-xs text-content-titleDesktop shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold font-sans"
                  >
                    {t.options.grades.map((g) => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
                </div>

                {/* Treatment / Remarks */}
                <div className="space-y-1.5 lg:col-span-3">
                  <Label htmlFor="gemDetail.treatment" className="text-xs font-semibold text-content-titleDesktop font-sans">
                    {t.sections.gem.treatment}
                  </Label>
                  <Input
                    id="gemDetail.treatment"
                    {...register('gemDetail.treatment')}
                    placeholder={t.sections.gem.treatmentPlaceholder}
                    className="bg-surface-alt border-[#E9E8E3] focus-visible:ring-gold text-xs"
                  />
                </div>
              </div>
            </div>

            {/* 4. DIAMANTES ADICIONALES DETALLES (Opcional) */}
            <div className="bg-white rounded-2xl border border-[#E9E8E3] overflow-hidden shadow-elevation-sm">
              <div 
                onClick={() => {
                  const next = !isAdditionalDiamondsOpen;
                  setIsAdditionalDiamondsOpen(next);
                  setValue('hasAdditionalDiamonds', next);
                }}
                className="p-6 lg:p-8 flex items-center justify-between cursor-pointer hover:bg-stone-50/50 transition-colors"
              >
                <div>
                  <h2 className="font-serif font-medium text-lg lg:text-xl text-content-titleDesktop">
                    4. {t.sections.additionalDiamonds.title}
                  </h2>
                  <p className="text-xs text-content-body font-sans mt-0.5">
                    {t.sections.additionalDiamonds.subtitle}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase font-sans',
                    isAdditionalDiamondsOpen ? 'bg-gold/20 text-[#AF9052]' : 'bg-stone-100 text-stone-500'
                  )}>
                    {isAdditionalDiamondsOpen ? (lang === 'es' ? 'Activado' : 'Active') : (lang === 'es' ? 'Opcional' : 'Optional')}
                  </span>
                  {isAdditionalDiamondsOpen ? <ChevronUp className="w-5 h-5 text-stone-400" /> : <ChevronDown className="w-5 h-5 text-stone-400" />}
                </div>
              </div>

              {isAdditionalDiamondsOpen && (
                <div className="px-6 pb-6 lg:px-8 lg:pb-8 pt-2 border-t border-[#E9E8E3] space-y-5 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Nature */}
                    <div className="space-y-1.5">
                      <Label htmlFor="additionalDiamonds.nature" className="text-xs font-semibold text-content-titleDesktop font-sans">
                        {t.sections.additionalDiamonds.nature}
                      </Label>
                      <select
                        id="additionalDiamonds.nature"
                        {...register('additionalDiamonds.nature')}
                        className="w-full h-9 rounded-md border border-[#E9E8E3] bg-surface-alt px-3 py-1 text-xs text-content-titleDesktop shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold font-sans"
                      >
                        {t.options.diamondNatures.map((n) => (
                          <option key={n.value} value={n.value}>{n.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Total Stones */}
                    <div className="space-y-1.5">
                      <Label htmlFor="additionalDiamonds.totalStones" className="text-xs font-semibold text-content-titleDesktop font-sans">
                        {t.sections.additionalDiamonds.totalStones}
                      </Label>
                      <Input
                        id="additionalDiamonds.totalStones"
                        type="number"
                        {...register('additionalDiamonds.totalStones', { 
                          setValueAs: (v) => v === '' || v === null || isNaN(Number(v)) ? undefined : Number(v) 
                        })}
                        placeholder={t.sections.additionalDiamonds.totalStonesPlaceholder}
                        className="bg-surface-alt border-[#E9E8E3] focus-visible:ring-gold text-xs"
                      />
                    </div>

                    {/* Shape & Cut */}
                    <div className="space-y-1.5 lg:col-span-2">
                      <Label htmlFor="additionalDiamonds.shapeAndCut" className="text-xs font-semibold text-content-titleDesktop font-sans">
                        {t.sections.additionalDiamonds.shapeAndCut}
                      </Label>
                      <Input
                        id="additionalDiamonds.shapeAndCut"
                        {...register('additionalDiamonds.shapeAndCut')}
                        placeholder={t.sections.additionalDiamonds.shapeAndCutPlaceholder}
                        className="bg-surface-alt border-[#E9E8E3] focus-visible:ring-gold text-xs"
                      />
                    </div>

                    {/* Estimated Measurements */}
                    <div className="space-y-1.5">
                      <Label htmlFor="additionalDiamonds.measurements" className="text-xs font-semibold text-content-titleDesktop font-sans">
                        {t.sections.additionalDiamonds.measurements}
                      </Label>
                      <Input
                        id="additionalDiamonds.measurements"
                        {...register('additionalDiamonds.measurements')}
                        placeholder={t.sections.additionalDiamonds.measurementsPlaceholder}
                        className="bg-surface-alt border-[#E9E8E3] focus-visible:ring-gold text-xs"
                      />
                    </div>

                    {/* Estimated Weight */}
                    <div className="space-y-1.5">
                      <Label htmlFor="additionalDiamonds.estimatedWeight" className="text-xs font-semibold text-content-titleDesktop font-sans">
                        {t.sections.additionalDiamonds.estimatedWeight}
                      </Label>
                      <Input
                        id="additionalDiamonds.estimatedWeight"
                        type="number"
                        step="0.01"
                        {...register('additionalDiamonds.estimatedWeight', { 
                          setValueAs: (v) => v === '' || v === null || isNaN(Number(v)) ? undefined : Number(v) 
                        })}
                        placeholder={t.sections.additionalDiamonds.estimatedWeightPlaceholder}
                        className="bg-surface-alt border-[#E9E8E3] focus-visible:ring-gold text-xs"
                      />
                    </div>

                    {/* Estimated Color */}
                    <div className="space-y-1.5">
                      <Label htmlFor="additionalDiamonds.estimatedColor" className="text-xs font-semibold text-content-titleDesktop font-sans">
                        {t.sections.additionalDiamonds.estimatedColor}
                      </Label>
                      <Input
                        id="additionalDiamonds.estimatedColor"
                        {...register('additionalDiamonds.estimatedColor')}
                        placeholder={t.sections.additionalDiamonds.estimatedColorPlaceholder}
                        className="bg-surface-alt border-[#E9E8E3] focus-visible:ring-gold text-xs"
                      />
                    </div>

                    {/* Estimated Clarity */}
                    <div className="space-y-1.5">
                      <Label htmlFor="additionalDiamonds.estimatedClarity" className="text-xs font-semibold text-content-titleDesktop font-sans">
                        {t.sections.additionalDiamonds.estimatedClarity}
                      </Label>
                      <Input
                        id="additionalDiamonds.estimatedClarity"
                        {...register('additionalDiamonds.estimatedClarity')}
                        placeholder={t.sections.additionalDiamonds.estimatedClarityPlaceholder}
                        className="bg-surface-alt border-[#E9E8E3] focus-visible:ring-gold text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            BARRA DE ACCIONES INFERIOR (STICKY FOOTER)
        ═══════════════════════════════════════════════════════════════ */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E9E8E3] shadow-elevation-lg py-4 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Status indicator on left */}
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  'w-3 h-3 rounded-full shrink-0 transition-colors',
                  isValid
                    ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                    : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse'
                )}
              />
              <span className="text-xs font-medium text-content-body font-sans">
                {isValid ? t.footer.validStatus : t.footer.invalidStatus}
              </span>
            </div>

            {/* Action buttons on right */}
            <div className="flex flex-wrap items-center justify-end gap-3 w-full sm:w-auto">
              {/* 1. Guardar Borrador */}
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => handleSaveOrPublish('draft')}
                className="h-11 px-5 text-xs font-semibold tracking-wider font-sans border-[#E9E8E3] text-content-titleDesktop hover:bg-stone-50 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin text-stone-500" />
                ) : (
                  <Save className="w-4 h-4 mr-2 text-stone-500" />
                )}
                <span>{t.footer.saveDraft}</span>
              </Button>

              {/* 2. Previsualizar Certificado */}
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => setIsPreviewOpen(true)}
                className="h-11 px-5 text-xs font-semibold tracking-wider font-sans border-gold/40 text-gold hover:bg-gold/5 transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4 mr-2 text-gold" />
                <span>{t.footer.preview}</span>
              </Button>

              {/* 3. Emitir y Publicar Certificado */}
              <Button
                type="button"
                disabled={isSubmitting || !isValid}
                onClick={() => handleSaveOrPublish('active')}
                className={cn(
                  'h-11 px-6 text-xs font-semibold tracking-wider font-sans rounded-lg shadow-btn-login transition-all text-white',
                  isValid && !isSubmitting
                    ? 'bg-brandBlue-action hover:bg-brandBlue-action/90 active:scale-[0.99] cursor-pointer'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                )}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin text-white" />
                ) : (
                  <Send className="w-4 h-4 mr-2 text-gold-champagne" />
                )}
                <span>{t.footer.issue}</span>
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Previsualizador Modal */}
      <CertificatePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        data={watch()}
        image1PreviewUrl={image1Url}
        image2PreviewUrl={image2Url}
      />
    </>
  );
}
