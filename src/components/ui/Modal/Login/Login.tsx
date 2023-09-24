import React, { FC, useEffect, useState } from 'react';
import useStore from '@/hooks/useStore';
import { Blog } from '@/components/ui';
import Link from 'next/link';
import Image from 'next/image';
import images from '@/assets/images';
import { Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import axios from 'axios';
import { actions } from '@/store';
import { useCookies } from 'react-cookie';
import { useSession, signIn, signOut } from "next-auth/react"
import { CircularXXWebBook, SofiaProBold, SofiaProRegular, SofiaProLight } from '@/utils/fonts';

export interface LoginProps {
    onCloseLogin?: any,
    onShowLogin?: any
}

const Login: FC<LoginProps> = ({ ...props }) => {
    const { onCloseLogin, onShowLogin } = props

    const { data: session } = useSession()
    const [state, dispatch] = useStore();
    const { blogs, customBackgroundWallpaper, currentCustomColor, showResetPassReducer, showSignUpReducer } = state;
    const color = currentCustomColor === 'black' ? '#aaaaaa' : 'white'
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showErrorEmail, setShowErrorEmail] = useState(false)
    const [showErrorPass, setShowErrorPass] = useState(false)
    const [showWrong, setShowWrong] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string>()
    const router = useRouter();
    const [cookies, setCookie, removeCookie] = useCookies(['user']);

    useEffect(() => {
        if (session) {
            const urlPost = session?.user?.image?.includes('avatars.githubusercontent.com') ? "/apiAuth/github" : "/apiAuth/google"
            axios
                .post(urlPost, {
                    email: session?.user?.email,
                    image: session?.user?.image,
                })
                .then(res => {
                    // console.log('res', res.data);
                    setShowErrorPass(false)
                    // router.push(`/`, undefined, {});
                    const result = res.data.data
                    dispatch(actions.setUser(result))
                    setCookie('user', JSON.stringify(result), {
                        path: '/',
                        httpOnly: false
                    });
                    dispatch(actions.setUser(cookies.user))
                })
                .catch(err => {
                    console.log('error in request', err.response?.data?.message);
                    const codeError = err?.response?.status
                    if (codeError != 200) {
                        // setShowErrorEmail(true)
                        // setShowErrorPass(false)
                        // setShowWrong(false)
                        setErrorMessage(err.response?.data?.message || err.response?.statusText)
                    }
                });
        }
    }, [session])


    const handleChangePassword = (e: any) => {
        const newPass = e.target.value
        setPassword(newPass)
    }
    const handleChangeEmail = (e: any) => {
        const newEmail = e.target.value
        setEmail(newEmail);
    }
    const handleClickLogin = async () => {
        setErrorMessage("")
        const regexEmail =
            /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/;
        if (regexEmail.test(email)) {
            setShowErrorEmail(false);
            if (password.length < 8) {
                setShowErrorPass(true)
            }
            else {
                await axios
                    .post('/apiAuth/login', {
                        "email": email.trim(),
                        "password": password
                    })
                    .then(res => {
                        // console.log('res', res.data);
                        setShowErrorPass(false)
                        // router.push(`/`, undefined, {});
                        const result = res.data.data
                        dispatch(actions.setUser(result))
                        setCookie('user', JSON.stringify(result), {
                            path: '/',
                            httpOnly: false
                        });
                        dispatch(actions.setUser(cookies.user))
                        onCloseLogin()
                    })
                    .catch(err => {
                        console.log('error in request', err);
                        const codeError = err?.response?.status
                        if (codeError != 200) {
                            setShowErrorEmail(false)
                            setShowErrorPass(false)
                            setShowWrong(true)
                        }
                    });
            }
        } else {
            setShowErrorEmail(true)
        }
    }

    return (
        <>
            <div className="login-wrapper">
                <div className='login-inner'>
                    <div className='login-content'>
                        <div className={`login-title ${SofiaProBold.className}`}>Login</div>
                        <button className={`login-gg ${SofiaProBold.className}`} onClick={() => signIn()}>Login with Google or GitHub</button>
                        <div className={`login-or ${SofiaProRegular.className}`}>or</div>
                        <div className='login-main'>
                            <div className={`login-label ${SofiaProBold.className}`}>Email</div>
                            <input placeholder='example@mail.com' value={email} onChange={handleChangeEmail} />
                            <div className='login-label '>Password</div>
                            <input type="password" className='login-pass' value={password} onChange={handleChangePassword} />
                            {
                                errorMessage ? <p>{errorMessage}</p> :

                                    showErrorEmail ? <p className={SofiaProRegular.className}>Please input valid email</p> :
                                        <>
                                            {
                                                showErrorPass ? <p className={SofiaProRegular.className}>Password must contain least 8 characters</p> : <></>
                                            }
                                        </>
                            }
                            {
                                !showErrorPass && !showErrorEmail && showWrong ? <p className={SofiaProRegular.className}>Invalid account or password</p> : <></>
                            }
                            <div className='login-submit'>
                                <Button size='lg' onClick={handleClickLogin} className={SofiaProRegular.className}>Login</Button>
                            </div>
                            <div className='login-forgot-pass'>
                                <Button onClick={() => {
                                    // router.push(`/resetpassword`, undefined, {});
                                    dispatch(actions.setShowResetPass(true))
                                    dispatch(actions.setShowLogin(false))
                                    setErrorMessage('')
                                }} className={SofiaProBold.className}>Forgot Password</Button>
                            </div>
                        </div>
                        <div className='login-sign-up'>
                            <div className={SofiaProRegular.className}>Do not have an account?</div>
                            <Button onClick={() => {
                                // router.push(`/signup`, undefined, {});
                                dispatch(actions.setShowSignUp(true))
                                dispatch(actions.setShowLogin(false))
                                setErrorMessage('')
                            }} className={SofiaProBold.className}>Create account</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Login