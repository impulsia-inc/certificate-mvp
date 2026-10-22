import { eq, or, and, ilike, desc, asc, count, inArray } from 'drizzle-orm';
import { db } from '@/db';
import { certificateTable, jewelryTable, certificateFileTable, gemologicalDetailTable, additionalStonesTable } from '@/db/schema';
import type { CertificateRepository } from './certificate.repository';
import type {
  Certificate,
  CertificateDetail,
  CertificateWithJewelry,
  CertificateFilters,
  CertificateFile,
  CreateCertificateInput,
  UpdateCertificateInput,
  Jewelry,
  CertificateStatus,
  CertificateFileType,
  CertificateType,
  PrimaryStoneType,
  AdditionalStoneType,
  JewelryCategory,
  PaginatedResult,
  GemologicalDetail,
  AdditionalStone,
} from '@/types';
import { generateReference } from '@/lib/reference/generator';

function mapJewelry(row: typeof jewelryTable.$inferSelect | null | undefined): Jewelry {
  if (!row) {
    return {
      id: '',
      name: 'Piedra Preciosa',
      category: 'Otro' as JewelryCategory,
    };
  }
  const weightNum = row.grossWeight !== null && row.grossWeight !== undefined ? parseFloat(row.grossWeight) : undefined;
  return {
    id: row.id,
    name: row.name,
    category: row.category as JewelryCategory,
    description: row.description ?? undefined,
    material: row.material ?? undefined,
    metalType: row.metalType ?? undefined,
    purity: row.purity ?? undefined,
    grossWeight: weightNum,
    weight: weightNum,
    weightUnit: row.weightUnit ?? undefined,
    serialNumber: row.serialNumber ?? undefined,
    comments: row.comments ?? undefined,
  };
}

function mapCertificate(row: typeof certificateTable.$inferSelect): Certificate {
  return {
    id: row.id,
    reference: row.reference,
    certificateType: (row.certificateType as CertificateType) ?? 'stone',
    certificateNumber: row.certificateNumber ?? undefined,
    jewelryId: row.jewelryId ?? undefined,
    status: row.status as CertificateStatus,
    issuedAt: row.issuedAt instanceof Date ? row.issuedAt.toISOString() : new Date(row.issuedAt).toISOString(),
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : new Date(row.createdAt).toISOString(),
    updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : new Date(row.updatedAt).toISOString(),
    createdBy: row.createdBy ?? undefined,
    updatedBy: row.updatedBy ?? undefined,
  };
}

function mapGemologicalDetail(row: typeof gemologicalDetailTable.$inferSelect | null | undefined): GemologicalDetail | null {
  if (!row) return null;
  return {
    id: row.id,
    certificateId: row.certificateId,
    stoneKind: row.stoneKind as PrimaryStoneType,
    nature: row.nature ?? undefined,
    variety: row.variety ?? undefined,
    shapeAndCut: row.shapeAndCut ?? undefined,
    measurements: row.measurements ?? undefined,
    weight: row.weight !== null && row.weight !== undefined ? parseFloat(row.weight) : undefined,
    color: row.color ?? undefined,
    cutGrade: row.cutGrade ?? undefined,
    clarityGrade: row.clarityGrade ?? undefined,
    fluorescence: row.fluorescence ?? undefined,
    polish: row.polish ?? undefined,
    symmetry: row.symmetry ?? undefined,
    proportions: row.proportions ?? undefined,
    transparency: row.transparency ?? undefined,
    treatment: row.treatment ?? undefined,
  };
}

function mapAdditionalStone(row: typeof additionalStonesTable.$inferSelect): AdditionalStone {
  return {
    id: row.id,
    certificateId: row.certificateId,
    stoneKind: row.stoneKind as AdditionalStoneType,
    nature: row.nature ?? undefined,
    variety: row.variety ?? undefined,
    totalStones: row.totalStones ?? undefined,
    shapeAndCut: row.shapeAndCut ?? undefined,
    measurements: row.measurements ?? undefined,
    estimatedWeight: row.estimatedWeight !== null && row.estimatedWeight !== undefined ? parseFloat(row.estimatedWeight) : undefined,
    estimatedColor: row.estimatedColor ?? undefined,
    estimatedClarity: row.estimatedClarity ?? undefined,
  };
}

function mapFile(row: typeof certificateFileTable.$inferSelect): CertificateFile {
  return {
    id: row.id,
    certificateId: row.certificateId,
    type: row.type as CertificateFileType,
    role: row.role ?? undefined,
    displayOrder: row.displayOrder ?? undefined,
    storageKey: row.storageKey,
    originalName: row.originalName,
    mimeType: row.mimeType,
    size: row.size,
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : new Date(row.createdAt).toISOString(),
  };
}

