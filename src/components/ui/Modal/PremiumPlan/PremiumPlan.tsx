import React, { FC, useEffect, useRef, useState } from "react"
import axios from 'axios';
import useStore from "@/hooks/useStore";
import { Button, Input, Space } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { SofiaProRegular } from '@/utils/fonts';
import styles from "./PremiumPlan.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
export interface PremiumPlanProps {
    onClosePremiumPlan?: any,
    onShowPremiumPlan?: any
}


const PremiumPlan: FC<PremiumPlanProps> = ({ ...props }) => {
    const { onClosePremiumPlan, onShowPremiumPlan } = props
    const [state, dispatch] = useStore();
    const { user } = state
    const abilities = ['Add projects', 'See yearly report', 'Add countless tasks',
        'No ads', '... and all the future updates']
    const [prices, setPrices] = useState([])
    const [planSelected, setPlanSelected] = useState<any>()
    const [assetId, setAssetId] = useState(null)
    useEffect(() => {
        if (!planSelected) {
            setPlanSelected(prices[0])
        }
    }, [planSelected, prices])
    useEffect(() => {
        fetchPrices()
        const data = window.localStorage.getItem("assetId")
        data && setAssetId(JSON.parse(data))
    }, [])

    const fetchPrices = async () => {
        axios.get('/apiPayment/getListProduct')
            .then(res => {
                setPrices(res.data.data)
            })
            .catch(err => {
                console.log(err);
            })
    }
    const handleClickPlan = (plan: any) => {
        setPlanSelected(plan)
    }

    const handleSubscription = async (e: any) => {
        e.preventDefault();
        axios.post('/apiPayment/createSubscription',
            {
                "email": user?.email,
                "userId": user?.userId,
                "assetId": assetId,
                "username": user?.userName,
                priceId: "price_1NpNiUExrxFsGEFSLviMVweJ" || planSelected.id
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
            .then(res => {
                window.location.assign(res.data.data.url)
            })
            .catch(err => {
                console.log(err);
            })
    }
    return (
        <div className={`premiumplan-wrapper ${SofiaProRegular.className}`}>
            <h3 className={styles.heading}>Premium Plan</h3>
            <div className={styles.abilities}>
                <div>More abilitites</div>
                {
                    abilities && abilities.length > 0 && abilities.map((ability: any, index: number) => {
                        return (
                            <div className={styles.ability} key={index}>
                                <div className={styles.iconStyles}>
                                    <FontAwesomeIcon icon={faCheck} color="red" />
                                </div>
                                <div>{ability}</div>
                            </div>

                        )
                    })
                }
            </div>
            <div className={styles.purchasePlan}>
                <div className={styles.selectPlan}>Select plan</div>
                <div className={styles.plans}>
                    {
                        prices && prices.length > 0 && prices.map((plan: any) => {
                            return (
                                <div className={cx('plan', {
                                    ['active']: plan.id === planSelected?.id
                                })} onClick={() => handleClickPlan(plan)} key={plan.id}>
                                    <div>{plan?.recurring?.interval === "month" ? "Monthly" : "Yearly"}</div>
                                    <div>${(plan?.unit_amount) / 100}</div>
                                    <div>/{plan?.recurring?.interval}</div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className={styles.description}>
                    <div>
                        * The subscription will be auto-renewed until you unsubscribe.
                    </div>
                </div>
                <div className={styles.btnWrapper}>
                    <Button onClick={handleSubscription}>Purchase the plan</Button>
                </div>
            </div>
        </div >
    )
}
export default PremiumPlan