import classNames from 'classnames/bind';
import { useState, useRef, useEffect, FC, useCallback } from 'react';
import Image from 'next/image';
import { isInteger } from 'lodash';
import ReactAudioPlayer from 'react-audio-player';
import { Button } from 'antd';

import images from '@/assets/images';
import useStore from '@/hooks/useStore';
import { actions } from '@/store';
import styles from './Pomodoro.module.scss';
import { IntegralCFHeavy, SofiaProBold, SofiaProRegular, SofiaProLight } from '@/utils/fonts';
import axios from 'axios';
import Head from 'next/head';
import { Roboto } from 'next/font/google'
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import 'sweetalert2/dist/sweetalert2.css'
import withReactContent from 'sweetalert2-react-content';
import CountdownCircle from '../CountdownTimer/CountdownTimer';

const roboto = Roboto({
    weight: ['400', '700'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
    display: 'swap',
})

const cx = classNames.bind(styles);

export interface PomodoroProps {
    time?: any
}
const Pomodoro: FC<PomodoroProps> = ({ ...props }) => {
    const [state, dispatch] = useStore();
    const { numPomo, currentTheme, longBreakInterval, currentTask, isAutoStartPomo,
        isAutoStartBreaks, currentAlarmSound, currentTickingSound, isCloseSetting,
        customColorHexPomo, customColorHexShort, customColorHexLong, isDarkMode,
        currentCustomColor, currentBackgroundImage, customBackgroundWallpaper, todos,
        user, pomoBackground, isShowAlarmReducer, isTimeRunning } = state
    const alarmSound = currentAlarmSound?.sound
    const volumeAlarmSound = currentAlarmSound?.volume
    const repeatAlarmSound = currentAlarmSound?.repeat
    const tickingSound = currentTickingSound?.sound
    const volumeTickingSound = currentTickingSound?.volume
    const MySwal = withReactContent(Swal)

    const { time } = props
    const [start, setStart] = useState(false);
    const [second, setSecond] = useState(0);
    const [minutes, setMinutes] = useState(time);
    const [longInterval, setLongInterval] = useState(1)
    const [showAlarm, setShowAlarm] = useState(false)
    const [colorBackground, setColorBackground] = useState<any>()
    const [activeCircle, setActiveCircle] = useState(false)
    const durationAlarm = useRef<any>()
    const isStart = useRef<boolean>(false)
    const workerRef = useRef<Worker>()
    const colorBGDarkMode = currentCustomColor === 'black' ? 'black' : 'rgba(0, 0, 0, 0.1)';
    const visibilityDarkMode = currentCustomColor === 'black' ? 'hidden' : 'visible';
    const handleChangeCurrentTheme = () => {
        if (currentTheme === 'pomo') {
            dispatch(actions.setCurrentCustomColor(customColorHexPomo));
        }
        else if (currentTheme === 'short') {
            dispatch(actions.setCurrentCustomColor(customColorHexShort));
        }
        else if (currentTheme === 'long') {
            dispatch(actions.setCurrentCustomColor(customColorHexLong));
        }
        if (currentBackgroundImage && currentBackgroundImage.name !== "None") {
            dispatch(actions.setCustomBackgroundWallPaper(currentBackgroundImage?.value?.src))
        }
    }

    const isSupported = () =>
        'Notification' in window &&
        'serviceWorker' in navigator &&
        'PushManager' in window

    const handleStartTime = async () => {
        if (isSupported()) {
            if (Notification.permission !== 'granted') {
                Notification.requestPermission().then((permission) => {
                    if (permission === 'granted') {
                        // Quyền đã được cấp, bạn có thể sử dụng Notification API
                        dispatch(actions.setPermissionNoti(true))
                    }
                });
            }
        }
        isStart.current = true
        setStart(true);
        dispatch(actions.setTimeRunning(true))
        if (isStart.current === true) {
            if (workerRef.current) {
                workerRef.current.postMessage('startInterval');
            }
        }
        if (isDarkMode === true && isStart.current) {
            dispatch(actions.setCurrentCustomColor('black'))
            dispatch(actions.setCustomBackgroundWallPaper(''))
        }
    }

    useEffect(() => {
        if (start) {
            if (isDarkMode) {
                dispatch(actions.setCurrentCustomColor('black'))
                dispatch(actions.setCustomBackgroundWallPaper(''))
            }
            else {
                handleChangeCurrentTheme()
            }
        } else {
            if (currentBackgroundImage && currentBackgroundImage.name !== "None")
                dispatch(actions.setCustomBackgroundWallPaper(currentBackgroundImage?.value?.src))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [start, isDarkMode, dispatch])

    useEffect(() => {
        if (start) {
            setActiveCircle(true)
        } else {
            setActiveCircle(false)
        }
    }, [start])

    const handleChangeTime = (time: number) => {
        workerRef.current?.postMessage('stopInterval');
        if (isInteger(time)) {
            setMinutes(+time);
            setSecond(0)
        }
        else {
            setMinutes(Math.floor(time))
            const fl: any = time - Math.floor(time)
            const fl2: any = fl.toPrecision(2)
            const res: any = (fl2 * 60).toFixed(0)
            setSecond(+res)
        }
        if (!isAutoStartBreaks) {
            if (!isAutoStartPomo) {
                isStart.current = false
                dispatch(actions.setTimeRunning(false))
                setStart(false)
            }
        }
    }

    const handleChangeThemePomo = () => {
        if (start === true) {
            MySwal.fire({
                icon: "warning",
                title: 'Are you sure?',
                text: "The timer is still running, are you sure you want to switch?",
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes!',
                customClass: {
                    // container: "login-success"
                    popup: "wrapper-popup ",
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    workerRef.current?.postMessage('stopInterval');
                    setStart(false);
                    dispatch(actions.setTheme('pomo'));
                    dispatch(actions.setCurrentCustomColor(customColorHexPomo));
                    handleChangeTime(time)
                }
            })
        } else if (start === false) {
            dispatch(actions.setTheme('pomo'))
            dispatch(actions.setCurrentCustomColor(customColorHexPomo));
            handleChangeTime(time)
        }
    };

    const handleChangeThemeShort = () => {
        if (start === true) {
            MySwal.fire({
                icon: "warning",
                title: 'Are you sure?',
                text: "The timer is still running, are you sure you want to switch?",
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes!',
                customClass: {
                    // container: "login-success"
                    popup: "wrapper-popup ",
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    workerRef.current?.postMessage('stopInterval');
                    setStart(false);
                    dispatch(actions.setTheme('short'));
                    dispatch(actions.setCurrentCustomColor(customColorHexShort));
                    handleChangeTime(time)
                }
            })
        } else if (start === false) {
            dispatch(actions.setTheme('short'))
            dispatch(actions.setCurrentCustomColor(customColorHexShort));
            handleChangeTime(time)
        }
    };
    const handleChangeThemeLong = () => {
        if (start === true) {
            MySwal.fire({
                icon: "warning",
                title: 'Are you sure?',
                text: "The timer is still running, are you sure you want to switch?",
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes!',
                customClass: {
                    // container: "login-success"
                    popup: "wrapper-popup ",
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    workerRef.current?.postMessage('stopInterval');
                    setStart(false);
                    dispatch(actions.setTheme('long'));
                    dispatch(actions.setCurrentCustomColor(customColorHexLong));
                    handleChangeTime(time)
                }
            })
        } else if (start === false) {
            dispatch(actions.setTheme('long'))
            dispatch(actions.setCurrentCustomColor(customColorHexLong));
            handleChangeTime(time)
        }
    };

    const handleClickStop = () => {
        workerRef.current?.postMessage('stopInterval');
        setStart(false);
        dispatch(actions.setTimeRunning(false))
        handleChangeCurrentTheme()
    };
    const updateCurrentTask = () => {
        if (currentTheme === "pomo") {
            if (currentTask?.id) {
                const numActCurrentTaskNew = +(+currentTask?.numAct + 1)
                let newCurrentTask: any
                let tempTodos: any
                let oldCurrentTask: any
                if (numActCurrentTaskNew >= currentTask?.estPomo) {
                    oldCurrentTask = {
                        ...currentTask,
                        activePomo: false,
                        isDone: true,
                        numAct: numActCurrentTaskNew
                    }
                    let newTaskId: any
                    let newTask: any
                    todos.forEach((item: any, index: number) => {
                        if (item.id === oldCurrentTask.id) {
                            newTask = todos.find((todo: any, index2: number) => {
                                if (index2 > index) {
                                    if (todo.isDone === false) {
                                        return todo
                                    }
                                }
                            })
                        }
                    })
                    newTaskId = newTask?.id
                    if (newTaskId) {
                        tempTodos = todos.map((item: any) => {
                            if (item.id === oldCurrentTask.id) {
                                item.numAct = numActCurrentTaskNew,
                                    item.activePomo = false,
                                    item.isDone = true
                            }
                            if (item.id === newTaskId) {
                                item.activePomo = true
                            }
                            return item
                        })
                        newCurrentTask = tempTodos.find((item: any) => {
                            return item.id === newTaskId
                        })
                        if (user?.access_token) {
                            const dataNewCurrentTask = {
                                "taskId": newCurrentTask?.id,
                                "projectId": newCurrentTask?.project?.projectId,
                                "taskName": newCurrentTask?.title,
                                "estimatePomodoro": newCurrentTask?.estPomo,
                                "note": newCurrentTask?.note,
                                "projectName": newCurrentTask?.project?.projectName,
                                "actualPomodoro": newCurrentTask?.numAct,
                                "status": newCurrentTask?.isDone === false ? "DOING" : "DONE",
                            }
                            axios
                                .patch('/apiDetail/task', dataNewCurrentTask, {
                                    headers: {
                                        'authorization': `Bearer ${user?.access_token}`
                                    }
                                })
                                .then(res => {
                                    dispatch(actions.setNewTodo(tempTodos))
                                    dispatch(actions.setCurrentTask(newCurrentTask))
                                })
                                .catch(err => {
                                    console.log('error in request', err.response?.data?.message);
                                });
                            const dataOldCurrentTask = {
                                "taskId": oldCurrentTask?.id,
                                "projectId": oldCurrentTask?.project?.projectId,
                                "taskName": oldCurrentTask?.title,
                                "estimatePomodoro": oldCurrentTask?.estPomo,
                                "note": oldCurrentTask?.note,
                                "projectName": oldCurrentTask?.project?.projectName,
                                "actualPomodoro": oldCurrentTask?.numAct,
                                "status": "DONE",
                            }
                            axios
                                .patch('/apiDetail/task', dataOldCurrentTask, {
                                    headers: {
                                        'authorization': `Bearer ${user?.access_token}`
                                    }
                                })
                                .then(res => {
                                })
                                .catch(err => {
                                    console.log('error in request', err.response?.data?.message);
                                });
                        } else {
                            dispatch(actions.setNewTodo(tempTodos))
                            dispatch(actions.setCurrentTask(newCurrentTask))
                        }
                    } else {
                        const dataCurrentTask: any = {
                            "taskId": oldCurrentTask?.id,
                            "projectId": oldCurrentTask?.project?.projectId,
                            "taskName": oldCurrentTask?.title,
                            "estimatePomodoro": oldCurrentTask?.estPomo,
                            "note": oldCurrentTask?.note,
                            "projectName": oldCurrentTask?.project?.projectName,
                            "actualPomodoro": oldCurrentTask?.numAct,
                            "status": "DONE",
                        }
                        tempTodos = todos.map((item: any) => {
                            if (item.id === +dataCurrentTask.taskId) {
                                item.numAct = +dataCurrentTask.actualPomodoro
                                item.isDone = true,
                                    item.activePomo = false
                            }
                            return item
                        })
                        if (user?.access_token) {
                            axios
                                .patch('/apiDetail/task', dataCurrentTask, {
                                    headers: {
                                        'authorization': `Bearer ${user?.access_token}`
                                    }
                                })
                                .then(res => {
                                    dispatch(actions.setNewTodo(tempTodos))
                                    dispatch(actions.setCurrentTask(null))
                                })
                                .catch(err => {
                                    console.log('error in request', err.response?.data?.message);
                                });
                        } else {
                            dispatch(actions.setNewTodo(tempTodos))
                            dispatch(actions.setCurrentTask(null))
                        }
                    }
                }
                else {
                    newCurrentTask = {
                        ...currentTask,
                        numAct: numActCurrentTaskNew
                    }
                    tempTodos = todos.map((item: any) => {
                        if (item.id === newCurrentTask.id) {
                            item.numAct = newCurrentTask.numAct
                        }
                        return item
                    })
                    if (user?.access_token) {
                        const dataNewCurrentTask = {
                            "taskId": newCurrentTask?.id,
                            "projectId": newCurrentTask?.project?.projectId,
                            "taskName": newCurrentTask?.title,
                            "estimatePomodoro": newCurrentTask?.estPomo,
                            "note": newCurrentTask?.note,
                            "projectName": newCurrentTask?.project?.projectName,
                            "actualPomodoro": newCurrentTask?.numAct,
                            "status": "DOING",
                        }
                        axios
                            .patch('/apiDetail/task', dataNewCurrentTask, {
                                headers: {
                                    'authorization': `Bearer ${user?.access_token}`
                                }
                            })
                            .then(res => {
                                dispatch(actions.setNewTodo(tempTodos))
                                dispatch(actions.setCurrentTask(newCurrentTask))
                            })
                            .catch(err => {
                                console.log('error in request', err.response?.data?.message);
                            });
                    } else {
                        dispatch(actions.setNewTodo(tempTodos))
                        dispatch(actions.setCurrentTask(newCurrentTask))
                    }
                }
            }
        }
    }

    const handleClickNext = () => {
        MySwal.fire({
            icon: "warning",
            title: 'Are you sure?',
            text: "Are you sure you want to finish the round early? (The remaining time will not be counted in the report.)",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!',
            customClass: {
                popup: "wrapper-popup",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                updateCurrentTask()
                workerRef.current?.postMessage('stopInterval');
                setStart(false);
                handleChangeTime(time)
                if (currentTheme === 'pomo') {
                    dispatch(actions.setNumPomo(numPomo + 1));
                    if (longInterval === longBreakInterval) {
                        if (isAutoStartBreaks) {
                            handleStartTime()
                        }
                        dispatch(actions.setTheme('long'));
                        dispatch(actions.setCurrentCustomColor(customColorHexLong));
                        setLongInterval(1)
                    }
                    else {
                        if (isAutoStartBreaks) {
                            handleStartTime()
                        }
                        dispatch(actions.setTheme('short'));
                        dispatch(actions.setCurrentCustomColor(customColorHexShort));
                        setLongInterval(longInterval + 1)
                    }
                } else if (currentTheme === 'short') {
                    dispatch(actions.setTheme('pomo'));
                    dispatch(actions.setCurrentCustomColor(customColorHexPomo));
                    if (isAutoStartPomo) {
                        handleStartTime()
                    }
                } else if (currentTheme === 'long') {
                    dispatch(actions.setTheme('pomo'));
                    dispatch(actions.setCurrentCustomColor(customColorHexPomo));
                    if (isAutoStartPomo) {
                        handleStartTime()
                    }
                    dispatch(actions.setNumPomo(numPomo + 1));
                }
            } else {
                setStart(true);
            }
        })
    };

    const showNotification = () => {
        if (isSupported()) {
            if (Notification.permission === 'granted') {
                navigator.serviceWorker.ready.then((registration) => {
                    // Gửi một thông báo push
                    registration.showNotification('Time is up!', {
                        body: 'Your timer has finished.',
                    });
                    // Phát âm thanh
                });
            }
        }
        setShowAlarm(true)
        dispatch(actions.setShowAlarmReducer(true))
    };
    useEffect(() => {
        if (start === true) {
            if (second === 0) {
                setMinutes((pre: any) => pre - 1);
                setSecond(59);
            }
        }
        if (minutes === 0 && second === 0) {
            if (isTimeRunning) {
                updateCurrentTask()
            }
            if (isCloseSetting) {
                showNotification()
                // setShowAlarm(true)
            }
            workerRef.current?.postMessage('stopInterval');
            setSecond(0);
            handleChangeTime(time)
            if (start === true) {
                if (currentTheme === 'pomo') {
                    dispatch(actions.setNumPomo(numPomo + 1));
                    if (longInterval === longBreakInterval) {
                        if (isAutoStartBreaks) {
                            handleStartTime()
                        }
                        else {
                            setStart(false)
                        }
                        dispatch(actions.setTheme('long'));
                        dispatch(actions.setCurrentCustomColor(customColorHexLong));
                        setLongInterval(1)
                    }
                    else {
                        if (isAutoStartBreaks) {
                            handleStartTime()
                        }
                        else {
                            setStart(false)
                        }
                        dispatch(actions.setTheme('short'));
                        dispatch(actions.setCurrentCustomColor(customColorHexShort));
                        setLongInterval(longInterval + 1)
                    }
                } else if (currentTheme === 'short' || currentTheme === 'long') {
                    dispatch(actions.setTheme('pomo'));
                    dispatch(actions.setCurrentCustomColor(customColorHexPomo));
                    if (isAutoStartPomo) {
                        handleStartTime()
                    }
                    else {
                        setStart(false)
                    }
                    if (currentTheme === 'long') {
                        dispatch(actions.setNumPomo(numPomo + 1));
                    }
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [second, start, minutes, time, currentTheme, dispatch, numPomo, longInterval,
        longBreakInterval, isAutoStartBreaks, isAutoStartPomo, isCloseSetting]);

    useEffect(() => {
        handleChangeTime(time)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [time]);

    useEffect(() => {
        if (!start) {
            isStart.current = false
            dispatch(actions.setTimeRunning(false))
        } else {
            if (isAutoStartBreaks && currentTheme === "short" ||
                isAutoStartBreaks && currentTheme === "long" ||
                isAutoStartPomo && currentTheme == "pomo") {
                workerRef.current?.postMessage('stopInterval');
                workerRef.current?.postMessage('startInterval');
            }
        }
    }, [start, currentTheme, isAutoStartBreaks, isAutoStartPomo])

    const handlePlayAlarm = async () => {
        const num: number = +(durationAlarm.current)
        setTimeout(() => {
            setShowAlarm(false)
            dispatch(actions.setShowAlarmReducer(false))
        }, num * 1000 * repeatAlarmSound)
    }
    const handleLoadMetadataAlarm = async (meta: any) => {
        const { duration } = meta.target;
        durationAlarm.current = Math.floor(duration)
    }
    useEffect(() => {
        (isDarkMode && start === true) ? setColorBackground('black') : setColorBackground(pomoBackground)
    }, [start, customBackgroundWallpaper])

    useEffect(() => {
        setShowAlarm(isShowAlarmReducer)
    }, [isShowAlarmReducer])

    useEffect(() => {
        workerRef.current = new Worker(new URL('../../../../worker.ts', import.meta.url), { type: 'module' })
        workerRef.current.addEventListener('message', (event) => {
            if (event.data === 'updateSecond') {
                if (isStart.current) {
                    setSecond((prev) => prev - 1);
                }
            }
        });
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                // .register(new URL('../../../utils/worker.ts', import.meta.url), { type: 'module' })
                .register(new URL('../../../../worker.ts', import.meta.url), { type: 'module' })
                .then(registration => {
                    // console.log('Service Worker registered with scope:', registration.scope);
                })
                .catch(error => {
                    console.error('Service Worker registration failed:', error);
                });
        }
        return () => {
            workerRef.current?.postMessage('stopInterval'); // Dừng interval khi component bị hủy
            workerRef.current?.terminate();
        };
    }, [])

    return (
        <>
            <Head>
                {
                    start ?
                        <title>{minutes < 10 ? `0${minutes}` : minutes}:{second < 10 ? `0${second}` : second} - {(currentTask?.id && currentTheme === 'pomo') ? currentTask?.title : currentTheme !== 'pomo' ? "Time to break!" : "Time to focus!"}</title>
                        : <title>Pomodoro</title>
                }
            </Head>
            <div className={cx('pomodoro')} style={{ 'background': (isDarkMode && isStart.current) ? "black" : pomoBackground }}>
                {
                    showAlarm &&
                    <ReactAudioPlayer
                        src={alarmSound?.source}
                        autoPlay
                        volume={volumeAlarmSound / 100}
                        onPlay={handlePlayAlarm}
                        onLoadedMetadata={handleLoadMetadataAlarm}
                        loop={true}
                    />
                }
                <div className={cx('pomo-animation')}>
                    <Image src={images.clock2} width={350} height={300} alt="pomodoro-animation" />
                    <CountdownCircle active={activeCircle} />
                </div>
                <div className={cx('pomo-main')} >
                    <div className={cx('status')} style={{
                        visibility: `${visibilityDarkMode}`,
                    }}>
                        <Button
                            size='middle'
                            className={cx(currentTheme === 'pomo' ? currentTheme : '', { [SofiaProLight.className]: true })}
                            onClick={handleChangeThemePomo}
                        >
                            Pomodoro
                        </Button>
                        <Button
                            size='middle'
                            className={cx(currentTheme === 'short' ? currentTheme : '', { [SofiaProLight.className]: true })}
                            onClick={handleChangeThemeShort}
                        >
                            Short Break
                        </Button>
                        <Button
                            size='middle'
                            className={cx(currentTheme === 'long' ? currentTheme : '', { [SofiaProLight.className]: true })}
                            onClick={handleChangeThemeLong}
                        >
                            Long Break
                        </Button>
                    </div>
                    <div className={cx('timer')}>
                        <div className={cx(`timer-string ${IntegralCFHeavy.className}`)}>
                            {minutes < 10 ? `0${minutes}` : minutes}:{second < 10 ? `0${second}` : second}
                        </div>
                    </div>

                    <div className={cx('start')}>
                        {start === false ? (
                            <Button className={cx(`btn-start ${SofiaProBold.className}`)} size='large' onClick={handleStartTime}>
                                Start
                            </Button>
                        ) : (
                            <>
                                <Button className={cx(`btn-stop ${SofiaProBold.className}`)} size='large' onClick={handleClickStop}>
                                    Stop
                                </Button>
                                <div className={cx('btn-next')}>
                                    <button className={cx('btn-icon-next')} onClick={handleClickNext}>
                                        <Image src={images.next} alt="Next" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                {/* version 2 */}
            </div>


            <div className={cx('task-home-wrapper')}>
                <div className={cx('num-task')}>Current task:</div>
                {
                    !currentTask?.id && <div style={{ fontStyle: "italic", fontSize: "1.4rem", opacity: "0.8" }}>No task</div>
                }
                <div className={cx('name-task', [roboto.className])}>{currentTask?.title}</div>
            </div>
        </>
    );
}

export default Pomodoro;
