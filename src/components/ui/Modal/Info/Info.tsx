import React, { FC } from "react";
import dynamic from "next/dynamic";
import styles from './Info.module.scss'
import Image from "next/image";
import images from "@/assets/images";
import useStore from "@/hooks/useStore";
import Blog from "../../Blog/Blog";


const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export interface InfoProps {
    handleCloseInfo?: any
}

const Info: FC<InfoProps> = ({ ...props }) => {
    const { handleCloseInfo } = props
    const [state, dispatch] = useStore();
    const { blogs } = state;
    return (
        <div className="info-wrapper">
            <div className="info-header">
                <div>
                    <Image src={images.Pomodoro} width={150} height={30} alt="logo-pomodoro" />
                </div>
                <div onClick={handleCloseInfo} style={{ cursor: "pointer" }}>
                    <Image src={images.Close} width={26} height={26} alt="close-btn" />
                </div>
            </div>
            <div className="info-content">
                <div className="info-video">
                    <ReactPlayer url="https://youtu.be/4lqnmLJBIz0" controls={true} />
                </div>
            </div>

            {
                blogs &&
                blogs.length > 0 &&
                blogs.map((item: any) => {
                    return (
                        <Blog key={item.id} Heading={item.Heading} headContent={item.headContent} TagContent={item.TagContent}
                            isOl={item.isOl} contentP={item.contentP} contentList={item.contentList}
                        />
                    );
                })}
        </div>
    )
}
export default Info