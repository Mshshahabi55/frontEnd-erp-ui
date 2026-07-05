import apiClient from "@/shared/api/apiClient";
import { Product, CreateProductDto, UpdateProductDto, ProductQueryParams } from "../types/product.types";

export type { Product, CreateProductDto, UpdateProductDto, ProductQueryParams };

export interface JsonServerPagedResponse<T> {
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
  data: T[];
}

export interface PagedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const productService = {
  async getAll(params?: ProductQueryParams): Promise<PagedResponse<Product>> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;

    const queryParams: Record<string, unknown> = {
      _page: page,
      _per_page: limit,
    };

    if (params?.search && params.search.trim() !== "") {
      const searchTerm = params.search.trim();
      queryParams['_where'] = JSON.stringify({
        or: [
          { name: { contains: searchTerm } },
          { sku: { contains: searchTerm } },
        ],
      });
    }

    if (params?.category) {
      queryParams['category'] = params.category;
    }

    const response = await apiClient.get<JsonServerPagedResponse<any>>(
      "/products",
      { params: queryParams }
    );

    const products: Product[] = response.data.data.map((p: any) => ({
      ...p,
      id: String(p.id),
      price: Number(p.price),
      stock: Number(p.stock),
    }));

    return {
      data: products,
      total: response.data.items,
      page,
      limit,
      totalPages: response.data.pages,
    };
  },

  async getById(id: string): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return {
      ...response.data,
      id: String(response.data.id),
    };
  },

  async create(data: CreateProductDto): Promise<Product> {
    const response = await apiClient.post<Product>("/products", {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return {
      ...response.data,
      id: String(response.data.id),
    };
  },

  async update(id: string, data: UpdateProductDto): Promise<Product> {
    const response = await apiClient.put<Product>(`/products/${id}`, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return {
      ...response.data,
      id: String(response.data.id),
    };
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  },
};