export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCustomerDto {
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  isActive: boolean;
}

export interface UpdateCustomerDto {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  isActive?: boolean;
}

export interface CustomerQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}