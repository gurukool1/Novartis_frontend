const initialState = {
    message: "",
    type: ""
}

export const AlertReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_ALERT":
            return {
                ...state,
                message: action.payload.message,
                type: action.payload.type
            }

        case 'REMOVE_ALERT':
            return {
                ...state,
                message: "", type: ""
            }

        default:
            return state
    }
}