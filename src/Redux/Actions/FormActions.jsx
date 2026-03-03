import { setAlert } from "./AlertActions";
import { commonAxios } from "../../Global/CommonAxios";
import { pdf } from '@react-pdf/renderer';
import { Provider } from 'react-redux';
import store from '../../Redux/Store';
export const setSectionTotal = (section, value) => ({
  type: "SET_SECTION_TOTAL",
  payload: { section, value: Number(value) || 0 },
});
export const setSectionData = (section, answers) => ({
  type: "SET_SECTION_DATA",
  payload: { section, answers },
});
export const setFormId = (formId) => ({
  type: "SET_FORM_ID",
  payload: formId || null,
});

export const resetSectionTotals = () => ({
  type: "RESET_SECTION_TOTALS",
});
export const setVisitPercent = (formKey, visit, percent, initialPercent, followUpPercent) => ({
  type: "SET_FORM_PERCENT",
  payload: {
    formKey,
    visit,
    percent: Number(percent),
  }
});

export const resetVisitPercent = () => ({
  type: "RESET_VISIT_PERCENT",
});
export const setCombinedPercent = (initialPercent, followUpPercent) => ({
  type: "SET_COMBINED_PERCENT",
  payload: { combinedPercent: initialPercent + followUpPercent },
});

export const pushSectionTotal = (section, value) => (dispatch) => {
  dispatch(setSectionTotal(section, value));
};

export const pushSectionData = (section, answers) => (dispatch) => {
  const submittedanswers =
    answers && typeof answers === "object" ? answers : {};
  dispatch(setSectionData(section, submittedanswers));
};
const getForms = (state) => state.forms || {};
const getTotals = (state) => getForms(state).totals || {};
const getData = (state) => getForms(state).data || {};

export const selectSectionTotal = (section) => (state) =>
  Number(getTotals(state)[section] ?? 0);
export const selectSectionData = (section) => (state) =>
  getData(state)[section] || {};

// Selectors for Percentages

export const selectDamageTotal =
  (visit = "initial") =>
    (state) =>
      Number(getTotals(state)[`CDASI_Damage_${visit}`] ?? 0);

export const selectGrandTotal =
  (visit = "initial") =>
    (state) => {
      const totals = getTotals(state);
      return Object.entries(totals)
        .filter(([k]) => k.endsWith(`_${visit}`) && !/damage/i.test(k))
        .reduce((sum, [, v]) => sum + Number(v || 0), 0);
    };
export const submitForm = (payload, token) => async (dispatch) => {
  try {
    const res = await commonAxios("user/submit-form", payload, null, token);
    if (res?.data?.form?.id) {
      dispatch(setFormId(res.data.form.id));
    }
    return { success: true, formId: res?.data?.id };
  } catch (err) {
    return { success: false, error: err.msg || "Something went wrong" };
  }
};

export const editForm = (payload, token) => async (dispatch) => {
  try {
    await commonAxios("user/edit-form", payload, null, token);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.msg || "Could not update the case" };
  }
};

export const loadForm = (payload, token, { mirrorToLocalStorage = true } = {}) => async (dispatch) => {
  try {
    const res = await commonAxios("view-form", payload, null, token);
    if (res?.data) {
      // Keep existing data processing logic
      const form = res.data.form;
   console.log("Fetched form datakkkk:", form, "Form ID: lOAD", form.id);
      const caseId = form.caseId;
      //const formId = form.id;
// console.log("Fetched form data:", form, "Case ID:lOAD", caseId, "Form ID: lOAD", formId);
//        dispatch({
//         type: "SET_FORM_IDD",
//         payload: formId,
//       });
      dispatch({
        type: "SET_CASE_ID",
        payload: caseId,
      });
      Object.keys(form).forEach(key => {
        // Skip non-form data
        if (key === 'userId' || key === 'caseId' || key === 'createdAt' || !form[key]) {
          return;
        }
      //   if (form?.id != null) {
      //   dispatch(setFormId(form.id));
      // }
        // Check if it's a form section (contains _initial or _followUp)
        if (key.includes('_initial') || key.includes('_followUp')) {

          // Dispatch form data
          dispatch({
            type: "SET_SECTION_DATA",
            payload: {
              section: key,
              answers: form[key]
            }
          });

          // Handle form scores/totals
          // if (form[key]?.total || form[key]?.activity) {
          //   dispatch({
          //     type: "SET_SECTION_TOTAL",
          //     payload: {
          //       section: key,
          //       value: form[key].total || form[key].activity
          //     }
          //   });
          // }
        }

        // Handle special form scores
        if (key === 'form_Score_initial') {
          dispatch(setSectionTotal("initial", form[key].activity));
          dispatch(setSectionTotal("CDASI_Damage_initial", form[key].damage));
        }
        if (key === 'form_Score_followUp') {
          dispatch(setSectionTotal("followUp", form[key].activity));
          dispatch(setSectionTotal("CDASI_Damage_followUp", form[key].damage));
        }
        
      });

      // dispatch(setSectionData("form", form));
    }
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, error: err.msg || "Could not load case" };
  }
};



export const fetchFormForPDF = (caseId, formId, userCaseId) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;

    const res = await commonAxios(
      "view-form",
      { caseId, formId, userCaseId },
      dispatch,
      token
    );

    if (res.status) {
      const form = res.data.form;

      return {
        investigatorName: form.investigatorName,
        caseId: form.caseId,
        id: form.id,
        userCaseId: form.userCaseId,
        createdAt: form.createdAt,
        updatedAt: form.updatedAt,
        initial: {
          MMT_8: form.MMT_8_initial,
          CDASI_Activity: form.CDASI_Activity_initial,
          CDASI_Damage: form.CDASI_Damage_initial,
          Gottron_Hands: form.Gottron_Hands_initial,
          Periungual: form.Periungual_initial,
          Alopecia: form.Alopecia_initial,
          MDAAT: form.MDAAT_initial,
          Physician: form.Physician_initial,
          form_Score: form.form_Score_initial,

        },
        followUp: {
          MMT_8: form.MMT_8_followUp,
          CDASI_Activity: form.CDASI_Activity_followUp,
          CDASI_Damage: form.CDASI_Damage_followUp,
          Gottron_Hands: form.Gottron_Hands_followUp,
          Periungual: form.Periungual_followUp,
          Alopecia: form.Alopecia_followUp,
          MDAAT: form.MDAAT_followUp,
          Physician: form.Physician_followUp,
          form_Score: form.form_Score_followUp
        }
      };
    }
    return null;
  } catch (err) {
    dispatch(setAlert(err.msg, 'danger'));
    return null;
  }
};



export const generateScoringSheetPDF = (formData, selectedForms, submittedByName, submittedAt) => async () => {
  try {

    const FormPdfRenderer = (await import('../../CommonComponents/FormPdf')).default;

    const blob = await pdf(
      <Provider store={store}>
        <FormPdfRenderer formData={formData} selectedForm={selectedForms} />
      </Provider>
    ).toBlob();


    const formatDateForFilename = (dateString) => {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}_${date
          .getHours()
          .toString()
          .padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}`;
    };

    const safeUsername = submittedByName.replace(/[^a-zA-Z0-9]/g, '_');
    const timestamp = formatDateForFilename(submittedAt);
    const fileName = `${safeUsername}_${timestamp}_ScoringSheet.pdf`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('PDF generation failed:', error);
    return false;
  }
};