export class DrizzleCertificateRepository implements CertificateRepository {
  async findByReference(reference: string): Promise<CertificateDetail | null> {
    const rows = await db
      .select()
      .from(certificateTable)
      .leftJoin(jewelryTable, eq(certificateTable.jewelryId, jewelryTable.id))
      .where(eq(certificateTable.reference, reference))
      .limit(1);

    if (rows.length === 0) return null;

    const { certificates: certRow, jewelry: jewelryRow } = rows[0];
    const certId = certRow.id;

    const [filesRows, gemDetailRows, additionalStonesRows] = await Promise.all([
      db.select().from(certificateFileTable).where(eq(certificateFileTable.certificateId, certId)),
      db.select().from(gemologicalDetailTable).where(eq(gemologicalDetailTable.certificateId, certId)).limit(1),
      db.select().from(additionalStonesTable).where(eq(additionalStonesTable.certificateId, certId)),
    ]);

    const jewelry = mapJewelry(jewelryRow);
    const gemDetail = mapGemologicalDetail(gemDetailRows[0] ?? null);

    if (gemDetail) {
      jewelry.stoneType = gemDetail.variety || (gemDetail.stoneKind === 'diamond' ? 'Diamante' : 'Gema de Color');
      jewelry.stoneWeight = gemDetail.weight;
      jewelry.stoneColor = gemDetail.color;
      jewelry.stoneClarity = gemDetail.clarityGrade;
    }

    return {
      ...mapCertificate(certRow),
      jewelry,
      files: filesRows.map(mapFile),
      gemologicalDetail: gemDetail,
      additionalStones: additionalStonesRows.map(mapAdditionalStone),
    };
  }

  async findById(id: string): Promise<CertificateDetail | null> {
    const rows = await db
      .select()
      .from(certificateTable)
      .leftJoin(jewelryTable, eq(certificateTable.jewelryId, jewelryTable.id))
      .where(eq(certificateTable.id, id))
      .limit(1);

    if (rows.length === 0) return null;

    const { certificates: certRow, jewelry: jewelryRow } = rows[0];

    const [filesRows, gemDetailRows, additionalStonesRows] = await Promise.all([
      db.select().from(certificateFileTable).where(eq(certificateFileTable.certificateId, id)),
      db.select().from(gemologicalDetailTable).where(eq(gemologicalDetailTable.certificateId, id)).limit(1),
      db.select().from(additionalStonesTable).where(eq(additionalStonesTable.certificateId, id)),
    ]);

    const jewelry = mapJewelry(jewelryRow);
    const gemDetail = mapGemologicalDetail(gemDetailRows[0] ?? null);

    if (gemDetail) {
      jewelry.stoneType = gemDetail.variety || (gemDetail.stoneKind === 'diamond' ? 'Diamante' : 'Gema de Color');
      jewelry.stoneWeight = gemDetail.weight;
      jewelry.stoneColor = gemDetail.color;
      jewelry.stoneClarity = gemDetail.clarityGrade;
    }

    return {
      ...mapCertificate(certRow),
      jewelry,
      files: filesRows.map(mapFile),
      gemologicalDetail: gemDetail,
      additionalStones: additionalStonesRows.map(mapAdditionalStone),
    };
  }

