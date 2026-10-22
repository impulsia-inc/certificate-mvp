import { MockCertificateRepository } from './mock-certificate.repository';
import { DrizzleCertificateRepository } from './drizzle-certificate.repository';
import type { CertificateRepository } from './certificate.repository';

export * from './certificate.repository';

let repositoryInstance: CertificateRepository | null = null;

export function getCertificateRepository(): CertificateRepository {
  if (!repositoryInstance) {
    const useDatabase = process.env.USE_DATABASE === 'true' || Boolean(process.env.DATABASE_URL);
    if (useDatabase) {
      repositoryInstance = new DrizzleCertificateRepository();
    } else {
      repositoryInstance = new MockCertificateRepository();
    }
  }
  return repositoryInstance;
}
