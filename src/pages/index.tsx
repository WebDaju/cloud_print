/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import HomePage from "@/components/Home/HomePage";

import Meta from "@/components/Meta";
import { useSession } from "next-auth/react";
const Home = (

  
) => {

   const {data}=useSession()
   console.log(data)
  return (
    <div>
      <Meta title="HomePage" description="HomePage Cloud Print"/>
      <HomePage />
    </div>
  );
};

export default Home;