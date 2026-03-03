import { commonAxios } from "../../Global/CommonAxios";
import { setAlert } from "./AlertActions";

export const submitAnswerSheet = (payload, setSaving) => async (dispatch, getState) => {
  try {
    setSaving(true);
    const token = getState().auth.token;

    const res = await commonAxios(
      'upload-answer-sheet',
      payload,
      dispatch,
      token
    );

    if (res.status) {
      dispatch({
        type: 'SUBMIT_ANSWER_SHEET_SUCCESS',
        payload: res.data
      });
      dispatch(setAlert(res.message || 'Answer sheet saved successfully', 'success'));
      return { success: true, data: res.data };
    } else {
      dispatch(setAlert(res.msg || 'Failed to save answer sheet', 'danger'));
      return { success: false, message: res.msg };
    }
  } catch (err) {
    dispatch(setAlert(err.msg || 'Error saving answer sheet', 'danger'));
    return { success: false, message: err.msg };
  } finally {
    setSaving(false);
  }
};


// export const uploadAnswerSheetFile = (formData, setUploading) => async (dispatch, getState) => {
//   try {
//     setUploading(true);
//     const token = getState().auth.token;

//     const headers = {
//       "Authorization": `Bearer ${token}`,
//       "Accept": "application/json",
//       "Content-Type": "multipart/form-data"
//     };

//     const res = await commonAxios(
//       "upload-docx",
//       formData,
//       dispatch,
//       token,
//       { headers }
//     );

//     if (res.status) {
//       dispatch({
//         type: 'UPLOAD_ANSWER_SHEET_SUCCESS',
//         payload: res.data
//       });
//       dispatch(setAlert(res?.msg || 'Answer sheet', 'success'));
//       return { success: true, data: res.data };
//     } else {
//       dispatch(setAlert(res?.msg || 'Failed to upload answer sheet', 'danger'));
//       return { success: false };
//     }
//   } catch (err) {
//     dispatch(setAlert(err.msg || 'Error uploading answer sheet', 'danger'));
//     return { success: false, message: err.msg };
//   } finally {
//     setUploading(false);
//   }
// };




export const uploadAnswerSheetFile = (formData, setUploading) => async (dispatch, getState) => {
  try {
    setUploading(true);
    const token = getState().auth.token;

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "multipart/form-data"
    };

    const res = await commonAxios(
      "upload-docx",
      formData,
      dispatch,
      token,
      { headers }
    );

    // ✅ If backend explicitly returns false
    if (res?.status === false) {
      dispatch(setAlert(res?.msg || "Something went wrong", "danger"));
      return { success: false };
    }

    // ✅ If success
    if (res?.status === true) {
      dispatch({
        type: 'UPLOAD_ANSWER_SHEET_SUCCESS',
        payload: res.data
      });

      dispatch(setAlert(res?.msg || "Answer sheet uploaded successfully", "success"));

      return { success: true, data: res.data };
    }

    // ✅ If API fails unexpectedly
    dispatch(setAlert(res?.msg || "Upload failed", "danger"));
    return { success: false };

  } catch (err) {
    dispatch(setAlert(err?.msg || "Error uploading answer sheet", "danger"));
    return { success: false };
  } finally {
    setUploading(false);
  }
};





// export const getAnswerSheet = (caseId, setLoading) => async (dispatch, getState) => {
//   try {
//     if (setLoading) setLoading(true);
//     const token = getState().auth.token;

//     const res = await commonAxios(
//       `get-master-sheet/${caseId}`,
//       {},
//       dispatch,
//       token
//     );

//   console.log("RAW RES from commonAxios:", res.data);
//         if ( res?.data) {
//        const answerSheet = res.data;
//         console.log("Fetched answer sheet data:", answerSheet);
//       dispatch({
//         type: 'GET_ANSWER_SHEET_SUCCESS',
//         payload: { caseId, answerSheet }
//       });

//              dispatch({
//         type: 'SET_ANSWER_SHEET_ID',
//         payload: answerSheet?.id || null
//       });
//       return { success: true, data: answerSheet };
//     } else {
//       //If no answer sheet exists, that's not an error
//       if (res.msg?.includes('not found')) {
//         dispatch({
//           type: 'GET_ANSWER_SHEET_SUCCESS',
//           payload: { caseId, answerSheet: null }
//         });
//         return { success: true, data: null };
//       }
//       dispatch(setAlert(res.msg || 'Failed to fetch answer sheet', 'danger'));
//       return { success: false, message: res.msg };
//     }
//   } catch (err) {
//     dispatch(setAlert(err.msg || 'Error fetching answer sheet', 'danger'));
//     return { success: false, message: err.msg };
//   } finally {
//     if (setLoading) setLoading(false);
//   }
// };





// export const getAnswerSheet = (caseId, setLoading) => async (dispatch, getState) => {
//   try {
//     if (setLoading) setLoading(true);
//     const token = getState().auth.token;

