/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Button,
  Checkbox,
  Option,
  Input,
  Select,
  Radio,
} from "@material-tailwind/react";
import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { addCustomUserDetail } from "@/store/customUserDetailSlice";
interface customPrint {
  name: string;
  address: string;
  phone: bigint;
  email: string;
  pdf: string;
  typeofPrint: string;
  binding: string;
  totalPages: number;
}

const formatFileSize = (sizeInBytes: number) => {
  const sizeInKB = Math.ceil(sizeInBytes / 1024);
  return sizeInKB + " KB";
};

// const customPrintSchema = Yup.object().shape({
//   name: Yup.string()
//     .min(2, "Too Short!")
//     .max(20, "Too Long!")
//     .required("Required"),
//   address: Yup.string()
//     .min(2, "Too Short!")
//     .max(50, "Too Long!")
//     .required("Required"),
//   email: Yup.string().email("Invalid email").required("Required"),
//   phone: Yup.number().required("required"),
//   pdf: Yup.string().required("required"),
//   typeofPrint: Yup.string().required("required"),
//   binding: Yup.string().required("required"),
// });

const CustomPrint = () => {
  const [customPrintData, setCustomPrintData] = useState<customPrint>({
    name: "",
    address: "",
    phone: BigInt(""),
    email: "",
    pdf: "",
    typeofPrint: "",
    binding: "",
    totalPages: 0,
  });

  const dispatch = useDispatch();
  const router = useRouter();
  const { name, address, phone, email, pdf, typeofPrint, binding, totalPages } =
    customPrintData;

  const onChange = async (e: any) => {
    if (e.target.name === "pdf") {
      const file = e.target.files[0];

      const profile = new FileReader();

      profile.onload = async () => {
        if (profile.readyState === 2) {
          const pdfData = profile.result as string;
          const pdf = await PDFDocument.load(pdfData);
          const totalPages = pdf.getPageCount();

          setCustomPrintData({
            ...customPrintData,
            pdf: profile.result as string,

            totalPages: totalPages,
          });
        }
      };
      profile.readAsDataURL(e.target.files[0]);
    } else {
      setCustomPrintData({
        ...customPrintData,
        [e.target.name]: e.target.value,
      });
    }
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (customPrintData.name == "") {
      toast.error("Please Enter Full Name ");
    }
    if (customPrintData.address == "") {
      toast.error("Please Enter Address ");
    }
    if (customPrintData.email == "") {
      toast.error("Please Enter Your Email");
    }
    if (customPrintData.phone == BigInt("")) {
      toast.error("Please Enter Your Phone ");
    }
    if (customPrintData.pdf == "") {
      toast.error("Please Upload PDF File ");
    }
    if (customPrintData.typeofPrint == "") {
      toast.error("Please Select Type Of Print");
    }

    if (customPrintData.binding == "") {
      toast.error("Please Select Binding");
    }

    dispatch(
      addCustomUserDetail({
        name: customPrintData.name,
        phone: Number(customPrintData.phone),
        email: customPrintData?.email,
        address: customPrintData?.address,
        pdf: customPrintData?.pdf,
        typeofPrint: customPrintData.typeofPrint,
        binding: customPrintData.binding,
        totalPages: customPrintData.totalPages,
        bindingPrice: customPrintData?.binding == "yes" ? 30 : 0,
        pricePerPage: customPrintData?.typeofPrint == "black" ? 4 : 7,
      })
    );

    await router.push("/user/custom/checkout");
  };

  return (
    <div className="m-auto w-full  gap-2 md:w-1/2  ">
      <h1 className="text-bold p-5 text-center text-2xl">Your Details</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          size="md"
          label="Name"
          type="text"
          name="name"
          onChange={onChange}
          value={name}
        />

        <Input
          size="md"
          label="Address"
          type="text"
          name="address"
          onChange={onChange}
          value={address}
        />

        <Input
          size="md"
          label="Phone"
          type="number"
          name="phone"
          onChange={onChange}
          value={phone.toString()}
        />

        <Input
          size="md"
          label="Email"
          type="email"
          name="email"
          onChange={onChange}
          value={email}
        />

        <div className="flex gap-10">
          <label>Binding</label>
          <Radio
            id="ripple-on"
            name="binding"
            label="yes"
            onChange={onChange}
            value={"yes"}
            ripple={true}
          />
          <Radio
            id="ripple-off"
            name="binding"
            value={"no"}
            label="no"
            onChange={onChange}
            ripple={false}
          />
        </div>

        <div className="flex gap-10">
          <label>Type Of Print :</label>
          <Radio
            id="ripple-on"
            name="typeofPrint"
            label="black"
            onChange={onChange}
            value={"black"}
            ripple={true}
          />
          <Radio
            id="ripple-off"
            name="typeofPrint"
            value={"color"}
            label="color"
            onChange={onChange}
            ripple={false}
          />
        </div>

        <input
          type="file"
          className="text-grey-500 file:text-black-700
            text-sm file:mr-5 file:rounded-full
            file:border-0 file:bg-red-50
            file:px-6 file:py-2
            file:text-sm file:font-medium
            hover:file:cursor-pointer hover:file:bg-amber-50
            hover:file:text-amber-700
          "
          onChange={onChange}
          name="pdf"
        />

        <Button type="submit" color="red" className="rounded-full">
          {" "}
          Submit
        </Button>
      </form>
    </div>
  );
};

export default CustomPrint;
