// Certificate status
export type CertificateStatus = 'draft' | 'active' | 'revoked';

// Certificate file type  
export type CertificateFileType = 'certificate_pdf' | 'jewelry_image' | 'additional_document';

// Jewelry category
export type JewelryCategory = 'Anillo' | 'Cadena' | 'Pulsera' | 'Aretes' | 'Collar' | 'Reloj' | 'Broche' | 'Otro';

// Core entities
export interface Certificate {
  id: string;
  reference: string;
  certificateNumber?: string;
  jewelryId: string;
  status: CertificateStatus;
  issuedAt: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface Jewelry {
  id: string;
  name: string;
  category: JewelryCategory;
  description?: string;
  material?: string;
  metalType?: string;
  purity?: string;
  weight?: number;
  weightUnit?: string;
  serialNumber?: string;
  stoneType?: string;
  stoneWeight?: number;
  stoneColor?: string;
  stoneClarity?: string;
  brand?: string;
  model?: string;
}

export interface CertificateFile {
  id: string;
  certificateId: string;
  type: CertificateFileType;
  storageKey: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// Composite types for views
export interface CertificateWithJewelry extends Certificate {
  jewelry: Jewelry;
}

export interface CertificateDetail extends CertificateWithJewelry {
  files: CertificateFile[];
}

// Query/filter types
export interface CertificateFilters {
  search?: string;
  status?: CertificateStatus;
  category?: JewelryCategory;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Form input types
export interface CreateCertificateInput {
  jewelry: Omit<Jewelry, 'id'>;
  status: CertificateStatus;
  issuedAt: string;
  certificateNumber?: string;
}

export interface UpdateCertificateInput {
  jewelry?: Partial<Omit<Jewelry, 'id'>>;
  status?: CertificateStatus;
  issuedAt?: string;
  certificateNumber?: string;
}
