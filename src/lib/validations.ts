import { z } from 'zod';

/**
 * Client validation schemas
 */
export const createClientSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  website: z.string().url('URL invalide').optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  zipCode: z.string().optional().or(z.literal('')),
  country: z.string().optional().or(z.literal('')),
  type: z.enum(['company', 'individual']).default('company'),
  siretSiren: z.string().optional().or(z.literal('')),
  status: z.enum(['prospect', 'active', 'inactive', 'archived']).default('prospect'),
  source: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
  tags: z.array(z.string()).default([]),
});

export const updateClientSchema = createClientSchema.partial();

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;

/**
 * Devis (Quote) validation schemas
 */
export const createDevisSchema = z.object({
  clientId: z.string().cuid('Client invalide'),
  description: z.string().optional().or(z.literal('')),
  items: z
    .array(
      z.object({
        description: z.string().min(1, 'La description est obligatoire'),
        quantity: z.number().positive('La quantité doit être positive'),
        unitPrice: z.number().nonnegative('Le prix doit être positif'),
      }),
    )
    .nonempty('Au moins un article est obligatoire'),
  discount: z.number().nonnegative('La réduction doit être positive').default(0),
  discountType: z.enum(['fixed', 'percent']).default('fixed'),
  taxRate: z.number().nonnegative('Le taux de TVA doit être positif').default(20),
  validUntil: z.string().datetime().optional(),
  terms: z.string().optional().or(z.literal('')),
  internalNotes: z.string().optional().or(z.literal('')),
});

export const updateDevisSchema = createDevisSchema.partial().omit({ items: true }).extend({
  items: z
    .array(
      z.object({
        description: z.string().min(1),
        quantity: z.number().positive(),
        unitPrice: z.number().nonnegative(),
      }),
    )
    .optional(),
});

export type CreateDevisInput = z.infer<typeof createDevisSchema>;
export type UpdateDevisInput = z.infer<typeof updateDevisSchema>;

/**
 * Facture (Invoice) validation schemas
 */
export const createFactureSchema = z.object({
  devisId: z.string().cuid().optional(),
  clientId: z.string().cuid(),
  discount: z.number().nonnegative().default(0),
  discountType: z.enum(['fixed', 'percent']).default('fixed'),
  taxRate: z.number().nonnegative().default(20),
  dueDate: z.string().datetime().optional(),
  terms: z.string().optional().or(z.literal('')),
});

export type CreateFactureInput = z.infer<typeof createFactureSchema>;

/**
 * Intervention validation schemas
 */
export const createInterventionSchema = z.object({
  clientId: z.string().cuid(),
  devisId: z.string().cuid().optional(),
  title: z.string().min(2, 'Le titre doit contenir au moins 2 caractères'),
  description: z.string().optional().or(z.literal('')),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'canceled']).default('scheduled'),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  scheduledDate: z.string().datetime('Date et heure invalides'),
  address: z.string().optional().or(z.literal('')),
  assignedTo: z.array(z.string().cuid()).optional().default([]),
  notes: z.string().optional().or(z.literal('')),
});

export const updateInterventionSchema = createInterventionSchema.partial();

export type CreateInterventionInput = z.infer<typeof createInterventionSchema>;
export type UpdateInterventionInput = z.infer<typeof updateInterventionSchema>;

/**
 * Pagination validation
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  skip: z.coerce.number().int().nonnegative().optional(),
  take: z.coerce.number().int().positive().optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

/**
 * Filter schemas
 */
export const clientFilterSchema = z.object({
  status: z.enum(['prospect', 'active', 'inactive', 'archived']).optional(),
  type: z.enum(['company', 'individual']).optional(),
  search: z.string().optional(),
});

export const devisFilterSchema = z.object({
  status: z
    .enum(['draft', 'sent', 'viewed', 'accepted', 'rejected', 'invoiced', 'archived'])
    .optional(),
  clientId: z.string().cuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const factureFilterSchema = z.object({
  status: z
    .enum(['draft', 'sent', 'viewed', 'paid', 'overdue', 'canceled', 'archived'])
    .optional(),
  paymentStatus: z.enum(['unpaid', 'partial', 'paid', 'refunded']).optional(),
  clientId: z.string().cuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});
