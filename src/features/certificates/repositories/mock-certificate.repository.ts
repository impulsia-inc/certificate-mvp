import { CertificateRepository } from './certificate.repository';
import type { Certificate, CertificateDetail, CertificateWithJewelry, CertificateFilters, CertificateFile, CreateCertificateInput, UpdateCertificateInput, Jewelry } from '@/types';
import { mockCertificates, mockJewelry, mockCertificateFiles } from '@/data/mock/certificates';
import { generateReference } from '@/lib/reference/generator';

let certificates = structuredClone(mockCertificates);
let jewelryItems = structuredClone(mockJewelry);
let certificateFiles = structuredClone(mockCertificateFiles);
let sequence = 8; // Start after the mock data

export class MockCertificateRepository implements CertificateRepository {
  async findByReference(reference: string): Promise<CertificateDetail | null> {
    const cert = certificates.find(c => c.reference === reference);
    if (!cert) return null;
    return this.buildDetail(cert);
  }

  async findById(id: string): Promise<CertificateDetail | null> {
    const cert = certificates.find(c => c.id === id);
    if (!cert) return null;
    return this.buildDetail(cert);
  }

  async findAll(filters?: CertificateFilters): Promise<CertificateWithJewelry[]> {
    let filtered = certificates.map(c => this.buildWithJewelry(c));

    if (filters) {
      if (filters.status) {
        filtered = filtered.filter(c => c.status === filters.status);
      }
      if (filters.category) {
        filtered = filtered.filter(c => c.jewelry.category === filters.category);
      }
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(c => 
          c.reference.toLowerCase().includes(search) || 
          c.jewelry.name.toLowerCase().includes(search)
        );
      }
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async create(input: CreateCertificateInput): Promise<Certificate> {
    const now = new Date().toISOString();
    
    // 1. Create Jewelry
    const jewelryId = `jewel-${crypto.randomUUID()}`;
    const jewelry: Jewelry = { ...input.jewelry, id: jewelryId };
    jewelryItems.push(jewelry);

    // 2. Create Certificate
    const id = `cert-${crypto.randomUUID()}`;
    const seq = await this.getNextSequenceNumber();
    const reference = generateReference(seq);
    
    const cert: Certificate = {
      id,
      reference,
      certificateNumber: input.certificateNumber,
      jewelryId,
      status: input.status,
      issuedAt: input.issuedAt,
      createdAt: now,
      updatedAt: now
    };
    certificates.push(cert);
    
    return cert;
  }

  async update(id: string, input: UpdateCertificateInput): Promise<Certificate> {
    const certIndex = certificates.findIndex(c => c.id === id);
    if (certIndex === -1) throw new Error('Certificate not found');
    
    const cert = certificates[certIndex];
    
    if (input.jewelry) {
      const jIndex = jewelryItems.findIndex(j => j.id === cert.jewelryId);
      if (jIndex !== -1) {
        jewelryItems[jIndex] = { ...jewelryItems[jIndex], ...input.jewelry };
      }
    }
    
    if (input.status) cert.status = input.status;
    if (input.issuedAt) cert.issuedAt = input.issuedAt;
    if (input.certificateNumber !== undefined) cert.certificateNumber = input.certificateNumber;
    
    cert.updatedAt = new Date().toISOString();
    return cert;
  }

  async revoke(id: string): Promise<Certificate> {
    return this.update(id, { status: 'revoked' });
  }

  async reactivate(id: string): Promise<Certificate> {
    return this.update(id, { status: 'active' });
  }

  async delete(id: string): Promise<void> {
    const cert = certificates.find(c => c.id === id);
    if (cert) {
      jewelryItems = jewelryItems.filter(j => j.id !== cert.jewelryId);
      certificateFiles = certificateFiles.filter(f => f.certificateId !== id);
      certificates = certificates.filter(c => c.id !== id);
    }
  }

  async getStats(): Promise<{ total: number; active: number; revoked: number; draft: number }> {
    return {
      total: certificates.length,
      active: certificates.filter(c => c.status === 'active').length,
      revoked: certificates.filter(c => c.status === 'revoked').length,
      draft: certificates.filter(c => c.status === 'draft').length,
    };
  }

  async getRecentCertificates(limit: number): Promise<CertificateWithJewelry[]> {
    const sorted = [...certificates].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return sorted.slice(0, limit).map(c => this.buildWithJewelry(c));
  }

  async getNextSequenceNumber(): Promise<number> {
    sequence += 1;
    return sequence;
  }

  async addFile(certificateId: string, file: Omit<CertificateFile, 'id' | 'createdAt'>): Promise<CertificateFile> {
    const newFile: CertificateFile = {
      ...file,
      id: `file-${crypto.randomUUID()}`,
      createdAt: new Date().toISOString()
    };
    certificateFiles.push(newFile);
    return newFile;
  }

  async removeFile(fileId: string): Promise<void> {
    certificateFiles = certificateFiles.filter(f => f.id !== fileId);
  }

  async getFilesBycertificate(certificateId: string): Promise<CertificateFile[]> {
    return certificateFiles.filter(f => f.certificateId === certificateId);
  }

  // Helpers
  private buildWithJewelry(cert: Certificate): CertificateWithJewelry {
    const jewelry = jewelryItems.find(j => j.id === cert.jewelryId);
    if (!jewelry) throw new Error(`Jewelry missing for cert ${cert.id}`);
    return { ...cert, jewelry };
  }

  private buildDetail(cert: Certificate): CertificateDetail {
    const withJewelry = this.buildWithJewelry(cert);
    const files = certificateFiles.filter(f => f.certificateId === cert.id);
    return { ...withJewelry, files };
  }
}
