import { S, F } from "../../utils/prefix";
import * as ActionTypes from "../../actions/collection/action-types";
import CollectionStateManager from "./state-manager";
import session from "../../utils/session";

const INITIAL_STATE = {
    importData: [],
    collectionData: [],
    searchCollectionData:[],
    // collectionData: typeof session.collectionData === "string" || session.collectionData.length !== 0 ? JSON.parse(session.collectionData) : [],
    addedCollectionData: null,
    expandedKeys: [],
    savedSelectedCollection: {id:Number(session.unfiltered_collection_id),name:"Unfiltered"}
};

export default function collectionStates(state = INITIAL_STATE, action) {
    switch (action.type) {
        case S(ActionTypes.FETCH_COLLECTION):
            return CollectionStateManager.fetchCollectionListSuccess(state, action);
        case S(ActionTypes.SEARCH_DATA):
            return CollectionStateManager.fetchSearchCollectionListSuccess(state, action);
        case S(ActionTypes.IMPORTCOL):
            return CollectionStateManager.importData(state, action);
        case S(ActionTypes.ADD_COLLECTION):
            return CollectionStateManager.addCollectionSuccess(state, action);
        case ActionTypes.ADD_COLLECTION_RESET:
            return CollectionStateManager.addCollectionReset(state, action);
        case S(ActionTypes.GET_COLLECTION_BY_ID):
            return CollectionStateManager.getCollectionSuccess(state, action)
        case ActionTypes.RESET_COLLECTION_DATA:
            return { ...state, collectionData: [] }
        case ActionTypes.SAVE_SELECTED_COLLECTION:
            return { ...state, savedSelectedCollection: action.data }
        case F(ActionTypes.FETCH_COLLECTION):
        case F(ActionTypes.ADD_COLLECTION):
        case F(ActionTypes.GET_COLLECTION_BY_ID):
        default:
            return state;
    }
}