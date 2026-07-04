import apiClient from "@/shared/api/apiClient";
import {
  Customer,
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerQueryParams,
} from "../types/customer.types";

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

   const queryParams: Record<string, unknown> = {
  _page: page,
  _per_page: limit,
};

if (params?.search && params.search.trim() !== "") {
  queryParams.q = params.search.trim();
}

const response = await apiClient.get<JsonServerPagedResponse<any>>(
  "/customers",
  {
    params: queryParams,
  }
);
//     console.log("JSON SERVER RESPONSE", response.data);
//     console.log("response.data.data =", response.data.data);
// console.log("Array?", Array.isArray(response.data.data));
// console.log("length =", response.data.data?.length);
// console.log("items =", response.data.items);

    const customers: Customer[] = response.data.data.map((c: any) => ({
      ...c,
      id: Number(c.id),
    }));
//     console.log("customers after map =", customers);
//     console.log("Base URL =", apiClient.defaults.baseURL);

// console.log(
//   apiClient.getUri({
//     url: "/customers",
//     params: {
//       _page: page,
//       _per_page: limit,
//       q: params?.search || "",
//     },
//   })
// );
    return {
      data: customers,
      total: response.data.items,
      page,
      limit,
      totalPages: response.data.pages,
    };
  },

  async getById(id: number): Promise<Customer> {
    const response = await apiClient.get<Customer>(`/customers/${id}`);

    return {
      ...response.data,
      id: Number(response.data.id),
    };
  },

  async create(data: CreateCustomerDto): Promise<Customer> {
    const response = await apiClient.post<Customer>("/customers", {
      ...data,
      createdAt: new Date().toISOString(),
    });

    return {
      ...response.data,
      id: Number(response.data.id),
    };
  },

  async update(
    id: number,
    data: UpdateCustomerDto
  ): Promise<Customer> {

    const response = await apiClient.put<Customer>(`/customers/${id}`, {
      ...data,
      updatedAt: new Date().toISOString(),
    });

    return {
      ...response.data,
      id: Number(response.data.id),
    };
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/customers/${id}`);
  },

  async toggleStatus(id: number): Promise<Customer> {
    const customer = await customerService.getById(id);

    return customerService.update(id, {
      isActive: !customer.isActive,
    });
  },
};