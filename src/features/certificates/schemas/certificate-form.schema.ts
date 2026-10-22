import { z } from 'zod';

const optionalNumberSchema = z
  .number({ invalid_type_error: 'Debe ser un número válido' })
  .positive('El valor debe ser positivo')
  .optional()
  .nullable();

const optionalIntSchema = z
  .number({ invalid_type_error: 'Debe ser un número válido' })
  .int('Debe ser un número entero')
  .positive('El valor debe ser positivo')
  .optional()
  .nullable();

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
        grossWeight: optionalNumberSchema,
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
        weight: optionalNumberSchema,
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
        totalStones: optionalIntSchema,
        shapeAndCut: z.string().optional(),
        measurements: z.string().optional(),
        estimatedWeight: optionalNumberSchema,
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
        weight: optionalNumberSchema,
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
        totalStones: optionalIntSchema,
        shapeAndCut: z.string().optional(),
        measurements: z.string().optional(),
        estimatedWeight: optionalNumberSchema,
        color: z.string().optional(),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Si es borrador, relajamos validaciones estrictas
    if (data.status === 'draft') {
      if (data.certificateType === 'jewelry') {
        if (!data.jewelry?.name || data.jewelry.name.trim().length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['jewelry', 'name'],
            message: 'El nombre de la joya es requerido para el borrador',
          });
        }
      }
      return;
    }

    // Validación estricta para emisión activa (status === 'active' | 'revoked')
    if (data.certificateType === 'jewelry') {
      // 1. Campos obligatorios de Joya
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
          message: 'La categoría de la joya es requerida',
        });
      }

      // 2. Campos obligatorios de la Gema de la Joya
      if (!data.gemDetail?.nature || data.gemDetail.nature.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['gemDetail', 'nature'],
          message: 'La naturaleza de la gema es requerida',
        });
      }
      if (!data.gemDetail?.variety || data.gemDetail.variety.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['gemDetail', 'variety'],
          message: 'La variedad de la gema es requerida',
        });
      }
      if (!data.gemDetail?.shapeAndCut || data.gemDetail.shapeAndCut.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['gemDetail', 'shapeAndCut'],
          message: 'La forma y corte de la gema son requeridos',
        });
      }
      if (data.gemDetail?.weight === undefined || data.gemDetail?.weight === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['gemDetail', 'weight'],
          message: 'El peso en quilates de la gema es requerido',
        });
      }
      if (!data.gemDetail?.color || data.gemDetail.color.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['gemDetail', 'color'],
          message: 'El color de la gema es requerido',
        });
      }
      // Los campos de diamondDetail y diamondAdditionalInfo NO se validan para joyería
    } else {
      // Reporte de DIAMANTE (certificateType === 'stone')
      if (!data.diamondDetail?.nature || data.diamondDetail.nature.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['diamondDetail', 'nature'],
          message: 'La naturaleza del diamante es requerida',
        });
      }
      if (!data.diamondDetail?.shapeAndCut || data.diamondDetail.shapeAndCut.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['diamondDetail', 'shapeAndCut'],
          message: 'La forma y corte del diamante son requeridos',
        });
      }
      if (data.diamondDetail?.weight === undefined || data.diamondDetail?.weight === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['diamondDetail', 'weight'],
          message: 'El peso en quilates del diamante es requerido',
        });
      }
      if (!data.diamondDetail?.color || data.diamondDetail.color.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['diamondDetail', 'color'],
          message: 'El grado de color del diamante es requerido',
        });
      }
      if (!data.diamondDetail?.clarityGrade || data.diamondDetail.clarityGrade.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['diamondDetail', 'clarityGrade'],
          message: 'El grado de pureza del diamante es requerido',
        });
      }
      // Los campos de jewelry y gemDetail NO se validan para diamantes
    }
  });

export type CertificateFormData = z.infer<typeof certificateFormSchema>;
