import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClientSchema, paginationSchema, clientFilterSchema } from '@/lib/validations';
import { extractTenantContext } from '@/lib/tenant-middleware';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Client } from '@prisma/client';

/**
 * GET /api/clients
 *
 * Retrieve all clients for the current organization with pagination and filtering
 *
 * Query parameters:
 * - page: number (default: 1)
 * - pageSize: number (default: 20, max: 100)
 * - search: string (searches in name, email)
 * - status: prospect | active | inactive | archived
 * - type: company | individual
 * - sortBy: name | createdAt | email (default: createdAt)
 * - sortOrder: asc | desc (default: desc)
 */
export async function GET(request: NextRequest) {
  try {
    // Extract tenant context
    const tenantContext = await extractTenantContext(request);
    if (!tenantContext?.organizationId) {
      return NextResponse.json<ApiResponse>({ success: false, error: 'No organization context', timestamp: new Date().toISOString() }, { status: 401 });
    }

    // Parse and validate query parameters
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const paginationParams = paginationSchema.parse(searchParams);
    const filterParams = clientFilterSchema.parse(searchParams);

    const { page = 1, pageSize = 20, search, sortBy = 'createdAt', sortOrder = 'desc' } = paginationParams;
    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: any = {
      organizationId: tenantContext.organizationId,
    };

    if (filterParams.status) {
      where.status = filterParams.status;
    }

    if (filterParams.type) {
      where.type = filterParams.type;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Fetch clients with pagination
    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.client.count({ where }),
    ]);

    const hasMore = skip + pageSize < total;
    const totalPages = Math.ceil(total / pageSize);

    const response: ApiResponse<PaginatedResponse<Client>> = {
      success: true,
      data: {
        items: clients,
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
    console.error('Error fetching clients:', error);
    return NextResponse.json<ApiResponse>({ success: false, error: 'Failed to fetch clients', timestamp: new Date().toISOString() }, { status: 500 });
  }
}

/**
 * POST /api/clients
 *
 * Create a new client for the current organization
 *
 * Request body:
 * {
 *   name: string (required)
 *   email?: string
 *   phone?: string
 *   website?: string
 *   address?: string
 *   city?: string
 *   zipCode?: string
 *   country?: string
 *   type?: "company" | "individual" (default: "company")
 *   siretSiren?: string
 *   status?: "prospect" | "active" | "inactive" | "archived" (default: "prospect")
 *   source?: string
 *   notes?: string
 *   tags?: string[]
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Extract tenant context
    const tenantContext = await extractTenantContext(request);
    if (!tenantContext?.organizationId) {
      return NextResponse.json<ApiResponse>({ success: false, error: 'No organization context', timestamp: new Date().toISOString() }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validatedData = createClientSchema.parse(body);

    // Check if email is already used in this organization
    if (validatedData.email) {
      const existingClient = await prisma.client.findFirst({
        where: {
          organizationId: tenantContext.organizationId,
          email: validatedData.email,
        },
      });

      if (existingClient) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'A client with this email already exists', timestamp: new Date().toISOString() },
          { status: 409 }
        );
      }
    }

    // Create client
    const client = await prisma.client.create({
      data: {
        ...validatedData,
        organizationId: tenantContext.organizationId,
      },
    });

    // Log action
    await prisma.auditLog.create({
      data: {
        organizationId: tenantContext.organizationId,
        userId: tenantContext.userId,
        action: 'client.created',
        entity: 'Client',
        entityId: client.id,
        newValues: client as any,
      },
    });

    const response: ApiResponse<Client> = {
      success: true,
      data: client,
      message: 'Client created successfully',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error('Error creating client:', error);

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

    return NextResponse.json<ApiResponse>({ success: false, error: 'Failed to create client', timestamp: new Date().toISOString() }, { status: 500 });
  }
} 