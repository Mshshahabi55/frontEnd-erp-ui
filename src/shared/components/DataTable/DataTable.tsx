import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Skeleton,
  Alert,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string | number;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  error?: Error | null;
  totalCount?: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRetry?: () => void;
  emptyMessage?: string;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  loading = false,
  error = null,
  totalCount = 0,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onRetry,
  emptyMessage = 'No data found',
}: DataTableProps<T>) {
  // ✅ اگر خطا وجود دارد
  if (error) {
    return (
      <Alert
        severity="error"
        action={
          onRetry && (
            <Button color="inherit" size="small" onClick={onRetry}>
              <Refresh /> Retry
            </Button>
          )
        }
      >
        {error.message}
      </Alert>
    );
  }

  // ✅ ایمنی: اگر داده‌ها خالی یا undefined هستند
  const safeData = data || [];
  const safeTotal = totalCount || 0;

  // ✅ اگر در حال بارگذاری است
  if (loading) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={String(col.key)}>{col.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: pageSize }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((col) => (
                    <TableCell key={String(col.key)}>
                      <Skeleton variant="text" width="80%" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  // ✅ اگر داده‌ها خالی هستند
  if (safeData.length === 0) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden', p: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            {emptyMessage}
          </Typography>
        </Box>
      </Paper>
    );
  }

  // ✅ نمایش داده‌ها
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={String(col.key)}
                  align={col.align || 'left'}
                  style={{ width: col.width, fontWeight: 600 }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {safeData.map((row) => (
              <TableRow key={row.id} hover>
                {columns.map((col) => (
                  <TableCell key={String(col.key)} align={col.align || 'left'}>
                    {col.render
                      ? col.render(row[col.key as keyof T], row)
                      : String(row[col.key as keyof T] || '')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={safeTotal}
        page={page}
        rowsPerPage={pageSize}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
        labelRowsPerPage="Rows per page:"
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Paper>
  );
}