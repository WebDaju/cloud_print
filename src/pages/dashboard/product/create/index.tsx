/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Button, Input } from "@material-tailwind/react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { pdfjs } from "react-pdf";
import { toast } from "react-toastify";
import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import { NextPageWithLayout } from "@/pages/_app";
import { getServerAuthSession } from "@/server/auth";
import { createProduct } from "@/types/products";
import { api } from "@/utils/api";
import { Iproducts } from "@/validation/products";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const index: NextPageWithLayout = () => {
  const router = useRouter();
  const [productData, setProductData] = useState<createProduct>({
    name: "",
    description: "",
    image: "",
    pricePerPage: 0,
    noofPage: 0 as number,
    total: "" as unknown as number,
    pdf: "",
  });
  const { name, description, image, pricePerPage, noofPage, total, pdf } =
    productData;

  const [images, setImages] = useState("");
  const [pdfs, setPdfs] = useState("");

  const onChange = (e: any) => {
    if (e.target.name === "images") {
      const profile = new FileReader();
      profile.onload = () => {
        if (profile.readyState === 2) {
          setImages(profile.result as string);
        }
      };
      profile.readAsDataURL(e.target.files[0]);
    } else if (e.target.name === "pdf") {
      const profile = new FileReader();
      profile.onload = () => {
        if (profile.readyState === 2) {
          setPdfs(profile.result as string);
        }
      };
      profile.readAsDataURL(e.target.files[0]);
    } else {
      setProductData({ ...productData, [e.target.name]: e.target.value });
    }
  };
  const { mutateAsync } = api.product.createProduct.useMutation({
    onSuccess: () => {
      toast.success("Product created successfully!");
      router.reload();
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const submitHandler = async (e: any) => {
    e.preventDefault();
    const pdfData = await fetch(pdfs);
    const pdfBlob = await pdfData.blob();
    const pdfObjectUrl = URL.createObjectURL(pdfBlob);
    const pdfNumPages = await pdfjs
      .getDocument(pdfObjectUrl)
      .promise.then((pdfDoc) => pdfDoc.numPages);

    const data = {
      name,
      description,
      noofPage: pdfNumPages,
      image: images,
      pdf: pdfs,
      total:Number(pdfNumPages*Number(pricePerPage)),
      pricePerPage: Number(pricePerPage),
    };
    console.log(data);
  
    await mutateAsync(data);
  };
  return (
    <div>
      <h1 className="text-center ">Create Product</h1>

      <div className="m-auto mt-5 flex w-1/2 flex-col gap-5">
        <Input
          type="text"
          name="name"
          onChange={onChange}
          value={name}
          label="name"
          size="md"
        />
        <Input
          type="text"
          name="description"
          label="description"
          onChange={onChange}
          value={description}
        />

        <div className="flex flex-col gap-3">
          <label className="text-xs text-gray-500">Thumbnail Image</label>
          <input
            type="file"
            className="text-grey-500 text-sm
            file:mr-5 file:rounded-full file:border-0
            file:bg-blue-50 file:px-6
            file:py-2 file:text-sm
            file:font-medium file:text-blue-700
            hover:file:cursor-pointer hover:file:bg-amber-50
            hover:file:text-amber-700
          "
            onChange={onChange}
            name="images"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-xs text-gray-500">Pdf File</label>
          <input
            type="file"
            className="text-grey-500 text-sm
            file:mr-5 file:rounded-full file:border-0
            file:bg-blue-50 file:px-6
            file:py-2 file:text-sm
            file:font-medium file:text-blue-700
            hover:file:cursor-pointer hover:file:bg-amber-50
            hover:file:text-amber-700
          "
            onChange={onChange}
            name="pdf"
          />
        </div>

        <Input
          type="number"
          name="pricePerPage"
          label="pricePerPage"
          onChange={onChange}
          value={pricePerPage}
        />

        <Button onClick={submitHandler}>Button</Button>
      </div>
    </div>
  );
};
index.getLayout = function getLayout(page) {
  return (
    <div className="h-screen w-full">
      <DashboardNavbar />
      <div className="flex">
        <div className="flex basis-3/12">
          <DashboardSidebar />
        </div>
        <div className="w-full">{page}</div>
      </div>
    </div>
  );
};

export default index;

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
