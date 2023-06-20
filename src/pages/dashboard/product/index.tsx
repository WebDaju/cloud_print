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

type ProductProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Product: NextPageWithLayout<ProductProps> = ({ products: data }) => {
  const [products, setProducts] = useState(superjson.parse(data));
  const router = useRouter();
  const { mutateAsync } = api.product.deleteProduct.useMutation({
    onSuccess: () => {
      toast.success("Product created successfully!");
      router.reload();
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const productDeleteHandler = async (id: number) => {
    await mutateAsync({
      id: id,
    });
  };
  const columns: GridColDef[] = [
    { field: "id", headerName: "id", width: 90 },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      editable: true,
    },
    {
      field: "description",
      headerName: "Description",
      width: 150,
      editable: true,
    },
    
    {
      field: "image",
      headerName: "image",
      type: "string",
      width: 300,
      editable: true,
    },
    {
      field: "pricePerPage",
      headerName: "pricePerPage",
      type: "string",
      width: 300,
      editable: true,
    },
    {
      field: "noofPage",
      headerName: "noofPage",
      type: "string",
      width: 300,
      editable: true,
    },
    {
      field: "total",
      headerName: "total",
      type: "string",
      width: 300,
      editable: true,
    },
    {
      field: "pdf",
      headerName: "pdf",
      type: "string",
      width: 300,
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
        const id = parseInt(`${params.row.id}`);
        return (
          <div className="flex items-center gap-7">
            <FaEdit
              color="blue"
              className="cursor-pointer"
              onClick={() => {
                router.push(`/dashboard/product/${id}`);
              }}
              // params.row._id
            />

            <AiFillDelete
              color="red"
              onClick={(e) => {
                e.preventDefault();
                productDeleteHandler(id);
              }}
              className="cursor-pointer"
            />
          </div>
        );
      },
    },
  ];
  const rows: any = [];
  if (!Array.isArray(products)) {
    return null; // or any other appropriate fallback
  }
  products?.forEach((item: any) => {
    rows.push({
      id: item?.id,
      name: item.name,
      description: item?.description,
      image: item?.image,
      pricePerPage: item?.pricePerPage,
      noofPage: item?.noofPage,
      total: item?.total,
      pdf: item?.pdf,

      // public_id: item?.image?.public_id,
    });
  });

  return (
    <Fragment>
      <Meta
        title={"All Product Page Dashboord"}
        description="All Product Dashboard  Page Cloud Print"
      />
      <div className="flex flex-col ">
        <h1 className="p-5 text-center text-xl">All Products</h1>
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
    </Fragment>
  );
};

Product.getLayout = function getLayout(page) {
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

  const data = await helpers.product.getAllProduct.fetch();

  return {
    props: {
      trpcState: helpers.dehydrate(),
      products: superjson.stringify(data?.products),
    },
  };
}
