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
import React, { useEffect, useState } from "react";
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
import { Button, Input } from "@material-tailwind/react";
import Image from "next/image";
import Meta from "@/components/Meta";

type ProductProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Product: NextPageWithLayout<ProductProps> = ({ id }) => {
  const { data } = api.product.getProductById.useQuery({
    id:id,
  });

  console.log(data);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [noofPage, setnoofPage] = useState<number>(0);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [pdfnew, setPdfNew] = useState<string | undefined>(undefined);
  const [imagepreview, setImagepreview] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [pricePerPage, setPricePerPage] = useState<number>(0);

  const router = useRouter();

  useEffect(() => {
    if (data) {
      const { name, description, image, noofPage, pdf, total, pricePerPage } =
        data?.products;
      setName(name || "");
      setDescription(description || "");
      setImagepreview(image || "");
      setnoofPage(noofPage);
      setTotal(total);
      setPricePerPage(pricePerPage);
    }
  }, [data]);

  const { mutateAsync } = api.product.updateProduct.useMutation({
    onSuccess: () => {
      toast.success("Product created successfully!");
      router.reload();
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasNewImage = image;
    const hasNewPdf = pdfnew;

    const realdata = {
      name,
      description: description,
      image: hasNewImage ? image : data?.products?.image,
      pdf: hasNewPdf ? pdfnew : data?.products?.pdf,
      noofPage: noofPage,
      pricePerPage: pricePerPage,
      total: Number(noofPage * Number(pricePerPage)),
    };

    console.log(realdata);
    
    await mutateAsync({
      id:id,
      name: realdata.name,
      description: realdata.description,
      image: realdata.image  || "",
      pdf: realdata.pdf || "",
      noofPage: realdata.noofPage,
      total: realdata.total,
      pricePerPage: realdata.pricePerPage,
    });
    
  };

  const onChange = (e: any) => {
    if (e.target.name === "images") {
      const profile = new FileReader();
      profile.onload = () => {
        if (profile.readyState === 2) {
          setImage(profile.result as string);
          setImagepreview(profile.result as string);
        }
      };
      profile.readAsDataURL(e.target.files[0]);
    }
    if (e.target.name === "pdf") {
      const profile = new FileReader();
      profile.onload = () => {
        if (profile.readyState === 2) {
          setPdfNew(profile.result as string);
        }
      };
      profile.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <>
      <Meta
        title="Single Product Dashboard"
        description="Dashboard Single Product  Cloud Print"
      />
      <form
        encType="multipart/form-data"
        className="flex w-full flex-col justify-between gap-3 "
      >
        <h1 className="text-rose-400 text-center text-lg font-bold">
          Update Products
        </h1>
        <Input
          type="text"
          placeholder="name"
          label="name"
          name="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <Input
          type="text"
          label="decription"
          placeholder="description"
          name="description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <Input
          type="number"
          placeholder="noofPage"
          label="noofPage"
          name="noofPage"
          value={noofPage}
          onChange={(e) => {
            setnoofPage(e.target.value as unknown as number);
          }}
        />
        <Input
          type="number"
          label="pricePerPage"
          placeholder="pricePerPage"
          name="pricePerPage"
          value={pricePerPage}
          onChange={(e) => {
            setPricePerPage(parseInt(e.target.value));
          }}
        />
        <Input
          type="number"
          placeholder="total"
          label="total"
          name="total"
          value={total}
          onChange={(e) => {
            setTotal(parseInt(e.target.value));
          }}
        />
        <Image src={imagepreview || "" } height={60} width={60} alt="productImage" />
        <Image src={ image || ""} height={60} width={60} alt="productImage" />
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

        <Button
          onClick={handleUpdateProduct}
          variant="outlined"
          className="w-full"
        >
          Submit
        </Button>
      </form>
    </>
  );
};

Product.getLayout = function getLayout(page) {
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
