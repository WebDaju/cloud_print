/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAppSelector } from "@/hooks";
import { api } from "@/utils/api";
import { Button } from "@material-tailwind/react";
import { Card, Divider, Grid } from "@mui/material";
import { useRouter } from "next/router";
import React, { Fragment } from "react";
import { toast } from "react-toastify";

const CustomCheckOut = () => {
  const customUserDetail = useAppSelector(
    (state) => state.customUserDetail.detail
  );
  const router = useRouter();
  const total = Number(
    customUserDetail?.totalPages * Number(customUserDetail?.pricePerPage) +
      Number(customUserDetail.bindingPrice)
  );

  const { mutateAsync } = api.customOrder.createCustomOrders.useMutation({
    onSuccess: async () => {
      toast.success("Orders created successfully!");
      await router.push("/");
    },

    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const submitOrderHandler = async () => {
    const data = {
      name: customUserDetail.name,
      email: customUserDetail.email,
      phone: BigInt(customUserDetail?.phone),
      address: customUserDetail.address,
      typeofPrint: customUserDetail?.typeofPrint,
      binding: customUserDetail?.binding,
      totalPages: customUserDetail?.totalPages,
      bindingPrice: customUserDetail?.bindingPrice,
      pricePerPage: customUserDetail?.pricePerPage,
      total: total,
      pdf: customUserDetail?.pdf,
    };

    await mutateAsync(data);
  };
  return (
    <Fragment>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Card className="m-auto w-11/12 text-center text-2xl " elevation={3}>
          <h1 className="pt-3 text-center text-3xl font-bold">Summary</h1>
          <Grid container spacing={2} mt={3} padding={10} paddingTop={0}>
            <Grid xs={12} md={6} lg={4}>
              <div className=" gap  m-auto flex flex-col ">
                <div className="flex gap-2">
                  <p className="text-md   ">Name:</p>
                  <span className="text-md font-semi-bold text-red-500">
                    {customUserDetail?.name}
                  </span>
                </div>
                <div className="flex gap-2">
                  <p className="text-md   ">Email:</p>
                  <span className="text-md font-semi-bold text-red-500">
                    {customUserDetail.email}
                  </span>
                </div>
                <div className="flex gap-2">
                  <p className="text-md   ">Phone:</p>
                  <span className="text-md font-semi-bold text-red-500">
                    {customUserDetail?.phone}
                  </span>
                </div>
                <div className="flex gap-2">
                  <p className="text-md   ">Address:</p>
                  <span className="text-md font-semi-bold text-red-500">
                    {customUserDetail?.address}
                  </span>
                </div>
              </div>
            </Grid>
            <Grid xs={12} md={6} lg={4}>
              <div className=" gap  m-auto flex flex-col ">
                <div className="flex gap-2">
                  <p className="text-md   ">Type of Print:</p>
                  <span className="text-md font-semi-bold text-red-500">
                    {customUserDetail?.typeofPrint}
                  </span>
                </div>
                <div className="flex gap-2">
                  <p className="text-md   ">Binding:</p>
                  <span className="text-md font-semi-bold text-red-500">
                    {customUserDetail?.binding}
                  </span>
                </div>
                <div className="flex gap-2">
                  <p className="text-md   ">Total No Of Page:</p>
                  <span className="text-md font-semi-bold text-red-500">
                    {customUserDetail?.totalPages}
                  </span>
                </div>
                <div className="flex gap-2">
                  <p className="text-md   ">BindingPrice:</p>
                  <span className="text-md font-semi-bold text-red-500">
                    Rs . {customUserDetail?.bindingPrice}
                  </span>
                </div>
              </div>
            </Grid>
            <Grid xs={12} md={6} lg={4}>
              <div className=" gap m-auto flex flex-col ">
                <div className="flex gap-2">
                  <p className="text-md   ">Price per page:</p>
                  <span className="text-md font-semi-bold text-red-500">
                    {customUserDetail?.pricePerPage}
                  </span>
                </div>
              </div>
            </Grid>
          </Grid>

          <div className="m-auto mb-3 flex w-1/2 flex-col gap-2  p-3 text-center">
            <div className="flex items-center justify-center gap-2 text-center">
              <p>Total:</p>
              <span>Rs {total}</span>
            </div>

            <Button color="red" size="sm" className="rounded-full" onClick={submitOrderHandler}>
              Order Now
            </Button>
          </div>
        </Card>
      </div>
    </Fragment>
  );
};

export default CustomCheckOut;
