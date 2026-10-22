import { z } from 'zod';

export const jewelrySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  category: z.enum(['Anillo', 'Cadena', 'Pulsera', 'Aretes', 'Collar', 'Reloj', 'Broche', 'Otro'], {
    required_error: 'La categoría es requerida',
  }),
  description: z.string().optional(),
  material: z.string().optional(),
  metalType: z.string().optional(),
  purity: z.string().optional(),
  weight: z.number().positive('El peso debe ser positivo').optional(),
  weightUnit: z.string().optional(),
  serialNumber: z.string().optional(),
  stoneType: z.string().optional(),
  stoneWeight: z.number().positive('El peso de la piedra debe ser positivo').optional(),
  stoneColor: z.string().optional(),
  stoneClarity: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
});

export const createCertificateSchema = z.object({
  jewelry: jewelrySchema,
  status: z.enum(['draft', 'active', 'revoked'], {
    required_error: 'El estado es requerido',
  }),
  issuedAt: z.string().min(1, 'La fecha de emisión es requerida'),
  certificateNumber: z.string().optional(),
});

export const updateCertificateSchema = z.object({
  jewelry: jewelrySchema.partial().optional(),
  status: z.enum(['draft', 'active', 'revoked']).optional(),
  issuedAt: z.string().optional(),
  certificateNumber: z.string().optional(),
  // certificateType es inmutable tras su registro inicial
  certificateType: z
    .never({
      invalid_type_error: 'El tipo de certificado es inmutable tras su registro inicial',
    })
    .optional(),
});

export const referenceSchema = z.string().regex(
  /^FYN-\d{2}-\d{6}$/,
  'El formato de referencia debe ser FYN-YY-NNNNNN'
);
