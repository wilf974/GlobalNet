import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createFactureSchema, paginationSchema, factureFilterSchema } from '@/lib/validations';
import { extractTenantContext } from '@/lib/tenant-middleware';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Facture } from '@prisma/client';

/**
 * GET /api/factures
 *
 * Retrieve all invoices for the current organization with pagination and filtering
 *
 * Query parameters:
 * - page: number (default: 1)
 * - pageSize: number (default: 20, max: 100)
 * - search: string (searches in client name, number)
 * - status: draft | sent | viewed | paid | overdue | canceled | archived
 * - paymentStatus: unpaid | partial | paid | refunded
 * - clientId: string (filter by client)
 * - startDate: ISO date string
 * - endDate: ISO date string
 * - sortBy: number | createdAt | dueDate | total | status (default: createdAt)
 * - sortOrder: asc | desc (default: desc)
 */
export async function GET(request: NextRequest) {
  try {
    // Extract tenant context
    const tenantContext = await extractTenantContext(request);
    if (!tenantContext?.organizationId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'No organization context', timestamp: new Date().toISOString() },
        { status: 401 }
      );
    }

    // Parse and validate query parameters
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const paginationParams = paginationSchema.parse(searchParams);
    const filterParams = factureFilterSchema.parse(searchParams);

    const { page = 1, pageSize = 20, search, sortBy = 'createdAt', sortOrder = 'desc' } = paginationParams;
    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: any = {
      organizationId: tenantContext.organizationId,
    };

    if (filterParams.status) {
      where.status = filterParams.status;
    }

    if (filterParams.paymentStatus) {
      where.paymentStatus = filterParams.paymentStatus;
    }

    if (filterParams.clientId) {
      where.clientId = filterParams.clientId;
    }

    if (filterParams.startDate) {
      where.invoiceDate = { gte: new Date(filterParams.startDate) };
    }

    if (filterParams.endDate) {
      if (where.invoiceDate) {
        where.invoiceDate.lte = new Date(filterParams.endDate);
      } else {
        where.invoiceDate = { lte: new Date(filterParams.endDate) };
      }
    }

    if (search) {
      where.OR = [
        { number: { contains: search, mode: 'insensitive' } },
        { client: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    // Fetch invoices with pagination
    const [factures, total] = await Promise.all([
      prisma.facture.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { [sortBy]: sortOrder },
        include: {
          client: { select: { id: true, name: true, email: true } },
          devis: { select: { id: true, number: true } },
          createdBy: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.facture.count({ where }),
    ]);

    const hasMore = skip + pageSize < total;
    const totalPages = Math.ceil(total / pageSize);

    const response: ApiResponse<PaginatedResponse<any>> = {
      success: true,
      data: {
        items: factures,
        total,
        page,
        pageSize,
        hasMore,
        totalPages,
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching factures:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to fetch invoices', timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}

/**
 * POST /api/factures
 *
 * Create a new invoice for the current organization
 * Can be created from an accepted devis or standalone
 *
 * Request body:
 * {
 *   devisId?: string (optional, if provided invoice is created from devis)
 *   clientId: string (required if devisId not provided)
 *   discount?: number (default: 0)
 *   discountType?: "fixed" | "percent" (default: "fixed")
 *   taxRate?: number (default: 20)
 *   dueDate?: ISO date string
 *   terms?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Extract tenant context
    const tenantContext = await extractTenantContext(request);
    if (!tenantContext?.organizationId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'No organization context', timestamp: new Date().toISOString() },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate input
    const validatedData = createFactureSchema.parse(body);

    // If creating from devis
    if (validatedData.devisId) {
      const devis = await prisma.devis.findUnique({
        where: { id: validatedData.devisId },
        include: { items: true },
      });

      if (!devis) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Quote not found', timestamp: new Date().toISOString() },
          { status: 404 }
        );
      }

      if (devis.organizationId !== tenantContext.organizationId) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Access denied', timestamp: new Date().toISOString() },
          { status: 403 }
        );
      }

      if (devis.status !== 'accepted') {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: 'Only accepted quotes can be converted to invoices',
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
      }

      // Generate unique invoice number
      const count = await prisma.facture.count({
        where: { organizationId: tenantContext.organizationId },
      });
      const factureNumber = `FA-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

      // Create facture from devis
      const facture = await prisma.facture.create({
        data: {
          organizationId: tenantContext.organizationId,
          devisId: devis.id,
          clientId: devis.clientId,
          number: factureNumber,
          status: 'draft',
          subtotal: devis.subtotal,
          discount: devis.discount,
          discountType: devis.discountType,
          taxRate: devis.taxRate,
          taxAmount: devis.taxAmount,
          total: devis.total,
          dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined,
          terms: validatedData.terms,
          invoiceDate: new Date(),
          createdById: tenantContext.userId || 'system',
        },
        include: {
          client: { select: { id: true, name: true, email: true } },
          devis: { select: { id: true, number: true } },
        },
      });

      // Log action
      await prisma.auditLog.create({
        data: {
          organizationId: tenantContext.organizationId,
          userId: tenantContext.userId,
          action: 'facture.created_from_devis',
          entity: 'Facture',
          entityId: facture.id,
          newValues: facture as any,
        },
      });

      const response: ApiResponse<any> = {
        success: true,
        data: facture,
        message: 'Invoice created from quote',
        timestamp: new Date().toISOString(),
      };

      return NextResponse.json(response, { status: 201 });
    }

    // Create standalone facture
    if (!validatedData.clientId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'clientId is required when not creating from devis', timestamp: new Date().toISOString() },
        { status: 400 }
      );
    }

    // Verify client exists and belongs to organization
    const client = await prisma.client.findUnique({
      where: { id: validatedData.clientId },
    });

    if (!client || client.organizationId !== tenantContext.organizationId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Client not found or access denied', timestamp: new Date().toISOString() },
        { status: 404 }
      );
    }

    // Generate unique invoice number
    const count = await prisma.facture.count({
      where: { organizationId: tenantContext.organizationId },
    });
    const factureNumber = `FA-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    // Create standalone facture
    const facture = await prisma.facture.create({
      data: {
        organizationId: tenantContext.organizationId,
        clientId: validatedData.clientId,
        number: factureNumber,
        status: 'draft',
        subtotal: 0,
        discount: validatedData.discount,
        discountType: validatedData.discountType,
        taxRate: validatedData.taxRate,
        taxAmount: 0,
        total: 0,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined,
        terms: validatedData.terms,
        invoiceDate: new Date(),
        createdById: tenantContext.userId || 'system',
      },
      include: {
        client: { select: { id: true, name: true, email: true } },
      },
    });

    // Log action
    await prisma.auditLog.create({
      data: {
        organizationId: tenantContext.organizationId,
        userId: tenantContext.userId,
        action: 'facture.created',
        entity: 'Facture',
        entityId: facture.id,
        newValues: facture as any,
      },
    });

    const response: ApiResponse<any> = {
      success: true,
      data: facture,
      message: 'Invoice created successfully',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error('Error creating facture:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Validation error',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to create invoice', timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
} 