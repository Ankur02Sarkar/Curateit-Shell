import { S, F } from "../../utils/prefix";
import * as ActionTypes from "../../actions/tags/action-types";
import TagStateManager from "./state-manager";

const INITIAL_STATE = {
    tagList: [],
    addedTagData: null
};

export default function tagStates(state = INITIAL_STATE, action) {
    switch (action.type) {
        case S(ActionTypes.ADD_TAG):
            return TagStateManager.addTagSuccess(state, action);
        case ActionTypes.ADD_TAG_RESET:
            return TagStateManager.addTagReset(state, action);

        case F(ActionTypes.ADD_TAG):
            return TagStateManager.addTagSuccess(state, action)
       
        default:
            return state;
    }
}