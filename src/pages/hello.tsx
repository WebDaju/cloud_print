// import { GetServerSideProps } from "next";
// import React from "react";
// import { authOptions, getServerAuthSession } from "y/server/auth";
// import { api } from "y/utils/api";
// import { any } from "zod";

// const hello = () => {
//   const { data: user } = api.user.getCurrentUser.useQuery();
//   if (!user) {
//     console.log("unknw");
//   }
//   console.log(user);
//   return <div></div>;
// };

// export default hello;
// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const session = await getServerAuthSession(ctx);
//   if (!session) {
//     return {
//       redirect: {
//         destination: "/auth/login",
//         permanent: false,
//       },
//     };
//   }
//   return {
//     props: { session },
//   };
// }