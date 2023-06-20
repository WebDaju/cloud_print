/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import { Formik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";

import { Button, Card, Input } from "@material-tailwind/react";
import { api } from "@/utils/api";
import { IRegister } from "@/validation/auth";

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too short")
    .max(20, "Too Long")
    .required("Name is required"),
  password: Yup.string()
    .min(2, "Too Short!")
    .max(10, "Too Long!")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
});

const Register = () => {
  const { mutateAsync } = api.auth.register.useMutation({
    onError: () => toast.error("Something went wrong."),
    onSuccess: () => {
      toast.success("Account created successfully!");
    },
  });

  return (
    <div className="w-1/4 m-auto flex items-center justify-center flex-col">
     <Card className=" w-full p-10 mt-20 shadow-lg">
    <h1 className="text-center text-lg font-bold pb-2">Register</h1>
    <Formik
      initialValues={{ name: "", email: "", password: "" }}
      validationSchema={SignupSchema}
      onSubmit={async (values) => {
        await mutateAsync(values as IRegister);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            type="text"
            name="name"
            label="name"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.name}
            size="md"
          />
          <p className="text-red">
            {errors.name && touched.name && errors.name}
          </p>
          <Input
            type="email"
            name="email"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
            size="md"
            label="Email"
          />
          <p className="text-red">
            {errors.email && touched.email && errors.email}
          </p>

          <Input
            type="password"
            name="password"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password}
            size="md"
            label="Password"
          />
          {errors.password && touched.password && errors.password}
          <Button type="submit" disabled={isSubmitting} variant="filled">
            Submit
          </Button>
        </form>
      )}
    </Formik>
  </Card>

    </div>
   
  );
};

export default Register;
