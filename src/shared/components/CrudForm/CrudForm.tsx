import { FieldValues, Path, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

export type CrudFieldType =
  | 'text'
  | 'email'
  | 'number'
  | 'textarea'
  | 'switch';

export interface CrudField<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type: CrudFieldType;
  gridSize?: number;
  placeholder?: string;
  required?: boolean;
}

interface CrudFormProps<T extends FieldValues> {
  schema: ZodSchema<T>;
  defaultValues?: Partial<T>;
  fields: CrudField<T>[];
  onSubmit: (data: T) => Promise<void>;
  isLoading?: boolean;
  submitText?: string;
  title?: string;
  onCancel?: () => void;
}

export function CrudForm<T extends FieldValues>({
  schema,
  defaultValues,
  fields,
  onSubmit,
  isLoading = false,
  submitText = 'Save',
  title,
  onCancel,
}: CrudFormProps<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<T>({
    resolver: zodResolver(schema as any),
    defaultValues: defaultValues as any,
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit as any)} sx={{ p: 2 }}>
      <Grid container spacing={3}>
        {title && (
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6">{title}</Typography>
          </Grid>
        )}

        {fields.map((field) => {
          if (field.type === 'switch') {
            return (
              <Grid key={String(field.name)} size={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Switch
                      {...register(field.name)}
                      defaultChecked={defaultValues?.[field.name] as boolean}
                    />
                  }
                  label={field.label}
                />
              </Grid>
            );
          }

          // ✅ تبدیل مقدار به number برای فیلدهای number
          const registerOptions = field.type === 'number' 
            ? { valueAsNumber: true } 
            : {};

          return (
            <Grid
              key={String(field.name)}
              size={{
                xs: 12,
                md: field.gridSize ?? 6,
              }}
            >
              <TextField
                {...register(field.name, registerOptions)}
                fullWidth
                disabled={isLoading}
                label={field.label}
                placeholder={field.placeholder}
                required={field.required}
                type={
                  field.type === 'number'
                    ? 'number'
                    : field.type === 'email'
                    ? 'email'
                    : 'text'
                }
                multiline={field.type === 'textarea'}
                rows={field.type === 'textarea' ? 3 : undefined}
                error={!!errors[field.name]}
                helperText={errors[field.name]?.message as string | undefined}
              />
            </Grid>
          );
        })}

        <Grid size={{ xs: 12 }}>
          <Box
            sx={{
              mt: 2,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
            }}
          >
            {onCancel && (
              <Button onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
            )}

            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              startIcon={
                isLoading ? <CircularProgress size={20} color="inherit" /> : undefined
              }
            >
              {isLoading ? 'Saving...' : submitText}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}