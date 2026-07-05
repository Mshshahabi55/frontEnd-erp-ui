import { CrudForm } from '@/shared/components/CrudForm/CrudForm';
import { createProductSchema, CreateProductFormData } from '../types/product.schema';

interface ProductFormProps {
  defaultValues?: Partial<CreateProductFormData>;
  onSubmit: (data: CreateProductFormData) => Promise<void>;
  isLoading?: boolean;
  submitText?: string;
  onCancel?: () => void;
}

export const ProductForm = ({
  defaultValues,
  onSubmit,
  isLoading,
  submitText = 'Save Product',
  onCancel,
}: ProductFormProps) => {
  return (
    <CrudForm<CreateProductFormData>
      schema={createProductSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      isLoading={isLoading}
      onCancel={onCancel}
      submitText={submitText}
      title="Product Information"
      fields={[
        {
          name: 'name',
          label: 'Product Name',
          type: 'text',
          gridSize: 6,
          required: true,
        },
        {
          name: 'sku',
          label: 'SKU',
          type: 'text',
          gridSize: 6,
          required: true,
        },
        {
          name: 'category',
          label: 'Category',
          type: 'text',
          gridSize: 6,
          required: true,
        },
        {
          name: 'unit',
          label: 'Unit',
          type: 'text',
          gridSize: 6,
          required: true,
        },
        {
          name: 'price',
          label: 'Price ($)',
          type: 'number',
          gridSize: 6,
          required: true,
        },
        {
          name: 'stock',
          label: 'Stock Quantity',
          type: 'number',
          gridSize: 6,
          required: true,
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          gridSize: 12,
        },
        {
          name: 'isAvailable',
          label: 'Available for Sale',
          type: 'switch',
          gridSize: 12,
        },
      ]}
    />
  );
};

export default ProductForm;