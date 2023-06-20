/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppSelector } from "../../hooks";
import 'react-toastify/dist/ReactToastify.css';

import { Button } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import Meta from "@/components/Meta";
import { api } from "@/utils/api";

const Checkout = () => {
  const cartItems = useAppSelector((state) => state.cart.items);
  const userDetail = useAppSelector((state) => state.userDetail.detail);
  const productsIds = cartItems?.map((item: any) => item?.id);
  const products = productsIds?.map((id: any) => ({ id: id }));
  const router = useRouter();

  const subtotal = cartItems.reduce(
    (acc: any, item: any) => acc + item.total,
    0
  );
  const { mutateAsync } = api.order.createOrders.useMutation({
    onSuccess: async() => {
      toast.success("Orders created successfully!");
      await router.push("/");
    },
  
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const submitOrderHandler = async () => {
    const data = {
      name: userDetail.name,
      email: userDetail.email,
      phone: BigInt(userDetail?.phone),
      address: userDetail.address,
      subtotal: subtotal,
      products: products,
    };

    await mutateAsync(data);
  };

  return (
    <section>
      <ToastContainer/>
      <Meta title="CheckoutPage" description="Checkout Page Cloud Print" />
      <div>
        <h1 className="mt-5 text-center text-4xl font-semibold">Summary</h1>

        <div className="m-auto w-4/5">
          <div className="relative mt-10 overflow-x-auto shadow-md  sm:rounded-lg">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Product name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3">
                    No of pages
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Price
                  </th>{" "}
                  <th scope="col" className="px-6 py-3">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                  >
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                      <Image
                        src={item?.product?.image}
                        height={100}
                        width={100}
                        alt={item?.product?.name}
                      />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {item?.product.name}
                    </td>
                    <td className="px-6 py-4">{item?.quantity}</td>
                    <td className="px-6 py-4">{item?.product?.noofPage}</td>
                    <td className="px-6 py-4">{item?.product.pricePerPage}</td>
                    <td className="px-6 py-4">{item?.total}</td>
                  </tr>
                ))}
                <tr className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-600">
                  <th
                    scope="row"
                    className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                    colSpan={5} // Set colSpan to 5 to span across all columns
                  >
                    <div className="m-auto flex w-1/2 justify-between">
                      <p>Subtotal</p>
                      <p>Rs {subtotal}</p>
                    </div>
                  </th>
                </tr>
              </tbody>
            </table>
          </div>

          <Button
            variant="contained"
            color="error"
            fullWidth
            sx={{ mt: 3 }}
            onClick={submitOrderHandler}
          >
            Confirm Order
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
