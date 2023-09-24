import classNames from 'classnames/bind';
import { FC } from 'react';
import styles from './Blog.module.scss';
import { IntegralCFHeavy, SofiaProBold, SofiaProRegular } from '@/utils/fonts';

const cx = classNames.bind(styles);

export interface BlogProps {
    Heading?: any,
    headContent?: string,
    TagContent?: string,
    isOl?: boolean,
    contentP?: string,
    contentList?: any
}


const Blog: FC<BlogProps> = ({ ...props }) => {
    const { Heading = 'h2', headContent, TagContent = 'p', isOl = false, contentP, contentList = [] } = props
    return (
        <div className={cx('wrapper')}>
            {
                Heading === 'h1' ? <Heading className={cx('heading', { [IntegralCFHeavy.className]: true })}>{headContent}</Heading> : <Heading className={cx('heading', { [SofiaProBold.className]: true })}>{headContent}</Heading>
            }
            {TagContent === 'p' ? (
                <p className={cx('content', { [SofiaProRegular.className]: true })}>{contentP}</p>
            ) : (
                <>
                    {isOl === false ? (
                        <ul className={cx('content-list')}>
                            {contentList &&
                                contentList.length > 0 &&
                                contentList.map((item: any, index: number) => {
                                    return (
                                        <li key={index} className={cx('content-item', { [SofiaProRegular.className]: true })}>
                                            {item}
                                        </li>
                                    );
                                })}
                        </ul>
                    ) : (
                        <ol className={cx('content-list')}>
                            {contentList &&
                                contentList.length > 0 &&
                                contentList.map((item: any, index: number) => {
                                    return (
                                        <li key={index} className={cx('content-item', { [SofiaProRegular.className]: true })}>
                                            {item}
                                        </li>
                                    );
                                })}
                        </ol>
                    )}
                </>
            )}
        </div>
    );
}

export default Blog;
