import { commonAxios } from "../../Global/CommonAxios";
//import { setAlert } from './alertActions';
import { setAlert } from "./AlertActions";
import { baseURL } from "../../Global/Global"
export const getUsers = (setLoader) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;

    const res = await commonAxios('admin/view-users', {}, dispatch, token);
    if (res.status) {
      dispatch({
        type: 'GET_USERS_SUCCESS',
        payload: res.data.totalUsers
      });
      if (setLoader) setLoader(false);
    } else {
      dispatch(setAlert(res.msg, 'danger'));
    }
  } catch (err) {
    dispatch(setAlert(err.msg, 'danger'));
    if (setLoader) setLoader(false);
  }
};

// New action to fetch dashboard data
export const getDashboardData = (setLoader) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;

    const res = await commonAxios('admin/admin-dashboard', {}, dispatch, token);

    if (res.status) {
      dispatch({
        type: 'GET_DASHBOARD_DATA_SUCCESS',
        payload: res.data.dashboardData
      });
      if (setLoader) setLoader(false);
    } else {
      dispatch(setAlert(res.msg || 'Something went wrong', 'danger'));
      if (setLoader) setLoader(false);
    }
  } catch (err) {
    dispatch(setAlert(err.msg || 'Something went wrong', 'danger'));
    if (setLoader) setLoader(false);
  }
};

export const assignCaseToUser = (caseId, userId) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    const payload = { caseId, userId };

    const res = await commonAxios('admin/assign-case', payload, dispatch, token);

    if (res?.status) {
      dispatch(setAlert('Case assigned successfully', 'success'));
      dispatch(getAssignedUsers(caseId));
      return { status: true };
    } else {
      dispatch(setAlert(res?.message || 'User already assigned', 'danger'));
      return { status: false, message: res?.message };
    }
  } catch (err) {
    dispatch(setAlert(err.message || 'Error assigning case', 'danger'));
    return { status: false, message: err.message };
  }
};




export const unassignCaseFromUser = ({ userCaseId }) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;

    const payload = { userCaseId };

    const res = await commonAxios('admin/unassign-case', payload, dispatch, token);

    if (res.status) {
      dispatch({
        type: 'UNASSIGN_CASE_SUCCESS',
        // payload: { userId: parseInt(userId), caseId: parseInt(caseId), formType: payload.formType }
        payload: { userCaseId }
      });
      dispatch(setAlert(res.data.message, 'success'));
      return true;
    } else {
      dispatch(setAlert(res.data.message, 'danger'));
      return false;
    }
  } catch (err) {
    dispatch(setAlert(err.message, 'warning'));
    return false;
  }
};


// export const unassignCaseFromUser = ({ userId, caseId }) => async (dispatch, getState) => {
//   try {
//     const token = getState().auth.token;
//     const res = await commonAxios('admin/unassign-case', { userId, caseId }, dispatch, token);

//     if (res.status) {
//       dispatch({
//         type: 'UNASSIGN_CASE_SUCCESS',
//         payload: { userId: parseInt(userId), caseId: parseInt(caseId) }
//       });
//       dispatch(setAlert('User successfully unassigned', 'success'));
//       return true;
//     } else {
//       dispatch(setAlert(res.data.message, 'danger'));
//       return false;
//     }
//   } catch (err) {
//     dispatch(setAlert(err.message, 'danger'));
//     return false;
//   }
// };

export const getAssignedUsers = (caseId, userIds, setLoader) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    const payload = {
      userIds,
      caseId,
    }
    const res = await commonAxios("admin/get-assigned-users", payload, dispatch, token);

    if (res.status) {
      dispatch({
        type: 'GET_ASSIGNED_USERS_SUCCESS',
        payload: res.data.response
      });
    } else {
      dispatch(setAlert(res.msg || 'Failed to fetch assigned users', 'danger'));
    }
  } catch (err) {
    dispatch(setAlert(err.message || 'Error fetching assigned users', 'danger'));
  } finally {
    if (setLoader) setLoader(false);
  }
};




export const updateUserStatus = (userId, status) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    const res = await commonAxios(
      'admin/is-active',
      { userId, status },
      dispatch,
      token
    );

    if (res.status) {
      dispatch({
        type: 'UPDATE_USER_STATUS_SUCCESS',
        payload: { userId, status }
      });
      dispatch(setAlert(`User ${status === 'active' ? 'activated' : 'deactivated'}`, 'success'));
    } else {
      dispatch(setAlert(res.msg, 'danger'));
    }
  } catch (err) {
    dispatch(setAlert(err.msg, 'danger'));
  }
};

