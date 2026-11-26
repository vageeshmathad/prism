/**
 * Standard response helpers for consistent API responses
 */
import { Response } from 'express';

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: PaginationMeta;
  errors?: Record<string, string[]>;
}

export function successResponse<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200
): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  return res.status(statusCode).json(response);
}

export function createdResponse<T>(res: Response, data: T, message = 'Created'): Response {
  return successResponse(res, data, message, 201);
}

export function paginatedResponse<T>(
  res: Response,
  data: T[],
  pagination: PaginationMeta,
  message = 'Success'
): Response {
  const response: ApiResponse<T[]> = {
    success: true,
    data,
    message,
    pagination,
  };
  return res.status(200).json(response);
}

export function errorResponse(
  res: Response,
  message: string,
  statusCode = 500,
  errors?: Record<string, string[]>
): Response {
  const response: ApiResponse = {
    success: false,
    message,
    errors,
  };
  return res.status(statusCode).json(response);
}

export function noContentResponse(res: Response): Response {
  return res.status(204).send();
}

/**
 * Builds pagination meta from query params and total count
 */
export function buildPagination(
  page: number,
  pageSize: number,
  total: number
): PaginationMeta {
  const totalPages = Math.ceil(total / pageSize);
  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

/**
 * Parse pagination query params with safe defaults
 */
export function parsePagination(query: Record<string, unknown>): {
  page: number;
  pageSize: number;
  skip: number;
} {
  const page = Math.max(1, parseInt(String(query['page'] ?? '1'), 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(String(query['pageSize'] ?? '20'), 10)));
  const skip = (page - 1) * pageSize;
  return { page, pageSize, skip };
}
