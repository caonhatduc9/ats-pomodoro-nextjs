import classNames from 'classnames/bind';
import styles from './PoperWrapper.module.scss';
import { FC } from 'react';
import useStore from '@/hooks/useStore';

const cx = classNames.bind(styles);

export interface WrapperProps {
    children?: any,
    className?: any,
}

const Wrapper: FC<WrapperProps> = ({ ...props }) => {
    const { children, className } = props
    const [state, dispatch] = useStore();
    const { isOpenMenuTippy } = state

    return (
        <>
            {
                (isOpenMenuTippy) ?
                    <div className={cx('wrapper', className)}>{children}</div> : <></>
            }
        </>
    )
}

export default Wrapper;
