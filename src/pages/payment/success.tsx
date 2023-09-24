import useStore from "@/hooks/useStore";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Spinner } from "@/components/ui";

const PaymentSuccess = () => {
    const [data, setData] = useState(null)
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    useEffect(() => {
        cookies.user && setData(cookies.user)
    }, [cookies])
    return <>
        {
            data ? (
                <div className="payment-wrapper">
                    {/* <div className="background"></div> */}
                    <div className="container">
                        <div className="row">
                            <div className="modalbox success col-sm-8 col-md-8 col-lg-6 center animate">
                                <div className="icon">
                                    <FontAwesomeIcon icon={faCheck} />
                                </div>
                                <div className="text-wrapper">
                                    <h1>Payment Success!</h1>
                                    <p>You have successfully purchased! We have sent a confirmation e-mail to you.</p>
                                    <Button href="/" size="large" type="primary">Back to Homepage</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : <Spinner />
        }
    </>
}
export default PaymentSuccess