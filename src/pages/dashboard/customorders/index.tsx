/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import React, { Fragment, useState } from "react";
import { NextPageWithLayout } from "../../../pages/_app";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "@/server/api/root";
import { prisma } from "@/server/db";
import superjson from "superjson";
import { InferGetServerSidePropsType } from "next";

import { useRouter } from "next/router";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { api } from "@/utils/api";
import { toast } from "react-toastify";
import Meta from "@/components/Meta";

type OrderProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Order: NextPageWithLayout<OrderProps> = ({ orders: data }) => {
  const [orders, setOrders] = useState(superjson.parse(data));
  console.log(orders);

  const router = useRouter();
  const { mutateAsync } = api.customOrder.deleteCustomOrder.useMutation({
    onSuccess: () => {
      toast.success("Order created successfully!");
      router.reload();
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const orderDeleteHandler = async (id: string) => {
    await mutateAsync({
      id: id,
    });
  };
  const columns: GridColDef[] = [
    { field: "id", headerName: "id", width: 200 },
    {
      field: "createdAt",
      headerName: "createdAt",
      width: 150,
      editable: true,
    },

    {
      field: "userId",
      headerName: "userId",
      width: 150,
      editable: true,
    },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      editable: true,
    },
    {
      field: "status",
      headerName: "status",
      width: 150,
      editable: true,
    },

    {
      field: "address",
      headerName: "Address",
      width: 150,
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      type: "number",
      width: 200,
      editable: true,
    },
    {
      field: "phone",
      headerName: "phone",
      type: "number",
      width: 110,
      editable: true,
    },
    {
      field: "pdf",
      headerName: "pdf",
      type: "string",
      width: 200,
      editable: true,
    },
    {
      field: "typeofPrint",
      headerName: "typeofPrint",
      type: "string",
      width: 110,
      editable: true,
    },
    {
      field: "binding",
      headerName: "binding",
      type: "string",
      width: 110,
      editable: true,
    },
    {
      field: "totalPages",
      headerName: "totalPages",
      type: "number",
      width: 110,
      editable: true,
    },
    {
      field: "bindingPrice",
      headerName: "bindingPrice",
      type: "number",
      width: 110,
      editable: true,
    },
    {
      field: "pricePerPage",
      headerName: "pricePerPage",
      type: "number",
      width: 110,
      editable: true,
    },

    {
      field: "total",
      headerName: "total",
      type: "number",
      width: 110,
      editable: true,
    },

    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 200,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        const id = `${params.row.id}`;
        return (
          <div className="flex items-center gap-7">
            <FaEdit
              color="blue"
              className="cursor-pointer"
              onClick={() => {
                router.push(`/dashboard/customorders/${id}`);
              }}
              // params.row._id
            />

            <AiFillDelete
              color="red"
              onClick={(e) => {
                e.preventDefault();
                orderDeleteHandler(id);
              }}
              className="cursor-pointer"
            />
          </div>
        );
      },
    },
  ];
  const rows: any = [];
  if (!Array.isArray(orders)) {
    return null; // or any other appropriate fallback
  }
  orders?.forEach((item: any) => {
    rows.push({
      id: item?.id,
      createdAt: item?.createdAt,
      userId: item?.userId,
      name: item.name,
      status: item?.status,
      address: item?.address,
      email: item?.email,
      phone: item?.phone,
      pdf: item?.pdf,
      typeofPrint: item?.typeofPrint,
      binding: item?.binding,
      totalPages: item?.totalPages,
      bindingPrice: item?.bindingPrice,
      pricePerPage: item?.pricePerPage,

      total: item.total,
    });
  });

  return (
    <Fragment>
      <Meta
        title={"Custom order /Dashboord"}
        description="All Product Dashboard  Page Cloud Print"
      />
      <div className="flex h-full flex-col">
        <h1 className="p-5 text-center text-xl">All Custom Orders</h1>
        <div className="flex-1 overflow-y-scroll">
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </div>
      </div>
    </Fragment>
  );
};

Order.getLayout = function getLayout(page) {
  return (
    <div className="h-screen w-full">
      <DashboardNavbar />
      <div className="flex">
        <div className="h-full w-1/5">
          <DashboardSidebar />
        </div>
        <div className="w-4/5 overflow-y-scroll">
          <div className="mx-auto">{page}</div>
        </div>
      </div>
    </div>
  );
};

export default Order;

export async function getServerSideProps(context: any) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      session: null,
      prisma: prisma,
    },
    transformer: superjson,
  });

  const data = await helpers.customOrder.getAllCustomOrders.fetch();

  return {
    props: {
      trpcState: helpers.dehydrate(),
      orders: superjson.stringify(data?.orders),
    },
  };
}
