import type { Role } from '@prisma/client';

/**
 * Permission types
 */
export type Permission =
  // Organization
  | 'org:read'
  | 'org:update'
  | 'org:delete'
  | 'org:manage_members'
  | 'org:manage_billing'

  // Clients
  | 'client:create'
  | 'client:read'
  | 'client:update'
  | 'client:delete'

  // Devis
  | 'devis:create'
  | 'devis:read'
  | 'devis:update'
  | 'devis:delete'
  | 'devis:sign'
  | 'devis:send'

  // Factures
  | 'facture:create'
  | 'facture:read'
  | 'facture:update'
  | 'facture:delete'

  // Interventions
  | 'intervention:create'
  | 'intervention:read'
  | 'intervention:update'
  | 'intervention:delete'

  // Analytics
  | 'analytics:read'

  // Audit
  | 'audit:read'

  // Admin
  | 'admin:access';

/**
 * Role-based permission matrix
 */
const PERMISSIONS_BY_ROLE: Record<Role, Permission[]> = {
  OWNER: [
    // Owner has ALL permissions
    'org:read',
    'org:update',
    'org:delete',
    'org:manage_members',
    'org:manage_billing',
    'client:create',
    'client:read',
    'client:update',
    'client:delete',
    'devis:create',
    'devis:read',
    'devis:update',
    'devis:delete',
    'devis:sign',
    'devis:send',
    'facture:create',
    'facture:read',
    'facture:update',
    'facture:delete',
    'intervention:create',
    'intervention:read',
    'intervention:update',
    'intervention:delete',
    'analytics:read',
    'audit:read',
    'admin:access',
  ],

  ADMIN: [
    'org:read',
    'org:update',
    'org:manage_members',
    'org:manage_billing',
    'client:create',
    'client:read',
    'client:update',
    'client:delete',
    'devis:create',
    'devis:read',
    'devis:update',
    'devis:delete',
    'devis:sign',
    'devis:send',
    'facture:create',
    'facture:read',
    'facture:update',
    'facture:delete',
    'intervention:create',
    'intervention:read',
    'intervention:update',
    'intervention:delete',
    'analytics:read',
    'audit:read',
  ],

  MANAGER: [
    'client:create',
    'client:read',
    'client:update',
    'devis:create',
    'devis:read',
    'devis:update',
    'devis:send',
    'facture:create',
    'facture:read',
    'intervention:create',
    'intervention:read',
    'intervention:update',
    'analytics:read',
  ],

  USER: [
    'client:read',
    'devis:create',
    'devis:read',
    'devis:update',
    'facture:read',
    'intervention:create',
    'intervention:read',
    'intervention:update',
  ],

  VIEWER: ['client:read', 'devis:read', 'facture:read', 'intervention:read', 'analytics:read'],
};

/**
 * Check if a user with given role has permission
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  return PERMISSIONS_BY_ROLE[role]?.includes(permission) ?? false;
}

/**
 * Check if a user has ANY of the given permissions
 */
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

/**
 * Check if a user has ALL of the given permissions
 */
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

/**
 * Get all permissions for a role
 */
export function getPermissions(role: Role): Permission[] {
  return PERMISSIONS_BY_ROLE[role] ?? [];
}

/**
 * Check if user can perform action on resource owned by organization
 *
 * This is used in API routes to enforce permissions:
 * ```typescript
 * if (!canAccessResource(user.role, 'devis:update')) {
 *   return Response.json({ error: 'Forbidden' }, { status: 403 });
 * }
 * ```
 */
export function canAccessResource(role: Role, permission: Permission): boolean {
  return hasPermission(role, permission);
}

/**
 * Role hierarchy (higher values = more powerful)
 */
export const ROLE_HIERARCHY: Record<Role, number> = {
  VIEWER: 1,
  USER: 2,
  MANAGER: 3,
  ADMIN: 4,
  OWNER: 5,
};

/**
 * Check if userRole can manage targetRole
 *
 * A user can only manage roles lower in the hierarchy
 */
export function canManageRole(userRole: Role, targetRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] > ROLE_HIERARCHY[targetRole];
}
