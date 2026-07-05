import { useState } from 'react';
import { Box, Typography, Button, Chip, IconButton, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { DataTable, Column } from '@/shared/components/DataTable/DataTable';
import { SearchBar } from '@/shared/components/SearchBar/SearchBar';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog/ConfirmDialog';
import { useCrud } from '@/shared/hooks/useCrud';
import { CustomerForm } from '../components/CustomerForm/CustomerForm';
import { customerService } from '../services/customerService';
import type { Customer } from '../types/customer.types';
import { CreateCustomerFormData } from '../types/customer.schema';
import { CreateCustomerDto, UpdateCustomerDto } from '../types/customer.types';
import { useDebounce } from '@/shared/hooks/useDebounce';

export const CustomersPage = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 500);

  const { useGetAll, useCreate, useUpdate, useDelete } = useCrud<
    Customer,
    CreateCustomerDto,
    UpdateCustomerDto
  >(customerService, ['customers']);

  const { data: response, isLoading, error, refetch } = useGetAll({
    page: page + 1,
    limit: pageSize,
    search: debouncedSearch || undefined,
  });

  const customers = response?.data ?? [];
  const totalCount = response?.total ?? 0;

  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const deleteMutation = useDelete();

  const handleCreate = () => {
    setSelectedCustomer(null);
    setIsFormOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    const customer = customers.find((c) => c.id === id);
    if (customer) {
      setSelectedCustomer(customer);
      setIsDeleteOpen(true);
    }
  };

  const handleFormSubmit = async (data: CreateCustomerFormData) => {
    if (selectedCustomer) {
      await updateMutation.mutateAsync({
        id: selectedCustomer.id,
        data: {
          ...data,
        },
      });
    } else {
      await createMutation.mutateAsync({
        ...data,
      });
    }
    setIsFormOpen(false);
    setSelectedCustomer(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedCustomer) {
      await deleteMutation.mutateAsync(selectedCustomer.id);
      setIsDeleteOpen(false);
      setSelectedCustomer(null);
    }
  };

  const columns: Column<Customer>[] = [
    {
      key: 'name',
      label: 'Name',
      render: (value: string) => <Typography sx={{ fontWeight: 500 }}>{value}</Typography>,
    },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    {
      key: 'company',
      label: 'Company',
      render: (value: string) => value || '-',
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (value: boolean) => (
        <Chip
          label={value ? 'Active' : 'Inactive'}
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
          Customers
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          Add Customer
        </Button>
      </Box>

      <SearchBar
        value={searchInput}
        onChange={setSearchInput}
        onClear={() => setSearchInput('')}
        placeholder="Search by name, email, or company..."
      />

      <DataTable
        columns={columns}
        data={customers}
        loading={isLoading}
        error={error}
        totalCount={totalCount}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onRetry={refetch}
        emptyMessage="No customers found. Create your first customer!"
      />

      <Dialog open={isFormOpen} onClose={() => setIsFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedCustomer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
        <DialogContent>
          <CustomerForm
            defaultValues={
              selectedCustomer
                ? {
                    name: selectedCustomer.name,
                    email: selectedCustomer.email,
                    phone: selectedCustomer.phone,
                    company: selectedCustomer.company || '',
                    address: selectedCustomer.address || '',
                    isActive: selectedCustomer.isActive,
                  }
                : undefined
            }
            onSubmit={handleFormSubmit}
            isLoading={createMutation.isPending || updateMutation.isPending}
            submitText={selectedCustomer ? 'Update Customer' : 'Save Customer'}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isDeleteOpen}
        title="Delete Customer"
        message={`Are you sure you want to delete "${selectedCustomer?.name}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
        loading={deleteMutation.isPending}
      />
    </Box>
  );
};

export default CustomersPage;