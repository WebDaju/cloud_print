/* eslint-disable @typescript-eslint/no-unused-vars */
import z from "zod";



export const customOrderSchema = z.object({
  name: z.string().min(1),
  phone: z.bigint(),
  email: z.string(),
  address: z.string(),
  total: z.number(),
  typeofPrint:z.string(),
  binding:z.string(),
  totalPages:z.number(),
  bindingPrice:z.number(),
  pricePerPage:z.number(),
  pdf: z.string(),
});
export const customOrderDeleteSchema = z.object({
  id: z.string().optional(),
});
export const updateCustomOrderSchema = z.object({
  id: z.string(),
  status: z.string(),
});
