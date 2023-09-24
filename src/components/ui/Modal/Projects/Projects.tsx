import React, { FC, useEffect, useState } from "react"
import axios from 'axios';
import useStore from "@/hooks/useStore";
import { Button, Input, Space } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCheck, faFloppyDisk, faPenToSquare, faPencil, faTurnDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import { SofiaProRegular } from '@/utils/fonts';
import { actions } from "@/store";


export interface ProjectsProps {
    onCloseProjects?: any,
    onShowProjects?: any
}

const Projects: FC<ProjectsProps> = ({ ...props }) => {
    const { onCloseProjects, onShowProjects } = props
    const [state, dispatch] = useStore();
    const { user, projectList, version } = state
    const [data, setData] = useState<any>()
    const [nameProject, setNameProject] = useState<string>()
    const [isShowUpdate, setIsShowUpdate] = useState<boolean>(false)
    const [valueInputUpdate, setValueInputUpdate] = useState<string>()
    const [idEdit, setIdEdit] = useState()

    useEffect(() => {
        setData(projectList)
    }, [projectList])
    const handleDeleteProject = (id: any) => {
        const newProjectList = data.filter((item: any) => {
            return item.projectId !== id
        })
        if (user?.access_token) {
            axios
                .delete('/apiProject/deleteProject ', {
                    headers: {
                        'authorization': `Bearer ${user?.access_token}`
                    },
                    data: {
                        "projectId": id,
                    }
                })
                .then(res => {
                    dispatch(actions.setProjectList(newProjectList))
                })
                .catch(err => {
                    console.log('error in request', err.response?.data?.message);
                });
        }
    }
    const handleChangeInput = (e: any) => {
        const value = e.target.value
        setNameProject(value)
    }
    const handleAddProject = () => {
        if (user?.access_token) {
            axios
                .post('/apiProject/createProject', {
                    "projectName": nameProject,
                }, {
                    headers: {
                        'authorization': `Bearer ${user?.access_token}`
                    }
                })
                .then(res => {
                    setNameProject('')
                    dispatch(actions.setAddProjectSuccess(true))
                })
                .catch(err => {
                    console.log('error in request', err.response?.data?.message);
                });
        }
    }
    const handleEditProject = (id: any) => {
        setIsShowUpdate(true)
        setIdEdit(id)
        const itemEdit = data.find((item: any) => {
            return item.projectId === id
        })
        setValueInputUpdate(itemEdit?.projectName)
    }
    const handleSaveUpdateProject = (id: any) => {
        const newProjects = data.map((item: any) => {
            if (item.projectId === id) {
                item.projectName = valueInputUpdate
            }
            return item
        })
        if (user?.access_token) {
            axios
                .patch('/apiProject/updateProject', {
                    "projectId": id,
                    "projectName": valueInputUpdate,
                }, {
                    headers: {
                        'authorization': `Bearer ${user?.access_token}`
                    }
                })
                .then(res => {
                    dispatch(actions.setProjectList(newProjects))
                    setIsShowUpdate(false)
                    setValueInputUpdate('')
                    dispatch(actions.setEditProjectSuccess(true))
                })
                .catch(err => {
                    console.log('error in request', err.response?.data?.message);
                });
        }
    }
    const handleCancelUpdateProject = (id: any) => {
        setIsShowUpdate(false)
        setValueInputUpdate('')
    }
    return (
        <div className={`projects-wrapper ${SofiaProRegular.className}`}>
            <div>
                <h2>List project</h2>
                <ul>
                    {
                        data && data.map((item: any) => {
                            return (
                                <div key={item.projectId}>
                                    {
                                        isShowUpdate && idEdit === item?.projectId ?
                                            <div className="edit-wrapper" >
                                                <input className="input-update" value={valueInputUpdate}
                                                    onChange={(e: any) => setValueInputUpdate(e.target.value)}
                                                    autoFocus />
                                                <div className="icon-wrapper">
                                                    <FontAwesomeIcon icon={faFloppyDisk} className="project-icon"
                                                        onClick={() => handleSaveUpdateProject(item.projectId)} />
                                                    <FontAwesomeIcon icon={faBan} className="project-icon"
                                                        onClick={() => handleCancelUpdateProject(item.projectId)} />
                                                </div>
                                            </div> :
                                            <li key={item.projectId}>
                                                {
                                                    item.projectName
                                                }
                                                <div className="icon-wrapper">
                                                    <FontAwesomeIcon icon={faPenToSquare} className="project-icon"
                                                        onClick={() => handleEditProject(item.projectId)} />
                                                    <FontAwesomeIcon icon={faXmark} className="project-icon"
                                                        onClick={() => handleDeleteProject(item.projectId)} />
                                                </div>
                                            </li>
                                    }
                                </div>
                            )
                        })
                    }
                </ul>
                {
                    version > 1 ?
                        <div className="add-project">
                            <Input size="small" value={nameProject} onChange={handleChangeInput} />
                            <Button type="primary" onClick={handleAddProject}>Add project</Button>
                        </div>
                        : <></>
                }
            </div>

        </div>
    )
}
export default Projects