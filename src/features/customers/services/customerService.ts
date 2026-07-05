import apiClient from "@/shared/api/apiClient";
import {
  Customer,
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerQueryParams,
} from "../types/customer.types";

export type { Customer, CreateCustomerDto, UpdateCustomerDto, CustomerQueryParams };

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

export const customerService = {
  async getAll(
    params?: CustomerQueryParams
  ): Promise<PagedResponse<Customer>> {

    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;

    // ساخت پارامترها
    const queryParams: Record<string, unknown> = {
      _page: page,
      _per_page: limit,
    };

    // جستجو روی چند فیلد (name, email, company) هم‌زمان
    // json-server v1 دیگه از q= یا name_like پشتیبانی نمی‌کنه.
    // syntax درست: field:contains=value (case-insensitive)
    // برای OR روی چند فیلد باید از _where استفاده کرد.
    if (params?.search && params.search.trim() !== "") {
      const searchTerm = params.search.trim();

      queryParams['_where'] = JSON.stringify({
        or: [
          { name: { contains: searchTerm } },
          { email: { contains: searchTerm } },
          { company: { contains: searchTerm } },
        ],
      });
    }

    const response = await apiClient.get<JsonServerPagedResponse<any>>(
      "/customers",
      {
        params: queryParams,
      }
    );

    const customers: Customer[] = response.data.data.map((c: any) => ({
      ...c,
      id: String(c.id),
    }));

    return {
      data: customers,
      total: response.data.items,
      page,
      limit,
      totalPages: response.data.pages,
    };
  },

  async getById(id: string): Promise<Customer> {
    const response = await apiClient.get<Customer>(`/customers/${id}`);

    return {
      ...response.data,
      id: String(response.data.id),
    };
  },

  async create(data: CreateCustomerDto): Promise<Customer> {
    const response = await apiClient.post<Customer>("/customers", {
      ...data,
      createdAt: new Date().toISOString(),
    });

    return {
      ...response.data,
      id: String(response.data.id),
    };
  },

  async update(
    id: string,
    data: UpdateCustomerDto
  ): Promise<Customer> {
    const response = await apiClient.put<Customer>(`/customers/${id}`, {
      ...data,
      updatedAt: new Date().toISOString(),
    });

    return {
      ...response.data,
      id: String(response.data.id),
    };
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/customers/${id}`);
  },

  async toggleStatus(id: string): Promise<Customer> {
    const customer = await customerService.getById(id);
    return customerService.update(id, {
      isActive: !customer.isActive,
    });
  },
};