import { produce } from "immer";

const initialState = {
  answerSheets: {}, // { [caseId]: answerSheetData }
  allAnswerSheets: [],
   answerSheetId: null,
  loading: false,
  error: null
};

export const AnswerSheetReducer = (state = initialState, action) => {
  return produce(state, draft => {
    switch (action.type) {
      case 'SUBMIT_ANSWER_SHEET_SUCCESS':
      case 'UPLOAD_ANSWER_SHEET_SUCCESS':
        draft.answerSheets[action.payload.caseId] = action.payload;
        draft.loading = false;
        draft.error = null;
        break;

      case 'GET_ANSWER_SHEET_SUCCESS':
        draft.answerSheets[action.payload.caseId] = action.payload.answerSheet;
        draft.loading = false;
        draft.error = null;
        break;
      case 'SET_ANSWER_SHEET_ID':   // NEW
        draft.answerSheetId = action.payload;
        break;

      case 'GET_ALL_ANSWER_SHEETS_SUCCESS':
        draft.allAnswerSheets = action.payload;
        // Also populate the answerSheets object for quick lookup
        action.payload.forEach(sheet => {
          draft.answerSheets[sheet.caseId] = sheet;
        });
        draft.loading = false;
        draft.error = null;
        break;

    case 'DELETE_ANSWER_SHEET_SUCCESS':
        delete draft.answerSheets[action.payload.caseId]; 
        if (draft.answerSheetId && draft.answerSheetId === action.payload.caseId) {
          draft.answerSheetId = null; 
        }
        draft.loading = false;
        draft.error = null;
        break;

      case 'ANSWER_SHEET_LOADING':
        draft.loading = true;
        draft.error = null;
        break;

      case 'ANSWER_SHEET_ERROR':
        draft.loading = false;
        draft.error = action.payload;
        break;

      case 'CLEAR_ANSWER_SHEETS':
        return initialState;

      default:
        break;
    }
  });
};