  async findAll(filters?: CertificateFilters): Promise<CertificateWithJewelry[]> {
    const conditions = [];

    if (filters?.status && filters.status !== 'all') {
      conditions.push(eq(certificateTable.status, filters.status as CertificateStatus));
    }

    if (filters?.category && filters.category !== 'all') {
      const cat = filters.category as string;
      if (cat === 'Diamante') {
        conditions.push(
          or(
            eq(certificateTable.certificateType, 'stone'),
            eq(jewelryTable.category, 'Piedra Suelta'),
            eq(jewelryTable.category, 'Diamante')
          )
        );
      } else if (cat === 'Joya') {
        conditions.push(eq(certificateTable.certificateType, 'jewelry'));
      } else {
        conditions.push(eq(jewelryTable.category, cat as JewelryCategory));
      }
    }

    if (filters?.search) {
      const searchPattern = `%${filters.search.trim()}%`;
      conditions.push(
        or(
          ilike(certificateTable.reference, searchPattern),
          ilike(jewelryTable.name, searchPattern)
        )
      );
    }

    const query = db
      .select()
      .from(certificateTable)
      .leftJoin(jewelryTable, eq(certificateTable.jewelryId, jewelryTable.id))
      .orderBy(desc(certificateTable.createdAt));

    const rows = conditions.length > 0
      ? await query.where(conditions.length === 1 ? conditions[0] : and(...conditions))
      : await query;

    const certIds = rows.map((r) => r.certificates.id);
    const imagesMap: Record<string, string> = {};
    const gemDetailsMap: Record<string, typeof gemologicalDetailTable.$inferSelect> = {};

    if (certIds.length > 0) {
      const [imageFiles, gemDetails] = await Promise.all([
        db
          .select()
          .from(certificateFileTable)
          .where(
            and(
              inArray(certificateFileTable.certificateId, certIds),
              eq(certificateFileTable.type, 'jewelry_image')
            )
          )
          .orderBy(asc(certificateFileTable.displayOrder)),
        db
          .select()
          .from(gemologicalDetailTable)
          .where(inArray(gemologicalDetailTable.certificateId, certIds)),
      ]);

      for (const f of imageFiles) {
        if (!imagesMap[f.certificateId]) {
          imagesMap[f.certificateId] = f.storageKey;
        }
      }

      for (const g of gemDetails) {
        gemDetailsMap[g.certificateId] = g;
      }
    }

    return rows.map(({ certificates: certRow, jewelry: jewelryRow }) => {
      const jewelry = mapJewelry(jewelryRow);
      const gem = gemDetailsMap[certRow.id];

      if (gem) {
        jewelry.stoneType = gem.variety || (gem.stoneKind === 'diamond' ? 'Diamante' : 'Gema de Color');
        jewelry.stoneWeight = gem.weight !== null && gem.weight !== undefined ? parseFloat(gem.weight) : undefined;
        jewelry.stoneColor = gem.color ?? undefined;
        jewelry.stoneClarity = gem.clarityGrade ?? undefined;
      }

      if (certRow.certificateType === 'stone') {
        jewelry.category = (gem?.stoneKind === 'colored_gem' ? 'Gema' : 'Diamante') as unknown as JewelryCategory;
      }

      return {
        ...mapCertificate(certRow),
        jewelry,
        thumbnailUrl: imagesMap[certRow.id],
      };
    });
  }

