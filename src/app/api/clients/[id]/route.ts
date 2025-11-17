import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateClientSchema } from '@/lib/validations';
import { extractTenantContext, validateTenantAccess } from '@/lib/tenant-middleware';
import type { ApiResponse } from '@/types/api';
import type { Client } from '@prisma/client';

/**
 * GET /api/clients/[id]
 *
 * Retrieve a specific client by ID (with tenant isolation)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Extract tenant context
    const tenantContext = await extractTenantContext(request);
    if (!tenantContext?.organizationId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'No organization context', timestamp: new Date().toISOString() },
        { status: 401 }
      );
    }

    // Fetch client
    const client = await prisma.client.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { devis: true, factures: true, interventions: true },
        },
      },
    });

    if (!client) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Client not found', timestamp: new Date().toISOString() },
        { status: 404 }
      );
    }

    // Verify tenant access
    if (!validateTenantAccess(client.organizationId, tenantContext.organizationId)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Access denied', timestamp: new Date().toISOString() },
        { status: 403 }
      );
    }

    const response: ApiResponse<Client> = {
      success: true,
      data: client,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to fetch client', timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/clients/[id]
 *
 * Update a specific client (with tenant isolation)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Extract tenant context
    const tenantContext = await extractTenantContext(request);
    if (!tenantContext?.organizationId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'No organization context', timestamp: new Date().toISOString() },
        { status: 401 }
      );
    }

    // Fetch client to verify ownership
    const client = await prisma.client.findUnique({
      where: { id: params.id },
    });

    if (!client) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Client not found', timestamp: new Date().toISOString() },
        { status: 404 }
      );
    }

    if (!validateTenantAccess(client.organizationId, tenantContext.organizationId)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Access denied', timestamp: new Date().toISOString() },
        { status: 403 }
      );
    }

    // Parse and validate input
    const body = await request.json();
    const validatedData = updateClientSchema.parse(body);

    // Check if email is being changed and is already in use
    if (validatedData.email && validatedData.email !== client.email) {
      const existingClient = await prisma.client.findFirst({
        where: {
          organizationId: tenantContext.organizationId,
          email: validatedData.email,
          id: { not: params.id },
        },
      });

      if (existingClient) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Email already in use', timestamp: new Date().toISOString() },
          { status: 409 }
        );
      }
    }

    // Update client
    const updatedClient = await prisma.client.update({
      where: { id: params.id },
      data: validatedData,
    });

    // Log action
    await prisma.auditLog.create({
      data: {
        organizationId: tenantContext.organizationId,
        userId: tenantContext.userId,
        action: 'client.updated',
        entity: 'Client',
        entityId: params.id,
        oldValues: client as any,
        newValues: updatedClient as any,
      },
    });

    const response: ApiResponse<Client> = {
      success: true,
      data: updatedClient,
      message: 'Client updated successfully',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error updating client:', error);

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
      { success: false, error: 'Failed to update client', timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/clients/[id]
 *
 * Delete a specific client (with tenant isolation)
 * Note: This implements a soft delete with archive status
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Extract tenant context
    const tenantContext = await extractTenantContext(request);
    if (!tenantContext?.organizationId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'No organization context', timestamp: new Date().toISOString() },
        { status: 401 }
      );
    }

    // Fetch client to verify ownership
    const client = await prisma.client.findUnique({
      where: { id: params.id },
    });

    if (!client) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Client not found', timestamp: new Date().toISOString() },
        { status: 404 }
      );
    }

    if (!validateTenantAccess(client.organizationId, tenantContext.organizationId)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Access denied', timestamp: new Date().toISOString() },
        { status: 403 }
      );
    }

    // Soft delete: archive the client instead of removing
    const deletedClient = await prisma.client.update({
      where: { id: params.id },
      data: { status: 'archived' },
    });

    // Log action
    await prisma.auditLog.create({
      data: {
        organizationId: tenantContext.organizationId,
        userId: tenantContext.userId,
        action: 'client.archived',
        entity: 'Client',
        entityId: params.id,
        newValues: { status: 'archived' },
      },
    });

    const response: ApiResponse = {
      success: true,
      message: 'Client archived successfully',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to delete client', timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
} 