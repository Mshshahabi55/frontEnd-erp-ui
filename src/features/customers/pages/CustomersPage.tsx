import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  Skeleton,
} from '@mui/material';
import { Search, Add, Edit, Delete, Refresh } from '@mui/icons-material';
import {
  useCustomers,
  useDeleteCustomer,
  useCreateCustomer,
  useUpdateCustomer,
} from '../hooks/useCustomers';
import { CustomerForm } from '../components/CustomerForm/CustomerForm';
import { Customer } from '../types/customer.types';
import { CreateCustomerFormData } from '../types/customer.schema';

export const CustomersPage = () => {
  // ===== State =====
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // ===== Queries & Mutations =====
  const { data, isLoading, error, refetch } = useCustomers({
    page: page + 1,
    limit: rowsPerPage,
    search: search || undefined,
  });

  /////////////////////
//   console.log("========== CUSTOMERS PAGE ==========");
// console.log("React Query data:", data);
// console.log("React Query data.data:", data?.data);
// console.log("Loading:", isLoading);
// console.log("Error:", error);
// console.log("====================================");
  ////////////////////

  const deleteMutation = useDeleteCustomer();
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();

  // ===== Handlers =====
  const handleSearch = () => {
    setSearch(searchInput);
    setPage(0);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearch('');
    setPage(0);
  };

  const handleCreate = () => {
    setSelectedCustomer(null);
    setDialogOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedCustomer(null);
  };

  const handleFormSubmit = async (data: CreateCustomerFormData) => {
    if (selectedCustomer) {
      // Update existing customer
      await updateMutation.mutateAsync({
        id: selectedCustomer.id,
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company || undefined,
          address: data.address || undefined,
          isActive: data.isActive,
        },
      });
    } else {
      // Create new customer
      await createMutation.mutateAsync({
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company || undefined,
        address: data.address || undefined,
        isActive: data.isActive,
      });
    }
    handleDialogClose();
  };

  // ===== Render Table =====
  const renderTable = () => {
    if (error) {
      return (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              <Refresh /> Retry
            </Button>
          }
        >
          Failed to load customers: {error.message}
        </Alert>
      );
    }

    // ✅ Safety: Ensure data and data.data exist
   const customers = data?.data ?? [];
   const totalCount = data?.total ?? 0;

//   /////////////////////////
//   console.log("customers =", customers);
// console.log("customers.length =", customers.length);
// console.log("totalCount =", totalCount);
//   /////////////////////////
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              // Skeleton Loading
              Array.from({ length: rowsPerPage }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton variant="text" width={120} /></TableCell>
                  <TableCell><Skeleton variant="text" width={180} /></TableCell>
                  <TableCell><Skeleton variant="text" width={120} /></TableCell>
                  <TableCell><Skeleton variant="text" width={100} /></TableCell>
                  <TableCell><Skeleton variant="text" width={80} /></TableCell>
                  <TableCell><Skeleton variant="text" width={100} /></TableCell>
                </TableRow>
              ))
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No customers found. Create your first customer!
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.company || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={customer.isActive ? 'Active' : 'Inactive'}
                      color={customer.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEdit(customer)}
                      title="Edit"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(customer.id)}
                      disabled={deleteMutation.isPending}
                      title="Delete"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="Rows per page:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </TableContainer>
    );
  };

  // ===== Main Render =====
  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Customers
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
        >
          Add Customer
        </Button>
      </Box>

      {/* Search Bar */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search by name, email, or company..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: searchInput && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleClearSearch}>
                    <Refresh />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          fullWidth
        />
        <Button variant="outlined" onClick={handleSearch}>
          Search
        </Button>
      </Box>

      {/* Table */}
      {renderTable()}

      {/* Form Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedCustomer ? 'Edit Customer' : 'Add New Customer'}
        </DialogTitle>
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
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CustomersPage;