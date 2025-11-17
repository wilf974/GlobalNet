import { headers } from 'next/headers';
import type { NextRequest } from 'next/server';

/**
 * Tenant context stored in headers during request processing
 */
export interface TenantContext {
  organizationId: string;
  userId?: string;
  role?: string;
}

/**
 * Extract tenant information from request
 *
 * Supports multiple tenant detection strategies:
 * 1. X-Organization-ID header (preferred)
 * 2. Path parameter /org/[slug]/...
 * 3. Subdomain-based tenancy (future)
 */
export async function extractTenantContext(request?: NextRequest): Promise<TenantContext | null> {
  try {
    const headersList = headers();

    // Strategy 1: Check X-Organization-ID header (set by middleware or auth)
    const organizationId = headersList.get('x-organization-id');
    if (organizationId) {
      return {
        organizationId,
        userId: headersList.get('x-user-id') || undefined,
        role: headersList.get('x-user-role') || undefined,
      };
    }

    // Strategy 2: Extract from URL path /org/[slug]/...
    if (request) {
      const pathname = request.nextUrl.pathname;
      const orgMatch = pathname.match(/^\/org\/([a-z0-9-]+)\//);
      if (orgMatch) {
        return {
          organizationId: orgMatch[1],
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Error extracting tenant context:', error);
    return null;
  }
}

/**
 * Verify that a resource belongs to the specified organization
 *
 * Use this in API routes to ensure users can only access their organization's data
 */
export function validateTenantAccess(
  resourceOrganizationId: string,
  requestOrganizationId: string,
): boolean {
  return resourceOrganizationId === requestOrganizationId;
}

/**
 * Middleware to attach organization context to request
 *
 * Usage in API route:
 * ```typescript
 * import { withTenantContext } from '@/lib/tenant-middleware';
 * import { prisma } from '@/lib/prisma';
 *
 * export async function GET(request: NextRequest) {
 *   return withTenantContext(request, async (orgId) => {
 *     const clients = await prisma.client.findMany({
 *       where: { organizationId: orgId }
 *     });
 *     return Response.json(clients);
 *   });
 * }
 * ```
 */
export async function withTenantContext(
  request: NextRequest,
  handler: (organizationId: string) => Promise<Response>,
): Promise<Response> {
  try {
    const tenantContext = await extractTenantContext(request);

    if (!tenantContext?.organizationId) {
      return new Response(JSON.stringify({ error: 'No organization context found' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return handler(tenantContext.organizationId);
  } catch (error) {
    console.error('Tenant middleware error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
