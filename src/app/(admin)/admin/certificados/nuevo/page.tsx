'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CertificateForm } from '@/components/certificates/certificate-form';

export default function NewCertificatePage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/certificados"
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-stone-500 hover:text-stone-800 transition-colors font-sans"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al panel de certificados</span>
        </Link>
      </div>

      {/* Main Form */}
      <CertificateForm />
    </div>
  );
}
