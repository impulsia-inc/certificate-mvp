import { 
  pgTable, 
  uuid, 
  varchar, 
  text, 
  decimal, 
  timestamp, 
  integer, 
  pgEnum, 
  boolean 
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const certificateStatusEnum = pgEnum('certificate_status', ['draft', 'active', 'revoked']);
export const certificateTypeEnum = pgEnum('certificate_type', ['stone', 'jewelry']);
export const fileTypeEnum = pgEnum('file_type', ['certificate_pdf', 'jewelry_image', 'additional_document']);
export const primaryStoneTypeEnum = pgEnum('primary_stone_type', ['diamond', 'colored_gem']);
export const additionalStoneTypeEnum = pgEnum('additional_stone_type', ['diamond', 'colored_gem']);

// 1. Usuarios / Gemólogos (Login Administrativo)
export const userTable = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  title: varchar('title', { length: 255 }).default('Gemólogo Titular D.G.G.'), // Ej. M. Valenzuela
  role: varchar('role', { length: 50 }).default('gemologist').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 2. Joya / Montura (Aplica para joyas; opcional si es piedra suelta)
export const jewelryTable = pgTable('jewelry', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(), // Ej: Anillo Solitario Pavé
  category: varchar('category', { length: 100 }).notNull(), // Anillo, Collar, Piedra Suelta, etc.
  material: varchar('material', { length: 100 }), // Platino, Oro
  metalType: varchar('metal_type', { length: 100 }), // Platino 950, Oro Blanco 18K
  purity: varchar('purity', { length: 50 }), // 950, 18K, 750
  grossWeight: decimal('gross_weight', { precision: 10, scale: 2 }), // Peso Bruto Total
  weightUnit: varchar('weight_unit', { length: 20 }).default('g'),
  description: text('description'), // Descripción General Joya
  comments: text('comments'), // Comentarios periciales
  serialNumber: varchar('serial_number', { length: 100 }),
});

// 3. Certificado
export const certificateTable = pgTable('certificates', {
  id: uuid('id').defaultRandom().primaryKey(),
  reference: varchar('reference', { length: 50 }).notNull().unique(), // Formato FYN-YY-NNNNNN
  certificateType: certificateTypeEnum('certificate_type').default('stone').notNull(),
  certificateNumber: varchar('certificate_number', { length: 100 }),
  jewelryId: uuid('jewelry_id').references(() => jewelryTable.id, { onDelete: 'cascade' }),
  status: certificateStatusEnum('status').default('draft').notNull(),
  issuedAt: timestamp('issued_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdBy: uuid('created_by').references(() => userTable.id),
  updatedBy: uuid('updated_by').references(() => userTable.id),
});

// 4. Detalle Gemológico Principal (Diamante o Gema de color central)
export const gemologicalDetailTable = pgTable('gemological_details', {
  id: uuid('id').defaultRandom().primaryKey(),
  certificateId: uuid('certificate_id').notNull().references(() => certificateTable.id, { onDelete: 'cascade' }),
  stoneKind: primaryStoneTypeEnum('stone_kind').notNull(), // 'diamond' o 'colored_gem'
  
  // Datos comunes
  nature: varchar('nature', { length: 100 }), // Natural, Sintético CVD/HPHT, Tratado
  variety: varchar('variety', { length: 100 }), // Zafiro Ceylon, Esmeralda Muzo, Diamante
  shapeAndCut: varchar('shape_and_cut', { length: 150 }), // Talla Brillante Redonda, Cushion
  measurements: varchar('measurements', { length: 100 }), // Ej. 8.42 x 7.80 mm
  weight: decimal('weight', { precision: 10, scale: 2 }), // Peso en quilates (ct)
  color: varchar('color', { length: 100 }), // Grado Color (D, E, F...) o Verde Intenso
  cutGrade: varchar('cut_grade', { length: 50 }), // Excelente, Muy Bueno
  
  // Específico para Diamantes
  clarityGrade: varchar('clarity_grade', { length: 50 }), // VVS1, VS2, FL
  fluorescence: varchar('fluorescence', { length: 50 }), // Nula (Inerte), Débil, Fuerte
  polish: varchar('polish', { length: 50 }), // Pulido: Excelente
  symmetry: varchar('symmetry', { length: 50 }), // Simetría: Excelente
  proportions: varchar('proportions', { length: 100 }), // Proporciones
  
  // Específico para Gemas de Color
  transparency: varchar('transparency', { length: 50 }), // Transparente, Translúcido
  treatment: text('treatment'), // Calentamiento, Aceite insignificante, Ninguno
});

// 5. Piedras y Gemas Adicionales (Pavé, acentos, múltiples piedras)
export const additionalStonesTable = pgTable('additional_stones', {
  id: uuid('id').defaultRandom().primaryKey(),
  certificateId: uuid('certificate_id').notNull().references(() => certificateTable.id, { onDelete: 'cascade' }),
  stoneKind: additionalStoneTypeEnum('stone_kind').notNull(), // 'diamond' o 'colored_gem'
  nature: varchar('nature', { length: 100 }),
  variety: varchar('variety', { length: 100 }), // Solo para gemas adicionales
  totalStones: integer('total_stones'), // Total Piedras (ej. 16)
  shapeAndCut: varchar('shape_and_cut', { length: 150 }),
  measurements: varchar('measurements', { length: 100 }),
  estimatedWeight: decimal('estimated_weight', { precision: 10, scale: 2 }), // Peso Estimado (ct / ctw)
  estimatedColor: varchar('estimated_color', { length: 100 }), // F-G o rango
  estimatedClarity: varchar('estimated_clarity', { length: 100 }), // VS o rango
});

// 6. Archivos y Documentos
export const certificateFileTable = pgTable('certificate_files', {
  id: uuid('id').defaultRandom().primaryKey(), //[cite: 4]
  certificateId: uuid('certificate_id').notNull().references(() => certificateTable.id, { onDelete: 'cascade' }), //[cite: 4]
  type: fileTypeEnum('type').notNull(), // 'jewelry_image'[cite: 4]
  role: varchar('role', { length: 50 }), // 'primary_image' | 'secondary_image'
  displayOrder: integer('display_order').default(1), // 1 para image1, 2 para image2
  storageKey: text('storage_key').notNull(), //[cite: 4]
  originalName: varchar('original_name', { length: 255 }).notNull(), //[cite: 4]
  mimeType: varchar('mime_type', { length: 100 }).notNull(), //[cite: 4]
  size: integer('size').notNull(), //[cite: 4]
  createdAt: timestamp('created_at').defaultNow().notNull(), //[cite: 4]
});

// =======================================================
// RELACIONES DRIZZLE (Facilita consultas anidadas automáticas)
// =======================================================
export const certificateRelations = relations(certificateTable, ({ one, many }) => ({
  jewelry: one(jewelryTable, {
    fields: [certificateTable.jewelryId],
    references: [jewelryTable.id],
  }),
  gemologicalDetail: one(gemologicalDetailTable, {
    fields: [certificateTable.id],
    references: [gemologicalDetailTable.certificateId],
  }),
  additionalStones: many(additionalStonesTable),
  files: many(certificateFileTable),
  creator: one(userTable, {
    fields: [certificateTable.createdBy],
    references: [userTable.id],
  }),
}));