import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import { Button } from 'antd';
import { FC } from 'react';

const cx = classNames.bind(styles);

export interface MenuItemProps {
    data?: any,
    onClick?: any,
}

const MenuItem: FC<MenuItemProps> = ({ ...props }) => {
    const { data, onClick } = props
    const classes = cx('menu-item', {
        separate: data.separate,
        small: data.small,
    });
    return (
        <Button className={classes} onClick={onClick}>
            {data.title}
        </Button>
    );
}

export default MenuItem;
