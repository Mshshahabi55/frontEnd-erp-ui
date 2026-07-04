import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Box,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Switch,
  FormControlLabel,
  Typography,
} from "@mui/material";

import {
  createCustomerSchema,
  CreateCustomerFormData,
} from "../../types/customer.schema";

interface CustomerFormProps {
  defaultValues?: Partial<CreateCustomerFormData>;
  onSubmit: (data: CreateCustomerFormData) => Promise<void>;
  isLoading?: boolean;
  submitText?: string;
  onCancel?: () => void;
}

export const CustomerForm = ({
  defaultValues,
  onSubmit,
  isLoading = false,
  submitText = "Save Customer",
  onCancel,
}: CustomerFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCustomerFormData>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      address: "",
      isActive: true,
      ...defaultValues,
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 2 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Customer Information
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            {...register("name")}
            label="Full Name"
            placeholder="John Doe"
            fullWidth
            required
            disabled={isLoading}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            {...register("email")}
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            fullWidth
            required
            disabled={isLoading}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            {...register("phone")}
            label="Phone Number"
            placeholder="+1234567890"
            fullWidth
            required
            disabled={isLoading}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            {...register("company")}
            label="Company Name"
            placeholder="Acme Inc"
            fullWidth
            disabled={isLoading}
            error={!!errors.company}
            helperText={errors.company?.message}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            {...register("address")}
            label="Address"
            placeholder="123 Main Street"
            fullWidth
            multiline
            rows={3}
            disabled={isLoading}
            error={!!errors.address}
            helperText={errors.address?.message}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    disabled={isLoading}
                  />
                }
                label={field.value ? "Active Customer" : "Inactive Customer"}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 2,
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
                isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : undefined
              }
            >
              {isLoading ? "Saving..." : submitText}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};