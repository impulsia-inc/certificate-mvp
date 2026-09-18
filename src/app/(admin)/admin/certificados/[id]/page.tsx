import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { CertificateForm } from '@/components/certificates/certificate-form';
import { getCertificate, updateCertificate } from '@/features/certificates/actions/certificate.actions';
import { EditActions } from './edit-actions';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getCertificate(id);
  const title = result.success ? `Editar: ${result.data.reference}` : 'Certificación no encontrada';
  return { title };
}

export default async function EditCertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getCertificate(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const certificate = result.data;

  async function handleSubmit(data: Record<string, unknown>) {
    'use server';
    await updateCertificate(id, {
      jewelry: data.jewelry as Record<string, unknown> | undefined,
      status: data.status as 'draft' | 'active' | 'revoked' | undefined,
      issuedAt: data.issuedAt as string | undefined,
      certificateNumber: data.certificateNumber as string | undefined,
    });
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader title="Editar Certificación" backHref="/admin/certificados" />
        <EditActions id={id} status={certificate.status} />
      </div>
      
      <CertificateForm initialData={certificate} onSubmit={handleSubmit} />
    </div>
  );
}
