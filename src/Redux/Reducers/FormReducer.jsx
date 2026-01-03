import { produce } from "immer";

const initialState = {
  totals: {},
  data: {},
  formPercents: { initial: {}, followUp: {} },
  caseFileUrl: null,
  initialPercent: 0,
  followUpPercent: 0,
  combinedPercent: 0,
  formId: null
};

export const FormReducer = (state = initialState, action) => {
  const { type, payload } = action;

  return produce(state, (draft) => {
    switch (type) {
      case "SET_SECTION_TOTAL": {
        const { section, value } = payload;
        draft.totals[section] = value ?? 0;
        break;
      }

      case "SET_SECTION_DATA": {
        const { section, answers } = payload;
        draft.data[section] = answers;
        break;
      }
      case "SET_FORM_ID": {
        draft.formId = payload;
        break;
      }
      case "SET_FORM_PERCENT": {
        const { visit, percent, formKey } = payload;

        if (!draft.formPercents) {
          draft.formPercents = { initial: {}, followUp: {} };
        }
        if (!draft.formPercents[visit]) {
          draft.formPercents[visit] = {};
        }
        draft.formPercents[visit][formKey] = Number(percent) || 0;

        // Calculate sums by adding up all percent values
        const initialSum = Object.values(draft.formPercents.initial)
          .reduce((sum, val) => sum + (Number(val) || 0), 0);

        const followUpSum = Object.values(draft.formPercents.followUp)
          .reduce((sum, val) => sum + (Number(val) || 0), 0);

        // Store the calculated sums
        draft.initialPercent = Math.round(initialSum * 100) / 100;
        draft.followUpPercent = Math.round(followUpSum * 100) / 100;
        // draft.combinedPercent = Math.round((initialSum + followUpSum) * 100) / 100;
        break;
      }

      case 'SET_CASE_FILE_URL':
        draft.caseFileUrl = action.payload;
        break;


      case "RESET_SECTION_TOTALS":
        return initialState;

      default:
        break;
    }
  });
};


