import React, { FC } from "react"
import styles from './Spinner.module.scss'
import classNames from 'classnames/bind';
export interface SpinnerProps {
}
const cx = classNames.bind(styles);
const Spinner: FC<SpinnerProps> = ({ ...props }) => {

    return (
        <div className={cx("spinner-wrapper")}>
            <div className={cx("spinner-container")}>
                <div className={cx("spinner")}>
                </div>
            </div>
        </div>
    )
}

export default Spinner