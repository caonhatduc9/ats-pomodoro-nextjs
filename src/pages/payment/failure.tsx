import { faCheck, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Spinner } from "@/components/ui";

const PaymentFailure = () => {
    const [data, setData] = useState(null)
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    useEffect(() => {
        cookies.user && setData(cookies.user)
    }, [cookies])
    return <>
        {
            data ? (
                <div className="payment-wrapper">
                    <div className="container">
                        <div className="row">
                            <div className="modalbox error col-sm-8 col-md-8 col-lg-6 center animate">
                                <div className="icon">
                                    <FontAwesomeIcon icon={faThumbsDown} />
                                </div>
                                <div className="text-wrapper">
                                    <h1>Oh no! Payment Failed!</h1>
                                    <p>Oops! Something went wrong,
                                        you should try again.</p>
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
export default PaymentFailure