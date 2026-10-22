import { getCertificateRepository } from '../repositories';
import type { CertificateDetail, CertificateWithJewelry, CertificateFilters, CreateCertificateInput, UpdateCertificateInput, Certificate, PaginatedResult } from '@/types';

export class CertificateService {
  private repo = getCertificateRepository();

  async getPublicCertificate(reference: string): Promise<CertificateDetail | null> {
    const cert = await this.repo.findByReference(reference);
    if (!cert || cert.status === 'draft') return null;
    return cert;
  }

  async getCertificate(id: string): Promise<CertificateDetail | null> {
    return this.repo.findById(id);
  }

  async listCertificates(filters?: CertificateFilters): Promise<CertificateWithJewelry[]> {
    return this.repo.findAll(filters);
  }

  async listCertificatesPaginated(filters?: CertificateFilters): Promise<PaginatedResult<CertificateWithJewelry>> {
    return this.repo.findPaginated(filters);
  }

  async createCertificate(input: CreateCertificateInput): Promise<Certificate> {
    return this.repo.create(input);
  }

  async updateCertificate(id: string, input: UpdateCertificateInput): Promise<Certificate> {
    return this.repo.update(id, input);
  }

  async revokeCertificate(id: string): Promise<Certificate> {
    const cert = await this.repo.findById(id);
    if (!cert) throw new Error('Certificado no encontrado');
    if (cert.status === 'revoked') throw new Error('El certificado ya está revocado');
    return this.repo.revoke(id);
  }

  async reactivateCertificate(id: string): Promise<Certificate> {
    const cert = await this.repo.findById(id);
    if (!cert) throw new Error('Certificado no encontrado');
    if (cert.status === 'active') throw new Error('El certificado ya está activo');
    return this.repo.reactivate(id);
  }

  async getDashboardStats() {
    return this.repo.getStats();
  }

  async getRecentCertificates(limit: number = 5): Promise<CertificateWithJewelry[]> {
    return this.repo.getRecentCertificates(limit);
  }
}
