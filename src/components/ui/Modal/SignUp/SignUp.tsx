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
import { actions } from '@/store';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import 'sweetalert2/dist/sweetalert2.css'
import withReactContent from 'sweetalert2-react-content';

export interface SignUpProps {
    onCloseSignUp?: any,
    onShowSignUp?: any,
    onClose?: any
}

const SignUp: FC<SignUpProps> = ({ ...props }) => {
    const { onCloseSignUp, onShowSignUp, onClose } = props
    const [state, dispatch] = useStore();
    const { blogs, customBackgroundWallpaper, currentCustomColor, showLoginReducer, showSignUpReducer } = state;
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
                .post('/apiAuth/signup', {
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
            // setIsSuccess(true)
        } else {
            setShowErrorEmail(true)
            setErrorMessage("")
        }
    }
    useEffect(() => {
        onShowSignUp()
    }, [])
    useEffect(() => {
        if (isSuccess) {
            MySwal.fire({
                icon: 'success',
                title: 'Password reset link has been sent',
                text: "Activation link have been sent to your email address. To start using Pomofocus, please activate your account from the link.",
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
                    dispatch(actions.setShowSignUp(false));
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
                            <div className='login-title'>Create Account</div>
                            <div className='login-main'>
                                <div className='login-label '>Email</div>
                                <input placeholder='example@mail.com' value={email} onChange={handleChangeEmail} />
                                {
                                    showErrorEmail ? errorMessage ? <p>{errorMessage}</p> : <p>Please input valid email</p> :
                                        <>
                                        </>
                                }
                                <div className='login-submit'>
                                    <Button size='lg' onClick={handleClickSignUp}>Sign up</Button>
                                </div>
                            </div>
                            <div className='login-sign-up'>
                                <div>Already have an account?</div>
                                <Button onClick={() => {
                                    onCloseSignUp()
                                }} className='back-to-login'>Log in</Button>
                            </div>
                        </div>
                    }
                </div>

            </div>
        </>
    );
}
export default SignUp