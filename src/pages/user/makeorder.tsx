/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Fragment, useState } from "react";

import {
  Button,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { pdfjs } from "react-pdf";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { addUserDetail } from "../../store/userDetailSlice";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { getServerAuthSession } from "@/server/auth";
import { Input } from "@material-tailwind/react";
import Meta from "@/components/Meta";

const MakeOrder = () => {
  const dispatch = useAppDispatch();

  const router = useRouter();
  const cartItems = useAppSelector((state) => state.cart.items);

  const [orderData, setOrderData] = useState({
    name: "",
    phone: "" as unknown as number,
    email: "",
    address: "",
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setOrderData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSelectChange: any = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setOrderData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleOrderSubmitHandler = async () => {
    dispatch(
      addUserDetail({
        name: orderData.name,
        phone: orderData.phone,
        email: orderData?.email,
        address: orderData?.address,
      })
    );

    router.push("/user/checkout");
  };

  return (
    <Fragment>
       <Meta title="Make Order" description="Make order Page Cloud Print"/>
      <div className="mt-4">
        <h1 className="text-center text-4xl font-bold">Fill In Your Details</h1>
        <div className="m-auto w-1/2">
          <form className="flex w-full flex-col  gap-5">
            <div>
              <Input
                type="text"
               
                label="name"
                size="md"
                name="name"
                value={orderData.name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Input
                type="number"
                size="md"
                label="Phone Number"
                name="phone"
                value={orderData.phone as number}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Input
                type="email"
               
                size="md"
                label="email"
                name="email"
                value={orderData.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Input
                type="text"
              
                label="Address"
                size="md"
                name="address"
                value={orderData.address}
                onChange={handleInputChange}
              />
            </div>

            <div className="w-full">
              <Button
                variant="contained"
                size="large"
                onClick={handleOrderSubmitHandler}
                className="w-full"

              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default MakeOrder;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
};
