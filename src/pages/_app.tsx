// pages/_app.js
import { Inter, Poppins } from 'next/font/google'
import { SessionProvider } from "next-auth/react"
import "@/styles/globals.scss";
import 'normalize.css/normalize.css';
import 'animate.css';
import type { AppProps } from "next/app";
import { Layout } from "@/components/global";
import { SWRConfig } from "swr";
import { useReducer } from 'react';
import { CookiesProvider } from 'react-cookie';

import Context from "@/store/Context";
import reducer, { initState } from "@/store/reducer";

// If loading a variable font, you don't need to specify the font weight
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '500', '700'],
  style: ['italic', 'normal']
})

export default function App({ Component, pageProps }: AppProps) {
  const [state, dispatch] = useReducer(reducer, initState);
  return (
    <SessionProvider
      session={pageProps.session}
    >
      <CookiesProvider>
        <Context.Provider value={[state, dispatch]}>
          <Layout>
            <div className={poppins.className}>
              <SWRConfig value={{ provider: () => new Map() }}>
                <Component {...pageProps} />
              </SWRConfig>
            </div>
          </Layout>
        </Context.Provider>
      </CookiesProvider>
    </SessionProvider>
  );
}
