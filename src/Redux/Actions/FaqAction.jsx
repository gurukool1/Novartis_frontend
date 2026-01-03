
import { setAlert } from './AlertActions';
import { commonAxios } from "../../Global/CommonAxios";
export const getFaqs = () => async (dispatch, getState) => {
  try {
    dispatch({ type: 'FETCH_FAQS_REQUEST' });
    const token = getState().auth.token;

    const res = await commonAxios('faqs', {}, dispatch, token);

    if (res.status) {
      dispatch({
        type: 'FETCH_FAQS_SUCCESS',
        payload: res.data.faqs
      });
    } else {
      dispatch({ type: 'FETCH_FAQS_FAILURE', payload: res.msg });
      dispatch(setAlert(res.msg, 'danger'));
    }
  } catch (err) {
    dispatch({ type: 'FETCH_FAQS_FAILURE', payload: err.message });
    dispatch(setAlert(err.message, 'danger'));
  }
};



export const addFaq = (faqData, onSuccess, setLoader) => async (dispatch, getState) => {
  try {
    dispatch({ type: 'ADD_FAQ_REQUEST' });
    const token = getState().auth.token;

    const res = await commonAxios(
      'add-faq',
      faqData,
      dispatch,
      token,

    );
    if (res.status) {
      const newFaq = res.data.faq;
      dispatch(getFaqs())
      if (setLoader) setLoader(false);
      dispatch({
        type: 'ADD_FAQ_SUCCESS',
        payload: newFaq
      });
      dispatch(setAlert('FAQ added successfully', 'success'));
      if (onSuccess) onSuccess();
      return newFaq
      //dispatch(getFaqs());
    } else {
      dispatch({ type: 'ADD_FAQ_FAILURE', payload: res.msg });
      dispatch(setAlert(res.msg, 'danger'));
      if (setLoader) setLoader(false);
    }
  } catch (err) {
    dispatch({ type: 'ADD_FAQ_FAILURE', payload: err.message });
    dispatch(setAlert(err.message, 'danger'));
    if (setLoader) setLoader(false);
  }
};


export const updateFaq = (id, faqData) => async (dispatch, getState) => {
  try {
    dispatch({ type: 'UPDATE_FAQ_REQUEST' });
    const token = getState().auth.token;

    const res = await commonAxios(
      `edit-faq/${id}`,

      faqData,

      dispatch,
      token
    );

    if (res.status) {
      dispatch({
        type: 'UPDATE_FAQ_SUCCESS',
        payload: res.data.faq
      });
      dispatch(setAlert('FAQ updated successfully', 'success'));
      return true;
    } else {
      dispatch({ type: 'UPDATE_FAQ_FAILURE', payload: res.msg });
      dispatch(setAlert(res.msg, 'danger'));
      return false;
    }
  } catch (err) {
    dispatch({ type: 'UPDATE_FAQ_FAILURE', payload: err.message });
    dispatch(setAlert(err.message, 'danger'));
    return false;
  }
};


export const deleteFaq = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: 'DELETE_FAQ_REQUEST' });
    const token = getState().auth.token;

    const res = await commonAxios(
      `delete-faq/${id}`,
      {
        method: 'DELETE'
      },
      dispatch,
      token
    );

    if (res.status) {
      dispatch({
        type: 'DELETE_FAQ_SUCCESS',
        payload: id
      });
      dispatch(setAlert('FAQ deleted successfully', 'success'));
    } else {
      dispatch({ type: 'DELETE_FAQ_FAILURE', payload: res.msg });
      dispatch(setAlert(res.msg, 'danger'));
    }
  } catch (err) {
    dispatch({ type: 'DELETE_FAQ_FAILURE', payload: err.message });
    dispatch(setAlert(err.message, 'danger'));
  }
};