import { z } from 'zod';

export const certificateFormSchema = z
  .object({
    certificateType: z.enum(['stone', 'jewelry'], {
      required_error: 'El tipo de certificado es requerido',
    }),
    reportLanguage: z.enum(['es', 'en']),
    stoneKind: z.enum(['diamond', 'colored_gem'], {
      required_error: 'El tipo de gema central es requerido',
    }),
    status: z.enum(['draft', 'active', 'revoked']),
    issuedAt: z.string().min(1, 'La fecha de emisión es requerida'),
    certificateNumber: z.string().optional(),

    // 2. Descripción General Joya
    jewelry: z
      .object({
        name: z.string().optional(),
        category: z.string().optional(),
        material: z.string().optional(),
        metalType: z.string().optional(),
        purity: z.string().optional(),
        grossWeight: z.number().positive('El peso bruto debe ser positivo').optional(),
        weightUnit: z.string().optional(),
        serialNumber: z.string().optional(),
        comments: z.string().optional(),
      })
      .optional(),

    // 3. Diamante Detalles
    diamondDetail: z
      .object({
        nature: z.string().optional(),
        shapeAndCut: z.string().optional(),
        measurements: z.string().optional(),
        weight: z.number().positive('El peso en quilates debe ser positivo').optional(),
        color: z.string().optional(),
        clarityGrade: z.string().optional(),
        cutGrade: z.string().optional(),
        fluorescence: z.string().optional(),
      })
      .optional(),

    // 4. Información Adicional (Diamante)
    diamondAdditionalInfo: z
      .object({
        polish: z.string().optional(),
        symmetry: z.string().optional(),
        proportions: z.string().optional(),
      })
      .optional(),

    // 5. Diamantes Adicionales Detalles (Pavé)
    hasAdditionalDiamonds: z.boolean(),
    additionalDiamonds: z
      .object({
        nature: z.string().optional(),
        totalStones: z.number().int().positive().optional(),
        shapeAndCut: z.string().optional(),
        measurements: z.string().optional(),
        estimatedWeight: z.number().positive().optional(),
        estimatedColor: z.string().optional(),
        estimatedClarity: z.string().optional(),
      })
      .optional(),

    // 6. Gema Detalles
    gemDetail: z
      .object({
        nature: z.string().optional(),
        variety: z.string().optional(),
        shapeAndCut: z.string().optional(),
        measurements: z.string().optional(),
        weight: z.number().positive('El peso en quilates debe ser positivo').optional(),
        color: z.string().optional(),
        transparency: z.string().optional(),
        cutGrade: z.string().optional(),
        treatment: z.string().optional(),
      })
      .optional(),

    // 7. Gemas Adicionales Detalles
    hasAdditionalGems: z.boolean(),
    additionalGems: z
      .object({
        nature: z.string().optional(),
        variety: z.string().optional(),
        totalStones: z.number().int().positive().optional(),
        shapeAndCut: z.string().optional(),
        measurements: z.string().optional(),
        estimatedWeight: z.number().positive().optional(),
        color: z.string().optional(),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Si es joya, el nombre y categoría son requeridos
    if (data.certificateType === 'jewelry') {
      if (!data.jewelry?.name || data.jewelry.name.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['jewelry', 'name'],
          message: 'El nombre de la joya es requerido',
        });
      }
      if (!data.jewelry?.category || data.jewelry.category.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['jewelry', 'category'],
          message: 'La categoría es requerida',
        });
      }
    }

    // Validación según tipo de reporte
    if (data.certificateType === 'jewelry') {
      if (!data.jewelry?.name || data.jewelry.name.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['jewelry', 'name'],
          message: 'El nombre de la joya es requerido',
        });
      }
      if (!data.jewelry?.category || data.jewelry.category.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['jewelry', 'category'],
          message: 'La categoría es requerida',
        });
      }
      if (!data.gemDetail?.nature) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['gemDetail', 'nature'],
          message: 'La naturaleza de la gema es requerida',
        });
      }
      if (!data.gemDetail?.variety) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['gemDetail', 'variety'],
          message: 'La variedad de la gema es requerida',
        });
      }
      if (!data.gemDetail?.shapeAndCut) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['gemDetail', 'shapeAndCut'],
          message: 'La forma y corte son requeridos',
        });
      }
      if (data.gemDetail?.weight === undefined || data.gemDetail?.weight === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['gemDetail', 'weight'],
          message: 'El peso en quilates es requerido',
        });
      }
      if (!data.gemDetail?.color) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['gemDetail', 'color'],
          message: 'El color es requerido',
        });
      }
    } else {
      // Reporte de Diamante
      if (!data.diamondDetail?.nature) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['diamondDetail', 'nature'],
          message: 'La naturaleza del diamante es requerida',
        });
      }
      if (!data.diamondDetail?.shapeAndCut) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['diamondDetail', 'shapeAndCut'],
          message: 'La forma y corte son requeridos',
        });
      }
      if (data.diamondDetail?.weight === undefined || data.diamondDetail?.weight === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['diamondDetail', 'weight'],
          message: 'El peso en quilates es requerido',
        });
      }
      if (!data.diamondDetail?.color) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['diamondDetail', 'color'],
          message: 'El grado de color es requerido',
        });
      }
      if (!data.diamondDetail?.clarityGrade) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['diamondDetail', 'clarityGrade'],
          message: 'El grado de pureza es requerido',
        });
      }
    }
  });

export type CertificateFormData = z.infer<typeof certificateFormSchema>;
