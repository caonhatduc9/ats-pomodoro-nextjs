import { Layout } from "antd";
import React from "react";
import { useRouter } from "next/router";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import useStore from "@/hooks/useStore";
import Head from "next/head";

const { Content } = Layout;

const LayoutComponent = (props) => {
  const { children } = props;
  const [state, dispatch] = useStore();
  const {  currentCustomColor,customBackgroundWallpaper,isDarkMode,isTimeRunning,currentBackgroundImage } = state;
  const color = currentCustomColor === 'black' ? '#aaaaaa' : 'white'
  const backgroundImage = currentCustomColor === 'black' ? '' : customBackgroundWallpaper
  const currentCustomColorLayout = isDarkMode && isTimeRunning ? "black" : currentCustomColor
  const router = useRouter();  
  return (
      <Layout className="App" theme="light" style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundImage: `url(${backgroundImage})`,
        backgroundColor: `${currentCustomColorLayout}`,
        transition: `background-color 0.5s ease-in-out 0s`,
        color: `${color}`,
      }}>
        {
          (router.pathname !== "/payment/success" && router.pathname !== "/payment/failure" && router.pathname !== "/404") 
          ?
          <Header /> : <></>
        }
        <Content className="App-content" style={{ height: "auto" }}>
          {children}
        </Content>
        {/* <Footer /> */}
      </Layout>
    );
};

export default LayoutComponent;
