import { commonAxios } from "../../Global/CommonAxios";
import { setAlert } from "./AlertActions";
import { baseURL } from "../../Global/Global"

export const uploadCaseFile = (formData, setLoader) => (dispatch, getState) => {
  const token = getState().auth.token;
  commonAxios('uploadsucess', formData, dispatch, token)
    .then((res) => {
      if (res.status) {
        dispatch(setAlert('File uploaded successfully', 'success'));
      } else {
        dispatch(setAlert(res.msg, 'danger'));
      }
      setLoader(false);
    })
    .catch((err) => {
      console.log(err);
      // dispatch(setAlert(err.msg || 'Something went wrong', 'danger'));
      dispatch(setAlert(err.msg, "danger"))
      setLoader(false);
    });
};


export const submitCaseForm = (formData, setLoader, onSuccess) => (dispatch, getState) => {
  setLoader(true);

  const token = getState().auth.token;
  const headers = {
    "Authorization": `Bearer ${token}`,
    "Accept": "application/json",
    "Content-Type": "multipart/form-data"
  };

  const options = { headers };

  commonAxios('admin/upload-case', formData, dispatch, token, options)
    .then((res) => {
      setLoader(false);


      if (res.status === false) {
        dispatch(setAlert(res.msg, 'danger'));
        return;
      }

      dispatch({ type: 'UPLOAD_CASE_FORM_SUCCESS', payload: res.data });
      dispatch(setAlert(res.data.message, 'success'));
      if (onSuccess) onSuccess();
    })
    .catch((err) => {
      setLoader(false);
      dispatch(setAlert(err.msg, 'danger'));
    });
};



export const getAllCases = (setLoader) => (dispatch, getState) => {
  const token = getState().auth.token;
  commonAxios('admin/view-cases', {}, dispatch, token)
    .then(res => {
      if (res.status) {
        dispatch({ type: 'GET_ALL_CASES_SUCCESS', payload: res.data.totalCases });
      }
      if (setLoader) setLoader(false);
    })
    .catch(err => {
      dispatch(setAlert(err.msg || 'Something went wrong', 'danger'));
      if (setLoader) setLoader(false);
    });
};

export const getAssignedCases = (setLoader) => (dispatch, getState) => {
  const token = getState().auth.token;
  commonAxios('admin/assigned-cases', {}, dispatch, token)
    .then(res => {
      if (res.status) {
        dispatch({ type: 'GET_ASSIGNED_CASES_SUCCESS', payload: res.data.response });
      }
      if (setLoader) setLoader(false);
    })
    .catch(err => {
      dispatch(setAlert(err.msg || 'Something went wrong', 'danger'));
      if (setLoader) setLoader(false);
    });
};

export const deleteCaseById = (caseId) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;

    const res = await commonAxios('admin/delete-case', { caseId }, dispatch, token);

    if (res.status) {
      dispatch({
        type: 'DELETE_CASE_SUCCESS',
        payload: caseId,
      });
      dispatch(setAlert('Case deleted successfully', 'success'));
    }
  } catch (err) {
    dispatch(setAlert(err.msg || 'Something went wrong while deleting case', 'danger'));
  }
};


export const getSubmittedCases = (setLoader) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    const res = await commonAxios('admin/submitted-cases', {}, dispatch, token);

    if (res.status) {

      const transformedCases = res.data.submittedCases.map(caseItem => ({
        _id: caseItem.id,
        caseid: caseItem.caseId,
        user: {
          id: caseItem.User.id,
          name: caseItem.User.username,
        },
        case: {
          _id: caseItem.Case.id,
          title: caseItem.Case.title,
          pdfUrl: caseItem.Case.pdfUrl,
          fileUrl: caseItem.Case.fileUrl,

        },
        submittedAt: caseItem.updatedAt,
        fileName: caseItem.Case.file_path,
        title: caseItem.Case?.title,
        fileUrl: caseItem.Case?.fileUrl,
        pdfUrl: caseItem.Case?.pdfUrl,
        formId: caseItem.formId,
        formType: caseItem.formType,
        ...caseItem
      }));

      dispatch({
        type: 'GET_SUBMITTED_CASES_SUCCESS',
        payload: transformedCases
      });
      if (setLoader) setLoader(false);
    }
  } catch (err) {
    dispatch(setAlert(err.msg, 'danger'));
    if (setLoader) setLoader(false);
  }
};



