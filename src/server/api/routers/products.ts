/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  getProductSchema,
  productDeleteSchema,
  productSchema,
  updateProductSchem,
} from "@/validation/products";
import { z } from "zod";
import cloudinaryConfig from "@/libs/cloudinaryConfig";
import cloudinary from "cloudinary";

cloudinaryConfig();
export const productsRouter = createTRPCRouter({
  createProduct: protectedProcedure
    .input(productSchema)
    .mutation(async ({ input, ctx }) => {
      const { name, description, image, pricePerPage, noofPage, total, pdf } =
        input;

      const imageUrl = await cloudinary.v2.uploader.upload(image, {
        folder: "cloudprint",
        timeout: 120000,
      });
      const pdfUrl = await cloudinary.v2.uploader.upload(pdf, {
        folder: "cloudprint",
        timeout: 120000,
        resource_type: "raw",
      });
      const products = await ctx.prisma.product.create({
        data: {
          name,
          description,
          image: imageUrl.secure_url,
          pricePerPage,
          noofPage,
          total,
          pdf: pdfUrl.secure_url,
        },
      });

      return {
        status: 201,
        message: "Products created successfully",
        products,
      };
    }),
  updateProduct: protectedProcedure
    .input(updateProductSchem)
    .mutation(async ({ input, ctx }) => {
      const {
        name,
        description,
        image,
        pricePerPage,
        noofPage,
        total,
        pdf,
        id,
      } = input;

      const imageUrl = await cloudinary.v2.uploader.upload(image, {
        folder: "cloudprint",
        timeout: 120000,
      });

      const pdfUrl = await cloudinary.v2.uploader.upload(pdf, {
        folder: "cloudprint",
        timeout: 120000,
        resource_type: "raw",
      });
      const products = await ctx.prisma.product.update({
        where: {
          id: id,
        },
        data: {
          name,
          description,
          pricePerPage,
          image: imageUrl.secure_url,
          noofPage,
          total,
          pdf: pdfUrl?.secure_url,
        },

        include: {
          orders: true,
        },
      });

      return {
        status: 201,
        message: "Products created successfully",
        products,
      };
    }),

  getAllProduct: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.prisma.product.findMany();
    return {
      status: 200,
      message: "Products retrieved",
      products,
    };
  }),

  getProductById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const products = await ctx.prisma.product.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!products) return null;

      return {
        products,
      };
    }),
  deleteProduct: protectedProcedure
    .input(productDeleteSchema)
    .mutation(async ({ ctx, input }) => {
      const products = await ctx.prisma.product.delete({
        where: {
          id: input.id,
        },
      });

      if (!products) return null;

      return {
        products,
      };
    }),
});