  async findPaginated(filters?: CertificateFilters): Promise<PaginatedResult<CertificateWithJewelry>> {
    const page = Math.max(1, filters?.page ?? 1);
    const pageSize = Math.max(1, filters?.pageSize ?? 10);
    const offset = (page - 1) * pageSize;

    const conditions = [];

    if (filters?.status && filters.status !== 'all') {
      conditions.push(eq(certificateTable.status, filters.status as CertificateStatus));
    }

    if (filters?.category && filters.category !== 'all') {
      const cat = filters.category as string;
      if (cat === 'Diamante') {
        conditions.push(
          or(
            eq(certificateTable.certificateType, 'stone'),
            eq(jewelryTable.category, 'Piedra Suelta'),
            eq(jewelryTable.category, 'Diamante')
          )
        );
      } else if (cat === 'Joya') {
        conditions.push(eq(certificateTable.certificateType, 'jewelry'));
      } else {
        conditions.push(eq(jewelryTable.category, cat as JewelryCategory));
      }
    }

    if (filters?.search && filters.search.trim()) {
      const searchPattern = `%${filters.search.trim()}%`;
      conditions.push(
        or(
          ilike(certificateTable.reference, searchPattern),
          ilike(jewelryTable.name, searchPattern),
          ilike(jewelryTable.description, searchPattern)
        )
      );
    }

    const whereClause = conditions.length > 0
      ? (conditions.length === 1 ? conditions[0] : and(...conditions))
      : undefined;

    // Count total matches
    const countQuery = db
      .select({ count: count() })
      .from(certificateTable)
      .leftJoin(jewelryTable, eq(certificateTable.jewelryId, jewelryTable.id));

    const [totalRow] = whereClause
      ? await countQuery.where(whereClause)
      : await countQuery;

    const total = Number(totalRow?.count ?? 0);

    // Fetch page slice
    const selectQuery = db
      .select()
      .from(certificateTable)
      .leftJoin(jewelryTable, eq(certificateTable.jewelryId, jewelryTable.id))
      .orderBy(desc(certificateTable.createdAt))
      .limit(pageSize)
      .offset(offset);

    const rows = whereClause
      ? await selectQuery.where(whereClause)
      : await selectQuery;

    // Attach thumbnails and gemological details
    const certIds = rows.map((r) => r.certificates.id);
    const imagesMap: Record<string, string> = {};
    const gemDetailsMap: Record<string, typeof gemologicalDetailTable.$inferSelect> = {};

    if (certIds.length > 0) {
      const [imageFiles, gemDetails] = await Promise.all([
        db
          .select()
          .from(certificateFileTable)
          .where(
            and(
              inArray(certificateFileTable.certificateId, certIds),
              eq(certificateFileTable.type, 'jewelry_image')
            )
          )
          .orderBy(asc(certificateFileTable.displayOrder)),
        db
          .select()
          .from(gemologicalDetailTable)
          .where(inArray(gemologicalDetailTable.certificateId, certIds)),
      ]);

      for (const f of imageFiles) {
        if (!imagesMap[f.certificateId]) {
          imagesMap[f.certificateId] = f.storageKey;
        }
      }

      for (const g of gemDetails) {
        gemDetailsMap[g.certificateId] = g;
      }
    }

    const data: CertificateWithJewelry[] = rows.map(({ certificates: certRow, jewelry: jewelryRow }) => {
      const hexPart = certRow.id.replace(/-/g, '').slice(0, 8).toUpperCase();
      const lastPart = certRow.id.replace(/-/g, '').slice(-4).toUpperCase();
      const jewelry = mapJewelry(jewelryRow);
      const gem = gemDetailsMap[certRow.id];

      if (gem) {
        jewelry.stoneType = gem.variety || (gem.stoneKind === 'diamond' ? 'Diamante' : 'Gema de Color');
        jewelry.stoneWeight = gem.weight !== null && gem.weight !== undefined ? parseFloat(gem.weight) : undefined;
        jewelry.stoneColor = gem.color ?? undefined;
        jewelry.stoneClarity = gem.clarityGrade ?? undefined;
      }

      if (certRow.certificateType === 'stone') {
        jewelry.category = (gem?.stoneKind === 'colored_gem' ? 'Gema' : 'Diamante') as unknown as JewelryCategory;
      }

      return {
        ...mapCertificate(certRow),
        jewelry,
        thumbnailUrl: imagesMap[certRow.id],
        hash: `${hexPart}...${lastPart}`,
        gemologist: certRow.createdBy || 'M. Valenzuela (D.G.G.)',
      };
    });

    return {
      data,
      total,
      page,
      pageSize,
    };
  }

