/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import React from "react";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "@/server/api/root";
import { prisma } from "@/server/db";
import superjson from "superjson";
import { api } from "@/utils/api";

import { Card } from "@material-tailwind/react";

import Meta from "@/components/Meta";
import Image from "next/image";
import { Divider } from "@mui/material";

const Orders = ({ id }: any) => {
  const { data } = api.order.singleUserOrderDetails.useQuery({
    id: Number(id),
  });

  return (
    <>
      <Meta
        title="Single Product Dashboard"
        description="Dashboard Single Product  Cloud Print"
      />
      <div className="m-auto flex h-screen w-full items-center  ">
        <Card className="m-auto w-3/4 border-2 border-indigo-300 shadow-2xl">
          <div className="flex flex-col items-center p-5">
            <h1 className="text-4xl text-red-300">CLOUD PRINT</h1>
            <h6 className="text-xl text-indigo-300">HeadOffice : Bhaktapur</h6>
            <h1 className="text-md text-red-300">
              Contact: 9761625523 , 9818756121
            </h1>
            <h6></h6>
          </div>

          <div className="flex justify-between p-10">
            <div className=" flex w-full justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-lg  text-gray-500">
                  #orderId:{data?.orders?.id}
                </p>
                <p className="text-lg  ">userId:{data?.orders?.userId}</p>
                <p className="text-lg  ">Name:{data?.orders?.name}</p>
                <p className="text-lg  ">Address:{data?.orders?.address}</p>
                <p className="text-lg  ">Email:{data?.orders?.email}</p>

                <p className="text-lg">
                  Phone: {data?.orders?.phone?.toString()}
                </p>
                <p className="text-lg  ">Subtotal:{data?.orders?.subtotal}</p>
              </div>
              <div>
                <p className="text-lg  ">Status:{data?.orders?.status}</p>
              </div>
            </div>
          </div>
          <div>
            <Divider></Divider>
            {data?.orders?.products?.map((item, i) => {
              return (
                <>
                  <div className="flex flex-col gap-2 p-10" key={i}>
                    <p className="text-lg">ProductId:{item?.id}</p>
                    <p className="text-lg">productName:{item?.name}</p>
                    <p className="text-lg">Descritption:{item?.description}</p>
                    <p className="text-lg">NoofPage:{item?.noofPage}</p>
                    <p className="text-lg">total:{item?.total}</p>

                    <p className="text-lg">PricePerPage:{item?.pricePerPage}</p>
                    <Image
                      src={item?.image}
                      alt={item?.name}
                      height={100}
                      width={100}
                    />
                  </div>
                  <Divider />
                </>
              );
            })}
            <div></div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Orders;

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
