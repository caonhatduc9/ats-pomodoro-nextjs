import React, { FC, useState } from "react"
import { SketchPicker, ChromePicker } from 'react-color';
import styles from './Color.module.scss'
import classNames from 'classnames/bind';
import useStore from "@/hooks/useStore";
import { actions } from '@/store';
export interface ColorProps {
    theme?: string
}
const cx = classNames.bind(styles);
const Color: FC<ColorProps> = ({ ...props }) => {
    const [state, dispatch] = useStore();
    const { customColorHexPomo, customColorHexShort, customColorHexLong, currentTheme } = state
    const { theme } = props
    const selectTheme = () => {
        if (theme === 'pomo') {
            return customColorHexPomo
        }
        else if (theme === 'short') {
            return customColorHexShort
        }
        else if (theme === 'long') {
            return customColorHexLong
        }
    }
    const [colorHex, setColorHex] = useState(selectTheme);
    const [displayColorPicker, setDisplayColorPicker] = useState(false);

    const handleClick = () => {
        setDisplayColorPicker(!displayColorPicker);
    };

    const handleClose = () => {
        setDisplayColorPicker(false);
    };
    const handleChange = (color: any) => {
        if (theme === 'pomo') {
            dispatch(actions.setCustomColorHexPomo(color.hex));
            if (currentTheme === 'pomo') {
                //sẽ thay đổi luôn màu background hiện tại
                dispatch(actions.setCurrentCustomColor(color.hex));
            }
        }
        else if (theme === 'short') {
            dispatch(actions.setCustomColorHexShort(color.hex));
            if (currentTheme === 'short') {
                dispatch(actions.setCurrentCustomColor(color.hex));
            }
        }
        else if (theme === 'long') {
            dispatch(actions.setCustomColorHexLong(color.hex));
            if (currentTheme === 'long') {
                dispatch(actions.setCurrentCustomColor(color.hex));
            }
        }
        setColorHex(color.hex);
    };
    return (
        <div className={cx('color-wrapper')}>
            <div className={styles.swatch} onClick={handleClick} style={{
                background: `${colorHex}`,
            }}></div>
            {displayColorPicker && (
                <div className={styles.popover}>
                    <div className={styles.cover} onClick={handleClose} />
                    <ChromePicker color={colorHex} onChange={handleChange} />
                </div>
            )}
        </div>
    )
}

export default Color