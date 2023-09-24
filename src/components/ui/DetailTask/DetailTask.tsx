import React, { FC, useEffect, useState } from "react";
import AddTask from "../AddTask";
import { Button } from "antd";
import classNames from 'classnames/bind';
import styles from './DetailTask.module.scss'
import useStore from "@/hooks/useStore";
import { actions } from '@/store';
import axios from "axios";
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import 'sweetalert2/dist/sweetalert2.css'
import withReactContent from 'sweetalert2-react-content';
const cx = classNames.bind(styles);

export interface DetailTaskProps {
    isAddTask?: boolean,
    idTask?: any,
    titleTask?: string,
    noteTask?: string,
    projectTask?: any,
    isDoneTask?: boolean,
    numActTask?: number,
    numEstTask?: number,
    onSetIdDetailTask?: any,
    onClickCancleAddTask?: any
}
const DetailTask: FC<DetailTaskProps> = ({ ...props }) => {
    const [state, dispatch] = useStore();
    const { todos, todoInput, estPomoInput, note, project, user, currentTask,
        isUserConfirmAddTask, countTask } = state;
    const { onSetIdDetailTask, isAddTask, idTask, titleTask, noteTask, projectTask, numActTask,
        numEstTask, isDoneTask, onClickCancleAddTask } = props
    const [isSave, setIsSave] = useState(false)
    const [isSaveAddTask, setIsSaveAddATask] = useState(false)
    const MySwal = withReactContent(Swal)
    const handleSaveEditAddTask = async (id: any, title: string, numAct: number, estPomo: number,
        note: string, project: any, isDone: boolean) => {
        setIsSave(true)
        const newTodos = [...todos]
        newTodos.forEach((item: any) => {
            if (item.id === id) {
                item.title = title
                item.numAct = +numAct
                item.estPomo = estPomo
                item.note = note
                item.project = project
                item.isDone = isDone
            }
        })
        if (currentTask.id === id) {
            const newCurrentTask = newTodos.find((item: any) => item.id === id)
            dispatch(actions.setCurrentTask(newCurrentTask))
        }
        if (user?.access_token) {
            const dataUpdateHaveProject = {
                "taskId": id,
                "projectId": project?.projectId,
                "projectName": project?.projectName,
                "taskName": title,
                "estimatePomodoro": estPomo,
                "note": note,
                "actualPomodoro": numAct
            }
            const dataUpdateNoneProject = {
                "taskId": id
            }
            axios
                .patch('/apiDetail/task', project?.projectId ? dataUpdateHaveProject : dataUpdateNoneProject, {
                    headers: {
                        'authorization': `Bearer ${user?.access_token}`
                    }
                })
                .then(res => {
                    dispatch(actions.setNewTodo(newTodos))
                    onSetIdDetailTask(-999999999)
                })
                .catch(err => {
                    console.log('error in request', err.response?.data?.message);
                });
        }
        else {
            dispatch(actions.setNewTodo(newTodos))
            onSetIdDetailTask(-999999999)
        }
    }

    const handleDeleteTask = (id: any) => {
        const newTodos = todos.filter((item: any) => {
            return item.id !== id
        })
        if (user?.access_token) {
            axios
                .delete('/apiDetail/task', {
                    headers: {
                        'authorization': `Bearer ${user?.access_token}`
                    },
                    data: {
                        "taskId": id,
                    }
                })
                .then(res => {
                    dispatch(actions.setNewTodo(newTodos))
                    if (currentTask?.id === id) {
                        dispatch(actions.setCurrentTask({}))
                    }
                })
                .catch(err => {
                    console.log('error in request', err.response?.data?.message);
                });
        } else {
            dispatch(actions.setNewTodo(newTodos))
            if (currentTask?.id === id) {
                dispatch(actions.setCurrentTask({}))
            }
        }
    }

    const handleCancelEditTask = (id: any) => {
        onSetIdDetailTask(-999999999)
    }
    const handleSaveTodo = async () => {
        if (!todoInput) {
            return;
        }
        if (user?.access_token) {
            if (user?.isPremium === 1) {
                if (!project || !project.projectId) {
                    axios
                        .post('/apiDetail/task?project=false', {
                            "taskName": todoInput,
                            "estimatePomodoro": estPomoInput,
                            "note": note,
                        }, {
                            headers: {
                                'authorization': `Bearer ${user?.access_token}`
                            }
                        })
                        .then(res => {
                            dispatch(actions.setCountTask(countTask + 1))
                        })
                        .catch(err => {
                            console.log('error in request', err.response?.data?.message);
                        });
                } else {
                    if (project?.projectId !== 0) {
                        const data = {
                            "project":
                            {
                                "userId": user?.userId,
                                "projectId": project?.projectId,
                                "projectName": project?.projectName
                            },
                            "task":
                            {
                                "taskName": todoInput,
                                "estimatePomodoro": estPomoInput,
                                "note": note,
                            }
                        }
                        axios
                            .post('/apiDetail/task?project=true', data, {
                                headers: {
                                    'authorization': `Bearer ${user?.access_token}`
                                }
                            })
                            .then(res => {
                                dispatch(actions.setCountTask(countTask + 1))
                            })
                            .catch(err => {
                                console.log('error in request', err.response?.data?.message);
                            });
                    }
                }
            }
            else if (countTask >= 10) {
                dispatch(actions.setShowPremiumPlan(true))
            }
        }
        else {
            if (countTask >= 10) {
                dispatch(actions.setShowPremiumPlan(true))
            } else {
                if (!isUserConfirmAddTask) {
                    MySwal.fire({
                        title: 'Are you sure?',
                        text: "You are not logged in so the task will not be statistics, are you sure you want to create a task?",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, add it!',
                        customClass: {
                            popup: "modal-content pop-up-swal",
                            title: "login-sc-title",
                            htmlContainer: "login-des-text"
                        },
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const id = Math.floor(Math.random() * 1000001)
                            dispatch(actions.saveAddTodo({ id, todoInput, estPomo: estPomoInput, note }));
                            dispatch(actions.setUserConfirmAddTask(true))
                            dispatch(actions.setCountTask(countTask + 1))
                        }
                    })
                }
                else {
                    const id = Math.floor(Math.random() * 1000001)
                    dispatch(actions.saveAddTodo({ id, todoInput, estPomo: estPomoInput, note }));
                    dispatch(actions.setCountTask(countTask + 1))
                }
            }
        }
        dispatch(actions.setTodoInput(''));
        dispatch(actions.setValueNote(''));
        dispatch(actions.setEstInput(1));
        dispatch(actions.setAddTodoSuccess(true))
    }

    useEffect(() => {
        setIsSave(false)
    }, [isSave])

    return (
        <div className={cx('add-todo-input')}>
            {
                !isAddTask ?
                    <>
                        <AddTask idDetailTask={idTask} isAddTask={isAddTask} titleTask={titleTask}
                            noteTask={noteTask} projectTask={projectTask} numActTask={numActTask}
                            numEstTask={numEstTask} isDoneTask={isDoneTask} isSave={isSave}
                            onSave={handleSaveEditAddTask}
                        />
                        <div className={cx('action-save-close')}>
                            <Button
                                size='middle'
                                className={cx('action-close')}
                                onClick={() => handleDeleteTask(idTask)}
                            >
                                Delete
                            </Button>
                            <div className={cx('action-save-close-inner')}>
                                <Button
                                    size='middle'
                                    className={cx('action-close')}
                                    onClick={() => handleCancelEditTask(idTask)}
                                >
                                    Cancel
                                </Button>
                                <Button size='middle' className={cx('action-save')}
                                    onClick={() => setIsSave(true)}>
                                    Save
                                </Button>
                            </div>
                        </div>
                    </> :
                    <>
                        <AddTask isAddTask={true} isSaveAddTask={isSaveAddTask} />
                        <div className={cx('action-save-close2')}>
                            <div className={cx('action-save-close-inner')}>
                                <Button
                                    size='middle'
                                    className={cx('action-close')}
                                    onClick={onClickCancleAddTask}
                                >
                                    Cancel
                                </Button>
                                <Button size='middle' className={cx('action-save')}
                                    onClick={handleSaveTodo}>
                                    Save
                                </Button>
                            </div>
                        </div>
                    </>
            }
        </div>
    )
}
export default DetailTask