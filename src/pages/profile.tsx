import React, { useEffect, useRef, useState } from "react"
import axios from 'axios';
import useStore from "@/hooks/useStore";

const Profile = () => {
    const [state, dispatch] = useStore();
    const { user } = state
    const [data, setData] = useState<any>(user)

    useEffect(() => {
        const accessToken = user?.access_token
        axios.get(`/apiAuth/profile`, {
            headers: {
                'authorization': `Bearer ${accessToken}`
            }
        })
            .then(res => {
                setData(res.data)
            })
            .catch(err => {
                console.log('error in request', err);
            });
    }, [])

    return (
        <h2>{data?.username}</h2>
    )
}
export default Profile