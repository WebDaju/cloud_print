/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from "react";
import { api } from "@/utils/api";
import "y/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClientOnly from "@/components/ClientOnly";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { AppProps } from "next/app";
import Example from "@/components/Navbar";
import { Provider } from "react-redux";
import { store } from "@/store";

export type NextPageWithLayout<P = {}> = React.FC<P> & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const getLayout = (Component as NextPageWithLayout).getLayout;

  if (getLayout) {
    const layout = getLayout(<Component {...pageProps} />);
    return (
      <SessionProvider session={...pageProps.session}>
        <Provider store={store}>
          <ClientOnly>
            <ToastContainer />
            {layout}
          </ClientOnly>
        </Provider>
      </SessionProvider>
    );
  }

  return (
    <SessionProvider session={...pageProps.session}>
      <Provider store={store}>
        <ClientOnly>
          <ToastContainer />
          <Example />
          <Component {...pageProps} />
        </ClientOnly>
      </Provider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
