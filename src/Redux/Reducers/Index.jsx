import { combineReducers } from "redux";
import { AlertReducer } from "./AlertReducer";
import { AuthReducer } from "./AuthReducer";
import { CaseReducer } from "./CaseReducer";
import { userReducer } from "./userReducer";
import { FormReducer } from "./FormReducer";
import { faqReducer } from "./FaqReducer"
import {AnswerSheetReducer} from "./AnswerSheetReducer";

const appReducer = combineReducers({
  alert: AlertReducer,
  auth: AuthReducer,
  case: CaseReducer,
  users: userReducer,
  forms: FormReducer,
  faqs: faqReducer,
  answerSheets: AnswerSheetReducer,

});

const rootReducers = (state, action) => {
  if (action.type === "LOGOUT") {
    localStorage.clear();
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducers;
