import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import images from '@/assets/images';
import Link from 'next/link'
import Image from 'next/image'

const cx = classNames.bind(styles);
function Footer() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('sitemap')}>
                <Link href="/">HOME</Link>
                <Link href="/">PRIVATE</Link>
                <Link href="/">CONTACT</Link>
                <Link href="/">SIMPLE PAGE</Link>
            </div>
            <div className={cx('links')}>
                <Link href="https://www.facebook.com/huynhson999" target="_blank">
                    <Image src={images.facebook} alt="Facebook" />
                </Link>
                <Link href="/">
                    <Image src={images.twitter} alt="Twitter" />
                </Link>
                <Link href="/">
                    <Image src={images.stripe} alt="Stripe" />
                </Link>
            </div>
            <div className={cx('me')}>
                <Link href="https://www.facebook.com/huynhson999" target="_blank">
                    Huỳnh Ngọc Sơn - HCMUS
                </Link>
            </div>
            <div className={cx('allrights')}>
                <Link href="https://www.instagram.com/tapdocsach_/" target="_blank">
                    Ig: tapdocsach_
                </Link>
            </div>
        </div>
    );
}

export default Footer;
