import React, { useEffect, useState } from "react";
import styles from "./CountdownCircle.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

interface CountdownCircleProps {
    active?: boolean;
}

const CountdownCircle: React.FC<CountdownCircleProps> = ({ active }) => {
    return (
        <div className={styles.container}>
            <div className={cx("circle", {
                ["active"]: active
            })} style={{ strokeDashoffset: 10000 }}></div>
        </div>
    );
};
export default CountdownCircle;