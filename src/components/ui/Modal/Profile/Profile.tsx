import React, { FC, useEffect, useRef, useState } from "react"
import axios from 'axios';
import useStore from "@/hooks/useStore";
import { Button, Input, Space } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { SofiaProRegular } from '@/utils/fonts';


export interface ProfileProps {
    onCloseProfile?: any,
    onShowProfile?: any
}

const Profile: FC<ProfileProps> = ({ ...props }) => {
    const { onCloseProfile, onShowProfile } = props
    const [state, dispatch] = useStore();
    const { user } = state
    const [data, setData] = useState<any>(user)
    const [isSuccess, setIsSuccess] = useState(false)

    const [checkLength, setCheckLength] = useState(true)
    const [currentPass, setCurrentPass] = useState<string>('')
    const [newPass, setNewPass] = useState<string>('')
    const [confirmNewPass, setConfirmNewPass] = useState<string>('')
    const [checkConfirmPass, setCheckConfirmPass] = useState(true)
    const [showError, setShowError] = useState(false)
    const [error, setError] = useState()

    useEffect(() => {
        if (confirmNewPass?.length > 0 && newPass?.length >= 8) {
            if (newPass !== confirmNewPass) {
                setCheckConfirmPass(false)
            }
            else setCheckConfirmPass(true)
        }
    }, [confirmNewPass, newPass])
    const handleChangeNewPass = (e: any) => {
        const value: any = e.target.value
        setNewPass(value)
        if (value.length < 8) {
            setCheckLength(false)
            setCheckConfirmPass(true)
        }
        else setCheckLength(true)
    }
    const handleSaveChange = async () => {
        const accessToken = user?.access_token
        const newInfo = {
            "email": data?.email,
            "currentPassword": currentPass,
            "newPassword": newPass
        }
        axios.patch(`/apiAuth/changePass`, newInfo, {
            headers: {
                'authorization': `Bearer ${accessToken}`
            }
        })
            .then(res => {
                setIsSuccess(true)
            })
            .catch(err => {
                console.log('error in request', err);
                setShowError(true)
                setError(err?.response?.data?.message)
            });
    }
    return (
        <div className={`profile-wrapper ${SofiaProRegular.className}`}>
            {
                isSuccess ? <div className='login-success'>
                    <div className='reset-success'>
                        <FontAwesomeIcon icon={faCheck} />
                    </div>
                    <div className='login-sc-title'>Change password successfully</div>
                </div> :
                    <>
                        <div>
                            <h2 style={{ color: 'rgb(151 144 144)' }}>PROFILE</h2>
                        </div>
                        <div className="profile-content">
                            <div className="profile-input">
                                <div>User Name</div>
                                <div>{data?.userName}</div>
                            </div>
                            <div className="profile-input">
                                <div>Email</div>
                                <div>{data?.email}</div>
                            </div>
                            <div className="profile-input">
                                <div>Current Password</div>
                                <Input.Password
                                    placeholder="Input password"
                                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    value={currentPass} onChange={(e: any) => {
                                        setCurrentPass(e.target.value)
                                        setShowError(false)
                                    }}
                                    className="profile-typing"
                                />
                            </div>
                            <div className="profile-input">
                                <div>New Password</div>
                                <Input.Password
                                    placeholder="Input password"
                                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    value={newPass} onChange={handleChangeNewPass}
                                    className="profile-typing"
                                />
                                {
                                    !checkLength ? <p>Choose a more secure password you don&apos;t use anywhere else. It should be longer than 8 characters and difficult for others to guess.</p> : <></>
                                }
                            </div>
                            <div className="profile-input">
                                <div>Confirm New Password</div>
                                <Input.Password
                                    placeholder="Input password"
                                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    value={confirmNewPass} onChange={(e: any) => setConfirmNewPass(e.target.value)}
                                    className="profile-typing"
                                />
                                {
                                    !checkConfirmPass ? <p>New password does not match. Enter new password again here.</p> : <></>
                                }
                            </div>
                            {
                                showError ? <p>{error}</p> : <></>
                            }
                            <div className="profile-btn">
                                <Button disabled={(checkLength && checkConfirmPass && currentPass.length > 0 && newPass.length > 0
                                    && confirmNewPass.length > 0) ? false : true} type="primary" onClick={handleSaveChange}>Save change</Button>
                            </div>
                        </div>
                    </>
            }

        </div>
    )
}
export default Profile