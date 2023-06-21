/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import HomePage from "@/components/Home/HomePage";
import { createServerSideHelpers } from "@trpc/react-query/server";

import superjson from "superjson";
import { prisma } from "../server/db";

import { appRouter } from "@/server/api/root";

import Meta from "@/components/Meta";
const Home = (
  
) => {

  return (
    <div>
      <Meta title="HomePage" description="HomePage Cloud Print"/>
      <HomePage />
    </div>
  );
};

export default Home;