import axios from "axios"
import { baseURL } from "./Global";
export async function commonAxios(endPoint, data, dispatch, token, option) {
    let config = {
        headers: {
            'Authorization': token ? `Bearer ${token}` : ''
        },
    };
    if (option) {
        config = option
    }
    try {
        const res = await axios.post(`${baseURL}${endPoint}`, data, config);
        if (res.data.status === true) {
            return {
                status: true,
                data: res.data.data,
                msg: res.data.message
            }
        }
        else {
            if (res.data.message.includes("Unauthorized Token")) {
                dispatch({ type: 'LOGOUT' });
            }
            else {
                return {
                    status: false,
                    data: res.data.data,
                    msg: res.data.message
                }
            }
        }
    } catch (err) {
        return {
            msg: err.message
        }
    }
}