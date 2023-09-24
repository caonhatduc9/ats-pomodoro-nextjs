import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import { FC } from 'react';

const cx = classNames.bind(styles);

export interface HeaderProps {
    title?: string,
    onBack?: any
}

const Header: FC<HeaderProps> = ({ ...props }) => {
    const { title, onBack } = props
    return (
        <header className={cx('header')}>
            <button className={cx('back-btn')} onClick={onBack}>
                <FontAwesomeIcon icon={faChevronLeft} className={cx('header-icon')} />
            </button>
            <h4 className={cx('header-title')}>{title}</h4>
        </header>
    );
}

export default Header;
