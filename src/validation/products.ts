import z from "zod";

export const productSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  image: z.string(),
  pricePerPage: z.number(),
  noofPage: z.number(),
  total: z.number(),
  pdf: z.string(),
});

export const getProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  description: z.string().min(1),
  image: z.string(),
  pricePerPage: z.number().min(1),
  noofPage: z.number().min(1),
  total: z.number().min(1),
  pdf: z.string().min(1),
  createdAt: z.string(),
});

export const productDeleteSchema = z.object({
  id: z.string().optional(),
});
export const updateProductSchem = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().min(1),
  image: z.string(),
  pricePerPage: z.number().min(1),
  noofPage: z.number().min(1),
  total: z.number().min(1),
  pdf: z.string().min(1),
});

export type Iproducts = z.infer<typeof productSchema>;
