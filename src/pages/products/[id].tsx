/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Grid } from "@mui/material";
import { createServerSideHelpers } from "@trpc/react-query/server";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { appRouter } from "@/server/api/root";
import { prisma } from "@/server/db";
import superjson from "superjson";
import { InferGetServerSidePropsType } from "next";
import { Button } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { addItem } from "@/store/cartSlice";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { api } from "@/utils/api";
import Meta from "@/components/Meta";

type ProductProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Product = (props: ProductProps) => {
  const { id } = props;

  const { data } = api.product.getProductById.useQuery({
    id: parseInt(id),
  });
  const [ourProducts, setOurProducts] = useState({
    id: "",
    name: "",
    image: "",
    description: "",
    pricePerPage: 0,
    noofPage: 0,
    total: 0,
    pdf: "",
  });
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items) ?? [];

  const handleAddToCart = () => {
    const isItemExists =
      cartItems && cartItems.find((i) => i.id === data?.products?.id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data?.products?.total !== undefined) {
        const allTotal = noofCopies * data?.products?.total;

        dispatch(
          addItem({
            quantity: noofCopies,
            product: data?.products,
            id: parseInt(id),
            total: allTotal,
          })
        );
        toast.success("Item Added to Cart");
      }
    }
  };

  const [noofCopies, setNoofCopies] = useState(1);
  const handleIncrement = () => {
    setNoofCopies((prevCount) => prevCount + 1);
  };

  const handleDecrement = () => {
    if (noofCopies > 1) {
      setNoofCopies((prevCount) => prevCount - 1);
    }
  };
  return (
    <div className="m-auto mt-32 w-3/5 ">
       <Meta title="ProductPage" description="Product Page Cloud Print"/>
      <Grid container spacing={5}>
        <Grid item lg={6}>
          <div>
            <Image
              src={data?.products.image as string}
              height={0}
              width={0}
              style={{
                height: "100%",
                width: "100%",
              }}
              sizes="100vw"
              alt={ourProducts.name}
            />
          </div>
        </Grid>

        <Grid item lg={6}>
          <div className="flex h-full flex-col justify-evenly">
            <section className="flex flex-col gap-3">
              <h1 className="text-xl font-bold">{data?.products?.name}</h1>
              <h1 className="font-semibold">
                Total :Rs.{data?.products?.total}
              </h1>
              <h1 className="font-semibold">
                No of Page:{data?.products?.noofPage}
              </h1>
              <h1 className="text-gray-400">{data?.products.description}</h1>
            </section>

            <div className="flex items-center gap-10 ">
              <button
                className="w-14 cursor-pointer rounded-xl border-none bg-indigo-500 p-2 text-white hover:bg-indigo-600"
                onClick={handleDecrement}
              >
                <span className="text-lg font-bold">-</span>
              </button>
              <p className="text-lg font-bold">{noofCopies}</p>
              <button
                className="w-14 cursor-pointer rounded-xl bg-indigo-500 p-2 text-white hover:bg-indigo-600"
                onClick={handleIncrement}
              >
                <span className="text-lg font-bold">+</span>
              </button>
            </div>

            <div>
              <Button onClick={handleAddToCart}>Add to Cart</Button>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Product;

export async function getServerSideProps(context: any) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      session: null,
      prisma: prisma,
    },
    transformer: superjson,
  });
  const { id } = context.params;

  return {
    props: {
      trpcState: helpers.dehydrate(),
      id,
    },
  };
}
