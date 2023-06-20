/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import HomePage from "@/components/Home/HomePage";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { api } from "@/utils/api";
import superjson from "superjson";
import { prisma } from "../server/db";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetStaticProps,
  InferGetServerSidePropsType,
  NextApiHandler,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { getServerAuthSession } from "@/server/auth";
import Meta from "@/components/Meta";
const Home = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const {products}=props
  console.log(JSON.parse(products));

  return (
    <div>
      <Meta title="HomePage" description="HomePage Cloud Print"/>
      <HomePage />
    </div>
  );
};

export default Home;
// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const session = await getServerAuthSession(ctx);

//   return {
//     props: {
//     data:JSON.stringify(data) },
//   };
// };

// export async function getServerSideProps(
//   context: GetServerSidePropsContext<{ id: string }>
// ) {
//   const helpers = createServerSideHelpers({
//     router: appRouter,
//     ctx: {
//       session: null,
//       prisma: prisma,
//     },
//     transformer: superjson,
//   });
//   /*
//    * Prefetching the `post.byId` query.
//    * `prefetch` does not return the result and never throws - if you need that behavior, use `fetch` instead.
//    */
//   await helpers.product.getAllProduct.prefetch();

//   // Make sure to return { props: { trpcState: helpers.dehydrate() } }
//   return {
//     props: {
//       trpcState: helpers.dehydrate(),
//       data: JSON.stringify(JSON),
//     },
//   };
// }
export async function getServerSideProps(context:any) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      session: null,
      prisma: prisma,
    },
    transformer: superjson,
  });

  // Fetch the product data using TRPC
  const data = await helpers.product.getAllProduct.fetch();

  return {
    props: {
      trpcState: helpers.dehydrate(),
      products: JSON.stringify(data?.products)
    },
  };
}
