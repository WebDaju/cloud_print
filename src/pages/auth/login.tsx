/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from "react";
import { Formik } from "formik";

import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";

import * as Yup from "yup";
import { useRouter } from "next/router";
import { FaFacebookF } from "react-icons/fa";
import { Button, Card, Input } from "@material-tailwind/react";
import { getServerAuthSession } from "@/server/auth";
import { GetServerSideProps } from "next";

const LoginSchema = Yup.object().shape({
  password: Yup.string()
    .min(2, "Too Short!")
    .max(30, "Too Long!")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
});

const Login = () => {
  const router = useRouter();
  return (
    <Card className="m-auto mt-24 w-1/4">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={async (values) => {
          try {
            const response = await signIn("credentials", {
              redirect: false,
              ...values
            });
            if (response?.ok) {
              toast.success("Successfully Signed in");
              router.push("/");
            }
          } catch (error) {
            toast.error("Something went wrong");
          }
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
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-7">
            <h1 className="text-center text-2xl font-bold">Login</h1>
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
            <div>
              <p className="mt-3 text-center text-sm text-gray-400">
                Or login with
              </p>
            </div>

            <div className=" flex items-center justify-center gap-7 p-1">
              <span
                className="bg-slate-100 cursor-pointer rounded-full  p-3 hover:bg-gray-300 "
                onClick={() => signIn("google")}
              >
                <FcGoogle size={25} />
              </span>
              <span className="bg-slate-100 cursor-pointer rounded-full  p-3 hover:bg-gray-300">
                <FaFacebookF size={25} onClick={() => signIn("facebook")} />
              </span>
            </div>
            <div
              className="mt-5 cursor-pointer text-center text-sm text-gray-400"
              onClick={() => {
                router.push("/auth/register");
              }}
            >
              Not a member ? <span className="underline">Signup</span>
            </div>
          </form>
        )}
      </Formik>
    </Card>
  );
};

export default Login;
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
};
