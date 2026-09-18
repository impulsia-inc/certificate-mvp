import { Award, CheckCircle, XCircle, FileEdit } from 'lucide-react';
import { StatsCard } from '@/components/admin/stats-card';
import { PageHeader } from '@/components/shared/page-header';
import { getDashboardStats, getRecentCertificates } from '@/features/certificates/actions/certificate.actions';
import { CertificateTable } from '@/components/certificates/certificate-table';

export const metadata = {
  title: 'Dashboard',
};

export default async function AdminDashboardPage() {
  const [statsResult, recentResult] = await Promise.all([
    getDashboardStats(),
    getRecentCertificates(5),
  ]);

  const stats = statsResult.success ? statsResult.data : { total: 0, active: 0, revoked: 0, draft: 0 };
  const recentCerts = recentResult.success ? recentResult.data : [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Resumen general de certificaciones"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Certificaciones" value={stats.total} icon={Award} description="Total registradas" />
        <StatsCard title="Activas" value={stats.active} icon={CheckCircle} description="Certificaciones vigentes" />
        <StatsCard title="Revocadas" value={stats.revoked} icon={XCircle} description="Certificaciones anuladas" />
        <StatsCard title="Borradores" value={stats.draft} icon={FileEdit} description="Pendientes de publicar" />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-stone-900">Certificaciones Recientes</h2>
        <CertificateTable data={recentCerts} />
      </div>
    </div>
  );
}
