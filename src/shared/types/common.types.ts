export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt?: string;
  isActive?: boolean;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface QueryParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  filter?: Record<string, unknown>;
}

export type ID = string | number;