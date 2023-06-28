/* eslint-disable @typescript-eslint/no-unused-vars */
import z from "zod";

const productConnectSchema = z.object({
  id: z.string(),
});

export const orderSchema = z.object({
  name: z.string().min(1),
  phone: z.bigint(),
  email: z.string(),
  address: z.string(),
  products: z.array(productConnectSchema),
  subtotal: z.number(),
});
export const updateOrderSchema = z.object({
  id: z.string(),
  status: z.string(),
});

export const orderDeleteSchema = z.object({
  id: z.string().optional(),
});
export type Iorders = z.infer<typeof orderSchema>;
