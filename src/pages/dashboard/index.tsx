/* eslint-disable @typescript-eslint/consistent-type-imports */
import React from "react";
import { NextPageWithLayout } from "../_app";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";
import Meta from "@/components/Meta";

const Dashboard: NextPageWithLayout = () => {
  return <div>
   <Meta title="Dashboard" description="Dashboard Page Cloud Print"/>
  </div>;
};

Dashboard.getLayout = function getLayout(page) {
  return (
    <div>
      
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

export default Dashboard;
