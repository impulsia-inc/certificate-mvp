'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  FileEdit,
  AlertTriangle,
  Award,
  Search,
  Plus,
  Download,
  Eye,
  Pencil,
  FileSpreadsheet,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Gem,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CertificateWithJewelry, CertificateStatus, PaginatedResult } from '@/types';

interface CertificateManagementViewProps {
  initialData: PaginatedResult<CertificateWithJewelry>;
  stats: {
    total: number;
    active: number;
    revoked: number;
    draft: number;
  };
}

export function CertificateManagementView({
  initialData,
  stats,
}: CertificateManagementViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || 'all'
  );
  const [showActive, setShowActive] = useState<boolean>(true);
  const [showDraft, setShowDraft] = useState<boolean>(true);
  const [showRevoked, setShowRevoked] = useState<boolean>(true);

  // Client-side quick filter on current page data or trigger server pagination
  const updateQuery = (params: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, val] of Object.entries(params)) {
      if (val === null || val === '' || val === 'all') {
        next.delete(key);
      } else {
        next.set(key, val);
      }
    }
    startTransition(() => {
      router.push(`/admin?${next.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery({ search: searchInput.trim(), page: '1' });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    updateQuery({ category, page: '1' });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    updateQuery({ page: newPage.toString() });
  };

  // Export to CSV function
  const handleExportCSV = () => {
    if (initialData.data.length === 0) {
      alert('No hay registros disponibles para exportar.');
      return;
    }

    const headers = [
      'Referencia',
      'Nombre Joya',
      'Categoría',
      'Material',
      'Piedra',
      'Peso Piedra (ct)',
      'Estado',
      'Fecha Emisión',
    ];

    const rows = initialData.data.map((c) => [
      c.reference,
      `"${c.jewelry.name.replace(/"/g, '""')}"`,
      c.jewelry.category || '',
      c.jewelry.material || '',
      c.jewelry.stoneType || '',
      c.jewelry.stoneWeight || '',
      c.status,
      c.issuedAt,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FYN_Certificados_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter local items by status checkboxes
  const filteredData = initialData.data.filter((item) => {
    if (item.status === 'active' && !showActive) return false;
    if (item.status === 'draft' && !showDraft) return false;
    if (item.status === 'revoked' && !showRevoked) return false;
    return true;
  });

  const totalPages = Math.ceil(initialData.total / initialData.pageSize) || 1;
  const startItem = initialData.total === 0 ? 0 : (initialData.page - 1) * initialData.pageSize + 1;
  const endItem = Math.min(initialData.page * initialData.pageSize, initialData.total);

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* ─── 1. ENCABEZADO DE LA VISTA ─── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#E9E8E3] pb-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-[10px] font-semibold tracking-[0.16em] uppercase text-gold-intense">
            <span>PROTOCOLO ISO/IEC 17025 · LIBRO MAESTRO VOL. XXVI</span>
          </div>

          <h1 className="font-serif font-medium text-[28px] sm:text-[34px] tracking-title-desktop text-content-titleDesktop leading-tight">
            Laboratorio Central F&N — Gestión de Certificados
          </h1>

          <p className="text-[13px] text-content-body max-w-3xl leading-relaxed">
            <strong className="text-content-titleDesktop font-semibold">Sesión Activa:</strong> M.
            Valenzuela (Gemóloga Titular D.G.G.) · Registro y administración técnica de certificados
            gemológicos oficiales con verificación pericial.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleExportCSV}
            className="h-11 px-5 inline-flex items-center gap-2 bg-white hover:bg-surface-alt border border-[#E9E8E3] rounded-md text-[12px] font-semibold tracking-[0.1em] uppercase text-content-titleDesktop transition-all shadow-subtle cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-gold" />
            <span>Exportar Registros</span>
          </button>

          <Link
            href="/admin/certificados/nuevo"
            className="h-11 px-6 inline-flex items-center gap-2 bg-brandBlue-action hover:bg-brandBlue-action/90 text-white rounded-md text-[12px] font-semibold tracking-[0.1em] uppercase transition-all shadow-btn-login cursor-pointer"
          >
            <Plus className="w-4 h-4 text-gold-champagne" />
            <span>+ Nuevo Certificado</span>
          </Link>
        </div>
      </div>

      {/* ─── 2. TARJETAS DE MÉTRICAS (KPIs) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        {/* KPI 1: Total Expedidos */}
        <div className="bg-white rounded-xl border border-[#E9E8E3] p-5 shadow-elevation-sm space-y-3">
          <div className="flex items-center justify-between text-content-muted">
            <span className="text-[10px] font-semibold tracking-[0.14em] uppercase font-sans">
              Total Expedidos
            </span>
            <div className="w-6 h-6 rounded-full bg-gold/15 flex items-center justify-center text-gold-intense">
              <CheckCircle2 className="w-3.5 h-3.5 text-gold" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-bold text-content-titleDesktop tracking-tight">
              {stats.total.toLocaleString('es-CO')}
            </span>
            <span className="text-[11px] text-emerald-700 font-medium">
              {stats.total > 0 ? '+18 este mes' : 'Sin actividad'}
            </span>
          </div>
          <p className="text-[11px] text-content-muted border-t border-stone-100 pt-2">
            Expedientes históricos validados
          </p>
        </div>

        {/* KPI 2: Activos en Circulación */}
        <div className="bg-white rounded-xl border border-[#E9E8E3] p-5 shadow-elevation-sm space-y-3">
          <div className="flex items-center justify-between text-content-muted">
            <span className="text-[10px] font-semibold tracking-[0.14em] uppercase font-sans">
              Activos en Circulación
            </span>
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-bold text-content-titleDesktop tracking-tight">
              {stats.active.toLocaleString('es-CO')}
            </span>
            <span className="text-[11px] text-content-muted">
              ({stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : 0}% vigencia)
            </span>
          </div>
          <p className="text-[11px] text-content-muted border-t border-stone-100 pt-2">
            Certificados vigentes sin alteración
          </p>
        </div>

        {/* KPI 3: Borradores en Análisis */}
        <div className="bg-white rounded-xl border border-[#E9E8E3] p-5 shadow-elevation-sm space-y-3">
          <div className="flex items-center justify-between text-content-muted">
            <span className="text-[10px] font-semibold tracking-[0.14em] uppercase font-sans">
              Borradores en Análisis
            </span>
            <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
              <FileEdit className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-bold text-content-titleDesktop tracking-tight">
              {stats.draft.toLocaleString('es-CO')}
            </span>
            <span className="text-[11px] text-amber-700 font-medium">
              {stats.draft > 0 ? `${stats.draft} pendientes de firma` : '0 pendientes'}
            </span>
          </div>
          <p className="text-[11px] text-content-muted border-t border-stone-100 pt-2">
            En proceso de medición técnica
          </p>
        </div>

        {/* KPI 4: Revocados */}
        <div className="bg-white rounded-xl border border-[#E9E8E3] p-5 shadow-elevation-sm space-y-3">
          <div className="flex items-center justify-between text-content-muted">
            <span className="text-[10px] font-semibold tracking-[0.14em] uppercase font-sans">
              Revocados
            </span>
            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-700">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-bold text-content-titleDesktop tracking-tight">
              {stats.revoked.toLocaleString('es-CO')}
            </span>
            <span className="text-[11px] text-red-600 font-medium">
              ({stats.total > 0 ? ((stats.revoked / stats.total) * 100).toFixed(1) : 0}% reclamos)
            </span>
          </div>
          <p className="text-[11px] text-content-muted border-t border-stone-100 pt-2">
            Anulados por dictamen pericial
          </p>
        </div>
      </div>

      {/* ─── 3. FILTROS Y BARRA DE BÚSQUEDA ─── */}
      <div className="bg-white rounded-xl border border-[#E9E8E3] p-5 shadow-elevation-sm space-y-4">
        {/* Row 1: Search + Category Pills */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-2xl">
            <Search className="w-4 h-4 text-gold absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Buscar por Nº Certificado, gema, inspector o descripción..."
              className="w-full h-11 pl-10 pr-24 text-[13px] bg-surface-alt border border-[#E9E8E3] rounded-md focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold placeholder:text-content-placeholder text-content-titleDesktop transition-all font-sans"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-white hover:bg-surface-alt text-[11px] font-semibold uppercase tracking-wider text-content-titleDesktop border border-[#E9E8E3] rounded transition-colors"
            >
              Buscar
            </button>
          </form>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {[
              { id: 'all', label: `TODOS (${stats.total})` },
              { id: 'Diamante', label: 'DIAMANTES' },
              { id: 'Joya', label: 'JOYERÍA' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={cn(
                  'px-3.5 py-2 rounded-md text-[11px] font-semibold tracking-[0.1em] uppercase transition-all whitespace-nowrap cursor-pointer',
                  selectedCategory === cat.id
                    ? 'bg-brandBlue-action text-white shadow-subtle'
                    : 'bg-surface-alt text-content-body hover:bg-surface-sec border border-transparent'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Status Checkboxes & Period */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-stone-100 text-[12px] text-content-body">
          <div className="flex items-center gap-5">
            <span className="font-semibold text-content-titleDesktop uppercase tracking-wider text-[11px]">
              ESTADO:
            </span>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showActive}
                onChange={(e) => setShowActive(e.target.checked)}
                className="w-3.5 h-3.5 rounded-[2.5px] border-[#C5C6CE] text-brandBlue-action focus:ring-gold/30"
              />
              <span>Activos</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showDraft}
                onChange={(e) => setShowDraft(e.target.checked)}
                className="w-3.5 h-3.5 rounded-[2.5px] border-[#C5C6CE] text-brandBlue-action focus:ring-gold/30"
              />
              <span>Borradores</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showRevoked}
                onChange={(e) => setShowRevoked(e.target.checked)}
                className="w-3.5 h-3.5 rounded-[2.5px] border-[#C5C6CE] text-brandBlue-action focus:ring-gold/30"
              />
              <span>Revocados</span>
            </label>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="text-[11px] font-semibold text-content-muted uppercase tracking-wider">
              PERÍODO:
            </span>
            <select
              className="bg-surface-alt border border-[#E9E8E3] rounded px-2.5 py-1 text-[12px] text-content-titleDesktop font-medium focus:outline-none focus:ring-1 focus:ring-gold/50"
              defaultValue="2026"
            >
              <option value="2026">2026 (Año Fiscal)</option>
              <option value="2025">2025 (Histórico)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── 4. TABLA DE CERTIFICADOS ─── */}
      <div className="bg-white rounded-xl border border-[#E9E8E3] shadow-elevation-sm overflow-hidden">
        {filteredData.length === 0 ? (
          /* Empty State */
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto text-gold">
              <Award className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-medium text-[20px] text-content-titleDesktop">
                No se encontraron certificados registrados
              </h3>
              <p className="text-[13px] text-content-muted max-w-md mx-auto">
                {initialData.total === 0
                  ? 'Actualmente la base de datos se encuentra sin registros. Comience creando la primera certificación pericial.'
                  : 'No hay certificaciones que coincidan con los filtros aplicados en esta consulta.'}
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/admin/certificados/nuevo"
                className="inline-flex items-center gap-2 h-11 px-6 bg-brandBlue-action hover:bg-brandBlue-action/90 text-white rounded-md text-[12px] font-semibold tracking-[0.1em] uppercase transition-all shadow-btn-login"
              >
                <Plus className="w-4 h-4 text-gold-champagne" />
                <span>+ Registrar Primer Certificado</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-alt/70 border-b border-[#E9E8E3] text-[10px] font-semibold tracking-[0.14em] uppercase text-content-muted font-sans">
                  <th className="py-3.5 px-4 lg:px-6">IDENTIFICADOR / HASH</th>
                  <th className="py-3.5 px-3">MUESTRA</th>
                  <th className="py-3.5 px-4">CATEGORÍA</th>
                  <th className="py-3.5 px-6">DESCRIPCIÓN TÉCNICA / GEMOLÓGICA</th>
                  <th className="py-3.5 px-4">FECHA EMISIÓN</th>
                  <th className="py-3.5 px-4">GEMÓLOGO TITULAR</th>
                  <th className="py-3.5 px-4 text-center">ESTADO</th>
                  <th className="py-3.5 px-4 text-center">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E8E3] text-[13px] font-sans">
                {filteredData.map((cert) => {
                  const isRevoked = cert.status === 'revoked';
                  const isDraft = cert.status === 'draft';
                  const isActive = cert.status === 'active';

                  const dateFormatted = new Date(cert.issuedAt).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  });

                  // Build gemological summary string
                  const gemSummary = [
                    cert.jewelry.stoneType ? cert.jewelry.stoneType : null,
                    cert.jewelry.stoneWeight ? `${cert.jewelry.stoneWeight} ct` : null,
                    cert.jewelry.stoneColor ? `Color ${cert.jewelry.stoneColor}` : null,
                    cert.jewelry.stoneClarity ? `Claridad ${cert.jewelry.stoneClarity}` : null,
                    cert.jewelry.metalType || cert.jewelry.material || null,
                  ]
                    .filter(Boolean)
                    .join(' • ');

                  return (
                    <tr
                      key={cert.id}
                      className="hover:bg-surface-alt/40 transition-colors group"
                    >
                      {/* Col 1: Reference + Hash */}
                      <td className="py-4 px-4 lg:px-6 align-top">
                        <Link
                          href={`/admin/certificados/${cert.id}`}
                          className="font-mono font-bold text-[13px] text-content-titleDesktop hover:text-gold transition-colors block"
                        >
                          {cert.reference}
                        </Link>
                        <span className="text-[10px] font-mono text-content-muted tracking-wider block mt-0.5">
                          HASH: {cert.hash || `${cert.id.slice(0, 6)}...${cert.id.slice(-4)}`}
                        </span>
                      </td>

                      {/* Col 2: Thumbnail Image */}
                      <td className="py-4 px-3 align-top">
                        <div className="relative w-12 h-12 rounded-lg border border-[#E9E8E3] overflow-hidden bg-surface-alt shrink-0 flex items-center justify-center shadow-subtle">
                          {cert.thumbnailUrl ? (
                            <Image
                              src={cert.thumbnailUrl}
                              alt={cert.jewelry.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Gem className="w-5 h-5 text-gold/60" />
                          )}
                        </div>
                      </td>

                      {/* Col 3: Category Badge */}
                      <td className="py-4 px-4 align-top">
                        <span className="inline-block px-2.5 py-1 rounded border border-[#E9E8E3] bg-surface-alt text-[10px] font-semibold tracking-wider uppercase text-content-titleDesktop">
                          {cert.jewelry.category || 'GEMA'}
                        </span>
                      </td>

                      {/* Col 4: Technical Description */}
                      <td className="py-4 px-6 align-top max-w-sm">
                        <p
                          className={cn(
                            'font-semibold text-[14px] leading-snug',
                            isRevoked
                              ? 'text-red-700'
                              : 'text-content-titleDesktop group-hover:text-gold transition-colors'
                          )}
                        >
                          {cert.jewelry.name}
                        </p>
                        <p className="text-[12px] text-content-body leading-relaxed mt-1">
                          {gemSummary || cert.jewelry.description || 'Sin ficha complementaria'}
                        </p>
                      </td>

                      {/* Col 5: Date */}
                      <td className="py-4 px-4 align-top text-content-body text-[12px] whitespace-nowrap uppercase">
                        {dateFormatted}
                      </td>

                      {/* Col 6: Gemologist */}
                      <td className="py-4 px-4 align-top whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-surface-panel text-white text-[10px] font-semibold flex items-center justify-center shrink-0">
                            MV
                          </div>
                          <span className="text-[12px] text-content-body font-medium">
                            {cert.gemologist || 'M. Valenzuela (D.G.G.)'}
                          </span>
                        </div>
                      </td>

                      {/* Col 7: Status Badge */}
                      <td className="py-4 px-4 align-top text-center whitespace-nowrap">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-[0.08em] uppercase',
                            isActive && 'bg-emerald-50 text-emerald-800 border border-emerald-200',
                            isDraft && 'bg-amber-50 text-amber-800 border border-amber-200',
                            isRevoked && 'bg-red-50 text-red-800 border border-red-200'
                          )}
                        >
                          <span
                            className={cn(
                              'w-1.5 h-1.5 rounded-full',
                              isActive && 'bg-emerald-500',
                              isDraft && 'bg-amber-500',
                              isRevoked && 'bg-red-500'
                            )}
                          />
                          {isActive && 'ACTIVO'}
                          {isDraft && 'BORRADOR'}
                          {isRevoked && 'REVOCADO'}
                        </span>
                      </td>

                      {/* Col 8: Actions */}
                      <td className="py-4 px-4 align-top text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            href={`/verificar/${cert.reference}`}
                            target="_blank"
                            title="Ver vista pública del certificado"
                            className="p-1.5 text-content-muted hover:text-content-titleDesktop rounded hover:bg-surface-alt transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/certificados/${cert.id}`}
                            title="Editar / Gestionar"
                            className="p-1.5 text-content-muted hover:text-content-titleDesktop rounded hover:bg-surface-alt transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ─── 5. PAGINACIÓN INFERIOR ─── */}
        <div className="p-4 lg:px-6 border-t border-[#E9E8E3] flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-content-muted">
          <div>
            Mostrando{' '}
            <strong className="text-content-titleDesktop font-semibold">
              {startItem} – {endItem}
            </strong>{' '}
            de{' '}
            <strong className="text-content-titleDesktop font-semibold">
              {initialData.total.toLocaleString('es-CO')}
            </strong>{' '}
            certificados · {initialData.pageSize} registros por página
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handlePageChange(initialData.page - 1)}
              disabled={initialData.page <= 1}
              className="p-1.5 rounded border border-[#E9E8E3] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-alt transition-colors"
              aria-label="Página anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              // Show first, last, and around current
              if (p === 1 || p === totalPages || (p >= initialData.page - 1 && p <= initialData.page + 1)) {
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePageChange(p)}
                    className={cn(
                      'w-8 h-8 rounded text-[12px] font-semibold transition-all cursor-pointer',
                      initialData.page === p
                        ? 'bg-brandBlue-action text-white shadow-subtle'
                        : 'border border-[#E9E8E3] hover:bg-surface-alt text-content-body'
                    )}
                  >
                    {p}
                  </button>
                );
              }
              if (p === 2 && initialData.page > 3) {
                return <span key="dots-1" className="px-1 text-content-muted">...</span>;
              }
              if (p === totalPages - 1 && initialData.page < totalPages - 2) {
                return <span key="dots-2" className="px-1 text-content-muted">...</span>;
              }
              return null;
            })}

            <button
              type="button"
              onClick={() => handlePageChange(initialData.page + 1)}
              disabled={initialData.page >= totalPages}
              className="p-1.5 rounded border border-[#E9E8E3] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-alt transition-colors"
              aria-label="Página siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── 6. BANNER CRIPTOGRÁFICO DE SEGURIDAD AL PIE ─── */}
      <div className="p-4 lg:p-5 rounded-xl bg-surface-alt/70 border border-[#E9E8E3] flex items-start gap-3.5 text-[12px] leading-relaxed text-content-body">
        <ShieldCheck className="w-5 h-5 text-gold shrink-0 mt-0.5" />
        <p>
          <strong className="text-content-titleDesktop font-semibold uppercase tracking-wider text-[11px] block sm:inline">
            PROTOCOLO DE NO-REPUDIO CRIPTOGRÁFICO:{' '}
          </strong>
          Cada certificado emitido sincroniza de manera instantánea el vector biométrico de la gema
          (mapa de inclusiones, densidad óptica y curva espectral Raman) con el ledger seguro de la
          Federación de Laboratorios FYN. Toda modificación de parámetros posteriores a la firma
          genera una revocación automática del código QR.
        </p>
      </div>
    </div>
  );
}
