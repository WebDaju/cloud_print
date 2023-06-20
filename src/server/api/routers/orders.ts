/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import cloudinaryConfig from "../../../libs/cloudinaryConfig";
import {
  orderDeleteSchema,
  orderSchema,
  updateOrderSchema,
} from "@/validation/orders";
import { Status } from "@prisma/client";
import sendMail from "@/libs/sendMailt";
import { z } from "zod";
cloudinaryConfig();
export const orderRouters = createTRPCRouter({
  createOrders: protectedProcedure
    .input(orderSchema)
    .mutation(async ({ input, ctx }) => {
      const { name, phone, email, address, products, subtotal } = input;
      const userId = ctx.session.user?.id ?? 0;
      const orders = await ctx.prisma.order.create({
        data: {
          name,
          phone,
          email,
          address,
          subtotal,
          userId: userId,
          products: {
            connect: products,
          },
        },
      });
      const getYourOrder = `http://localhost:3000/user/order/${userId}`;

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
    .input(updateOrderSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, status } = input;

      const orders = await ctx.prisma.order.update({
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
  getAllOrders: publicProcedure.query(async ({ ctx }) => {
    const orders = await ctx.prisma.order.findMany({
      include: {
        products: true,
      },
    });
    return {
      status: 200,
      message: "Products retrieved",
      orders,
    };
  }),
  deleteOrder: protectedProcedure
    .input(orderDeleteSchema)
    .mutation(async ({ ctx, input }) => {
      const products = await ctx.prisma.order.delete({
        where: {
          id: input.id,
        },
        include: {
          products: true,
        },
      });

      if (!products) return null;

      return {
        products,
      };
    }),
  getOrderById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const orders = await ctx.prisma.order.findUnique({
        where: {
          id: input.id,
        },
        include: {
          products: true,
        },
      });

      if (!orders) return null;

      return {
        orders,
      };
    }),
  singleUserOrderDetails: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const orders = await ctx.prisma.order.findFirst({
        where: {
          userId: input.id,
        },
        include: {
          products: true,
        },
      });

      if (!orders) return null;

      return {
        orders,
      };
    }),
});
