
export const setAlert = (message, type) => (dispatch) => {
    dispatch({ type: 'SET_ALERT', payload: { message, type } });
}

export const removeAlert = () => (dispatch) => {
    dispatch({
        type: 'REMOVE_ALERT'
    })
}
