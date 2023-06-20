/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */import React, { useEffect, useState } from "react";
import superjson from "superjson";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "@/server/api/root";
import { prisma } from "@/server/db";
import { InferGetServerSidePropsType } from "next";
import ProductCard from "@/components/Products/ProductCard";
import { Grid } from "@mui/material";
import Link from "next/link";
import Meta from "@/components/Meta";

const Products = ({ products }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [ourProducts, setOurProducts] = useState<any[]>([]);

  console.log(ourProducts);

  useEffect(() => {
    if (products) {
      setOurProducts(superjson.parse(products));
    }
  }, [products]);

  console.log(products);

  return (
    <div>
      <Meta
        title={ourProducts
          ?.map((item: { name: any }) => item?.name)
          .join(" | ")}
        description="HomePage Cloud Print"
      />
      <div>
        <h1 className="p-5 text-center text-xl">Featured Product</h1>
        <div>
          <Grid container spacing={2}>
            {ourProducts?.map(
              (
                item: {
                  id: any;
                  name: string;
                  description: string;
                  total: number;
                  image: string;
                },
                i: React.Key | null | undefined
              ) => (
                <Grid item xs={4} md={3} className="m-auto" key={i}>
                  <Link href={`/products/${item?.id}`}>
                    <ProductCard
                      name={item?.name}
                      description={item?.description}
                      price={item?.total}
                      id={item?.id}
                      image={item?.image}
                    />
                  </Link>
                </Grid>
              )
            )}
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default Products;

export async function getServerSideProps(context: any) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      session: null,
      prisma: prisma,
    },
    transformer: superjson,
  });

  const data = await helpers.product.getAllProduct.fetch();

  return {
    props: {
      trpcState: helpers.dehydrate(),
      products: superjson.stringify(data?.products),
    },
  };
}
