import classNames from 'classnames/bind';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import { useCookies } from 'react-cookie';
import Tippy from '@tippyjs/react/headless';
import { signOut, useSession } from "next-auth/react"

import styles from './Menu.module.scss';
import Wrapper from '../PoperWrapper';
import MenuItem from './MenuItem';
import Header from './Header';
import useStore from '@/hooks/useStore';
import { actions } from '@/store';
import axios from 'axios';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import 'sweetalert2/dist/sweetalert2.css'
import withReactContent from 'sweetalert2-react-content';

const cx = classNames.bind(styles);

export interface MenuProps {
    children?: any,
    items?: any,
    hideOnClick?: any,
    onChange?: any,
    isOpenTippy?: boolean
}

const defaultFunc = () => { };

const Menu: FC<MenuProps> = ({ ...props }) => {
    const { data: session } = useSession()
    const { children, items = [], onChange = defaultFunc, isOpenTippy } = props
    const [history, setHistory] = useState([{ data: items }]);
    const current: any = history[history.length - 1];
    const router = useRouter();
    const [state, dispatch] = useStore();
    const { user, isOpenMenuTippy, todos } = state
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const MySwal = withReactContent(Swal)

    const renderItems = () => {
        const temp = (isOpenMenuTippy) && current.data.map((item: any, index: number) => {
            const isParent = !!item.children;
            return (
                <MenuItem
                    data={item}
                    key={index}
                    onClick={() => {
                        if (isParent) {
                            setHistory((pre) => [...pre, item.children]);
                        } else {
                            onChange(item);
                            const path = item?.title.replace(/ /g, '').toLowerCase()
                            if (path === 'logout') {
                                router.push(`/`, undefined, {});
                                dispatch(actions.setUser({
                                    access_token: "",
                                    avatarURL: "",
                                    payment: "free",
                                    userId: "",
                                    userName: ""
                                }))
                                removeCookie("user")
                                if (session) {
                                    signOut()
                                }

                            }
                            else if (path === 'profile') {
                                dispatch(actions.setShowProfile(true))
                                dispatch(actions.setOpenMenuTippy(false))
                            }
                            else if (path === 'manageprojects') {
                                dispatch(actions.setShowProjects(true))
                            }
                            else if (path === 'clearalltasks') {
                                dispatch(actions.setOpenMenuTippy(false))
                                if (todos.length === 0) {
                                    MySwal.fire({
                                        title: 'There are currently no tasks to delete',
                                        text: 'Please add a new task and try again',
                                        icon: 'warning',
                                        customClass: {
                                            popup: "wrapper-popup ",
                                        },
                                        didDestroy: () => {
                                            dispatch(actions.setOpenMenuTippy(true))
                                        }
                                    })
                                } else MySwal.fire({
                                    icon: "warning",
                                    title: 'Are you sure?',
                                    text: "Are you sure you want to delete all tasks?",
                                    showCancelButton: true,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: 'Yes, delete all!',
                                    customClass: {
                                        popup: "wrapper-popup",
                                    },
                                    didDestroy: () => {
                                        dispatch(actions.setOpenMenuTippy(true))
                                    }
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        if (user?.access_token) {
                                            axios
                                                .delete('/apiTask/empty', {
                                                    headers: {
                                                        'authorization': `Bearer ${user?.access_token}`
                                                    }
                                                })
                                                .then(res => {
                                                    dispatch(actions.setNewTodo([]))
                                                    dispatch(actions.setCurrentTask({}))
                                                    dispatch(actions.setCountTask(0))
                                                })
                                                .catch(err => {
                                                    console.log('error in request', err.response?.data?.message);
                                                });
                                        }
                                        else {
                                            dispatch(actions.setNewTodo([]))
                                            dispatch(actions.setCurrentTask({}))
                                            dispatch(actions.setCountTask(0))
                                        }
                                    }
                                })
                            }
                            else {
                                router.push(`/${path}`, undefined, {});
                            }
                        }
                    }}
                />
            );
        });
        return temp;
    };
    return (
        <Tippy
            // visible={showProfileReducer ? false : true}
            offset={[0, 5]}
            placement="bottom-end"
            interactive
            trigger="click"
            zIndex={9999999}
            render={(attrs) => (
                <div className={cx('menu-list')} tabIndex={-1} {...attrs}>
                    <Wrapper className={cx('menu-poper')}>
                        {history && history.length > 1 && (
                            <Header
                                title={current.title}
                                onBack={() => {
                                    setHistory((pre) => pre.slice(0, history.length - 1));
                                }}
                            />
                        )}
                        <div className={cx('menu-body')}>{renderItems()}</div>
                    </Wrapper>
                </div>
            )}
            onHide={() => {
                setHistory((pre) => pre.slice(0, 1))
            }}
        >
            {children}
        </Tippy>
    );
}

export default Menu;
