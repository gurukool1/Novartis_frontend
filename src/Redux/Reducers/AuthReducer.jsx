import { produce } from "immer"

let auth = localStorage.getItem('state') ? JSON.parse(localStorage.getItem('state')).auth : {
    isAuthenticated: false,
    token: false,
    user: false,
    registrationSuccess: false,
}


const initialState = {
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    registrationSuccess: auth.registrationSuccess,
    loading: false,
    countries: []

}

export const AuthReducer = (state = initialState, action) => {

    switch (action.type) {
        case 'AUTH_LOADING':
            return produce(state, draft => {
                draft.loading = true;
            });


        case 'LOGIN_USER':
            return produce(state, (draft) => {
                draft.isAuthenticated = true
                draft.token = action.payload.token
                draft.user = action.payload.user
                draft.loading = false;
            })


        case 'LOGOUT':
            localStorage.clear()
            return produce(state, (draft) => {
                draft.isAuthenticated = false
                draft.token = false
                draft.user = false
                draft.loading = false;
            })

        case 'LOAD_USER_DATA':
            return produce(state, (draft) => {
                draft.user = action.payload.user
                draft.loading = false;
                // draft.isAuthenticated = true;
            })

        case 'REGISTER_SUCCESS':
            return produce(state, (draft) => {
                draft.registrationSuccess = true;
            });
        case 'RESET_REGISTRATION_SUCCESS':
            return produce(state, (draft) => {
                draft.registrationSuccess = false;
            });

        case 'UNMOUNT_REGISTER_DATA':
            return produce(state, (draft) => {
                draft.registrationSuccess = false;
            });
        case 'GET_COUNTRIES_SUCCESS':
            return produce(state, (draft) => {
                draft.countries = action.payload;
            });
        default:
            return { ...state }
    }
}