export const deleteUser = (userId, setLoader) => async (dispatch, getState) => {
  try {
    setLoader(true);
    const token = getState().auth.token;
    const res = await commonAxios('admin/delete-account', { userId }, dispatch, token);

    if (res.status) {
      dispatch({
        type: 'DELETE_USER_SUCCESS',
        payload: userId
      });
      dispatch(getUsers());
      dispatch(setAlert('User deleted', 'success'));
    } else {
      dispatch(setAlert(res.msg, 'danger'));
    }
  } catch (err) {
    dispatch(setAlert(err.msg || 'Error occurred', 'danger'));
  } finally {
    setLoader(false);
  }
};


export const permanentDeleteUser = (userId, setLoader) => async (dispatch, getState) => {
  try {
    setLoader(true);
    const token = getState().auth.token;
    const res = await commonAxios('admin/delete-user', { userId }, dispatch, token);

    if (res.status) {
      dispatch({
        type: 'PERMANENT_DELETE_USER_SUCCESS',
        payload: userId
      });
      dispatch(setAlert('User permanently deleted', 'success'));
    } else {
      dispatch(setAlert(res.msg, 'danger'));
    }
  } catch (err) {
    dispatch(setAlert(err.msg || 'Error occurred', 'danger'));
  } finally {
    setLoader(false);
  }
};

export const getAssignedCases = () => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    const res = await commonAxios('user/assigned-cases', {}, dispatch, token);
    const rows = res.data.data;
    const formReferences = res.data.assignCaseForm;



//    const rows = res.data.data.data; // <-- FIXED
//     const formReferences = res.data.data.assignCaseForm; // <-- FIXED

//     const assignedCases = rows.map(r => {
//       const matchedForm = formReferences.find(
//         f => f.userCaseId === r.id
//       );

// return {
//         ...r,
//         formId: matchedForm ? matchedForm.formId : null,
//         fileUrl: r.Case?.fileUrl,
//         pdfUrl: r.Case?.pdfUrl,
//         title: r.Case?.title,
//         formType: r.formType || { AllForms: true },
//       };
//     });
    const assignedCases = rows.map(r => ({
      ...r,
      formId: (formReferences.find(f => f.userCaseId === r.id) || {}).formId || null,
      fileUrl: r.Case?.fileUrl,
      pdfUrl: r.Case?.pdfUrl,
      title: r.Case?.title,
      // Keep formType as it comes from backend (object format)
      formType: r.formType || { AllForms: true },
    }));
 //console.log("Assigned Cases after mapping:", assignedCases);
    if (res.status) {
      dispatch({
        type: 'GET_ASSIGNED_CASES_SUCCESS_USER',
        payload: assignedCases
      });
    } else if (res?.message) {
      dispatch(setAlert(res.message, 'danger'));
    }

  } catch (err) {
    // dispatch(setAlert(err.message || 'Unknown error occurred', 'danger'));
  }
};




//ForUsrs:


// export const getAssignedCases = () => async (dispatch, getState) => {
//   try {
//     const token = getState().auth.token;
//     const res = await commonAxios('user/assigned-cases', {}, dispatch, token);
//     const rows = res.data.data;
//     const formReferences = res.data.assignCaseForm;

//     const assignedCases = rows.map(r => ({
//       ...r,
//       formId: (formReferences.find(f => f.caseId === r.caseId) || {}).formId || null,
//       fileUrl: r.Case?.fileUrl,
//       formType: r.formType || "all",
//     }));

//     if (res.status) {
//       dispatch({
//         type: 'GET_ASSIGNED_CASES_SUCCESS_USER',
//         payload: assignedCases
//       });
//     } else if (res?.message) {
//       dispatch(setAlert(res.message, 'danger'));
//     }

//   } catch (err) {
//     // dispatch(setAlert(err.message || 'Unknown error occurred', 'danger'));
//   }
// };



// Add this new action
export const editUserDetails = (payload, callback) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;

    // Only send password fields if they have values
    const requestPayload = { ...payload };
    if (!requestPayload.newPassword) {
      delete requestPayload.newPassword;
      delete requestPayload.confirmPassword;
    }

    const res = await commonAxios(
      'admin/edit-user-details',
      requestPayload,
      dispatch,
      token
    );
    if (res.status) {
      dispatch({
        type: 'EDIT_USER_DETAILS_SUCCESS',
        payload: {
          userId: payload.userId,
          updatedProfile: res.data.updatedProfile
        }
      });
      dispatch(setAlert('Profile updated successfully', 'success'));
      if (callback) callback();
    } else {
      dispatch(setAlert(res.msg || 'Failed to update user', 'danger'));
    }
  } catch (err) {
    dispatch(setAlert(err.message || 'Error updating user', 'danger'));
  }
};

