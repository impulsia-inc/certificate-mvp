import { Metadata } from 'next';
import {
  getDashboardStats,
  listCertificatesPaginated,
} from '@/features/certificates/actions/certificate.actions';
import { CertificateManagementView } from '@/components/admin/certificate-management-view';
import type { JewelryCategory, CertificateStatus } from '@/types';

export const metadata: Metadata = {
  title: 'Certificaciones | FYN Core',
  description: 'Gestión y expedición técnica de certificados gemológicos oficiales.',
};

export default async function CertificatesPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    status?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const search = params.search || undefined;
  const category = (params.category as JewelryCategory) || undefined;
  const status = (params.status as CertificateStatus) || undefined;

  const [statsResult, paginatedResult] = await Promise.all([
    getDashboardStats(),
    listCertificatesPaginated({
      search,
      category,
      status,
      page,
      pageSize: 10,
    }),
  ]);

  const stats = statsResult.success
    ? statsResult.data
    : { total: 0, active: 0, revoked: 0, draft: 0 };

  const paginatedData = paginatedResult.success
    ? paginatedResult.data
    : { data: [], total: 0, page: 1, pageSize: 10 };

  return <CertificateManagementView initialData={paginatedData} stats={stats} />;
}
