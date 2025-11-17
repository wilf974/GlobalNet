import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createDevisSchema, paginationSchema, devisFilterSchema } from '@/lib/validations';
import { extractTenantContext } from '@/lib/tenant-middleware';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Devis } from '@prisma/client';

/**
 * GET /api/devis
 *
 * Retrieve all quotes for the current organization with pagination and filtering
 *
 * Query parameters:
 * - page: number (default: 1)
 * - pageSize: number (default: 20, max: 100)
 * - search: string (searches in client name, number)
 * - status: draft | sent | viewed | accepted | rejected | invoiced | archived
 * - clientId: string (filter by client)
 * - startDate: ISO date string
 * - endDate: ISO date string
 * - sortBy: number | createdAt | total | status (default: createdAt)
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
    const filterParams = devisFilterSchema.parse(searchParams);

    const { page = 1, pageSize = 20, search, sortBy = 'createdAt', sortOrder = 'desc' } = paginationParams;
    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: any = {
      organizationId: tenantContext.organizationId,
    };

    if (filterParams.status) {
      where.status = filterParams.status;
    }

    if (filterParams.clientId) {
      where.clientId = filterParams.clientId;
    }

    if (filterParams.startDate) {
      where.devisDate = { gte: new Date(filterParams.startDate) };
    }

    if (filterParams.endDate) {
      if (where.devisDate) {
        where.devisDate.lte = new Date(filterParams.endDate);
      } else {
        where.devisDate = { lte: new Date(filterParams.endDate) };
      }
    }

    if (search) {
      where.OR = [
        { number: { contains: search, mode: 'insensitive' } },
        { client: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    // Fetch quotes with pagination
    const [devis, total] = await Promise.all([
      prisma.devis.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { [sortBy]: sortOrder },
        include: {
          client: { select: { id: true, name: true, email: true } },
          items: true,
          _count: { select: { factures: true } },
        },
      }),
      prisma.devis.count({ where }),
    ]);

    const hasMore = skip + pageSize < total;
    const totalPages = Math.ceil(total / pageSize);

    const response: ApiResponse<PaginatedResponse<any>> = {
      success: true,
      data: {
        items: devis,
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
    console.error('Error fetching devis:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to fetch quotes', timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}

/**
 * POST /api/devis
 *
 * Create a new quote for the current organization
 *
 * Request body:
 * {
 *   clientId: string (required, client CUID)
 *   items: Array<{
 *     description: string
 *     quantity: number
 *     unitPrice: number
 *   }> (required, at least 1 item)
 *   discount?: number (default: 0)
 *   discountType?: "fixed" | "percent" (default: "fixed")
 *   taxRate?: number (default: 20)
 *   validUntil?: ISO date string
 *   terms?: string
 *   description?: string
 *   internalNotes?: string
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
    const validatedData = createDevisSchema.parse(body);

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

    // Calculate totals
    const subtotal = validatedData.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const discountAmount = validatedData.discountType === 'percent'
      ? subtotal * (validatedData.discount / 100)
      : validatedData.discount;
    const taxAmount = (subtotal - discountAmount) * (validatedData.taxRate / 100);
    const total = subtotal - discountAmount + taxAmount;

    // Generate unique devis number
    const count = await prisma.devis.count({
      where: { organizationId: tenantContext.organizationId },
    });
    const devisNumber = `DV-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    // Create devis with items
    const devis = await prisma.devis.create({
      data: {
        organizationId: tenantContext.organizationId,
        clientId: validatedData.clientId,
        number: devisNumber,
        status: 'draft',
        subtotal,
        discount: discountAmount,
        discountType: validatedData.discountType,
        taxRate: validatedData.taxRate,
        taxAmount,
        total,
        validUntil: validatedData.validUntil ? new Date(validatedData.validUntil) : undefined,
        description: validatedData.description,
        terms: validatedData.terms,
        internalNotes: validatedData.internalNotes,
        createdById: tenantContext.userId || 'system',
        items: {
          createMany: {
            data: validatedData.items.map(item => ({
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: item.unitPrice * item.quantity,
            })),
          },
        },
      },
      include: {
        items: true,
        client: { select: { id: true, name: true, email: true } },
      },
    });

    // Log action
    await prisma.auditLog.create({
      data: {
        organizationId: tenantContext.organizationId,
        userId: tenantContext.userId,
        action: 'devis.created',
        entity: 'Devis',
        entityId: devis.id,
        newValues: devis as any,
      },
    });

    const response: ApiResponse<any> = {
      success: true,
      data: devis,
      message: 'Quote created successfully',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error('Error creating devis:', error);

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
      { success: false, error: 'Failed to create quote', timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
} 