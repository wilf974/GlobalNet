/**
 * Standard API Response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

/**
 * Paginated API Response
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  totalPages: number;
}

/**
 * Pagination query parameters
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  skip?: number;
  take?: number;
  cursor?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Filter and sort parameters
 */
export interface FilterParams {
  status?: string;
  startDate?: string;
  endDate?: string;
  clientId?: string;
  userId?: string;
  [key: string]: string | undefined;
}

/**
 * API Error Response
 */
export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

/**
 * Standard error codes
 */
export enum ErrorCode {
  // Client errors
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',

  // Server errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',

  // Business logic errors
  INVALID_TENANT = 'INVALID_TENANT',
  INVALID_PERMISSION = 'INVALID_PERMISSION',
  RESOURCE_NOT_OWNED = 'RESOURCE_NOT_OWNED',
  INVALID_STATE_TRANSITION = 'INVALID_STATE_TRANSITION',
}

/**
 * Request context including tenant and user information
 */
export interface RequestContext {
  organizationId: string;
  userId?: string;
  role?: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Batch operation result
 */
export interface BatchResult<T> {
  successful: T[];
  failed: Array<{
    item: T;
    error: string;
  }>;
  total: number;
  successCount: number;
  failureCount: number;
}
