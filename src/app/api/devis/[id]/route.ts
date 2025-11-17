import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateDevisSchema } from '@/lib/validations';
import { extractTenantContext, validateTenantAccess } from '@/lib/tenant-middleware';
import type { ApiResponse } from '@/types/api';
import type { Devis } from '@prisma/client';

/**
 * GET /api/devis/[id]
 *
 * Retrieve a specific quote by ID (with tenant isolation)
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

    // Fetch devis
    const devis = await prisma.devis.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        items: true,
        factures: { select: { id: true, number: true, status: true } },
        createdBy: { select: { id: true, name: true, email: true } },
        updatedBy: { select: { id: true, name: true, email: true } },
      },
    });

    if (!devis) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Quote not found', timestamp: new Date().toISOString() },
        { status: 404 }
      );
    }

    // Verify tenant access
    if (!validateTenantAccess(devis.organizationId, tenantContext.organizationId)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Access denied', timestamp: new Date().toISOString() },
        { status: 403 }
      );
    }

    const response: ApiResponse<any> = {
      success: true,
      data: devis,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching devis:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to fetch quote', timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/devis/[id]
 *
 * Update a specific quote (with tenant isolation)
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

    // Fetch devis to verify ownership
    const devis = await prisma.devis.findUnique({
      where: { id: params.id },
      include: { items: true },
    });

    if (!devis) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Quote not found', timestamp: new Date().toISOString() },
        { status: 404 }
      );
    }

    if (!validateTenantAccess(devis.organizationId, tenantContext.organizationId)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Access denied', timestamp: new Date().toISOString() },
        { status: 403 }
      );
    }

    // Parse and validate input
    const body = await request.json();
    const validatedData = updateDevisSchema.parse(body);

    // Calculate new totals if items provided
    let updateData: any = { ...validatedData };

    if (validatedData.items && validatedData.items.length > 0) {
      const newSubtotal = validatedData.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      const newDiscount = validatedData.discountType === 'percent'
        ? newSubtotal * (validatedData.discount / 100)
        : (validatedData.discount || 0);
      const newTaxAmount = (newSubtotal - newDiscount) * ((validatedData.taxRate || 20) / 100);
      const newTotal = newSubtotal - newDiscount + newTaxAmount;

      updateData.subtotal = newSubtotal;
      updateData.discount = newDiscount;
      updateData.taxAmount = newTaxAmount;
      updateData.total = newTotal;

      // Delete old items and create new ones
      await prisma.devisItem.deleteMany({
        where: { devisId: params.id },
      });

      updateData.items = {
        createMany: {
          data: validatedData.items.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.unitPrice * item.quantity,
          })),
        },
      };
    }

    updateData.updatedById = tenantContext.userId;

    // Update devis
    const updatedDevis = await prisma.devis.update({
      where: { id: params.id },
      data: updateData,
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
        action: 'devis.updated',
        entity: 'Devis',
        entityId: params.id,
        oldValues: devis as any,
        newValues: updatedDevis as any,
      },
    });

    const response: ApiResponse<any> = {
      success: true,
      data: updatedDevis,
      message: 'Quote updated successfully',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error updating devis:', error);

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
      { success: false, error: 'Failed to update quote', timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/devis/[id]
 *
 * Delete a specific quote (with tenant isolation)
 * Note: Can only delete draft quotes
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

    // Fetch devis to verify ownership
    const devis = await prisma.devis.findUnique({
      where: { id: params.id },
    });

    if (!devis) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Quote not found', timestamp: new Date().toISOString() },
        { status: 404 }
      );
    }

    if (!validateTenantAccess(devis.organizationId, tenantContext.organizationId)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Access denied', timestamp: new Date().toISOString() },
        { status: 403 }
      );
    }

    // Only allow deletion of draft quotes
    if (devis.status !== 'draft') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Can only delete draft quotes', timestamp: new Date().toISOString() },
        { status: 409 }
      );
    }

    // Soft delete: archive the quote instead of removing
    const deletedDevis = await prisma.devis.update({
      where: { id: params.id },
      data: { status: 'archived' },
    });

    // Log action
    await prisma.auditLog.create({
      data: {
        organizationId: tenantContext.organizationId,
        userId: tenantContext.userId,
        action: 'devis.archived',
        entity: 'Devis',
        entityId: params.id,
        newValues: { status: 'archived' },
      },
    });

    const response: ApiResponse = {
      success: true,
      message: 'Quote archived successfully',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting devis:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to delete quote', timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
} 