import { PageHeader } from '@/components/shared/page-header';
import { listCertificates } from '@/features/certificates/actions/certificate.actions';
import { CertificateTable } from '@/components/certificates/certificate-table';

export const metadata = {
  title: 'Certificaciones | FYN',
};

export default async function CertificatesPage() {
  const result = await listCertificates();
  const certificates = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Certificaciones" 
        description="Gestiona todas las certificaciones de la plataforma"
        action={{ label: 'Nueva certificación', href: '/admin/certificados/nuevo' }}
      />
      
      <CertificateTable data={certificates} />
    </div>
  );
}
