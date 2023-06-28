/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import cloudinaryConfig from "../../../libs/cloudinaryConfig";

import sendMail from "@/libs/sendMailt";

import {
  customOrderDeleteSchema,
  customOrderSchema,
  updateCustomOrderSchema,
} from "@/validation/customOrder";
import cloudinary from "cloudinary";
import { z } from "zod";
import { Status } from "@prisma/client";
cloudinaryConfig();
export const customOrderRouters = createTRPCRouter({
  createCustomOrders: protectedProcedure
    .input(customOrderSchema)
    .mutation(async ({ input, ctx }) => {
      const {
        name,
        phone,
        email,
        address,
        total,
        typeofPrint,
        binding,
        totalPages,
        bindingPrice,
        pricePerPage,
        pdf,
      } = input;
      const userId = ctx.session.user?.id ?? 0;
      const pdfUrl = await cloudinary.v2.uploader.upload(pdf, {
        folder: "cloudprint",
        timeout: 120000,
        resource_type: "raw",
      });
      const orders = await ctx.prisma.customOrder.create({
        data: {
          name,
          phone,
          email,
          address,
          total,
          typeofPrint,
          binding,
          totalPages,
          bindingPrice,
          userId: userId,
          pricePerPage,
          pdf: pdfUrl.secure_url,
        },
      });
      const getYourOrder = `http://localhost:3000/user/custom/order/${userId}`;

      await sendMail({
        email: email,
        subject: "Order",
        message: `Hello ${name}, Thanks For Ordering} \n\n You can View The Order Details Here ${getYourOrder} `,
      });

      return {
        status: 201,
        message: "Products created successfully",
        orders,
      };
    }),
  updateOrderStatus: protectedProcedure
    .input(updateCustomOrderSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, status } = input;

      const orders = await ctx.prisma.customOrder.update({
        where: {
          id: id,
        },
        data: {
          status: status as Status,
        },
      });

      return {
        status: 201,
        message: "Products created successfully",
        orders,
      };
    }),
  getAllCustomOrders: publicProcedure.query(async ({ ctx }) => {
    const orders = await ctx.prisma.customOrder.findMany({});
    return {
      status: 200,
      message: "Products retrieved",
      orders,
    };
  }),
  deleteCustomOrder: protectedProcedure
    .input(customOrderDeleteSchema)
    .mutation(async ({ ctx, input }) => {
      const orders = await ctx.prisma.customOrder.delete({
        where: {
          id: input.id,
        },
      });

      if (!orders) return null;

      return {
        orders,
      };
    }),
  getCustomOrderById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const orders = await ctx.prisma.customOrder.findUnique({
        where: {
          id: input.id,
        },
       
      });

      if (!orders) return null;

      return {
        orders,
      };
    }),
  singleUserCustomOrderDetails: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const orders = await ctx.prisma.customOrder.findFirst({
        where: {
          userId: input.id,
        },
       
      });

      if (!orders) return null;

      return {
        orders,
      };
    }),
});
