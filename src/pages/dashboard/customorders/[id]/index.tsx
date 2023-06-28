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
import { NextPageWithLayout } from "../../../../pages/_app";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "@/server/api/root";
import { prisma } from "@/server/db";
import superjson from "superjson";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { toast } from "react-toastify";
import { Button, Card } from "@material-tailwind/react";

import Meta from "@/components/Meta";
import Image from "next/image";

type OrderProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Orders: NextPageWithLayout<OrderProps> = (props) => {
  const router = useRouter();
  const { id } = props;
  const { data }:any= api.customOrder.getCustomOrderById.useQuery({
    id: id,
  });

  const [status, setStatus] = React.useState<string>("");

  const { mutateAsync } = api.customOrder.updateOrderStatus.useMutation({
    onSuccess: () => {
      toast.success("Product Status Updated successfully!");
      router.reload();
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
  const handleUpdateProduct = async (e: React.FormEvent) => {
    const data = { id:id, status: status };
    await mutateAsync(data);
  };

  console.log(data);

  return (
    <>
      <Meta
        title="Single Product Dashboard"
        description="Dashboard Single Product  Cloud Print"
      />
      <div className="m-auto flex h-screen w-full items-center  ">
        <Card className="m-auto wfull shadow-md">
          <div className="flex justify-between p-10">
            <div className="flex flex-col gap-1">
              <p className="text-lg  text-gray-500">
                #orderId:{data?.orders?.id}
              </p>
              <p className="text-lg  ">userId:{data?.orders?.userId}</p>
              <p className="text-lg  ">Name:{data?.orders?.name}</p>
              <p className="text-lg  ">Address:{data?.orders?.address}</p>
              <p className="text-lg  ">Email:{data?.orders?.email}</p>
              <p className="text-lg  ">Binding:{data?.orders?.binding}</p>
              <p className="text-lg  ">BindingPrice:{data?.orders?.bindingPrice}</p>
              <p className="text-lg  ">PDF:{data?.orders?.pdf}</p>
              <p className="text-lg  ">pricePerPage:{data?.orders?.pricePerPage}</p>
              <p className="text-lg  ">TotalPage:{data?.orders?.totalPages}</p>
              <p className="text-lg  ">Status:{data?.orders?.status}</p>
              <p className="text-lg  ">TypeOfPrint:{data?.orders?.typeofPrint}</p>
              
              <p className="text-lg  ">
                <p className="text-lg">
                  Phone: {data?.orders?.phone?.toString()}
                </p>
              </p>
              <p className="text-lg  ">Total:{data?.orders?.total}</p>
            </div>

            <div className="flex flex-col">
              <label>Status :</label>
              <select
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
                value={status}
              >
                <option value={"PENDING"}>PENDING</option>
                <option value={"PROCESSING"}> PROCESSING</option>
                <option value={"COMPLETED"}>COMPLETED</option>
                <option value={"DELIVERED"}>DELIVERED</option>
              </select>
            </div>
          </div>
        
          <div className="w-full p-10">
            <Button onClick={handleUpdateProduct} className="w-full p-2">
              Submit
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};

Orders.getLayout = function getLayout(page) {
  return (
    <div className="h-screen w-full">
      <DashboardNavbar />
      <div className="flex">
        <div className="w-3/12">
          <DashboardSidebar />
        </div>
        <div className="flex-1">{page}</div>
      </div>
    </div>
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