// userActions.js
export const getAssignedUsersByCaseId = (caseId, setLoader) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    const body = { caseId };
    const res = await commonAxios("admin/filter-by-case-id", body, dispatch, token);

    if (res.status) {
      dispatch({
        type: 'GET_ASSIGNED_USERS_BY_CASE_SUCCESS',
        payload: {
          caseId,
          assignedUsers: res.data.response
        }
      });
      if (setLoader) setLoader(false);
    } else {
      dispatch(setAlert(res.msg || 'Failed to fetch assigned users', 'danger'));
    }
  } catch (err) {
    dispatch(setAlert(err.message || 'Error fetching assigned users', 'danger'));
    if (setLoader) setLoader(false);
  }
};


// export const assignCaseToMultipleUsers = (caseId, payload) => async (dispatch, getState) => {
//   try {
//     const token = getState().auth.token;
//     const res = await commonAxios.post(`cases/${caseId}/assign-multiple`, payload, dispatch, token);

//     if (res.status) {
//       dispatch(setAlert('Case assigned successfully!', 'success'));
//     }
//     return res;
//   } catch (err) {
//     dispatch(setAlert(err.message, 'danger'));
//   }
// };






// export const assignCaseToMultipleUsers = (caseId, userIds, formType) => async (dispatch, getState) => {
//   try {
//     const token = getState().auth.token;
//     const payload = { caseId, userIds, formType };

//     const res = await commonAxios(
//       'admin/assign-case-to-multiple-users',
//       payload,
//       dispatch,
//       token
//     );

//     if (res?.status) {
//       const { assignedCases = [], skippedUsers = [], errors = [], message } = res.data || {};


//       const allSkippedAlreadyAssigned =
//         assignedCases.length === 0 &&
//         skippedUsers.length > 0 &&
//         skippedUsers.every(user => user.reason === 'Case already assigned') &&
//         errors.length === 0;

//       // Build alert message based on result
//       if (assignedCases.length > 0 && skippedUsers.length === 0 && errors.length === 0) {
//         dispatch(setAlert('Case assigned to users successfully.', 'success'));
//       }
//       else if (assignedCases.length === 0 && (skippedUsers.length === 0)) {
//         dispatch(setAlert('Please select any user', 'warning'));
//       }

//       else if (allSkippedAlreadyAssigned) {
//         dispatch(setAlert('Selected users already have this case assigned.', 'warning'));
//       }
//       else {
//         // Fallback case if none of the above match
//         dispatch(setAlert(message || 'Case assignment completed.', 'info'));
//       }

//       dispatch(getAssignedUsers(caseId));
//       return { status: true, data: res.data };
//     } else {
//       dispatch(setAlert(res?.message || 'Case assignment failed.', 'danger'));
//       return { status: false, message: res?.message };
//     }

//   } catch (err) {
//     dispatch(setAlert(err.message || 'Error assigning case.', 'danger'));
//     return { status: false, message: err.message };
//   }
// };







export const assignCaseToMultipleUsers = (caseId, userIds, formType) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;

    // const formTypesObject = {};
    // formType.forEach((type, index) => {
    //   formTypesObject[index + 1] = type;
    // });


    const formTypesObject = formType.reduce((acc, type, index) => {
      acc[String(index + 1)] = type;
      return acc;
    }, {});

    const payload = {
      caseId,
      userIds,
      formType: formTypesObject
    };

    const res = await commonAxios(
      'admin/assign-case-to-multiple-users',
      payload,
      dispatch,
      token
    );

    if (res?.status) {
      const { assignedCases = [], skippedUsers = [], errors = [], message } = res.data || {};

      const allSkippedAlreadyAssigned =
        assignedCases.length === 0 &&
        skippedUsers.length > 0 &&
        skippedUsers.every(user => user.reason === 'Case already assigned') &&
        errors.length === 0;

      // Build alert message based on result
      if (assignedCases.length > 0 && skippedUsers.length === 0 && errors.length === 0) {
        dispatch(setAlert('Case assigned to users successfully.', 'success'));
      }
      else if (assignedCases.length === 0 && (skippedUsers.length === 0)) {
        dispatch(setAlert('Please select any user', 'warning'));
      }
      else if (allSkippedAlreadyAssigned) {
        dispatch(setAlert('Selected users already have this case assigned.', 'warning'));
      }
      else {
        // Fallback case if none of the above match
        dispatch(setAlert(message || 'Case assignment completed.', 'info'));
      }

      dispatch(getAssignedUsers(caseId));
      return { status: true, data: res.data };
    } else {
      dispatch(setAlert(res?.message || 'Case assignment failed.', 'danger'));
      return { status: false, message: res?.message };
    }

  } catch (err) {
    dispatch(setAlert(err.message || 'Error assigning case.', 'danger'));
    return { status: false, message: err.message };
  }
};
