import classNames from 'classnames/bind';
import { FC, useEffect, useRef, useState, memo } from 'react';
import { Button } from 'antd';
import CreatableSelect from 'react-select/creatable';
import Select, { StylesConfig, components, GroupHeadingProps, GroupProps } from 'react-select';
import uniqid from 'uniqid';
import useStore from '@/hooks/useStore';
import { actions } from '@/store';
import styles from './AddTask.module.scss';
import Number from '../Number';
import { setProject } from '@/store/actions';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { Roboto } from 'next/font/google'

const roboto = Roboto({
    weight: ['400', '700'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
    display: 'swap',
})

const cx = classNames.bind(styles);

interface AddTaskProps {
    isAddTask?: boolean,
    titleTask?: string,
    numActTask?: number,
    estPomoTask?: number,
    noteTask?: string,
    projectTask?: any,
    numEstTask?: number,
    isDoneTask?: boolean,
    onSave?: any,
    idDetailTask?: any,
    isSave?: any,
    isSaveAddTask?: boolean
}
const AddTask: FC<AddTaskProps> = ({ ...props }) => {
    const { isAddTask, titleTask, noteTask, projectTask, numActTask = 0, numEstTask = 1,
        onSave, isSave, idDetailTask, isDoneTask, isSaveAddTask } = props

    const [state, dispatch] = useStore();
    const { todoInput, note, estPomoInput, project, projectList, user, version } = state;


    const colourStyles: StylesConfig<any> = {
        control: (styles) => ({
            ...styles, backgroundColor: 'white', boxShadow: `rgba(0, 0, 0, 0.15) 0px 10px 20px
        rgba(0, 0, 0, 0.1) 0px 3px 6px`
        }),
        option: (styles, { }) => {
            return {
                ...styles,
                backgroundColor: 'white',
                color: "black",
                zIndex: "99999",
                ':hover': {
                    ...styles[':hover'],
                    backgroundColor: `rgb(240, 240, 240)`
                },
                // ':first-child': {
                //     color: `rgba(0,0,0,0.5)`
                // }
            };
        },
        singleValue: (styles) => ({ ...styles, color: 'rgba(0,0,0,0.5)' }),
        groupHeading: (base) => ({
            ...base,
            flex: '1 1',
            color: 'red',
            margin: 0,
        }),
    };

    const [showNote, setShowNote] = useState(false);
    const [showProject, setShowProject] = useState(false);
    const [estPomodo, setEstPomodo] = useState<number>(estPomoInput);
    const [titleAddTask, setTitleAddTask] = useState(titleTask)
    const [noteAddTask, setNoteAddTask] = useState(noteTask)
    const [projectAddTask, setProjectAddTask] = useState<any>(() => {
        if (projectTask) {
            return {
                label: projectTask?.projectName,
                value: projectTask?.projectId
            }
        }
        else return null
    })
    const [numActAddTask, setNumActAddTask] = useState<number>(numActTask)
    const [numEstAddTask, setNumEstAddTask] = useState<number>(numEstTask)

    const [isLoading, setIsLoading] = useState(false);
    const [projectSelected, setProjectSelected] = useState<any>(() => {
        if (project?.projectId) {
            return {
                label: project?.projectName,
                value: project?.projectId
            }
        }
        else return null
    }
    );
    useEffect(() => {
        onSave && isSave && onSave(idDetailTask, titleAddTask, numActAddTask,
            numEstAddTask, noteAddTask, { projectId: projectSelected?.value, projectName: projectSelected?.label }, isDoneTask)
    }, [idDetailTask, isDoneTask, isSave, noteAddTask, numActAddTask, numEstAddTask, onSave,
        projectSelected, titleAddTask])

    const createOption = (projectName: string) => ({
        projectId: uniqid(),
        projectName: projectName,
    });

    const handleCreate = (inputValue: string) => {
        setIsLoading(true);
        setTimeout(() => {
            const newOption = createOption(inputValue);
            setIsLoading(false);
            const newProjectList = [...projectList, newOption]
            if (user?.access_token) {
                axios
                    .post('/apiProject/createProject', {
                        "projectName": inputValue,
                    }, {
                        headers: {
                            'authorization': `Bearer ${user?.access_token}`
                        }
                    })
                    .then(res => {
                        dispatch(actions.setAddProjectSuccess(true))
                        dispatch(actions.setProjectList(newProjectList))
                        setProjectSelected({
                            label: newOption?.projectName,
                            value: newOption?.projectId,
                        })
                        setProjectAddTask({
                            label: newOption?.projectName,
                            value: newOption?.projectId,
                        })
                    })
                    .catch(err => {
                        console.log('error in request', err.response?.data?.message);
                    });
            }
        }, 500);
    };

    const handleChangeInput = (value: any) => {
        dispatch(actions.setTodoInput(value));
    };

    const handleUpEst = () => {
        if (estPomodo >= 1) {
            let num: number
            if (typeof (estPomodo) === 'string') {
                num = parseInt(estPomodo, 10) + 1
                setEstPomodo(num);
            }
            else {
                setEstPomodo(estPomodo + 1);
            }
        } else if (estPomodo < 1) {
            const num: number = +((estPomodo + 0.1).toPrecision(1))
            setEstPomodo(num);
        }
    };

    const handleUpActAddTask = () => {
        if (numActAddTask >= 1) {
            let num: number
            if (typeof (numActAddTask) === 'string') {
                num = parseInt(numActAddTask, 10) + 1
                setNumActAddTask(num);
            }
            else {
                setNumActAddTask(numActAddTask + 1);
            }
        } else if (numActAddTask < 1) {
            const num: number = +((+numActAddTask + 0.1).toPrecision(1))
            setNumActAddTask(num);
        }
    };

    const handleUpEstAddTask = () => {
        if (numEstAddTask >= 1) {
            let num: number
            if (typeof (numEstAddTask) === 'string') {
                num = parseInt(numEstAddTask, 10) + 1
                setNumEstAddTask(num);
            }
            else {
                setNumEstAddTask(numEstAddTask + 1);
            }
        } else if (numEstAddTask < 1) {
            const num: number = +((numEstAddTask + 0.1).toPrecision(1))
            setNumActAddTask(num);
        }
    };

    const handleDownEst = () => {
        if (estPomodo > 1) {
            setEstPomodo(estPomodo - 1);
        } else if (estPomodo <= 1 && estPomodo >= 0.1) {
            const num: number = +((estPomodo - 0.1).toPrecision(1))
            setEstPomodo(num);
        }
        if (estPomodo > 0 && estPomodo < 0.2) setEstPomodo(0);
    };

    const handleDownActAddTask = () => {
        if (numActAddTask > 1) {
            setNumActAddTask(numActAddTask - 1);
        } else if (numActAddTask <= 1 && numActAddTask >= 0.1) {
            const num: number = +((numActAddTask - 0.1).toPrecision(1))
            setNumActAddTask(num);
        }
        if (numActAddTask > 0 && numActAddTask < 0.2) setNumActAddTask(0);
    };

    const handleDownEstAddTask = () => {
        if (numEstAddTask > 1) {
            setNumEstAddTask(numEstAddTask - 1);
        } else if (numEstAddTask <= 1 && numEstAddTask >= 0.1) {
            const num: number = +((numEstAddTask - 0.1).toPrecision(1))
            setNumEstAddTask(num);
        }
        if (numEstAddTask > 0 && numEstAddTask < 0.2) setNumEstAddTask(0);
    };

    const handleChangeNote = (value: any) => {
        dispatch(actions.setValueNote(value));
    };

    const handleChangeProjectName = (value: any) => {
        dispatch(actions.setProject(value));
    };

    const handleChangeNoteAddTask = (e: any) => {
        setNoteAddTask(e.target.value)
    };

    const handleChangeProjectAddTask = (e: any) => {
        setProjectAddTask(e.target.value)
    };

    const handleChangeEstPomo = (e: any) => {
        let num = e.target.value
        if (num > 1) {
            num = Math.floor(num)
        }
        setEstPomodo(num)
    }

    const handleChangeEstAddTask = (e: any) => {
        let num = e.target.value
        if (num > 1) {
            num = Math.floor(num)
        }
        setNumEstAddTask(num)
    }

    const handleChangActAddTask = (e: any) => {
        let num = e.target.value
        if (num > 1) {
            num = Math.floor(num)
        }
        setNumActAddTask(num)
    }

    const handleChangeTitleAddTask = (e: any) => {
        setTitleAddTask(e.target.value)
    }

    useEffect(() => {
        dispatch(actions.setEstInput(+estPomodo));
    }, [dispatch, estPomodo])

    useEffect(() => {
        setEstPomodo(estPomoInput)
    }, [estPomoInput])

    useEffect(() => {
        (noteAddTask) && setShowNote(true)
    }, [noteAddTask])

    useEffect(() => {
        (projectAddTask) && setShowProject(true)
    }, [projectAddTask])
    const iconStyles = {
        cursor: 'pointer',
        display: 'flex',
        width: '20px',
        height: '20px',
        fontSize: '2rem',
        color: `rgba(0, 0, 0, 0.349)`,
        ':hover': {
            color: 'black'
        }
    };
    const GroupHeading = (
        props: GroupHeadingProps
    ) => (
        <div>
            <components.GroupHeading {...props} />
            <div style={iconStyles}>
                <FontAwesomeIcon icon={faXmark} />
            </div>
        </div>
    );
    const groupStyles = {
        border: `2px dotted red`,
        borderRadius: '5px',
        background: '#f2fcff',
    };

    const Group = (props: GroupProps) => (
        <div style={groupStyles}>
            <components.Group {...props} />
        </div>
    );

    return (
        <div className={cx('add-todo-heading')}>
            <div className={cx('input')}>
                {
                    !isAddTask ?
                        <input
                            value={titleAddTask}
                            placeholder="What are you working on?"
                            onChange={handleChangeTitleAddTask}
                            className={roboto.className}
                        /> :
                        <input
                            value={todoInput}
                            placeholder="What are you working on?"
                            onChange={(e) => handleChangeInput(e.target.value)}
                            className={roboto.className}
                        />
                }
            </div>
            <div className={cx('est-pomo')}>
                <div className={cx('est-title')}>
                    {
                        !isAddTask ? <div>Act / </div> : null
                    }
                    &nbsp;Est pomodoros
                </div>
                <div className={cx('est-input')}>
                    {
                        !isAddTask ?
                            <>
                                <Number isHorizontal={false} value={numActAddTask} onChangeInput={handleChangActAddTask}
                                    onChangeButtonUp={handleUpActAddTask} onChangeButtonDown={handleDownActAddTask} />
                                <div className={cx('est-separate')}>/</div>
                                <Number isHorizontal={true} value={numEstAddTask} onChangeInput={handleChangeEstAddTask}
                                    onChangeButtonUp={handleUpEstAddTask} onChangeButtonDown={handleDownEstAddTask} />
                            </> :
                            <>
                                <Number isHorizontal={true} value={estPomodo} onChangeInput={handleChangeEstPomo}
                                    onChangeButtonUp={handleUpEst} onChangeButtonDown={handleDownEst} />
                            </>
                    }
                </div>
            </div>
            <div className={cx('action-note-project')}>
                {
                    (!isAddTask && noteAddTask) ?
                        <div className={cx('show-note')}>
                            <textarea
                                autoFocus
                                className={cx('add-note', [roboto.className])}
                                placeholder="Some notes..."
                                value={noteAddTask}
                                onChange={handleChangeNoteAddTask}
                            ></textarea>
                        </div> :
                        <>
                            {showNote ? (
                                <div className={cx('show-note')}>
                                    {
                                        !isAddTask ?
                                            <textarea
                                                autoFocus
                                                className={cx('add-note', [roboto.className])}
                                                placeholder="Some notes..."
                                                value={noteAddTask}
                                                onChange={handleChangeNoteAddTask}
                                            ></textarea> :
                                            <textarea
                                                autoFocus
                                                className={cx('add-note', [roboto.className])}
                                                placeholder="Some notes..."
                                                value={note}
                                                onChange={(e) => handleChangeNote(e.target.value)}
                                            ></textarea>
                                    }
                                </div>
                            ) : (
                                <Button size="middle" onClick={() => {
                                    setShowNote(true)
                                }}>
                                    + Add note
                                </Button>
                            )}
                        </>
                }
                {
                    // (!isAddTask && projectAddTask) ?
                    //     <div className={cx('show-note')}>
                    //         {/* <SelectCustom projectTask={projectTask}
                    //             onSetProjectSelected={setProjectSelected} onSetProjectAddTask={setProjectAddTask}
                    //             projectAddTask={projectAddTask} handleCreate={handleCreate} /> */}
                    //         <Select
                    //             isClearable
                    //             isDisabled={isLoading}
                    //             isLoading={isLoading}
                    //             onChange={(newValue) => {
                    //                 setProjectSelected(newValue)
                    //                 setProjectAddTask(newValue)
                    //                 dispatch(actions.setProject({
                    //                     projectId: newValue?.value,
                    //                     projectName: newValue?.label,
                    //                 }))
                    //             }}
                    //             // onCreateOption={handleCreate}
                    //             options={projectList && projectList.map((item: any) => {
                    //                 return {
                    //                     label: item?.projectName,
                    //                     value: item?.projectId,
                    //                 }
                    //             })}
                    //             value={projectAddTask}
                    //             styles={colourStyles}
                    //             placeholder="Select or create project..."
                    //         />
                    //     </div> :
                    //     <>
                    //         {showProject ? (
                    //             <div className={cx('show-note')}>
                    //                 {
                    //                     !isAddTask ?
                    //                         <>
                    //                             {/* <SelectCustom projectTask={projectTask}
                    //                                 onSetProjectSelected={setProjectSelected} onSetProjectAddTask={setProjectAddTask}
                    //                                 projectAddTask={projectAddTask} handleCreate={handleCreate} /> */}
                    //                             <Select
                    //                                 isClearable
                    //                                 isDisabled={isLoading}
                    //                                 isLoading={isLoading}
                    //                                 onChange={(newValue) => {
                    //                                     setProjectSelected(newValue)
                    //                                     setProjectAddTask(newValue)
                    //                                     dispatch(actions.setProject({
                    //                                         projectId: newValue?.value,
                    //                                         projectName: newValue?.label,
                    //                                     }))
                    //                                 }}
                    //                                 // onCreateOption={handleCreate}
                    //                                 options={projectList && projectList.map((item: any) => {
                    //                                     return {
                    //                                         label: item?.projectName,
                    //                                         value: item?.projectId,
                    //                                     }
                    //                                 })}
                    //                                 value={projectAddTask}
                    //                                 styles={colourStyles}
                    //                                 placeholder="Select or create project..."
                    //                             />
                    //                         </>
                    //                         :
                    //                         <>
                    //                             {/* <SelectCustom projectSelected={projectSelected}
                    //                                 onSetProjectSelected={setProjectSelected}
                    //                                 handleCreate={handleCreate} /> */}
                    //                             <Select
                    //                                 isClearable
                    //                                 isDisabled={isLoading}
                    //                                 isLoading={isLoading}
                    //                                 onChange={(newValue) => {
                    //                                     setProjectSelected(newValue)
                    //                                     dispatch(actions.setProject({
                    //                                         projectId: newValue?.value,
                    //                                         projectName: newValue?.label,
                    //                                     }))
                    //                                 }}
                    //                                 // onCreateOption={handleCreate}
                    //                                 options={projectList && projectList.map((item: any) => {
                    //                                     return {
                    //                                         label: item?.projectName,
                    //                                         value: item?.projectId,
                    //                                     }
                    //                                 })}
                    //                                 value={projectSelected}
                    //                                 styles={colourStyles}
                    //                                 placeholder="Select or create project..."
                    //                             />
                    //                         </>
                    //                 }
                    //             </div>
                    //         ) : (
                    //             <>
                    //                 {/* {
                    //                     user?.access_token &&
                    //                     <Button size="middle" onClick={() => {
                    //                         setShowProject(true)
                    //                     }}>
                    //                         + Add project
                    //                     </Button>
                    //                 } */}
                    //             </>
                    //         )}
                    //     </>
                }
            </div>
        </div>
    );
}

export default AddTask;