// export const triggerEvaluation = (caseId, formId) =>  async (dispatch, getState) => {
//     try {
//        const token = getState().auth.token;
//       if (!caseId || !formId) {
//         alert("Case ID or Form ID is missing");
//         return;
//       }
//       console.log("Case ID:", caseId, "Form ID:", formId);

//       const res = await commonAxios(
//         "evaluation/trigger",
//         { caseId, formId },
//         dispatch,
//         token
//       );

//       console.log("API Response:", res);
//       alert("Check console for API response");

//     } catch (error) {
//       console.error("API Error:", error);
//       alert("API Error occurred");
//     }
//   };





// Replace your existing triggerEvaluation action with this version.
// It returns the full API response so the caller can navigate with the data.

// export const triggerEvaluation = (caseId, formId) => async (dispatch, getState) => {
//   try {
//     const token = getState().auth.token;

//     if (!caseId || !formId) {
//       return { success: false, error: "Case ID or Form ID is missing." };
//     }

//     const res = await commonAxios(
//       "evaluation/trigger",
//       { caseId, formId },
//       dispatch,
//       token
//     );
// console.log(res, "API Response in action");
//     // res is the full API response object: { success, form, result }
//     if (res && res.status === true) {
//       console.log("Evaluation successful, response:", res);
//       return res.data; // { success: true, form: {...}, result: {...} }
//     }

//     return { success: false, error: res?.msg || "Evaluation failed." };
//   } catch (error) {
//     console.error("Evaluation API Error:", error);
//     return { success: false, error: error?.msg || "An unexpected error occurred." };
//   }
// };







export const triggerEvaluation = (caseId, formId) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;

    if (!caseId || !formId) {
      return { success: false, error: "Case ID or Form ID is missing." };
    }

    const res = await commonAxios(
      "evaluation/trigger",
      { caseId, formId },
      dispatch,
      token
    );

    console.log("Full API Response:", res);

    // ✅ Your API already returns the final object
    if (res.status === true) {
      return res;   // ✅ RETURN FULL RESPONSE
    }

    return { success: false, error: res?.msg || "Evaluation failed." };
  } catch (error) {
    console.error("Evaluation API Error:", error);
    return { success: false, error: error?.message || "An unexpected error occurred." };
  }
};







// const checkApiResponse = async (dispatch, getState) => {
//   try {
//     const token = getState().auth.token;
//     const res = await commonAxios('evaluation/trigger', {}, dispatch, token);
//     console.log("API Response:", res); 
//   } catch (err) {
//     console.error("API Error:", err);
//   }
// };


// Get details of a specific submitted case
export const getSubmittedCaseDetails = (id) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    const res = await commonAxios(`cases/submitted/${id}`, {}, dispatch, token);
    if (res.status) {
      dispatch({
        type: 'GET_SUBMITTED_CASE_DETAILS_SUCCESS',
        payload: res.data
      });
    }
  } catch (err) {
    dispatch(setAlert(err.msg, 'danger'));
  }
};


export const downloadCaseFile = (caseId, fileName) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    const res = await fetch(`${baseURL}cases/${caseId}/download`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'case-file.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      return true;
    } else {
      const errorData = await res.json();
      dispatch(setAlert(errorData.msg || 'Download failed', 'danger'));
      return false;
    }
  } catch (err) {
    dispatch(setAlert('Download failed: ' + err.message, 'danger'));
    return false;
  }
};



export const downloadFormFile = (formId) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    const res = await commonAxios(
      `admin/download-form/${formId}`,
      {},
      dispatch,
      token,
      'blob'
    );

    if (res instanceof Blob) {
      const url = window.URL.createObjectURL(res);
      const a = document.createElement('a');
      a.href = url;
      a.download = `submitted-form-${formId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      return true;
    }
    dispatch(setAlert('Failed to download form', 'danger'));
    return false;
  } catch (err) {
    dispatch(setAlert(err.message || 'Error downloading form', 'danger'));
    return false;
  }
};


export const getAllTotalCases = () => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    const res = await commonAxios('admin/fetch-all-case-data', {}, dispatch, token);
    if (res.status) {
      dispatch({
        type: 'GET_TOTAL_SUBMITTED_CASES_SUCCESS',
        payload: res.data,
      });
    }
    // dispatch(setAlert(res.msg, 'success'));
  } catch (err) {
    dispatch(setAlert(err.msg, 'danger'));
  }
};
