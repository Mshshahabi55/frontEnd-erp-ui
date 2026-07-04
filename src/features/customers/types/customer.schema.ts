import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),

  email: z
    .string()
    .email("Invalid email address"),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone format"),

  company: z
    .string()
    .max(100, "Company name must not exceed 100 characters"),

  address: z
    .string()
    .max(200, "Address must not exceed 200 characters"),

  isActive: z.boolean(),
});

export type CreateCustomerFormData = z.infer<typeof createCustomerSchema>;

export type UpdateCustomerFormData = Partial<CreateCustomerFormData>;