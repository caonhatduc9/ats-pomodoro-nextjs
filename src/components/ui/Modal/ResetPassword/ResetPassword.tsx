import React, { FC, useEffect, useState } from 'react';
import useStore from '@/hooks/useStore';
import { Blog } from '@/components/ui';
import Link from 'next/link';
import Image from 'next/image';
import images from '@/assets/images';
import { Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { SofiaProRegular } from '@/utils/fonts';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import 'sweetalert2/dist/sweetalert2.css'
import withReactContent from 'sweetalert2-react-content';
import { actions } from '@/store';

export interface ResetPasswordProps {
    onCloseResetPassword?: any,
    onShowResetPassword?: any,
    onClose?: any
}

const ResetPassword: FC<ResetPasswordProps> = ({ ...props }) => {
    const { onCloseResetPassword, onShowResetPassword, onClose } = props
    const [state, dispatch] = useStore();
    const { blogs, customBackgroundWallpaper, currentCustomColor, showLoginReducer, showResetPassReducer } = state;
    const color = currentCustomColor === 'black' ? '#aaaaaa' : 'white'
    const [email, setEmail] = useState("")
    const [showErrorEmail, setShowErrorEmail] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string>()
    const router = useRouter();
    const MySwal = withReactContent(Swal)
    const handleChangeEmail = (e: any) => {
        const newEmail = e.target.value
        setEmail(newEmail);
    }
    const handleClickSignUp = async () => {
        const regexEmail =
            /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/;
        if (regexEmail.test(email)) {
            setShowErrorEmail(false);
            await axios
                .post('/apiAuth/forgotPass', {
                    "email": email.trim(),
                }
                )
                .then(res => {
                    setIsSuccess(true)
                })
                .catch(err => {
                    console.log('error in request', err);
                    setErrorMessage(err.response?.data?.message || err.response?.statusText)
                    setShowErrorEmail(true)
                });
        } else {
            setShowErrorEmail(true)
            setErrorMessage("")
        }
    }
    useEffect(() => {
        if (isSuccess) {
            MySwal.fire({
                icon: 'success',
                title: 'Password reset link has been sent',
                text: "Password reset link has been sent to your email address. Please set the new password from the link.",
                showConfirmButton: false,
                customClass: {
                    // container: "login-success"
                    popup: "modal-content pop-up-swal",
                    title: "login-sc-title",
                    htmlContainer: "login-des-text"
                },
                didRender: () => {
                    onClose()
                    dispatch(actions.setShowResetPass(false));
                    dispatch(actions.setShowLogin(false));
                }
            })
        }
    }, [isSuccess])
    return (
        <>
            <div className={`login-wrapper reset-pass ${SofiaProRegular.className}`}>
                <div className='login-inner'>
                    {
                        !isSuccess &&
                        <div className='login-content'>
                            <div className='login-title'>Reset Password</div>
                            <div className='login-main'>
                                <div className='login-label '>Email</div>
                                <input placeholder='example@mail.com' value={email} onChange={handleChangeEmail} />
                                {
                                    showErrorEmail ? errorMessage ? <p>{errorMessage}</p> : <p>Please input valid email</p> :
                                        <>
                                        </>
                                }
                                <div className='login-submit'>
                                    <Button size='lg' onClick={handleClickSignUp}>Reset Password</Button>
                                </div>
                            </div>
                            <div className='login-sign-up'>
                                <div>Try other methods?</div>
                                <Button onClick={() => {
                                    // router.push(`/login`, undefined, {});
                                    onCloseResetPassword()
                                }} className='back-to-login'>Log in</Button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </>
    );
}
export default ResetPassword