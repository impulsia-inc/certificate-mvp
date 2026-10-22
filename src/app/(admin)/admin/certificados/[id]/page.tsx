import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { CertificateForm } from '@/components/certificates/certificate-form';
import { getCertificate } from '@/features/certificates/actions/certificate.actions';
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

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader title="Editar Certificación" backHref="/admin/certificados" />
        <EditActions id={id} status={certificate.status} />
      </div>
      
      <CertificateForm initialData={certificate} />
    </div>
  );
}
