
import { createTRPCRouter } from "@/server/api/trpc";
import { productsRouter } from "./routers/products";
import { userRouter } from "./routers/user";
import { registerRouter } from "./routers/register";
import { orderRouters } from "./routers/orders";
import { customOrderRouters } from "./routers/customOrder";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  product:productsRouter,
   user: userRouter,
   auth:registerRouter,
   order:orderRouters,
   customOrder:customOrderRouters

});

// export type definition of API
export type AppRouter = typeof appRouter;
