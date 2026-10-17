import type { Certificate, CertificateDetail, CertificateWithJewelry, CertificateFilters, CertificateFile, CreateCertificateInput, UpdateCertificateInput, PaginatedResult } from '@/types';

export interface CertificateRepository {
  findByReference(reference: string): Promise<CertificateDetail | null>;
  findById(id: string): Promise<CertificateDetail | null>;
  findAll(filters?: CertificateFilters): Promise<CertificateWithJewelry[]>;
  findPaginated(filters?: CertificateFilters): Promise<PaginatedResult<CertificateWithJewelry>>;
  create(input: CreateCertificateInput): Promise<Certificate>;
  update(id: string, input: UpdateCertificateInput): Promise<Certificate>;
  revoke(id: string): Promise<Certificate>;
  reactivate(id: string): Promise<Certificate>;
  delete(id: string): Promise<void>;
  getStats(): Promise<{ total: number; active: number; revoked: number; draft: number }>;
  getRecentCertificates(limit: number): Promise<CertificateWithJewelry[]>;
  getNextSequenceNumber(): Promise<number>;
  // File operations
  addFile(certificateId: string, file: Omit<CertificateFile, 'id' | 'createdAt'>): Promise<CertificateFile>;
  removeFile(fileId: string): Promise<void>;
  getFilesBycertificate(certificateId: string): Promise<CertificateFile[]>;
}
