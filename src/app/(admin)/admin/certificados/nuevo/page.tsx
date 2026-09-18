'use client';

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { CertificateForm } from '@/components/certificates/certificate-form';
import { createCertificate } from '@/features/certificates/actions/certificate.actions';

export default function NewCertificatePage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    await createCertificate(data);
    router.push('/admin/certificados');
    router.refresh();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <PageHeader title="Nueva Certificación" backHref="/admin/certificados" />
      <CertificateForm onSubmit={handleSubmit} />
    </div>
  );
}
