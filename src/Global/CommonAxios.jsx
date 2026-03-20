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

        const message = res.data.message || '';
        if (message.includes("Unauthorized Token") || message.includes("Token Expired") || message.includes("Token is invalid")) {
            if (dispatch) {
                dispatch({ type: 'LOGOUT' });
            }
            return {
                status: false,
                data: null,
                msg: message || 'Unauthorized token'
            }
        }

        return {
            status: false,
            data: res.data.data,
            msg: message
        }
    } catch (err) {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            if (dispatch) {
                dispatch({ type: 'LOGOUT' });
            }
            return {
                status: false,
                data: null,
                msg: 'Unauthorized or expired token. Please login again.'
            }
        }

        return {
            status: false,
            data: null,
            msg: err.message
        }
    }
}