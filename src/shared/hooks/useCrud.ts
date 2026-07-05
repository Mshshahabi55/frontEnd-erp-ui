import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// تایپ برای پاسخ صفحه‌بندی شده
export interface PagedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// تایپ CrudService — نوع id از خودِ مدل (T['id']) گرفته می‌شود
// تا با هر سرویسی (چه id عددی، چه رشته‌ای) سازگار باشد
export interface CrudService<
  T extends { id: string | number },
  CreateDto = any,
  UpdateDto = any
> {
  getAll: (params?: any) => Promise<PagedResponse<T>>;
  getById: (id: T['id']) => Promise<T>;
  create: (data: CreateDto) => Promise<T>;
  update: (id: T['id'], data: UpdateDto) => Promise<T>;
  delete: (id: T['id']) => Promise<void>;
}

export function useCrud<T extends { id: string | number }, CreateDto = any, UpdateDto = any>(
  service: CrudService<T, CreateDto, UpdateDto>,
  queryKey: string[]
) {
  const queryClient = useQueryClient();

  const useGetAll = (params?: any) => {
    return useQuery({
      queryKey: [...queryKey, 'list', params],
      queryFn: () => service.getAll(params),
    });
  };

  const useGetById = (id: T['id']) => {
    return useQuery({
      queryKey: [...queryKey, 'detail', id],
      queryFn: () => service.getById(id),
      enabled: !!id,
    });
  };

  const useCreate = () => {
    return useMutation({
      mutationFn: (data: CreateDto) => service.create(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [...queryKey, 'list'] });
        toast.success('Item created successfully!');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to create item');
      },
    });
  };

  const useUpdate = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: T['id']; data: UpdateDto }) =>
        service.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [...queryKey, 'list'] });
        toast.success('Item updated successfully!');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update item');
      },
    });
  };

  const useDelete = () => {
    return useMutation({
      mutationFn: (id: T['id']) => service.delete(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [...queryKey, 'list'] });
        toast.success('Item deleted successfully!');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to delete item');
      },
    });
  };

  return { useGetAll, useGetById, useCreate, useUpdate, useDelete };
}