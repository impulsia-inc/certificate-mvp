# FYN — Modelo de Datos y Esquema de Base de Datos

Este documento define las entidades principales del dominio de **FYN**, sus campos, tipos, relaciones y el mapeo correspondiente a un esquema relacional para **PostgreSQL + Drizzle ORM**.

---

## 1. Entidades del Dominio

### 1.1 Certificate (Certificación)
Representa el certificado digital emitido para una joya.

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | `string` | Sí | Identificador único (UUID) |
| `reference` | `string` | Sí | Referencia pública única (Formato: `FYN-YY-NNNNNN`) |
| `certificateNumber` | `string` | No | Número interno de certificado |
| `jewelryId` | `string` | Sí | ID de la joya asociada (FK) |
| `status` | `CertificateStatus` | Sí | Estado: `'draft'` \| `'active'` \| `'revoked'` |
| `issuedAt` | `string` (ISO 8601) | Sí | Fecha de emisión del certificado |
| `createdAt` | `string` (ISO 8601) | Sí | Fecha de creación del registro |
| `updatedAt` | `string` (ISO 8601) | Sí | Fecha de última actualización |
| `createdBy` | `string` | No | ID del usuario administrador creador |
| `updatedBy` | `string` | No | ID del usuario administrador actualizador |

### 1.2 Jewelry (Joya)
Almacena las especificaciones técnicas y detalles de la pieza física.

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | `string` | Sí | Identificador único (UUID) |
| `name` | `string` | Sí | Nombre o título de la joya |
| `category` | `JewelryCategory` | Sí | Categoría: Anillo, Cadena, Pulsera, Aretes, Collar, Reloj, Broche, Otro |
| `description` | `string` | No | Descripción técnica o comercial detallada |
| `material` | `string` | No | Material principal (ej. Oro, Platino, Plata) |
| `metalType` | `string` | No | Especificación del metal (ej. Oro Amarillo, Platino 950) |
| `purity` | `string` | No | Ley o pureza (ej. 18K, 24K, 925, 950) |
| `weight` | `number` | No | Peso de la pieza |
| `weightUnit` | `string` | No | Unidad del peso (ej. `g`, `oz`) — Por defecto `g` |
| `serialNumber` | `string` | No | Número de serie grabado o de fabricante |
| `stoneType` | `string` | No | Tipo de gema/piedra principal (ej. Diamante, Esmeralda, Zafiro) |
| `stoneWeight` | `number` | No | Peso en quilates (ct) |
| `stoneColor` | `string` | No | Escala de color (ej. G, Verde Intenso, D) |
| `stoneClarity` | `string` | No | Escala de claridad (ej. VS1, VVS, Flawless) |
| `brand` | `string` | No | Marca o casa joyera |
| `model` | `string` | No | Modelo o referencia de catálogo |

### 1.3 CertificateFile (Archivos Adjuntos)
Gestión de documentos PDF oficial e imágenes de la joya.

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | `string` | Sí | Identificador único (UUID) |
| `certificateId` | `string` | Sí | ID del certificado (FK) |
| `type` | `CertificateFileType` | Sí | Tipo: `'certificate_pdf'` \| `'jewelry_image'` \| `'additional_document'` |
| `storageKey` | `string` | Sí | Ruta en disco o clave de objeto en S3/R2 |
| `originalName` | `string` | Sí | Nombre original del archivo |
| `mimeType` | `string` | Sí | Tipo MIME (ej. `application/pdf`, `image/jpeg`) |
| `size` | `number` | Sí | Tamaño en bytes |
| `createdAt` | `string` (ISO 8601) | Sí | Fecha de carga |

### 1.4 AuditLog (Registro de Auditoría)
Trazabilidad de cambios para validez legal y control operativo.

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | `string` | Sí | Identificador único (UUID) |
| `userId` | `string` | No | Usuario que realizó la acción |
| `action` | `string` | Sí | Acción realizada (ej. `CREATE_CERTIFICATE`, `REVOKE_CERTIFICATE`) |
| `entityType` | `string` | Sí | Entidad afectada (`certificate`, `jewelry`, `file`) |
| `entityId` | `string` | Sí | ID de la entidad afectada |
| `metadata` | `object` | No | Información contextual adicional en formato JSON |
| `createdAt` | `string` (ISO 8601) | Sí | Fecha de la acción |

---

## 2. Esquema Drizzle ORM (Plan de Migración PostgreSQL)

A continuación se presenta el código listo para implementarse en `src/db/schema.ts` utilizando **Drizzle ORM**:

```typescript
import { pgTable, uuid, varchar, text, decimal, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';

export const certificateStatusEnum = pgEnum('certificate_status', ['draft', 'active', 'revoked']);
export const fileTypeEnum = pgEnum('file_type', ['certificate_pdf', 'jewelry_image', 'additional_document']);

export const jewelryTable = pgTable('jewelry', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  description: text('description'),
  material: varchar('material', { length: 100 }),
  metalType: varchar('metal_type', { length: 100 }),
  purity: varchar('purity', { length: 50 }),
  weight: decimal('weight', { precision: 10, scale: 2 }),
  weightUnit: varchar('weight_unit', { length: 20 }).default('g'),
  serialNumber: varchar('serial_number', { length: 100 }),
  stoneType: varchar('stone_type', { length: 100 }),
  stoneWeight: decimal('stone_weight', { precision: 10, scale: 2 }),
  stoneColor: varchar('stone_color', { length: 50 }),
  stoneClarity: varchar('stone_clarity', { length: 50 }),
  brand: varchar('brand', { length: 100 }),
  model: varchar('model', { length: 100 }),
});

export const certificateTable = pgTable('certificates', {
  id: uuid('id').defaultRandom().primaryKey(),
  reference: varchar('reference', { length: 50 }).notNull().unique(),
  certificateNumber: varchar('certificate_number', { length: 100 }),
  jewelryId: uuid('jewelry_id').notNull().references(() => jewelryTable.id, { onDelete: 'cascade' }),
  status: certificateStatusEnum('status').default('draft').notNull(),
  issuedAt: timestamp('issued_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdBy: uuid('created_by'),
  updatedBy: uuid('updated_by'),
});

export const certificateFileTable = pgTable('certificate_files', {
  id: uuid('id').defaultRandom().primaryKey(),
  certificateId: uuid('certificate_id').notNull().references(() => certificateTable.id, { onDelete: 'cascade' }),
  type: fileTypeEnum('type').notNull(),
  storageKey: text('storage_key').notNull(),
  originalName: varchar('original_name', { length: 255 }).notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  size: integer('size').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```
