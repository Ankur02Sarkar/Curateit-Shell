import * as ActionTypes from "./action-types";

export const addTag = (data) => ({
    type: ActionTypes.ADD_TAG,
    payload: {
      request: {
        url: `/api/tags`,
        method: "post",
        data
      }
    }
  });

export const addTagReset = () => {
    return{
    type: ActionTypes.ADD_TAG_RESET
  }};