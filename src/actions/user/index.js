import session from "../../utils/session";
import * as ActionTypes from "./action-types";

export const fetchUserDetails = () => ({
  type: ActionTypes.FETCH_USER_DETAILS,
  payload: {
    request: {
      url: `/api/users/me?populate=tags`,
      method: "get"
    }
  }
});

export const updateUserTags = (tags) => ({
  type: ActionTypes.UPDATE_USER_TAGS,
  tags
}) 

export const updateUser = (data) => ({
  type: ActionTypes.UPDATE_USER,
  payload: {
    request: {
      url: `/api/users/${session.userId}`,
      method: "put",
      data
    }
  }
})