//     const res = await commonAxios(
//       `get-master-sheet/${caseId}`,
//       {},
//       dispatch,
//       token
//     );

//     console.log("RAW RES from commonAxios:", res);
//     if (res?.status === true) {
//       const answerSheet = res.data;

//       dispatch({
//         type: 'GET_ANSWER_SHEET_SUCCESS',
//         payload: { caseId, answerSheet }
//       });

//       dispatch({
//         type: 'SET_ANSWER_SHEET_ID',
//         payload: answerSheet?.id || null
//       });

//       // ✅ Show success alert message from API
//       dispatch(setAlert(res?.message || 'Answer sheet retrieved successfully', 'success'));

//       return { success: true, data: answerSheet };

//     } else {

//       // If no answer sheet exists (optional handling)
//       if (res?.message?.toLowerCase().includes('not found')) {
//         dispatch({
//           type: 'GET_ANSWER_SHEET_SUCCESS',
//           payload: { caseId, answerSheet: null }
//         });

//         return { success: true, data: null };
//       }
// if(res.status==false){
//       dispatch(setAlert(res?.message || 'Failed to fetch answer sheet', 'danger'));
//       return { success: false, message: res?.message };
// }
//       dispatch(setAlert(res?.message || 'Failed to fetch answer sheet', 'danger'));
//       return { success: false, message: res?.message };
//     }

//   } catch (err) {
//     dispatch(setAlert(err?.message || 'Error fetching answer sheet', 'danger'));
//     return { success: false, message: err?.message };
//   } finally {
//     if (setLoading) setLoading(false);
//   }
// };






export const getAnswerSheet = (caseId, setLoading) => async (dispatch, getState) => {
  try {

     if (!caseId) {
      dispatch(setAlert('Please fill the Answer Sheet form for this case.', 'warning'));
      //return { status: false, msg: 'Case ID is missing' };
    }
    if (setLoading) setLoading(true);
    const token = getState().auth.token;

    const res = await commonAxios(
      `get-master-sheet/${caseId}`,
      {},
      dispatch,
      token
    );
console.log("RAW RES from commonAxios:", res);
    //console.log("RAW RES from commonAxios:", res);

    // ✅ If API status is TRUE
    if (res?.status === true) {
      const answerSheet = res?.data;

      dispatch({
        type: 'GET_ANSWER_SHEET_SUCCESS',
        payload: { caseId, answerSheet }
      });

      dispatch({
        type: 'SET_ANSWER_SHEET_ID',
        payload: answerSheet?.id || null
      });

      dispatch(setAlert(res?.msg || 'Master an', 'success'));

      return { success: true, data: answerSheet };
    }
    if (res?.status === false) {

      dispatch({
        type: 'GET_ANSWER_SHEET_SUCCESS',
        payload: { caseId, answerSheet: null }
      });

      dispatch(setAlert(res?.msg || 'No master', 'danger'));

      return { success: false, msg: res?.msg };
    }
  } catch (err) {
    dispatch(setAlert(err?.message || 'Error fetching answer sheet', 'danger'));
    return { success: false, message: err?.message };
  } finally {
    if (setLoading) setLoading(false);
  }
};







export const updateMasterSheet = (id, payload, setSaving) => 
  async (dispatch, getState) => {
    try {
      if (setSaving) setSaving(true);

      const token = getState().auth.token;

      const res = await commonAxios(
        `update-master-sheet/${id}`,
        payload,
        dispatch,
        token
      );
console.log("Response from updateMasterSheet:", res);
      if (res?.status === true) {
        dispatch({
          type: "UPDATE_ANSWER_SHEET_SUCCESS",
          payload: {
            caseId: payload.caseId,
            answerSheet: res.data
          }
        });

        dispatch(setAlert( res?.msg || "Answer sheet updated successfully", "success"));

        return { success: true, data: res.data };
      } else {
        dispatch(setAlert(res?.msg || "Failed to update", "danger"));
        return { success: false };
      }
    } catch (err) {
      dispatch(setAlert("Error updating answer sheet", "danger"));
      return { success: false };
    } finally {
      if (setSaving) setSaving(false);
    }
};



export const deleteAnswerSheet = (id, caseId) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;

    const res = await commonAxios(
      `delete-master-sheet/${id}`,
      {},
      dispatch,
      token,
    );

    if (res?.status === true) {
      dispatch({
        type: 'DELETE_ANSWER_SHEET_SUCCESS',
        payload: { caseId }
      });

      dispatch(setAlert(res?.message || 'Answer sheet deleted successfully', 'success'));
      return { success: true };
    } else {
      dispatch(setAlert(res?.msg || 'Failed to delete answer sheet', 'danger'));
      return { success: false };
    }
  } catch (err) {
    dispatch(setAlert(err?.message || 'Error deleting answer sheet', 'danger'));
    return { success: false };
  }
};
