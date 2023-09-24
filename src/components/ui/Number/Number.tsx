import React, { FC, memo } from "react";
import { Button } from "antd";
import Image from "next/image";
import classNames from 'classnames/bind';

import styles from './Number.module.scss';
import images from '@/assets/images';

const cx = classNames.bind(styles);
export interface NumberProps {
    value?: any,
    onChangeInput?: any,
    onChangeButtonUp?: any,
    onChangeButtonDown?: any,
    isHorizontal?: boolean
}

const Number: FC<NumberProps> = ({ ...props }) => {
    const { isHorizontal = true, value, onChangeInput, onChangeButtonUp, onChangeButtonDown } = props
    return (
        <>
            <input id="input_est_pomodoro"
                type="number"
                min="0"
                step="1"
                value={value}
                onChange={onChangeInput}
            />
            <div className={cx({ ['est-input-act']: !isHorizontal })}>
                <Button size="small" onClick={onChangeButtonUp}>
                    <Image src={images.caretUp} alt="caretUp" />
                </Button>
                <Button size="small" onClick={onChangeButtonDown}>
                    <Image src={images.caretDown} alt="caretDown" />
                </Button>
            </div>
        </>
    )
}
export default memo(Number)