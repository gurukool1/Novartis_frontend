
import { produce } from "immer";

const initialState = {
  cases: [],
  formData: {},
  assignedCases: [],
  submittedCases: [],
  loading: true,
  error: {},
  submittedCasesData: {
    totalCases: 0,
    assignedCasesCount: 0,
    unassignedCasesCount: 0
  },
};

export const CaseReducer = (state = initialState, action) => {
  switch (action.type) {

    case 'UPLOAD_CASE_FORM_SUCCESS':
      return produce(state, (draft) => {

        draft.formData = action.payload;
        draft.cases.push(action.payload);
        draft.loading = false;
      });
    case 'GET_ALL_CASES_SUCCESS':
      return produce(state, (draft) => {
        draft.cases = action.payload;
        draft.loading = false;
      });

    case 'DELETE_CASE_SUCCESS':
      return produce(state, (draft) => {
        draft.cases = draft.cases.filter((c) => c.id !== action.payload);
      })

    case 'GET_ASSIGNED_CASES_SUCCESS':
      return produce(state, (draft) => {
        draft.assignedCases = Array.isArray(action.payload) ? action.payload : [];
        draft.loading = false;
      });

    case 'GET_TOTAL_SUBMITTED_CASES_SUCCESS':
      return produce(state, (draft) => {
        draft.submittedCasesData.totalCases = action.payload.totalCases;
        draft.submittedCasesData.assignedCasesCount = action.payload.assignedCasesCount;
        draft.submittedCasesData.unassignedCasesCount = action.payload.unassignedCasesCount;
        draft.loading = false;
      });


    case 'DOWNLOAD_FORM_SUCCESS':
      return produce(state, (draft) => {
        draft.loading = false;
      });

    case 'GET_SUBMITTED_CASES_SUCCESS':
      return produce(state, (draft) => {
        draft.submittedCases = action.payload.map(caseItem => ({
          ...caseItem,
          fileUrl: caseItem.fileUrl
        }));
      });
    default:
      return { ...state };
  }
};
