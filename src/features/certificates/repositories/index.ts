import { MockCertificateRepository } from './mock-certificate.repository';
import type { CertificateRepository } from './certificate.repository';

export * from './certificate.repository';

// Singleton instance for mock repository
let repositoryInstance: CertificateRepository | null = null;

export function getCertificateRepository(): CertificateRepository {
  if (!repositoryInstance) {
    repositoryInstance = new MockCertificateRepository();
  }
  return repositoryInstance;
}
