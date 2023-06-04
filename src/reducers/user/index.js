import { S, F } from "../../utils/prefix";
import * as ActionTypes from "../../actions/user/action-types";
import UserViewStateManager from "./state-manager";

const INITIAL_STATE = {
  userData: null,
  userTags: [],
}

export default function userStates(state = INITIAL_STATE, action) {
  switch (action.type) {
    case S(ActionTypes.FETCH_USER_DETAILS):
      return UserViewStateManager.fetchUserDetailsSuccess(state, action);
    
    case S(ActionTypes.UPDATE_USER):
      return UserViewStateManager.updateUserSuccess(state, action);

    case ActionTypes.UPDATE_USER_TAGS:
      return UserViewStateManager.updateUserTags(state, action)

    case F(ActionTypes.FETCH_USER_DETAILS):
    case F(ActionTypes.UPDATE_USER):
      return {
        ...state,
        currentErrorMsg: action.error?.response?.data?.error?.message,
        currentSuccessMsg: "",
      };

    default:
      return state;
  }
}
