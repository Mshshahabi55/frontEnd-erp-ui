export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  description?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateProductDto {
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  description?: string;
  isAvailable: boolean;
}

export interface UpdateProductDto {
  name?: string;
  sku?: string;
  category?: string;
  price?: number;
  stock?: number;
  unit?: string;
  description?: string;
  isAvailable?: boolean;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}