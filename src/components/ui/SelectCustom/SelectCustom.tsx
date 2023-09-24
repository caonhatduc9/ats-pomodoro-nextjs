import classNames from 'classnames/bind';
import { FC, useEffect, useRef, useState, memo } from 'react';
import { Button } from 'antd';
import useStore from '@/hooks/useStore';
import { actions } from '@/store';
import styles from './Select.module.scss';
import CreatableSelect from 'react-select/creatable';
import Select, { StylesConfig, components, GroupHeadingProps, GroupProps } from 'react-select';

const cx = classNames.bind(styles);

interface SelectCustomProps {
    projectTask?: any,
    isCreatableSelect?: boolean,
    onSetProjectSelected?: any,
    onSetProjectAddTask?: any,
    projectAddTask?: any,
    projectSelected?: any,
    handleCreate?: any
}

const SelectCustom: FC<SelectCustomProps> = ({ ...props }) => {
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
    const [state, dispatch] = useStore()
    const { projectList, project, version } = state
    const { projectTask, isCreatableSelect, onSetProjectSelected, onSetProjectAddTask, projectAddTask,
        projectSelected, handleCreate } = props
    const [isLoading, setIsLoading] = useState(false);

    return (
        <>
            {
                !(version > 1) ?
                    <Select
                        isClearable
                        isDisabled={isLoading}
                        isLoading={isLoading}
                        onChange={(newValue) => {
                            onSetProjectSelected(newValue)
                            onSetProjectAddTask(newValue)
                            dispatch(actions.setProject({
                                projectId: newValue?.value,
                                projectName: newValue?.label,
                            }))
                        }}
                        // onCreateOption={handleCreate}
                        options={projectList && projectList.map((item: any) => {
                            return {
                                label: item?.projectName,
                                value: item?.projectId,
                            }
                        })}
                        value={projectAddTask}
                        styles={colourStyles}
                        placeholder="Select or create project..."
                    /> :
                    <CreatableSelect
                        isClearable
                        isDisabled={isLoading}
                        isLoading={isLoading}
                        onChange={(newValue) => {
                            onSetProjectSelected && onSetProjectSelected(newValue)
                            onSetProjectAddTask && onSetProjectAddTask(newValue)
                            dispatch(actions.setProject({
                                projectId: newValue?.value,
                                projectName: newValue?.label,
                            }))
                        }}
                        onCreateOption={handleCreate}
                        options={projectList && projectList.map((item: any) => {
                            return {
                                label: item?.projectName,
                                value: item?.projectId,
                            }
                        })}
                        value={projectAddTask ? projectAddTask : projectSelected}
                        styles={colourStyles}
                        placeholder="Select or create project..."
                    />
            }
        </>
    )
}
export default SelectCustom