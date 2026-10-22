// Certificate status
export type CertificateStatus = 'draft' | 'active' | 'revoked';

// Certificate type
export type CertificateType = 'stone' | 'jewelry';

// Primary & Additional stone type
export type PrimaryStoneType = 'diamond' | 'colored_gem';
export type AdditionalStoneType = 'diamond' | 'colored_gem';

// Certificate file type  
export type CertificateFileType = 'certificate_pdf' | 'jewelry_image' | 'additional_document';

// Jewelry category
export type JewelryCategory = 'Anillo' | 'Cadena' | 'Pulsera' | 'Aretes' | 'Collar' | 'Reloj' | 'Broche' | 'Otro';

// Core entities
export interface Certificate {
  id: string;
  reference: string;
  certificateType?: CertificateType;
  certificateNumber?: string;
  jewelryId?: string | null;
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
  category: JewelryCategory | string;
  description?: string;
  material?: string;
  metalType?: string;
  purity?: string;
  grossWeight?: number;
  weight?: number;
  weightUnit?: string;
  serialNumber?: string;
  comments?: string;
  // Gemological convenience / legacy fields
  stoneType?: string;
  stoneWeight?: number;
  stoneColor?: string;
  stoneClarity?: string;
  brand?: string;
  model?: string;
}

export interface GemologicalDetail {
  id?: string;
  certificateId?: string;
  stoneKind: PrimaryStoneType;
  nature?: string;
  variety?: string;
  shapeAndCut?: string;
  measurements?: string;
  weight?: number;
  color?: string;
  cutGrade?: string;
  clarityGrade?: string;
  fluorescence?: string;
  polish?: string;
  symmetry?: string;
  proportions?: string;
  transparency?: string;
  treatment?: string;
}

export interface AdditionalStone {
  id?: string;
  certificateId?: string;
  stoneKind: AdditionalStoneType;
  nature?: string;
  variety?: string;
  totalStones?: number;
  shapeAndCut?: string;
  measurements?: string;
  estimatedWeight?: number;
  estimatedColor?: string;
  estimatedClarity?: string;
}

export interface CertificateFile {
  id: string;
  certificateId: string;
  type: CertificateFileType;
  role?: string;
  displayOrder?: number;
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
  thumbnailUrl?: string;
  secondaryThumbnailUrl?: string;
  hash?: string;
  gemologist?: string;
}

export interface CertificateDetail extends CertificateWithJewelry {
  files: CertificateFile[];
  gemologicalDetail?: GemologicalDetail | null;
  additionalStones?: AdditionalStone[];
}

// Query/filter types
export interface CertificateFilters {
  search?: string;
  status?: CertificateStatus | 'all';
  category?: JewelryCategory | 'Diamante' | 'Joya' | 'all' | string;
  page?: number;
  pageSize?: number;
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
  certificateType?: CertificateType;
  certificateNumber?: string;
}

export interface UpdateCertificateInput {
  jewelry?: Partial<Omit<Jewelry, 'id'>>;
  status?: CertificateStatus;
  issuedAt?: string;
  certificateNumber?: string;
}