  async create(input: CreateCertificateInput): Promise<Certificate> {
    return db.transaction(async (tx) => {
      const [insertedJewelry] = await tx
        .insert(jewelryTable)
        .values({
          name: input.jewelry.name,
          category: input.jewelry.category,
          description: input.jewelry.description,
          material: input.jewelry.material,
          metalType: input.jewelry.metalType,
          purity: input.jewelry.purity,
          grossWeight: input.jewelry.grossWeight !== undefined ? input.jewelry.grossWeight.toString() : (input.jewelry.weight !== undefined ? input.jewelry.weight.toString() : null),
          weightUnit: input.jewelry.weightUnit || 'g',
          serialNumber: input.jewelry.serialNumber,
          comments: input.jewelry.comments,
        })
        .returning();

      const seq = await this.getNextSequenceNumber(tx);
      const reference = generateReference(seq);

      const [insertedCert] = await tx
        .insert(certificateTable)
        .values({
          reference,
          certificateType: input.certificateType || 'jewelry',
          certificateNumber: input.certificateNumber,
          jewelryId: insertedJewelry.id,
          status: input.status,
          issuedAt: new Date(input.issuedAt),
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return mapCertificate(insertedCert);
    });
  }

  async update(id: string, input: UpdateCertificateInput): Promise<Certificate> {
    return db.transaction(async (tx) => {
      const [cert] = await tx
        .select()
        .from(certificateTable)
        .where(eq(certificateTable.id, id))
        .limit(1);

      if (!cert) throw new Error('Certificado no encontrado');

      if (input.jewelry && cert.jewelryId) {
        const jewelryUpdates: Record<string, unknown> = {};
        if (input.jewelry.name !== undefined) jewelryUpdates.name = input.jewelry.name;
        if (input.jewelry.category !== undefined) jewelryUpdates.category = input.jewelry.category;
        if (input.jewelry.description !== undefined) jewelryUpdates.description = input.jewelry.description;
        if (input.jewelry.material !== undefined) jewelryUpdates.material = input.jewelry.material;
        if (input.jewelry.metalType !== undefined) jewelryUpdates.metalType = input.jewelry.metalType;
        if (input.jewelry.purity !== undefined) jewelryUpdates.purity = input.jewelry.purity;
        if (input.jewelry.grossWeight !== undefined) jewelryUpdates.grossWeight = input.jewelry.grossWeight !== null ? input.jewelry.grossWeight.toString() : null;
        else if (input.jewelry.weight !== undefined) jewelryUpdates.grossWeight = input.jewelry.weight !== null ? input.jewelry.weight.toString() : null;
        if (input.jewelry.weightUnit !== undefined) jewelryUpdates.weightUnit = input.jewelry.weightUnit;
        if (input.jewelry.serialNumber !== undefined) jewelryUpdates.serialNumber = input.jewelry.serialNumber;
        if (input.jewelry.comments !== undefined) jewelryUpdates.comments = input.jewelry.comments;

        if (Object.keys(jewelryUpdates).length > 0) {
          await tx
            .update(jewelryTable)
            .set(jewelryUpdates)
            .where(eq(jewelryTable.id, cert.jewelryId));
        }
      }

      const certUpdates: Record<string, unknown> = {
        updatedAt: new Date(),
      };
      if (input.status !== undefined) certUpdates.status = input.status;
      if (input.issuedAt !== undefined) certUpdates.issuedAt = new Date(input.issuedAt);
      if (input.certificateNumber !== undefined) certUpdates.certificateNumber = input.certificateNumber;

      const [updatedCert] = await tx
        .update(certificateTable)
        .set(certUpdates)
        .where(eq(certificateTable.id, id))
        .returning();

      return mapCertificate(updatedCert);
    });
  }

  async revoke(id: string): Promise<Certificate> {
    return this.update(id, { status: 'revoked' });
  }

  async reactivate(id: string): Promise<Certificate> {
    return this.update(id, { status: 'active' });
  }

  async delete(id: string): Promise<void> {
    const [cert] = await db
      .select({ jewelryId: certificateTable.jewelryId })
      .from(certificateTable)
      .where(eq(certificateTable.id, id))
      .limit(1);

    if (cert) {
      await db.delete(certificateTable).where(eq(certificateTable.id, id));
      if (cert.jewelryId) {
        await db.delete(jewelryTable).where(eq(jewelryTable.id, cert.jewelryId));
      }
    }
  }

  async getStats(): Promise<{ total: number; active: number; revoked: number; draft: number }> {
    const statsResult = await db
      .select({
        status: certificateTable.status,
        total: count(),
      })
      .from(certificateTable)
      .groupBy(certificateTable.status);

    let total = 0;
    let active = 0;
    let revoked = 0;
    let draft = 0;

    for (const item of statsResult) {
      const c = Number(item.total);
      total += c;
      if (item.status === 'active') active = c;
      if (item.status === 'revoked') revoked = c;
      if (item.status === 'draft') draft = c;
    }

    return { total, active, revoked, draft };
  }

  async getRecentCertificates(limit: number): Promise<CertificateWithJewelry[]> {
    const rows = await db
      .select()
      .from(certificateTable)
      .leftJoin(jewelryTable, eq(certificateTable.jewelryId, jewelryTable.id))
      .orderBy(desc(certificateTable.createdAt))
      .limit(limit);

    return rows.map(({ certificates: certRow, jewelry: jewelryRow }) => ({
      ...mapCertificate(certRow),
      jewelry: mapJewelry(jewelryRow),
    }));
  }

  async getNextSequenceNumber(txRunner?: unknown): Promise<number> {
    const runner = (txRunner as typeof db) || db;
    const result = await runner.select({ total: count() }).from(certificateTable);
    return (Number(result[0]?.total) || 0) + 1;
  }

  async addFile(certificateId: string, file: Omit<CertificateFile, 'id' | 'createdAt'>): Promise<CertificateFile> {
    const [inserted] = await db
      .insert(certificateFileTable)
      .values({
        certificateId,
        type: file.type,
        role: file.role || 'primary_image',
        displayOrder: file.displayOrder || 1,
        storageKey: file.storageKey,
        originalName: file.originalName,
        mimeType: file.mimeType,
        size: file.size,
        createdAt: new Date(),
      })
      .returning();

    return mapFile(inserted);
  }

  async removeFile(fileId: string): Promise<void> {
    await db.delete(certificateFileTable).where(eq(certificateFileTable.id, fileId));
  }

  async getFilesBycertificate(certificateId: string): Promise<CertificateFile[]> {
    const rows = await db
      .select()
      .from(certificateFileTable)
      .where(eq(certificateFileTable.certificateId, certificateId));

    return rows.map(mapFile);
  }
}
