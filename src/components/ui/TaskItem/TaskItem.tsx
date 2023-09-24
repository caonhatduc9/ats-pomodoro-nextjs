import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import images from '@/assets/images';
import styles from './TaskItem.module.scss';
import { Button } from 'antd';
import { FC } from 'react';
import Image from 'next/image';
import { Roboto } from 'next/font/google'

const roboto = Roboto({
    weight: ['400', '700'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
    display: 'swap',
})

const cx = classNames.bind(styles);

export interface TaskItemProps {
    activePomo?: any,
    id?: any,
    title?: string,
    numAct?: number,
    estPomo?: number,
    note?: string,
    project?: any,
    isDone?: boolean,
    onClick?: any,
    onClickThreeDot?: any,
    onClickDoneTask?: any,
}

const TaskItem: FC<TaskItemProps> = ({ ...props }) => {
    const { activePomo, id, title, numAct, estPomo, note, project, isDone,
        onClick, onClickThreeDot, onClickDoneTask } = props
    return (
        <div className={cx('task-item', { ['active']: activePomo })}>
            <div className={cx('task-title')}>
                <div className={cx('task-activity', { ['active']: isDone })} onClick={onClick}>
                    <span onClick={onClickDoneTask} className={cx('task-span-check')}>
                        <FontAwesomeIcon icon={faCircleCheck} className={cx('task-span-check-svg')} />
                    </span>
                    <span className={cx('title', { [roboto.className]: true })}>
                        {
                            project &&
                            <span className={cx('project-name')}>{project?.projectName}</span>
                        }
                        {title}
                    </span>
                </div>
                <div className={cx('task-action')}>
                    <span className={cx('current-task')} onClick={onClick}>
                        {numAct}
                        <span className={cx('sum-task')}>/ {estPomo}</span>
                    </span>
                    <Button className={cx('three-dots')} size="middle" onClick={onClickThreeDot}>
                        <Image src={images.vertical} alt="three-dots" />
                    </Button>
                </div>
            </div>
            {note && (
                <div className={cx('notes', [roboto.className])}>
                    <p>{note}</p>
                </div>
            )}
        </div>
    );
}

export default TaskItem;
