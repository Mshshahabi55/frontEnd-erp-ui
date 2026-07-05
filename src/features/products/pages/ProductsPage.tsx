import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { DataTable, Column } from '@/shared/components/DataTable/DataTable';
import { SearchBar } from '@/shared/components/SearchBar/SearchBar';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog/ConfirmDialog';
import { useCrud } from '@/shared/hooks/useCrud';
import { ProductForm } from '../components/ProductForm';
import { productService } from '../services/productService';
import type { Product } from '../types/product.types';
import { CreateProductFormData } from '../types/product.schema';
import { CreateProductDto, UpdateProductDto } from '../types/product.types';
import { useDebounce } from '@/shared/hooks/useDebounce';

export const ProductsPage = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 500);

  const { useGetAll, useCreate, useUpdate, useDelete } = useCrud<
    Product,
    CreateProductDto,
    UpdateProductDto
  >(productService, ['products']);

  const { data: response, isLoading, error, refetch } = useGetAll({
    page: page + 1,
    limit: pageSize,
    search: debouncedSearch || undefined,
  });

  const products = response?.data ?? [];
  const totalCount = response?.total ?? 0;

  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const deleteMutation = useDelete();

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setSelectedProduct(product);
      setIsDeleteOpen(true);
    }
  };

  const handleFormSubmit = async (data: CreateProductFormData) => {
  // ✅ تبدیل price و stock به number
  const formattedData = {
    ...data,
    price: Number(data.price),
    stock: Number(data.stock),
  };

  if (selectedProduct) {
    await updateMutation.mutateAsync({
      id: selectedProduct.id,
      data: formattedData,
    });
  } else {
    await createMutation.mutateAsync(formattedData);
  }
  setIsFormOpen(false);
  setSelectedProduct(null);
};

  const handleConfirmDelete = async () => {
    if (selectedProduct) {
      await deleteMutation.mutateAsync(selectedProduct.id);
      setIsDeleteOpen(false);
      setSelectedProduct(null);
    }
  };

  const columns: Column<Product>[] = [
    {
      key: 'name',
      label: 'Name',
      render: (value: string) => <Typography sx={{ fontWeight: 500 }}>{value}</Typography>,
    },
    { key: 'sku', label: 'SKU' },
    { key: 'category', label: 'Category' },
    {
      key: 'price',
      label: 'Price',
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (value: number) => (
        <Chip
          label={value > 0 ? `${value}` : 'Out of Stock'}
          color={value > 0 ? 'info' : 'error'}
          size="small"
        />
      ),
    },
    {
      key: 'isAvailable',
      label: 'Status',
      render: (value: boolean) => (
        <Chip
          label={value ? 'Available' : 'Unavailable'}
          color={value ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      key: 'id',
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <>
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleEdit(row)}
            title="Edit"
          >
            <Edit />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(row.id)}
            disabled={deleteMutation.isPending}
            title="Delete"
          >
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Products
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          Add Product
        </Button>
      </Box>

      <SearchBar
        value={searchInput}
        onChange={setSearchInput}
        onClear={() => setSearchInput('')}
        placeholder="Search by name or SKU..."
      />

      <DataTable
        columns={columns}
        data={products}
        loading={isLoading}
        error={error}
        totalCount={totalCount}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onRetry={refetch}
        emptyMessage="No products found. Create your first product!"
      />

      <Dialog open={isFormOpen} onClose={() => setIsFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        <DialogContent>
          <ProductForm
            defaultValues={
              selectedProduct
                ? {
                    name: selectedProduct.name,
                    sku: selectedProduct.sku,
                    category: selectedProduct.category,
                    price: selectedProduct.price,
                    stock: selectedProduct.stock,
                    unit: selectedProduct.unit,
                    description: selectedProduct.description || '',
                    isAvailable: selectedProduct.isAvailable,
                  }
                : undefined
            }
            onSubmit={handleFormSubmit}
            isLoading={createMutation.isPending || updateMutation.isPending}
            submitText={selectedProduct ? 'Update Product' : 'Save Product'}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isDeleteOpen}
        title="Delete Product"
        message={`Are you sure you want to delete "${selectedProduct?.name}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
        loading={deleteMutation.isPending}
      />
    </Box>
  );
};

export default ProductsPage;