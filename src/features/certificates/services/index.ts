import { CertificateService } from './certificate.service';

export * from './certificate.service';

let serviceInstance: CertificateService | null = null;

export function getCertificateService(): CertificateService {
  if (!serviceInstance) {
    serviceInstance = new CertificateService();
  }
  return serviceInstance;
}
