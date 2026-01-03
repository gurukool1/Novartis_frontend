import { commonAxios } from "../../Global/CommonAxios";
import { setAlert } from "./AlertActions";


export const loadUser = () => (dispatch) => {

    let token = localStorage.getItem('state') ? JSON.parse(localStorage.getItem('state')).auth.token : false
    if (token) {
        commonAxios("fetch-user", {}, dispatch, token)
            .then((res) => {
                if (res.status) {
                    dispatch({ type: 'LOAD_USER_DATA', payload: res.data });
                } else {

                    dispatch({ type: 'LOAD_USER_FAIL' });
                }
            }).catch((err) => {

                dispatch({ type: 'LOAD_USER_FAIL' });
            })
    }
}

export const loginUser = (data, setLoader) => (dispatch) => {
    localStorage.clear();
    commonAxios("login", data, dispatch)
        .then((res) => {
            if (res.status) {
                dispatch(setAlert(res.msg, "success"));
                dispatch({ type: 'LOGIN_USER', payload: res.data });
                dispatch(loadUser())

            } else {
                dispatch(setAlert(res.msg, "danger"));
            }
            setLoader(false);
        }).catch((err) => {
            console.log(err)
            setLoader(false);

        })
}


export const masterLoginUser = (user, setLoader, navigate) => (dispatch) => {
    commonAxios("master-login", user, dispatch)
        .then((res) => {
            if (res.status) {
                dispatch({ type: 'LOGIN_USER', payload: res.data });
                dispatch(loadUser())
                navigate('/user/dashboard');
            } else {
                dispatch(setAlert(res.msg, "danger"));
            }
            setLoader(false)
        }).catch((err) => {
            console.log(err)
            setLoader(false)
        })
}
// export const logoutUser = () => (dispatch, getState) => {
//     commonAxios("logout", {}, dispatch, getState().auth.token)
//         .then((res) => {
//             if (res.status) {
//                 dispatch(setAlert(res.message, "success"));
//                 dispatch({ type: 'LOGOUT' });
//             } else {
//                 dispatch(setAlert(res.message, "danger"));
//             }
//         }).catch((err) => {
//             console.log(err)
//         })
// }

export const logoutUser = () => (dispatch) => {
    localStorage.removeItem('state');
    //  localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
    dispatch(setAlert("Logged out successfully", "success"));
}



export const forgetPassword = (data, setLoader) => (dispatch) => {
    commonAxios("forgot-password", data, dispatch)
        .then((res) => {
            if (res.status) {
                dispatch(setAlert(res.data.message.replace('if', 'If'), "success"));
            } else {
                dispatch(setAlert(res.msg, "danger"));
            }
            setLoader(false);
        }).catch((err) => {
            console.log(err)
            setLoader(false);
        })

}

export const resetPassword = (data, setLoader, navigate) => (dispatch) => {
    commonAxios("reset-password", data, dispatch)
        .then((res) => {
            if (res.status) {
                dispatch(setAlert(res.msg, "success"));
                navigate('/');
            } else {
                dispatch(setAlert(res.msg, "danger"));
            }
            setLoader(false);
        }).catch((err) => {
            console.log(err)
            setLoader(false);
        })

}

export const registerUser = (data, setLoader) => (dispatch) => {
    commonAxios("register", data, dispatch)
        .then((res) => {
            if (res.status) {
                dispatch(setAlert(res.msg, "success"));
                dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });
                // dispatch(loadUser());

            } else {
                dispatch(setAlert(res.msg, "danger"));
            }
            setLoader(false);
        }).catch((err) => {
            console.log(err)
            setLoader(false);
        })
}


export const unmountRegisterData = () => (dispatch) => {
    dispatch({ type: "UNMOUNT_REGISTER_DATA" });
};


export const updateName = (data, setLoader) => (dispatch, getState) => {
    commonAxios("profilee", data, dispatch, getState().auth.token)
        .then((res) => {
            if (res.status) {
                dispatch(setAlert(res.msg, "success"));
                dispatch({ type: 'CHANGE_USER_NAME', payload: data.name });
            } else {
                dispatch(setAlert(res.msg, "danger"));
            }
            setLoader(false);
        }).catch((err) => {
            console.log(err)
            setLoader(false);

        })
}


export const getAllCountries = (setCountries) => (dispatch) => {
    commonAxios("select-country", {}, dispatch)
        .then((res) => {
            if (res.status) {
                setCountries(res.data);
                dispatch({ type: "GET_COUNTRIES_SUCCESS", payload: res.data });
            } else {
                dispatch(setAlert(res.message, "danger"));
            }
        })
        .catch((err) => {
            console.log(err);
            dispatch(setAlert("Failed to load countries", "danger"));
        });
};
