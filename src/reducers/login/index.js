import { S, F } from "../../utils/prefix";
import * as ActionTypes from "../../actions/login/action-types";
import LoginViewStateManager from "./state-manager";

const INITIAL_STATE = {
  loginData: [],
  signupData: [],
  emailVerificationData: null,
  forgotData: [],
  currentErrorMsg: "",
  currentSuccessMsg: "",
};

export default function loginStates(state = INITIAL_STATE, action) {
  switch (action.type) {
    case S(ActionTypes.FETCH_LOGIN):
    case ActionTypes.SET_SOCIAL_LOGIN:
      return LoginViewStateManager.loginSuccess(state, action);
    case S(ActionTypes.SIGNUP):
      return LoginViewStateManager.signupSuccess(state, action);
    case S(ActionTypes.EMAIL_VERIFICATION):
      return LoginViewStateManager.emailVerificationSuccess(state, action);
    case S(ActionTypes.FORGOT):
      return LoginViewStateManager.forgotSuccess(state, action);
    case ActionTypes.SUCCESS_MSG:
      return {
        ...state,
        currentSuccessMsg: action.payload?.data?.data,
        currentErrorMsg: "",
      };

    case F(ActionTypes.FETCH_LOGIN):
      return {
        ...state,
        currentErrorMsg: action.error?.response?.data?.error?.message,
        currentSuccessMsg: "",
      };

    case F(ActionTypes.SIGNUP):
      return {
        ...state,
        currentErrorMsg: action.error?.response?.data?.error?.message,
        currentSuccessMsg: "",
      };
    default:
      return state;
  }
}
